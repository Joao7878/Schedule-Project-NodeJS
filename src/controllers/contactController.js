const Contact = require("../models/contactModel");
exports.index = (req, res) => {
  res.render("contact", {
    contact: {},
  });
};
exports.register = async (req, res) => {
  try {
    const contact = new Contact(req.body, req.session.user._id);
    await contact.register();
    if (contact.errors.length > 0) {
      req.flash("errors", contact.errors);
      req.session.save(function () {
        return res.redirect("back");
      });
      return;
    }
    req.flash("success", "Contact create");
    req.session.save(() =>
      res.redirect(`/contact/index/${contact.contact._id}`)
    );
  } catch (error) {
    res.render("404");
  }
};
exports.editIndex = async (req, res) => {
  if (!req.params.id) return res.render("404");
  const user = new Contact(req.body, req.session.user._id);
  const contact = await user.searchId(req.params.id);
  if (!contact) {
    res.render("404");
  }
  res.render("contact", { contact });
};
exports.edit = async (req, res) => {
  try {
    if (!req.params.id) return res.render("404");
    const user = new Contact(req.body, req.session.user._id);
    await user.edit(req.params.id);
    if (user.errors.length > 0) {
      req.flash("errors", user.errors);
      req.session.save(() => res.redirect("back"));
      return;
    }
    req.flash("success", "Contact edited");
    req.session.save(() => res.redirect(`/contact/index/${user.contact._id}`));
    return;
  } catch (error) {
    res.render("404");
  }
};
exports.delete = async (req, res) => {
  try {
    if (!req.params.id) return res.render("404");
    const user = new Contact(req.body, req.session.user._id);
    const contact = await user.delete(req.params.id);
    if (!contact) {
      req.flash("error", "Error: contact stay in the schedule");
      req.session.save(() => res.redirect("back"));
      return;
    }
    req.flash("success", "Contato apagado com sucesso.");
    req.session.save(() => res.redirect("back"));
    return;
  } catch (error) {
    res.render("404");
  }
};
