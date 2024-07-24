const dotenv = require("dotenv");
const connectDB = require("./db/index.js");
const app = require("./app");

dotenv.config({
	path: "./.env",
});

const startServer = async () => {
	try {
		await connectDB();
		app.listen(process.env.PORT || 8000, () => {
			console.log(`⚙️  Server is running at port: ${process.env.PORT}`);
		});
	} catch (err) {
		console.log("MONGO db connection failed !!! ", err);
	}
};

startServer();

module.exports = app; // Export the app for Vercel
