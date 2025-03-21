// // import { useState } from "react";
// // import { Routes, Route } from "react-router-dom";
// // import Topbar from "./scenes/global/Topbar";
// // import Sidebar from "./scenes/global/Sidebar";
// // import Dashboard from "./scenes/dashboard";
// // import Form from "./scenes/form";
// // import { CssBaseline, ThemeProvider } from "@mui/material";
// // import { ColorModeContext, useMode } from "./theme";
// // import Allprod from "./products/showAll";
// // import UpdateProd from "./products/update";
// // import DeleteProd from "./products/delete";
// // import CreateNew from "./products/createNew";
// // import Profile from "./scenes/profile";
// // import Setting from "./scenes/setting";
// // import SlideBar from "./scenes/slideShow";
// // import Login from "./scenes/form";


// // function App() {
// //   const [theme, colorMode] = useMode();
// //   const [isSidebar, setIsSidebar] = useState(true);

// //   return (
// //       <ColorModeContext.Provider value={colorMode}>
// //         <ThemeProvider theme={theme}>
// //           <CssBaseline />
// //           <div className="app">
// //             <Sidebar isSidebar={isSidebar} />
// //             <main className="content">
// //               <Topbar setIsSidebar={setIsSidebar} />
// //               <Routes>
// //                 <Route path="/" element={<Dashboard />} />
// //                 <Route path="/form" element={<Form />} />
// //                 <Route path="/create" element={<CreateNew />} />
// //                 <Route path="/update" element={<UpdateProd />} />
// //                 <Route path="/delete" element={<DeleteProd />} />
// //                 <Route path="/read" element={<Allprod />} />
// //                 <Route path="/yourProfile" element={<Profile />} />
// //                 <Route path="/setting" element={<Setting />} />
// //                 <Route path="/slidebar" element={<SlideBar />} />
// //               </Routes>
// //             </main>
// //           </div>
// //           <Routes>
// //             <Route path="/login" element={<Login />} />
// //           </Routes>
// //         </ThemeProvider>
// //       </ColorModeContext.Provider>
// //   );
// // }

// // export default App;


// import { useState } from "react";
// import { Routes, Route } from "react-router-dom";
// import Topbar from "./scenes/global/Topbar";
// import Sidebar from "./scenes/global/Sidebar";
// import Dashboard from "./scenes/dashboard";
// import Form from "./scenes/form";
// import { CssBaseline, ThemeProvider } from "@mui/material";
// import { ColorModeContext, useMode } from "./theme";
// import Allprod from "./products/showAll";
// import UpdateProd from "./products/update";
// import DeleteProd from "./products/delete";
// import CreateNew from "./products/createNew";
// import Setting from "./scenes/setting";
// import SlideBar from "./scenes/slideShow";
// import Login from "./scenes/form";

// function App() {
//   const [theme, colorMode] = useMode();
//   const [isSidebar, setIsSidebar] = useState(true);

//   return (
//       <ColorModeContext.Provider value={colorMode}>
//         <ThemeProvider theme={theme}>
//           <CssBaseline />
          
//           <Routes>
//             <Route path="/login" element={<Login />} />
//             <Route 
//               path="/*"
//               element={
//                 <div className="app">
//                   <Sidebar isSidebar={isSidebar} />
//                   <main className="content">
//                     <Topbar setIsSidebar={setIsSidebar} />
//                     <Routes>
//                       <Route path="/" element={<Dashboard />} />
//                       <Route path="/form" element={<Form />} />
//                       <Route path="/create" element={<CreateNew />} />
//                       <Route path="/update" element={<UpdateProd />} />
//                       <Route path="/delete" element={<DeleteProd />} />
//                       <Route path="/read" element={<Allprod />} />
//                       <Route path="/setting" element={<Setting />} />
//                       <Route path="/slidebar" element={<SlideBar />} />
//                     </Routes>
//                   </main>
//                 </div>
//               }
//             />
//           </Routes>
          
//         </ThemeProvider>
//       </ColorModeContext.Provider>
//   );
// }

// export default App;



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
import CreateNew from "./products/createNew";
import Setting from "./scenes/setting";
import SlideBar from "./scenes/slideShow";
import Login from "./scenes/form";
import ProtectedRoute from "./protectedRoute";
import { AuthProvider } from "./authContext";

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
                        <Route path="/create" element={<CreateNew />} />
                        <Route path="/update" element={<UpdateProd />} />
                        <Route path="/delete" element={<DeleteProd />} />
                        <Route path="/read" element={<Allprod />} />
                        <Route path="/setting" element={<Setting />} />
                        <Route path="/slidebar" element={<SlideBar />} />
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
