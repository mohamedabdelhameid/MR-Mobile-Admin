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
} from "@mui/material";
import Header from "../components/Header";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000/api/mobiles";
const Images = "http://127.0.0.1:8000";

const UI_STATUS_OPTIONS = {
  active: "فعال",
  // inactive: "غير فعال",
  out_of_stock: "نفذ من المخزون",
  coming_soon: "قريباً", // تمت إضافتها لدعم هذه الحالة
};

const UpdateProd = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    title: "",
    brand_id: "",
    model_number: "",
    description: "",
    battery: "",
    processor: "",
    storage: "",
    display: "",
    price: "",
    discount: "",
    operating_system: "",
    camera: "",
    network_support: "",
    release_year: "",
    stock_quantity: "",
    rating: "",
    image_cover: "",
    status: "active",
  });

  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [initialProduct, setInitialProduct] = useState(null);
  const [serverErrors, setServerErrors] = useState([]);

  // دالة لتحويل القيمة من API إلى قيمة متوافقة مع الواجهة
  const normalizeStatusFromAPI = (apiStatus) => {
    return apiStatus === "available" ? "active" : apiStatus;
  };

  // دالة لتحويل القيمة قبل إرسالها للAPI
  const normalizeStatusForAPI = (uiStatus) => {
    return uiStatus === "active" ? "available" : uiStatus;
  };

  // جلب بيانات المنتج
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

  // تتبع التغييرات
  useEffect(() => {
    if (initialProduct) {
      setHasChanges(JSON.stringify(product) !== JSON.stringify(initialProduct));
    }
  }, [product, initialProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match("image.*")) {
      alert("الرجاء اختيار ملف صورة فقط (JPEG, PNG, etc.)");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("حجم الصورة يجب أن يكون أقل من 2MB");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setProduct((prev) => ({ ...prev, image_cover: reader.result }));
    };
    reader.readAsDataURL(file);
    setHasChanges(true);
  };

  const validateForm = () => {
    const requiredFields = [
      "title",
      "brand_id",
      "model_number",
      "battery",
      "processor",
      "storage",
      "display",
      "price",
      "operating_system",
      "network_support",
      "release_year",
      "stock_quantity",
      "status",
    ];

    const newErrors = {};

    requiredFields.forEach((field) => {
      if (!product[field]?.toString().trim()) {
        newErrors[field] = `حقل ${field} مطلوب`;
      }
    });

    if (!product.price || isNaN(product.price) || product.price < 0)
      newErrors.price = "السعر يجب أن يكون رقم موجب";
    if (
      !product.stock_quantity ||
      isNaN(product.stock_quantity) ||
      product.stock_quantity < 0
    )
      newErrors.stock_quantity = "الكمية يجب أن تكون رقم موجب";
    if (
      !product.release_year ||
      isNaN(product.release_year) ||
      product.release_year < 2000 ||
      product.release_year > new Date().getFullYear() + 1
    )
      newErrors.release_year = "سنة الإصدار غير صالحة";

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

      // 1. إنشاء FormData
      const formData = new FormData();

      // 2. إضافة جميع الحقول
      const productToSend = {
        ...product,
        status: normalizeStatusForAPI(product.status),
        _method: "PUT", // هذا مهم للخوادم التي لا تدعم PUT مباشرة
      };

      Object.entries(productToSend).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      // 3. إضافة الصورة إذا كانت موجودة
      if (imageFile) {
        formData.append("image_cover", imageFile);
      }

      // const formData = new FormData();

      // 4. إرسال الطلب
      const response = await fetch(`${API_URL}/${id}`, {
        method: "POST", // نستخدم POST مع _method PUT
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: formData,
      });

      // 5. معالجة الاستجابة
      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setServerErrors(Object.values(data.errors).flat());
        }
        throw new Error(data.message || "فشل في تحديث المنتج");
      }

      // 6. إذا نجح التحديث
      navigate("/allprod", { state: { message: "تم تحديث المنتج بنجاح" } });
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
    navigate("/allprod");
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
                    <li style={{direction:'ltr',listStyle:"none"}} key={i}>{err}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Basic Information */}
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
                <TextField
                  label="معرّف الماركة *"
                  name="brand_id"
                  value={product.brand_id}
                  onChange={handleChange}
                  error={!!errors.brand_id}
                  helperText={errors.brand_id}
                  fullWidth
                />
                <TextField
                  label="رقم الموديل *"
                  name="model_number"
                  value={product.model_number}
                  onChange={handleChange}
                  error={!!errors.model_number}
                  helperText={errors.model_number}
                  fullWidth
                />
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
                <TextField
                  label="الكمية المتاحة *"
                  name="stock_quantity"
                  value={product.stock_quantity}
                  onChange={handleChange}
                  type="number"
                  error={!!errors.stock_quantity}
                  helperText={errors.stock_quantity}
                  fullWidth
                />
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

          {/* Description */}
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

          {/* Specifications */}
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
                  label="المعالج *"
                  name="processor"
                  value={product.processor}
                  onChange={handleChange}
                  error={!!errors.processor}
                  helperText={errors.processor}
                  fullWidth
                />
                <TextField
                  label="التخزين *"
                  name="storage"
                  value={product.storage}
                  onChange={handleChange}
                  error={!!errors.storage}
                  helperText={errors.storage}
                  fullWidth
                />
                <TextField
                  label="الشاشة *"
                  name="display"
                  value={product.display}
                  onChange={handleChange}
                  error={!!errors.display}
                  helperText={errors.display}
                  fullWidth
                />
                <TextField
                  label="نظام التشغيل *"
                  name="operating_system"
                  value={product.operating_system}
                  onChange={handleChange}
                  error={!!errors.operating_system}
                  helperText={errors.operating_system}
                  fullWidth
                />
                <TextField
                  label="الكاميرا"
                  name="camera"
                  value={product.camera}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  label="دعم الشبكة *"
                  name="network_support"
                  value={product.network_support}
                  onChange={handleChange}
                  error={!!errors.network_support}
                  helperText={errors.network_support}
                  fullWidth
                />
                <TextField
                  label="سنة الإصدار *"
                  name="release_year"
                  value={product.release_year}
                  onChange={handleChange}
                  type="number"
                  error={!!errors.release_year}
                  helperText={errors.release_year}
                  fullWidth
                />
                <TextField
                  label="التقييم"
                  name="rating"
                  value={product.rating}
                  onChange={handleChange}
                  type="number"
                  inputProps={{ min: 0, max: 5, step: 0.1 }}
                  fullWidth
                />
              </Box>
            </CardContent>
          </Card>

          {/* Product Image */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                صورة المنتج
              </Typography>
              <Box display="flex" alignItems="center" gap={3}>
                {product.image_cover && (
                  <Box
                    component="img"
                    src={
                      product.image_cover.startsWith("data:image")
                        ? product.image_cover
                        : `${Images}${product.image_cover}`
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
                      {product.image_cover ? "تغيير الصورة" : "رفع صورة"}
                    </Button>
                  </label>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    الحد الأقصى لحجم الصورة: 2MB
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Action Buttons */}
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
