import { RiMenu4Line } from "react-icons/ri";
import { logo } from "@/assets/images";
import { SheetTrigger } from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { Link } from "react-router-dom";

const Navbar = () => {
	const [isMobileScreen, setIsMobileScreen] = useState(true);
	const { t } = useTranslation();
	const [owner, setOwner] = useState("");

	useEffect(() => {
		const mediaQuery = window.matchMedia("(max-width: 768px)");
		const handleMediaQueryChange = (e) => setIsMobileScreen(e.matches);

		// Initial check
		setIsMobileScreen(mediaQuery.matches);

		// Attach the listener
		mediaQuery.addEventListener("change", handleMediaQueryChange);

		// Cleanup listener on component unmount
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
			} catch (error) {
				console.error("Error fetching profile data:", error.message);
			}
		};

		fetchProfileData();
	}, []);

	return (
		<header className="w-full flex items-center justify-between bg-[#074D41] py-4 px-8">
			<Link to="/dashboard">
				<img src={logo} className="w-40" alt="logo" />
			</Link>
			<div className="flex items-center justify-center gap-12">
				{!isMobileScreen && (
					<div className="flex flex-col items-start justify-center gap-2">
						<h2 className="text-4xl text-white font-semibold">
							{" "}
							{t("dashboard.hello")}, {owner || ""}
						</h2>
						<p className="text-lg font-medium text-white tracking-widest">{t("dashboard.greet")}</p>
					</div>
				)}
				<SheetTrigger asChild>
					<RiMenu4Line className="h-12 w-12 cursor-pointer text-white" />
				</SheetTrigger>
			</div>
		</header>
	);
};

export default Navbar;
