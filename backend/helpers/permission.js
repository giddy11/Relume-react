import UserModel from "../models/User.js";


export default async function uploadProductPermission(userId) {
    const user = await UserModel.findById(userId)

    if(user.role === 'ADMIN'){
        return true
    }

    return false
}