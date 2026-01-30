import React, { useEffect, useState } from "react";
const BASE_URL = import.meta.env.VITE_BASE_URL;


export default function Products() {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({
        title: "",
        price: "",
        stock: "",
        category: "",
        rating: "",
        brand: "",
        description: "",
        thumbnail: "",
        files: [],
    });
    const [editingId, setEditingId] = useState(null);

    /* ---------------- FETCH PRODUCTS ---------------- */
    useEffect(() => {
        fetch(`${BASE_URL}/api/products`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) setProducts(data);
                else setProducts([]);
            })
            .catch(console.log);
    }, []);

    /* ---------------- HANDLE INPUT ---------------- */
    const handleChange = (e) => {
        setNewProduct({
            ...newProduct,
            [e.target.name]: e.target.value,
        });
    };

    /* ---------------- ADD / UPDATE PRODUCT ---------------- */
    const handleAddOrUpdateProduct = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("title", newProduct.title);
            formData.append("price", newProduct.price);
            formData.append("stock", newProduct.stock);
            formData.append("category", newProduct.category);
            formData.append("rating", newProduct.rating);
            formData.append("brand", newProduct.brand);
            formData.append("description", newProduct.description);
            formData.append("thumbnail", newProduct.thumbnail);

            if (newProduct.files.length > 0) {
                newProduct.files.forEach((file) => {
                    formData.append("images", file);
                });
            }

            const url = editingId
                ? `${BASE_URL}/api/products/${editingId}`
                : `${BASE_URL}/api/products`;

            const method = editingId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                body: formData,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!res.ok) {
                const text = await res.text();
                console.error("Server error:", text);
                return;
            }

            const data = await res.json();

            if (editingId) {
                setProducts(products.map((p) => (p._id === editingId ? data : p)));
                setEditingId(null);
            } else {
                setProducts([...products, data]);
            }

            setNewProduct({
                title: "",
                price: "",
                stock: "",
                category: "",
                rating: "",
                brand: "",
                description: "",
                thumbnail: "",
                files: [],
            });
        } catch (err) {
            console.log("Fetch error:", err);
        }
    };

    /* ---------------- EDIT PRODUCT ---------------- */
    const handleEditClick = (product) => {
        setNewProduct({
            title: product.title,
            price: product.price,
            stock: product.stock,
            category: product.category,
            rating: product.rating || "",
            brand: product.brand || "",
            description: product.description || "",
            thumbnail: product.thumbnail || "",
            files: [],
        });
        setEditingId(product._id);
    };

    /* ---------------- IMAGE URL HELPER ---------------- */
    const getImageUrl = (product) => {
        if (product.images && product.images.length > 0) {
            return `${BASE_URL}${product.images[0]}`;
        }
        if (product.thumbnail) {
            if (product.thumbnail.startsWith("/uploads/")) {
                return `${BASE_URL}${product.thumbnail}`;
            }
            return product.thumbnail;
        }
        return "";
    };

    return (
        <div className="p-8 bg-slate-50 min-h-screen">
            <h2 className="text-4xl mb-10 text-center font-extrabold text-slate-800">
                🛒 Products Management
            </h2>

            {/* FORM */}
            <form
                onSubmit={handleAddOrUpdateProduct}
                className="bg-white p-6 rounded-2xl shadow-xl mb-12 border"
            >
                <h3 className="text-xl font-bold mb-6 text-slate-700">
                    {editingId ? "✏️ Edit Product" : "➕ Add New Product"}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    <input
                        name="title"
                        placeholder="Product Title"
                        value={newProduct.title}
                        onChange={handleChange}
                        required
                        className="input"
                    />
                    <input
                        name="price"
                        type="number"
                        placeholder="Price"
                        value={newProduct.price}
                        onChange={handleChange}
                        required
                        className="input"
                    />
                    <input
                        name="rating"
                        type="number"
                        step="0.1"
                        placeholder="Rating (1–5)"
                        value={newProduct.rating}
                        onChange={handleChange}
                        className="input"
                    />
                    <input
                        name="brand"
                        placeholder="Brand"
                        value={newProduct.brand}
                        onChange={handleChange}
                        className="input"
                    />
                    <input
                        name="thumbnail"
                        placeholder="Thumbnail URL"
                        value={newProduct.thumbnail}
                        onChange={handleChange}
                        className="input"
                    />

                    <textarea
                        name="description"
                        placeholder="Description"
                        value={newProduct.description}
                        onChange={handleChange}
                        className="input col-span-1 md:col-span-6"
                    />

                    <input
                        name="stock"
                        type="number"
                        placeholder="Stock"
                        value={newProduct.stock}
                        onChange={handleChange}
                        required
                        className="input"
                    />
                    <input
                        name="category"
                        placeholder="Category"
                        value={newProduct.category}
                        onChange={handleChange}
                        required
                        className="input"
                    />

                    <input
                        type="file"
                        multiple
                        onChange={(e) =>
                            setNewProduct({
                                ...newProduct,
                                files: Array.from(e.target.files),
                            })
                        }
                        className="input"
                    />
                </div>

                <div className="text-center">
                    <button
                        type="submit"
                        className="mt-6 px-8 py-2 bg-indigo-600 hover:bg-indigo-700
                        text-white rounded-full font-semibold transition"
                    >
                        {editingId ? "Update Product" : "+ Add Product"}
                    </button>
                </div>
            </form>

            {/* TABLE */}
            <div className="bg-white rounded-2xl shadow overflow-x-auto">
                {/* TABLE */}
                <div className="bg-white rounded-2xl shadow overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-100 text-slate-700">
                            <tr>
                                <th className="p-3">Image</th>
                                <th className="p-3 text-left">Title</th>
                                <th className="p-3">Price</th>
                                <th className="p-3">Stock</th>
                                <th className="p-3">Category</th>
                                <th className="p-3">Rating</th>
                                <th className="p-3">Brand</th>
                                <th className="p-3 text-left">Description</th>
                                <th className="p-3">Images</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {products.map((product) => (
                                <tr
                                    key={product._id}
                                    className="border-t hover:bg-slate-50 transition"
                                >
                                    {/* MAIN IMAGE */}
                                    <td className="p-3 text-center">
                                        <img
                                            src={getImageUrl(product)}
                                            alt={product.title}
                                            className="w-14 h-14 object-contain mx-auto rounded"
                                        />
                                    </td>

                                    {/* TITLE */}
                                    <td className="p-3 font-medium text-slate-800">
                                        {product.title}
                                    </td>

                                    {/* PRICE */}
                                    <td className="p-3 text-center font-semibold text-emerald-600">
                                        ₹{product.price}
                                    </td>

                                    {/* STOCK */}
                                    <td className="p-3 text-center">
                                        {product.stock}
                                    </td>

                                    {/* CATEGORY */}
                                    <td className="p-3 text-center">
                                        {product.category}
                                    </td>

                                    {/* RATING */}
                                    <td className="p-3 text-center text-amber-500 font-semibold">
                                        ⭐ {Number(product.rating || 0).toFixed(1)}
                                    </td>

                                    {/* BRAND */}
                                    <td className="p-3 text-center">
                                        {product.brand || "-"}
                                    </td>

                                    {/* DESCRIPTION */}
                                    <td className="p-3 text-left text-xs text-slate-600 max-w-xs">
                                        {product.description
                                            ? product.description.slice(0, 80) + "..."
                                            : "-"}
                                    </td>

                                    {/* EXTRA IMAGES COUNT */}
                                    <td className="p-3 text-center">
                                        {product.images?.length || 0}
                                    </td>

                                    {/* ACTION */}
                                    <td className="p-3 text-center">
                                        <button
                                            className="px-3 py-1 bg-amber-500 hover:bg-amber-600
                            text-white rounded-full text-xs transition"
                                            onClick={() => handleEditClick(product)}
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>

            {/* Tailwind helper */}
            <style>{`
                .input {
                    background: white;
                    border: 1px solid #cbd5e1;
                    padding: 0.5rem;
                    border-radius: 0.75rem;
                    outline: none;
                }
                .input:focus {
                    border-color: #6366f1;
                    box-shadow: 0 0 0 1px #6366f1;
                }
            `}</style>
        </div>
    );
}
