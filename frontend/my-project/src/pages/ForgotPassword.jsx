import { useState } from "react";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");

    const handleSubmit = async () => {
        if (!email) {
            alert("Email required");
            return;
        }

        const res = await fetch("http://localhost:3000/api/auth/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        const data = await res.json();
        alert(data.message);
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="bg-white p-6 rounded shadow w-80">
                <h2 className="text-xl font-bold mb-4">Forgot Password</h2>

                <input
                    type="email"
                    placeholder="Enter registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border p-2 mb-4 rounded"
                />

                <button
                    onClick={handleSubmit}
                    className="w-full bg-blue-600 text-white py-2 rounded"
                >
                    Send Reset Link
                </button>
            </div>
        </div>
    );
}
