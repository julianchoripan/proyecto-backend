import { body, validationResult } from "express-validator";

const productValidation = {
  create: [
    body("name")
      .notEmpty()
      .withMessage("El campo name  es obligatorio")
      .isString("El valor name debe ser un string"),
    body("description")
      .notEmpty()
      .withMessage("El campo description es obligatorio")
      .isString("El valor description debe ser un string"),
    body("price")
      .notEmpty()
      .withMessage("El campo price  es obligatorio")
      .isNumeric("El valor price debe ser numerico"),
    body("brand")
      .notEmpty()
      .withMessage("El campo brand es obligatorio")
      .isString("El valor brand debe ser un string"),
    body("model")
      .notEmpty()
      .withMessage("El campo model es obligatorio")
      .isString("El valor model debe ser un string"),
    body("category")
      .notEmpty()
      .withMessage("El campo category es obligatorio")
      .isString("El valor category debe ser un string"),
    body("dimensions")
      .notEmpty()
      .withMessage("El campo dimensions es obligatorio")
      .isString("El valor dimensions debe ser un string"),
    body("stock")
      .notEmpty()
      .withMessage("El campo stock es obligatorio")
      .isNumeric("El valor stock debe ser un string"),
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ],
};
export default productValidation;
