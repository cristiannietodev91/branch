import * as Joi from "joi";

export const registerUserSchema = Joi.object({
  tipoUsuario: Joi.string().valid("Cliente", "AdminTaller").required(),
  email: Joi.string().email().required(),
  celular: Joi.string().required(),
  identificacion: Joi.string().required(),
  password: Joi.string().required(),
  firstName: Joi.string(),
});
