const express = require("express");
const route = express.Router();
const homeController = require("./src/controllers/homeController");
const loginController = require("./src/controllers/loginController");
const contactController = require("./src/controllers/contactController");
const { loginRequired } = require("./src/middlewares/middleware");
//Rotas da Home
route.get("/", homeController.homePage);

//Rotas de Login
route.get("/login/index", loginController.index);
route.post("/login/register", loginController.register);
route.post("/login/login", loginController.login);
route.get("/login/logout", loginController.logout);

//Rotas de Contato
route.get("/contact/index", loginRequired, contactController.index);
module.exports = route;
