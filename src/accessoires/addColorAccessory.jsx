import { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Box,
  Snackbar,
  Alert,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import BASE_BACKEND_URL from "../API/config";

// const COLORS_API_URL = "http://127.0.0.1:8000/api/accessory-colors";
const COLORS_API_URL = `${BASE_BACKEND_URL}/accessory-colors`;
// const ACCESSORIES_API_URL = "http://127.0.0.1:8000/api/accessories";
const ACCESSORIES_API_URL = `${BASE_BACKEND_URL}/accessories`;
// const COLOR_LIST_API_URL = "http://127.0.0.1:8000/api/colors";
const COLOR_LIST_API_URL = `${BASE_BACKEND_URL}/colors`;

const AddAccessoryColor = () => {
  const [color, setColor] = useState({
    accessory_id: "",
    accessory_title: "",
  });

  const [formData, setFormData] = useState({
    color_id: "",
    color_name: "",
    quantity: "",
  });

  const [colors, setColors] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [accessories, setAccessories] = useState([]);
  const [loadingAccessories, setLoadingAccessories] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAccessories = async () => {
      if (searchTerm.length < 2) {
        setAccessories([]);
        return;
      }

      setLoadingAccessories(true);
      try {
        const response = await fetch(
          `${ACCESSORIES_API_URL}?search=${searchTerm}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        setAccessories(data.data || []);
      } catch (error) {
        showMessage("فشل في جلب الإكسسوارات", "error");
      } finally {
        setLoadingAccessories(false);
      }
    };

    const timer = setTimeout(fetchAccessories, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const fetchColors = async () => {
      try {
        const response = await fetch(COLOR_LIST_API_URL, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setColors(data.data || []);
      } catch (error) {
        showMessage("فشل في جلب الألوان", "error");
      }
    };

    fetchColors();
  }, []);

  // const handleSubmit = async () => {
  //   if (!formData.color_id) {
  //     showMessage("يجب اختيار اللون", "error");
  //     return;
  //   }

  //   if (!color.accessory_id) {
  //     showMessage("يجب اختيار إكسسوار", "error");
  //     return;
  //   }

  //   if (!formData.quantity || isNaN(formData.quantity) || formData.quantity < 0) {
  //     showMessage("أدخل كمية صالحة", "error");
  //     return;
  //   }

  //   const formPayload = new FormData();
  //   formPayload.append("color_id", formData.color_id);
  //   formPayload.append("accessory_id", color.accessory_id);
  //   formPayload.append("stock_quantity", formData.quantity);

  //   try {
  //     const response = await fetch(COLORS_API_URL, {
  //       method: "POST",
  //       body: formPayload,
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     });

  //     let data;
  //     try {
  //       data = await response.json();
  //     } catch (err) {
  //       const text = await response.text();
  //       console.error("استجابة غير صالحة من السيرفر:", text);
  //       showMessage("الاستجابة من السيرفر غير صالحة", "error");
  //       return;
  //     }

  //     if (!response.ok) {
  //       throw new Error(data.message || "فشل في إضافة لون الإكسسوار");
  //     }

  //     showMessage("تمت إضافة اللون بنجاح", "success");

  //     setColor({ accessory_id: "", accessory_title: "" });
  //     setFormData({ color_id: "", color_name: "", quantity: "" });
  //     setAccessories([]);
  //     setSearchTerm("");
  //   } catch (error) {
  //     showMessage(error.message, "error");
  //   }
  // };

  const handleSubmit = async () => {
    if (!formData.color_id) {
      showMessage("يجب اختيار اللون", "error");
      return;
    }

    if (!color.accessory_id) {
      showMessage("يجب اختيار إكسسوار", "error");
      return;
    }

    if (
      !formData.quantity ||
      isNaN(formData.quantity) ||
      formData.quantity < 0
    ) {
      showMessage("أدخل كمية صالحة", "error");
      return;
    }

    try {
      // 1. جلب تفاصيل الإكسسوار المحدد من القائمة المحلية (اللي جلبتها مسبقًا)
      const selectedAccessory = accessories.find(
        (a) => a.id === color.accessory_id
      );

      if (!selectedAccessory) {
        showMessage("لم يتم العثور على الإكسسوار المختار", "error");
        return;
      }

      // 2. البحث هل اللون موجود ضمن ألوان الإكسسوار
      const existingColorEntry = selectedAccessory.colors?.find(
        (c) => c.color.id === formData.color_id
      );

      const quantityToAdd = parseInt(formData.quantity);

      if (existingColorEntry) {
        // تعديل الكمية بإرسال PUT على color_id الموجود مع جمع الكميات
        const updatedPayload = {
          stock_quantity: existingColorEntry.stock_quantity + quantityToAdd,
        };

        const updateRes = await fetch(
          `${COLORS_API_URL}/${existingColorEntry.id}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(updatedPayload),
          }
        );

        const updateData = await updateRes.json();

        if (!updateRes.ok) {
          throw new Error(updateData.message || "فشل في تحديث كمية اللون");
        }

        showMessage("تم تعديل كمية اللون بنجاح", "success");
      } else {
        // إضافة لون جديد مع الكمية
        const formPayload = new FormData();
        formPayload.append("color_id", formData.color_id);
        formPayload.append("accessory_id", color.accessory_id);
        formPayload.append("stock_quantity", quantityToAdd);

        const response = await fetch(COLORS_API_URL, {
          method: "POST",
          body: formPayload,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "فشل في إضافة لون الإكسسوار");
        }

        showMessage("تمت إضافة اللون بنجاح", "success");
      }

      // تفريغ البيانات بعد النجاح
      setColor({ accessory_id: "", accessory_title: "" });
      setFormData({ color_id: "", color_name: "", quantity: "" });
      setAccessories([]);
      setSearchTerm("");
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
      <Box sx={{ p: 3, maxWidth: 500 }}>
        <Autocomplete
          options={accessories}
          getOptionLabel={(option) => option.title}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onChange={(e, newValue) => {
            setColor({
              ...color,
              accessory_id: newValue?.id || "",
              accessory_title: newValue?.title || "",
            });
          }}
          onInputChange={(e, newInputValue) => {
            setSearchTerm(newInputValue);
          }}
          value={
            color.accessory_title
              ? { id: color.accessory_id, title: color.accessory_title }
              : null
          }
          loading={loadingAccessories}
          noOptionsText={
            searchTerm.length < 2
              ? "اكتب على الأقل حرفين للبحث"
              : "لا توجد نتائج"
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="ابحث عن إكسسوار بالاسم"
              sx={{ mb: 2 }}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loadingAccessories ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          renderOption={(props, option) => (
            <li {...props} key={option.id}>
              {option.title}
            </li>
          )}
        />

        <Autocomplete
          options={colors}
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onChange={(e, newValue) =>
            setFormData({
              ...formData,
              color_id: newValue?.id || "",
              color_name: newValue?.name || "",
            })
          }
          value={
            formData.color_name
              ? { id: formData.color_id, name: formData.color_name }
              : null
          }
          renderInput={(params) => (
            <TextField {...params} label="اختر اللون" sx={{ mb: 2 }} />
          )}
        />

        <TextField
          label="العدد المتوفر"
          type="number"
          fullWidth
          value={formData.quantity}
          onChange={(e) =>
            setFormData({ ...formData, quantity: e.target.value })
          }
          sx={{ mb: 2 }}
        />

        <Button
          variant="contained"
          onClick={handleSubmit}
          fullWidth
          size="large"
          disabled={
            !formData.color_id || !color.accessory_id || !formData.quantity
          }
        >
          إضافة لون الإكسسوار
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

export default AddAccessoryColor;
