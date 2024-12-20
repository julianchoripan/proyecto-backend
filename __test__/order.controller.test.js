// // // import { jest } from "@jest/globals";
// // // import { validationResult } from "express-validator";
// // // import { mockReq, mockRes } from "../__mocks__/mockReqRes"; // Importar correctamente los mocks

// // // // Mock data
// // // const mockUser = {
// // //   _id: "userId",
// // //   username: "mockUser",
// // //   firstName: "Mock",
// // //   lastName: "User",
// // //   email: "mockuser@example.com",
// // //   password: "mockpassword",
// // // };

// // // const mockProduct = {
// // //   _id: "productId",
// // //   name: "Mock Product",
// // //   description: "Mock Product Description",
// // //   price: 100,
// // //   brand: "Mock Brand",
// // //   category: "Mock Category",
// // //   stock: 50,
// // // };

// // // const mockOrder = {
// // //   _id: "orderId",
// // //   user: mockUser._id,
// // //   products: [{ product: mockProduct._id, quantity: 1 }],
// // //   total: 100,
// // //   shippingAdress: "123 Street",
// // //   paymentMethod: "creditCard",
// // // };

// // // // Mock de modelos de Mongoose
// // // jest.unstable_mockModule("../models/Order.js", () => {
// // //   const populate = jest.fn().mockReturnThis(); // Simula la cadena de llamadas de populate
// // //   const exec = jest.fn().mockResolvedValue([mockOrder]); // Devuelve mockOrder cuando se llama a exec

// // //   const Order = {
// // //     find: jest.fn().mockReturnValue({ populate, exec }),
// // //     findOne: jest.fn().mockReturnValue({ populate, exec }),
// // //     create: jest.fn().mockResolvedValue(mockOrder),
// // //     findById: jest.fn().mockReturnValue({ populate, exec }),
// // //   };

// // //   return { default: Order };
// // // });

// // // jest.unstable_mockModule("../models/Product.js", () => ({
// // //   default: {
// // //     findById: jest.fn(),
// // //   },
// // // }));

// // // jest.unstable_mockModule("../models/User.js", () => ({
// // //   default: {
// // //     findById: jest.fn(),
// // //   },
// // // }));

// // // // Mock de express-validator
// // // jest.mock("express-validator", () => ({
// // //   validationResult: jest.fn().mockReturnValue({
// // //     isEmpty: jest.fn().mockReturnValue(true),
// // //   }),
// // // }));

// // // // Importar los módulos después de los mocks
// // // const { default: Order } = await import("../models/Order.js");
// // // const { default: Product } = await import("../models/Product.js");
// // // const { default: User } = await import("../models/User.js");
// // // const orderControllerModule = await import("../controllers/orderController.js");
// // // const orderController = orderControllerModule.default;

// // // describe("Order Controller with Mocks", () => {
// // //   beforeEach(() => {
// // //     jest.clearAllMocks();
// // //   });

// // //   it("should create an order", async () => {
// // //     Order.create.mockResolvedValue(mockOrder); // Mock de la creación de la orden

// // //     const req = mockReq({
// // //       products: [{ product: "productId", quantity: 1 }],
// // //       shippingAdress: "123 Street",
// // //       paymentMethod: "creditCard",
// // //       total: 100,
// // //     });
// // //     const res = mockRes();

// // //     // Llamamos al controlador
// // //     await orderController.createOrder(req, res);

// // //     // Verificamos que validationResult se haya llamado correctamente
// // //     expect(validationResult).toHaveBeenCalledWith(req);

// // //     // Verificamos que Order.create fue llamada con los parámetros correctos
// // //     expect(Order.create).toHaveBeenCalledWith({
// // //       user: req.auth.id,
// // //       products: req.body.products,
// // //       total: req.body.total,
// // //       shippingAdress: req.body.shippingAdress,
// // //       paymentMethod: req.body.paymentMethod,
// // //     });
// // //     expect(res.status).toHaveBeenCalledWith(201);
// // //     expect(res.json).toHaveBeenCalledWith({
// // //       message: "Order created successfully",
// // //       order: mockOrder,
// // //     });
// // //   });

// // //   it("should get all orders", async () => {
// // //     Order.find().populate.mockReturnValue({
// // //       populate: jest.fn().mockResolvedValue([mockOrder]),
// // //     });

// // //     const req = mockReq();
// // //     const res = mockRes();

// // //     await orderController.getAll(req, res);

