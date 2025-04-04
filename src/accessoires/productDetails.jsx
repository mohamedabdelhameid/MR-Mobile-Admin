import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Chip,
  Divider,
  Grid,
  Paper,
  Avatar,
} from "@mui/material";
import Header from "../components/Header";
import "./AD.css";

const API_URL = "http://127.0.0.1:8000/api/accessories";
const Images_URL = "http://127.0.0.1:8000";
const BRANDS_API_URL = "http://127.0.0.1:8000/api/brands";

const AccDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // جلب بيانات المنتج والماركات معاً
        const [productResponse, brandsResponse] = await Promise.all([
          fetch(`${API_URL}/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }),
          fetch(BRANDS_API_URL, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }),
        ]);

        // معالجة خطأ المنتج
        if (!productResponse.ok) {
          throw new Error("فشل في جلب بيانات المنتج");
        }
        const productData = await productResponse.json();

        // معالجة خطأ الماركات
        if (!brandsResponse.ok) {
          throw new Error("فشل في جلب بيانات الماركات");
        }
        const brandsData = await brandsResponse.json();

        // التحقق من تنسيق بيانات الماركات
        let processedBrands = [];

        if (Array.isArray(brandsData)) {
          processedBrands = brandsData;
        } else if (brandsData && Array.isArray(brandsData.data)) {
          processedBrands = brandsData.data;
        } else if (brandsData && brandsData.brands) {
          processedBrands = brandsData.brands;
        } else {
          console.warn("تنسيق غير متوقع لبيانات الماركات:", brandsData);
          processedBrands = [];
        }

        // التحقق من وجود الحقول المطلوبة
        const isValidBrands = processedBrands.every(
          (brand) => brand.id && brand.name
        );

        if (!isValidBrands) {
          console.warn(
            "بيانات الماركات لا تحتوي على الحقول المطلوبة (id, name)"
          );
          processedBrands = [];
        }

        setProduct(productData.data || productData);
        setBrands(processedBrands);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching data:", err);

        if (
          err.message.includes("انتهت جلستك") ||
          err.message.includes("غير مصرح")
        ) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography>المنتج غير موجود</Typography>
      </Box>
    );
  }

  // دالة البحث عن اسم الماركة
  const getBrandName = (brandId) => {
    if (!brandId) return "غير محدد";
    if (!Array.isArray(brands)) return "جاري التحميل...";

    const brand = brands.find((b) => b.id === brandId);
    return brand?.name || "غير معروف";
  };

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="تفاصيل المنتج" subtitle="عرض كافة معلومات المنتج" />
      </Box>

      <Grid container spacing={3} mt={2}>
        {/* الصورة */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, textAlign: "center" }}>
            <img
              src={`${Images_URL}${product.image}`}
              alt={product.title}
              variant="rounded"
              sx={{
                width: "100%",
                height: "auto",
                maxWidth: "300px",
                borderRadius: 2,
              }}
            />
          </Paper>
        </Grid>

        {/* المعلومات الأساسية */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                {product.title}
              </Typography>

              <Box display="flex" alignItems="center" mb={2}>
                {product.discount > 0 && (
                  <Typography variant="h3">
                    {Number(product.price) -
                      Number(product.price * product.discount) / 100}{" "}
                    ج.م
                  </Typography>
                )}
              </Box>

              <Box display="flex" alignItems="center" mb={2}>
                {product.discount === 0 ? (
                  <Typography variant="h3">{product.price} ج.م</Typography>
                ) : (
                  <Typography
                    sx={{ ml: 1, textDecoration: "line-through" }}
                    color="text.secondary"
                  >
                    {product.price} ج.م
                  </Typography>
                )}
              </Box>

              <Chip
                label={
                  product.status === "available"
                    ? "متاح"
                    : product.status === "unavailable"
                    ? "غير متاح"
                    : "نفذ من المخزون"
                }
                color={
                  product.status === "available"
                    ? "success"
                    : product.status === "unavailable"
                    ? "warning"
                    : "error"
                }
                sx={{ mb: 2 }}
              />

              <Typography variant="body1" paragraph>
                {product.description}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">
                    <strong>الماركة:</strong> {getBrandName(product.brand_id)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">
                    <strong>الكمية المتاحة:</strong> {product.stock_quantity}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">
                    <strong>الخصم:</strong> {product.discount}%
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* المواصفات الفنية */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                المواصفات الفنية
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography>
                    <strong>البطارية:</strong> {product.battery} mAh
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography>
                    <strong>الألوان :</strong> {product.color}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box display="flex" justifyContent="flex-end" mt={3}>
        <Button
          variant="contained"
          color="primary"
          onClick={() =>
            navigate(`/Updteacc/${product.id}`, { state: product })
          }
          sx={{ mr: 2 }}
        >
          تعديل المنتج
        </Button>
        <Button
          variant="contained"
          color="error"
          disabled={isDeleting}
          onClick={async () => {
            if (window.confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
              setIsDeleting(true);
              try {
                const token = localStorage.getItem("token");
                if (!token) {
                  navigate("/login");
                  return;
                }

                const response = await fetch(`${API_URL}/${id}`, {
                  method: "DELETE",
                  headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                  },
                });

                if (!response.ok) {
                  const errorData = await response.json();
                  throw new Error(errorData.message || "فشل في حذف المنتج");
                }

                alert("تم حذف المنتج بنجاح");
                navigate("/products");
              } catch (error) {
                console.error("Error deleting product:", error);
                alert(error.message || "حدث خطأ أثناء حذف المنتج");
              } finally {
                setIsDeleting(false);
              }
            }
          }}
        >
          {isDeleting ? <CircularProgress size={24} /> : "حذف المنتج"}
        </Button>
      </Box>
    </Box>
  );
};

export default AccDetails;
