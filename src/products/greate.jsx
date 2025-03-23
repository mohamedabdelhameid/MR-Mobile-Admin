import { Box, Button, IconButton, Typography, useTheme, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
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
  const [open, setOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

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
        setImage(reader.result);
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

  const handleOpenDialog = (id) => {
    setSelectedProductId(id);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedProductId(null);
  };

  const handleConfirmDelete = () => {
    fetch(`http://localhost:5000/item/${selectedProductId}`, { method: "DELETE" })
      .then(() => {
        setProducts(products.filter((product) => product.id !== selectedProductId));
        alert("تم حذف المنتج بنجاح!");
      })
      .catch((err) => console.error("Error deleting product:", err));
    handleCloseDialog();
  };

  return (
    <Box m="20px">
      <Header title="Your Products" subtitle="Manage your products" />

      <Box sx={{
        display: "flex", 
        flexWrap: "wrap",
        gap: "10px", 
        my: "20px",
        justifyContent: "center"
      }}>
        <TextField label="Product Name" variant="outlined" value={name} onChange={(e) => setName(e.target.value)} sx={{ width: { xs: "100%", sm: "auto" } }} />
        <TextField label="Category" variant="outlined" value={category} onChange={(e) => setCategory(e.target.value)} sx={{ width: { xs: "100%", sm: "auto" } }} />
        <TextField label="Company" variant="outlined" value={company} onChange={(e) => setCompany(e.target.value)} sx={{ width: { xs: "100%", sm: "auto" } }} />
        <TextField label="Price" variant="outlined" type="number" value={price} onChange={(e) => setPrice(e.target.value)} sx={{ width: { xs: "100%", sm: "auto" } }} />
        <Button variant="contained" component="label" sx={{ width: { xs: "100%", sm: "auto" } }}>
          Upload Image
          <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
        </Button>
        <Button variant="contained" color="primary" onClick={handleAddProduct} startIcon={<AddIcon />} sx={{ width: { xs: "100%", sm: "auto" } }}>
          Add Product
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ marginTop: "20px", overflowX: "auto" }}>
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
                  {product.image && <img src={product.image} alt={product.name} width="50" height="50" style={{ objectFit: "cover" }} />}
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.company}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>
                  <IconButton color="error" onClick={() => handleOpenDialog(product.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>تأكيد الحذف</DialogTitle>
        <DialogContent>
          <DialogContentText>هل أنت متأكد أنك تريد حذف هذا المنتج؟</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>إلغاء</Button>
          <Button onClick={handleConfirmDelete} color="error">حذف</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Greate;
