import { useState, useEffect } from "react";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;


export default function SliderUpload() {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState("");
    const [sliders, setSliders] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editTitle, setEditTitle] = useState("");


    const handleUpload = async () => {
        if (!file) return alert("Select an image first");

        const formData = new FormData();
        formData.append("image", file);
        formData.append("title", title);

        try {
            await axios.post(`${BASE_URL}/api/slider`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            alert("Uploaded!");
            setFile(null);
            setTitle("");
            fetchSliders(); // ✅ NEW

        } catch (err) {
            console.error(err);
            alert("Upload failed");
        }
    };
    const fetchSliders = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/slider`);
            setSliders(res.data);
        } catch (err) {
            console.error("Failed to load sliders");
        }
    };
    const deleteSlider = async (id) => {
        if (!confirm("Delete this slider?")) return;

        try {
            await axios.delete(`${BASE_URL}/api/slider/${id}`);
            fetchSliders();
        } catch (err) {
            alert("Delete failed");
        }
    };
    const updateSlider = async (id) => {
        try {
            await axios.put(`${BASE_URL}/api/slider/${id}`, {
                title: editTitle
            });
            setEditId(null);
            setEditTitle("");
            fetchSliders();
        } catch (err) {
            alert("Update failed");
        }
    };


    useEffect(() => {
        fetchSliders();
    }, []);

    return (
        <>
            <div className="p-6 max-w-xl mx-auto bg-white shadow-lg rounded-xl mt-8 border">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Upload Slider Image
                </h2>

                {/* Preview */}
                {file && (
                    <div className="mb-4 flex justify-center">
                        <img
                            src={URL.createObjectURL(file)}
                            alt="Preview"
                            className="h-40 w-full object-cover rounded-lg shadow"
                        />
                    </div>
                )}

                {/* Title */}
                <div className="mb-4">
                    <label className="text-sm font-semibold text-gray-700">
                        Title
                    </label>
                    <input
                        type="text"
                        placeholder="Optional title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
                    />
                </div>

                {/* File */}
                <div className="mb-6">
                    <label className="text-sm font-semibold text-gray-700">
                        Choose Image
                    </label>
                    <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="w-full mt-1 cursor-pointer"
                    />
                </div>

                {/* Button */}
                <button
                    onClick={handleUpload}
                    className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold shadow hover:bg-blue-700 transition-all"
                >
                    Upload
                </button>
            </div>
            {/* -------- SLIDER LIST -------- */}
            <div className="max-w-5xl mx-auto my-10">
                <h3 className="text-xl font-bold mb-4">All Sliders</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {sliders.map((slider) => (
                        <div
                            key={slider._id}
                            className="border rounded-lg shadow p-3 bg-white"
                        >
                            <img
                                src={`${BASE_URL}${slider.imageUrl}`}
                                className="h-40 w-full object-cover rounded"
                            />

                            {/* TITLE */}
                            {editId === slider._id ? (
                                <input
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    className="w-full border p-1 mt-2 rounded"
                                />
                            ) : (
                                <p className="mt-2 font-semibold text-center">
                                    {slider.title || "No Title"}
                                </p>
                            )}

                            {/* ACTIONS */}
                            <div className="flex justify-between mt-3">
                                {editId === slider._id ? (
                                    <button
                                        onClick={() => updateSlider(slider._id)}
                                        className="text-green-600 font-semibold"
                                    >
                                        Save
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setEditId(slider._id);
                                            setEditTitle(slider.title);
                                        }}
                                        className="text-blue-600 font-semibold"
                                    >
                                        Edit
                                    </button>
                                )}

                                <button
                                    onClick={() => deleteSlider(slider._id)}
                                    className="text-red-600 font-semibold"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </>

    );
}
