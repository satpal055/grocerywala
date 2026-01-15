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

    // 👉 Every cart update goes to localStorage
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        setCart((prevCart) => {
            const exist = prevCart.find((p) => p.id === product.id);
            if (exist) {
                return prevCart.map((p) =>
                    p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    const setCartItems = (newCart) => {
        setCart(newCart);
    };

    const totalItems = cart.reduce((sum, p) => sum + p.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, setCart: setCartItems, totalItems }}>
            {children}
        </CartContext.Provider>
    );
}
