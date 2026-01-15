import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        if (!email || !password) {
            alert("All fields are required");
            return;
        }

        try {
            const res = await fetch("http://localhost:3000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message);
                return;
            }

            // ✅ SAVE TOKEN
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            alert("Login successful");
            navigate("/");

        } catch (error) {
            alert("Backend server not running");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="bg-white p-6 rounded-lg shadow w-80">
                <h2 className="text-xl font-bold mb-4">Login</h2>

                <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border p-2 mb-3 rounded"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border p-2 mb-4 rounded"
                    />

                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 rounded"
                    >
                        Login
                    </button>
                </form>

                <p className="text-sm mt-3 text-center">
                    New user?{" "}
                    <Link to="/signup" className="text-green-600 font-semibold">
                        Signup
                    </Link>
                </p>
            </div>
        </div>
    );
}
