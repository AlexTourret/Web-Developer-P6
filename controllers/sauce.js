"use strict";

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
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      res.status(200).json({ message: req.body})
    //   if (sauce.userId.includes(req.body.userId)){

    //     if(req.file){ 
    //       Sauce.findOne({ _id: req.params.id }) 
    //       .then(sauce => {
    //           const filename = sauce.imageUrl.split('/images/')[1];
    //           fs.unlink(`images/${filename}`, (err) => { 
    //               if (err) 
    //               throw err
    //           });
    //       })
    //       .catch(error => res.status(400).json({error}));
    //     }
    //     // si fichier image
    //     const sauceObject = req.file ? 
    //     {  
    //         //récupèraration l'objet json
    //         ...JSON.parse(req.body.sauce), 
    //         //ajout de l'image URL
    //         imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` 
    //     } : { ...req.body} //sinon prise du corps de la requête
    //     //Modification de la sauce
    //     Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id }) 
    //       .then(() => res.status(200).json({message:'Sauce modifiée'}))
    //       .catch(error => res.status(400).json({error}));
    // }
    })
    .catch((error) => res.status(403).json({ message : "Unauthorized request" }));      
};


exports.likeSauce = (req, res, next) => {
  if (req.body.like === 1) { //si like est a 1
      Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
          if (!sauce.usersLiked.includes(req.body.userId)){ // on s'assure que l'utilisateur n'a pas déjà like
      Sauce.updateOne( //On modifie celui dont l'ID est égale à l'ID envoyé dans les paramètres de requêtes avec Likes a 1 et userId dans le tableau usersLiked
          { _id: req.params.id }, 
          { $inc: { likes: 1 },$push: { usersLiked: req.body.userId }},
          { _id: req.params.id }
      )
        .then(() => res.status(200).json({ message: 'J\'aime' }))
        .catch((error) => res.status(400).json({ error }));
      }})
      .catch((error) => res.status(403).json({ message : "Unauthorized request" }));

  } else if (req.body.like === -1) { //si like est a -1
    Sauce.findOne({ _id: req.params.id }) 
    .then((sauce) => {
      if (!sauce.usersDisliked.includes(req.body.userId)){ // on s'assure que l'utilisateur n'a pas déjà dislike
        Sauce.updateOne( //On modifie celui dont l'ID est égale à l'ID envoyé dans les paramètres de requêtes avec Dislikes a 1 et userId dans le tableau userDisLiked
        { _id: req.params.id },
        { $inc: { dislikes: 1 },$push: { usersDisliked: req.body.userId }},
        { _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: 'Je n\'aime pas' }))
          .catch((error) => res.status(400).json({ error }));
      }})
      .catch((error) => res.status(403).json({ message : "Unauthorized request" }));
        
  } else {
      Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
          if (sauce.usersLiked.includes(req.body.userId)){ //si userId est présent dans le tableau usersLiked alors
              Sauce.updateOne( //On modifie celui dont l'ID est égale à l'ID envoyé dans les paramètres de requêtes avec Like a -1 et en enlevant userId dans le tableau usersLiked
              { _id: req.params.id },
              { $inc: { likes: -1 },$pull: { usersLiked: req.body.userId }},
              { _id: req.params.id }
              )
                  .then(() => res.status(200).json({ message: 'Je n\'aime plus' }))
                  .catch((error) => res.status(400).json({ error }));
          
          } else if (sauce.usersDisliked.includes(req.body.userId)){ //si userId est présent dans le tableau usersDisliked alors
              Sauce.updateOne( //On modifie celui dont l'ID est égale à l'ID envoyé dans les paramètres de requêtes avec Dislike a -1 et en enlevant userId dans le tableau usersDisliked
              { _id: req.params.id },
              { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId }},
              { _id: req.params.id }
              )
                  .then(() => res.status(200).json({ message: 'Je commence à aimer' }))
                  .catch((error) => res.status(400).json({ error }));
          }}
      )
      .catch((error) => res.status(400).json({ message : 'ça marche pas' }));
  }
  
  
};
