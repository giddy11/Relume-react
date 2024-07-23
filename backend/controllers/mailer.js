import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

// Configure Nodemailer
const nodeConfig = {
    host: "smtp.ethereal.email", // Use environment variable or default to Ethereal
    port:  587, // Use environment variable or default to 587
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL, // generated ethereal user
        pass: process.env.PASSWORD, // generated ethereal password
    }
};

const transporter = nodemailer.createTransport(nodeConfig);

// Verify the transporter configuration
transporter.verify(function(error, success) {
    if (error) {
        console.log("SMTP configuration error:", error);
    } else {
        console.log("SMTP server is ready to take our messages");
    }
});

// Configure Mailgen
const MailGenerator = new Mailgen({
    theme: "default",
    product: {
        name: "Mailgen",
        link: 'https://mailgen.js/'
    }
});

/** POST: http://localhost:8080/api/registerMail 
 * @param: {
  "username" : "example123",
  "userEmail" : "admin123",
  "text" : "",
  "subject" : "",
}
 */
export const registerMail = async (req, res) => {
    
    const { username, userEmail, text, subject } = req.body;

    // Body of the email
    const email = {
        body: {
            name: username,
            intro: text || "Welcome to Daily Tuition! We're very excited to have you on board.",
            outro: "Need help, or have questions? Just reply to this email, we'd love to help."
        }
    };

    const emailBody = MailGenerator.generate(email);

    const message = {
        from: process.env.EMAIL,
        to: userEmail,
        subject: subject || "Signup Successful",
        html: emailBody
    };

    try {
        // Send mail
        await transporter.sendMail(message);
        console.log(`Email sent to ${userEmail}`);
        return res.status(200).send({ msg: "You should receive an email from us." });
    } catch (error) {
        console.error("Error sending email:", error);
        return res.status(500).send({ error: "Failed to send email" });
    }
};
