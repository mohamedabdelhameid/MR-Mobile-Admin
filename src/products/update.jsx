import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import Header from "../components/Header";

const UpdateProd = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Update Old Product" subtitle="Now, you can update old product and show updates to all users" />

      </Box>

      
    </Box>
  );
};

export default UpdateProd;


