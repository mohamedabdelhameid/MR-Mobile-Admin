import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Allprod from "./products/showAll";
import UpdateProd from "./products/update";
import DeleteProd from "./products/delete";
import ShowSlider from "./scenes/ShowSlider";
import SlideBar from "./scenes/sliderbar";
import Login from "./scenes/form";
import ProtectedRoute from "./protectedRoute";
import { AuthProvider } from "./authContext";
import Create from "./products/greate";
import CreateAccessory from "./accessoires/createNew";
import Dlteacc from "./accessoires/delete";
import Showacc from "./accessoires/showAll";
import Updteacc from "./accessoires/update";
import ProductDetails from "./products/productDetails";
import AccDetails from "./accessoires/productDetails";
import AddBrand from "./brands/createBrand";
import BrandsList from "./brands/showBrands";
import BrandUpdate from "./brands/ubdateBrand";
import ColorsList from "./colors&image/list";
import AddAccessoryImage from "./accessoires/addImageColor";
import ADDcolor from "./colors&image/add";
import UpdateColor from "./colors&image/updateColor";
import MessagesTable from "./contact-us/showMessage";
import SplashScreen from "./components/SplashScreen";
import NotFound from "./notFound/notFound";
import AddColorImage from "./colors&image/addImageImageColor";
import img from './image-removebg-preview.png';
import ADDcolorrr from "./products/addColor";
import AddAccessoryColor from "./accessoires/addColorAccessory";
import OrdersPage from "./orders/orderTable";
// import OrderDetailsPage from "./orders/orderDetails";

function App() {
    const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const [loading, setLoading] = useState(true);

  // ✅ إضافة التحقق من حجم الشاشة
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 800);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 800);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Splash Screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // ✅ عرض Splash
  if (loading) {
    return <SplashScreen />;
  }

  // ✅ لو مش ديسكتوب → عرض رسالة خاصة
  if (!isDesktop) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light text-center px-3" style={{direction:'rtl'}}>
        <img
          src={img}
          alt="desktop required"
          className="mb-4 rounded shadow"
        />
        <h1 className="text-danger fw-bold mb-3">الموقع متاح فقط على أجهزة الكمبيوتر</h1>
        <p className="text-muted fs-5">
          من فضلك افتح الموقع باستخدام جهاز كمبيوتر للاستفادة الكاملة من جميع المميزات.
        </p>
      </div>
    );
  }

  return (
    <AuthProvider>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />

          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <div className="app">
                    {!isLoginPage && <Sidebar isSidebar={isSidebar} />}
                    <main className="content">
                      {!isLoginPage && <Topbar setIsSidebar={setIsSidebar} />}
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/create" element={<Create />} />
                        <Route path="/read" element={<Allprod />} />
                        <Route path="/sliderbar" element={<SlideBar />} />
                        <Route path="/addColorImage" element={<AddColorImage />} />
                        <Route path="/ordersPage" element={<OrdersPage />} />
                        <Route path="/addAccessoryImage" element={<AddAccessoryImage />} />
                        <Route path="/ShowSlider" element={<ShowSlider />} />
                        <Route path="/allprod" element={<Allprod />} />
                        <Route path="/crtacc" element={<CreateAccessory />} />
                        <Route path="/addColorToAccessory" element={<AddAccessoryColor />} />
                        <Route path="/Dlteacc" element={<Dlteacc />} />
                        <Route path="/showacc" element={<Showacc />} />
                        <Route path="/createBrand" element={<AddBrand />} />
                        <Route path="/showBrand" element={<BrandsList />} />
                        <Route path="/updateBrand/:id" element={<BrandUpdate />} />
                        <Route path="/showColor" element={<ColorsList />} />
                        <Route path="/updateColor/:id" element={<UpdateColor />} />
                        <Route path="/addColor" element={<ADDcolor />} />
                        <Route path="/addColorToMobile" element={<ADDcolorrr />} />
                        <Route path="/messages" element={<MessagesTable />} />
                        <Route path="/Updteacc/:id" element={<Updteacc />} />
                        <Route path="/updateprod/:id" element={<UpdateProd />} />
                        {/* <Route path="/orders/:id" element={<OrderDetailsPage />} /> */}
                        <Route path="/accessories/:id" element={<AccDetails />} />
                        <Route path="/products/:id" element={<ProductDetails />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                  </div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </AuthProvider>
  );
}

export default App;