const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,

        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);

        await createIndexes();
    } catch (error) {
        console.error('Database Connection Error:', error);
        process.exit(1);
    }
};

const createIndexes = async () => {
    try {
        await mongoose.connection.collection('users').createIndex({ email: 1 }, { unique: true });

        //Application indexes
        await mongoose.connection.collection('applications').createIndex({ applicationId: 1 }, { unique: true });
        await mongoose.connection.collection('applications').createIndex({ 'customerInfo.phone': 1 });
        await mongoose.connection.collection('applications').createIndex({ 'customerInfo.email': 1 });
        await mongoose.connection.collection('applications').createIndex({ status: 1 });
        await mongoose.connection.collection('applications').createIndex({ salesPerson: 1 });
        await mongoose.connection.collection('applications').createIndex({ applicationDate: -1 });

        console.log('Database indexes created');
    } catch (error) {
        console.error('Indexe creation error', error);
    }
};

module.exports = connectDB;