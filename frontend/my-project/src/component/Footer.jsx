import React from "react";

export default function Footer() {
    return (
        <footer className=" bg-black text-gray-300 mt-10">
            <div className="max-w-7xl text-center mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Brand */}
                <div>
                    <h2 className="text-xl font-bold text-white">Grocery Wala</h2>
                    <p className="text-sm mt-2">
                        Building modern websites & web apps 🚀
                    </p>
                </div>

                {/* Links */}
                <div>
                    <h3 className="text-white font-semibold mb-3">Quick Links</h3>
                    <ul className="space-y-2 text-sm">
                        <li className="hover:text-white cursor-pointer">Home</li>

                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h3 className="text-white font-semibold mb-3">Contact</h3>
                    <p className="text-sm">📧 info@mail.com</p>
                    <p className="text-sm mt-1">📞 +91 1234567890</p>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-700 text-center py-4 text-sm">
                © {new Date().getFullYear()} Grocerywala. All rights reserved.
            </div>
        </footer>
    );
}
