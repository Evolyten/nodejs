const { User } = require("../../models/user");
const bcrypt = require("bcrypt");
const { Conflict } = require("http-errors");
const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw new Conflict(`Email in use`);
  }
  const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  const result = await User.create({ email, password: hashPassword });
  const { subscription } = result;
  res.status(201).json({
    user: {
      email,
      subscription,
    },
  });
};

module.exports = register;
