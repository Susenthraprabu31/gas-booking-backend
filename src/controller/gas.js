import User from "../model/users.js";
import Booking from "../model/gas.js";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import Razorpay from "razorpay";

dotenv.config();

const registerUser = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    if (!name || !email || !mobile || !password) {
      return res.status(400).send({ message: "All fields are required!" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .send({ message: "User with this email already exists!" });
    }

    const hashpassword = await bcryptjs.hash(password, 10);

    const newUser = new User({ name, email, mobile, password: hashpassword });
    await newUser.save();

    res.status(200).send({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).send({ message: "Oops! Registration was failed!" });
  }
};

 const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userDetail = await User.findOne({ email });
    if (!userDetail) {
      return res.status(401).send({ message: "user not found!" });
    }
    const passwordMatch = await bcryptjs.compare(password, userDetail.password);
    if (!passwordMatch) {
      return res.status(401).send({ message: "Invalid password!" });
    }
    res.status(200).send({ message: "User login successfully!" });
  } catch (error) {
    res.status(500).send({ message: "Login was failed!" });
  }
};

 const bookGas = async (req, res) => {        
  try {
    const { email, product, quantity, name, address, date, timeSlot, mobile, totalPrice } = req.body;

    if (!email || !product || !quantity || !name || !address || !date || !timeSlot || !mobile || !totalPrice) {
      return res.status(400).send({ message: "All fields are mandatory!" });
    }

    const newBooking = new Booking({
      email,
      product,
      quantity,
      name,
      address,
      date,
      timeSlot,
      mobile,
      totalPrice,
      paymentStatus: "Pending",
    });
    await newBooking.save();

    const razorpay = new Razorpay({
      key_id: process.env.RAZOR_PAY_ID,
      key_secret: process.env.RAZOR_PAY_SECRET_KEY,
    });

    const options = {
      amount: Number(totalPrice) * 100,
      currency: "INR",
      receipt: newBooking._id.toString(),
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    if (!order || order.status !== 'created') {
      return res.status(500).send({ message: "Error in placing Razorpay order!" });
    }

    
    newBooking.razorpayOrderId = order.id;
    await newBooking.save();

    res.status(200).send({
      message: "Your order has been placed successfully!",
      order,
    });

    console.log(newBooking);
  } catch (error) {
    console.error("Error in bookGas:", error);
    res.status(500).send({ message: "An error occurred while placing the order!" });
  }
};

const razorpayWeb = async (req, res) => {
  try {
    const { event, payload } = req.body;

    if (event === "payment.captured") {
      const { order_id } = payload.payment.entity;
      const booking = await Booking.findOne({ razorpayOrderId: order_id });

      if (booking) {
        booking.paymentStatus = "Paid";
        await booking.save();
        res.status(200).send({ message: "Payment status updated" });
      } else {
        res.status(404).send({ message: "Booking not found" });
      }
    } else {
      res.status(400).send({ message: "Event not handled" });
    }
  } catch (error) {
    console.error("Error in razorpayWebhook:", error);
    res.status(500).send({ message: "Error in webhook handler" });
  }
};
const getAllUsers = async (req, res) => {
    try {
        let users = await usersModel.find({},{_id:0})
        res.status(200).send({
            message: "Data Fetch Successfull",
            data: users
        })
    } catch (error) {
        console.log(`Error in ${req.originalUrl}`,error.message)
        res.status(500).send({ message: error.message || "Internal Server Error" })
    }
}

export default{
    registerUser,
    loginUser,
    bookGas,
    razorpayWeb,
    getAllUsers
}