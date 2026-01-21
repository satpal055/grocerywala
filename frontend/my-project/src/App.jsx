import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./component/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import ProtectedRoute from "./component/ProtectedRoute";
import { CartProvider } from "./context/CartContext";
import MyOrders from "./pages/MyOrders";
import ProductDetail from "./pages/ProductDetail";
import Offers from "./pages/Offers";

function AppWrapper() {
  const location = useLocation();

  // ❌ Header hide on Login & Signup
  const hideHeaderPaths = ["/login", "/signup"];
  const shouldHideHeader = hideHeaderPaths.includes(location.pathname);

  return (
    <>
      {!shouldHideHeader && <Header />}

      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/product/:id"
          element={
            <ProtectedRoute>
              <ProductDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/offers"
          element={
            <ProtectedRoute>
              <Offers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/myorders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <AppWrapper />
      </BrowserRouter>
    </CartProvider>
  );
}
