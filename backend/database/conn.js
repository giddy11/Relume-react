import mongoose from "mongoose";

import { MongoMemoryServer } from "mongodb-memory-server";
// import ENV from '../config.js'

async function connect(){

    // const mongod = await MongoMemoryServer.create();
    // const getUri = mongod.getUri();

    // mongoose.set('strictQuery', true)
    // const db = await mongoose.connect(getUri);
    // // const db = await mongoose.connect(ENV.ATLAS_URI);
    // console.log("Database Connected") 
    // return db;

    try {
        await mongoose.connect(process.env.DATABASE_URI)
    } catch (err) {
        console.log(err)
    }
}

export default connect;