import { useEffect, useState } from "react";

const BASE_URL = import.meta.env.VITE_BASE_URL;


export default function Offers() {
    const [offers, setOffers] = useState([]);

    useEffect(() => {
        fetch(`${BASE_URL}/api/offers`)
            .then((res) => res.json())
            .then((data) => setOffers(Array.isArray(data) ? data : []))
            .catch((err) => console.error(err));
    }, []);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">🔥 Latest Offers</h1>

            {offers.length === 0 && (
                <p className="text-gray-500">No offers available</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {offers.map((offer) => (
                    <div
                        key={offer._id}
                        className="bg-white rounded-xl shadow hover:shadow-lg transition"
                    >
                        {offer.banner && (
                            <img
                                src={`${BASE_URL}${offer.banner}`}
                                className="h-40 w-full object-cover rounded-t-xl"
                                alt={offer.title}
                            />
                        )}

                        <div className="p-4">
                            <h2 className="font-bold text-lg">{offer.title}</h2>

                            <p className="text-green-600 font-semibold">
                                {offer.discount}% OFF
                            </p>

                            <p className="text-sm text-gray-500">
                                Min Cart ₹{offer.minCart}
                            </p>

                            <div className="flex flex-wrap gap-2 mt-3">
                                {offer.categories?.map((cat) => (
                                    <span
                                        key={cat}
                                        className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                                    >
                                        {cat}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
