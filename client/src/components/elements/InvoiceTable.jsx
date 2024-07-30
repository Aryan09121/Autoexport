/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const InvoiceTable = () => {
	const [invoiceData, setInvoiceData] = useState([]);
	const [error, setError] = useState(null);
	const { t } = useTranslation();

	useEffect(() => {
		const fetchInvoices = async () => {
			try {
				const response = await axios.get(`${import.meta.env.VITE_API_URL}/get/invoices`);
				const formattedData = response.data.data.map((invoice) => ({
					invId: invoice.invId.replace(/^INV-0*/, "INV-000"),
					status: invoice.status,
					customerName: invoice.customerName,
					email: invoice.email,
					doc: invoice.doc,
					contact: invoice.contact,
					items: invoice.items,
					createdAt: invoice.createdAt,
					_id: invoice._id, // Add _id for navigation
				}));
				// console.log(formattedData);
				setInvoiceData(formattedData);
			} catch (error) {
				console.error("Error fetching invoices:", error);
				setError("Failed to fetch invoices");
			}
		};

		fetchInvoices();
	}, []);

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<Card className="my-20 py-6">
			<CardHeader>
				<CardTitle className="text-3xl">{t("dashboard.recentInvoices")}</CardTitle>
			</CardHeader>
			<CardContent className="scrolldisplaynone">
				<Table>
					<TableHeader>
						<TableRow className="text-4xl font-semibold">
							<TableHead className="font-semibold">{t("dashboard.invoiceId")}</TableHead>
							<TableHead className="font-semibold">{t("dashboard.status")}</TableHead>
							<TableHead className="font-semibold">{t("dashboard.date")}</TableHead>
							<TableHead className="font-semibold">{t("dashboard.customerName")}</TableHead>
							<TableHead className="font-semibold text-4xl">{t("dashboard.action")}</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody className="text-3xl font-medium">
						{invoiceData.map((data) => (
							<Row key={data.invId} data={data} />
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
};

const Row = ({ data }) => {
	const navigate = useNavigate();

	const handlePrint = () => {
		navigate(`/invoice/pdf/${data._id}`);
	};

	const copyToClipBoard = () => {
		navigator.clipboard.writeText(`${import.meta.env.VITE_API_HOST}/invoice/pdf/${data._id}`);
		toast.success(`Invoice copied successfully`);
	};

	const handleSend = () => {
		const emailUrl = `mailto:${data.email}?subject=Invoice&body=Please find the invoice at ${import.meta.env.VITE_API_HOST}/invoice/pdf/${
			data._id
		}`;

		window.open(emailUrl);
	};
	const handlewhatsapp = () => {
		const whatsappUrl = `https://wa.me/+${data.contact}?text=${import.meta.env.VITE_API_HOST}/invoice/pdf/${data._id}`;

		window.open(whatsappUrl);
	};

	return (
		<TableRow>
			<TableCell className="font-medium">{data.invId}</TableCell>
			<TableCell>
				<Badge variant="outline" className={`text-3xl px-16 py-4 ${data.status === "paid" ? "bg-green-400" : "bg-red-500"}`}>
					{data.status}
				</Badge>
			</TableCell>
			<TableCell>{new Date(data.doc).toLocaleDateString()}</TableCell>
			<TableCell>{data.customerName}</TableCell>
			<TableCell>
				<DropdownMenu>
					<DropdownMenuTrigger asChild className="border-none outline-none">
						<MoreHorizontal className="h-12 w-12" />
					</DropdownMenuTrigger>
					<DropdownMenuContent className="text-4xl w-64 px-0 flex flex-col items-start justify-start gap-0 py-5" align="end">
						<DropdownMenuLabel className="text-3xl text-center mx-auto">Actions</DropdownMenuLabel>

						<DropdownMenuItem onClick={handlePrint} className="py-5 px-7 text-3xl border-t-2 w-full">
							Download
						</DropdownMenuItem>
						<DropdownMenuItem onClick={copyToClipBoard} className="py-5 px-7 text-3xl border-t-2 w-full">
							Copy Link
						</DropdownMenuItem>
						<DropdownMenuItem onClick={handleSend} className="py-5 px-7 text-3xl border-t-2 w-full">
							send to email
						</DropdownMenuItem>
						<DropdownMenuItem onClick={handlewhatsapp} className="py-5 px-7 text-3xl border-t-2 w-full">
							send to whatsapp
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</TableCell>
		</TableRow>
	);
};

export default InvoiceTable;
