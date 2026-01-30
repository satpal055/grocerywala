import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_BASE_URL;


export default function Inventory() {
    const location = useLocation();
    const productFromState = location.state?.productToManage || null;

    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    // 🔥 IMPORTANT FIX: store only ID (not full object)
    const [selectedProductId, setSelectedProductId] = useState(null);

    // Modal states
    const [stockValue, setStockValue] = useState("");
    const [reason, setReason] = useState("");
    const [action, setAction] = useState("set");

    /* ---------------- FETCH PRODUCTS ---------------- */
    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (productFromState?._id) {
            setSelectedProductId(productFromState._id);
            setStockValue("");
            setAction("set");
            setReason("");
        }
    }, [productFromState]);

    const fetchProducts = async () => {
        try {
            const res = await axios.get(
                `${BASE_URL}/api/products`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setProducts(res.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    /* ---------------- FILTER + PAGINATION ---------------- */
    const allCategories = [
        "All",
        ...Array.from(
            new Set(products.map((p) => p.category).filter(Boolean))
        ),
    ];

    const filteredProducts = products.filter(
        (p) =>
            p.title.toLowerCase().includes(search.toLowerCase()) &&
            (filter === "All" || p.category === filter)
    );

    const totalPages = Math.ceil(filteredProducts.length / pageSize);

    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [search, filter, pageSize]);

    /* ---------------- SELECTED PRODUCT (SAFE) ---------------- */
    const selectedProduct = products.find(
        (p) => p._id === selectedProductId
    );

    /* ---------------- MANAGE STOCK ---------------- */
    const handleManageStock = (product) => {
        setSelectedProductId(product._id);
        setStockValue("");
        setAction("set");
        setReason("");
    };

    const handleUpdateStock = async () => {
        if (!selectedProduct) return;

        const quantity = Number(stockValue);
        if (isNaN(quantity) || quantity <= 0) {
            alert("Enter a valid quantity");
            return;
        }

        try {
            await axios.put(
                `${BASE_URL}/api/products/${selectedProduct._id}/stock`,
                {
                    action, // set | increase | decrease
                    quantity,
                    reason,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            await fetchProducts();
            setSelectedProductId(null); // close modal
        } catch (err) {
            console.error(err);
            alert("Failed to update stock");
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Inventory</h1>
            <p className="text-gray-600 mb-4">Manage product stock levels</p>

            {/* SEARCH & FILTER */}
            <div className="flex gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search product..."
                    className="border p-2 rounded flex-1"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border p-2 rounded"
                >
                    {allCategories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>

                <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className="border p-2 rounded"
                >
                    {[5, 10, 20, 50].map((size) => (
                        <option key={size} value={size}>
                            {size}/page
                        </option>
                    ))}
                </select>
            </div>

            {/* PRODUCTS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {paginatedProducts.map((product) => (
                    <div
                        key={product._id}
                        className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center"
                    >
                        <img
                            src={
                                product.thumbnail?.startsWith("/uploads/")
                                    ? `${BASE_URL}${product.thumbnail}`
                                    : product.thumbnail
                            }
                            alt={product.title}
                            className="h-40 w-full object-cover rounded mb-2"
                        />

                        <h3 className="font-semibold">{product.title}</h3>
                        <p className="text-gray-600">₹{product.price}</p>
                        <p className="font-medium">Stock: {product.stock}</p>

                        <button
                            onClick={() => handleManageStock(product)}
                            className="mt-3 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                        >
                            Manage Stock
                        </button>
                    </div>
                ))}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => p - 1)}
                        className={`px-3 py-1 rounded border ${currentPage === 1
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-gray-100"
                            }`}
                    >
                        Prev
                    </button>

                    {Array.from(
                        { length: totalPages },
                        (_, i) => i + 1
                    ).map((page) => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1 rounded border ${page === currentPage
                                ? "bg-purple-600 text-white"
                                : "hover:bg-gray-100"
                                }`}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => p + 1)}
                        className={`px-3 py-1 rounded border ${currentPage === totalPages
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-gray-100"
                            }`}
                    >
                        Next
                    </button>
                </div>
            )}

            {/* MODAL */}
            {selectedProductId && selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-80">
                        <h2 className="text-xl font-bold mb-4">
                            {selectedProduct.title}
                        </h2>

                        <label className="block mb-2">Action</label>
                        <select
                            value={action}
                            onChange={(e) => setAction(e.target.value)}
                            className="border p-2 rounded mb-4 w-full"
                        >
                            <option value="set">Set Stock</option>
                            <option value="increase">Increase Stock</option>
                            <option value="decrease">Decrease Stock</option>
                        </select>

                        <label className="block mb-2">Quantity</label>
                        <input
                            type="number"
                            min={1}
                            value={stockValue}
                            onChange={(e) => setStockValue(e.target.value)}
                            className="border p-2 rounded mb-4 w-full"
                        />

                        <label className="block mb-2">Reason</label>
                        <select
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="border p-2 rounded mb-4 w-full"
                        >
                            <option value="">Select reason</option>
                            <option value="Restock">Restock</option>
                            <option value="Damage">Damage</option>
                            <option value="Return">Return</option>
                        </select>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setSelectedProductId(null)}
                                className="px-4 py-2 border rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateStock}
                                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
