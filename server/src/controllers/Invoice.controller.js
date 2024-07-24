const { ApiError } = require("../utils/ApiError.js");
const { ApiResponse } = require("../utils/ApiResponse.js");
const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors.js");
const { Invoice, Sequence } = require("../models/invoice.model");
const Settings = require("../models/Settings.model");

exports.getInvoiceById = catchAsyncErrors(async (req, res) => {
	const { id } = req.query;

	// Fetch the invoice by query parameters from the database
	const invoice = await Invoice.findById(id);

	if (!invoice) {
		throw new ApiError(404, "Invoice not found");
	}

	// Return success response with the invoice
	res.status(200).json(new ApiResponse(200, invoice, "Invoice fetched successfully"));
});

exports.getAllInvoices = catchAsyncErrors(async (req, res) => {
	// Fetch all invoices from the database
	const invoices = await Invoice.find();

	if (!invoices) {
		throw new ApiError(404, "No invoices found");
	}

	// Return success response with the invoices
	res.status(200).json(new ApiResponse(200, invoices, "All invoices fetched successfully"));
});

exports.createInvoice = catchAsyncErrors(async (req, res) => {
	const { customerName, email, contact, items } = req.body;

	const settings = await Settings.findOne();

	if (!settings) {
		throw new ApiError(400, "tax and discount not found");
	}

	if ([customerName, email, contact].some((field) => field?.trim() === "")) {
		throw new ApiError(400, "All fields are required");
	}

	if (items.length <= 0) {
		throw new ApiError(400, "At least one item is required");
	}

	// Generate invId
	const invId = await generateInvId();

	// Create the invoice
	const invoice = await Invoice.create({
		invId,
		customerName,
		email,
		contact,
		items,
		discount: settings.discount || 0,
	});

	items.forEach((element) => {
		settings.totalProducts += element.quantity;
	});
	await settings.save();

	if (!invoice) {
		throw new ApiError(500, "Something went wrong while creating the invoice");
	}

	return res.status(201).json(new ApiResponse(200, invoice, "Invoice created successfully"));
});

// Function to generate invId with sequence
async function generateInvId() {
	const sequence = await getNextSequenceValue("invoice");
	const sequenceStr = String(sequence).padStart(7, "0"); // Ensure sequence is 7 digits
	return `INV-${sequenceStr}`;
}

// Function to get next sequence value
async function getNextSequenceValue(name) {
	const sequence = await Sequence.findOneAndUpdate({ name }, { $inc: { seq: 1 } }, { new: true, upsert: true });
	return sequence.seq;
}
