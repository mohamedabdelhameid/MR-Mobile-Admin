import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import OrderTable from "../../orders/orderTable";
import OrdersPage from "../../orders/orderTable";
import StatisticsChart from "../../charts/graph";
import BASE_BACKEND_URL from "../../API/config";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("يجب تسجيل الدخول أولاً");

      // const response = await fetch("http://localhost:8000/api/statistics", {
      const response = await fetch(`${BASE_BACKEND_URL}/statistics`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        localStorage.removeItem("token");
        window.location.reload(); // مفيش حاجة اسمها window.reload()
        throw new Error("فشل في جلب البيانات من السيرفر");
      }

      const result = await response.json();

      // التحقق من بنية البيانات المتوقعة
      if (!result.data || typeof result.data !== "object") {
        throw new Error("هيكل البيانات غير متوقع");
      }

      setStats({
        mobiles: result.data.mobiles_count || 0,
        accessories: result.data.accessories_count || 0,
        brands: result.data.brands_count || 0,
        contacts: result.data.contact_data || 0,
        users: result.data.users_count || 0,
        orders: result.data.orders || 0,
      });
    } catch (err) {
      console.error("حدث خطأ:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>جاري تحميل البيانات...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={fetchStats}
        >
          إعادة المحاولة
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">إحصائيات النظام</Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchStats}
          style={{ color: "green", borderColor: "green" }}
        >
          تحديث
        </Button>
      </Box>

      {stats && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: 3,
          }}
        >
          {[
            { title: "الهواتف", value: stats.mobiles, color: "primary.main" },
            {
              title: "الإكسسوارات",
              value: stats.accessories,
              color: "secondary.main",
            },
            { title: "الماركات", value: stats.brands, color: "success.main" },
            {
              title: "رسائل التواصل",
              value: stats.contacts,
              color: "error.main",
            },
            { title: "المستخدمين", value: stats.users, color: "warning.main" },
            { title: "الطلبات", value: stats.orders, color: "info.main" },
          ].map((item, idx) => (
            <Box
              key={idx}
              sx={{
                p: 3,
                bgcolor: item.color,
                color: "white",
                borderRadius: 2,
                textAlign: "center",
                boxShadow: 2,
              }}
            >
              <Typography variant="h6">{item.title}</Typography>
              <Typography variant="h3" sx={{ mt: 1 }}>
                {item.value}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
      <StatisticsChart />
    </Box>
  );
};

export default Dashboard;
