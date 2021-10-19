exports.middlewareGlobal = (req, res, next) => {
  //Todas as páginas terão os errors das flash messages
  //Capturamos os erros e injetamos nas páginas caso eles existam
  res.locals.errors = req.flash("errors");
  //Faremos o mesmo com as mensagens de sucesso
  res.locals.success = req.flash("success");
  res.locals.info = req.flash("info");
  //Falando que o user local é o user que está logado
  res.locals.user = req.session.user;
  //Não tirar a função next(), pois o server não rodará
  next();
};
exports.checkCSRFError = (err, req, res, next) => {
  if (err) {
    return res.render("404");
  }
  next();
};
exports.CSRFMiddleware = (req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
};
//Se o usuário não estiver logado não vai poder acessar a aba de contatos
exports.loginRequired = (req, res, next) => {
  if (!req.session.user) {
    req.flash("errors", "You need to do login");
    req.session.save(() => res.redirect("/"));
    return;
  }
  next();
};
