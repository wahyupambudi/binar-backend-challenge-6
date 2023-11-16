const { ResponseTemplate } = require("../helper/template.helper");
const Joi = require("joi");

function CheckPostUser(req, res, next) {
  const schema = Joi.object({
    title: Joi.string().alphanum().max(255).required(),
    description: Joi.string().alphanum().max(255).required(),
    url_img: Joi.string().alphanum().max(255).required(),
  });

  const { error } = schema.validate(req.body);
  console.log(error);
  if (error) {
    let respErr = ResponseTemplate(
      null,
      "invalid request",
      error.details[0].message,
      400,
    );
    res.json(respErr);
    return;
  }

  next();
}


module.exports = {
  CheckPostUser,
};
