import { jest } from "@jest/globals";

const mockUser = {
  _id: "userId",
  username: "mockUser",
  firstName: "Mock",
  lastName: "User",
  email: "mockuser@example.com",
  password: "mockpassword",
};

const mockProduct = {
  _id: "productId",
  name: "Mock Product",
  description: "Mock Product Description",
  price: 100,
  brand: "Mock Brand",
  category: "Mock Category",
  stock: 50,
};

const mockOrder = {
  _id: "orderId",
  user: mockUser,
  products: [{ product: mockProduct, quantity: 1 }],
  total: 100,
  shippingAdress: "123 Street",
  paymentMethod: "creditCard",
};

jest.unstable_mockModule("../models/Order.js", () => {
  const mockExec = jest.fn().mockResolvedValue(mockOrder);

  const mockPopulate = jest.fn().mockImplementation(function () {
    return this;
  });

  const Order = {
    find: jest.fn().mockReturnValue({
      populate: mockPopulate,
      exec: jest.fn().mockResolvedValue([mockOrder]),
    }),
    findOne: jest.fn().mockReturnValue({
      populate: mockPopulate,
      exec: mockExec,
    }),
    create: jest.fn().mockResolvedValue(mockOrder),
    findById: jest.fn().mockResolvedValue(mockOrder),
  };

  return { default: Order };
});

jest.unstable_mockModule("../models/Product.js", () => {
  const Product = { findById: jest.fn().mockResolvedValue(mockProduct) };
  return { default: Product };
});
jest.unstable_mockModule("../models/User.js", () => {
  const User = { findById: jest.fn().mockResolvedValue(mockUser) };
  return { default: User };
});

const { default: Order } = await import("../models/Order.js");
const orderControllerModule = await import("../controllers/orderController.js");
const { default: Product } = await import("../models/Product.js");
const { default: User } = await import("../models/User.js");
const orderController = orderControllerModule.default;

const mockReq = () => ({
  body: {},
  params: { id: "orderId" },
  auth: { id: "userId" },
});

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Order Controller with Mocks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAll", () => {
    it("should get all orders", async () => {
      const req = mockReq();
      const res = mockRes();
      await orderController.getAll(req, res);
      expect(Order.find).toHaveBeenCalledWith({ deletedAt: { $eq: null } });
      expect(Order.find().populate).toHaveBeenCalledTimes(2);
      //expect(res.json).toHaveBeenCalledWith({ order: [mockOrder] });
    });
  });

  describe("getOrderById", () => {
    it("should get order by id", async () => {
      const req = mockReq();
      const res = mockRes();
      await orderController.getOrderById(req, res);
      expect(Order.findOne).toHaveBeenCalledWith({
        _id: req.params.id,
        deletedAt: { $eq: null },
      });
      expect(Order.findOne().populate).toHaveBeenCalledTimes(2);
      //expect(res.json).toHaveBeenCalledWith({ order: mockOrder });
    });
  });

  describe("createOrder", () => {
    it("should create a new order", async () => {
      const req = mockReq();
      req.body = {
        user: "userId",
        products: [{ product: "productId", quantity: 1 }],
        shippingAdress: "123 Street",
        paymentMethod: "creditCard",
        total: 100,
      };
      const res = mockRes();
      await orderController.createOrder(req, res);
      expect(Order.create).toHaveBeenCalledWith({
        user: req.auth.id,
        products: req.body.products,
        total: req.body.total,
        shippingAdress: req.body.shippingAdress,
        paymentMethod: req.body.paymentMethod,
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Order created successfully",
        order: mockOrder,
      });
    });
    it("should handle error", async () => {
      const req = mockReq();
      req.body = {
        products: [{ product: "productId", quantity: 1 }],
        shippingAdress: "123 Street",
        paymentMethod: "creditCard",
        total: 100,
      };
      const res = mockRes();
      Order.create.mockRejectedValueOnce(new Error("Error"));
      await orderController.createOrder(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: new Error("Error") });
    });
  });

  describe("updateOrder", () => {
    it("should update an existing order", async () => {
      const req = mockReq();
      req.body = {
        products: [{ product: "productId", quantity: 2 }],
        shippingAdress: "123 Updated Street",
        paymentMethod: "debitCard",
        total: 200,
      };
      const res = mockRes();
      Order.findOne.mockResolvedValueOnce(mockOrder);
      mockOrder.save = jest.fn().mockResolvedValueOnce(mockOrder);
      await orderController.updateOrder(req, res);
      expect(Order.findOne).toHaveBeenCalledWith({
        _id: req.params.id,
        deletedAt: { $eq: null },
      });
      expect(mockOrder.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith("La orden ha sido actualizada");
    });
    it("should return 'No existe una orden con el ID mencionado' if order does not exist", async () => {
      Order.findOne.mockResolvedValueOnce(null);
      const req = mockReq();
      const res = mockRes();
      await orderController.updateOrder(req, res);
      expect(res.json).toHaveBeenCalledWith(
        "No existe una orden con el ID mencionado"
      );
    });
    it("should handle error", async () => {
      const req = mockReq();
      const res = mockRes();
      Order.findOne.mockRejectedValueOnce(new Error("Error"));
      await orderController.updateOrder(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error",
      });
    });
  });

  describe("destroyOrder", () => {
    it("should delete an order by setting deletedAt field", async () => {
      const req = mockReq();
      const res = mockRes();
      Order.findById.mockResolvedValueOnce(mockOrder);
      mockOrder.save = jest.fn().mockResolvedValueOnce(mockOrder);
      await orderController.destroyOrder(req, res);
      expect(Order.findById).toHaveBeenCalledWith(req.params.id);
      expect(mockOrder.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith("se ha eliminado la orden");
    });
    it("should handle error", async () => {
      const req = mockReq();
      const res = mockRes();
      Order.findById.mockRejectedValueOnce(new Error("Error"));
      await orderController.destroyOrder(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error",
      });
    });
  });

  // describe("getAllOrderDeleted", () => {
  //   it("should get all deleted orders", async () => {
  //     const req = mockReq();
  //     const res = mockRes();
  //     Order.find.mockReturnValueOnce({
  //       populate: jest.fn().mockReturnThis(),
  //       exec: jest.fn().mockResolvedValueOnce([mockOrder]),
  //     });

  //     await orderController.getAllOrderDeleted(req, res);

  //     expect(Order.find).toHaveBeenCalledWith({ deletedAt: { $ne: null } });
  //     expect(Order.find().populate).toHaveBeenCalledTimes(2);
  //     //expect(res.json).toHaveBeenCalledWith({ orders: [mockOrder] });
  //   });

  //   // it("should handle error", async () => {
  //   //   const req = mockReq();
  //   //   const res = mockRes();
  //   //   Order.find.mockReturnValueOnce({
  //   //     populate: jest.fn().mockReturnThis(),
  //   //     exec: jest.fn().mockRejectedValueOnce(new Error("Error")),
  //   //   });

  //   //   await orderController.getAllOrderDeleted(req, res);

  //   //   expect(res.status).toHaveBeenCalledWith(500);
  //   //   expect(res.json).toHaveBeenCalledWith(new Error("Error"));
  //   // });
  // });
});
