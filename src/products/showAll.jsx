import { 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  IconButton, 
  Button 
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import BASE_BACKEND_URL from "../API/config";
import BASE_BACKEND_LOCAHOST_URL from "../API/localhost";

// const API_URL = "http://127.0.0.1:8000/api/mobiles"; // رابط API للمنتجات
// const BRANDS_API_URL = "http://127.0.0.1:8000/api/brands"; // رابط API للبراندات
// const BASE_BACKEND_LOCAHOST_URL = "http://127.0.0.1:8000"; // رابط API للصور
const API_URL = `${BASE_BACKEND_URL}/mobiles`;
const BRANDS_API_URL = `${BASE_BACKEND_URL}/brands`;

const Allprod = () => {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]); // قائمة البراندات
  const navigate = useNavigate();

  useEffect(() => {
    // جلب بيانات المنتجات
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Products:", data);
        setProducts(data.data); // تحديث هنا لاستخدام data.data
      })
      .catch((err) => console.error("Error fetching products:", err));

    // جلب بيانات البراندات
    fetch(BRANDS_API_URL)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Brands:", data);
        setBrands(data.data); // تحديث هنا لاستخدام data.data
      })
      .catch((err) => console.error("Error fetching brands:", err));
  }, []);

  // دالة للحصول على اسم البراند من الـ brand_id
  const getBrandName = (brandId) => {
    const brand = brands.find((brand) => brand.id === brandId);
    return brand ? brand.name : "Unknown Brand"; // إذا لم يتم العثور على البراند
  };

    const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDeleteProduct = async (id) => {
    setIsDeleting(true);
    try {
      // const handleDeleteProduct = async (id) => {
        const confirmDelete = window.confirm("هل أنت متأكد أنك تريد حذف هذا المنتج؟");
        
        if (!confirmDelete) return;
      
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            // إذا لم يكن هناك token، توجيه المستخدم للصفحة تسجيل الدخول
            navigate("/login");
            return;
          }
      
          const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            headers: {
              "Authorization": `Bearer ${token}`,
              // "Accept": "application/json",
              // "Content-Type": "application/json",
            },
          });
      
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "فشل في حذف المنتج");
          }
      
          // تحديث الواجهة بعد الحذف
          setProducts(products.filter((product) => product.id !== id));
          
          // إظهار رسالة نجاح
          alert("تم حذف المنتج بنجاح");
          
        } catch (error) {
          console.error("Error deleting product:", error);
          alert(error.message || "حدث خطأ أثناء حذف المنتج");
        // }
      };
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Box m="20px">
      <Header title="Your Mobiles" subtitle="Manage all your mobiles here" />

      {products.length > 0 ? (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell> {/* عمود الترقيم */}
                <TableCell>Image</TableCell>
                <TableCell>Title</TableCell>
                {/* <TableCell>Brand Name</TableCell> اسم البراند بدلاً من الـ ID */}
                {/* <TableCell>Model Number</TableCell> */}
                <TableCell>Price</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product, index) => (
                <TableRow key={product.id}>
                  <TableCell>{index + 1}</TableCell> {/* ترقيم يبدأ من 1 */}
                  <TableCell>
                    {product.image_cover && (
                      <img 
                        src={`${BASE_BACKEND_LOCAHOST_URL}${product.image_cover}`}
                        alt={product.title} 
                        width="80" 
                        height="100" 
                        style={{ objectFit: "cover", borderRadius: "5px" }} 
                        onClick={() => navigate(`/products/${product.id}`)}
                      />
                    )}
                  </TableCell>
                  <TableCell>{product.title}</TableCell>
                  <TableCell>ج.م{product.price}</TableCell>
                  <TableCell>
                    <IconButton color="warning" onClick={() => navigate(`/updateprod/${product.id}`, { state: product })}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDeleteProduct(product.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <p style={{ textAlign: "center", marginTop: "20px" }}>لا توجد منتجات متاحة</p>
      )}
    </Box>
  );
};

export default Allprod;
