import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import BASE_BACKEND_LOCAHOST_URL from '../API/localhost';
import BASE_BACKEND_URL from '../API/config';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const navigate = useNavigate();

  // تطبيق وضع الظلام عند التحميل
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // تبديل Dark Mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', newMode);
  };

  // جلب التوكن من localStorage
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // جلب تفاصيل الطلب
  const fetchOrderDetails = async () => {
    const token = getAuthToken();
    if (!token) {
      setError('غير مصرح بالدخول، يرجى تسجيل الدخول أولاً');
      setLoading(false);
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${BASE_BACKEND_URL}/orders/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        setError('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى');
        navigate('/login');
        return;
      }

      const data = await response.json();
      if (data.success) {
        setOrder(data.data);
      } else {
        setError(data.message || 'فشل في تحميل تفاصيل الطلب');
      }
    } catch (err) {
      setError('خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  // تحديث حالة الطلب
  const updateOrderStatus = async (status) => {
    const token = getAuthToken();
    if (!token) {
      alert('غير مصرح بالدخول، يرجى تسجيل الدخول أولاً');
      navigate('/login');
      return;
    }

    try {
      // const response = await fetch(`http://localhost:8000/api/orders/${id}`, {
      const response = await fetch(`${BASE_BACKEND_URL}/orders/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        alert('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى');
        navigate('/login');
        return;
      }

      const data = await response.json();
      if (data.success) {
        alert(`تم ${status === 'confirmed' ? 'قبول' : 'رفض'} الطلب بنجاح`);
        fetchOrderDetails();
      } else {
        alert(data.message || 'فشل تحديث حالة الطلب');
      }
    } catch (err) {
      alert('خطأ في الاتصال بالخادم');
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center h-screen dark:bg-gray-900">
      <div className="text-xl dark:text-white">جاري تحميل تفاصيل الطلب...</div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center h-screen dark:bg-gray-900">
      <div className="text-red-500 text-xl">{error}</div>
    </div>
  );

  if (!order) return (
    <div className="flex justify-center items-center h-screen dark:bg-gray-900">
      <div className="text-xl dark:text-white">لا يوجد بيانات للطلب</div>
    </div>
  );

  return (
    <div className={`min-h-screen p-4 ${darkMode ? 'dark:bg-gray-900 dark:text-white' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link to="/orders" className="flex items-center text-blue-600 dark:text-blue-400 hover:underline">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            رجوع لقائمة الطلبات
          </Link>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>

        {/* Order Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold">تفاصيل الطلب #{order.id.slice(0, 8)}</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              order.payment_status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
              order.payment_status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
              'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
            }`}>
              {order.payment_status === 'confirmed' ? 'تم التأكيد' : 
               order.payment_status === 'rejected' ? 'مرفوض' : 
               'قيد الانتظار'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-3 border-b pb-2 dark:border-gray-600">معلومات العميل</h2>
              <div className="space-y-2">
                <p><span className="font-medium">الاسم:</span> {order.user.first_name} {order.user.last_name}</p>
                <p><span className="font-medium">البريد الإلكتروني:</span> {order.user.email}</p>
                <p><span className="font-medium">رقم الهاتف:</span> {order.user.phone_number}</p>
                <p><span className="font-medium">المدينة:</span> {order.user.city}</p>
                <p><span className="font-medium">المنطقة:</span> {order.user.area}</p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-3 border-b pb-2 dark:border-gray-600">معلومات الطلب</h2>
              <div className="space-y-2">
                <p><span className="font-medium">تاريخ الطلب:</span> {new Date(order.created_at).toLocaleString('ar-EG')}</p>
                <p><span className="font-medium">طريقة الدفع:</span> {
                  order.payment_method === 'instapay' ? 'انستاباي' : 
                  order.payment_method === 'vodafone_cash' ? 'فودافون كاش' : 
                  order.payment_method
                }</p>
                <p><span className="font-medium">إثبات الدفع:</span> 
                  {order.payment_proof ? (
                    // <a href={`http://localhost:8000${order.payment_proof}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline ml-2">
                    <a href={`${BASE_BACKEND_LOCAHOST_URL}${order.payment_proof}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline ml-2">
                      عرض الإثبات
                    </a>
                  ) : 'لا يوجد'}
                </p>
                <p><span className="font-medium">ملاحظات:</span> {order.note || 'لا يوجد ملاحظات'}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 border-b pb-2 dark:border-gray-600">المنتجات المطلوبة</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white dark:bg-gray-700 rounded-lg overflow-hidden">
                <thead className="bg-gray-100 dark:bg-gray-600">
                  <tr>
                    <th className="py-3 px-4 text-right">الصورة</th>
                    <th className="py-3 px-4 text-right">المنتج</th>
                    <th className="py-3 px-4 text-right">اللون</th>
                    <th className="py-3 px-4 text-right">الكمية</th>
                    <th className="py-3 px-4 text-right">السعر</th>
                    <th className="py-3 px-4 text-right">المجموع</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id} className="border-t dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <td className="py-3 px-4">
                        <img 
                          src={`${BASE_BACKEND_LOCAHOST_URL}${item.product.image_cover || item.product.image}`} 
                          alt={item.product.title} 
                          className="w-16 h-16 object-cover rounded"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/80?text=No+Image';
                          }}
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium">{item.product.title}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-300">{item.product.model_number}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div 
                            className="w-6 h-6 rounded-full border border-gray-300 mr-2" 
                            style={{ backgroundColor: item.color.hex_code }}
                            title={item.color.name}
                          />
                          <span>{item.color.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">{item.quantity}</td>
                      <td className="py-3 px-4">{item.price} ج.م</td>
                      <td className="py-3 px-4 font-medium">{item.total_price} ج.م</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Total */}
          <div className="flex justify-end">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg w-full md:w-1/3">
              <h2 className="text-lg font-semibold mb-3 border-b pb-2 dark:border-gray-600">إجمالي الطلب</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>المجموع:</span>
                  <span>{order.total_price} ج.م</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t dark:border-gray-600">
                  <span>الإجمالي النهائي:</span>
                  <span>{order.total_price} ج.م</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          {order.payment_status === 'pending' && (
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => updateOrderStatus('rejected')}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                رفض الطلب
              </button>
              <button
                onClick={() => updateOrderStatus('confirmed')}
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                قبول الطلب
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;