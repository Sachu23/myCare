const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const path = require('path');
const { Server } = require('socket.io');
const http = require('http');
const authRoutes = require('./routes/auth'); // Auth routes

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);

// Serve static files from the 'client/public' directory
app.use(express.static(path.join(__dirname, 'client/public')));

// Serve the index.html file when accessing the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/public', 'index.html'));
});

// Function to fetch and emit appointments
const fetchAppointments = async () => {
  try {
    if (!mongoose.connection.readyState) {
      console.error('No database connection');
      return;
    }
    
    const db = mongoose.connection.db;
    const appointmentsCollection = db.collection('test'); // replace with your collection name
    const agentsCollection = db.collection('agent'); // replace with your collection name
    const patientsCollection = db.collection('patient'); // replace with your collection name

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
// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Fetch appointments every 5 seconds and emit them to all connected clients
setInterval(fetchAppointments, 5000);

// Connect to MongoDB and start the server
const startServer = async () => {
  try {
    await mongoose.connect('mongodb+srv://ssrini52:James$007@cluster0.j0uzqjk.mongodb.net/Succhay?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    const PORT = process.env.PORT || 9000;
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
  }
};

startServer();
