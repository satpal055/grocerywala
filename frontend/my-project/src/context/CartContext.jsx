import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState(() => {
        try {
            const data = localStorage.getItem("cart");
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    });

    // 🔒 persist cart
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    // ✅ UPDATED addToCart (NO BREAKING CHANGE)
    const addToCart = (product) => {
        setCart((prevCart) => {
            const exist = prevCart.find(
                (p) => p.id === product.id
            );

            // 👇 prices already calculated on Home
            const originalPrice =
                product.originalPrice ?? product.price;

            const finalPrice =
                product.finalPrice ?? product.price;

            if (exist) {
                return prevCart.map((p) =>
                    p.id === product.id
                        ? { ...p, quantity: p.quantity + 1 }
                        : p
                );
            }

            return [
                ...prevCart,
                {
                    ...product,
                    originalPrice, // ✅ deleted price
                    finalPrice,    // ✅ discounted price
                    quantity: 1,
                },
            ];
        });
    };

    const totalItems = cart.reduce(
        (sum, p) => sum + (p.quantity || 0),
        0
    );

    return (
        <CartContext.Provider
            value={{
                cart,
                setCart,
                addToCart,
                totalItems,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}
