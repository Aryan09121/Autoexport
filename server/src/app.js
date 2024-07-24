const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { generatedErrors } = require("./middlewares/errors");
const { ApiError } = require("./utils/ApiError");
const path = require("path");

const app = express();

app.use(
	cors({
		origin: "*",
		credentials: true,
	})
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// routes import

const userRouter = require("./routes/user.routes.js");
const invoiceRouter = require("./routes/invoice.routes.js");
const settingsRouter = require("./routes/settings.routes.js");

//routes declare
app.use("/api/v1/user", userRouter);
app.use("/api/v1/user", invoiceRouter);
app.use("/api/v1/user", settingsRouter);

// ?? multer image saving
app.use("/", express.static(path.join(__dirname, "..", "/public", "/uploads")));

app.all("*", (req, res, next) => {
	next(new ApiError(404, `Requested URL Not Found ${req.url}`));
});
app.use(generatedErrors);

module.exports = app;
