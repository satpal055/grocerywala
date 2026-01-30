import React, { useContext } from "react";
import { WishlistContext } from "../context/WishlistContext";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;


export default function Wishlist() {
    const { wishlist, removeFromWishlist } = useContext(WishlistContext);
    const navigate = useNavigate();

    if (!wishlist.length) {
        return <h2 className="text-center mt-10">❤️ Wishlist is empty</h2>;
    }

    return (
        <div className="p-10">
            <h2 className="text-2xl font-bold mb-6 text-center">
                My Wishlist
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {wishlist.map(item => {
                    const p = item.productId;
                    if (!p) return null;

                    return (
                        <div key={p._id} className="p-4 bg-white shadow rounded">
                            <img
                                src={`${BASE_URL}${p.thumbnail}`}
                                alt={p.title}
                                className="w-full h-32 object-contain mb-2"
                            />

                            <h3 className="text-sm font-medium">{p.title}</h3>
                            <p className="font-bold text-green-600">
                                ₹{p.price}
                            </p>

                            <button
                                onClick={() => navigate(`/product/${p._id}`)}
                                className="w-full mt-2 bg-blue-600 text-white py-1 rounded"
                            >
                                View
                            </button>

                            <button
                                onClick={() => removeFromWishlist(p._id)}
                                className="w-full mt-2 bg-red-500 text-white py-1 rounded"
                            >
                                Remove
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
