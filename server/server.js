const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { db } = require('./db/db');
const {readdirSync} = require('fs')


const authRoutes = require('./routes/auth');
const protectedRoute = require('./routes/protectedRoute');
//const transaction = require('./routes/transactions')

const app = express();
app.use(express.json());
app.use(cors({orgigin: "*"}));

const router = express.Router();

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/protected', protectedRoute);
//app.use('/api/v1', transaction)

const PORT = process.env.PORT || 9000;

const server = () => {
    db();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

server();



