import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  MenuItem,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import Header from "../components/Header";
import { useParams, useNavigate } from "react-router-dom";
import BASE_BACKEND_LOCAHOST_URL from "../API/localhost";
import BASE_BACKEND_URL from "../API/config";

// const API_URL = "http://localhost:8000/api/accessories";
// const BRANDS_API_URL = "http://127.0.0.1:8000/api/brands";
const API_URL = `${BASE_BACKEND_URL}/accessories`;
const BRANDS_API_URL = `${BASE_BACKEND_URL}/brands`;

const UI_STATUS_OPTIONS = {
  active: "فعال",
  out_of_stock: "نفذ من المخزون",
  coming_soon: "قريباً",
};

const UpdateProd = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    title: "",
    brand_id: "",
    description: "",
    battery: "",
    speed: "",
    price: "",
    discount: "",
    // stock_quantity: "",
    rating: "",
    image: "",
    color: "",
    status: "active",
  });

  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [initialProduct, setInitialProduct] = useState(null);
  const [serverErrors, setServerErrors] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [brandId, setBrandId] = useState("");
  const [brands, setBrands] = useState([]);

  const normalizeStatusFromAPI = (apiStatus) => {
    const statusMap = {
      available: "active",
      out_of_stock: "out_of_stock",
      coming_soon: "coming_soon",
    };
    return statusMap[apiStatus] || "active";
  };

  const normalizeStatusForAPI = (uiStatus) => {
    const reverseMap = {
      active: "available",
      out_of_stock: "out_of_stock",
      coming_soon: "coming_soon",
    };
    return reverseMap[uiStatus] || "available";
  };

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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!response.ok) throw new Error("فشل في جلب البيانات");

        const data = await response.json();
        if (data.data) {
          const normalizedData = {
            ...data.data,
            status: normalizeStatusFromAPI(data.data.status),
          };

          setProduct(normalizedData);
          setInitialProduct(normalizedData);
        }
      } catch (error) {
        console.error("Error:", error);
        alert(error.message);
        if (error.message.includes("انتهت جلستك")) {
          navigate("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  useEffect(() => {
    if (initialProduct) {
      setHasChanges(JSON.stringify(product) !== JSON.stringify(initialProduct));
    }
  }, [product, initialProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "status" && !UI_STATUS_OPTIONS[value]) {
      return;
    }

    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!validImageTypes.includes(file.type)) {
      alert("الرجاء اختيار ملف صورة فقط (JPEG, PNG, GIF, WebP)");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("حجم الصورة يجب أن يكون أقل من 2MB");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setProduct((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
    setHasChanges(true);
  };

  const validateForm = () => {
    const newErrors = {};

    const requiredFields = [
      "title",
      "brand_id",
      "description",
      "price",
      // "stock_quantity",
      // "color",
      "status",
    ];

    requiredFields.forEach((field) => {
      if (!product[field]?.toString().trim()) {
        newErrors[field] = `حقل ${field} مطلوب`;
      }
    });

    if (product.title && product.title.length < 3) {
      newErrors.title = "يجب أن يكون العنوان أكثر من 3 أحرف";
    }

    if (
      product.brand_id &&
      !/^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/.test(
        product.brand_id
      )
    ) {
      newErrors.brand_id = "معرّف الماركة غير صالح";
    }

    if (product.battery && (isNaN(product.battery) || product.battery < 0)) {
      newErrors.battery = "يجب أن تكون سعة البطارية رقم موجب";
    }

    if (product.speed && (isNaN(product.speed) || product.speed < 0)) {
      newErrors.speed = "يجب أن تكون سرعة الشاحن رقم موجب";
    }

    if (
      product.price &&
      (isNaN(parseFloat(product.price)) || parseFloat(product.price) <= 0)
    ) {
      newErrors.price = "يجب أن يكون السعر رقم موجب";
    }

    if (
      product.discount &&
      (isNaN(product.discount) ||
        product.discount <= 0 ||
        product.discount > 100)
    ) {
      newErrors.discount = "يجب أن يكون الخصم بين 0 و 100";
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    setServerErrors([]);
    if (!validateForm()) {
      alert("الرجاء تعبئة جميع الحقول المطلوبة بشكل صحيح");
      return;
    }

    if (!hasChanges) {
      alert("لا يوجد تغييرات لحفظها");
      return;
    }

    if (!window.confirm("هل أنت متأكد من حفظ التغييرات؟")) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      let requestBody;
      let headers = {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      };

      // تحقق مما إذا كان الاسم قد تغير
      const titleHasChanged =
        initialProduct && initialProduct.title !== product.title;
      const titleToSend = titleHasChanged
        ? product.title
        : initialProduct?.title;

      // إذا كان هناك صورة جديدة، استخدم FormData
      if (imageFile) {
        requestBody = new FormData();
        requestBody.append("id", id);
        requestBody.append("title", titleToSend);
        requestBody.append("brand_id", product.brand_id);
        requestBody.append("description", product.description);
        requestBody.append("battery", product.battery);
        requestBody.append("speed", product.speed);
        requestBody.append("color", product.color);
        requestBody.append("price", product.price);
        requestBody.append("discount", product.discount);
        // requestBody.append("stock_quantity", product.stock_quantity);
        requestBody.append("rating", product.rating);
        requestBody.append("status", normalizeStatusForAPI(product.status));
        requestBody.append("image", imageFile);
        requestBody.append("_method", "PUT");
      } else {
        // إذا لم يكن هناك صورة جديدة، استخدم JSON
        headers["Content-Type"] = "application/json";
        requestBody = JSON.stringify({
          id: id,
          title: titleToSend,
          brand_id: product.brand_id,
          description: product.description,
          battery: product.battery,
          speed: product.speed,
          color: product.color,
          price: product.price,
          discount: product.discount,
          // stock_quantity: product.stock_quantity,
          rating: product.rating,
          status: normalizeStatusForAPI(product.status),
          _method: "PUT",
        });
      }

      const response = await fetch(`${API_URL}/${id}`, {
        method: "POST",
        headers: headers,
        body: requestBody,
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const serverErrorMessages = [];
          for (const [field, messages] of Object.entries(data.errors)) {
            serverErrorMessages.push(`${field}: ${messages.join(" ,  ")}`);
          }
          setServerErrors(serverErrorMessages);
        }
        throw new Error(data.message || "فشل في تحديث المنتج");
      }

      navigate("/showacc", { state: { message: "تم تحديث المنتج بنجاح" } });
    } catch (error) {
      console.error("Error:", error);
      alert(error.message || "حدث خطأ أثناء التحديث");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (
      hasChanges &&
      !window.confirm("لديك تغييرات غير محفوظة. هل تريد المغادرة دون حفظ؟")
    ) {
      return;
    }
    navigate("/showacc");
  };

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="تحديث المنتج" subtitle="قم بتحديث بيانات المنتج" />
        <Button variant="outlined" onClick={handleCancel}>
          رجوع
        </Button>
      </Box>

      {isLoading && !initialProduct ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Box display="flex" flexDirection="column" gap="20px" mt="20px">
          {serverErrors.length > 0 && (
            <Card sx={{ backgroundColor: "error.light", mb: 2 }}>
              <CardContent>
                <Typography color="error" variant="h6">
                  الأخطاء:
                </Typography>
                <ul>
                  {serverErrors.map((err, i) => (
                    <li style={{ direction: "ltr", listStyle: "none" }} key={i}>
                      {err}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                المعلومات الأساسية
              </Typography>
              <Box
                display="grid"
                gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))"
                gap={2}
              >
                <TextField
                  label="عنوان المنتج *"
                  name="title"
                  value={product.title}
                  onChange={handleChange}
                  error={!!errors.title}
                  helperText={errors.title}
                  fullWidth
                />
                {/* <FormControl fullWidth error={!!errors.brand_id}>
                  <InputLabel id="brand-label">الماركة *</InputLabel>
                  <Select
                    labelId="brand-label"
                    name="brand_id"
                    value={product.brand.id}
                    label="الماركة *"
                    onChange={handleChange}
                  >
                    {brands.map((brand) => (
                      <MenuItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.brand_id && (
                    <span style={{ color: "red", fontSize: "0.75rem" }}>
                      {errors.brand_id}
                    </span>
                  )}
                </FormControl> */}

                <FormControl fullWidth error={!!errors.brand_id}>
                  <InputLabel id="brand-label">الماركة *</InputLabel>
                  <Select
                    labelId="brand-label"
                    name="brand_id"
                    value={product.brand_id}
                    label="الماركة *"
                    onChange={(e) =>
                      setProduct((prev) => ({
                        ...prev,
                        brand_id: e.target.value,
                      }))
                    }
                  >
                    {brands.map((brand) => (
                      <MenuItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.brand_id && (
                    <span style={{ color: "red", fontSize: "0.75rem" }}>
                      {errors.brand_id}
                    </span>
                  )}
                </FormControl>

                <TextField
                  label="السعر *"
                  name="price"
                  value={product.price}
                  onChange={handleChange}
                  type="number"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">ج.م</InputAdornment>
                    ),
                  }}
                  error={!!errors.price}
                  helperText={errors.price}
                  fullWidth
                />
                <TextField
                  label="الخصم"
                  name="discount"
                  value={product.discount}
                  onChange={handleChange}
                  type="number"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">%</InputAdornment>
                    ),
                  }}
                  fullWidth
                />
                {/* <TextField
                  label="الكمية المتاحة *"
                  name="stock_quantity"
                  value={product.stock_quantity}
                  onChange={handleChange}
                  type="number"
                  error={!!errors.stock_quantity}
                  helperText={errors.stock_quantity}
                  fullWidth
                /> */}
                {/* <TextField
                  label="اللون *"
                  name="color"
                  value={product.color}
                  onChange={handleChange}
                  error={!!errors.color}
                  helperText={errors.color}
                  fullWidth
                /> */}
                <TextField
                  label="الحالة *"
                  name="status"
                  value={product.status}
                  onChange={handleChange}
                  select
                  error={!!errors.status}
                  helperText={errors.status}
                  fullWidth
                >
                  {Object.entries(UI_STATUS_OPTIONS).map(([value, label]) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                الوصف
              </Typography>
              <TextField
                label="الوصف"
                name="description"
                value={product.description}
                onChange={handleChange}
                multiline
                rows={4}
                fullWidth
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                المواصفات الفنية
              </Typography>
              <Box
                display="grid"
                gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))"
                gap={2}
              >
                <TextField
                  label="البطارية (mAh) *"
                  name="battery"
                  value={product.battery}
                  onChange={handleChange}
                  error={!!errors.battery}
                  helperText={errors.battery}
                  fullWidth
                />
                <TextField
                  label="سرعة الشاحن (mAh) *"
                  name="speed"
                  value={product.speed}
                  onChange={handleChange}
                  error={!!errors.speed}
                  helperText={errors.speed}
                  fullWidth
                />
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                صورة المنتج
              </Typography>
              <Box display="flex" alignItems="center" gap={3}>
                {product.image && (
                  <Box
                    component="img"
                    src={
                      product.image.startsWith("data:image")
                        ? product.image
                        : `${BASE_BACKEND_LOCAHOST_URL}${product.image}`
                    }
                    alt="Product Preview"
                    sx={{
                      maxWidth: 150,
                      maxHeight: 150,
                      border: "1px solid #ddd",
                      borderRadius: 1,
                    }}
                  />
                )}
                <Box>
                  <input
                    accept="image/*"
                    style={{ display: "none" }}
                    id="product-image-upload"
                    type="file"
                    onChange={handleImageUpload}
                  />
                  <label htmlFor="product-image-upload">
                    <Button variant="contained" component="span">
                      {product.image ? "تغيير الصورة" : "رفع صورة"}
                    </Button>
                  </label>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    الحد الأقصى لحجم الصورة: 2MB
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
            <Button
              variant="contained"
              color="error"
              onClick={handleCancel}
              sx={{ px: 4 }}
            >
              إلغاء
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdate}
              disabled={!hasChanges || isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : null}
              sx={{ px: 4 }}
            >
              {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default UpdateProd;
