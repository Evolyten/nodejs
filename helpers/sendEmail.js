const sgMail = require("@sendgrid/mail");

const { SENDGRID_API_KEY } = process.env;
sgMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async (data) => {
  try {
    const email = { ...data, from: "alex.lebdiev20@gmail.com" };
    await sgMail.send(email);
    console.log("ok");
    return true;
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendEmail;
