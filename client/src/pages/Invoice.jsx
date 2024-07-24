import { InvoiceTable } from "@/components/elements";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { FaFileInvoice } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

const Invoice = () => {
	const navigate = useNavigate();
	const { t } = useTranslation();

	useEffect(() => {
		const token = localStorage.getItem("token");
		const user = localStorage.getItem("user");

		if (!token || !user) {
			navigate("/login");
		}
	}, []);

	return (
		<main className="w-full py-8 lg:px-8 px-5 ">
			<h1 className="text-4xl flex items-center gap-6 justify-start text-[#BFDB38] font-bold">
				<FaFileInvoice className="text-4xl font-bold" /> {t("dashboard.invoices")}
			</h1>
			<div className="py-8 flex items-center justify-between flex-wrap gap-6">
				<Link to="/new/invoice">
					<Button className="py-8 px-8 text-3xl bg-[#074D41]">{t("dashboard.createInvoice")}</Button>
				</Link>
			</div>
			<InvoiceTable />
		</main>
	);
};

export default Invoice;
