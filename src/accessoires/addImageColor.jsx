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

// const UPLOAD_IMAGE_API_URL = "http://127.0.0.1:8000/api/accessory-images";
// const ACCESSORIES_API_URL = "http://127.0.0.1:8000/api/accessories";
const UPLOAD_IMAGE_API_URL = `${BASE_BACKEND_URL}/accessory-images`;
const ACCESSORIES_API_URL = `${BASE_BACKEND_URL}/accessories`;

const AddAccessoryImage = () => {
  const [accessories, setAccessories] = useState([]);
  const [accessoryId, setAccessoryId] = useState("");
  const [colorId, setColorId] = useState("");
  const [availableColors, setAvailableColors] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchAccessories = async () => {
      try {
        const res = await fetch(ACCESSORIES_API_URL, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setAccessories(data.data);
        } else {
          throw new Error(data.message || "فشل في جلب الإكسسوارات");
        }
      } catch (error) {
        showMessage(error.message, "error");
      }
    };
    fetchAccessories();
  }, []);

  // تحديث قائمة الألوان حسب الإكسسوار المختار
  useEffect(() => {
    const selectedAccessory = accessories.find((a) => a.id === accessoryId);
    if (selectedAccessory) {
      const filteredColors = selectedAccessory.colors.filter(
        (color) => color.is_available
      );
      setAvailableColors(filteredColors);
      setColorId(""); // نفضّي اللون عند تغيير الإكسسوار
    } else {
      setAvailableColors([]);
    }
  }, [accessoryId, accessories]);

  const handleSubmit = async () => {
    if (!accessoryId) return showMessage("يجب اختيار الإكسسوار", "error");
    if (!colorId) return showMessage("يجب اختيار اللون", "error");
    if (imageFiles.length === 0)
      return showMessage("يجب اختيار صورة واحدة على الأقل", "error");

    try {
      const formData = new FormData();
      formData.append("accessory_color_variant_id", colorId);

      imageFiles.forEach((file) => {
        formData.append("images[]", file);
      });

      const response = await fetch(UPLOAD_IMAGE_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "فشل في رفع الصور");
      }

      showMessage("تم رفع الصور بنجاح", "success");
      setAccessoryId("");
      setColorId("");
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
      {/* اختيار الإكسسوار */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="accessory-select-label">اختر الإكسسوار</InputLabel>
        <Select
          labelId="accessory-select-label"
          value={accessoryId}
          label="اختر الإكسسوار"
          onChange={(e) => setAccessoryId(e.target.value)}
        >
          {accessories.map((accessory) => (
            <MenuItem key={accessory.id} value={accessory.id}>
              {accessory.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* اختيار اللون */}
      <FormControl fullWidth sx={{ mb: 2 }} disabled={!accessoryId}>
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
        disabled={!colorId || !imageFiles.length}
      >
        رفع صور الإكسسوار
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

export default AddAccessoryImage;
