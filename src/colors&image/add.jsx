import { useState } from "react";
import { Button, TextField, Box, Snackbar, Alert } from "@mui/material";
import BASE_BACKEND_URL from "../API/config";

// const COLORS_API_URL = "http://127.0.0.1:8000/api/colors";
const COLORS_API_URL = `${BASE_BACKEND_URL}/colors`;

const ADDcolor = () => {
  const [color, setColor] = useState({
    name: "",
    hex_code: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSubmit = async () => {
    if (!color.name) {
      showMessage("اسم اللون مطلوب", "error");
      return;
    }
    if (!color.hex_code) {
      showMessage("كود اللون مطلوب", "error");
      return;
    }

    try {
      const response = await fetch(COLORS_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(color),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "فشل في إضافة اللون");
      }

      showMessage("تمت إضافة اللون بنجاح", "success");
      setColor({ name: "", hex_code: "" });
    } catch (error) {
      showMessage(error.message, "error");
    }
  };

  const showMessage = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box sx={{ p: 3, maxWidth: 500, width: "100%" }}>
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
          variant="contained"
          onClick={handleSubmit}
          fullWidth
          size="large"
          disabled={!color.name || !color.hex_code}
        >
          إضافة اللون
        </Button>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
      </Box>
    </div>
  );
};

export default ADDcolor;
