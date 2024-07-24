const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { Schema } = mongoose;

// user Schema
const userSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, "Name is required"],
			minLength: [6, "name should be atleast 6 character long"],
		},
		email: {
			type: String,
			unique: true,
			reqired: [true, "Email is required"],
			match: [/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/, "Please fill a valid email address"],
		},
		password: {
			type: String,
			required: [true, "Password is required"],
			select: false,
			maxlength: [25, "Password should not exceed more than 25 characters"],
			minlength: [6, "Password should not less than 6 characters"],
			//match:[]
		},
	},
	{ timestamps: true }
);

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();

	// this.password = await bcrypt.hash(this.password, 10);
	next();
});

userSchema.methods.comparePassword = async function (password) {
	return this.password === password;
};

userSchema.methods.getJwtToken = function () {
	return jwt.sign(
		{
			_id: this._id,
			email: this.email,
			username: this.username,
			fullName: this.fullName,
			role: this.role,
		},
		process.env.JWT_SECRET,
		{
			expiresIn: process.env.JWT_EXPIRE,
		}
	);
};

const User = mongoose.model("user", userSchema);
module.exports = User;
