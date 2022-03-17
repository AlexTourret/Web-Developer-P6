const Sauce = require('../models/Sauce');
const fs = require('fs'); 

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

exports.getAllSauce = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes:0,
    dislikes:0
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
    .catch(error => res.status(400).json({ error }));
};


exports.modifySauce = (req, res, next) => {
	if(req.file){ 
    Sauce.findOne({ _id: req.params.id }) 
    .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, (err) => { 
            if (err) 
            throw err
        });
    })
    .catch(error => res.status(400).json({error}));
  }
  // si fichier image
  const sauceObject = req.file ? 
  {  
      //récupèraration l'objet json
      ...JSON.parse(req.body.sauce), 
      //ajout de l'image URL
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` 
  } : { ...req.body} //sinon prise du corps de la requête
  //Modification de la sauce
  Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id }) 
    .then(() => res.status(200).json({message:'Sauce modifiée'}))
    .catch(error => res.status(400).json({error}));
};
