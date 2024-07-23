const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');

//console.log(process.env.MONGO_URI);

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    name: {type: String, required: true}
    },{timestamps: true});
 
module.exports = mongoose.model('', userSchema);