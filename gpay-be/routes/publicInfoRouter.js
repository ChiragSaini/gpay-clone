import express from "express";
import UserModel from "../models/userModel.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const users = await UserModel.find({})
        const publicUserData = users.map(user => {
            return {
                name: user.name,
                email: user.email
            }
        })
        res.status(200).json({ users: publicUserData })
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
})

export default router;