import UserModel from "../../models/User.js";

export async function userDetails(req,res){
    try{
        console.log("userId",req.userId)
        const user = await UserModel.findById(req.userId)

        res.status(200).json({
            data : user,
            error : false,
            success : true,
            message : "User details"
        })

        console.log("user",user)

    }catch(error){
        res.status(400).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}