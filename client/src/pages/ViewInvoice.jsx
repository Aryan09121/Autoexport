import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import headerImage from "../assets/images/header.png";
import footerImage from "../assets/images/footer.png";

const ViewInvoice = () => {
	const [invoiceData, setInvoiceData] = useState({ items: [] });
	const [billData, setBillData] = useState({});
	const [profile, setProfile] = useState({});
	const params = useParams();

	useEffect(() => {
		const fetchInvoiceData = async () => {
			try {
				const response = await axios.get(`${import.meta.env.VITE_API_URL}/get/invoice?id=${params.id}`);
				setInvoiceData(response.data.data);
			} catch (error) {
				console.error("Error fetching invoice data:", error);
			}
		};

		const fetchProfileData = async () => {
			try {
				const response = await axios.get(`${import.meta.env.VITE_API_URL}/get/profile`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				});

				if (!response.data.success) {
					throw new Error("Failed to fetch profile data");
				}

				setProfile(response.data.data);
			} catch (error) {
				console.error("Error fetching profile data:", error.message);
			}
		};

		fetchProfileData();
		fetchInvoiceData();
	}, [params.id]);

	useEffect(() => {
		if (profile && invoiceData) {
			const { invId, customerName, email, contact, items, discount } = invoiceData;
			const totalAmount = items.reduce((total, item) => total + item.quantity * item.amount, 0);
			const vatAmount = (totalAmount * profile?.tax) / 100;
			const discountAmount = (totalAmount * discount) / 100;
			const totalBillAmount = totalAmount + vatAmount - discountAmount;
			setBillData({ invId, customerName, email, contact, totalAmount, vatAmount, totalBillAmount, items, discount, discountAmount });
		}
	}, [invoiceData, profile]);

	const generatePDF = () => {
		// Keep your existing PDF generation code here
		const doc = new jsPDF();

		// Add header image
		doc.addImage(headerImage, "PNG", 0, 0, 210, 40);

		// Add invoice details
		doc.setFontSize(14);
		doc.setFontSize(10);
		doc.text(`TRN NO: 104323633900003`, 150, 62);
		doc.text(`Invoice No: ${billData.invId}`, 150, 67);
		doc.text(`Date: ${new Date(invoiceData.doc).toLocaleDateString()}`, 150, 72);

		// Add customer details
		doc.setFontSize(14);
		doc.text("Bill To:", 15, 56);
		doc.setFontSize(10);
		doc.text(billData.customerName, 15, 62);
		doc.text(billData.contact, 15, 67);
		doc.text(billData.email, 15, 72);

		// Add items table
		doc.autoTable({
			startY: 82,
			head: [["No.", "Description", "Qty", "Unit Price", "Amount"]],
			body: billData.items.map((item, index) => [
				index + 1,
				item.productName,
				item.quantity,
				`AED ${item.amount.toFixed(2)}`,
				`AED ${(item.amount * item.quantity).toFixed(2)}`,
			]),
			styles: { fontSize: 9 },
		});

		// Add total section
		const finalY = doc.previousAutoTable.finalY + 10;
		doc.text(`Sub Total: AED ${billData.totalAmount.toFixed(2)}`, 150, finalY);
		doc.text(`VAT (${profile.tax}%): AED ${billData.vatAmount.toFixed(2)}`, 150, finalY + 7);
		doc.text(`Discount: AED ${billData.discountAmount.toFixed(2)}`, 150, finalY + 14);
		doc.setFontSize(12);
		doc.text(`Total: AED ${billData.totalBillAmount.toFixed(2)}`, 150, finalY + 24);

		// Add footer image
		doc.addImage(footerImage, "PNG", 0, 270, 210, 27);

		// Save the PDF
		doc.save(`Invoice_${billData.invId}.pdf`);
	};

	return (
		<section className="p-4">
			<div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
				<img src={headerImage} alt="Header" className="w-full" />
				<div className="p-6">
					<div className="flex justify-between mb-4">
						<div>
							<h3 className="font-semibold">Bill To:</h3>
							<p>{billData?.customerName}</p>
							<p>{billData?.contact}</p>
							<p>{billData?.email}</p>
						</div>
						<div className="text-right">
							<p>
								<strong>TRN NO:</strong> 104323633900003
							</p>
							<p>
								<strong>Invoice No:</strong> {billData?.invId}
							</p>
							<p>
								<strong>Date:</strong> {new Date(invoiceData.doc).toLocaleDateString()}
							</p>
						</div>
					</div>

					<table className="w-full mb-6">
						<thead>
							<tr className="bg-gray-100">
								<th className="px-4 py-2 text-left">No.</th>
								<th className="px-4 py-2 text-left">Description</th>
								<th className="px-4 py-2 text-left">Qty</th>
								<th className="px-4 py-2 text-left">Unit Price</th>
								<th className="px-4 py-2 text-left">Amount</th>
							</tr>
						</thead>
						<tbody>
							{billData?.items?.map((item, index) => (
								<tr key={index}>
									<td className="border px-4 py-2">{index + 1}</td>
									<td className="border px-4 py-2">{item?.productName}</td>
									<td className="border px-4 py-2">{item?.quantity}</td>
									<td className="border px-4 py-2">AED {item?.amount?.toFixed(2)}</td>
									<td className="border px-4 py-2">AED {(item?.amount * item?.quantity).toFixed(2)}</td>
								</tr>
							))}
						</tbody>
					</table>

					<div className="text-right">
						<p>
							<span className="font-semibold">Sub Total:</span> AED {billData?.totalAmount?.toFixed(2)}
						</p>
						<p>
							<span className="font-semibold">VAT ({profile?.tax}%):</span> AED {billData?.vatAmount?.toFixed(2)}
						</p>
						<p>
							<span className="font-semibold">Discount:</span> AED {billData?.discountAmount?.toFixed(2)}
						</p>
						<p className="text-xl font-bold mt-2">Total: AED {billData?.totalBillAmount?.toFixed(2)}</p>
					</div>
				</div>
				<img src={footerImage} alt="Footer" className="w-full" />
			</div>
			<div className="mt-6 flex justify-center">
				<button className="bg-blue-500 text-white px-6 py-2 rounded-lg" onClick={generatePDF}>
					Download PDF
				</button>
			</div>
		</section>
	);
};

export default ViewInvoice;
