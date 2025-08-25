const mongoose = require("mongoose");

const classesSchema = new mongoose.Schema(
    {
        trainer: {
            type: String,
        },
        date: {
            type: Date,
        },
        timestamps: {
            type: String,
        },
        status: {
            type: String,
        },
        registerLink: {
            type: String,
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
    }
);

const Classes = mongoose.model("Classes", classesSchema);
module.exports = Classes;
