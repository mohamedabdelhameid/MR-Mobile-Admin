// import {
//   Box,
//   Button,
//   TextField,
//   Snackbar,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   Typography,
//   IconButton,
// } from "@mui/material";
// import Header from "../components/Header";
// import AddIcon from "@mui/icons-material/Add";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import Alert from "@mui/material/Alert";
// import { useEffect, useState } from "react";
// import "./greate.css";
// import Select from "@mui/material/Select";
// import MenuItem from "@mui/material/MenuItem";
// import InputLabel from "@mui/material/InputLabel";
// import FormControl from "@mui/material/FormControl";
// import DeleteIcon from "@mui/icons-material/Delete";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import InputAdornment from "@mui/material/InputAdornment";
// import { useNavigate } from "react-router-dom";

// const API_URL = "http://127.0.0.1:8000/api/mobiles";
// const BRANDS_API_URL = "http://127.0.0.1:8000/api/brands";

// const Create = () => {
//   const [title, setTitle] = useState("");
//   const [brandId, setBrandId] = useState("");
//   const [modelNumber, setModelNumber] = useState("");
//   const [description, setDescription] = useState("");
//   const [battery, setBattery] = useState("");
//   const [processor, setProcessor] = useState("");
//   const [storage, setStorage] = useState("");
//   const [display, setDisplay] = useState("");
//   const [price, setPrice] = useState("");
//   const [discount, setDiscount] = useState("");
//   const [operatingSystem, setOperatingSystem] = useState("");
//   const [camera, setCamera] = useState("");
//   const [networkSupport, setNetworkSupport] = useState("");
//   const [releaseYear, setReleaseYear] = useState("");
//   const [stockQuantity, setStockQuantity] = useState("");
//   const [imageCover, setImageCover] = useState(null);
//   const [status, setStatus] = useState("available");
//   const [rating, setRating] = useState("");
//   const [errors, setErrors] = useState({});
//   const [brands, setBrands] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       showSnackbar("يرجى تسجيل الدخول أولاً", "error");
//       window.location.href = "/login";
//       return;
//     }

//     const fetchBrands = async () => {
//       try {
//         const response = await fetch(BRANDS_API_URL);
//         if (!response.ok) throw new Error("فشل في جلب البيانات");

//         const data = await response.json();
//         setBrands(data.data || data.brands || []);
//       } catch (error) {
//         console.error("Error:", error);
//         showSnackbar("حدث خطأ أثناء جلب الماركات", "error");
//       }
//     };

//     fetchBrands();
//   }, []);

//   const showSnackbar = (message, severity) => {
//     setSnackbar({
//       open: true,
//       message,
//       severity,
//     });
//   };

//   const handleCloseSnackbar = () => {
//     setSnackbar({ ...snackbar, open: false });
//   };

