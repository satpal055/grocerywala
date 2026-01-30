import { useState } from "react";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;


export default function SliderUpload() {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState("");

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
        } catch (err) {
            console.error(err);
            alert("Upload failed");
        }
    };

    return (
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
    );
}
