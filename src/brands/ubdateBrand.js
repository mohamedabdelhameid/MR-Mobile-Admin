// import { useState, useEffect } from 'react';
// import { 
//   Box,
//   TextField,
//   Button,
//   Avatar,
//   CircularProgress,
//   Snackbar,
//   Alert,
//   Paper,
//   Typography
// } from '@mui/material';
// import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
// import { useParams, useNavigate } from 'react-router-dom';

// const BrandUpdate = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [brand, setBrand] = useState({
//     name: '',
//     image: null,
//     imagePreview: ''
//   });
//   const [loading, setLoading] = useState(true);
//   const [updating, setUpdating] = useState(false);
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: '',
//     severity: 'success'
//   });

//   const API_URL = "http://127.0.0.1:8000/api/brands";

//   useEffect(() => {
//     const fetchBrand = async () => {
//       try {
//         const response = await fetch(`${API_URL}/${id}`);
//         const data = await response.json();
//         setBrand({
//           name: data.name,
//           image: null,
//           imagePreview: data.image ? `http://127.0.0.1:8000/storage/${data.image}` : ''
//         });
//       } catch (error) {
//         showMessage('فشل في تحميل بيانات الماركة', 'error');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBrand();
//   }, [id]);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setBrand({
//           ...brand,
//           image: file,
//           imagePreview: reader.result
//         });
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!brand.name) {
//       showMessage('اسم الماركة مطلوب', 'error');
//       return;
//     }

//     setUpdating(true);
//     const formData = new FormData();
//     formData.append('name', brand.name);
//     if (brand.image) {
//       formData.append('image', brand.image);
//     }
//     formData.append('_method', 'PUT'); // Important for Laravel

//     try {
//       const response = await fetch(`${API_URL}/${id}`, {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`
//         },
//         body: formData
//       });

//       if (response.ok) {
//         showMessage('تم تحديث الماركة بنجاح', 'success');
//         setTimeout(() => navigate('/brands'), 1500);
//       } else {
//         throw new Error('فشل في التحديث');
//       }
//     } catch (error) {
//       showMessage(error.message, 'error');
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const showMessage = (message, severity) => {
//     setSnackbar({ open: true, message, severity });
//   };

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" mt={4}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
//       <Paper elevation={3} sx={{ p: 3 }}>
//         <Typography variant="h5" gutterBottom>تحديث الماركة</Typography>

//         <TextField
//           label="اسم الماركة"
//           value={brand.name}
//           onChange={(e) => setBrand({...brand, name: e.target.value})}
//           fullWidth
//           sx={{ mb: 3 }}
//         />

//         <input
//           accept="image/*"
//           id="brand-image-upload"
//           type="file"
//           style={{ display: 'none' }}
//           onChange={handleImageChange}
//         />
//         <label htmlFor="brand-image-upload">
//           <Button
//             variant="outlined"
//             component="span"
//             startIcon={<CloudUploadIcon />}
//             fullWidth
//             sx={{ mb: 2 }}
//           >
//             تغيير صورة الماركة
//           </Button>
//         </label>

//         {brand.imagePreview && (
//           <Box sx={{ textAlign: 'center', mb: 3 }}>
//             <Avatar
//               src={brand.imagePreview}
//               alt="صورة الماركة"
//               sx={{ width: 120, height: 120, mx: 'auto' }}
//             />
//           </Box>
//         )}

//         <Button
//           variant="contained"
//           onClick={handleSubmit}
//           disabled={updating}
//           fullWidth
//           size="large"
//         >
//           {updating ? <CircularProgress size={24} /> : 'حفظ التغييرات'}
//         </Button>
//       </Paper>

//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={() => setSnackbar({...snackbar, open: false})}
//       >
//         <Alert severity={snackbar.severity}>
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default BrandUpdate;
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  TextField, 
  Button, 
  Avatar, 
  Box, 
  Typography, 
  CircularProgress,
  Snackbar,
  Alert
} from "@mui/material";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";

const UpdateBrand = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [brand, setBrand] = useState({
    name: '',
    image: null,
    imagePreview: ''
  });
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const API_URL = "http://127.0.0.1:8000/api/brands";

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
          throw new Error('فشل في تحميل بيانات الماركة');
        }
        const data = await response.json();
        setBrand({
          name: data.name || '',
          image: null,
          imagePreview: data.image ? `${API_URL.replace('/api/brands', '')}/storage/${data.image}` : ''
        });
      } catch (error) {
        showMessage(error.message, 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchBrand();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // التحقق من نوع الملف
      if (!file.type.startsWith('image/')) {
        showMessage('الرجاء اختيار ملف صورة فقط', 'error');
        return;
      }
      
      // التحقق من حجم الملف (2MB كحد أقصى)
      if (file.size > 2 * 1024 * 1024) {
        showMessage('حجم الصورة يجب أن يكون أقل من 2MB', 'error');
        return;
      }

      setNewImage(file);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!brand.name.trim()) {
      showMessage('اسم الماركة مطلوب', 'error');
      return;
    }

    setUpdating(true);
    const formData = new FormData();
    formData.append("name", brand.name.trim());
    formData.append("_method", "PUT");
    
    if (newImage) {
      formData.append("image", newImage);
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Accept":'application/json'
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'فشل في تحديث الماركة');
      }

      showMessage('تم تحديث الماركة بنجاح', 'success');
      setTimeout(() => navigate("/showBrand"), 1500);
    } catch (error) {
      showMessage(error.message, 'error');
    } finally {
      setUpdating(false);
    }
  };

  const showMessage = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({...prev, open: false}));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 5, p: 2 }}>
      <Typography variant="h5" gutterBottom align="center">
        تعديل الماركة
      </Typography>

      {/* صورة الماركة */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Avatar
          src={newImage ? URL.createObjectURL(newImage) : brand.imagePreview}
          sx={{ 
            width: 120, 
            height: 120, 
            mx: "auto",
            border: '1px solid #ddd'
          }}
          variant="rounded"
        />
      </Box>

      <form onSubmit={handleUpdate}>
        {/* حقل الاسم */}
        <TextField
          label="اسم الماركة"
          value={brand.name}
          onChange={(e) => setBrand({...brand, name: e.target.value})}
          fullWidth
          sx={{ mb: 3 }}
          error={!brand.name.trim()}
          helperText={!brand.name.trim() ? 'هذا الحقل مطلوب' : ''}
        />

        {/* رفع صورة جديدة */}
        <Button
          variant="outlined"
          component="label"
          fullWidth
          startIcon={<CloudUploadIcon />}
          sx={{ mb: 3 }}
          style={{color:'green',borderColor:'green'}}
        >
          تغيير الصورة
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />
        </Button>

        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          fullWidth
          disabled={updating}
        >
          {updating ? <CircularProgress size={24} /> : 'حفظ التعديلات'}
        </Button>
      </form>

      {/* رسائل التنبيه */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UpdateBrand;