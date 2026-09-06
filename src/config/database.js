const mongoose = require('mongoose');

const FALLBACK_MONGODB_URI = 'mongodb://coching-center:xOpJ1xoCTs3KHx0B@ac-5ppqbt1-shard-00-00.lwxgi8z.mongodb.net:27017,ac-5ppqbt1-shard-00-01.lwxgi8z.mongodb.net:27017,ac-5ppqbt1-shard-00-02.lwxgi8z.mongodb.net:27017/coching_center?ssl=true&replicaSet=atlas-l7hopv-shard-0&authSource=admin&appName=Cluster0';

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) {
        return;
    }
    try {
        const uri = process.env.MONGODB_URI || FALLBACK_MONGODB_URI;
        const dbName = process.env.DB_NAME || 'coching_center';
        await mongoose.connect(uri, {
            dbName,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        if (!process.env.VERCEL) {
            process.exit(1);
        }
    }
};

module.exports = connectDB;

