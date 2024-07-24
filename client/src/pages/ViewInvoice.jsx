import { useEffect, useState, useRef } from "react";
import axios from "axios";
import pdf from "../assets/images/pdf.png";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

const ViewInvoice = () => {
	const [invoiceData, setInvoiceData] = useState({ items: [] });
	const [billData, setBillData] = useState({});
	const [profile, setProfile] = useState({});
	const params = useParams();
	const invoiceRef = useRef(null);

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

	const handlePrint = useReactToPrint({
		content: () => invoiceRef.current,
		pageStyle: `
			@page {
				size: A4;
				margin: 0;
			}
			@media print {
				body {
					-webkit-print-color-adjust: exact;
				}
			}
		`,
	});

	// Function to detect iOS
	const isIOS = () => {
		return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
	};

	return (
		<section className="P-0 M-0">
			<div
				ref={invoiceRef}
				className="invoice mx-auto border relative border-gray-300"
				style={{
					width: isIOS() ? "210mm" : "314mm",
					height: isIOS() ? "297mm" : "445mm",
					backgroundImage: `url(${pdf})`,
					backgroundSize: "cover",
					backgroundPosition: "center",
					transform: isIOS() ? "scale(0.75)" : "none",
					transformOrigin: "top left",
				}}
			>
				<div className="absolute top-0 left-0 w-full h-full">
					<div className="mb-6 relative top-[11%] left-[80%] w-full">
						<p>
							<span className="text-3xl font-semibold">TRN: 104323633900003</span>
						</p>
						<p>
							<span className="text-3xl font-semibold">Invoice No:</span> {billData?.invId}
						</p>
						<p>
							<span className="text-3xl font-semibold">Date:</span> {new Date(invoiceData.doc).toLocaleDateString()}
						</p>
					</div>

					<div className="mb-6 mt-[350px] ml-5 px-12">
						<h3 className="font-semibold text-3xl">Bill To,</h3>
						<p className="mt-1 text-3xl">{billData?.customerName}</p>
						<p className="mt-1 text-3xl">{billData?.contact}</p>
						<p className="mt-1 text-3xl">{billData?.email}</p>
					</div>

					<table className="w-[95%] mx-auto mb-6 px-12">
						<thead className="px-12">
							<tr className="bg-gray-100">
								<th className="border text-2xl px-4 py-2 text-left">Sr. No.</th>
								<th className="border text-2xl px-4 py-2 text-left">Item Name</th>
								<th className="border text-2xl px-4 py-2 text-left">Quantity</th>
								<th className="border text-2xl px-4 py-2 text-left">Unit Price</th>
								<th className="border text-2xl px-4 py-2 text-left">VAT %</th>
								<th className="border text-2xl px-4 py-2 text-left">Amount</th>
							</tr>
						</thead>
						<tbody>
							{billData?.items?.map((item, index) => {
								const subtotal = item?.amount * item?.quantity;
								const tax = subtotal * (profile?.tax / 100);
								const total = subtotal + tax;

								return (
									<tr key={index}>
										<td className="text-3xl border px-4 py-5">{index + 1}</td>
										<td className="text-3xl border px-4 py-5">{item?.productName}</td>
										<td className="text-3xl border px-4 py-5">{item?.quantity}</td>
										<td className="text-3xl border px-4 py-5">AED {item?.amount?.toFixed(2)}</td>
										<td className="text-3xl border px-4 py-5">{profile?.tax}</td>
										<td className="text-3xl border px-4 py-5">AED {total?.toFixed(2)}</td>
									</tr>
								);
							})}
						</tbody>
					</table>

					<div className="text-right mr-5 px-12 text-3xl">
						<div className="flex items-center gap-4 justify-end">
							<h3 className="font-semibold">Sub Total: </h3>
							<h2 className="text-2xl font-bold">AED {billData?.totalAmount?.toFixed(2)}</h2>
						</div>
						<div className="flex items-center gap-4 justify-end">
							<h3 className="font-semibold">Including VAT @{profile?.tax}%: </h3>
							<h2 className="text-2xl font-bold">AED {billData?.vatAmount?.toFixed(2)}</h2>
						</div>
						<div className="flex items-center gap-4 justify-end">
							<h3 className="font-semibold">Discount @{billData?.discount}%: </h3>
							<h2 className="text-2xl font-bold">{billData?.discountAmount}</h2>
						</div>
						<div className="flex items-center gap-4 justify-end">
							<h3 className="font-semibold">Bill Amount: </h3>
							<h2 className="text-2xl font-bold">AED {billData?.totalBillAmount?.toFixed(2)}</h2>
						</div>
					</div>
				</div>
			</div>
			<div className="w-full py-12 flex items-center justify-center gap-6">
				<button className="py-5 text-white rounded-xl text-2xl px-8 bg-[#074D41]" onClick={handlePrint}>
					Print
				</button>
				<button className="py-5 text-white rounded-xl text-2xl px-8 bg-[#074D41]" onClick={handlePrint}>
					Download
				</button>
			</div>
		</section>
	);
};

export default ViewInvoice;
