const express = require('express');
const app = express();
const mongoose = require ('mongoose');
const userRoutes = require('./routes/user');

mongoose.connect ('mongodb+srv://Admin:rWJ10KNpXNDccKRU@cluster0.3nbot.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion � MongoDB r�ussie !'))
  .catch(() => console.log('Connexion � MongoDB �chou�e !'));

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use('/api/auth',userRoutes);

module.exports = app;