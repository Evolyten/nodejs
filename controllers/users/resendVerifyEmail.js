const { User } = require("../../models/user");
const { NotFound, BadRequest } = require("http-errors");
const sendEmail = require("../../helpers/sendEmail");

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw NotFound("Not found ");
  }
  if (user.verify) {
    throw BadRequest("Verification has already been passed");
  }
  const mail = {
    to: email,
    subject: "Confirm email",
    html: `<a href="http://localhost:3000/api/users/verify/${user.verificationToken}" target="_blank">Press on the link</a>`,
  };
  await sendEmail(mail);
  res.json({
    message: "Verification email sent",
  });
};

module.exports = resendVerifyEmail;
