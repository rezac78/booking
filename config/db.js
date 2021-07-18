const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useFindAndModify: true,
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        console.log(`Mongo Conected ${conn.connection.host}`);
    } catch (err) {
        console.log(err);
        process.exit(1)
    }
}

module.exports = connectDB;