//   const validateFields = () => {
//     let newErrors = {};
//     if (!title.trim()) newErrors.title = "عنوان المنتج مطلوب";
//     if (!brandId) newErrors.brandId = "الماركة مطلوبة";
//     if (!modelNumber.trim()) newErrors.modelNumber = "رقم الموديل مطلوب";
//     if (!description.trim()) newErrors.description = "الوصف مطلوب";
//     if (!battery.trim()) newErrors.battery = "البطارية مطلوبة";
//     if (!processor.trim()) newErrors.processor = "المعالج مطلوب";
//     if (!storage.trim()) newErrors.storage = "التخزين مطلوب";
//     if (!display.trim()) newErrors.display = "الشاشة مطلوبة";
//     if (!price) newErrors.price = "السعر مطلوب";
//     if (!operatingSystem.trim()) newErrors.operatingSystem = "نظام التشغيل مطلوب";
//     if (!camera.trim()) newErrors.camera = "الكاميرا مطلوبة";
//     if (!networkSupport.trim()) newErrors.networkSupport = "دعم الشبكة مطلوب";
//     if (!releaseYear) newErrors.releaseYear = "سنة الإصدار مطلوبة";
//     if (!stockQuantity) newErrors.stockQuantity = "الكمية المتاحة مطلوبة";
//     if (!imageCover) newErrors.imageCover = "صورة المنتج مطلوبة";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setImageCover(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         document.getElementById("image").src = reader.result;
//         document.getElementById("image").style.display = "block";
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const resetForm = () => {
//     setTitle("");
//     setBrandId("");
//     setModelNumber("");
//     setDescription("");
//     setBattery("");
//     setProcessor("");
//     setStorage("");
//     setDisplay("");
//     setPrice("");
//     setDiscount("");
//     setOperatingSystem("");
//     setCamera("");
//     setNetworkSupport("");
//     setReleaseYear("");
//     setStockQuantity("");
//     setImageCover(null);
//     setRating("");
//     document.getElementById("image").style.display = "none";
//   };

//   const handleAddProduct = async () => {
//     if (!validateFields()) {
//       showSnackbar("الرجاء تعبئة جميع الحقول المطلوبة", "error");
//       return;
//     }

//     setLoading(true);
//     const formData = new FormData();

//     // إضافة بيانات المنتج
//     const productData = {
//       title,
//       brand_id: brandId,
//       model_number: modelNumber,
//       description,
//       battery : battery || '',
//       processor,
//       storage,
//       display,
//       price,
//       discount: discount || 0,
//       operating_system: operatingSystem,
//       camera,
//       network_support: networkSupport,
//       release_year: releaseYear,
//       stock_quantity: stockQuantity,
//       status,
//       rating: rating || 0,
//     };

//     Object.entries(productData).forEach(([key, value]) => {
//       formData.append(key, value);
//     });

//     if (imageCover) {
//       formData.append("image_cover", imageCover);
//     }

//     try {
//       const response = await fetch(API_URL, {
//         method: "POST",
//         headers: {
//           "Authorization": `Bearer ${localStorage.getItem("token")}`,
//           "Accept": "application/json",
//         },
//         body: formData,
//       });
    

//       const data = await response.json(); 

//       if (!response.ok) {
//         const errorData = await response.json(); // احصل على تفاصيل الخطأ من الخادم
//         console.error("تفاصيل الأخطاء:", errorData.errors);
        
//         // عرض جميع الأخطاء للمستخدم
//         if (errorData.errors) {
//           Object.entries(errorData.errors).forEach(([field, messages]) => {
//             showSnackbar(`${field}: ${messages.join(', ')}`, "error");
//           });
//         }
        
//         throw new Error(`خطأ في الخادم: ${response.status}`);
//       }
    
//       showSnackbar("تمت إضافة المنتج بنجاح", "success");
//       resetForm();
//       setTimeout(() => navigate("/allprod"), 2000);
//     } catch (error) {
//       console.error("Error:", error);
//       showSnackbar(error.message || "حدث خطأ أثناء الإضافة", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box m="20px">
//       <Header title="إضافة منتج جديد" subtitle="املأ جميع الحقول المطلوبة" />

//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: "top", horizontal: "center" }}
//       >
//         <Alert
//           onClose={handleCloseSnackbar}
//           severity={snackbar.severity}
//           sx={{ width: "100%" }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>

//       <div className="imgBox col-md-5 m-2 d-flex flex-column align-items-center justify-content-center">
//         <img
//           id="image"
//           src=""
//           alt="Uploaded"
//           width="100%"
//           height="400px"
//           style={{ display: "none" }}
//         />
//         <label htmlFor="UploadFile" className="mt-3 btn btn-primary">
//           رفع صورة المنتج
//         </label>
//         <input
//           type="file"
//           id="UploadFile"
//           style={{ display: "none" }}
//           onChange={handleFileChange}
//           required
//         />
//         {errors.imageCover && (
//           <span style={{ color: "red", marginTop: "5px" }}>
//             {errors.imageCover}
//           </span>
//         )}
//       </div>

//       <Accordion defaultExpanded>
//         <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//           المعلومات الأساسية
//         </AccordionSummary>
//         <AccordionDetails>
//           <Box display="flex" flexWrap="wrap" gap="10px" my="20px">
//             <TextField
//               label="عنوان المنتج *"
//               variant="outlined"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               error={!!errors.title}
//               helperText={errors.title}
//               fullWidth
//             />
//             <FormControl fullWidth error={!!errors.brandId}>
//               <InputLabel id="brand-label">الماركة *</InputLabel>
//               <Select
//                 labelId="brand-label"
//                 value={brandId}
//                 label="الماركة *"
//                 onChange={(e) => setBrandId(e.target.value)}
//               >
//                 {brands.map((brand) => (
//                   <MenuItem key={brand.id} value={brand.id}>
//                     {brand.name}
//                   </MenuItem>
//                 ))}
//               </Select>
//               {errors.brandId && (
//                 <span style={{ color: "red", fontSize: "0.75rem" }}>
//                   {errors.brandId}
//                 </span>
//               )}
//             </FormControl>
//             <TextField
//               label="رقم الموديل *"
//               variant="outlined"
//               value={modelNumber}
//               onChange={(e) => setModelNumber(e.target.value)}
//               error={!!errors.modelNumber}
//               helperText={errors.modelNumber}
//             />
//             <TextField
//               label="الوصف *"
//               variant="outlined"
//               fullWidth
//               multiline
//               rows={4}
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               error={!!errors.description}
//               helperText={errors.description}
//             />
//           </Box>
//         </AccordionDetails>
//       </Accordion>

//       <Accordion>
//         <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//           المواصفات الفنية
//         </AccordionSummary>
//         <AccordionDetails>
//           <Box display="flex" flexWrap="wrap" gap="10px" my="20px">
//             <TextField
//               label="البطارية *"
//               variant="outlined"
//               value={battery}
//               onChange={(e) => setBattery(e.target.value)}
//               error={!!errors.battery}
//               helperText={errors.battery}
//             />
//             <TextField
//               label="المعالج *"
//               variant="outlined"
//               value={processor}
//               onChange={(e) => setProcessor(e.target.value)}
//               error={!!errors.processor}
//               helperText={errors.processor}
//             />
//             <TextField
//               label="التخزين *"
//               variant="outlined"
//               value={storage}
//               onChange={(e) => setStorage(e.target.value)}
//               error={!!errors.storage}
//               helperText={errors.storage}
//             />
//             <TextField
//               label="الشاشة *"
//               variant="outlined"
//               value={display}
//               onChange={(e) => setDisplay(e.target.value)}
//               error={!!errors.display}
//               helperText={errors.display}
//             />
//             <TextField
//               label="نظام التشغيل *"
//               variant="outlined"
//               value={operatingSystem}
//               onChange={(e) => setOperatingSystem(e.target.value)}
//               error={!!errors.operatingSystem}
//               helperText={errors.operatingSystem}
//             />
//             <TextField
//               label="الكاميرا *"
//               variant="outlined"
//               value={camera}
//               onChange={(e) => setCamera(e.target.value)}
//               error={!!errors.camera}
//               helperText={errors.camera}
//             />
//             <TextField
//               label="دعم الشبكة *"
//               variant="outlined"
//               value={networkSupport}
//               onChange={(e) => setNetworkSupport(e.target.value)}
//               error={!!errors.networkSupport}
//               helperText={errors.networkSupport}
//             />
//           </Box>
//         </AccordionDetails>
//       </Accordion>

//       <Accordion>
//         <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//           معلومات البيع والمخزون
//         </AccordionSummary>
//         <AccordionDetails>
//           <Box display="flex" flexWrap="wrap" gap="10px" my="20px">
//             <TextField
//               label="السعر *"
//               variant="outlined"
//               value={price}
//               onChange={(e) => setPrice(e.target.value)}
//               error={!!errors.price}
//               helperText={errors.price}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">ج.م</InputAdornment>
//                 ),
//               }}
//             />
//             <TextField
//               label="الخصم"
//               variant="outlined"
//               value={discount}
//               onChange={(e) => setDiscount(e.target.value)}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">%</InputAdornment>
//                 ),
//               }}
//             />
//             <TextField
//               label="سنة الإصدار *"
//               variant="outlined"
//               value={releaseYear}
//               onChange={(e) => setReleaseYear(e.target.value)}
//               error={!!errors.releaseYear}
//               helperText={errors.releaseYear}
//             />
//             <TextField
//               label="الكمية المتاحة *"
//               variant="outlined"
//               value={stockQuantity}
//               onChange={(e) => setStockQuantity(e.target.value)}
//               error={!!errors.stockQuantity}
//               helperText={errors.stockQuantity}
//             />
//             <TextField
//               label="التقييم"
//               variant="outlined"
//               value={rating}
//               onChange={(e) => setRating(e.target.value)}
//               inputProps={{ min: 0, max: 5, step: 0.1 }}
//             />
//           </Box>
//         </AccordionDetails>
//       </Accordion>

//       <Box display="flex" justifyContent="center" mt={3}>
//         <Button
//           variant="contained"
//           color="primary"
//           startIcon={<AddIcon />}
//           onClick={handleAddProduct}
//           disabled={loading}
//           sx={{ py: 1.5, px: 4, fontSize: "1.1rem" }}
//         >
//           {loading ? "جاري الإضافة..." : "إضافة المنتج"}
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default Create;






import {
  Box,
  Button,
  TextField,
  Snackbar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  IconButton,
} from "@mui/material";
import Header from "../components/Header";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Alert from "@mui/material/Alert";
import { useEffect, useState } from "react";
import "./greate.css";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InputAdornment from "@mui/material/InputAdornment";
import { useNavigate } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000/api/mobiles";
const BRANDS_API_URL = "http://127.0.0.1:8000/api/brands";

const Create = () => {
  // States for form fields
  const [title, setTitle] = useState("");
  const [brandId, setBrandId] = useState("");
  const [modelNumber, setModelNumber] = useState("");
  const [description, setDescription] = useState("");
  const [battery, setBattery] = useState("");
  const [processor, setProcessor] = useState("");
  const [storage, setStorage] = useState("");
  const [display, setDisplay] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [operatingSystem, setOperatingSystem] = useState("");
  const [camera, setCamera] = useState("");
  const [networkSupport, setNetworkSupport] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [imageCover, setImageCover] = useState(null);
  const [status, setStatus] = useState("available");
  const [rating, setRating] = useState("");
  
  // Other states
  const [errors, setErrors] = useState({});
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      showSnackbar("يرجى تسجيل الدخول أولاً", "error");
      window.location.href = "/login";
      return;
    }

    const fetchBrands = async () => {
      try {
        const response = await fetch(BRANDS_API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!response.ok) throw new Error("فشل في جلب البيانات");

        const data = await response.json();
        setBrands(data.data || data.brands || []);
      } catch (error) {
        console.error("Error:", error);
        showSnackbar("حدث خطأ أثناء جلب الماركات", "error");
      }
    };

    fetchBrands();
  }, []);

  const showSnackbar = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const validateFields = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "عنوان المنتج مطلوب";
    if (!brandId) newErrors.brandId = "الماركة مطلوبة";
    if (!modelNumber.trim()) newErrors.modelNumber = "رقم الموديل مطلوب";
    if (!description.trim()) newErrors.description = "الوصف مطلوب";
    if (!battery.trim()) newErrors.battery = "مواصفات البطارية مطلوبة";
    if (!processor.trim()) newErrors.processor = "المعالج مطلوب";
    if (!storage.trim()) newErrors.storage = "سعة التخزين مطلوبة";
    if (!display.trim()) newErrors.display = "مواصفات الشاشة مطلوبة";
    if (!price) newErrors.price = "السعر مطلوب";
    if (!operatingSystem.trim()) newErrors.operatingSystem = "نظام التشغيل مطلوب";
    if (!camera.trim()) newErrors.camera = "مواصفات الكاميرا مطلوبة";
    if (!networkSupport.trim()) newErrors.networkSupport = "دعم الشبكة مطلوب";
    if (!releaseYear) newErrors.releaseYear = "سنة الإصدار مطلوبة";
    if (!stockQuantity) newErrors.stockQuantity = "الكمية المتاحة مطلوبة";
    if (!imageCover) newErrors.imageCover = "صورة المنتج مطلوبة";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageCover(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        document.getElementById("image").src = reader.result;
        document.getElementById("image").style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setTitle("");
    setBrandId("");
    setModelNumber("");
    setDescription("");
    setBattery("");
    setProcessor("");
    setStorage("");
    setDisplay("");
    setPrice("");
    setDiscount("");
    setOperatingSystem("");
    setCamera("");
    setNetworkSupport("");
    setReleaseYear("");
    setStockQuantity("");
    setImageCover(null);
    setRating("");
    document.getElementById("image").style.display = "none";
  };

  const handleAddProduct = async () => {
    if (!validateFields()) {
      showSnackbar("الرجاء تعبئة جميع الحقول المطلوبة", "error");
      return;
    }

    setLoading(true);
    const formData = new FormData();

    // Add fields one by one
    formData.append('title', title);
    formData.append('brand_id', brandId);
    formData.append('model_number', modelNumber);
    formData.append('description', description);
    formData.append('battery', battery);
    formData.append('processor', processor);
    formData.append('storage', storage);
    formData.append('display', display);
    formData.append('price', price);
    formData.append('discount', discount || 0);
    formData.append('operating_system', operatingSystem);
    formData.append('camera', camera);
    formData.append('network_support', networkSupport);
    formData.append('release_year', releaseYear);
    formData.append('stock_quantity', stockQuantity);
    formData.append('status', status);
    formData.append('rating', rating || 0);
    
    if (imageCover) {
      formData.append('image_cover', imageCover);
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Accept": "application/json",
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Server errors:", data.errors);
        
        if (data.errors) {
          Object.entries(data.errors).forEach(([field, messages]) => {
            showSnackbar(`${field}: ${messages.join(', ')}`, "error");
          });
        }
        
        throw new Error(data.message || "فشل في إضافة المنتج");
      }

      showSnackbar("تمت إضافة المنتج بنجاح", "success");
      resetForm();
      setTimeout(() => navigate("/allprod"), 2000);
    } catch (error) {
      console.error("Error:", error);
      showSnackbar(error.message || "حدث خطأ أثناء الإضافة", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box m="20px">
      <Header title="إضافة منتج جديد" subtitle="املأ جميع الحقول المطلوبة" />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <div className="imgBox col-md-5 m-2 d-flex flex-column align-items-center justify-content-center">
        <img
          id="image"
          src=""
          alt="Uploaded"
          width="100%"
          height="400px"
          style={{ display: "none" }}
        />
        <label htmlFor="UploadFile" className="mt-3 btn btn-primary">
          رفع صورة المنتج
        </label>
        <input
          type="file"
          id="UploadFile"
          style={{ display: "none" }}
          onChange={handleFileChange}
          required
        />
        {errors.imageCover && (
          <span style={{ color: "red", marginTop: "5px" }}>
            {errors.imageCover}
          </span>
        )}
      </div>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          المعلومات الأساسية
        </AccordionSummary>
        <AccordionDetails>
          <Box display="flex" flexWrap="wrap" gap="10px" my="20px">
            <TextField
              label="عنوان المنتج *"
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={!!errors.title}
              helperText={errors.title}
              fullWidth
            />
            <FormControl fullWidth error={!!errors.brandId}>
              <InputLabel id="brand-label">الماركة *</InputLabel>
              <Select
                labelId="brand-label"
                value={brandId}
                label="الماركة *"
                onChange={(e) => setBrandId(e.target.value)}
              >
                {brands.map((brand) => (
                  <MenuItem key={brand.id} value={brand.id}>
                    {brand.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.brandId && (
                <span style={{ color: "red", fontSize: "0.75rem" }}>
                  {errors.brandId}
                </span>
              )}
            </FormControl>
            <TextField
              label="رقم الموديل *"
              variant="outlined"
              value={modelNumber}
              onChange={(e) => setModelNumber(e.target.value)}
              error={!!errors.modelNumber}
              helperText={errors.modelNumber}
            />
            <TextField
              label="الوصف *"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              error={!!errors.description}
              helperText={errors.description}
            />
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          المواصفات الفنية
        </AccordionSummary>
        <AccordionDetails>
          <Box display="flex" flexWrap="wrap" gap="10px" my="20px">
            <TextField
              label="البطارية *"
              variant="outlined"
              value={battery}
              onChange={(e) => setBattery(e.target.value)}
              error={!!errors.battery}
              helperText={errors.battery}
            />
            <TextField
              label="المعالج *"
              variant="outlined"
              value={processor}
              onChange={(e) => setProcessor(e.target.value)}
              error={!!errors.processor}
              helperText={errors.processor}
            />
            <TextField
              label="التخزين *"
              variant="outlined"
              value={storage}
              onChange={(e) => setStorage(e.target.value)}
              error={!!errors.storage}
              helperText={errors.storage}
            />
            <TextField
              label="الشاشة *"
              variant="outlined"
              value={display}
              onChange={(e) => setDisplay(e.target.value)}
              error={!!errors.display}
              helperText={errors.display}
            />
            <TextField
              label="نظام التشغيل *"
              variant="outlined"
              value={operatingSystem}
              onChange={(e) => setOperatingSystem(e.target.value)}
              error={!!errors.operatingSystem}
              helperText={errors.operatingSystem}
            />
            <TextField
              label="الكاميرا *"
              variant="outlined"
              value={camera}
              onChange={(e) => setCamera(e.target.value)}
              error={!!errors.camera}
              helperText={errors.camera}
            />
            <TextField
              label="دعم الشبكة *"
              variant="outlined"
              value={networkSupport}
              onChange={(e) => setNetworkSupport(e.target.value)}
              error={!!errors.networkSupport}
              helperText={errors.networkSupport}
            />
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          معلومات البيع والمخزون
        </AccordionSummary>
        <AccordionDetails>
          <Box display="flex" flexWrap="wrap" gap="10px" my="20px">
            <TextField
              label="السعر *"
              variant="outlined"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              error={!!errors.price}
              helperText={errors.price}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">ج.م</InputAdornment>
                ),
              }}
            />
            <TextField
              label="الخصم"
              variant="outlined"
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">%</InputAdornment>
                ),
              }}
            />
            <TextField
              label="سنة الإصدار *"
              variant="outlined"
              type="number"
              value={releaseYear}
              onChange={(e) => setReleaseYear(e.target.value)}
              error={!!errors.releaseYear}
              helperText={errors.releaseYear}
            />
            <TextField
              label="الكمية المتاحة *"
              variant="outlined"
              type="number"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              error={!!errors.stockQuantity}
              helperText={errors.stockQuantity}
            />
            <TextField
              label="التقييم"
              variant="outlined"
              type="number"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              inputProps={{ min: 0, max: 5, step: 0.1 }}
            />
          </Box>
        </AccordionDetails>
      </Accordion>

      <Box display="flex" justifyContent="center" mt={3}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddProduct}
          disabled={loading}
          sx={{ py: 1.5, px: 4, fontSize: "1.1rem" }}
        >
          {loading ? "جاري الإضافة..." : "إضافة المنتج"}
        </Button>
      </Box>
    </Box>
  );
};

export default Create;