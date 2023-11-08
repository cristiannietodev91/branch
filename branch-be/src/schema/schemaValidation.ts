import * as Joi from "joi";

export const createFirebaseUserSchema = Joi.object({
  tipoUsuario: Joi.string().valid("Cliente", "AdminTaller").required(),
  email: Joi.string().email().required(),
  celular: Joi.string().required(),
  identificacion: Joi.string(),
  password: Joi.string(),
  firstName: Joi.string(),
  uid: Joi.string(),
  typeDevice: Joi.string(),
});