// // //     expect(Order.find).toHaveBeenCalledWith({ deletedAt: { $eq: null } });
// // //     expect(Order.find().populate).toHaveBeenCalledWith(
// // //       expect.arrayContaining(["user", "products.product"])
// // //     );
// // //     expect(res.json).toHaveBeenCalledWith({ orders: [mockOrder] });
// // //   });

// // //   it("should get an order by ID", async () => {
// // //     Order.findOne().populate.mockReturnValue({
// // //       populate: jest.fn().mockResolvedValue(mockOrder),
// // //     });

// // //     const req = mockReq();
// // //     const res = mockRes();

// // //     await orderController.getOrderById(req, res);

// // //     expect(Order.findOne).toHaveBeenCalledWith({
// // //       _id: req.params.id,
// // //       deletedAt: { $eq: null },
// // //     });
// // //     expect(Order.find().populate).toHaveBeenCalledWith(
// // //       expect.arrayContaining(["user", "products.product"])
// // //     ); // Asegurado que sea correcto
// // //     expect(res.json).toHaveBeenCalledWith({ order: mockOrder });
// // //   });

// // //   it("should update an order", async () => {
// // //     Order.findOne.mockResolvedValue({
// // //       ...mockOrder,
// // //       save: jest.fn(),
// // //     });

// // //     const req = mockReq({ total: 200 });
// // //     const res = mockRes();

// // //     await orderController.updateOrder(req, res);

// // //     expect(Order.findOne).toHaveBeenCalledWith({
// // //       _id: req.params.id,
// // //       deletedAt: { $eq: null },
// // //     });
// // //     expect(res.json).toHaveBeenCalledWith("La orden ha sido actualizada");
// // //   });

// // //   it("should delete an order", async () => {
// // //     Order.findById.mockResolvedValue({
// // //       ...mockOrder,
// // //       save: jest.fn(),
// // //     });

// // //     const req = mockReq();
// // //     const res = mockRes();

// // //     await orderController.destroyOrder(req, res);

// // //     expect(Order.findById).toHaveBeenCalledWith(req.params.id);
// // //     expect(res.json).toHaveBeenCalledWith("se ha eliminado la orden");
// // //   });
// // // });

// // import { jest } from "@jest/globals";
// // import { validationResult } from "express-validator"; // Asegúrate de importar validationResult

// // // Mock de los modelos
// // const mockUser = {
// //   _id: "userId",
// //   username: "mockUser",
// //   firstName: "Mock",
// //   lastName: "User",
// //   email: "mockuser@example.com",
// //   password: "mockpassword",
// // };

// // const mockProduct = {
// //   _id: "productId",
// //   name: "Mock Product",
// //   description: "Mock Product Description",
// //   price: 100,
// //   brand: "Mock Brand",
// //   category: "Mock Category",
// //   stock: 50,
// // };

// // const mockOrder = {
// //   _id: "orderId",
// //   user: mockUser._id,
// //   products: [{ product: mockProduct._id, quantity: 1 }],
// //   total: 100,
// //   shippingAdress: "123 Street",
// //   paymentMethod: "creditCard",
// // };

// // // Mock de los modelos de Mongoose
// // jest.unstable_mockModule("../models/Order.js", () => {
// //   const populate = jest.fn().mockReturnThis(); // Simula la cadena de llamadas de populate
// //   const exec = jest.fn().mockResolvedValue([mockOrder]); // Devuelve mockOrder cuando se llama a exec

// //   const Order = {
// //     find: jest
// //       .fn()
// //       .mockReturnValue({ populate: { populate: jest.fn().mockReturnThis() } }),
// //     findOne: jest.fn().mockReturnValue({ populate, exec }),
// //     create: jest.fn().mockResolvedValue(mockOrder),
// //     findById: jest.fn().mockReturnValue({ populate, exec }),
// //   };

// //   return { default: Order };
// // });

// // jest.unstable_mockModule("../models/Product.js", () => ({
// //   default: {
// //     findById: jest.fn(),
// //   },
// // }));

// // jest.unstable_mockModule("../models/User.js", () => ({
// //   default: {
// //     findById: jest.fn(),
// //   },
// // }));

// // // Mock de express-validator
// // jest.mock("express-validator", () => ({
// //   validationResult: jest.fn().mockReturnValue({
// //     isEmpty: jest.fn().mockReturnValue(true), // Simula que no hay errores
// //   }),
// // }));

// // // Importar los módulos después de los mocks
// // const { default: Order } = await import("../models/Order.js");
// // const { default: Product } = await import("../models/Product.js");
// // const { default: User } = await import("../models/User.js");
// // const orderControllerModule = await import("../controllers/orderController.js");
// // const orderController = orderControllerModule.default; // Asegúrate de importar default

