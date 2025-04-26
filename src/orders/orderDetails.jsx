import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`YOUR_API_URL/orders/${id}`);
        const data = await response.json();
        if (data.success) {
          setOrder(data.data);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (loading) return <div className="text-center py-4">جاري التحميل...</div>;
  if (!order) return <div className="text-center py-4">الطلب غير موجود</div>;

  return (
    <div className="p-4">
      <button
        onClick={() => navigate(-1)}
        className="bg-gray-500 text-white py-1 px-3 rounded mb-4"
      >
        رجوع
      </button>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-right">تفاصيل الطلب #{order.id.slice(0, 8)}</h1>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-right">معلومات الطلب</h2>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-right"><span className="font-medium">الإجمالي:</span> {order.total_price} ج.م</p>
            <p className="text-right">
              <span className="font-medium">الحالة:</span> 
              <span className={`px-2 py-1 rounded mr-2 ${
                order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {order.status}
              </span>
            </p>
            <p className="text-right"><span className="font-medium">التاريخ:</span> {new Date(order.created_at).toLocaleString()}</p>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4 text-right">المنتجات</h2>
        <div className="space-y-4">
          {order.order_items.map((item) => (
            <div key={item.id} className="flex items-center border-b pb-4">
              <img
                src={item.product.image_cover || item.product.image || 'https://via.placeholder.com/100'}
                alt={item.product.title}
                className="w-20 h-20 object-cover rounded ml-4"
              />
              <div className="text-right flex-grow">
                <h3 className="font-medium">{item.product.title}</h3>
                <p>الكمية: {item.quantity}</p>
                <p>السعر: {item.price} ج.م</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;