const Contact = require("../../models/schema");
const { NotFound } = require("http-errors");
const getById = async (req, res, next) => {
  const { contactId } = req.params;
  const currentContact = await Contact.findById(contactId);
  if (!currentContact) {
    throw NotFound(`Contact with id=${contactId} not found`);
  }
  res.status(200).json(currentContact);
};

module.exports = getById;
