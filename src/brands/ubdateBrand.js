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
import BASE_BACKEND_URL from "../API/config";

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

  // const API_URL = "http://127.0.0.1:8000/api/brands";
  const API_URL = `${BASE_BACKEND_URL}/brands`;

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