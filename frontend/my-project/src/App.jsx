import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./component/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import ProtectedRoute from "./component/ProtectedRoute";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import MyOrders from "./pages/MyOrders";
import ProductDetail from "./pages/ProductDetail";
import Offers from "./pages/Offers";
import Wishlist from "./pages/Wishlist";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import Footer from "./component/Footer";
import OfferProducts from "./pages/OfferProducts"


function AppWrapper() {
  const location = useLocation();

  const hideHeaderPaths = ["/login", "/signup"];
  const shouldHideHeader = hideHeaderPaths.includes(location.pathname);

  const hideFooterPaths = ["/login", "/signup"];
  const shouldHideFooter = hideFooterPaths.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
      {/* HEADER */}
      {!shouldHideHeader && <Header />}

      {/* MAIN CONTENT */}
      <main className="flex-grow">
        <Routes>
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/offers/:offerId" element={<OfferProducts />} />

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

          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {/* FOOTER */}
      {!shouldHideFooter && <Footer />}
    </div>
  );
}


export default function App() {
  return (
    <WishlistProvider>
      <CartProvider>
        <BrowserRouter>
          <AppWrapper />
        </BrowserRouter>
      </CartProvider>
    </WishlistProvider>
  );
}
