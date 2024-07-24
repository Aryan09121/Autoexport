const mongoose = require("mongoose");

const { Schema } = mongoose;

// Sequence Schema
const sequenceSchema = new Schema({
	name: { type: String, required: true },
	seq: { type: Number, default: 0 },
});

// Invoice Schema
const invoiceSchema = new Schema(
	{
		invId: { type: String, required: true, unique: true },
		status: { type: String, enum: ["paid", "unpaid"], default: "paid" },
		customerName: {
			type: String,
			required: [true, "Name is required"],
			minLength: [6, "Name should be at least 6 characters long"],
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			match: [/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/, "Please fill a valid email address"],
		},
		contact: {
			type: String,
			required: [true, "Contact is required"],
		},
		items: [
			{
				productName: { type: String, required: true },
				quantity: { type: Number, required: true },
				amount: { type: Number, required: true },
				doc: { type: Date, default: new Date() },
			},
		],
		discount: { type: Number },
		doc: { type: Date, default: new Date() },
	},
	{ timestamps: true }
);

const Invoice = mongoose.model("Invoice", invoiceSchema);
const Sequence = mongoose.model("Sequence", sequenceSchema);

module.exports = { Invoice, Sequence };
