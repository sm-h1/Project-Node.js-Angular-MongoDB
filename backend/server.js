require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const fileRoutes = require('./routes/fileRoutes');

const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => console.error('MongoDB connection error:', err));

app.use('/api/files', fileRoutes);


app.get('/', (req, res) => res.send('Server is running'));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
