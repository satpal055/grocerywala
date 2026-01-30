import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";

import Offers from "./pages/Offers";
import Header from "./component/Header";
import ProtectedRoute from "./component/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Orders from "./pages/Orders";
import Users from "./pages/users";
import SliderUpload from "./pages/SliderUpload";
import Inventory from "./pages/Inventory";

function AppWrapper() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const logged = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(logged);
  }, []);

  const hideHeaderPaths = ["/"];
  const shouldHideHeader = hideHeaderPaths.includes(location.pathname);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <>
      {!shouldHideHeader && (
        <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      )}

      <Routes>
        <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />} />

        {/* ✅ DASHBOARD — ALL ROLES */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectedRoute
              isLoggedIn={isLoggedIn}
              allowedRoles={["superadmin", "product"]}
            >
              <Products />
            </ProtectedRoute>
          }
        />

        <Route
          path="/categories"
          element={
            <ProtectedRoute
              isLoggedIn={isLoggedIn}
              allowedRoles={["superadmin", "product"]}
            >
              <Categories />
            </ProtectedRoute>
          }
        />
        <Route
          path="/offers"
          element={
            <ProtectedRoute
              isLoggedIn={isLoggedIn}
              allowedRoles={["superadmin"]}
            >
              <Offers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sliders"
          element={
            <ProtectedRoute
              isLoggedIn={isLoggedIn}
              allowedRoles={["superadmin", "product"]}
            >
              <SliderUpload />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute
              isLoggedIn={isLoggedIn}
              allowedRoles={["superadmin", "order"]}
            >
              <Orders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute
              isLoggedIn={isLoggedIn}
              allowedRoles={["superadmin"]}
            >
              <Users />
            </ProtectedRoute>
          }
        />

        <Route
          path="/inventory/:id?"
          element={
            <ProtectedRoute
              isLoggedIn={isLoggedIn}
              allowedRoles={["superadmin", "inventory"]}
            >
              <Inventory />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}
