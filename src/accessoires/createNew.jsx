import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Snackbar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  InputAdornment,
  MenuItem,
  Alert,
  FormControl,
  Autocomplete,
} from "@mui/material";
import Header from "../components/Header";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const API_URL = "http://127.0.0.1:8000/api/accessories";
const BRANDS_API_URL = "http://127.0.0.1:8000/api/brands";

const statusToAPI = {
  active: "available",
  inactive: "unavailable",
  coming_soon: "coming_soon",
};

const CreateAccessory = () => {
  const [formData, setFormData] = useState({
    title: "",
    brand: null,
    description: "",
    battery: null,
    speed: null,
    color: "#000000",
    price: "",
    discount: "",
    stockQuantity: "",
    rating: "0.0",
    status: "active",
    image: null,
  });

  const [brands, setBrands] = useState([]);
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBrands = async () => {
      setLoadingBrands(true);
      try {
        const response = await fetch(BRANDS_API_URL, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setBrands(data.data);
        } else {
          throw new Error(data.message || "فشل في جلب الماركات");
        }
      } catch (error) {
        showSnackbar(error.message, "error");
      } finally {
        setLoadingBrands(false);
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

  const validateFields = () => {
    let newErrors = {};

    // الحقول الإجبارية
    if (!formData.title.trim()) newErrors.title = "عنوان المنتج مطلوب";
    if (!formData.brand) newErrors.brand = "الماركة مطلوبة";
    if (!formData.description.trim()) newErrors.description = "الوصف مطلوب";
    if (!formData.price) newErrors.price = "السعر مطلوب";
    if (!formData.stockQuantity) newErrors.stockQuantity = "الكمية المتاحة مطلوبة";
    if (!formData.image) newErrors.image = "صورة المنتج مطلوبة";

    // الحقول الاختيارية (التحقق فقط إذا كانت تحتوي على قيمة)
    if (formData.battery !== null && isNaN(formData.battery)) {
      newErrors.battery = "يجب أن تكون قيمة رقمية";
    }
    if (formData.speed !== null && isNaN(formData.speed)) {
      newErrors.speed = "يجب أن تكون قيمة رقمية";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        document.getElementById("image").src = reader.result;
        document.getElementById("image").style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e, value, name) => {
    if (name === "brand") {
      setFormData({ ...formData, brand: value });
    } else {
      const { name, value } = e.target;
      setFormData({ 
        ...formData, 
        [name]: value === "" ? null : value 
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      brand: null,
      description: "",
      battery: null,
      speed: null,
      color: "#000000",
      price: "",
      discount: "",
      stockQuantity: "",
      rating: "0.0",
      status: "active",
      image: null,
    });
    document.getElementById("image").style.display = "none";
  };

  const handleAddAccessory = async () => {
    if (!validateFields()) {
      showSnackbar("الرجاء تعبئة جميع الحقول المطلوبة", "error");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("brand_id", formData.brand.id);
    data.append("description", formData.description);
    data.append("battery", formData.battery || "");
    data.append("speed", formData.speed || "");
    data.append("color", formData.color);
    data.append("price", formData.price);
    data.append("discount", formData.discount || 0);
    data.append("stock_quantity", formData.stockQuantity);
    data.append("rating", formData.rating || "0.0");
    data.append("status", statusToAPI[formData.status]);
    data.append("image", formData.image);

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || "فشل في إضافة الإكسسوار");
      }

      resetForm();
      showSnackbar("تمت إضافة الإكسسوار بنجاح!", "success");
      setTimeout(() => {
        window.location.href = "/showacc";
      }, 1500);
    } catch (err) {
      console.error("Error:", err);
      showSnackbar(err.message || "فشل في إضافة الإكسسوار!", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box m="20px">
      <Header title="إضافة إكسسوار جديد" subtitle="املأ جميع الحقول المطلوبة" />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
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
        {errors.image && (
          <span style={{ color: "red", marginTop: "5px" }}>{errors.image}</span>
        )}
      </div>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          المعلومات الأساسية
        </AccordionSummary>
        <AccordionDetails>
          <Box display="flex" flexWrap="wrap" gap="10px" my="20px">
            <TextField
              name="title"
              label="عنوان المنتج *"
              variant="outlined"
              value={formData.title}
              onChange={handleChange}
              error={!!errors.title}
              helperText={errors.title}
              fullWidth
            />

            <FormControl fullWidth error={!!errors.brand}>
              <Autocomplete
                options={brands}
                getOptionLabel={(brand) => brand.name}
                value={formData.brand}
                onChange={(event, newValue) => {
                  setFormData({ ...formData, brand: newValue });
                }}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                loading={loadingBrands}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="الماركة *"
                    error={!!errors.brand}
                    helperText={errors.brand}
                  />
                )}
              />
            </FormControl>

            <TextField
              name="description"
              label="الوصف *"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange}
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
              name="battery"
              label="سعة البطارية (mAh)"
              variant="outlined"
              type="number"
              value={formData.battery || ""}
              onChange={handleChange}
              error={!!errors.battery}
              helperText={errors.battery}
              InputProps={{
                inputProps: { min: 0 }
              }}
            />
            <TextField
              name="speed"
              label="سرعة الشاحن (speed)"
              variant="outlined"
              type="number"
              value={formData.speed || ""}
              onChange={handleChange}
              error={!!errors.speed}
              helperText={errors.speed}
              InputProps={{
                inputProps: { min: 0 }
              }}
            />
            <TextField
              name="color"
              label="اللون"
              variant="outlined"
              type="color"
              value={formData.color}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
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
              name="price"
              label="السعر *"
              variant="outlined"
              type="number"
              value={formData.price}
              onChange={handleChange}
              error={!!errors.price}
              helperText={errors.price}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">ج.م</InputAdornment>
                ),
                inputProps: { min: 0 }
              }}
            />
            <TextField
              name="discount"
              label="الخصم (%)"
              variant="outlined"
              type="number"
              value={formData.discount}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">%</InputAdornment>
                ),
                inputProps: { min: 0, max: 100 }
              }}
            />
            <TextField
              name="stockQuantity"
              label="الكمية المتاحة *"
              variant="outlined"
              type="number"
              value={formData.stockQuantity}
              onChange={handleChange}
              error={!!errors.stockQuantity}
              helperText={errors.stockQuantity}
              InputProps={{
                inputProps: { min: 0 }
              }}
            />
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          معلومات إضافية
        </AccordionSummary>
        <AccordionDetails>
          <Box display="flex" flexWrap="wrap" gap="10px" my="20px">
            <TextField
              name="status"
              select
              label="حالة المنتج *"
              variant="outlined"
              value={formData.status}
              onChange={handleChange}
              fullWidth
            >
              {["active", "inactive", "coming_soon"].map((status) => (
                <MenuItem key={status} value={status}>
                  {status === "active"
                    ? "متاح"
                    : status === "inactive"
                    ? "غير متاح"
                    : "قريبًا"}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              name="rating"
              label="التقييم"
              variant="outlined"
              type="number"
              value={formData.rating}
              onChange={handleChange}
              InputProps={{
                inputProps: { min: 0, max: 5, step: 0.1 },
                startAdornment: (
                  <InputAdornment position="start">/ 5</InputAdornment>
                ),
              }}
            />
          </Box>
        </AccordionDetails>
      </Accordion>

      <Box display="flex" justifyContent="center" mt="20px">
        <Button
          onClick={handleAddAccessory}
          variant="contained"
          color="primary"
          endIcon={<AddIcon />}
          disabled={loading}
        >
          {loading ? "جاري إضافة..." : "إضافة إكسسوار"}
        </Button>
      </Box>
    </Box>
  );
};

export default CreateAccessory;