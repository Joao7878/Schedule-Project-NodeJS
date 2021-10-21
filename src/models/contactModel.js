const mongoose = require("mongoose");
const validator = require("validator");
const contactSchema = new mongoose.Schema({
  name: {
    type: "string",
    required: true,
  },
  lastName: {
    type: "string",
    default: "",
  },
  number: {
    type: "string",
    default: "",
  },
  email: {
    type: "string",
    default: "",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: "string",
  },
});
const contactModel = new mongoose.model("Contact", contactSchema);

class Contact {
  constructor(body, id) {
    this.body = body;
    this.errors = [];
    this.contact = null;
    this.body.createdBy = id;
  }
  async register() {
    this.validate();
    if (this.errors.length > 0) return;
    this.contact = await contactModel.findOne({
      name: this.body.name,
      lastName: this.body.lastName,
      number: this.body.number,
      email: this.body.email,
    });
    if (this.contact) {
      this.errors.push("Contact already registered");
      return;
    }
    this.contact = await contactModel.create(this.body);
  }

  validate() {
    this.cleanUp();
    if (this.body.email && !validator.isEmail(this.body.email)) {
      this.errors.push("Invalid e-mail address");
    }
    if (!this.body.name) {
      this.errors.push("Name is required");
    }
    if (!this.body.number && !this.body.email) {
      this.errors.push("Number or email is required");
    }
  }

  cleanUp() {
    for (const key in this.body) {
      if (typeof this.body[key] !== "string") {
        this.body[key] = "";
      }
    }
    this.body = {
      name: this.body.name,
      lastName: this.body.lastName,
      number: this.body.number,
      email: this.body.email,
      createdBy: this.body.createdBy,
    };
  }
  async searchId(id) {
    if (typeof id !== "string") return;
    const contact = await contactModel.findOne({ _id: id });
    return contact;
  }
  async searchContacts() {
    const contact = await contactModel.find().sort({ date: -1 });
    return contact;
  }
  async edit(id) {
    if (typeof id !== "string") return;
    this.validate();
    if (this.errors.length > 0) return;
    this.contact = await contactModel.findByIdAndUpdate(id, this.body, {
      new: true,
    });
  }
  async delete(id) {
    if (typeof id !== "string") return;
    const contact = await contactModel.findByIdAndDelete(id);
    return contact;
  }
}

module.exports = Contact;
