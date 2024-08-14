const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { db } = require('./db/db');
const { readdirSync } = require('fs');
const { MongoClient } = require('mongodb');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const authRoutes = require('./routes/auth');
const protectedRoute = require('./routes/protectedRoute');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const uri = 'mongodb+srv://ssrini52:James$007@cluster0.j0uzqjk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let dbConnection;

app.use(express.json());
app.use(cors({ origin: "*" }));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/protected', protectedRoute);

// Serve static files from the 'client/public' directory
app.use(express.static(path.join(__dirname, '../client/public')));

// Serve the index.html file when accessing the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/public', 'index.html'));
});

const PORT = process.env.PORT || 9000;

const fetchAppointments = async () => {
  try {
    if (!dbConnection) {
      console.error('No database connection');
      return;
    }
    const appointmentsCollection = dbConnection.collection('test'); // replace with your collection name
    const agentsCollection = dbConnection.collection('agent'); // replace with your collection name
    const patientsCollection = dbConnection.collection('patient'); // replace with your collection name

    const appointments = await appointmentsCollection.find({}).toArray();
    const agents = await agentsCollection.find({}).toArray();
    const patients = await patientsCollection.find({}).toArray();

    const agentMap = agents.reduce((acc, agent) => {
      acc[agent.agent_id] = `${agent.agent_firstname} ${agent.agent_lastname}`;
      return acc;
    }, {});

    const patientMap = patients.reduce((acc, patient) => {
      acc[patient.patient_id] = `${patient.Patient_firstname} ${patient.Patient_lastname}`;
      return acc;
    }, {});

    const enrichedAppointments = appointments.map(appointment => ({
      ...appointment,
      agent_name: agentMap[appointment.agent_id] || 'Unknown Agent',
      patient_name: patientMap[appointment.patient_id] || 'Unknown Patient'
    }));

    io.emit('appointments', enrichedAppointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
  }
};

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

setInterval(fetchAppointments, 5000);

const startServer = async () => {
  try {
    await client.connect();
    dbConnection = client.db('Succhay'); // replace with your database name
    db();
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
  }
};

startServer();
