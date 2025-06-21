import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Chip,
  IconButton,
} from "@mui/material";
import { GridCloseIcon } from "@mui/x-data-grid";
import { Close, CloseOutlined } from "@mui/icons-material";
import BASE_BACKEND_URL from "../API/config";
import BASE_BACKEND_LOCAHOST_URL from "../API/localhost";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [modalImage, setModalImage] = useState("");

  const [detailsOpen, setDetailsOpen] = useState(false); // لحوار التفاصيل
  const [imageOpen, setImageOpen] = useState(false); // لحوار الصورة

  const getAuthToken = () => localStorage.getItem("token");

  const fetchOrders = async () => {
    const token = getAuthToken();
    if (!token) {
      setError("غير مصرح بالدخول");
      setLoading(false);
      navigate("/login");
      return;
    }

    try {
      // const response = await fetch("http://localhost:8000/api/orders", {
      const response = await fetch(`${BASE_BACKEND_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        setError("انتهت صلاحية الجلسة");
        navigate("/login");
        return;
      }

      const data = await response.json();
      if (data.success) {
        setOrders(data.data);
      } else {
        setError(data.message || "فشل في تحميل الطلبات");
      }
    } catch {
      setError("خطأ في الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    const token = getAuthToken();
    if (!token) return navigate("/login");

    try {
      const res = await fetch(`${BASE_BACKEND_URL}/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ payment_status: status }),
      });

      // if (res.status === 401) return navigate('/login');

      const data = await res.json();
      if (data.success) {
        alert("تم تحديث حالة الطلب");
        fetchOrders();
      } else {
        alert("فشل التحديث");
      }
    } catch {
      alert("خطأ في الاتصال");
    }
  };

  const handleOpenDialog = (order) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedOrder(null);
    setDetailsOpen(false);
  };

  const handleOpenModal = (imgSrc) => {
    setModalImage(imgSrc);
    setImageOpen(true);
  };

  const handleClose = () => {
    setModalImage("");
    setImageOpen(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <Typography align="center">جاري التحميل...</Typography>;
  if (error)
    return (
      <Typography color="error" align="center">
        {error}
      </Typography>
    );

  return (
    <>
      <Typography variant="h5" align="right" gutterBottom className="container">
        قائمة الطلبات
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="right">رقم الطلب</TableCell>
              <TableCell align="right">العميل</TableCell>
              <TableCell align="right">طريقة الدفع</TableCell>
              <TableCell align="right">الإجمالي</TableCell>
              <TableCell align="right">الحالة</TableCell>
              <TableCell align="right">التاريخ</TableCell>
              <TableCell align="center">التاكيد</TableCell>
              <TableCell align="center">العمليات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell align="right">#{order.id.slice(0, 8)}</TableCell>
                <TableCell align="right">
                  {order.user.first_name} {order.user.last_name}
                </TableCell>
                <TableCell align="right">{order.payment_method}</TableCell>
                <TableCell align="right">{order.total_price} ج.م</TableCell>
                <TableCell align="right">
                  <Chip
                    label={
                      order.payment_status === "confirmed"
                        ? "مؤكد"
                        : order.payment_status === "rejected"
                        ? "مرفوض"
                        : "قيد الانتظار"
                    }
                    color={
                      order.payment_status === "confirmed"
                        ? "success"
                        : order.payment_status === "rejected"
                        ? "error"
                        : "warning"
                    }
                  />
                </TableCell>
                <TableCell align="right">
                  {new Date(order.created_at).toLocaleDateString("ar-EG")}
                </TableCell>
                <TableCell align="center">
                  <img
                    // src={`http://localhost:8000${order.payment_proof}`}
                    src={`${BASE_BACKEND_LOCAHOST_URL}${order.payment_proof}`}
                    alt="إثبات الدفع"
                    style={{
                      width: 80,
                      height: 80,
                      objectFit: "cover",
                      borderRadius: 8,
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      handleOpenModal(
                        // `http://localhost:8000${order.payment_proof}`
                        `${BASE_BACKEND_LOCAHOST_URL}${order.payment_proof}`
                      )
                    }
                  />
                </TableCell>

                <TableCell align="right">
                  <Button
                    onClick={() => handleOpenDialog(order)}
                    size="small"
                    variant="success"
                  >
                    التفاصيل
                  </Button>
                  {order.payment_status === "pending" && (
                    <>
                      <Button
                        onClick={() => updateOrderStatus(order.id, "confirmed")}
                        size="small"
                        color="success"
                      >
                        قبول
                      </Button>
                      <Button
                        onClick={() => updateOrderStatus(order.id, "rejected")}
                        size="small"
                        color="error"
                      >
                        رفض
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={detailsOpen}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
        style={{ direction: "rtl" }}
      >
        <DialogTitle>تفاصيل الطلب</DialogTitle>
        <DialogContent dividers>
          {selectedOrder && (
            <>
              <Typography gutterBottom>
                <strong>العميل:</strong> {selectedOrder.user.first_name}{" "}
                {selectedOrder.user.last_name}
              </Typography>
              <Typography gutterBottom>
                <strong>البريد:</strong> {selectedOrder.user.email}
              </Typography>
              <Typography gutterBottom>
                <strong>الهاتف:</strong> {selectedOrder.user.phone_number}
              </Typography>
              <Typography gutterBottom>
                <strong>العنوان:</strong> {selectedOrder.user.city},{" "}
                {selectedOrder.user.area}
              </Typography>
              <Typography gutterBottom>
                <strong>الملاحظات:</strong> {selectedOrder.note || "لا توجد"}
              </Typography>
              <Typography gutterBottom>
                <strong>المنتجات:</strong>
              </Typography>
              {selectedOrder.items.map((item) => (
                <Paper key={item.id} sx={{ p: 2, mb: 1 }}>
                  <Typography>
                    <strong>{item.product.title}</strong>
                  </Typography>
                  <Typography>
                    السعر: {item.price} × {item.quantity} = {item.total_price}{" "}
                    ج.م
                  </Typography>
                  <Typography>
                    اللون:{" "}
                    <span
                      style={{
                        backgroundColor: item.color.hex_code,
                        display: "inline-block",
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                      }}
                    ></span>{" "}
                    {item.color.name}
                  </Typography>
                  {item.product.storage && (
                    <Typography>المساحة: {item.product.storage}</Typography>
                  )}
                  {item.product.battery && (
                    <Typography>البطارية: {item.product.battery}</Typography>
                  )}
                  {item.product.speed && (
                    <Typography>الشاحن: {item.product.speed}</Typography>
                  )}
                </Paper>
              ))}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>إغلاق</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={imageOpen} onClose={handleClose} maxWidth="md" fullWidth>
        <IconButton
          onClick={handleClose}
          style={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "gray",
            width: "50px",
          }}
          aria-label="close"
        >
          <CloseOutlined />
        </IconButton>
        <DialogContent dividers style={{ textAlign: "center" }}>
          <img
            src={modalImage}
            alt="إثبات الدفع مكبر"
            style={{ maxWidth: "100%", maxHeight: "80vh", borderRadius: 12 }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OrdersPage;
