import express from "express";
import UserModel from "../models/userModel.js";
import verify from "../helpers/verifyToken.js";

const router = express.Router();

router.post("/pay", verify, async (req, res) => {
    const { email, amount } = req.body;
    const receiver = await UserModel.findOne({ email: email })
    if (!receiver) {
        return res.status(400).json({ error: "No User with this email exists" });
    }
    const user = req.user;
    const sender = await UserModel.findOne({ _id: user.id })
    if (sender.balance < amount) {
        return res.status(400).json({ error: "You do not have enough balance" });
    }
    sender.balance = sender.balance - amount;
    receiver.balance = receiver.balance + amount;
    sender.transactions.push({
        amount,
        receipentEmail: receiver.email,
        typeOfTransaction:"Sent",
        date: new Date(),
    });
    receiver.transactions.push({
        amount,
        receipentEmail: sender.email,
        typeOfTransaction:"Received",
        dateCreated: new Date(),
    })
    await sender.save();
    await receiver.save();
    return res.status(200).json({ message: "Amount Transferred Successfully" })
})

export default router