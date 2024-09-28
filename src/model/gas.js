import mongoose from "./index.js";
import validators from "../utils/validators.js";


const gasSchema = new mongoose.Schema({
    
    email: {
        type: String,
        required: [true, "Email is required"],
        validate: {
            validator: validators.validateEmail,
            message: props => `${props.value} is not a valid email!`
        }
    },
    product: {
        type: String,
        required: [true, "Product is required"]
    },
    quantity: {
        type: String,
        required: [true, "Quantity is required"]
    },
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    address: {
        type: String,
        required: [true, "Address is required"]
    },
    date: {
        type: String,

    },
    timeSlot: {
        type: String,
        required: [true, "Timeslot is required"]
    },
    mobile: {
        type: String,
        required: [true, "Mobile is required"],
        validate: {
            validator: validators.validateMobile,
            message: props => `${props.value} is not a valid mobile number!`
        }
    },
    totalPrice: {
        type: String,
        required: [true, "Total Price is required"]
    },
    paymentStatus: {
        type: String,
        default: "Pending",
    },
    razorpayOrderId: {
        type: String,
    },
    status: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }

},{
    collection:'gas',
    versionKey:false
})

export default mongoose.model('gas',gasSchema)