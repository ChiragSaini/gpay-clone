import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    dateCreated: {
        type: Date,
    },
    transactions: {
        type: [{
            amount: {
                type: Number,
                required: true
            },
            dateCreated: {
                type: Date,
            },
            typeOfTransaction: {
                type: String,
                required: true,
            },
            receipentEmail: {
                type: String,
                required: true,
            }
        }]
    },
    balance: {
        type: Number,
        default: 10000,
    }
})

const UserModel = mongoose.model('users', userSchema);

export default UserModel;