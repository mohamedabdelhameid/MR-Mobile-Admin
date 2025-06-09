import { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Box,
  Snackbar,
  Alert,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";

const COLORS_API_URL = "http://127.0.0.1:8000/api/mobile-colors";
const MOBILES_API_URL = "http://127.0.0.1:8000/api/mobiles";
const ALL_COLORS_API_URL = "http://127.0.0.1:8000/api/colors";

const ADDcolorrr = () => {
  const [formData, setFormData] = useState({
    mobile_id: "",
    mobile_title: "",
    color_id: "",
    color_name: "",
    stock_quantity: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [mobiles, setMobiles] = useState([]);
  const [colors, setColors] = useState([]);
  const [loadingMobiles, setLoadingMobiles] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // جلب قائمة الألوان عند تحميل الصفحة
  useEffect(() => {
    const fetchColors = async () => {
      try {
        const response = await fetch(ALL_COLORS_API_URL, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setColors(data.data || []);
      } catch {
        showMessage("فشل في جلب قائمة الألوان", "error");
      }
    };

    fetchColors();
  }, []);

  // جلب الأجهزة حسب البحث
  useEffect(() => {
    const fetchMobiles = async () => {
      if (searchTerm.length < 2) {
        setMobiles([]);
        return;
      }

      setLoadingMobiles(true);
      try {
        const response = await fetch(
          `${MOBILES_API_URL}?search=${searchTerm}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        setMobiles(data.data || []);
      } catch {
        showMessage("فشل في جلب الأجهزة", "error");
      } finally {
        setLoadingMobiles(false);
      }
    };

    const timer = setTimeout(fetchMobiles, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSubmit = async () => {
    if (!formData.mobile_id || !formData.color_id || !formData.stock_quantity) {
      showMessage("يجب ملء جميع الحقول", "error");
      return;
    }

    try {
      // 1. نجيب الموبايل المختار
      const selectedMobile = mobiles.find((m) => m.id === formData.mobile_id);

      if (!selectedMobile) {
        showMessage("لم يتم العثور على الجهاز", "error");
        return;
      }

      // 2. نبحث عن اللون داخل الموبايل
      const existingColorEntry = selectedMobile.colors.find(
        (c) => c.color.id === formData.color_id
      );

      const quantityToAdd = parseInt(formData.stock_quantity);

      if (existingColorEntry) {
        // تعديل الكمية
        const updatedPayload = {
          stock_quantity: existingColorEntry.stock_quantity + quantityToAdd,
        };

        const updateRes = await fetch(
          `${COLORS_API_URL}/${existingColorEntry.id}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(updatedPayload),
          }
        );

        const updateData = await updateRes.json();

        if (!updateRes.ok) {
          throw new Error(updateData.message || "فشل في تحديث الكمية");
        }

        showMessage("تم تعديل الكمية بنجاح", "success");
      } else {
        // إضافة لون جديد
        const payload = {
          mobile_id: formData.mobile_id,
          color_id: formData.color_id,
          stock_quantity: quantityToAdd,
        };

        const response = await fetch(COLORS_API_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "فشل في إضافة اللون");
        }

        showMessage("تمت الإضافة بنجاح", "success");
      }

      // تفريغ الفورم بعد النجاح
      setFormData({
        mobile_id: "",
        mobile_title: "",
        color_id: "",
        color_name: "",
        stock_quantity: "",
      });
    } catch (error) {
      showMessage(error.message, "error");
    }
  };

  const showMessage = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <Box sx={{ p: 3, maxWidth: 500, mx: "auto" }}>
      {/* اختيار الجهاز */}
      <Autocomplete
        options={mobiles}
        getOptionLabel={(option) => option.title}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        onChange={(e, newValue) =>
          setFormData({
            ...formData,
            mobile_id: newValue?.id || "",
            mobile_title: newValue?.title || "",
          })
        }
        onInputChange={(e, newInputValue) => setSearchTerm(newInputValue)}
        value={
          formData.mobile_title
            ? { id: formData.mobile_id, title: formData.mobile_title }
            : null
        }
        loading={loadingMobiles}
        renderInput={(params) => (
          <TextField
            {...params}
            label="ابحث عن جهاز"
            sx={{ mb: 2 }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loadingMobiles ? <CircularProgress size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />

      {/* اختيار اللون */}
      <Autocomplete
        options={colors}
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        onChange={(e, newValue) =>
          setFormData({
            ...formData,
            color_id: newValue?.id || "",
            color_name: newValue?.name || "",
          })
        }
        value={
          formData.color_name
            ? { id: formData.color_id, name: formData.color_name }
            : null
        }
        renderInput={(params) => (
          <TextField {...params} label="اختر اللون" sx={{ mb: 2 }} />
        )}
      />

      {/* الكمية */}
      <TextField
        label="الكمية"
        type="number"
        value={formData.stock_quantity}
        onChange={(e) =>
          setFormData({ ...formData, stock_quantity: e.target.value })
        }
        fullWidth
        sx={{ mb: 2 }}
      />

      <Button
        variant="contained"
        onClick={handleSubmit}
        fullWidth
        disabled={
          !formData.mobile_id || !formData.color_id || !formData.stock_quantity
        }
      >
        إضافة اللون للجهاز
      </Button>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default ADDcolorrr;



// import { useState, useEffect } from "react";
// import {
//   Button,
//   TextField,
//   Box,
//   Snackbar,
//   Alert,
//   Autocomplete,
//   CircularProgress,
// } from "@mui/material";
// import { CloudUpload } from "@mui/icons-material";

// const COLORS_API_URL = "http://127.0.0.1:8000/api/mobile-colors";
// const MOBILES_API_URL = "http://127.0.0.1:8000/api/mobiles";
// const ALL_COLORS_API_URL = "http://127.0.0.1:8000/api/colors";

// const ADDcolorrr = () => {
//   const [formData, setFormData] = useState({
//     mobile_id: "",
//     mobile_title: "",
//     color_id: "",
//     color_name: "",
//     stock_quantity: "",
//   });

//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });

//   const [mobiles, setMobiles] = useState([]);
//   const [colors, setColors] = useState([]);
//   const [loadingMobiles, setLoadingMobiles] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");

//   // جلب قائمة الألوان عند تحميل الصفحة
//   useEffect(() => {
//     const fetchColors = async () => {
//       try {
//         const response = await fetch(ALL_COLORS_API_URL, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         });
//         const data = await response.json();
//         setColors(data.data || []);
//       } catch {
//         showMessage("فشل في جلب قائمة الألوان", "error");
//       }
//     };

//     fetchColors();
//   }, []);

//   // جلب الأجهزة حسب البحث
//   useEffect(() => {
//     const fetchMobiles = async () => {
//       if (searchTerm.length < 2) {
//         setMobiles([]);
//         return;
//       }

//       setLoadingMobiles(true);
//       try {
//         const response = await fetch(
//           `${MOBILES_API_URL}?search=${searchTerm}`,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         );
//         const data = await response.json();
//         setMobiles(data.data || []);
//       } catch {
//         showMessage("فشل في جلب الأجهزة", "error");
//       } finally {
//         setLoadingMobiles(false);
//       }
//     };

//     const timer = setTimeout(fetchMobiles, 500);
//     return () => clearTimeout(timer);
//   }, [searchTerm]);

//   const handleSubmit = async () => {
//     if (!formData.mobile_id || !formData.color_id || !formData.stock_quantity) {
//       showMessage("يجب ملء جميع الحقول", "error");
//       return;
//     }

//     const payload = {
//       mobile_id: formData.mobile_id,
//       color_id: formData.color_id,
//       stock_quantity: formData.stock_quantity,
//     };

//     try {
//       const response = await fetch(COLORS_API_URL, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//           "Content-Type": "application/json",
//           Accept: "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.message || "فشل في إضافة اللون");
//       }

//       showMessage("تمت الإضافة بنجاح", "success");
//       setFormData({
//         mobile_id: "",
//         mobile_title: "",
//         color_id: "",
//         color_name: "",
//         stock_quantity: "",
//       });
//     } catch (error) {
//       showMessage(error.message, "error");
//     }
//   };

//   const showMessage = (message, severity) => {
//     setSnackbar({ open: true, message, severity });
//   };

//   return (
//     <Box sx={{ p: 3, maxWidth: 500, mx: "auto" }}>
//       {/* اختيار الجهاز */}
//       <Autocomplete
//         options={mobiles}
//         getOptionLabel={(option) => option.title}
//         isOptionEqualToValue={(option, value) => option.id === value.id}
//         onChange={(e, newValue) =>
//           setFormData({
//             ...formData,
//             mobile_id: newValue?.id || "",
//             mobile_title: newValue?.title || "",
//           })
//         }
//         onInputChange={(e, newInputValue) => setSearchTerm(newInputValue)}
//         value={
//           formData.mobile_title
//             ? { id: formData.mobile_id, title: formData.mobile_title }
//             : null
//         }
//         loading={loadingMobiles}
//         renderInput={(params) => (
//           <TextField
//             {...params}
//             label="ابحث عن جهاز"
//             sx={{ mb: 2 }}
//             InputProps={{
//               ...params.InputProps,
//               endAdornment: (
//                 <>
//                   {loadingMobiles ? <CircularProgress size={20} /> : null}
//                   {params.InputProps.endAdornment}
//                 </>
//               ),
//             }}
//           />
//         )}
//       />

//       {/* اختيار اللون */}
//       <Autocomplete
//         options={colors}
//         getOptionLabel={(option) => option.name}
//         isOptionEqualToValue={(option, value) => option.id === value.id}
//         onChange={(e, newValue) =>
//           setFormData({
//             ...formData,
//             color_id: newValue?.id || "",
//             color_name: newValue?.name || "",
//           })
//         }
//         value={
//           formData.color_name
//             ? { id: formData.color_id, name: formData.color_name }
//             : null
//         }
//         renderInput={(params) => (
//           <TextField {...params} label="اختر اللون" sx={{ mb: 2 }} />
//         )}
//       />

//       {/* الكمية */}
//       <TextField
//         label="الكمية"
//         type="number"
//         value={formData.stock_quantity}
//         onChange={(e) =>
//           setFormData({ ...formData, stock_quantity: e.target.value })
//         }
//         fullWidth
//         sx={{ mb: 2 }}
//       />

//       <Button
//         variant="contained"
//         onClick={handleSubmit}
//         fullWidth
//         disabled={
//           !formData.mobile_id || !formData.color_id || !formData.stock_quantity
//         }
//       >
//         إضافة اللون للجهاز
//       </Button>

//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//       >
//         <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default ADDcolorrr;
