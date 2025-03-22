import { Box, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const theme = useTheme();
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    // بيانات وهمية،  API
    setStats({
      totalSales: 1200,
      totalOrders: 300,
      totalCustomers: 150,
      totalRevenue: 45000,
    });
  }, []);

  return (
    <Box m="20px">
      {/* العنوان */}
      <Typography variant="h4" gutterBottom>
        إحصائيات المبيعات
      </Typography>

      {/* عرض الإحصائيات */}
      <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap="20px" mt="20px">
        <Box p="20px" bgcolor={theme.palette.primary.main} color="white" borderRadius="8px">
          <Typography variant="h6">إجمالي المبيعات</Typography>
          <Typography variant="h4">{stats.totalSales}</Typography>
        </Box>
        <Box p="20px" bgcolor={theme.palette.secondary.main} color="white" borderRadius="8px">
          <Typography variant="h6">إجمالي الطلبات</Typography>
          <Typography variant="h4">{stats.totalOrders}</Typography>
        </Box>
        <Box p="20px" bgcolor={theme.palette.success.main} color="white" borderRadius="8px">
          <Typography variant="h6">إجمالي العملاء</Typography>
          <Typography variant="h4">{stats.totalCustomers}</Typography>
        </Box>
        <Box p="20px" bgcolor={theme.palette.error.main} color="white" borderRadius="8px">
          <Typography variant="h6">إجمالي الإيرادات</Typography>
          <Typography variant="h4">${stats.totalRevenue}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
