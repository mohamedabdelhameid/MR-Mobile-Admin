import { Box, Button, IconButton, Typography, useTheme, TextField } from "@mui/material";
import { tokens } from "../theme";
import Header from "../components/Header";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";

const Greate = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [company, setCompany] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/item")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // تحويل الصورة إلى Base64
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = () => {
    if (!name || !category || !company || !price) {
      alert("يرجى إدخال جميع البيانات");
      return;
    }

    const newProduct = { name, category, company, price, image };

    fetch("http://localhost:5000/item", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts([...products, data]);
        setName("");
        setCategory("");
        setCompany("");
        setPrice("");
        setImage(null);
      })
      .catch((err) => console.error("Error adding product:", err));
  };

  const handleDeleteProduct = (id) => {
    fetch(`http://localhost:5000/item/${id}`, { method: "DELETE" })
      .then(() => setProducts(products.filter((product) => product.id !== id)))
      .catch((err) => console.error("Error deleting product:", err));
  };

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Your Products" subtitle="Manage your products" />
      </Box>

      {/* نموذج إدخال المنتج */}
      <Box display="flex" gap="10px" my="20px">
        <TextField label="Product Name" variant="outlined" value={name} onChange={(e) => setName(e.target.value)} />
        <TextField label="Category" variant="outlined" value={category} onChange={(e) => setCategory(e.target.value)} />
        <TextField label="Company" variant="outlined" value={company} onChange={(e) => setCompany(e.target.value)} />
        <TextField label="Price" variant="outlined" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        <Button variant="contained" component="label">
          Upload Image
          <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
        </Button>
        <Button variant="contained" color="primary" onClick={handleAddProduct} startIcon={<AddIcon />}>
          Add Product
        </Button>
      </Box>

      {/* عرض المنتجات */}
      <TableContainer component={Paper} sx={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>
                  {product.image && <img src={product.image} alt={product.name} width="50" height="50" />}
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.company}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>
                  <IconButton color="error" onClick={() => handleDeleteProduct(product.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Greate;
