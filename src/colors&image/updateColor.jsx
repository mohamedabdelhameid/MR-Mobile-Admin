import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import BASE_BACKEND_URL from "../API/config";

const UpdateColor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [color, setColor] = useState({
    name: "",
    hex_code: "#000000",
  });

  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // const API_URL = "http://127.0.0.1:8000/api/colors";
  const API_URL = `${BASE_BACKEND_URL}/colors`;

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!color.name.trim()) {
      showMessage("اسم اللون مطلوب", "error");
      return;
    }
    if (!color.hex_code.trim()) {
      showMessage("اللون مطلوب", "error");
      return;
    }

    setUpdating(true);
    const formData = new FormData();
    formData.append("name", color.name.trim());
    formData.append("hex_code", color.hex_code.trim());
    formData.append("_method", "PUT");

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "فشل في تحديث اللون");
      }

      showMessage("تم تحديث اللون بنجاح", "success");
      setTimeout(() => navigate("/showColor"), 1500);
    } catch (error) {
      showMessage(error.message, "error");
    } finally {
      setUpdating(false);
    }
  };

  const showMessage = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 5, p: 2 }}>
      <Typography variant="h5" gutterBottom align="center">
        تعديل اللون
      </Typography>

      <form onSubmit={handleUpdate}>
        <TextField
          label="اسم اللون"
          value={color.name}
          onChange={(e) => setColor({ ...color, name: e.target.value })}
          fullWidth
          sx={{ mb: 2 }}
        />

        <Box sx={{ mb: 2 }}>
          <label style={{ marginBottom: 8, display: "block" }}>
            اختر اللون
          </label>
          <input
            type="color"
            value={color.hex_code}
            onChange={(e) => setColor({ ...color, hex_code: e.target.value })}
            style={{
              width: "100%",
              height: "56px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          />
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={updating}
        >
          {updating ? <CircularProgress size={24} /> : "حفظ التعديلات"}
        </Button>
      </form>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UpdateColor;
