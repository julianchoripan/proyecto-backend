import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
//import { validationResult } from "express-validator";

async function getAll(req, res) {
  try {
    const orders = await Order.find({ deletedAt: { $eq: null } })
      .populate("user", ["-password"])
      .populate("products.product"); //Revisar
    console.log("Populate products:---->", orders);
    if (orders) {
      return res.json({ orders: orders });
    } else {
      return res.json("No hay ordenes creadas");
    }
  } catch (error) {
    //console.log(error)
    return res.status(500).json("Internal server error");
  }
}
async function getOrderById(req, res) {
  try {
    const orderId = req.params.id;
    const orderFound = await Order.findOne({
      _id: orderId,
      deletedAt: { $eq: null },
    })
      .populate("user", ["-password"])
      .populate("products.product"); //Revisar
    if (orderFound) {
      console.log("------------", orderFound);
      return res.json({ order: orderFound });
    } else {
      return res.json("No se encontró la orden");
    }
  } catch (error) {
    //console.log(error);
    return res.status(500).json("Orden no encontrada");
  }
}
async function createOrder(req, res) {
  //console.log("Req.body--->", req.body);
  try {
    const { products, shippingAdress, paymentMethod, total } = req.body;
    console.log("products--->", products.product);
    const newOrder = await Order.create({
      user: req.auth.id,
      products, //disminuir el producto en entidad productos
      //total: await calculateTotal(products), //calcular
      total,
      shippingAdress,
      paymentMethod,
    });
    //console.log(newOrder);
    //calculateStock(products);
    return res.status(201).json({
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {
    console.log("Error--->", error);
    return res.status(500).json({ error: error });
  }
}
async function updateOrder(req, res) {
  try {
    const orderId = req.params.id;
    const orderToUpdate = await Order.findOne({
      _id: orderId,
      deletedAt: { $eq: null },
    }); //?

    if (orderToUpdate !== null) {
      const { products, shippingAdress, paymentMethod, total } = req.body;
      orderToUpdate.user = req.auth.id || orderToUpdate.user;
      orderToUpdate.products = products || orderToUpdate.products;
      orderToUpdate.total = total || orderToUpdate.total;
      orderToUpdate.shippingAdress =
        shippingAdress || orderToUpdate.shippingAdress;
      orderToUpdate.paymentMethod =
        paymentMethod || orderToUpdate.paymentMethod;

      await orderToUpdate.save();

      return res.json("La orden ha sido actualizada");
    } else {
      return res.json("No existe una orden con el ID mencionado");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
async function destroyOrder(req, res) {
  try {
    const orderDeleted = await Order.findById(req.params.id);
    orderDeleted.deletedAt = Date.now();
    orderDeleted.save();
    console.log(orderDeleted);
    return res.json("se ha eliminado la orden");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
async function getAllOrderDeleted(req, res) {
  try {
    const orders = await Order.find({ deletedAt: { $ne: null } })
      .populate("user", ["-password"])
      .populate("products.product");
    console.log(orders);
    if (orders) {
      return res.json({ orders: orders });
    } else {
      return res.json("No hay ordenes creadas");
    }
  } catch (error) {
    //console.log(error)
    return res.status(500).json(error);
  }
}
async function calculateTotal(products) {
  let calculateTotal = 0;
  for (let i = 0; i < products.length; i++) {
    const getProductId = products[i].product;

    const getOrderQuantity = products[i].quantity;

    const getProductPrice = await Product.findById({
      _id: getProductId,
    }).select("price");
    calculateTotal += getProductPrice.price * getOrderQuantity;
  }
  return calculateTotal;
}
async function calculateStock(products) {
  try {
    //console.log(products);
    let updateStock = 0;
    for (let i = 0; i < products.length; i++) {
      //console.log(products.length);

      const getProductId = products[i].product;

      // console.log("id-->", getProductId);

      const getProductQuantity = products[i].quantity;

      //  console.log("cantidad-->", getProductQuantity);

      const getProductStock = await Product.findById({
        _id: getProductId,
      }).select("stock");

      // console.log("Antes-->", getProductStock);

      if (
        getProductQuantity <= getProductStock.stock &&
        getProductQuantity > 0
      ) {
        updateStock = getProductStock.stock - getProductQuantity;
        getProductStock.stock = updateStock || getProductStock.stock;

        //console.log("Despues -->", getProductStock);

        await getProductStock.save();
      }
    }
  } catch (error) {
    throw new Error("Error actualizando stock");
  }
}

export default {
  getAll,
  getOrderById,
  createOrder,
  updateOrder,
  destroyOrder,
  getAllOrderDeleted,
};
