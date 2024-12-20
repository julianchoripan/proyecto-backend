import { jest } from "@jest/globals";

// Mock express-validator's validationResult to check for validation errors
jest.unstable_mockModule("express-validator", () => ({
  ...jest.requireActual("express-validator"),
  validationResult: jest.fn(),
}));
const { validationResult } = await import("express-validator");

const validData = {
  products: [{ product: "60b6a9347c213e001cb43015", quantity: 1 }],
  shippingAdress: "123 Main St",
};

const invalidData = {
  products: [{ product: "", quantity: "" }],
  shippingAdress: "",
};

validationResult.mockImplementation(() => ({
  isEmpty: jest.fn().mockReturnValue(true),
  array: jest.fn().mockReturnValue([]),
}));

const { default: orderValidation } = await import(
  "../middleware/orderValidator.js"
);

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

describe("orderValidation Middleware", () => {
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

    await orderValidation.create[3](req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  it("should return validation errors for invalid input data", async () => {
    const req = mockReq(invalidData);
    const res = mockRes();
    validationResult.mockReturnValueOnce({
      isEmpty: jest.fn().mockReturnValue(false),
      array: jest.fn().mockReturnValue([
        {
          msg: "El campo product es obligatorio",
          param: "products[0].product",
        },
        {
          msg: "El campo product debe ser un ID válido de MongoDB",
          param: "products[0].product",
        },
        {
          msg: "El campo cantidad es obligatorio",
          param: "products[0].quantity",
        },
        {
          msg: "El campo dirección de envío es obligatorio",
          param: "shippingAdress",
        },
      ]),
    });

    await orderValidation.create[3](req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: [
        {
          msg: "El campo product es obligatorio",
          param: "products[0].product",
        },
        {
          msg: "El campo product debe ser un ID válido de MongoDB",
          param: "products[0].product",
        },
        {
          msg: "El campo cantidad es obligatorio",
          param: "products[0].quantity",
        },
        {
          msg: "El campo dirección de envío es obligatorio",
          param: "shippingAdress",
        },
      ],
    });

    expect(mockNext).not.toHaveBeenCalled();
  });
});
