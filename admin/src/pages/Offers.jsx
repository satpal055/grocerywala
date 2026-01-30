import React, { useEffect, useState } from "react";

const BASE_URL = import.meta.env.VITE_BASE_URL;


export default function Offers() {
    const [bannerPreview, setBannerPreview] = useState(null);
    const [bannerFile, setBannerFile] = useState(null);
    const [title, setTitle] = useState("");
    const [discount, setDiscount] = useState("");
    const [minCart, setMinCart] = useState("");
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [offers, setOffers] = useState([]);
    const [expiryDate, setExpiryDate] = useState("");


    const categories = [
        "mobile-accessories",
        "motorcycle",
        "mens-watches",
        "laptops",
        "beauty",
        "kitchen-accessories",
        "mens-shirts",
        "groceries",
        "vehicle",
        "tablets",
        "tops",
        "womens-bags",
        "mens-shoes",
        "home-decoration",
        "fragrances",
        "furniture",
        "motorcycle",
        "skin-care",
        "smartphones",
        "sports-accessories",
        "sunglasses",
    ];

    /* 🔄 FETCH OFFERS ON LOAD */
    useEffect(() => {
        fetch(`${BASE_URL}/api/offers`)
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setOffers(data);
                }
            })
            .catch((err) => console.error(err));
    }, []);

    const toggleCategory = (cat) => {
        setSelectedCategories((prev) =>
            prev.includes(cat)
                ? prev.filter((c) => c !== cat)
                : [...prev, cat]
        );
    };

    /* ✅ SAVE OFFER */
    const handleSaveOffer = async () => {
        if (!title || !discount) {
            alert("Title and discount required");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("discount", discount);
        formData.append("minCart", minCart);
        formData.append("categories", JSON.stringify(selectedCategories));
        formData.append("expiryDate", expiryDate);


        if (bannerFile) {
            formData.append("banner", bannerFile);
        }

        try {
            const res = await fetch(`${BASE_URL}/api/offers`, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const text = await res.text();
                console.error("Backend error:", text);
                alert("Failed to save offer");
                return;
            }

            const savedOffer = await res.json();
            setOffers((prev) => [savedOffer, ...prev]);

            /* 🔁 RESET FORM */
            setTitle("");
            setDiscount("");
            setMinCart("");
            setSelectedCategories([]);
            setBannerPreview(null);
            setBannerFile(null);
        } catch (err) {
            console.error("Offer save error:", err);
            alert("Failed to save offer");
        }
    };

    const handleDelete = (id) => {
        setOffers((prev) => prev.filter((o) => o._id !== id));
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Add Offer</h1>

            {/* ADD OFFER FORM */}
            <div className="bg-white p-6 rounded-xl shadow mb-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Offer Title"
                        className="border p-2 rounded"
                    />
                    <input
                        type="number"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        placeholder="Discount %"
                        className="border p-2 rounded"
                    />
                    <input
                        type="number"
                        value={minCart}
                        onChange={(e) => setMinCart(e.target.value)}
                        placeholder="Min Cart Value"
                        className="border p-2 rounded"
                    />
                    <input
                        type="date"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        className="border p-2 rounded"
                        placeholder="Expiry Date"
                    />

                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            setBannerFile(e.target.files[0]);
                            setBannerPreview(
                                URL.createObjectURL(e.target.files[0])
                            );
                        }}
                        className="border p-2 rounded"
                    />
                </div>

                {bannerPreview && (
                    <img
                        src={bannerPreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded mb-4"
                    />
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                    {categories.map((cat) => (
                        <label
                            key={cat}
                            className="flex items-center gap-2 text-sm"
                        >
                            <input
                                type="checkbox"
                                checked={selectedCategories.includes(cat)}
                                onChange={() => toggleCategory(cat)}
                            />
                            {cat}
                        </label>
                    ))}
                </div>

                <button
                    onClick={handleSaveOffer}
                    className="bg-blue-600 text-white px-6 py-2 rounded"
                >
                    Save Offer
                </button>
            </div>

            {/* OFFERS TABLE */}
            {offers.length > 0 && (
                <div className="bg-white rounded-xl shadow overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 text-left">Banner</th>
                                <th className="p-3 text-left">Title</th>
                                <th className="p-3">Discount</th>
                                <th className="p-3">Min Cart</th>
                                <th className="p-3">Categories</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {offers.map((offer) => (
                                <tr key={offer._id} className="border-t">
                                    <td className="p-3">
                                        {offer.banner && (
                                            <img
                                                src={`${BASE_URL}${offer.banner}`}
                                                className="w-14 h-14 object-cover rounded"
                                                alt="banner"
                                            />
                                        )}
                                    </td>
                                    <td className="p-3 font-medium">
                                        {offer.title}
                                    </td>
                                    <td className="p-3 text-center">
                                        {offer.discount}%
                                    </td>
                                    <td className="p-3 text-center">
                                        ₹{offer.minCart || "-"}
                                    </td>
                                    <td className="p-3 text-gray-600 text-center">
                                        {offer.categories?.join(", ")}
                                    </td>
                                    <td className="p-3 text-center">
                                        <button
                                            onClick={() =>
                                                handleDelete(offer._id)
                                            }
                                            className="bg-red-600 text-white px-3 py-1 rounded text-xs"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