// // // Función mock para el objeto `req` (request) de Express
// // const mockReq = (data = {}) => ({
// //   body: { ...data },
// //   params: { id: "orderId" },
// //   auth: { id: "userId" },
// // });

// // // Función mock para el objeto `res` (response) de Express
// // const mockRes = () => {
// //   const res = {};
// //   res.status = jest.fn().mockReturnValue(res); // mock de status
// //   res.json = jest.fn().mockReturnValue(res); // mock de json
// //   return res;
// // };

// // describe("Order Controller with Mocks", () => {
// //   beforeEach(() => {
// //     jest.clearAllMocks();
// //   });

// //   it("should create an order", async () => {
// //     Order.create.mockResolvedValue(mockOrder);

// //     const req = mockReq({
// //       products: [{ product: "productId", quantity: 1 }],
// //       shippingAdress: "123 Street",
// //       paymentMethod: "creditCard",
// //       total: 100,
// //     });
// //     const res = mockRes();

// //     await orderController.createOrder(req, res);

// //     // Verificamos que validationResult se haya llamado correctamente
// //     expect(validationResult).toHaveBeenCalledWith(req);
// //     // Verificamos que Order.create fue llamada con los parámetros correctos
// //     expect(Order.create).toHaveBeenCalledWith({
// //       user: req.auth.id,
// //       products: req.body.products,
// //       total: req.body.total,
// //       shippingAdress: req.body.shippingAdress,
// //       paymentMethod: req.body.paymentMethod,
// //     });
// //     expect(res.status).toHaveBeenCalledWith(201);
// //     expect(res.json).toHaveBeenCalledWith({
// //       message: "Order created successfully",
// //       order: mockOrder,
// //     });
// //   });

// //   it("should get all orders", async () => {
// //     Order.find()
// //       .populate()
// //       .populate.mockReturnValue({
// //         populate: jest.fn().mockResolvedValue([mockOrder]),
// //       });

// //     const req = mockReq();
// //     const res = mockRes();

// //     await orderController.getAll(req, res);
// //     console.log("response-->get all", res);
// //     expect(Order.find).toHaveBeenCalledWith({ deletedAt: { $eq: null } });
// //     expect(Order.find().populate.populate).toHaveBeenCalledWith(
// //       expect.arrayContaining(["user", "products.product"])
// //     );

// //     expect(res.json).toHaveBeenCalledWith({ orders: [mockOrder] });
// //   });

// //   it("should get an order by ID", async () => {
// //     Order.findOne().populate.mockReturnValue({
// //       populate: jest.fn().mockResolvedValue(mockOrder),
// //     });

// //     const req = mockReq();
// //     const res = mockRes();

// //     await orderController.getOrderById(req, res);

// //     expect(Order.findOne).toHaveBeenCalledWith({
// //       _id: req.params.id,
// //       deletedAt: { $eq: null },
// //     });
// //     expect(Order.find().populate).toHaveBeenCalledWith(
// //       expect.arrayContaining(["user", "products.product"])
// //     ); // Asegurado que sea correcto
// //     expect(res.json).toHaveBeenCalledWith({ order: mockOrder });
// //   });

// //   it("should update an order", async () => {
// //     Order.findOne.mockResolvedValue({
// //       ...mockOrder,
// //       save: jest.fn(),
// //     });

// //     const req = mockReq({ total: 200 });
// //     const res = mockRes();

// //     await orderController.updateOrder(req, res);

// //     expect(Order.findOne).toHaveBeenCalledWith({
// //       _id: req.params.id,
// //       deletedAt: { $eq: null },
// //     });
// //     expect(res.json).toHaveBeenCalledWith("La orden ha sido actualizada");
// //   });

// //   it("should delete an order", async () => {
// //     Order.findById.mockResolvedValue({
// //       ...mockOrder,
// //       save: jest.fn(),
// //     });

// //     const req = mockReq();
// //     const res = mockRes();

// //     await orderController.destroyOrder(req, res);

// //     expect(Order.findById).toHaveBeenCalledWith(req.params.id);
// //     expect(res.json).toHaveBeenCalledWith("se ha eliminado la orden");
// //   });
// // });
// ////////////////
// /////////////////
// //////////////

// describe("getOrderById", () => {
//     it("should return an order by ID", async () => {
//       Order.findOne.mockReturnThis();
//       Order.populate.mockReturnThis();
//       Order.findOne.mockResolvedValue(mockOrder);

