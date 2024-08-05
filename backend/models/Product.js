import mongoose from "mongoose";

export const ProductSchema = new mongoose.Schema({
    productName : String,
    brandName : String,
    category : String,
    productImage : [],
    description : String,
    price : Number,
    sellingPrice : Number
},{
    timestamps : true
})

export default mongoose.model.Products || mongoose.model('Product', ProductSchema);