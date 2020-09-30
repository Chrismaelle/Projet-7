const express = require("express"); // Déclaration framework express
const bodyParser = require("body-parser"); // Déclaration Body-Parser pour récupérer des objets exploitables

const helmet = require("helmet");

const userRoutes = require("./routes/user"); // Déclaration du dossier des routes utilisateur
const messageRoutes = require("./routes/messages"); // Déclaration du dossier des routes messages

const path = require("path"); //nécessaire pour multer (importation des fichiers)

const app = express();

// DECLARATION DE MES CORS, HEADERS ET METHODS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Request-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());

app.use("/api/message", messageRoutes);
app.use("/api/auth", userRoutes);

app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
