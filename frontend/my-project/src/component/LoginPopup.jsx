import React from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPopup({ onClose }) {
    const navigate = useNavigate();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-80 text-center shadow-lg">
                <h2 className="text-lg font-bold mb-2">
                    Login Required
                </h2>

                <p className="text-sm text-gray-600 mb-4">
                    Please login to add products to your cart.
                </p>

                <div className="flex justify-center gap-3">
                    <button
                        onClick={() => navigate("/login")}
                        className="bg-green-600 text-white px-4 py-2 rounded"
                    >
                        Login
                    </button>

                    <button
                        onClick={onClose}
                        className="bg-gray-200 px-4 py-2 rounded"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
