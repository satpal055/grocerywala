import React, { useEffect, useState } from "react";

const ROLES = ["superadmin", "product", "order", "inventory", "user"];
const BASE_URL = import.meta.env.VITE_BASE_URL;


export default function Users() {
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState("users");
    const [showModal, setShowModal] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "user",
    });

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // 🔐 Only superadmin can access
    if (role !== "superadmin") {
        return (
            <div className="p-6 text-red-600 text-xl font-semibold">
                Access Denied
            </div>
        );
    }

    // 📥 Fetch Users
    const fetchUsers = () => {
        fetch(`${BASE_URL}/api/admin/users`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setUsers(Array.isArray(data) ? data : []);
            })
            .catch((err) => console.error(err));
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // 🔁 CHANGE ROLE (Admins tab only)
    const changeRole = async (id, newRole) => {
        await fetch(`${BASE_URL}/api/admin/users/${id}/role`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ role: newRole }),
        });
        fetchUsers();
    };

    // 🔴 ACTIVATE / DEACTIVATE
    const toggleStatus = async (id, currentStatus) => {
        await fetch(`${BASE_URL}/api/admin/users/${id}/status`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                status: currentStatus === "active" ? "inactive" : "active",
            }),
        });
        fetchUsers();
    };

    // ➕ ADD USER
    const handleAddUser = async () => {
        await fetch(`${BASE_URL}/api/admin/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(form),
        });

        setShowModal(false);
        setForm({ name: "", email: "", password: "", role: "user" });
        fetchUsers();
    };

    // 🔍 FILTERS
    const usersOnly = users.filter((u) => u.role === "user");
    const adminsOnly = users.filter((u) => u.role !== "user");
    const listToShow = activeTab === "users" ? usersOnly : adminsOnly;

    return (
        <div className="p-6 min-h-screen bg-gray-100">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Users Management</h1>

                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    + Add User
                </button>
            </div>

            {/* TABS */}
            <div className="flex gap-3 mb-6">
                <button
                    onClick={() => setActiveTab("users")}
                    className={`px-4 py-2 rounded ${activeTab === "users"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200"
                        }`}
                >
                    Users ({usersOnly.length})
                </button>

                <button
                    onClick={() => setActiveTab("admins")}
                    className={`px-4 py-2 rounded ${activeTab === "admins"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200"
                        }`}
                >
                    Admins ({adminsOnly.length})
                </button>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="min-w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border px-4 py-2">#</th>
                            <th className="border px-4 py-2">Name</th>
                            <th className="border px-4 py-2">Email</th>
                            <th className="border px-4 py-2">Role</th>
                            <th className="border px-4 py-2">Status</th>
                            <th className="border px-4 py-2">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {listToShow.map((u, i) => (
                            <tr key={u._id} className="text-center">
                                <td className="border px-4 py-2">{i + 1}</td>
                                <td className="border px-4 py-2">{u.name}</td>
                                <td className="border px-4 py-2">{u.email}</td>

                                {/* ⭐ ROLE COLUMN LOGIC */}
                                <td className="border px-4 py-2">
                                    {activeTab === "users" ? (
                                        <span className="font-medium text-gray-700">
                                            {u.role}
                                        </span>
                                    ) : (
                                        <select
                                            value={u.role}
                                            onChange={(e) =>
                                                changeRole(
                                                    u._id,
                                                    e.target.value
                                                )
                                            }
                                            className="border rounded px-2 py-1"
                                        >
                                            {ROLES.filter(
                                                (r) => r !== "user"
                                            ).map((r) => (
                                                <option key={r} value={r}>
                                                    {r}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </td>

                                {/* STATUS */}
                                <td className="border px-4 py-2">
                                    <span
                                        className={`px-3 py-1 rounded text-white ${u.status === "active"
                                            ? "bg-green-500"
                                            : "bg-red-500"
                                            }`}
                                    >
                                        {u.status}
                                    </span>
                                </td>

                                {/* ACTION */}
                                <td className="border px-4 py-2">
                                    <button
                                        onClick={() =>
                                            toggleStatus(u._id, u.status)
                                        }
                                        className="bg-gray-800 text-white px-3 py-1 rounded"
                                    >
                                        {u.status === "active"
                                            ? "Deactivate"
                                            : "Activate"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ADD USER MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="bg-white p-6 rounded w-96">
                        <h2 className="text-xl font-bold mb-4">Add User</h2>

                        <input
                            placeholder="Name"
                            className="border p-2 w-full mb-2"
                            value={form.name}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    name: e.target.value,
                                })
                            }
                        />

                        <input
                            placeholder="Email"
                            className="border p-2 w-full mb-2"
                            value={form.email}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    email: e.target.value,
                                })
                            }
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            className="border p-2 w-full mb-2"
                            value={form.password}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    password: e.target.value,
                                })
                            }
                        />

                        {/* ROLE – default user */}
                        <select
                            className="border p-2 w-full mb-4"
                            value={form.role}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    role: e.target.value,
                                })
                            }
                        >
                            <option value="user">user</option>
                            <option value="product">product</option>
                            <option value="order">order</option>
                            <option value="inventory">inventory</option>
                        </select>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 border rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddUser}
                                className="px-4 py-2 bg-blue-600 text-white rounded"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
