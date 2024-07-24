import { SheetClose, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { logo } from "@/assets/images";
import { NavLink, useNavigate } from "react-router-dom";
import { GoShieldLock } from "react-icons/go";
import { FaRegUserCircle } from "react-icons/fa";
import { FaFileInvoice } from "react-icons/fa6";
import { RiEqualizer2Line } from "react-icons/ri";
import { useTranslation } from "react-i18next";
import { MdGTranslate, MdLogout } from "react-icons/md";
import { VscNewFile } from "react-icons/vsc";

const Sidebar = () => {
	const navigate = useNavigate();
	const { t, i18n } = useTranslation();
	const logOut = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		navigate("/login");
	};

	const changeLanguage = (lng) => {
		i18n.changeLanguage(lng);
		// If you want to change text direction
		document.body.dir = lng === "ar" ? "ltr" : "ltr";
	};
	return (
		<SheetContent side={"left"} className="w-3/5 py-6 px-5 bg-[#083830]">
			<SheetHeader>
				<img src={logo} alt="logo" className="w-8/12 mx-auto" />
				<nav className="flex flex-col py-6 items-center justify-start gap-2 w-full">
					<h1 className="text-white text-3xl">{t("welcome")}</h1>
					<SheetClose asChild className="mt-auto">
						<NavLink
							to="/dashboard"
							className="w-full outline-none border-none focus:outline-none focus:border-none  py-5 text-center text-2xl text-white grid grid-cols-3 px-10 font-semibold tracking-wide"
						>
							<GoShieldLock className="text-4xl" />
							Dashboard
						</NavLink>
					</SheetClose>
					<SheetClose asChild className="mt-auto">
						<NavLink
							to="/invoice"
							className="w-full outline-none border-none focus:outline-none focus:border-none  py-5 text-center text-2xl text-white grid grid-cols-3 px-10 font-semibold tracking-wide"
						>
							<FaFileInvoice className="text-4xl" />
							Invoices
						</NavLink>
					</SheetClose>
					<SheetClose asChild className="mt-auto">
						<NavLink
							to="/new/invoice"
							className="w-full outline-none border-none focus:outline-none focus:border-none  py-5 text-center text-2xl text-white grid grid-cols-3 px-10 font-semibold tracking-wide"
						>
							<VscNewFile className="text-4xl" />
							Create Invoices
						</NavLink>
					</SheetClose>
					<SheetClose asChild className="mt-auto">
						<button
							className="w-full outline-none border-none focus:outline-none focus:border-none  py-5 text-center text-2xl text-white grid grid-cols-3 px-10 font-semibold tracking-wide"
							onClick={() => changeLanguage("en")}
						>
							<MdGTranslate className="text-4xl" />
							English
						</button>
					</SheetClose>
					{/* <SheetClose asChild className="mt-auto">
						<button
							className="w-full outline-none border-none focus:outline-none focus:border-none  py-5 text-center text-2xl text-white grid grid-cols-3 px-10 font-semibold tracking-wide"
							onClick={() => changeLanguage("ar")}
						>
							<MdGTranslate className="text-4xl" />
							العربية
						</button>
					</SheetClose> */}
					<SheetClose asChild className="mt-auto">
						<button
							className="w-full outline-none border-none focus:outline-none focus:border-none  py-5 text-center text-2xl text-red-500 grid grid-cols-3 px-10 font-bold tracking-wide"
							onClick={() => logOut()}
						>
							<MdLogout className="text-4xl text-red-500" />
							Logout
						</button>
					</SheetClose>
				</nav>
			</SheetHeader>

			<div className="mt-auto flex-col absolute w-full bottom-0 right-0 flex items-center justify-start gap-1">
				<hr className="bg-slate-50 w-10/12" />
				<SheetClose asChild className="mt-auto">
					<NavLink
						to="/profile"
						className="w-full outline-none border-none focus:outline-none focus:border-none  py-5 text-center text-2xl text-white grid grid-cols-4 px-10 font-semibold tracking-wide"
					>
						<FaRegUserCircle className="text-4xl" />
						Profile
					</NavLink>
				</SheetClose>
				<SheetClose asChild className="mt-auto">
					<NavLink
						to="/settings"
						className="w-full outline-none border-none focus:outline-none focus:border-none  py-5 text-center text-2xl text-white grid grid-cols-4 px-10 font-semibold tracking-wide"
					>
						<RiEqualizer2Line className="text-4xl" />
						Settings
					</NavLink>
				</SheetClose>
			</div>
		</SheetContent>
	);
};

export default Sidebar;
