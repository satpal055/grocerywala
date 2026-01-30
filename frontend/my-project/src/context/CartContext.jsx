import { createContext, useState, useEffect, useMemo } from "react";

export const CartContext = createContext();
const BASE_URL = import.meta.env.VITE_BASE_URL;


/* ================= USER HELPER ================= */
const getUserId = () => {
    try {
        const user = JSON.parse(localStorage.getItem("user"));
        return user?.id || null;
    } catch {
        return null;
    }
};

export function CartProvider({ children }) {

    // ✅ user-based key
    const userId = getUserId();
    const CART_KEY = userId ? `cart_${userId}` : "cart_guest";

    /* ================= CART STATE ================= */
    const [cart, setCart] = useState(() => {
        try {
            const data = localStorage.getItem(CART_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error("Cart parse error:", error);
            return [];
        }
    });

    /* ================= RELOAD CART ON USER CHANGE ================= */
    useEffect(() => {
        try {
            const data = localStorage.getItem(CART_KEY);
            setCart(data ? JSON.parse(data) : []);
        } catch {
            setCart([]);
        }
    }, [CART_KEY]);

    /* ================= PERSIST CART ================= */
    useEffect(() => {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }, [cart, CART_KEY]);

    /* ================= ADD TO CART ================= */
    const addToCart = (product) => {
        setCart((prevCart) => {
            const exist = prevCart.find(p => p.id === product.id);

            const originalPrice =
                product.originalPrice ?? product.price;

            const finalPrice =
                product.finalPrice ?? product.price;

            const stock = product.stock ?? Infinity;

            // 🚫 Stock limit check
            if (exist) {
                if (exist.quantity >= stock) {
                    return prevCart; // ❌ aur add nahi hoga
                }

                return prevCart.map(p =>
                    p.id === product.id
                        ? { ...p, quantity: p.quantity + 1 }
                        : p
                );
            }

            // 🚫 Stock 0 hai to add hi nahi hoga
            if (stock <= 0) return prevCart;

            return [
                ...prevCart,
                {
                    ...product,
                    originalPrice,
                    finalPrice,
                    quantity: 1,
                },
            ];
        });
    };


    /* ================= INCREMENT ================= */
    const increment = (id) => {
        setCart(prev =>
            prev.map(item => {
                const stock = item.stock ?? Infinity;

                if (item.id === id) {
                    if (item.quantity >= stock) {
                        return item; // ❌ limit hit
                    }
                    return { ...item, quantity: item.quantity + 1 };
                }
                return item;
            })
        );
    };


    /* ================= DECREMENT ================= */
    const decrement = (id) => {
        setCart(prev =>
            prev
                .map(item =>
                    item.id === id
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter(item => item.quantity > 0)
        );
    };

    /* ================= REMOVE ITEM ================= */
    const removeFromCart = (id) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    /* ================= CLEAR CART ================= */
    const clearCart = () => {
        setCart([]);
    };

    /* ================= DERIVED VALUES ================= */
    const totalItems = useMemo(
        () => cart.reduce((sum, item) => sum + item.quantity, 0),
        [cart]
    );

    const totalPrice = useMemo(
        () =>
            cart.reduce(
                (sum, item) =>
                    sum + item.finalPrice * item.quantity,
                0
            ),
        [cart]
    );
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        fetch(`${BASE_URL}/api/cart/sync`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ items: cart }),
        }).catch(() => { });
    }, [cart]);

    return (
        <CartContext.Provider
            value={{
                cart,
                setCart,
                addToCart,
                increment,
                decrement,
                removeFromCart,
                clearCart,
                totalItems,
                totalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}
