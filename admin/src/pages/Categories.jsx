import React, { useEffect, useState } from "react";

const BASE_URL = import.meta.env.VITE_BASE_URL;


export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);

    // Fetch products and extract unique categories
    useEffect(() => {
        fetch(`${BASE_URL}/api/products`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setProducts(data);
                    const uniqueCategories = [
                        ...new Set(data.map((p) => p.category).filter(Boolean)),
                    ];
                    setCategories(uniqueCategories);
                } else {
                    setCategories([]);
                }
            })
            .catch((err) => console.log(err));
    }, []);

    // Add new category (local only)
    const handleAdd = () => {
        const newCategory = window.prompt("Enter new category name");
        if (!newCategory) return;

        if (categories.includes(newCategory)) {
            alert("Category already exists");
            return;
        }

        setCategories([...categories, newCategory]);
        alert(
            "Category added locally. To persist, assign a product to this category."
        );
    };

    // Edit category name
    const handleEdit = async (oldCategory) => {
        const newCategory = window.prompt(
            "Enter new category name",
            oldCategory
        );
        if (!newCategory || newCategory === oldCategory) return;

        try {
            await Promise.all(
                products
                    .filter((p) => p.category === oldCategory)
                    .map((p) =>
                        fetch(`${BASE_URL}/api/products/${p._id}`, {
                            method: "PUT",
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem(
                                    "token"
                                )}`,
                            },
                            body: (() => {
                                const formData = new FormData();
                                formData.append("title", p.title);
                                formData.append("price", p.price);
                                formData.append("stock", p.stock);
                                formData.append("category", newCategory);
                                return formData;
                            })(),
                        })
                    )
            );

            const updatedProducts = products.map((p) =>
                p.category === oldCategory
                    ? { ...p, category: newCategory }
                    : p
            );

            setProducts(updatedProducts);
            setCategories([
                ...new Set(updatedProducts.map((p) => p.category)),
            ]);
        } catch (err) {
            console.error(err);
            alert("Failed to update category");
        }
    };

    // Delete category (set to Uncategorized)
    const handleDelete = async (category) => {
        if (!window.confirm("Delete this category?")) return;

        try {
            await Promise.all(
                products
                    .filter((p) => p.category === category)
                    .map((p) =>
                        fetch(`${BASE_URL}/api/products/${p._id}`, {
                            method: "PUT",
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem(
                                    "token"
                                )}`,
                            },
                            body: (() => {
                                const formData = new FormData();
                                formData.append("title", p.title);
                                formData.append("price", p.price);
                                formData.append("stock", p.stock);
                                formData.append(
                                    "category",
                                    "Uncategorized"
                                );
                                return formData;
                            })(),
                        })
                    )
            );

            const updatedProducts = products.map((p) =>
                p.category === category
                    ? { ...p, category: "Uncategorized" }
                    : p
            );

            setProducts(updatedProducts);
            setCategories([
                ...new Set(updatedProducts.map((p) => p.category)),
            ]);
        } catch (err) {
            console.error(err);
            alert("Failed to delete category");
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <div className="flex justify-end mb-4">
                <button
                    onClick={handleAdd}
                    className="px-4 py-2 bg-green-600 text-white rounded"
                >
                    Add Category
                </button>
            </div>

            <table border="1" cellPadding="10" width="100%">
                <thead>
                    <tr>
                        <th>Category Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((cat, index) => (
                        <tr key={index} className="text-center">
                            <td>{cat}</td>
                            <td className="flex justify-center gap-2">
                                <button
                                    onClick={() => handleEdit(cat)}
                                    className="mb-2 px-2 py-1 bg-yellow-500 text-white rounded"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(cat)}
                                    className="mb-2 px-2 py-1 bg-red-600 text-white rounded"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
