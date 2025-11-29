const mongoose = require('mongoose');
async function configureDB() {
    try {
        await mongoose.connect(process.env.DB_URL)
        console.log('Connected to DB');
    } catch (err) {
        console.log(err.message);
    }
}
module.exports = configureDB;