import gasModel from '../model/gas.js'
import config from '../utils/config.js'
import Razorpay from 'razorpay';




const bookgas = async (req, res) => {
    try {
        let gas = await gasModel.findOne({ email: req.body.email, product: req.body.product,totalPrice:req.body.totalPrice })
        if (!gas) {
            gas = await gasModel.create(req.body)
            res.status(201).send({
                message: "Gas booked successfully",
            })
        } else {
            res.status(400).send({
                message: "Gas already booked",
            })
        }
        const Booking = new gasModel({
            email,
            product,
            quantity,
            fullName,
            address,
            date,
            timeSlot,
            phoneNumber,
            totalPrice,
            paymentStatus: "Pending",
        });
        await Booking.save();

        const options = {
            amount: Number(totalPrice) * 100,
            currency: "INR",
            receipt: newBooking._id.toString(),
            payment_capture: 1,
          };

        const razorpay = new Razorpay({
            key_id: config.KEY_ID,
            key_secret: config.KEY_SECRET,
        });

        const order = await razorpay.orders.create(options);

        if (!order == 'created') {
            return res.status(500).send({ message: "Error in placing order!" });
        }

        booking.razorpayOrderId = order.id;
        await booking.save();

        res.status(200).send({
            message: "Your order has been placed successfully!",
            order
        })



    } catch (error) {
        console.log(`Error in ${req.originalUrl}`, error.message)
        res.status(500).send({ message: error.message || "Internal Server Error" })
    }
}

                

               
const getAllBookGas = async (req, res) => {
    try {
        let gas = await gasModel.find({},{_id:0})
        res.status(200).send({
            message: "Data Fetch Successfull",
            data: gas
        })
    } catch (error) {
        console.log(`Error in ${req.originalUrl}`,error.message)
        res.status(500).send({ message: error.message || "Internal Server Error" })
    }
}


const razorpay = async (req, res) => {
    try {
      const { event, payload } = req.body;
  
      if (event === "payment.captured") {
        const { order_id } = payload.payment.entity;
        const booking = await gasModel.findOne({ razorpayOrderId: order_id });
  
        if (booking) {
          booking.paymentStatus = "Paid";
          await booking.save();
          res.status(200).send({ message: "Payment status updated" });
        } else {
          res.status(400).send({ message: "Booking not found" });
        }
      } else {
        res.status(400).send({ message: "Error Occured" });
      }
    } catch (error) {
        console.log(`Error in ${req.originalUrl}`,error.message)
        res.status(500).send({ message: error.message || "Internal Server Error" })
    }
}




export default{
    bookgas,
    getAllBookGas,
    razorpay

   
}