import usersModel from "../model/users.js"
import auth from "../utils/auth.js"


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

const createUser = async (req, res) => {
    try {
        let user = await usersModel.findOne({ email: req.body.email })
        if (!user) {
            req.body.password = await auth.hashData(req.body.password)
            await usersModel.create(req.body)
            res.status(201).send({ message: "User Created Successfully" })
        }
        else
            res.status(400).send({ message: `User with ${req.body.email} already exists!` })
    } catch (error) {
        console.log(`Error in ${req.originalUrl}`,error.message)
        res.status(500).send({ message: error.message || "Internal Server Error" })
    }
}

const login = async (req,res) =>{
    try {
       let {email,password} = req.body
       let user = await usersModel.findOne({email:email})
       if(user)
       {
            //comaprepassword
        if (await auth.compareHash(user.password,password))
        {
            //createtoken
            const token = auth.createToken({
                id:user.id,
                name:user.name,
                email:user.email,
                role:user.role
            })
            res.status(200).send({
                message:"Login Successfull",
                role:user.role,
                token
            })
        }
        else{
            res.status(400).send({
                message:"Invalid Password"
            })
        }
    }
    else{
        res.status(400).send({
            message:`User with Email ${email} does not exists`
        })
    }
} catch (error) {
        console.log(`Error in ${req.originalUrl}`,error.message)
        res.status(500).send({ message: error.message || "Internal Server Error" })
    }

}

export default {
    getAllUsers,
    createUser,
    login,
    
}