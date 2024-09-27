import mongoose from "./index.js";
import validators from "../utils/validators.js";
import {generateUUID} from '../utils/helper.js'

const gasSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name is required"]
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        validate: {
            validator: validators.validateEmail,
            message: props => `${props.value} is not a valid email!`
        }
    },
    mobile:{
        type:String,
        required:[true,"Mobile is required"],
        validate: {
            validator: validators.validateMobile,
            message: props => `${props.value} is not a valid mobile number!`
        }
    },
    address:{
        type:String,
        required:[true,"Address is required"]
    },
    product:{
        type:String,
        required:[true,"Product is required"]
    },
    quantity:{
        type:String,
        required:[true,"Quantity is required"]
    },
    timeslot:{
        type:String,
        required:[true,"Timeslot is required"]
    },
    status:{
        type:Boolean,
        default:true
    },
    totalPrice:{
        type:String,
        required:[true,"Total Price is required"]
    },
    paymentStatus: {
        type: String,
        default: "Pending",
      },
    razorpayOrderId:{
        type:String,
      },
    createdAt:{
        type:Date,
        default:Date.now()
    }

},{
    collection:'users',
    versionKey:false
})

export default mongoose.model('gas',gasSchema)