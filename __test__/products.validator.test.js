import { jest } from "@jest/globals";

// Mock express-validator's validationResult to check for validation errors
jest.unstable_mockModule("express-validator", () => ({
  ...jest.requireActual("express-validator"),
  validationResult: jest.fn(),
}));
const { validationResult } = await import("express-validator");

const validData = {
  name: "Product Name",
  description: "Product Description",
  price: 100,
  brand: "Product Brand",
  model: "Product Model",
  category: "Product Category",
  dimensions: "Product Dimensions",
  stock: 10,
};

const invalidData = {
  name: "",
  description: "",
  price: "invalid_price",
  brand: "",
  model: "",
  category: "",
  dimensions: "",
  stock: "invalid_stock",
};

validationResult.mockImplementation(() => ({
  isEmpty: jest.fn().mockReturnValue(true),
  array: jest.fn().mockReturnValue([]),
}));

const { default: Product } = await import("../models/Product.js");
const productsValidatorModule = await import(
  "../middleware/productsValidator.js"
);
const productValidation = productsValidatorModule.default;

const mockReq = (data = {}) => ({
  body: { ...data },
});

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();

describe("productValidation Middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should pass validation for valid input data", async () => {
    const req = mockReq(validData);
    const res = mockRes();
    validationResult.mockReturnValueOnce({
      isEmpty: jest.fn().mockReturnValue(true),
      array: jest.fn().mockReturnValue([]),
    });

    await productValidation.create[8](req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  it("should return validation errors for all invalid fields", async () => {
    const req = mockReq(invalidData);
    const res = mockRes();
    validationResult.mockReturnValueOnce({
      isEmpty: jest.fn().mockReturnValue(false),
      array: jest.fn().mockReturnValue([
        { msg: "El campo name es obligatorio", param: "name" },
        { msg: "El campo description es obligatorio", param: "description" },
        { msg: "El valor price debe ser numerico", param: "price" },
        { msg: "El campo brand es obligatorio", param: "brand" },
        { msg: "El campo model es obligatorio", param: "model" },
        { msg: "El campo category es obligatorio", param: "category" },
        { msg: "El campo dimensions es obligatorio", param: "dimensions" },
        { msg: "El valor stock debe ser numerico", param: "stock" },
      ]),
    });

    await productValidation.create[8](req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: [
        { msg: "El campo name es obligatorio", param: "name" },
        { msg: "El campo description es obligatorio", param: "description" },
        { msg: "El valor price debe ser numerico", param: "price" },
        { msg: "El campo brand es obligatorio", param: "brand" },
        { msg: "El campo model es obligatorio", param: "model" },
        { msg: "El campo category es obligatorio", param: "category" },
        { msg: "El campo dimensions es obligatorio", param: "dimensions" },
        { msg: "El valor stock debe ser numerico", param: "stock" },
      ],
    });

    expect(mockNext).not.toHaveBeenCalled();
  });
});

// import { beforeEach, describe, it, jest } from "@jest/globals";

// // Mock express-validator's validationResult to check for validation errors
// jest.unstable_mockModule("express-validator", () => ({
//   ...jest.requireActual("express-validator"),
//   validationResult: jest.fn(),
// }));

// const { validationResult } = await import("express-validator");

// // Simulating valid request data
// const validData = {
//   name: "Product Name",
//   description: "Product Description",
//   price: 100,
//   brand: "Product Brand",
//   model: "Product Model",
//   category: "Product Category",
//   dimensions: "Product Dimensions",
//   stock: 10,
// };

// // Definir comportamiento del mock después de importarlo
// validationResult.mockImplementation(() => ({
//   isEmpty: jest.fn().mockRejectedValue(true),
//   array: jest.fn().mockRejectedValue([]),
// }));

// // Importar después de los mocks
// const { default: Product } = await import("../models/Product.js");
// const productValidationModule = await import(
//   "../middleware/productsValidator.js"
// );
// const productValidation = productValidationModule.default;

// // Mock request, response, and next
// const mockReq = (data = {}) => ({
//   body: { ...data },
// });

// const mockRes = () => {
//   const res = {};
//   res.status = jest.fn().mockReturnValue(res);
//   res.json = jest.fn().mockReturnValue(res);
//   return res;
// };

// const mockNext = jest.fn();

// describe("ProductsValidation test", () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   it("Shouldd pass validation for valid input data", async () => {
//     const req = mockReq(validData);
//     const res = mockRes();

//     // Mocking validationResult manually
//     validationResult.mockReturnValueOnce({
//       isEmpty: jest.fn().mockReturnValue(true),
//       array: jest.fn().mockReturnValue([]),
//     });

//     await productValidation.create[8](req, res, mockNext);

//     expect(mockNext).toHaveBeenCalled();
//   });
// });
