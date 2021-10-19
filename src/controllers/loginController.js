//Importando a classe que foi exportada do model
const Login = require("../models/loginModel");

exports.index = (req, res) => {
  if (req.session.user) return res.render("logged");
  return res.render("login");
};
exports.register = async (req, res) => {
  //Instancia da classe que foi exportada do model
  //No construtor foi definido que é necessário receber o body
  try {
    //Agora iremos passar o body da instancia, com isso poderemos modelar os dados
    const login = new Login(req.body);
    await login.register();
    if (login.errors.length > 0) {
      //Iremo exibir como um flash as mensagens de erro
      req.flash("errors", login.errors);
      //Iremos salvar a sessão e depos retornar para a paǵina de login
      req.session.save(function () {
        //Redirecionar para a pagina de onde o formulário veio
        //Iremos mostrar na tela as mensagens
        //Iremos retornar para finalizar e redirecionar
        return res.redirect("back");
      });
      return;
    }
    req.flash("success", "User create");
    req.session.save(function () {
      return res.redirect("back");
    });
  } catch (err) {
    console.log(err);
    //Iremos retornar para finalizar e renderizar
    return res.render("404");
  }
};
exports.login = async (req, res) => {
  try {
    //Agora iremos passar o body da instancia, com isso poderemos modelar os dados
    const login = new Login(req.body);
    await login.login();
    if (login.errors.length > 0) {
      //Iremo exibir como um flash as mensagens de erro
      req.flash("errors", login.errors);
      //Iremos salvar a sessão e depos retornar para a paǵina de login
      req.session.save(function () {
        //Redirecionar para a pagina de onde o formulário veio
        //Iremos mostrar na tela as mensagens
        //Iremos retornar para finalizar e redirecionar
        return res.redirect("back");
      });
      return;
    }
    req.flash("success", "User logged");
    //Logar o usuário na sessão
    req.session.user = login.user;
    req.session.save(function () {
      return res.redirect("back");
    });
  } catch (err) {
    console.log(err);
    //Iremos retornar para finalizar e renderizar
    return res.render("404");
  }
};
exports.logout = function (req, res) {
  req.session.destroy();
  res.redirect("/");
};
