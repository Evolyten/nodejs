const { User } = require("../../models/user");
const bcrypt = require("bcrypt");
const { Conflict } = require("http-errors");
const gravatar = require("gravatar");
const sendEmail = require("../../helpers/sendEmail");
const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw new Conflict(`Email in use`);
  }
  const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  const avatarURL = gravatar.url(email);
  const verificationToken = Math.random().toString();
  const result = await User.create({
    email,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });
  const mail = {
    to: email,
    subject: "Confirm email",
    html: `<a href="http://localhost:3000/api/users/verify/${verificationToken}" target="_blank">Press on the link</a>`,
  };

  await sendEmail(mail);
  const { subscription } = result;
  res.status(201).json({
    user: {
      email,
      subscription,
      avatarURL,
    },
  });
};

module.exports = register;
