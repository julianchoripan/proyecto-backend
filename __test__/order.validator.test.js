import { beforeEach, describe, jest } from "@jest/globals";

// Mock express-validator's validationResult to check for validation errors
jest.unstable_mockModule("express-validator", () => ({
  ...jest.requireActual("express-validator"),
  validationResult: jest.fn(),
}));
const { validationResult } = await import("express-validator");

const validData = {};

const invalidData = {};

validationResult.mockImplementation(() => ({
  isEmpty: jest.fn().mockReturnValue(true),
  array: jest.fn().mockReturnValue([]),
}));

const { default: Order } = await import("../models/Order.js");
const orderValidationModule = await import("../middleware/orderValidator.js");
const orderValidation = orderValidationModule.default;

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

describe("OrderValidator test", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should pass validation for valid input data", async () => {
    const req = mockReq(validData);
    const res = mockRes();
    validationResult.mockReturnValueOnce({
      isEmpty: jest.fn().mockReturnValue(true),
      array: jest.fn().mockReturnValue([]),
    });

    await orderValidation.create[8](req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });
});
