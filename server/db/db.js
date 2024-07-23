const mongoose = require('mongoose');

const db = async () => {
    try {
        mongoose.set('strictQuery', false)
        //await mongoose.connect(process.env.MONGO_URI)
        await mongoose.connect('mongodb+srv://ssrini52:Sachu%40007@cluster0.j0uzqjk.mongodb.net/Appointment-Scheduler', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => console.log('Connected to MongoDB'))
        .catch(err => console.error('Could not connect to MongoDB...', err));
        } catch (error) {
            console.log('DB Connection Error');
        }
    }

module.exports = {db}