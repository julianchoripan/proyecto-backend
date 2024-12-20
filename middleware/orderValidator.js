import { body, validationResult } from "express-validator";

const orderValidation = {
  create: [
    body("products.*.product")
      .notEmpty()
      .withMessage("El campo product es obligatorio")
      .isMongoId()
      .withMessage("El campo product debe ser un ID válido de MongoDB"),
    body("products.*.quantity")
      .notEmpty()
      .withMessage("El campo cantidad es obligatorio")
      .isNumeric()
      .withMessage("El valor cantidad debe ser un número"),
    body("shippingAdress")
      .notEmpty()
      .withMessage("El campo dirección de envío es obligatorio")
      .isString()
      .withMessage("El valor dirección de envío debe ser un string"),
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ],
};
export default orderValidation;
