import { createContext, useEffect, useState } from "react";

export const WishlistContext = createContext();

const API = "http://localhost:3000/api/wishlist";

export function WishlistProvider({ children }) {
    const [wishlist, setWishlist] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) return setWishlist([]);

        fetch(API, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => setWishlist(Array.isArray(data) ? data : []));
    }, [token]);

    const addToWishlist = async (product) => {
        const id = product?._id || product?.id || product?.productId;
        if (!id) return;

        const res = await fetch(`${API}/toggle`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ id }),
        });

        const data = await res.json();
        setWishlist(Array.isArray(data) ? data : []);
    };

    const removeFromWishlist = (id) => {
        if (!id) return;
        addToWishlist({ id });
    };

    const isInWishlist = (id) =>
        wishlist.some(i => i.productId?._id === id);

    return (
        <WishlistContext.Provider
            value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}
        >
            {children}
        </WishlistContext.Provider>
    );
}
