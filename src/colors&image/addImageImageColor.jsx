import { useState, useEffect } from "react";
import {
  Button,
  Box,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import BASE_BACKEND_URL from "../API/config";

// const UPLOAD_IMAGE_API_URL = "http://127.0.0.1:8000/api/mobile-images";
// const MOBILES_API_URL = "http://127.0.0.1:8000/api/mobiles";
const UPLOAD_IMAGE_API_URL = `${BASE_BACKEND_URL}/mobile-images`;
const MOBILES_API_URL = `${BASE_BACKEND_URL}/mobiles`;

const AddColorImage = () => {
  const [mobiles, setMobiles] = useState([]);
  const [mobileId, setMobileId] = useState("");
  const [colorId, setColorId] = useState("");
  // const [imageFile, setImageFile] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [availableColors, setAvailableColors] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchMobiles = async () => {
      try {
        const res = await fetch(MOBILES_API_URL, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setMobiles(data.data);
        } else {
          throw new Error(data.message || "فشل في جلب الموبايلات");
        }
      } catch (error) {
        showMessage(error.message, "error");
      }
    };
    fetchMobiles();
  }, []);

  // تحديث الألوان حسب الموبايل المختار
  useEffect(() => {
    const selectedMobile = mobiles.find((m) => m.id === mobileId);
    if (selectedMobile) {
      const filteredColors = selectedMobile.colors.filter(
        (color) => color.is_available
      );
      setAvailableColors(filteredColors);
      setColorId(""); // إعادة تعيين اللون عند تغيير الموبايل
    } else {
      setAvailableColors([]);
    }
  }, [mobileId, mobiles]);

  // const handleSubmit = async () => {
  //   if (!colorId) return showMessage("يجب اختيار اللون", "error");
  //   if (imageFiles.length === 0)
  //     return showMessage("يجب اختيار صورة واحدة على الأقل", "error");

  //   try {
  //     const formData = new FormData();
  //     formData.append("mobile_color_variant_id", colorId);

  //     imageFiles.forEach((file) => {
  //       formData.append("images", file);
  //     });

  //     const response = await fetch(UPLOAD_IMAGE_API_URL, {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         "Content-Type": "application/json",
  //         Accept: "application/json",
  //       },
  //       body: formData,
  //     });

  //     if (!response.ok) {
  //       const data = await response.json();
  //       throw new Error(data.message || "فشل في رفع الصورة");
  //     }

  //     showMessage("تم رفع الصور بنجاح", "success");
  //     setColorId("");
  //     setMobileId("");
  //     setImageFiles([]);
  //   } catch (error) {
  //     showMessage(error.message, "error");
  //   }
  // };


  const handleSubmit = async () => {
  if (!colorId) return showMessage("يجب اختيار اللون", "error");
  if (imageFiles.length === 0) return showMessage("يجب اختيار صورة واحدة على الأقل", "error");

  try {
    const formData = new FormData();
    formData.append("mobile_color_variant_id", colorId);

    imageFiles.forEach((file) => {
      formData.append("images[]", file);
    });

    const response = await fetch(UPLOAD_IMAGE_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        // لا تضع Content-Type هنا أبداً!
      },
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "فشل في رفع الصورة");
    }

    showMessage("تم رفع الصور بنجاح", "success");
    setColorId("");
    setMobileId("");
    setImageFiles([]);
  } catch (error) {
    showMessage(error.message, "error");
  }
};


  const showMessage = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <Box sx={{ p: 3, maxWidth: 500, margin: "auto", mt: 5 }}>
      {/* اختيار الموبايل */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="mobile-select-label">اختر الموبايل</InputLabel>
        <Select
          labelId="mobile-select-label"
          value={mobileId}
          label="اختر الموبايل"
          onChange={(e) => setMobileId(e.target.value)}
        >
          {mobiles.map((mobile) => (
            <MenuItem key={mobile.id} value={mobile.id}>
              {mobile.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* اختيار اللون */}
      <FormControl fullWidth sx={{ mb: 2 }} disabled={!mobileId}>
        <InputLabel id="color-select-label">اختر اللون</InputLabel>
        <Select
          labelId="color-select-label"
          value={colorId}
          label="اختر اللون"
          onChange={(e) => setColorId(e.target.value)}
        >
          {availableColors.map((variant) => (
            <MenuItem key={variant.id} value={variant.id}>
              {variant.color.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* رفع صورة */}
      <Box sx={{ mb: 2 }}>
        {/* <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          style={{ width: "100%" }}
        /> */}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setImageFiles(Array.from(e.target.files))}
          style={{ width: "100%" }}
        />
      </Box>

      <Button
        variant="contained"
        onClick={handleSubmit}
        fullWidth
        size="large"
        disabled={!colorId || !imageFiles}
      >
        رفع صورة اللون
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

export default AddColorImage;
