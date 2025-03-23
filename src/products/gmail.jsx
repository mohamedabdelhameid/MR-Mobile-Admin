import { Box, Typography, Paper, List, ListItem, ListItemText, useTheme } from "@mui/material";
import { tokens } from "../theme";
import Header from "../components/Header";
import { useEffect, useState } from "react";

const DeleteProd = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/messages")
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.error("Error fetching messages:", err));
  }, []);

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="استقبال البريد" subtitle="يمكنك رؤية الرسائل المستلمة من العملاء هنا" />
      </Box>

      <Box mt={4}>
        {messages.length > 0 ? (
          <List>
            {messages.map((msg, index) => (
              <Paper key={index} sx={{ padding: "10px", marginBottom: "10px" }}>
                <ListItem>
                  <ListItemText
                    primary={`الاسم: ${msg.name} - البريد: ${msg.email}`}
                    secondary={`الرسالة: ${msg.message}`}
                  />
                </ListItem>
              </Paper>
            ))}
          </List>
        ) : (
          <Typography>لا توجد رسائل حتى الآن</Typography>
        )}
      </Box>
    </Box>
  );
};

export default DeleteProd;
