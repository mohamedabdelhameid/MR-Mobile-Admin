// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// const OrdersPage = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   // جلب التوكن من localStorage
//   const getAuthToken = () => {
//     return localStorage.getItem('token'); // أو أي مفتاح تستخدمه لحفظ التوكن
//   };

//   // جلب الطلبات من API مع التوكن
//   const fetchOrders = async () => {
//     const token = getAuthToken();
//     if (!token) {
//       setError('غير مصرح بالدخول، يرجى تسجيل الدخول أولاً');
//       setLoading(false);
//       navigate('/login'); // توجيه إلى صفحة تسجيل الدخول إذا لم يوجد توكن
//       return;
//     }

//     try {
//       const response = await fetch('http://localhost:8000/api/orders', {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (response.status === 401) {
//         // إذا كان التوكن غير صالح
//         localStorage.removeItem('token');
//         setError('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى');
//         navigate('/login');
//         return;
//       }

//       const data = await response.json();
//       if (data.success) {
//         setOrders(data.data);
//       } else {
//         setError(data.message || 'فشل في تحميل الطلبات');
//       }
//     } catch (err) {
//       setError('خطأ في الاتصال بالخادم');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // تحديث حالة الطلب (قبول/رفض) مع التوكن
//   const updateOrderStatus = async (orderId, status) => {
//     const token = getAuthToken();
//     if (!token) {
//       alert('غير مصرح بالدخول، يرجى تسجيل الدخول أولاً');
//       navigate('/login');
//       return;
//     }

//     try {
//       const response = await fetch(`http://localhost:8000/api/orders/${orderId}`, {
//         method: 'PATCH',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ status }),
//       });

//       if (response.status === 401) {
//         localStorage.removeItem('token');
//         alert('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى');
//         navigate('/login');
//         return;
//       }

//       const data = await response.json();
//       if (data.success) {
//         alert(`تم ${status === 'confirmed' ? 'قبول' : 'رفض'} الطلب بنجاح`);
//         fetchOrders();
//       } else {
//         alert(data.message || 'فشل تحديث حالة الطلب');
//       }
//     } catch (err) {
//       alert('خطأ في الاتصال بالخادم');
//     }
//   };

//   // حذف الطلب مع التوكن
//   const handleDelete = async (orderId) => {
//     const confirmFirst = window.confirm('هل أنت متأكد من حذف هذا الطلب؟');
//     if (!confirmFirst) return;

//     const confirmAgain = window.confirm('سيتم حذف الطلب نهائيًا. تأكيد الحذف؟');
//     if (!confirmAgain) return;

//     const token = getAuthToken();
//     if (!token) {
//       alert('غير مصرح بالدخول، يرجى تسجيل الدخول أولاً');
//       navigate('/login');
//       return;
//     }

//     try {
//       const response = await fetch(`http://localhost:8000/api/orders/${orderId}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       if (response.status === 401) {
//         localStorage.removeItem('token');
//         alert('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى');
//         navigate('/login');
//         return;
//       }

//       const data = await response.json();
//       if (data.success) {
//         alert('تم حذف الطلب بنجاح');
//         fetchOrders();
//       } else {
//         alert(data.message || 'فشل حذف الطلب');
//       }
//     } catch (err) {
//       alert('خطأ في الاتصال بالخادم');
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   if (loading) return <div className="text-center py-4">جاري التحميل...</div>;
//   if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-6 text-right">قائمة الطلبات</h1>

//       <div className="overflow-x-auto">
//         <table className="min-w-full border border-gray-200">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="py-3 px-4 border text-right">رقم الطلب</th>
//               <th className="py-3 px-4 border text-right">العميل</th>
//               <th className="py-3 px-4 border text-right">طريقة الدفع</th>
//               <th className="py-3 px-4 border text-right">الإجمالي</th>
//               <th className="py-3 px-4 border text-right">حالة الدفع</th>
//               <th className="py-3 px-4 border text-right">التاريخ</th>
//               <th className="py-3 px-4 border text-right">العمليات</th>
//             </tr>
//           </thead>
//           <tbody>
//             {orders.map((order) => (
//               <tr key={order.id} className="hover:bg-gray-50">
//                 <td className="py-2 px-4 border text-right">#{order.id.slice(0, 8)}</td>
//                 <td className="py-2 px-4 border text-right">
//                   {order.user.first_name} {order.user.last_name}
//                   <br />
//                   <span className="text-sm text-gray-500">{order.user.phone_number}</span>
//                 </td>
//                 <td className="py-2 px-4 border text-right">
//                   {order.payment_method === 'instapay' ? 'انستاباي' :
//                    order.payment_method === 'vodafone_cash' ? 'فودافون كاش' :
//                    order.payment_method}
//                 </td>
//                 <td className="py-2 px-4 border text-right">{order.total_price} ج.م</td>
//                 <td className="py-2 px-4 border text-right">
//                   <span className={`inline-block px-2 py-1 rounded ${
//                     order.payment_status === 'confirmed' ? 'bg-green-100 text-green-800' :
//                     order.payment_status === 'rejected' ? 'bg-red-100 text-red-800' :
//                     'bg-yellow-100 text-yellow-800'
//                   }`}>
//                     {order.payment_status === 'confirmed' ? 'تم التأكيد' :
//                      order.payment_status === 'rejected' ? 'مرفوض' :
//                      'قيد الانتظار'}
//                   </span>
//                 </td>
//                 <td className="py-2 px-4 border text-right">
//                   {new Date(order.created_at).toLocaleDateString('ar-EG')}
//                 </td>
//                 <td className="py-2 px-4 border text-right space-x-2">
//                   <button
//                     onClick={() => navigate(`/orders/${order.id}`)}
//                     className="bg-blue-500 text-white py-1 px-3 rounded text-sm"
//                   >
//                     التفاصيل
//                   </button>
//                   {order.payment_status === 'pending' && (
//                     <>
//                       <button
//                         onClick={() => updateOrderStatus(order.id, 'confirmed')}
//                         className="bg-green-500 text-white py-1 px-3 rounded text-sm"
//                       >
//                         قبول
//                       </button>
//                       <button
//                         onClick={() => updateOrderStatus(order.id, 'rejected')}
//                         className="bg-red-500 text-white py-1 px-3 rounded text-sm"
//                       >
//                         رفض
//                       </button>
//                     </>
//                   )}
//                   <button
//                     onClick={() => handleDelete(order.id)}
//                     className="bg-gray-500 text-white py-1 px-3 rounded text-sm"
//                   >
//                     حذف
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default OrdersPage;

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

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [modalImage, setModalImage] = useState("");

  const handleOpenModal = (imgSrc) => {
    setModalImage(imgSrc);
    setOpen(true);
  };

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
      const response = await fetch("http://localhost:8000/api/orders", {
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
      const res = await fetch(`http://localhost:8000/api/orders/${orderId}`, {
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
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedOrder(null);
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
    setModalImage("");
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
                    src={`http://localhost:8000${order.payment_proof}`}
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
                        `http://localhost:8000${order.payment_proof}`
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
        open={open}
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

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
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
