const express = require('express');
const app = express();
const mongoose = require ('mongoose');
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');
const path = require("path");

require('dotenv').config();

mongoose.connect (process.env.DATABASE_MONGO,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion � MongoDB r�ussie !'))
  .catch(() => console.log('Connexion � MongoDB �chou�e !'));

app.use(express.json());
//Permet de faire d'accéder à l'api depuis n'importe quelle origine ('*')
// ajouter les headers mentionnés aux requêtes envoyées vers notre API
// envoyer des requêtes avec les méthodes mentionnées
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use("/images", express.static(path.join(__dirname, 'images')));
app.use('/api/auth',userRoutes);
app.use('/api/sauces',sauceRoutes);

module.exports = app;