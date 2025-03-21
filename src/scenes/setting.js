import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import Header from "../components/Header";

const Setting = () => {

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="setting" subtitle="you can change your username or password" />

      </Box>

      
    </Box>
  );
};

export default Setting;


