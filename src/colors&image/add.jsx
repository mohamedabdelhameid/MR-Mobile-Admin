import { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Box,
  Snackbar,
  Alert,
  Autocomplete,
  CircularProgress
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";

const COLORS_API_URL = "http://127.0.0.1:8000/api/mobile-colors";
const MOBILES_API_URL = "http://127.0.0.1:8000/api/mobiles";

const ADDcolor = () => {
  const [color, setColor] = useState({
    color: "",
    image: null,
    imagePreview: "",
    mobile_id: "",
    mobile_title: ""
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const [mobiles, setMobiles] = useState([]);
  const [loadingMobiles, setLoadingMobiles] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // جلب الأجهزة عند تغيير نص البحث
  useEffect(() => {
    const fetchMobiles = async () => {
      if (searchTerm.length < 2) {
        setMobiles([]);
        return;
      }

      setLoadingMobiles(true);
      try {
        const response = await fetch(`${MOBILES_API_URL}?search=${searchTerm}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        const data = await response.json();
        setMobiles(data.data || []);
      } catch (error) {
        showMessage("فشل في جلب الأجهزة", "error");
      } finally {
        setLoadingMobiles(false);
      }
    };

    const timer = setTimeout(fetchMobiles, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setColor({
          ...color,
          image: file,
          imagePreview: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!color.color) {
      showMessage("اللون مطلوب", "error");
      return;
    }
    if (!color.image) {
      showMessage("صورة اللون مطلوبة", "error");
      return;
    }
    if (!color.mobile_id) {
      showMessage("يجب اختيار جهاز", "error");
      return;
    }

    const formData = new FormData();
    formData.append("color", color.color);
    formData.append("mobile_id", color.mobile_id);
    formData.append("image", color.image);

    try {
      const response = await fetch(COLORS_API_URL, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "فشل في إضافة اللون");
      }

      showMessage("تمت إضافة اللون بنجاح", "success");
      setColor({
        color: "",
        image: null,
        imagePreview: "",
        mobile_id: "",
        mobile_title: ""
      });
      setMobiles([]);
      setSearchTerm("");
    } catch (error) {
      showMessage(error.message, "error");
    }
  };

  const showMessage = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <Box sx={{ p: 3, maxWidth: 500 }}>
      {/* حقل البحث عن الجهاز */}
      <Autocomplete
        options={mobiles}
        getOptionLabel={(option) => option.title}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        onChange={(e, newValue) => {
          setColor({
            ...color,
            mobile_id: newValue?.id || "",
            mobile_title: newValue?.title || ""
          });
        }}
        onInputChange={(e, newInputValue) => {
          setSearchTerm(newInputValue);
        }}
        value={color.mobile_title ? { id: color.mobile_id, title: color.mobile_title } : null}
        loading={loadingMobiles}
        noOptionsText={searchTerm.length < 2 ? "اكتب至少两个字符开始搜索" : "لا توجد أجهزة"}
        renderInput={(params) => (
          <TextField
            {...params}
            label="ابحث عن جهاز بالاسم"
            sx={{ mb: 2 }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loadingMobiles ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        renderOption={(props, option) => (
          <li {...props} key={option.id}>
            {option.title}
          </li>
        )}
      />

      <TextField
        label="اللون"
        value={color.color}
        onChange={(e) => setColor({...color, color: e.target.value})}
        fullWidth
        sx={{ mb: 2 }}
      />

      <input
        accept="image/*"
        id="color-image-upload"
        type="file"
        style={{ display: "none" }}
        onChange={handleImageChange}
      />
      <label htmlFor="color-image-upload">
        <Button
          variant="outlined"
          component="span"
          startIcon={<CloudUpload />}
          fullWidth
          sx={{ mb: 2 }}
          style={{color:'green',borderColor:'green'}}
        >
          رفع صورة اللون
        </Button>
      </label>

      {color.imagePreview && (
        <Box sx={{ mb: 2, textAlign: "center" }}>
          <img
            src={color.imagePreview}
            alt="معاينة صورة اللون"
            style={{ maxWidth: "100%", maxHeight: 200 }}
          />
        </Box>
      )}

      <Button
        variant="contained"
        onClick={handleSubmit}
        fullWidth
        size="large"
        disabled={!color.color || !color.image || !color.mobile_id}
      >
        إضافة اللون
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

export default ADDcolor;