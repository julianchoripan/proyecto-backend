// import { jest } from "@jest/globals";

// // Mock de los datos de los productos, órdenes y usuario
// const mockProduct = {
//   _id: "productId",
//   name: "mockProduct",
//   description: "This is a mock product",
//   price: 100,
//   brand: "mockBrand",
//   category: "mockCategory",
//   stock: 10,
// };

// const mockOrder = {
//   _id: "orderId",
//   user: "userId",
//   products: [{ product: mockProduct, quantity: 2 }],
//   total: 200,
//   shippingAdress: "123 Mock St.",
//   paymentMethod: "creditCard",
//   deletedAt: null,
//   createdAt: new Date(),
//   updatedAt: new Date(),
// };

// const mockUser = {
//   _id: "userId",
//   username: "mockUser",
//   firstName: "Mock",
//   lastName: "User",
//   email: "mockuser@example.com",
//   password: "mockpassword",
//   age: 25,
//   address: "123 Street, City, Country",
//   phoneNumber: "1234567890",
//   deletedAt: null,
//   image: "mockImage.jpg",
//   createdAt: new Date(),
//   updatedAt: new Date(),
// };

// // Mock de los modelos de Mongoose
// jest.unstable_mockModule("../models/Order.js", () => {
//   const find = jest.fn().mockReturnThis();
//   const findOne = jest.fn().mockReturnThis();
//   const populate = jest.fn().mockReturnThis();
//   const create = jest.fn();
//   const findByIdAndUpdate = jest.fn();
//   const findById = jest.fn();
//   return {
//     default: {
//       find,
//       findOne,
//       create,
//       findByIdAndUpdate,
//       findById,
//       populate,
//     },
//   };
// });

// jest.unstable_mockModule("../models/Product.js", () => {
//   const findById = jest.fn().mockReturnThis();
//   return {
//     default: {
//       findById,
//     },
//   };
// });

// jest.unstable_mockModule("../models/User.js", () => {
//   const find = jest.fn().mockReturnThis();
//   const findOne = jest.fn().mockReturnThis();
//   const select = jest.fn().mockReturnThis();
//   const populate = jest.fn().mockReturnThis();
//   return {
//     default: {
//       find,
//       findOne,
//       create: jest.fn(),
//       findByIdAndUpdate: jest.fn(),
//       findById: jest.fn(),
//       select,
//       populate,
//     },
//   };
// });

// // Importar los módulos después de los mocks
// const { default: Order } = await import("../models/Order.js");
// const { default: Product } = await import("../models/Product.js");
// const { default: User } = await import("../models/User.js");
// const orderControllerModule = await import("../controllers/orderController.js");
// const orderController = orderControllerModule.default;

// // Función mock para el objeto `req` (request) de Express
// const mockReq = (data = {}, params = {}) => ({
//   body: { ...data },
//   params: { ...params },
//   auth: { id: "userId" },
// });

// // Función mock para el objeto `res` (response) de Express
// const mockRes = () => {
//   const res = {};
//   res.status = jest.fn().mockReturnValue(res); // mock de status
//   res.json = jest.fn().mockReturnValue(res); // mock de json
//   return res;
// };

// describe("Order Controller with Mocks", () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   describe("getAll", () => {
//     it("should return all orders", async () => {
//       Order.find.mockReturnThis();
//       Order.populate.mockReturnThis();
//       Order.find.mockResolvedValue([mockOrder]);

//       const req = mockReq();
//       const res = mockRes();

//       await orderController.getAll(req, res);

//       expect(Order.find).toHaveBeenCalledWith({ deletedAt: { $eq: null } });
//       expect(Order.populate).toHaveBeenCalledWith("user", ["-password"]);
//       expect(Order.populate).toHaveBeenCalledWith("products.product");
//       expect(res.json).toHaveBeenCalledWith({ orders: [mockOrder] });
//     });

//     it("should handle errors", async () => {
//       Order.find.mockRejectedValue(new Error("Internal server error"));

//       const req = mockReq();
//       const res = mockRes();

//       await orderController.getAll(req, res);

//       expect(res.status).toHaveBeenCalledWith(500);
//       expect(res.json).toHaveBeenCalledWith("Internal server error");
//     });
//   });
// });
