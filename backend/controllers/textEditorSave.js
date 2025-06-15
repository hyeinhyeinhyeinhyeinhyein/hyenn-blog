require('dotenv').config();
const { MongoClient } = require('mongodb');
const uri = process.env.MONGO_URI;
const dbNameText = 'ExperienceContents';

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
    const { content } = req.body;
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db(dbNameText);
        const collection = db.collection(dbNameText);
        await collection.insertOne({ content, createdAt: new Date() });
        res.status(200).json({ message: 'saved' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    } finally {
        client.close();
    }
};

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
            await s3.putObject({
                Bucket: process.env.S3_BUCKET,
                Key: key,
                Body: buffer,
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
