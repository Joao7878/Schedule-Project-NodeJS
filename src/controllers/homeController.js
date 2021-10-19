exports.homePage = (req, res, next) => {
  if (req.session.page_views) {
    req.session.page_views++;
    req.flash("info", `Welcome back  `);
    req.session.save(function () {});
  } else {
    req.session.page_views = 1;
    req.flash("info", `Welcome `);
  }
  res.render("index");
};

exports.erro = (req, res, next) => {
  res.render("404");
  next();
};
