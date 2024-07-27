import jwt from 'jsonwebtoken';

/** auth middleware */
export default async function Auth(req, res, next){
    // try {
        
    //     // access authorize header to validate request
    //     const token = req.headers.authorization.split(" ")[1];

    //     // retrive the user details fo the logged in user
    //     const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    //     req.user = decodedToken;

    //     next()

    // } catch (error) {
    //     res.status(401).json({ error : "Authentication Failed!"})
    // }

    try{
        const token = req.cookies?.token || req.header

        console.log("token from auth.js class:",token)
        if(!token){
            return res.status(200).json({
                message : "Please Login...!",
                error : true,
                success : false
            })
        }

        jwt.verify(token, process.env.TOKEN_SECRET_KEY, function(error, decoded) {
            console.log(error)
            console.log("decoded",decoded)
            
            if(error){
                console.log("error auth", error)
            }

            req.userId = decoded?._id

            next()
        });


    }catch(error){
        res.status(400).json({
            message : error.message || error,
            data : [],
            error : true,
            success : false
        })
    }
}


export function localVariables(req, res, next){
    req.app.locals = {
        OTP : null,
        resetSession : false
    }
    next()
}
