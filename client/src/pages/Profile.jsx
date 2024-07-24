import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useEffect, useState } from "react";
import { VscNewFile } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Profile = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		companyName: "",
		address: "",
		ownerName: "",
		contact: "",
		email: "",
	});

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

				setFormData({
					companyName: data.companyName,
					address: data.address,
					ownerName: data.ownerName,
					contact: data.contact,
					email: data.email,
				});
			} catch (error) {
				console.error("Error fetching profile data:", error.message);
				// Handle error fetching profile data (optional)
				// Example: Show error message to the user
			}
		};

		fetchProfileData();
	}, []);

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await axios.put(`${import.meta.env.VITE_API_URL}/update/profile`, formData, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});

			if (!response.data.success) {
				throw new Error("Failed to update profile");
			}

			const data = response.data.data;
			toast.success("Profile updated successfully");

			setFormData({
				companyName: data.companyName,
				address: data.address,
				ownerName: data.ownerName,
				contact: data.contact,
				email: data.email,
			});
		} catch (error) {
			toast.error(error.response.data.message);
			console.error("Error updating profile:", error.message);
			// Handle error scenario (optional)
			// Example: Show error message to the user
		}
	};

	return (
		<main className="w-full py-8 lg:px-8 px-5">
			<h1 className="text-4xl flex items-center gap-6 justify-start text-[#BFDB38] font-bold">
				<VscNewFile className="text-4xl font-bold" /> Profile
			</h1>
			<hr className="my-5" />
			<form className="w-full flex flex-col items-center justify-start gap-6" onSubmit={handleSubmit}>
				<div className="grid w-full max-w-xl items-center gap-3">
					<Label htmlFor="company" className="text-2xl">
						Company Name
					</Label>
					<Input
						type="text"
						placeholder="company name"
						className="w-full  file:text-2xl px-6 py-9 text-2xl font-medium file:text-black file:font-bold"
						name="companyName"
						id="company"
						value={formData.companyName}
						onChange={handleChange}
					/>
				</div>
				<div className="grid w-full max-w-xl items-center gap-3">
					<Label htmlFor="address" className="text-2xl">
						Address
					</Label>
					<Textarea
						id="address"
						className="text-2xl font-medium"
						placeholder="Type your message here."
						value={formData.address}
						name="address"
						onChange={handleChange}
					/>
				</div>
				<div className="grid w-full max-w-xl items-center gap-3">
					<Label htmlFor="owner" className="text-2xl">
						Owner Name
					</Label>
					<Input
						type="text"
						placeholder="Owner Name"
						className="w-full  file:text-2xl px-6 py-9 text-2xl font-medium file:text-black file:font-bold"
						name="ownerName"
						id="owner"
						value={formData.ownerName}
						onChange={handleChange}
					/>
				</div>
				<div className="grid w-full max-w-xl items-center gap-3">
					<Label htmlFor="contact" className="text-2xl">
						Contact
					</Label>
					<Input
						type="number"
						placeholder="contact number"
						className="w-full  file:text-2xl px-6 py-9 text-2xl font-medium file:text-black file:font-bold"
						name="contact"
						id="contact"
						value={formData.contact}
						onChange={handleChange}
					/>
				</div>
				<div className="grid w-full max-w-xl items-center gap-3">
					<Label htmlFor="email" className="text-2xl">
						Email
					</Label>
					<Input
						type="email"
						placeholder="sample@gmail.com"
						className="w-full  file:text-2xl px-6 py-9 text-2xl font-medium file:text-black file:font-bold"
						name="email"
						id="email"
						value={formData.email}
						onChange={handleChange}
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

export default Profile;
