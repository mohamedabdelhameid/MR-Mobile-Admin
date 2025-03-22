import { Box, Card, CardContent, CardMedia, Typography, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const Allprod = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/item")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Your Products" subtitle="You can read, create, update, and delete your products" />
      </Box>

      <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap="20px" mt="20px">
        {products.map((product) => (
          <Card key={product.id} sx={{ maxWidth: 250, boxShadow: 3 }}>
            {product.image && <CardMedia component="img" height="140" image={product.image} alt={product.name} />}
            <CardContent>
              <Typography variant="h6">{product.name}</Typography>
              <Typography color="text.secondary">Category: {product.category}</Typography>
              <Typography color="text.secondary">Company: {product.company}</Typography>
              <Typography color="primary">Price: ${product.price}</Typography>

              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(`/updateprod/${product.id}`)}
                sx={{ mt: 2 }}
              >
                Edit
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default Allprod;
