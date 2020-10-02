const rateLimit = require("../middleware/limit");
const jwt = require("jsonwebtoken"); // Token de protection
const bcrypt = require("bcrypt"); // Protection du mot de passe utilisateur
const models = require("../models");

//CONSTANTES REGEX
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const pwRegex = /^(?=.*\d).{4,8}$/;

exports.signup = (req, res, next) => {
  //Inscription au site
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;
  const job = req.body.job;

  if (
    firstName === null ||
    lastName === null ||
    email === null ||
    password === null ||
    job === null
  ) {
    return res
      .status(400)
      .json({ message: "Veuillez remplir tous les champs." });
  }

  if (firstName.length >= 15 || firstName.length <= 2) {
    return res
      .status(400)
      .json({ message: "Votre prénom doit comprendre entre 2 et 15 lettres" });
  }

  if (lastName.length >= 15 || lastName.length <= 2) {
    return res
      .status(400)
      .json({ message: "Votre nom doit comprendre entre 2 et 15 lettres" });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Votre email est invalide !" });
  }

  if (!pwRegex.test(password)) {
    return res.status(400).json({
      message:
        "Votre mot de passe doit contenir entre 4 et 8 caractères et contenir au moins 1 nombre",
    });
  }

  models.user
    .findOne({
      // Je vérifie que l'email n'existe pas déjà
      attributes: ["email"],
      where: { email: email },
    })
    .then((userFound) => {
      if (!userFound) {
        bcrypt.hash(password, 10, function (err, bcryptedPassword) {
          //Hashage du mot de passe
          let newUser = models.user
            .create({
              firstName: firstName,
              lastName: lastName,
              email: email,
              password: bcryptedPassword,
              job: job,
              isAdmin: 0,
            })
            .then(function (newUser) {
              return res.status(201).json({ userId: newUser });
            })
            .catch(function (err) {
              return res.status(500).json({ err });
            });
        });
      } else {
        return res
          .status(403)
          .json({ message: " L'utilisateur existe déjà !" });
      }
    })
    .catch((error) =>
      res
        .status(500)
        .json({ message: "Impossible de créer l'utilisateur.", error })
    );
};

exports.login = (req, res, next) => {
  // Connexion à un compte existant
  let email = req.body.email;
  let password = req.body.password;

  if (email === null || password === null) {
    return res
      .status(400)
      .json({ message: "Veuillez remplir tous les champs !" });
  }

  models.user
    .findOne({
      where: { email: email },
    })
    .then((userFound) => {
      if (userFound) {
        bcrypt.compare(password, userFound.password, function (
          errBycrypt,
          resBycrypt
        ) {
          if (resBycrypt) {
            return res.status(200).json({
              userId: userFound.id,
              token: jwt.sign({ userId: userFound.id }, "RANDOM_TOKEN_SECRET", {
                expiresIn: "2h",
              }),
            });
          } else {
            return res.status(401).json({ message: "Mot de passe incorrect." });
          }
        });
      } else {
        return res
          .status(404)
          .json({ message: "L'utilisateur n'existe pas dans la BD." });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.getProfile = (req, res, next) => {
  //Profil Utilisateur

  models.user
    .findOne({
      attributes: ["firstName", "lastName", "email", "job"],
      where: { id: req.params.id },
    })
    .then((User) => {
      if (User) {
        return res.status(200).json({ User });
      } else {
        return res.status(400).json({
          message: "Impossible de récupérer votre profil utilisateur",
        });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};
exports.updateProfil = (req, res, next) => {
  // Modification du Profil Utilisateur
  models.user
    .findOne({
      attributes: ["job", "id"],
      where: { id: req.params.id },
    })
    .then((userFound) => {
      if (userFound) {
        userFound
          .update({
            job: req.body.job,
          })
          .then((userFound) => {
            return res
              .status(200)
              .json({ User: userFound, message: "Profil modifié !" });
          })
          .catch((error) =>
            res
              .status(500)
              .json({ error, message: "Impossible de modifié votre profil." })
          );
      } else {
        return res.status(400).json({ message: "Utilisateur introuvable." });
      }
    })
    .catch((error) =>
      res
        .status(500)
        .json({ error, message: "Impossible de récupérer l'utilisateur" })
    );
};

exports.deleteUser = (req, res, next) => {
  // Suppression d'un compte utilisateur

  models.user
    .findOne({
      where: { id: req.params.id },
    })
    .then((userFoundForDelete) => {
      if (userFoundForDelete) {
        userFoundForDelete
          .destroy({
            email: userFoundForDelete.email,
          })
          .then(() =>
            res.status(200).json({ message: "Utilisateur supprimé !" })
          )
          .catch((error) =>
            res
              .status(500)
              .json({ error, message: "L'utilisateur n'a pas été supprimé." })
          );
      } else {
        return res.status(400).json({
          message:
            "L'utilisateur n'a pas été trouvé, il ne peut être supprimé.",
        });
      }
    })
    .catch((error) =>
      res
        .status(500)
        .json({ error, message: "Impossible de supprimer le compte." })
    );
};
