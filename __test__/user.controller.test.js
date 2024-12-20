import { jest } from "@jest/globals";

// Mock de los datos del usuario
const mockUser = {
  _id: "userId",
  username: "mockUser",
  firstName: "Mock",
  lastName: "User",
  email: "mockuser@example.com",
  password: "mockpassword",
  age: 25,
  address: "123 Street, City, Country",
  phoneNumber: "1234567890",
  deletedAt: null,
  image: "mockImage.jpg",
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Mock de los modelos de Mongoose
jest.unstable_mockModule("../models/User.js", () => {
  const find = jest.fn().mockReturnThis();
  const findOne = jest.fn().mockReturnThis();
  const select = jest.fn();
  return {
    default: {
      find,
      findOne,
      create: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findById: jest.fn(),
      select,
    },
  };
});

// Importar los módulos después de los mocks
const { default: User } = await import("../models/User.js");
const userControllerModule = await import("../controllers/userController.js");
const userController = userControllerModule.default;

// Función mock para el objeto `req` (request) de Express
const mockReq = (data = {}, file = { filename: "test.jpg" }) => ({
  body: { ...data },
  params: { id: "userId" },
  auth: { id: "userId" },
  file,
});

// Función mock para el objeto `res` (response) de Express
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res); // mock de status
  res.json = jest.fn().mockReturnValue(res); // mock de json
  return res;
};

describe("User Controller with Mocks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createUser", () => {
    it("should create a new user", async () => {
      //validationResult.mockReturnValue({ isEmpty: () => true });
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue(mockUser);

      const req = mockReq({
        username: "newuser",
        email: "newuser@example.com",
        password: "password",
      });
      const res = mockRes();

      await userController.createUser(req, res);

      // expect(validationResult).toHaveBeenCalledWith(req);
      expect(User.create).toHaveBeenCalledWith({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email.toLowerCase(),
        password: req.body.password,
        age: req.body.age,
        address: req.body.address,
        phoneNumber: req.body.phoneNumber,
        image: req?.file?.filename,
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });
  });

  describe("getUserById", () => {
    it("should return a user by ID", async () => {
      const selectMock = jest.fn().mockResolvedValue(mockUser);
      User.findOne.mockReturnValue({ select: selectMock });
      const req = mockReq();
      const res = mockRes();
      await userController.getUserById(req, res);
      expect(User.findOne).toHaveBeenCalledWith({
        _id: req.auth.id,
        deletedAt: { $eq: null },
      });

      expect(selectMock).toHaveBeenCalledWith("-password");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it("should return 404 if user not found", async () => {
      const selectMock = jest.fn().mockResolvedValue(null);
      User.findOne.mockReturnValue({ select: selectMock });
      const req = mockReq();
      const res = mockRes();
      await userController.getUserById(req, res);

      expect(User.findOne).toHaveBeenCalledWith({
        _id: req.auth.id,
        deletedAt: { $eq: null },
      });
      expect(selectMock).toHaveBeenCalledWith("-password");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });

    it("should handle server errors", async () => {
      const selectMock = jest.fn().mockRejectedValue(new Error("Server error"));
      User.findOne.mockReturnValue({ select: selectMock });
      const req = mockReq();
      const res = mockRes();
      await userController.getUserById(req, res);
      expect(User.findOne).toHaveBeenCalledWith({
        _id: req.auth.id,
        deletedAt: { $eq: null },
      });
      expect(selectMock).toHaveBeenCalledWith("-password");
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ ok: false, msg: "Server error" });
    });
  });

  describe("getAllUsers", () => {
    it("should return all users", async () => {
      const selectMock = jest.fn().mockResolvedValue([mockUser]);

      User.find.mockReturnValue({ select: selectMock });

      const req = mockReq();
      const res = mockRes();

      await userController.getAllUsers(req, res);

      expect(User.find).toHaveBeenCalledWith({ deletedAt: { $eq: null } });
      expect(selectMock).toHaveBeenCalledWith("-password");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ ok: true, users: [mockUser] });
    });

    it("should handle errors", async () => {
      const selectMock = jest.fn().mockRejectedValue(new Error("Server error"));

      User.find.mockReturnValue({ select: selectMock });

      const req = mockReq();
      const res = mockRes();

      await userController.getAllUsers(req, res);

      expect(User.find).toHaveBeenCalledWith({ deletedAt: { $eq: null } });
      expect(selectMock).toHaveBeenCalledWith("-password");
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ ok: false, msg: "Server error" });
    });
  });

  describe("updateUser", () => {
    it("should update user data", async () => {
      User.findByIdAndUpdate.mockResolvedValue(mockUser);
      const req = mockReq({ username: "updateduser" });
      const res = mockRes();
      await userController.updateUser(req, res);
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        req.auth.id,
        req.body,
        { new: true }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "User updated successfully",
        user: mockUser,
      });
    });
    it("should return 404 if user not found", async () => {
      User.findByIdAndUpdate.mockResolvedValue(null);
      const req = mockReq();
      const res = mockRes();
      await userController.updateUser(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });
  });

  describe("updateUser", () => {
    it("should update user data", async () => {
      User.findByIdAndUpdate.mockResolvedValue(mockUser);

      const req = mockReq({ username: "updateduser" });
      const res = mockRes();

      await userController.updateUser(req, res);

      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        req.auth.id,
        req.body,
        {
          new: true,
        }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "User updated successfully",
        user: mockUser,
      });
    });

    it("should return 404 if user not found", async () => {
      User.findByIdAndUpdate.mockResolvedValue(null);

      const req = mockReq();
      const res = mockRes();

      await userController.updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });
  });

  describe("deleteUser", () => {
    it("should delete a user", async () => {
      const saveMock = jest.fn().mockResolvedValue(undefined);
      User.findById.mockResolvedValue({
        ...mockUser,
        save: saveMock,
      });

      const req = mockReq();
      const res = mockRes();

      await userController.deleteUser(req, res);

      expect(User.findById).toHaveBeenCalledWith(req.params.id);
      expect(saveMock).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "User deleted successfully",
      });
    });

    it("should return 404 if user not found", async () => {
      User.findById.mockResolvedValue(null);

      const req = mockReq();
      const res = mockRes();

      await userController.deleteUser(req, res);

      expect(User.findById).toHaveBeenCalledWith(req.params.id);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });
  });
});
