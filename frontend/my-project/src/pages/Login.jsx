import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
const BASE_URL = import.meta.env.VITE_BASE_URL;

/* ================= GUEST → USER CART MERGE ================= */
const mergeGuestCartIntoUser = (userId) => {
    const guestCart =
        JSON.parse(localStorage.getItem("cart_guest")) || [];

    const userCartKey = `cart_${userId}`;
    const userCart =
        JSON.parse(localStorage.getItem(userCartKey)) || [];

    const map = new Map();

    // existing user cart
    userCart.forEach(item => {
        map.set(item.id, { ...item });
    });

    // merge guest cart
    guestCart.forEach(item => {
        if (map.has(item.id)) {
            map.get(item.id).quantity += item.quantity;
        } else {
            map.set(item.id, item);
        }
    });

    localStorage.setItem(
        userCartKey,
        JSON.stringify(Array.from(map.values()))
    );

    // cleanup guest cart
    localStorage.removeItem("cart_guest");
};

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
            const res = await fetch(`${BASE_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message);
                return;
            }

            // ✅ SAVE AUTH
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            // 🔥 MERGE GUEST CART INTO USER CART
            mergeGuestCartIntoUser(data.user.id);

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

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleLogin();
                    }}
                >
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

                    <p className="text-sm my-2 text-right">
                        <Link
                            to="/forgot-password"
                            className="text-blue-600"
                        >
                            Forgot Password?
                        </Link>
                    </p>

                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 rounded"
                    >
                        Login
                    </button>
                </form>

                <p className="text-sm mt-3 text-center">
                    New user?{" "}
                    <Link
                        to="/signup"
                        className="text-green-600 font-semibold"
                    >
                        Signup
                    </Link>
                </p>
            </div>
        </div>
    );
}
