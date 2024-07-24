import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { RiEqualizer2Line } from "react-icons/ri";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Settings = () => {
	const navigate = useNavigate();
	const [invoiceTax, setInvoiceTax] = useState("");
	const [discount, setDiscount] = useState("");

	useEffect(() => {
		const token = localStorage.getItem("token");
		const user = localStorage.getItem("user");

		if (!token || !user) {
			navigate("/login");
		}
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
				setInvoiceTax(data.tax || ""); // Update state with fetched tax value
				setDiscount(data.discount || ""); // Update state with fetched tax value
			} catch (error) {
				console.error("Error fetching profile data:", error.message);
				// Handle error fetching profile data (optional)
			}
		};

		fetchProfileData();
	}, []);

	const handleChange = (e) => {
		setInvoiceTax(e.target.value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await axios.put(
				`${import.meta.env.VITE_API_URL}/update/profile`,
				{ tax: invoiceTax, discount: discount }, // Update with tax field name expected by backend
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				}
			);

			if (!response.data.success) {
				throw new Error("Failed to update profile data");
			}

			const data = response.data.data;
			toast.success("settings  updated successfully!"); // Show success toast message (optional)
			setInvoiceTax(data.tax || ""); // Update state with fetched tax value
		} catch (error) {
			toast.error(error.response.data.message);
			console.error("Error updating profile:", error.message);
			// Handle error scenario (optional)
		}
	};

	return (
		<main className="w-full py-8 lg:px-8 px-5">
			<h1 className="text-4xl flex items-center gap-6 justify-start text-[#BFDB38] font-bold">
				<RiEqualizer2Line className="text-4xl font-bold" /> Settings
			</h1>
			<hr className="my-5" />
			<form className="w-full flex flex-col items-center justify-start gap-6" onSubmit={handleSubmit}>
				<div className="grid w-full max-w-xl items-center gap-3">
					<Label htmlFor="tax" className="text-2xl">
						Invoice Tax
					</Label>
					<Input
						type="number"
						placeholder="18%"
						className="w-full  file:text-2xl px-6 py-9 text-2xl font-medium file:text-black file:font-bold"
						name="invoiceTax"
						id="tax"
						value={invoiceTax}
						onChange={handleChange}
					/>
				</div>
				<div className="grid w-full max-w-xl items-center gap-3">
					<Label htmlFor="discount" className="text-2xl">
						Discount
					</Label>
					<Input
						type="number"
						placeholder="5%"
						className="w-full  file:text-2xl px-6 py-9 text-2xl font-medium file:text-black file:font-bold"
						name="discount"
						id="discount"
						value={discount}
						onChange={(e) => setDiscount(e.target.value)}
					/>
				</div>

				<Button
					type="submit"
					variant="secondary"
					size="lg"
					className="py-10 max-w-xl px-16 w-full text-3xl bg-[#074d41e1] hover:bg-[#54a598e1] "
				>
					Update
				</Button>
				<Button
					type="reset"
					variant="secondary"
					size="lg"
					className="py-10 max-w-xl px-16 w-full text-3xl bg-[#b55959] hover:bg-[#c95d5dc5] "
				>
					Cancel
				</Button>
			</form>
		</main>
	);
};

export default Settings;
