import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";

/** middleware for verify user */
export async function verifyUser(req, res, next) {
  try {
    const { username } = req.method == "GET" ? req.query : req.body;

    // check the user existance
    let exist = await UserModel.findOne({ username });
    if (!exist) return res.status(404).send({ error: "Can't find User!" });
    next();
  } catch (error) {
    return res.status(404).send({ error: "Authentication Error" });
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
    const { username: name, password, profile, email } = req.body;

    if (!email) {
      throw new Error("Please provide email");
    }
    if (!password) {
      throw new Error("Please provide password");
    }
    if (!name) {
      throw new Error("Please provide name");
    }

    // Check for existing username
    const existUsername = UserModel.findOne({ username: name }).exec();
    const existEmail = UserModel.findOne({ email }).exec();

    const [usernameExists, emailExists] = await Promise.all([
      existUsername,
      existEmail,
    ]);

    if (usernameExists) {
      throw new Error("Please use unique username");
      // return res.status(400).json({ error: "Please use unique username" });
    }

    if (emailExists) {
      return res.status(400).json({ error: "Please use unique Email" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    if (!hashedPassword) {
      throw new Error("Something is wrong");
    }

    const payload = {
      ...req.body,
      password: hashedPassword,
    };

    // Create a new user
    // const user = new UserModel({
    //   username: name,
    //   password: hashedPassword,
    //   profile: profile || "",
    //   email,
    // });

    const user = new UserModel(payload);

    // Save the user
    const result = await user.save();
    // Exclude the password from the response
    const userResponse = result.toObject();
    delete userResponse.password;

    // return res
    //   .status(201)
    //   .send({ msg: "User Registered Successfully", user: userResponse });
    res.status(201).json({
      data: result,
      success: true,
      error: false,
      message: "User created Successfully",
    });
  } catch (error) {
    console.error(error);
    // return res.status(500).send({ error: "Internal Server Error" });
    res.json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

/** POST: http://localhost:8080/api/login 
 * @param: {
  "username" : "example123",
  "password" : "admin123"
}
*/
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email) {
      throw new Error("Please provide email");
    }
    if (!password) {
      throw new Error("Please provide password");
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    console.log("checkPassword", checkPassword);

    if (checkPassword) {
      const tokenData = {
        _id: user._id,
        email: user.email,
      };
      // const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, { expiresIn: 60 * 60 * 8 });
      const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, {
        expiresIn: 10,
      });

      const tokenOption = {
        httpOnly: true, // The cookie is inaccessible to JavaScript, mitigating XSS attacks
        secure: true,   // The cookie is sent only over HTTPS, ensuring secure transmission
      };
      

      res.cookie("token", token, tokenOption).status(200).json({
        message: "Login successfully",
        data: token,
        success: true,
        error: false,
      });
    } else {
      throw new Error("Please check Password");
    }
  } catch (error) {
    // return res.status(500).send({ error });
    res.json({
      message: error.message || error,
      error: true,
      success: false,
    });
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
      return res.status(404).send({
        error:
          "No records were updated. User might not exist or no changes were made.",
      });
    }

    return res.status(200).send({ msg: "Record Updated...!" });
  } catch (error) {
    console.error("Error updating user:", error);
    return res
      .status(500)
      .send({ error: "An error occurred while updating the record." });
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
    return res
      .status(500)
      .send({ error: "An error occurred while resetting the password." });
  }
}
