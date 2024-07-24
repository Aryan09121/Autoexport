import { useEffect, useState } from "react";
import { VscNewFile } from "react-icons/vsc";
import { FaPhoneVolume } from "react-icons/fa6";
import { IoMailOutline, IoLocationOutline } from "react-icons/io5";
import { logo } from "@/assets/images";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CreateInvoice = () => {
	const navigate = useNavigate();
	const [customerData, setCustomerData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
	});
	const [products, setProducts] = useState([]);
	const [profile, setProfile] = useState({});
	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setCustomerData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const addProduct = () => {
		const newProduct = {
			productName: customerData.productName,
			quantity: parseInt(customerData.quantity),
			amount: parseInt(customerData.amount),
		};
		if (products.length >= 20) {
			toast.error("you can only add upto 8 items! please create anather invoice");
			return;
		}
		setProducts((prevProducts) => [...prevProducts, newProduct]);

		setCustomerData({
			...customerData,
			productName: "",
			quantity: "",
			amount: "",
		});
	};

	const createInvoice = async () => {
		try {
			setLoading(true);
			const response = await axios.post(`${import.meta.env.VITE_API_URL}/create/invoice`, {
				customerName: `${customerData.firstName} ${customerData.lastName}`,
				email: customerData.email,
				contact: customerData.phone,
				items: products.map((product) => ({
					productName: product.productName,
					quantity: product.quantity,
					amount: product.amount,
				})),
			});

			if (response.status === 201) {
				setCustomerData({
					firstName: "",
					lastName: "",
					email: "",
					phone: "",
				});
				setProducts([]);
				toast.success("Invoice created successfully!");
			} else {
				throw new Error("Failed to create invoice");
			}
		} catch (error) {
			setLoading(false);
			// alert("hii");
			toast.error(error.response.data.message);
			console.error("Error creating invoice:", error.response.data);
		} finally {
			setLoading(false);
		}
	};

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
				console.log(data);
				setProfile(data);
			} catch (error) {
				console.error("Error fetching profile data:", error.message);
			}
		};

		fetchProfileData();
	}, []);

	return (
		<main className="w-full py-8 lg:px-8 px-5">
			<h1 className="text-4xl flex items-center gap-6 justify-start text-[#BFDB38] font-bold">
				<VscNewFile className="text-4xl font-bold" /> Invoices
			</h1>
			<section className="flex flex-col md:flex-row items-start md:items-center gap-8 mt-8">
				<div className="bg-[#011C2B] lg:h-auto w-full md:w-1/4 py-8 px-5 rounded-xl">
					<img src={logo} className="w-[70%] mx-auto my-16 hidden md:block " alt="logo" />
					<h2 className="text-3xl font-semibold text-center text-white">Company Information</h2>
					<div className="w-full mt-6 flex flex-col items-start justify-center gap-6 text-white">
						<h4 className="text-[#C9C9C9] sm:text-3xl text-xl">{profile?.companyName ? profile?.companyName : ""}</h4>
						<p className="flex gap-4 items-center justify-start">
							<FaPhoneVolume className="text-3xl" />
							<span className="text-xl">{profile?.contact ? profile?.contact : ""}</span>
						</p>
						<p className="flex gap-4 items-center justify-start">
							<IoMailOutline className="text-3xl" />
							<span className="text-xl">{profile?.email ? profile?.email : ""}</span>
						</p>
						<p className="flex gap-4 items-center justify-start">
							<IoLocationOutline className="text-3xl" />
							<span className="text-xl">{profile?.address ? profile?.address : ""}</span>
						</p>
					</div>
				</div>
				<div className="w-full md:w-2/3 py-6 px-2">
					<h2 className="text-3xl font-semibold">Client Information</h2>
					<form className="flex flex-col items-start">
						<div className="flex flex-col md:flex-row w-full items-start mt-6 gap-4">
							<div className="flex flex-col items-start w-full md:w-1/2">
								<label htmlFor="firstname" className="text-2xl">
									First Name
								</label>
								<input
									type="text"
									placeholder="John"
									id="firstname"
									className="w-full px-4 py-2 text-2xl font-medium focus:border-black border-gray-700 border-b-2 outline-none"
									name="firstName"
									value={customerData.firstName}
									onChange={handleChange}
								/>
							</div>
							<div className="flex flex-col items-start w-full md:w-1/2">
								<label htmlFor="lastname" className="text-2xl">
									Last Name
								</label>
								<input
									type="text"
									placeholder="Doe"
									id="lastname"
									className="w-full px-4 py-2 text-2xl font-medium focus:border-black border-gray-700 border-b-2 outline-none"
									name="lastName"
									value={customerData.lastName}
									onChange={handleChange}
								/>
							</div>
						</div>
						<div className="flex flex-col lg:flex-row w-full items-start mt-6 gap-4">
							<div className="flex flex-col items-start w-full lg:w-1/2">
								<label htmlFor="email" className="text-2xl">
									Email
								</label>
								<input
									type="email"
									placeholder="example@example.com"
									id="email"
									className="w-full px-4 py-2 text-2xl font-medium focus:border-black border-gray-700 border-b-2 outline-none"
									name="email"
									value={customerData.email}
									onChange={handleChange}
								/>
							</div>
							<div className="flex flex-col items-start w-full md:w-1/2">
								<label htmlFor="phone" className="text-2xl">
									Phone Number
								</label>
								<input
									type="text"
									placeholder="+1012 3456 789"
									id="phone"
									className="w-full px-4 py-2 text-2xl font-medium focus:border-black border-gray-700 border-b-2 outline-none"
									name="phone"
									value={customerData.phone}
									onChange={handleChange}
								/>
							</div>
						</div>
						<h2 className="text-3xl font-semibold mt-6">Product Information</h2>
						<div className="flex flex-col md:flex-row w-full items-start mt-6 gap-4">
							<div className="flex flex-col items-start w-full md:w-1/3">
								<label htmlFor="productname" className="text-2xl">
									Product Name
								</label>
								<input
									type="text"
									placeholder="pump"
									id="productname"
									className="w-full px-4 py-2 text-2xl font-medium focus:border-black border-gray-700 border-b-2 outline-none"
									name="productName"
									value={customerData.productName}
									onChange={handleChange}
								/>
							</div>
							<div className="flex flex-col items-start w-full md:w-1/3">
								<label htmlFor="quantity" className="text-2xl">
									Quantity
								</label>
								<input
									type="number"
									placeholder="4"
									id="quantity"
									className="w-full px-4 py-2 text-2xl font-medium focus:border-black border-gray-700 border-b-2 outline-none"
									name="quantity"
									value={customerData.quantity}
									onChange={handleChange}
								/>
							</div>
							<div className="flex flex-col items-start w-full md:w-1/3">
								<label htmlFor="amount" className="text-2xl">
									Amount
								</label>
								<input
									type="number"
									placeholder="750"
									id="amount"
									className="w-full px-4 py-2 text-2xl font-medium focus:border-black border-gray-700 border-b-2 outline-none"
									name="amount"
									value={customerData.amount}
									onChange={handleChange}
								/>
							</div>
						</div>
						<div className="flex justify-end mt-6 w-full">
							<button type="button" onClick={addProduct} className="bg-green-600 text-white px-6 py-3 text-2xl rounded-md">
								Add Product
							</button>
						</div>
						<table className="w-full mt-6 border-collapse">
							<thead>
								<tr className="border-b">
									<th className="text-left text-3xl py-3">No.</th>
									<th className="text-left text-3xl py-3">Product</th>
									<th className="text-left text-3xl py-3">Quantity</th>
									<th className="text-left text-3xl py-3">Amount</th>
									<th className="text-left text-3xl py-3">&nbsp;</th>
								</tr>
							</thead>
							<tbody>
								{products.map((product, index) => (
									<tr key={index} className="border-b">
										<td className="text-left text-3xl py-3">{index + 1}</td>
										<td className="text-left text-3xl py-3">{product.productName}</td>
										<td className="text-left text-3xl py-3">{product.quantity}</td>
										<td className="text-left text-3xl py-3">{product.amount}</td>
										<td className="text-left text-3xl py-3">
											<button
												type="button"
												className="text-red-500"
												onClick={() => {
													const updatedProducts = [...products];
													updatedProducts.splice(index, 1);
													setProducts(updatedProducts);
												}}
											>
												Remove
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
						<div className="flex justify-end mt-6 w-full">
							<button
								disabled={loading}
								type="button"
								onClick={createInvoice}
								className="bg-blue-600 text-white px-6 py-3 text-2xl rounded-md"
							>
								{loading ? "Loading..." : "Create Invoice"}
							</button>
						</div>
					</form>
				</div>
			</section>
		</main>
	);
};

export default CreateInvoice;