//       const req = mockReq({}, { id: "orderId" });
//       const res = mockRes();

//       await orderController.getOrderById(req, res);

//       expect(Order.findOne).toHaveBeenCalledWith({
//         _id: "orderId",
//         deletedAt: { $eq: null },
//       });
//       expect(Order.populate).toHaveBeenCalledWith("user", ["-password"]);
//       expect(Order.populate).toHaveBeenCalledWith("products.product");
//       expect(res.json).toHaveBeenCalledWith({ order: mockOrder });
//     });

//     it("should handle errors", async () => {
//       Order.findOne.mockRejectedValue(new Error("Orden no encontrada"));

//       const req = mockReq({}, { id: "orderId" });
//       const res = mockRes();

//       await orderController.getOrderById(req, res);

//       expect(res.status).toHaveBeenCalledWith(500);
//       expect(res.json).toHaveBeenCalledWith("Orden no encontrada");
//     });
//   });

//   describe("createOrder", () => {
//     it("should create a new order", async () => {
//       Order.create.mockResolvedValue(mockOrder);

//       const req = mockReq({
//         products: [{ product: mockProduct._id, quantity: 2 }],
//         shippingAdress: "123 Mock St.",
//         paymentMethod: "creditCard",
//         total: 200,
//       });
//       const res = mockRes();

//       await orderController.createOrder(req, res);

//       expect(Order.create).toHaveBeenCalledWith({
//         user: req.auth.id,
//         products: req.body.products,
//         total: req.body.total,
//         shippingAdress: req.body.shippingAdress,
//         paymentMethod: req.body.paymentMethod,
//       });
//       expect(res.status).toHaveBeenCalledWith(201);
//       expect(res.json).toHaveBeenCalledWith({
//         message: "Order created successfully",
//         order: mockOrder,
//       });
//     });

//     it("should handle errors", async () => {
//       Order.create.mockRejectedValue(new Error("Internal server error"));

//       const req = mockReq({
//         products: [{ product: mockProduct._id, quantity: 2 }],
//         shippingAdress: "123 Mock St.",
//         paymentMethod: "creditCard",
//         total: 200,
//       });
//       const res = mockRes();

//       await orderController.createOrder(req, res);

//       expect(res.status).toHaveBeenCalledWith(500);
//       expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
//     });
//   });

//   describe("updateOrder", () => {
//     it("should update an existing order", async () => {
//       Order.findOne.mockResolvedValue(mockOrder);
//       Order.findByIdAndUpdate.mockResolvedValue(mockOrder);

//       const req = mockReq(
//         {
//           products: [{ product: mockProduct._id, quantity: 3 }],
//           shippingAdress: "456 Updated St.",
//           paymentMethod: "cash",
//           total: 300,
//         },
//         { id: "orderId" }
//       );
//       const res = mockRes();

//       await orderController.updateOrder(req, res);

//       expect(Order.findOne).toHaveBeenCalledWith({
//         _id: "orderId",
//         deletedAt: { $eq: null },
//       });
//       expect(Order.findByIdAndUpdate).toHaveBeenCalledWith(
//         "orderId",
//         {
//           $set: {
//             products: req.body.products,
//             shippingAdress: req.body.shippingAdress,
//             paymentMethod: req.body.paymentMethod,
//             total: req.body.total,
//           },
//         },
//         { new: true }
//       );
//       expect(res.json).toHaveBeenCalledWith("La orden ha sido actualizada");
//     });

//     it("should handle errors", async () => {
//       Order.findOne.mockRejectedValue(new Error("Internal server error"));

//       const req = mockReq({}, { id: "orderId" });
//       const res = mockRes();

//       await orderController.updateOrder(req, res);

//       expect(res.status).toHaveBeenCalledWith(500);
//       expect(res.json).toHaveBeenCalledWith({
//         message: "Internal server error",
//       });
//     });
//   });

//   describe("destroyOrder", () => {
//     it("should delete an order", async () => {
//       Order.findById.mockResolvedValue(mockOrder);
//       Order.findByIdAndUpdate.mockResolvedValue({
//         ...mockOrder,
//         deletedAt: new Date(),
//       });

//       const req = mockReq({}, { id: "orderId" });
//       const res = mockRes();

//       await orderController.destroyOrder(req, res);

//       expect(Order.findById).toHaveBeenCalledWith("orderId");
//       expect(Order.findByIdAndUpdate).toHaveBeenCalledWith({
//         message: "Internal server error",
//       });
//     });
//   });
