require('dotenv').config();
const { MongoClient } = require('mongodb');
const uri = process.env.MONGO_URI;
const dbNameText = 'ExperienceContents';
const sharp = require('sharp');
const jwt = require('jsonwebtoken')

const cookieParser = require('cookie-parser')
const express = require('express')
const app = express()
app.use(cookieParser())

const AWS = require('aws-sdk');
AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
const s3 = new AWS.S3();

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

/** POST /save/experience */
exports.experienceSave = async (req, res) => {
    const { title, englishTitle, content } = req.body;
    const client = new MongoClient(uri);

    // 1) 한글 제목 검증
    if (!title || !title.trim()) {
        return res.status(400).json({ error: '제목을 입력해주세요.' });
    }

    // 2) 영어 제목 검증
    if (!englishTitle || !englishTitle.trim()) {
        return res.status(400).json({ error: '제목을 입력해주세요.' });
    }

    try {
        await client.connect();
        const db = client.db(dbNameText);
        const counters = db.collection('counters');
        const posts    = db.collection(dbNameText);

        // 3) 시퀀스만 +1 (upsert)
        await counters.updateOne(
            { _id: 'postid' },
            { $inc: { sequence_value: 1 } },
            { upsert: true }
        );

        // 4) 증가된 시퀀스를 확실히 조회
        const seqDoc = await counters.findOne({ _id: 'postid' });
        if (!seqDoc || typeof seqDoc.sequence_value !== 'number') {
            throw new Error('시퀀스 조회에 실패했습니다.');
        }
        const postId = seqDoc.sequence_value;

        // 5) 실제 저장할 문서 준비
        const now = new Date();
        const doc = {
            id: postId,
            title,
            englishTitle,
            content,
            created_at: now,
            updated_at: now,
            is_deleted: 0
        };

        // 6) 게시물 삽입
        const result = await posts.insertOne(doc);

        // 7) 응답
        res.status(200).json({ message: 'saved', postId });
    } catch (e) {
        console.error('experienceSave error:', e);
        res.status(500).json({ error: e.message });
    } finally {
        await client.close();
    }
};



/** GET /list/experience */
exports.experienceList = async (req, res) => {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db(dbNameText);
        const collection = db.collection(dbNameText);

        // 1) is_deleted가 0인(삭제되지 않은) 문서만 조회
        // 2) created_at 기준 내림차순 정렬
        const docs = await collection
            .find({ is_deleted: 0 })
            .sort({ created_at: -1 })
            .toArray();

        // 3) 조회 결과 반환
        res.status(200).json({ items: docs });
    } catch (e) {
        console.error('experienceList error:', e);
        res.status(500).json({ error: e.message });
    } finally {
        await client.close();
    }
};


/**
 * GET /save/experience-detail
 */
exports.experienceDetail = async (req, res) => {
    const client = new MongoClient(uri)
    const id = parseInt(req.params.id, 10)

    try {
        await client.connect()
        const db = client.db(dbNameText)
        const collection = db.collection(dbNameText)

        // is_deleted: 0인 정상 문서만 조회
        const item = await collection.findOne({ id, is_deleted: 0 })
        if (!item) {
            return res.status(404).json({ error: '게시물을 찾을 수 없습니다.' })
        }
        res.status(200).json({ item })
    } catch (e) {
        console.error('experienceDetail error:', e)
        res.status(500).json({ error: e.message })
    } finally {
        await client.close()
    }
}

/**
 * POST /save/experience-image
 * (S3 업로드)
 */
exports.uploadExperienceImage = [
    upload.single('file'),
    async (req, res) => {
        console.log('uploadExperienceImage 실행');
        if (!req.file) {
            return res.status(400).json({ error: '파일이 업로드되지 않았습니다.' });
        }
        const { originalname, mimetype, buffer } = req.file;
        const key = `experience-images/${Date.now()}-${originalname}`;

        try {
            // 1) 가로 700px, 세로는 비율 유지
            const resizedBuffer = await sharp(buffer)
                .resize({ width: 700 })
                .toBuffer();

            // 2) S3에 업로드
            const key = `experience-images/${Date.now()}-${originalname}`;
            await s3.putObject({
                Bucket: process.env.S3_BUCKET,
                Key: key,
                Body: resizedBuffer,             // 원본 buffer 대신 리사이즈된 버퍼 사용
                ContentType: mimetype
            }).promise();


            const url = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
            res.json({ url, key });
        } catch (err) {
            console.error('S3 업로드 실패:', err);
            res.status(500).json({ error: err.message });
        }
    }
];

/**
 * GET /save/experience-image/:id
 */
exports.getExperienceImage = async (req, res) => {
    const key = req.params.id;
    try {
        const data = await s3.getObject({
            Bucket: process.env.S3_BUCKET,
            Key: key
        }).promise();

        res.set('Content-Type', data.ContentType || 'application/octet-stream');
        res.send(data.Body);
    } catch (err) {
        console.error('S3 getObject 오류:', err);
        if (err.code === 'NoSuchKey') {
            return res.status(404).send('이미지를 찾을 수 없습니다.');
        }
        res.status(500).json({ error: err.message });
    }
};

exports.deleteExperience = async (req, res) => {
    // 1) JWT 토큰 꺼내기
    const token = req.cookies.login_token
    console.log("token: ",token)
    if (!token) {
        return res.status(401).json({ message: '로그인이 필요합니다.' })
    }

    // 2) 토큰 검증
    let payload
    try {
        payload = jwt.verify(token, process.env.JWT_SECRET)
    } catch (e) {
        return res.status(401).json({ message: '유효하지 않은 토큰입니다.' })
    }

    // 3) 권한 확인 (여기선 관리자만 삭제 가능)
    if (payload.role !== 'admin') {
        return res.status(403).json({ message: '삭제 권한이 없습니다.' })
    }

    // 4) delete 로직
    const client = new MongoClient(uri)
    const postId = parseInt(req.body.postId, 10)

    try {
        await client.connect()
        const db = client.db(dbNameText)
        const posts = db.collection(dbNameText)


        const result = await posts.updateOne(
            { id: postId },            // 숫자 id로 조회
            { $set: { is_deleted: 1 } } // 1로 변경해 soft delete
        )

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: '해당 게시글을 찾을 수 없습니다.' })
        }
        res.json({ message: '삭제 처리 완료', modifiedCount: result.modifiedCount })

    } catch (err) {
        console.error('삭제 중 오류 발생:', err)
        res.status(500).json({ message: '서버 오류', error: err.message })
    } finally {
        await client.close()
    }
}