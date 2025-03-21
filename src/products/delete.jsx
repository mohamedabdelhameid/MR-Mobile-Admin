import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import Header from "../components/Header";

const DeleteProd = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Delete Old Product" subtitle="Now, you can Delete old product and hide it to all users" />

      </Box>

      
    </Box>
  );
};

export default DeleteProd;


