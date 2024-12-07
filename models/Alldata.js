const mongoose = require("mongoose");
const { Schema } = mongoose;

const AllData = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    pinvoice: {
        type: String,
        require: true,
    },
    pdate: {
        type: Date,
        required: true,
    },
    gstno: {
        type: String,
        require: true,
    },
    amount: {
        type: Number,
        require: true,
    },
    mode: {
        type: String,
        require: true,
    },
});

module.exports = mongoose.model("alldata", AllData);
