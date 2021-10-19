const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const loginSchema = new mongoose.Schema({
  email: {
    type: "string",
    required: true,
    unique: true,
  },
  password: {
    type: "string",
    required: true,
  },
});
const loginModel = mongoose.model("Login", loginSchema);

class Login {
  constructor(body) {
    this.body = body;
    //Criando um array de erros
    this.errors = [];
    //Criando um usuário começando como nulo
    this.user = null;
  }
  async login() {
    this.valida();
    if (this.errors.length > 0) return;
    this.user = await loginModel.findOne({
      email: this.body.email,
    });
    if (!this.user) {
      this.errors.push("User does not exist");
      return;
    }
    if (!bcryptjs.compareSync(this.body.password, this.user.password)) {
      this.errors.push("Invalid password");
      this.user = null;
      return;
    }
  }
  async register() {
    this.valida();

    if (this.errors.length > 0) return;

    const salt = bcryptjs.genSaltSync();
    this.body.password = bcryptjs.hashSync(this.body.password, salt);
    await this.userExists();

    if (this.errors.length > 0) return;

    this.user = await loginModel.create(this.body);
  }

  valida() {
    this.cleanUp();

    if (!validator.isEmail(this.body.email)) {
      this.errors.push("Invalid e-mail ");
    }

    if (this.body.password.length < 8 || this.body.password > 30) {
      this.errors.push(
        "Invalid password, needs to have between 8 and 30 characters"
      );
    }
  }
  async userExists() {
    this.user = await loginModel.findOne({ email: this.body.email });
    if (this.user) this.errors.push("User already exists");
  }
  cleanUp() {
    for (const key in this.body) {
      if (typeof this.body[key] !== "string") {
        this.body[key] = "";
      }
    }
    this.body = {
      email: this.body.email,
      password: this.body.password,
    };
  }
}

module.exports = Login;
