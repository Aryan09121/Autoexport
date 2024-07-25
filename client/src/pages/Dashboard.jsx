/* eslint-disable react/prop-types */
import { bag, buy, message, user } from "@/assets/images";
import { DashboardTable } from "@/components/elements";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { GoShieldLock } from "react-icons/go";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";

const Dashboard = () => {
	const { t } = useTranslation();
	const [isMobileScreen, setIsMobileScreen] = useState(true);
	const [currentUser, setCurrentUser] = useState(null);
	const [dashboardData, setDashboardData] = useState(null);
	const [owner, setOwner] = useState("");
	const [totalProducts, setTotalProducts] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem("token");
		const user = localStorage.getItem("user");

		if (token && user) {
			setCurrentUser(JSON.parse(user));
		} else {
			navigate("/login");
		}
	}, [navigate]);

	useEffect(() => {
		const fetchDashboardData = async () => {
			try {
				const response = await axios.get(`${import.meta.env.VITE_API_URL}/get/invoices`);
				const totalInvoices = response.data.data.length;
				const pendingInvoices = response.data.data.filter((invoice) => invoice.status === "unpaid").length;
				const completedInvoices = response.data.data.filter((invoice) => invoice.status === "paid").length;
				const recentProducts = response.data.data;

				setDashboardData({
					totalInvoices,
					pendingInvoices,
					completedInvoices,
					recentProducts,
				});
			} catch (error) {
				console.error("Error fetching dashboard data:", error);
			}
		};

		fetchDashboardData();
	}, []);

	useEffect(() => {
		const mediaQuery = window.matchMedia("(max-width: 768px)");
		const handleMediaQueryChange = (e) => setIsMobileScreen(e.matches);

		setIsMobileScreen(mediaQuery.matches);
		mediaQuery.addEventListener("change", handleMediaQueryChange);

		return () => {
			mediaQuery.removeEventListener("change", handleMediaQueryChange);
		};
	}, []);

	useEffect(() => {
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

				const data = response.data.data;
				setOwner(data.ownerName);
				setTotalProducts(data.totalProducts);
			} catch (error) {
				console.error("Error fetching profile data:", error.message);
			}
		};

		fetchProfileData();
	}, []);

	if (!currentUser || !dashboardData) {
		return <div>{t("dashboard.loading")}</div>;
	}

	const { totalInvoices, completedInvoices, recentProducts } = dashboardData;

	return (
		<main className="w-full py-8 lg:px-8 px-5">
			<h1 className="text-4xl flex items-center gap-6 justify-start text-[#BFDB38] font-bold">
				<GoShieldLock className="text-4xl font-bold" /> {t("dashboard.title")}
			</h1>
			<div className="py-8 flex items-center justify-between flex-wrap gap-6">
				{isMobileScreen && (
					<div className="flex flex-col items-start justify-center gap-2">
						<h2 className="text-4xl font-semibold">{t("dashboard.greeting", { name: owner || t("dashboard.admin") })}</h2>
						<p className="text-lg font-medium tracking-widest">{t("dashboard.summary")}</p>
					</div>
				)}
				<Link to="/new/invoice">
					<Button className="py-8 px-8 text-3xl bg-[#074D41]">{t("dashboard.createInvoice")}</Button>
				</Link>
			</div>
			<div className="w-full flex items-center justify-center lg:gap-12 gap-6 flex-wrap sm:flex-nowrap">
				<Card
					icon={user}
					color={"#003768"}
					bg={"linear-gradient(to bottom right,#61F3F3,#00B8D9)"}
					value={totalInvoices}
					label={t("dashboard.totalInvoices")}
				/>
				<Card
					icon={bag}
					color={"#004B50"}
					bg={"linear-gradient(to bottom right,#5BE49B,#00A76F)"}
					label={t("dashboard.completedInvoices")}
					value={completedInvoices}
				/>
				<Card
					icon={buy}
					color={"#7A0916"}
					bg={"linear-gradient(to bottom right,#FFAC82,#FF5630)"}
					value={totalProducts || 0}
					label={t("dashboard.totalProducts")}
				/>
				<Card
					icon={message}
					color={"#7A4100"}
					bg={"linear-gradient(to bottom right,#FFD666,#FFAB00)"}
					value={recentProducts?.length}
					label={t("dashboard.recentInvoices")}
				/>
			</div>
			<DashboardTable recentProducts={recentProducts} />
		</main>
	);
};

const Card = ({ bg, color, icon, value, label }) => {
	return (
		<div
			className="xl:w-1/4 rounded-xl lg:w-1/4 md:w-1/3 sm:w-1/2 w-[48%] flex flex-col items-center justify-center gap-2 py-10"
			style={{ background: bg }}
		>
			<img src={icon} alt={label} className="w-1/2" />
			<h3 className="text-5xl font-bold" style={{ color: color }}>
				{value}
			</h3>
			<h2 className="text-3xl font-semibold tracking-wider" style={{ color }}>
				{label}
			</h2>
		</div>
	);
};

export default Dashboard;
