import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import loginimg from "@/assets/images/login.jpg";
import { useNavigate } from "react-router-dom";

export function Login() {
	const [username, setUsername] = useState("test1@gmail.com");
	const [password, setPassword] = useState("password@123");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleLogin = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {
				username,
				password,
			});

			if (response.data.success) {
				const { token, user } = response.data.data;
				localStorage.setItem("token", token);
				localStorage.setItem("user", JSON.stringify(user));
				navigate("/dashboard");
			} else {
				setError("Login failed. Please check your credentials.");
			}
		} catch (err) {
			setError("An error occurred. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="w-full lg:grid lg:grid-cols-2">
			<div className="flex items-center justify-center py-12">
				<div className="mx-auto grid w-[350px] gap-6">
					<div className="grid gap-2 text-center">
						<h1 className="text-5xl font-bold">Login</h1>
						<p className="text-balance text-2xl text-muted-foreground">Enter your email below to login to your account</p>
					</div>
					<form className="grid gap-4" onSubmit={handleLogin}>
						<div className="grid gap-2">
							<Label className="text-2xl" htmlFor="email">
								Email
							</Label>
							<Input
								className="py-8 text-2xl px-6"
								id="email"
								type="email"
								placeholder="m@example.com"
								required
								value={username}
								onChange={(e) => setUsername(e.target.value)}
							/>
						</div>
						<div className="grid gap-2">
							<div className="flex items-center">
								<Label className="text-2xl" htmlFor="password">
									Password
								</Label>
							</div>
							<Input
								className="py-8 text-2xl px-6"
								id="password"
								type="password"
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
						<Button type="submit" className="w-full text-3xl py-9 bg-[#074D41]" disabled={loading}>
							{loading ? "Logging in..." : "Login"}
						</Button>
						{error && <p className="text-red-500 text-center mt-4">{error}</p>}
					</form>
				</div>
			</div>
			<div className="hidden bg-muted lg:block">
				<img src={loginimg} alt="Image" className="h-[100%] w-full mx-auto object-cover dark:brightness-[0.2] dark:grayscale" />
			</div>
		</div>
	);
}
