import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";

/** middleware for verify user */
export async function verifyUser(req, res, next){
  try {
      
      const { username } = req.method == "GET" ? req.query : req.body;

      // check the user existance
      let exist = await UserModel.findOne({ username });
      if(!exist) return res.status(404).send({ error : "Can't find User!"});
      next();

  } catch (error) {
      return res.status(404).send({ error: "Authentication Error"});
  }
}

/** POST: http://localhost:8080/api/register 
 * @param : {
  "username" : "example123",
  "password" : "admin123",
  "email": "example@gmail.com",
  "firstName" : "bill",
  "lastName": "william",
  "mobile": 8009860560,
  "address" : "Apt. 556, Kulas Light, Gwenborough",
  "profile": ""
}
*/
export async function register(req, res) {
  try {
    const { username, password, profile, email } = req.body;

    // Check for existing username
    const existUsername = UserModel.findOne({ username }).exec();
    const existEmail = UserModel.findOne({ email }).exec();

    const [usernameExists, emailExists] = await Promise.all([
      existUsername,
      existEmail,
    ]);

    if (usernameExists) {
      return res.status(400).json({ error: "Please use unique username" });
    }

    if (emailExists) {
      return res.status(400).json({ error: "Please use unique Email" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new UserModel({
      username,
      password: hashedPassword,
      profile: profile || "",
      email,
    });

    // Save the user
    const result = await user.save();
    // Exclude the password from the response
    const userResponse = result.toObject();
    delete userResponse.password;


    return res
      .status(201)
      .send({ msg: "User Registered Successfully", user: userResponse });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
}

/** POST: http://localhost:8080/api/login 
 * @param: {
  "username" : "example123",
  "password" : "admin123"
}
*/
export async function login(req, res) {
  const { username, password } = req.body;

  try {
    UserModel.findOne({ username })
      .then((user) => {
        bcrypt
          .compare(password, user.password)
          .then((passwordCheck) => {
            if (!passwordCheck)
              return res.status(400).send({ error: "Invalid Password" });

            // create jwt token
            const token = jwt.sign(
              {
                userId: user._id,
                username: user.username,
              },
              process.env.ACCESS_TOKEN_SECRET,
              { expiresIn: "24h" }
            );

            return res.status(200).send({
              msg: "Login Successful...!",
              username: user.username,
              token,
            });
          })
          .catch((error) => {
            return res.status(400).send({ error: "Password does not Match" });
          });
      })
      .catch((error) => {
        return res.status(404).send({ error: "Username not Found" });
      });
  } catch (error) {
    return res.status(500).send({ error });
  }
}

/** GET: http://localhost:8080/api/user/example123 */
export async function getUser(req, res) {
  const { username } = req.params;

  try {
    if (!username) {
      console.error("Invalid Username");
      return res.status(400).send({ error: "Invalid Username" });
    }

    console.log(`Searching for user with username: ${username}`);
    
    const user = await UserModel.findOne({ username }).exec();

    if (!user) {
      console.error("User not found");
      return res.status(404).send({ error: "Couldn't Find the User" });
    }

    /** remove password from user */
    const { password, ...rest } = user.toObject();

    console.log("User found:", rest);
    return res.status(200).send(rest);

  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).send({ error: "Cannot Find User Data" });
  }
}

/** PUT: http://localhost:8080/api/updateuser 
 * @param: {
  "header" : "<token>"
}
body: {
    firstName: '',
    address : '',
    profile : ''
}
*/
export async function updateUser(req, res) {
  try {
    const { userId } = req.user;

    if (!userId) {
      return res.status(401).send({ error: "User Not Found...!" });
    }

    const body = req.body;

    // Update the data
    const result = await UserModel.updateOne({ _id: userId }, body).exec();

    if (result.nModified === 0) {
      return res.status(404).send({ error: "No records were updated. User might not exist or no changes were made." });
    }

    return res.status(200).send({ msg: "Record Updated...!" });

  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).send({ error: "An error occurred while updating the record." });
  }
}

/** GET: http://localhost:8080/api/generateOTP */
export async function generateOTP(req, res) {
  req.app.locals.OTP = await otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  res.status(201).send({ code: req.app.locals.OTP });
}

/** GET: http://localhost:8080/api/verifyOTP */
export async function verifyOTP(req, res) {
  const { code } = req.query;
  if (parseInt(req.app.locals.OTP) === parseInt(code)) {
    req.app.locals.OTP = null; // reset the OTP value
    req.app.locals.resetSession = true; // start session for reset password
    return res.status(201).send({ msg: "Verify Successsfully!" });
  }
  return res.status(400).send({ error: "Invalid OTP" });
}

// successfully redirect user when OTP is valid
/** GET: http://localhost:8080/api/createResetSession */
export async function createResetSession(req, res) {
  if (req.app.locals.resetSession) {
    return res.status(201).send({ flag: req.app.locals.resetSession });
  }
  return res.status(440).send({ error: "Session expired!" });
}

// update the password when we have valid session
/** PUT: http://localhost:8080/api/resetPassword */
export async function resetPassword(req, res) {
  try {
    if (!req.app.locals.resetSession) {
      return res.status(440).send({ error: "Session expired!" });
    }

    const { username, password } = req.body;

    // Find the user by username
    const user = await UserModel.findOne({ username }).exec();
    if (!user) {
      return res.status(404).send({ error: "Username not Found" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password
    const result = await UserModel.updateOne(
      { username: user.username },
      { password: hashedPassword }
    ).exec();

    // Check if the update was successful
    if (result.nModified === 0) {
      return res.status(404).send({ error: "Failed to update password" });
    }

    req.app.locals.resetSession = false; // Reset session
    return res.status(200).send({ msg: "Record Updated...!" });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).send({ error: "An error occurred while resetting the password." });
  }
}
