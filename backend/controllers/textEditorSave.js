// controllers/experienceController.js
const { MongoClient } = require('mongodb')
const uri = process.env.MONGO_URI
const dbNameText = 'ExperienceContents'
const dbNameImg = 'ExperienceImages'
const multer = require('multer')

exports.experienceSave = async (req, res) => {
    const { content } = req.body
    const client = new MongoClient(uri)
    console.log(content)

    try {
        await client.connect()
        const db = client.db(dbNameText)
        const collection = db.collection(dbNameText)
        await collection.insertOne({ content, createdAt: new Date() })
        res.status(200).json({ message: 'saved' })
    } catch (e) {
        res.status(500).json({ error: e.message })
    } finally {
        client.close()
    }
}


// 메모리 저장소 설정
const storage = multer.memoryStorage()
const upload = multer({ storage })

// 미들웨어 export (라우터에서 써야 함)
exports.uploadMiddleware = upload.single('file')

exports.experienceImgSave=async (req, res) => {
    const client = new MongoClient(uri)
    const file = req.file

    if (!file) {
        return res.status(400).json({ error: '이미지 파일이 필요합니다.' })
    }

    try {
        await client.connect()
        const db = client.db(dbNameImg)
        const collection = db.collection(dbNameImg) // 이미지 전용 컬렉션

        const result = await collection.insertOne({
            filename: file.originalname,
            contentType: file.mimetype,
            data: file.buffer,
            createdAt: new Date()
        })

        const imageUrl = `/experience/image/${result.insertedId}`
        res.status(200).json({ url: imageUrl })
    } catch (e) {
        res.status(500).json({ error: e.message })
    } finally {
        client.close()
    }
}

exports.getExperienceImage = async (req, res) => {
    const { id } = req.params
    const client = new MongoClient(uri)

    try {
        await client.connect()
        const db = client.db(dbNameImg)
        const collection = db.collection(dbNameImg)
        const image = await collection.findOne({ _id: new ObjectId(id) })

        if (!image) {
            return res.status(404).send('이미지를 찾을 수 없습니다.')
        }

        res.set('Content-Type', image.contentType) // MIME 타입 설정
        res.send(image.data) // 이미지 데이터를 바로 응답
    } catch (e) {
        res.status(500).json({ error: e.message })
    } finally {
        client.close()
    }
}
