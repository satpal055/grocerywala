import React, { useEffect, useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const [products, setProducts] = useState([]);
    const [displayedProducts, setDisplayedProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const { addToCart } = useContext(CartContext);
    const [sliders, setSliders] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [offers, setOffers] = useState([]);
    const navigate = useNavigate();

    const PRODUCTS_PER_LOAD = 20;

    /* ---------------- SLIDERS ---------------- */
    useEffect(() => {
        fetch("http://localhost:3000/api/slider")
            .then(res => res.json())
            .then(setSliders)
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (!sliders.length) return;
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % sliders.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [sliders]);

    /* ---------------- OFFERS ---------------- */
    useEffect(() => {
        fetch("http://localhost:3000/api/offers")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setOffers(data);
            })
            .catch(console.error);
    }, []);

    /* ---------------- PRODUCTS ---------------- */
    useEffect(() => {
        fetch("https://dummyjson.com/products?limit=194")
            .then(res => res.json())
            .then(data => {
                setProducts(data.products);
                setDisplayedProducts(data.products.slice(0, PRODUCTS_PER_LOAD));
            })
            .catch(console.error);
    }, []);

    const categories = [...new Set(products.map(p => p.category))];

    const filteredProducts = selectedCategory
        ? products.filter(p => p.category === selectedCategory)
        : products;

    useEffect(() => {
        setDisplayedProducts(filteredProducts.slice(0, PRODUCTS_PER_LOAD));
    }, [selectedCategory, products]);

    const loadMore = () => {
        const start = displayedProducts.length;
        const more = filteredProducts.slice(start, start + PRODUCTS_PER_LOAD);
        setDisplayedProducts(prev => [...prev, ...more]);
    };

    /* ---------------- OFFER LOGIC ---------------- */
    const getOfferForProduct = (product) => {
        return offers.find(
            offer =>
                Array.isArray(offer.categories) &&
                offer.categories.includes(product.category)
        );
    };

    const getDiscountedPrice = (price, discount) => {
        if (!discount) return price;
        return Math.round(price - (price * discount) / 100);
    };

    /* ---------------- UI ---------------- */
    return (
        <div className="p-10">
            {/* ================= SLIDER ================= */}
            <div className="w-full overflow-hidden relative h-60 mb-10">
                <div
                    className="flex transition-transform duration-700"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {sliders.map(slide => (
                        <img
                            key={slide._id}
                            src={`http://localhost:3000${slide.imageUrl}`}
                            alt={slide.title}
                            className="w-full h-60 object-cover flex-shrink-0"
                        />
                    ))}
                </div>

                {/* ✅ SLIDER DOTS (RESTORED) */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                    {sliders.map((_, idx) => (
                        <span
                            key={idx}
                            className={`w-3 h-3 rounded-full transition ${idx === currentIndex
                                ? "bg-white"
                                : "bg-white/50"
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* ================= OFFERS SECTION ================= */}
            {offers.length > 0 && (
                <div className="mb-14">
                    <h2 className="text-center mb-6 text-2xl font-bold">
                        Best Offers For You
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {offers.map(offer => (
                            <div
                                key={offer._id}
                                className="bg-white rounded-xl shadow hover:shadow-lg transition"
                            >
                                {offer.banner && (
                                    <img
                                        src={`http://localhost:3000${offer.banner}`}
                                        alt={offer.title}
                                        className="h-40 w-full object-cover rounded-t-xl"
                                    />
                                )}

                                <div className="p-4">
                                    <h3 className="font-bold text-lg mb-1">
                                        {offer.title}
                                    </h3>

                                    <p className="text-green-600 font-semibold">
                                        {offer.discount}% OFF
                                    </p>

                                    <p className="text-sm text-gray-500 mb-3">
                                        Min Cart ₹{offer.minCart}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {offer.categories?.slice(0, 4).map(cat => (
                                            <span
                                                key={cat}
                                                className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                                            >
                                                {cat}
                                            </span>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => navigate("/cart")}
                                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                                    >
                                        Apply Offer
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ================= PRODUCTS ================= */}
            <h2 className="text-center mb-6 text-2xl font-bold">All Products</h2>

            <div className="flex justify-center mb-8">
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="border px-4 py-2 rounded w-60"
                >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {displayedProducts.map(product => {
                    const offer = getOfferForProduct(product);
                    const finalPrice = offer
                        ? getDiscountedPrice(product.price, offer.discount)
                        : product.price;

                    return (
                        <div
                            key={product.id}
                            className="rounded-lg p-4 shadow bg-white relative cursor-pointer hover:shadow-lg"
                            onClick={() => navigate(`/product/${product.id}`)}
                        >
                            {offer && (
                                <div className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
                                    {offer.discount}% OFF
                                </div>
                            )}

                            <img
                                src={product.thumbnail}
                                alt={product.title}
                                className="w-full h-32 object-contain mb-2"
                            />

                            <h2 className="text-sm font-medium mb-1">
                                {product.title}
                            </h2>

                            <div className="flex items-center gap-2 mb-2">
                                {offer && (
                                    <span className="text-gray-400 line-through text-sm">
                                        ₹{product.price}
                                    </span>
                                )}
                                <span className="font-bold text-green-600">
                                    ₹{finalPrice}
                                </span>
                            </div>

                            <div className="text-xs text-yellow-500 mb-2">
                                ⭐ {product.rating}
                            </div>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    addToCart({
                                        ...product,
                                        originalPrice: product.price,
                                        finalPrice: finalPrice, // jo tum already calculate kar rahe ho
                                    });

                                }}
                                className="w-full bg-green-600 text-white py-1 rounded hover:bg-green-700"
                            >
                                ADD
                            </button>
                        </div>
                    );
                })}
            </div>

            {displayedProducts.length < filteredProducts.length && (
                <div className="flex justify-center mt-6">
                    <button
                        onClick={loadMore}
                        className="px-6 py-2 bg-blue-600 text-white rounded"
                    >
                        Load More
                    </button>
                </div>
            )}
        </div>
    );
}
