import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Allprod from "./products/showAll";
import UpdateProd from "./products/update";
import DeleteProd from "./products/delete";
// import CreateNew from "./products/createNew";
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
import ADDcolor from "./colors&image/add";
import MessagesTable from "./contact-us/showMessage";


// داخل الـ Routes



function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

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
                        <Route path="/ShowSlider" element={<ShowSlider />} />
                        <Route path="/allprod" element={<Allprod />} />
                        <Route path="/crtacc" element={<CreateAccessory />} />
                        <Route path="/Dlteacc" element={<Dlteacc />} />
                        <Route path="/showacc" element={<Showacc />} />
                        <Route path="/createBrand" element={<AddBrand />} />
                        <Route path="/showBrand" element={<BrandsList />} />
                        <Route path="/updateBrand/:id" element={<BrandUpdate />} />
                        <Route path="/addColor" element={<ADDcolor />} />
                        <Route path="/messages" element={<MessagesTable />} />
                        <Route path="/Updteacc/:id" element={<Updteacc />} />
                        <Route path="/updateprod/:id" element={<UpdateProd />} />
                        <Route path="/accessories/:id" element={<AccDetails />} />
                        <Route path="/products/:id" element={<ProductDetails />} />
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
