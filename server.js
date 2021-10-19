const express = require("express");
require("dotenv").config();
const app = express();
const mongoose = require("mongoose");
const {
  middlewareGlobal,
  checkCSRFError,
  CSRFMiddleware,
} = require("./src/middlewares/middleware");
const PORT = process.env.PORT || 3000;
//Conectado a base de dados
mongoose
  //Para esconder a nossa senha
  .connect(process.env.CONNECTIONSTRING)
  .then(() => {
    console.log("conectado ao bd");
    app.emit("pronto");
  })
  .catch((e) => {
    console.log("erro de conexão ao banco");
  });
const session = require("express-session");
//Salvar as session na base de dados
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const routes = require("./routes.js");
const path = require("path");
const helmet = require("helmet");
const csrf = require("csurf");
const sessionOptions = session({
  secret: "algo secreto",
  store: MongoStore.create({
    mongoUrl: process.env.CONNECTIONSTRING,
  }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
});
//Bom desativar enquanto o sistema estiver em desenvolvimento
//app.use(helmet());
app.use(sessionOptions);
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(flash());
//Colocar antes das rotas
app.use(csrf());
//Injetar o token em todas as paǵinas
app.use(express.static(path.resolve(__dirname, "Public")));
app.set("views", path.resolve(__dirname, "src", "views"));
app.set("view engine", "ejs");
app.use(middlewareGlobal);
app.use(CSRFMiddleware);
app.use(checkCSRFError);
app.use(routes);
app.on("pronto", () => {
  app.listen(PORT, () => {
    console.log("i am running!");
    console.log("http://localhost:9000");
  });
});
