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
import "./pd.css";
import CloseIcon from "@mui/icons-material/Close";
import { GridCheckCircleIcon } from "@mui/x-data-grid";
import BASE_BACKEND_LOCAHOST_URL from '../API/localhost'
import BASE_BACKEND_URL from "../API/config";

// const BASE_BACKEND_LOCAHOST_URL = "http://127.0.0.1:8000";
// const API_URL = "http://127.0.0.1:8000/api/mobiles";
// const BRANDS_API_URL = "http://127.0.0.1:8000/api/brands";
// const COLORS_API_URL = "http://172.0.0.1:8000/api/mobile-colors";
const API_URL = `${BASE_BACKEND_URL}/mobiles`;
const BRANDS_API_URL = `${BASE_BACKEND_URL}/brands`;
const COLORS_API_URL = `${BASE_BACKEND_URL}/mobile-colors`;

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [brandId, setBrandId] = useState("");
  const [brands, setBrands] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

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

    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_URL}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("فشل في جلب بيانات المنتج");
        }

        const { data } = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
        console.error("Error:", err);

        if (err.message.includes("انتهت جلستك")) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id, navigate]);

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

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="تفاصيل المنتج" subtitle="عرض كافة معلومات المنتج" />
      </Box>

      <Grid container spacing={3} mt={2}>
        {/* الصورة */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, textAlign: "center" }}>
            <Avatar
              src={
                selectedColor?.images?.[0]?.image
                  ? `${BASE_BACKEND_LOCAHOST_URL}${selectedColor.images[0].image}`
                  : product.image_cover.startsWith("http")
                  ? product.image_cover
                  : `${BASE_BACKEND_LOCAHOST_URL}${product.image_cover}`
              }
              alt={product.title}
              variant="rounded"
              sx={{
                width: "100%",
                height: "auto",
                maxHeight: 400,
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
                    <strong>الماركة: </strong>
                    {product.brand?.name || "غير معروف"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">
                    <strong>رقم الموديل:</strong> {product.model_number}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">
                    <strong>الكمية المتاحة:</strong> {product.total_quantity}
                  </Typography>
                </Grid>
                {product.rating && 
                <Grid item xs={6}>
                  <Typography variant="subtitle1">
                    <strong>التقييم:</strong> {product.rating}/5
                  </Typography>
                </Grid>}
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
                    <strong>المعالج:</strong> {product.processor}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography>
                    <strong>التخزين:</strong> {product.storage}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography>
                    <strong>البطارية:</strong> {product.battery} mAh
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography>
                    <strong>الشاشة:</strong> {product.display}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography>
                    <strong>نظام التشغيل:</strong> {product.operating_system}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography>
                    <strong>الكاميرا:</strong> {product.camera}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography>
                    <strong>دعم الشبكة:</strong> {product.network_support}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography>
                    <strong>سنة الإصدار:</strong> {product.release_year}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/*  الالوان والصورة */}
        <Grid item xs={12}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontWeight: "bold", mb: 2 }}
          >
            الألوان المتاحة:
          </Typography>

          {/* صورة اللون المختار - بوكس كبير أعلى الألوان */}
          <Box
            sx={{
              textAlign: "center",
              mb: 3,
              p: 2,
              backgroundColor: "#f9f9f9",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              transition: "all 0.3s ease",
              maxWidth: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={
                selectedColor?.images?.[0]?.image
                  ? `${BASE_BACKEND_LOCAHOST_URL}${selectedColor.images[0].image}`
                  : product.image_cover.startsWith("http")
                  ? product.image_cover
                  : `${BASE_BACKEND_LOCAHOST_URL}${product.image_cover}`
              }
              alt={`لون ${selectedColor?.color?.name || "المنتج"}`}
              style={{
                maxWidth: "100%",
                maxHeight: "350px",
                objectFit: "contain",
                borderRadius: "8px",
              }}
            />
          </Box>

          {/* قائمة الألوان */}
          {product.colors?.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  justifyContent: "center",
                }}
              >
                {product.colors.map((color) => (
                  <Box
                    key={color.id}
                    sx={{
                      position: "relative",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      p: 1,
                      border:
                        selectedColor?.id === color.id
                          ? "3px solid #1976d2"
                          : "1px solid #ddd",
                      borderRadius: "12px",
                      transition: "all 0.3s ease",
                      backgroundColor:
                        selectedColor?.id === color.id ? "#f0f7ff" : "#fff",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      },
                    }}
                    onClick={() => setSelectedColor(color)}
                  >
                    {/* زر الحذف */}
                    <CloseIcon
                      sx={{
                        position: "absolute",
                        top: -8,
                        left: -8,
                        color: "red",
                        backgroundColor: "white",
                        borderRadius: "50%",
                        fontSize: "20px",
                        zIndex: 1,
                        "&:hover": {
                          backgroundColor: "red",
                          color: "white",
                        },
                      }}
                      onClick={async (e) => {
                        e.stopPropagation();

                        if (window.confirm(`هل أنت متأكد من حذف هذا اللون؟`)) {
                          try {
                            const token = localStorage.getItem("token");
                            const response = await fetch(
                              // `http://localhost:8000/api/mobile-colors/${color.id}`,
                              `${BASE_BACKEND_URL}/mobile-colors/${color.id}`,
                              {
                                method: "DELETE",
                                headers: {
                                  Authorization: `Bearer ${token}`,
                                },
                              }
                            );

                            if (!response.ok) {
                              throw new Error("فشل في حذف اللون");
                            }

                            setProduct((prev) => ({
                              ...prev,
                              colors: prev.colors.filter(
                                (c) => c.id !== color.id
                              ),
                            }));

                            if (selectedColor?.id === color.id) {
                              setSelectedColor(null);
                            }

                            alert("تم حذف اللون بنجاح");
                          } catch (error) {
                            console.error("Error deleting color:", error);
                            alert(error.message || "حدث خطأ أثناء حذف اللون");
                          }
                        }
                      }}
                    />

                    {selectedColor?.id === color.id && (
                      <GridCheckCircleIcon
                        sx={{
                          position: "absolute",
                          top: -8,
                          right: -8,
                          color: "#4caf50",
                          backgroundColor: "white",
                          borderRadius: "50%",
                          fontSize: "24px",
                        }}
                      />
                    )}

                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        overflow: "hidden",
                        border: "2px solid #fff",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                        backgroundColor: color.color.hex_code.startsWith("#")
                          ? color.color.hex_code
                          : "#f5f5f5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {color.images?.[0]?.image ? (
                        <img
                          src={`${BASE_BACKEND_LOCAHOST_URL}${color.images[0].image}`}
                          alt={`لون ${color.color.name}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "50%",
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: "100%",
                            height: "100%",
                            borderRadius: "50%",
                            backgroundColor: color.color.hex_code.startsWith("#")
                              ? color.color.hex_code
                              : "#d9d9d9",
                          }}
                        />
                      )}
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight:
                          selectedColor?.id === color.id ? "bold" : "normal",
                        color:
                          selectedColor?.id === color.id
                            ? "primary.main"
                            : "text.primary",
                        mt: 1,
                      }}
                    >
                      {color.color.name || `لون ${color.id.slice(0, 4)}`}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Grid>
      </Grid>

      <Box display="flex" justifyContent="flex-end" mt={3}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(`/updateprod/${id}`)}
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

export default ProductDetails;