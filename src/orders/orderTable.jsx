import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // جلب الطلبات من API
  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/orders');
      const data = await response.json();
      if (data.success) {
        setOrders(data.data);
      } else {
        setError('فشل في تحميل الطلبات');
      }
    } catch (err) {
      setError('خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  // حذف الطلب مع تأكيد
  const handleDelete = async (orderId) => {
    const confirmFirst = window.confirm('هل أنت متأكد من حذف هذا الطلب؟');
    if (!confirmFirst) return;

    const confirmAgain = window.confirm('سيتم حذف الطلب نهائيًا. تأكيد الحذف؟');
    if (!confirmAgain) return;

    try {
      const response = await fetch(`YOUR_API_URL/orders/${orderId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        alert('تم حذف الطلب بنجاح');
        fetchOrders(); // إعادة تحميل القائمة
      } else {
        alert('فشل حذف الطلب');
      }
    } catch (err) {
      alert('خطأ في الاتصال بالخادم');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <div className="text-center py-4">جاري التحميل...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6 text-right">قائمة الطلبات</h1>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-3 px-4 border text-right">رقم الطلب</th>
            <th className="py-3 px-4 border text-right">الإجمالي</th>
            <th className="py-3 px-4 border text-right">الحالة</th>
            <th className="py-3 px-4 border text-right">التاريخ</th>
            <th className="py-3 px-4 border text-right">العمليات</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border text-right">#{order.id.slice(0, 8)}</td>
              <td className="py-2 px-4 border text-right">{order.total_price} ج.م</td>
              <td className="py-2 px-4 border text-right">
                <span className={`inline-block px-2 py-1 rounded ${
                  order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.status}
                </span>
              </td>
              <td className="py-2 px-4 border text-right">
                {new Date(order.created_at).toLocaleDateString()}
              </td>
              <td className="py-2 px-4 border text-right">
                <button
                  onClick={() => navigate(`/orders/${order.id}`)}
                  className="bg-blue-500 text-white py-1 px-3 rounded ml-2"
                >
                  التفاصيل
                </button>
                <button
                  onClick={() => handleDelete(order.id)}
                  className="bg-red-500 text-white py-1 px-3 rounded"
                >
                  حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersPage;