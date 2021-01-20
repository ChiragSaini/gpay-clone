import express from "express";
import bcrypt from "bcryptjs";
import UserModel from "../models/userModel.js";
import JWT from "jsonwebtoken";
import verify from "../helpers/verifyToken.js"

const router = express.Router();

router.get('/profileData', verify, async (req, res) => {
    const user = req.user;
    console.log(user)
    try {
        const findUser = await UserModel.findOne({ _id: user.id })
        return res.status(200).json({
            user: {
                name: findUser.name,
                token: req.header("auth-token"),
                balance: findUser.balance,
                transactions: findUser.transactions
            }
        })
    } catch (error) {
        return res.status(400).send("User Not Found")
    }

})

router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // * Checking if all fields exists
        if (!name || !email || !password) {
            return res.status(400).json({ error: "All the fields are not provided by you" });
        }
        // * CHecking password length
        if (password.length < 8) {
            return res.status(400).json({ error: "Please provide a password gretaer than or equal to 8 characters" });
        }

        // * CHecking if user already exists
        const existingUser = await UserModel.findOne({ email: email })
        if (existingUser) {
            return res.status(400).json({ error: "User with this email already exists" });
        }

        // * hashing password for security reasons
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new UserModel({
            name,
            email,
            password: hashedPassword,
        })
        const savedUser = await user.save();
        res.status(201).json({ success: "Registration Successfull", email });
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.post("/login", async (req, res) => {
    try {
        // * get fields and validate them
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ error: 'Not all fields have been entered.' });
        } else if (password.length < 8) {
            res.status(400).json({ error: 'Password should be of 8 characters atleast.' });
        }

        // * get user from db of that email
        const existingUser = await UserModel.findOne({ email: email });
        if (!existingUser) {
            res.status(400).json({ error: 'No User found with this email.' });
        }

        console.log('user found', existingUser);

        // * & compare passwords
        const passwordsMatch = await bcrypt.compare(password, existingUser.password);

        if (!passwordsMatch) {
            res.status(400).json({ error: 'Wrong password entered.' });
        }

        // create a jwt
        const token = JWT.sign({ id: existingUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: "24h" });
        res.header("auth-token", token);
        res.json({
            user: {
                name: existingUser.name,
                balance: existingUser.balance,
                transactions: existingUser.transactions,
                token
            }
        })

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

export default router;