const Contact = require("../models/contactModel");
exports.homePage = async (req, res, next) => {
  if (req.session.page_views) {
    req.session.page_views++;
    req.flash("info", `Welcome back  `);
    req.session.save(function () {});
  } else {
    req.session.page_views = 1;
    req.flash("info", `Welcome `);
  }
  if (req.session.user) {
    const contact = new Contact(req.body, req.session.user._id);
    const contacts = await contact.searchContacts();
    return res.render("index", { contacts });
  }
  return res.render("index");
};
