import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Sidebar from "./components/elements/Sidebar";
import Navbar from "./components/elements/Navbar";
import { Sheet } from "@/components/ui/sheet";
import Dashboard, { CreateInvoice, Invoice, Login, Profile, Settings, ViewInvoice } from "./pages";
import "./i18n";

function App() {
	const location = useLocation();
	const hideNavbarRoutes = ["/invoice/view", "/invoice/pdf", "/login"];
	const showNavbar = !hideNavbarRoutes.some((route) => new RegExp(`^${route}`).test(location.pathname));

	return (
		<div className="w-full h-full">
			<Sheet>
				<Sidebar />
				<main>
					{showNavbar && <Navbar />}
					<Routes>
						{/* <Route path="/invoice/view" element={<ViewInvoice />} /> */}
						<Route path="/" element={<Navigate to="/login" />} />
						<Route path="/login" element={<Login />} />
						<Route path="/dashboard" element={<Dashboard />} />
						<Route path="/invoice" element={<Invoice />} />
						<Route path="/invoice/pdf/:id" element={<ViewInvoice />} />
						<Route path="/new/invoice" element={<CreateInvoice />} />
						<Route path="/profile" element={<Profile />} />
						<Route path="/settings" element={<Settings />} />
					</Routes>
				</main>
			</Sheet>
		</div>
	);
}

export default App;
