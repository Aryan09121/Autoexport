const { Router } = require("express");
const { createInvoice, getAllInvoices, getInvoiceById } = require("../controllers/Invoice.controller");

const router = Router();

// !! public routes --------------------------------
router.route("/create/invoice").post(createInvoice);
router.route("/get/invoices").get(getAllInvoices);
router.route("/get/invoice").get(getInvoiceById);

// !! secured routes --------------------------------

module.exports = router;
