import { Box, Button, TextField } from "@mui/material";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UpdateProd = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    category: "",
    company: "",
    price: "",
    image: "",
  });

  useEffect(() => {
    fetch(`http://localhost:5000/item/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.error("Error fetching product:", err));
  }, [id]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProduct((prev) => ({ ...prev, image: reader.result })); // حفظ الصورة كـ Base64
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = () => {
    fetch(`http://localhost:5000/item/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    })
      .then((res) => res.json())
      .then(() => navigate("/allprod"))
      .catch((err) => console.error("Error updating product:", err));
  };

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Update Old Product" subtitle="Now, you can update old product and show updates to all users" />
      </Box>

      <Box display="flex" flexDirection="column" gap="20px" mt="20px" maxWidth="400px">
        <TextField label="Name" name="name" value={product.name} onChange={handleChange} fullWidth />
        <TextField label="Category" name="category" value={product.category} onChange={handleChange} fullWidth />
        <TextField label="Company" name="company" value={product.company} onChange={handleChange} fullWidth />
        <TextField label="Price" name="price" type="number" value={product.price} onChange={handleChange} fullWidth />

        {/* حقل رفع الصورة */}
        <input type="file" accept="image/*" onChange={handleImageUpload} style={{ width: "100%" }} />

        {/* عرض الصورة بعد الرفع */}
        {product.image && <img src={product.image} alt="Product" style={{ width: "100px", marginTop: "10px" }} />}

        <Button variant="contained" color="primary" onClick={handleUpdate}>
          Save Changes
        </Button>
      </Box>
    </Box>
  );
};

export default UpdateProd;
