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

export async function fetchAllUsers(req,res){
    try{
        console.log("userid all Users",req.userId)

        const allUsers = await UserModel.find()
        
        res.json({
            message : "All User ",
            data : allUsers,
            success : true,
            error : false
        })
    }catch(err){
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false
        })
    }
}

export async function updateUser(req, res) {
    try {
        const sessionUser = req.userId;
        console.log("from userController update user: ", sessionUser);

        const { userId, email, username, role } = req.body;

        const payload = {
            ...(email && { email: email }),
            ...(username && { username: username }),
            ...(role && { role: role }),
        };

        const user = await UserModel.findById(sessionUser);
        
        if (!user) {
            return res.status(404).json({
                message: 'Authenticated user not found',
                error: true,
                success: false
            });
        }

        console.log("user.role", user.role);

        // Additional authorization checks can be performed here

        const updatedUser = await UserModel.findByIdAndUpdate(userId, payload, { new: true });

        if (!updatedUser) {
            return res.status(404).json({
                message: 'User to update not found',
                error: true,
                success: false
            });
        }

        res.json({
            data: updatedUser,
            message: "User Updated",
            success: true,
            error: false
        });
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}