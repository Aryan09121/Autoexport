const Profile = require("../models/Settings.model");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors");

exports.createProfile = catchAsyncErrors(async (req, res) => {
	const { companyLogo, ownerName, companyName, address, contact, email, tax } = req.body;

	// Validation
	if (!ownerName || !companyName || !contact || !email) {
		throw new ApiError(400, "Owner name, company name, contact, and email are required");
	}

	// Create profile
	const profile = await Profile.create({
		companyLogo,
		ownerName,
		companyName,
		address,
		contact,
		email,
		tax,
	});

	// Handle errors
	if (!profile) {
		throw new ApiError(500, "Failed to create profile");
	}

	// Respond with success message and profile data
	return res.status(201).json(new ApiResponse(200, profile, "Profile created successfully"));
});

exports.getProfile = catchAsyncErrors(async (req, res) => {
	const profile = await Profile.findOne();

	if (!profile) {
		throw new ApiError(500, "profile not found");
	}

	// Respond with success message and profile data
	return res.status(201).json(new ApiResponse(200, profile, "Profile fetched successfully"));
});

exports.updateProfile = catchAsyncErrors(async (req, res) => {
	const updateFields = req.body;

	// Assuming there's only one profile document
	const existingProfile = await Profile.findOne();

	// Handle not found scenario
	if (!existingProfile) {
		throw new ApiError(404, "Profile not found");
	}

	// Update each field individually from the request body
	Object.keys(updateFields).forEach((field) => {
		existingProfile[field] = updateFields[field];
	});

	// Save updated profile
	const updatedProfile = await existingProfile.save();

	// Respond with success message and updated profile data
	return res.status(200).json(new ApiResponse(200, updatedProfile, "Profile updated successfully"));
});
