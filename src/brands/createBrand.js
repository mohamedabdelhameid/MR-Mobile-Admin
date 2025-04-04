import { useState } from "react";
import { Button, TextField, Box, Snackbar, Alert } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";

const BRANDS_API_URL = "http://127.0.0.1:8000/api/brands";

const AddBrand = () => {
  const [brand, setBrand] = useState({
    name: "",
    image: null,
    imagePreview: ""
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBrand({
          ...brand,
          image: file,
          imagePreview: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!brand.name) {
      showMessage("اسم الماركة مطلوب", "error");
      return;
    }

    const formData = new FormData();
    formData.append("name", brand.name);
    if (brand.image) {
      formData.append("image", brand.image);
    }

    try {
      const response = await fetch(BRANDS_API_URL, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          accept : 'application/json'
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "فشل في إضافة الماركة");
      }

      showMessage("تمت إضافة الماركة بنجاح", "success");
      setBrand({ name: "", image: null, imagePreview: "" });
    } catch (error) {
      showMessage(error.message, "error");
    }
  };

  const showMessage = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <Box sx={{ p: 3, maxWidth: 500 }}>
      <TextField
        label="اسم الماركة"
        value={brand.name}
        onChange={(e) => setBrand({...brand, name: e.target.value})}
        fullWidth
        sx={{ mb: 2 }}
      />

      <input
        accept="image/*"
        id="brand-image-upload"
        type="file"
        style={{ display: "none" }}
        onChange={handleImageChange}
      />
      <label htmlFor="brand-image-upload">
        <Button
          variant="outlined"
          component="span"
          startIcon={<CloudUpload />}
          fullWidth
          sx={{ mb: 2 }}
          style={{color:'green',borderColor:'green'}}
        >
          رفع صورة الماركة
        </Button>
      </label>

      {brand.imagePreview && (
        <Box sx={{ mb: 2, textAlign: "center" }}>
          <img
            src={brand.imagePreview}
            alt="معاينة صورة الماركة"
            style={{ maxWidth: "100%", maxHeight: 200 }}
          />
        </Box>
      )}

      <Button
        variant="contained"
        onClick={handleSubmit}
        fullWidth
        size="large"
      >
        إضافة الماركة
      </Button>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({...snackbar, open: false})}
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddBrand;