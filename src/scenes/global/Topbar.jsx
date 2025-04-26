import { useState, useEffect } from "react";
import { Box, IconButton, useTheme, Badge } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();
  const [messageCount, setMessageCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // دالة لجلب عدد الرسائل من API
  const fetchMessageCount = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/contact-us", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("فشل في جلب البيانات");
      }

      const data = await response.json();
      setMessageCount(data.data.length); // افترضنا أن البيانات تأتي كمصفوفة في data.data
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  // جلب عدد الرسائل عند تحميل المكون
  useEffect(() => {
    fetchMessageCount();
    
    // تحديث العد كل 5 دقائق (اختياري)
    const interval = setInterval(fetchMessageCount, 300000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* ICONS */}
      <Box display="flex" gap={1}>
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>

        <IconButton 
          onClick={() => navigate("/messages")} // توجيه إلى صفحة الرسائل
          disabled={loading}
        >
          <Badge 
            badgeContent={loading ? "..." : messageCount} 
            color="error"
            max={99}
            sx={{
              '& .MuiBadge-badge': {
                right: -3,
                top: 5,
                border: `1px solid ${theme.palette.background.default}`,
                padding: '0 4px',
              }
            }}
          >
            <NotificationsOutlinedIcon />
          </Badge>
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar;