import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import Header from "../components/Header";

const Allprod = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Your Products" subtitle="you can read, create, update and delete your products" />

      </Box>
      {/* Body */}
      <div>
        <h1>Your products</h1>
      </div>

      
    </Box>
  );
};

export default Allprod;


