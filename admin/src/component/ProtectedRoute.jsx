import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
    isLoggedIn,
    allowedRoles,
    children,
}) {
    // 🔐 Auth check (login OR token refresh case)
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const auth = isLoggedIn || !!token;

    // ❌ Not logged in
    if (!auth) {
        return <Navigate to="/" replace />;
    }

    // ❌ Logged in but role not allowed
    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/dashboard" replace />;
    }

    // ✅ Allowed
    return children;
}
