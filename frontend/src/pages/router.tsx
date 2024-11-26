import { Route, Routes } from "react-router-dom";
import DashboardLayout from "./dashboard/layout";
import LoginPage from "./login";
import StoresPage from "./seller/store/storesPage";
import StorePage from "./seller/store/storePage";
import StorePageLayout from "./seller/store/storePageLayout";
import ProductsPage from "./seller/product/productsPage";
import LandingPage from "./buyer/landingPage";
import BuyerLayout from "./buyer/buyerLayout";
import EcommerceLayout from "./buyer/ecommerceLayout";
import BuyerProductPage from "./buyer/product/buyerProductPage";
import StoreOrdersPage from "./seller/order/storeOrdersPage";
import StoreOrderPage from "./seller/order/storeOrderPage";
import ProductPage from "./seller/product/productPage";
import ChatPage from "./seller/chat/chatPage";
import BuyerChatPage from "./buyer/buyerChatPage";
import StoreSettingsPage from "./seller/store/storeSettingsPage";
import CartProvider from "../context/CartContext";
import CartPage from "./buyer/cart/cartPage";
import ThankYouPage from "./buyer/cart/thankYouPage";
import BuyerOrdersPage from "./buyer/order/buyerOrdersPage";
import BuyerStorePage from "./buyer/store/buyerStorePage";
import BuyerStoresPage from "./buyer/store/buyerStoresPage";
import AdminDashboard from "./admin/adminDashboard";
import AdminProductsPage from "./admin/product/adminProductsPage";
import AdminStoresPage from "./admin/store/adminStoresPage";
import AdminOrdersPage from "./admin/order/adminOrdersPage";

const AppRouter = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <CartProvider>
            <BuyerLayout />
          </CartProvider>
        }
      >
        <Route index element={<LandingPage />} />
        <Route path="shop" element={<EcommerceLayout />}></Route>
        <Route path="product/:id" element={<BuyerProductPage />} />
        <Route path="messages" element={<BuyerChatPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="thankyou" element={<ThankYouPage />} />
        <Route path="orders" element={<BuyerOrdersPage />} />
        <Route path="stores/:storeId" element={<BuyerStorePage />} />
        <Route path="stores" element={<BuyerStoresPage />} />
      </Route>
      <Route path="/seller">
        <Route path="/seller" element={<DashboardLayout platform="seller" />}>
          <Route index element={<>hello world</>} />
          <Route path="stores" element={<StoresPage />} />
          <Route path="stores/:id" element={<StorePageLayout />}>
            <Route index element={<StorePage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/:productId" element={<ProductPage />} />
            <Route path="orders" element={<StoreOrdersPage />} />
            <Route path="orders/:orderId" element={<StoreOrderPage />} />
            <Route path="messages" element={<ChatPage />} />
            <Route path="settings" element={<StoreSettingsPage />} />
          </Route>
        </Route>
        <Route path="login" element={<LoginPage platform="seller" />} />
      </Route>
      <Route path="/admin/login" element={<LoginPage platform="admin" />} />
      <Route path="/admin" element={<DashboardLayout platform="admin" />}>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="stores" element={<AdminStoresPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
