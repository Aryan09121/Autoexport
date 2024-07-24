const mongoose = require("mongoose");

const { Schema } = mongoose;

const profileSchema = new Schema(
	{
		companyLogo: { type: String }, // Assuming storing URL or file path to the logo
		ownerName: { type: String, required: true },
		companyName: { type: String, required: true },
		address: { type: String },
		contact: { type: Number, required: true },
		email: {
			type: String,
			required: true,
			unique: true,
			match: [/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/, "Please fill a valid email address"],
		},
		tax: { type: Number, required: true },
		discount: { type: Number },
		totalProducts: { type: Number, default: 0 },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);
