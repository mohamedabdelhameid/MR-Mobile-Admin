import { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TablePagination,
  Tooltip,
  IconButton,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextareaAutosize
} from '@mui/material';
import {
  Delete,
  Refresh,
  Reply,
  CheckCircle
} from '@mui/icons-material';
import BASE_BACKEND_URL from '../API/config';

const MessagesTable = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [replyDialog, setReplyDialog] = useState({
    open: false,
    email: '',
    message: '',
    replyContent: '',
    id: null
  });

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);

      // const response = await fetch('http://localhost:8000/api/contact-us', {
      const response = await fetch(`${BASE_BACKEND_URL}/contact-us`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      const data = await response.json();

      const repliedMessages = JSON.parse(localStorage.getItem("repliedMessages")) || [];

      const updatedMessages = data.data.map(msg => ({
        ...msg,
        isReplied: repliedMessages.includes(msg.id)
      }));

      setMessages(updatedMessages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleReplyClick = (message) => {
    setReplyDialog({
      open: true,
      email: message.email,
      message: message.message,
      replyContent: '',
      id: message.id
    });
  };

  const handleReplySubmit = async () => {
    try {
      // const response = await fetch(`http://localhost:8000/api/contact-us/${replyDialog.id}/reply`, {
      const response = await fetch(`${BASE_BACKEND_URL}/contact-us/${replyDialog.id}/reply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          reply_message: replyDialog.replyContent
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send reply');
      }

      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === replyDialog.id ? { ...msg, isReplied: true } : msg
        )
      );

      const repliedMessages = JSON.parse(localStorage.getItem("repliedMessages")) || [];
      localStorage.setItem("repliedMessages", JSON.stringify([...repliedMessages, replyDialog.id]));

      setReplyDialog({
        open: false,
        email: '',
        message: '',
        replyContent: '',
        id: null
      });

      alert('✓ تم إرسال الرد بنجاح');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذه الرسالة؟")) return;

    try {
      // const response = await fetch(`http://localhost:8000/api/contact-us/${id}`, {
      const response = await fetch(`${BASE_BACKEND_URL}/contact-us/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('فشل في حذف الرسالة');
      }

      setMessages(messages.filter(message => message.id !== id));

      const repliedMessages = JSON.parse(localStorage.getItem("repliedMessages")) || [];
      localStorage.setItem("repliedMessages", JSON.stringify(repliedMessages.filter(msgId => msgId !== id)));

      alert('✓ تم حذف الرسالة بنجاح');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tooltip title="تحديث البيانات">
        <IconButton onClick={fetchMessages}>
          <Refresh />
        </IconButton>
      </Tooltip>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">المرسل</TableCell>
                  <TableCell align="center">البريد الإلكتروني</TableCell>
                  <TableCell align="center">الرسالة</TableCell>
                  <TableCell align="center">الحالة</TableCell>
                  <TableCell align="center">الإجراءات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {messages.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((message) => (
                  <TableRow key={message.id} hover>
                    <TableCell align="center">
                      <Typography variant="body2">{message.name}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">{message.email}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '300px'
                      }}>
                        {message.message}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {message.isReplied ? (
                        <CheckCircle color="success" />
                      ) : (
                        <Typography variant="body2" color="error">لم يتم الرد</Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="رد سريع">
                        <IconButton
                          onClick={() => handleReplyClick(message)}
                          color="success"
                          size="small"
                          sx={{ mr: 1 }}
                        >
                          <Reply fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="حذف الرسالة">
                        <IconButton
                          onClick={() => handleDelete(message.id)}
                          color="error"
                          size="small"
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={messages.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
          />
        </>
      )}

      {/* ✅ نافذة الرد */}
      <Dialog open={replyDialog.open} onClose={() => setReplyDialog({ ...replyDialog, open: false })} maxWidth="md" fullWidth>
        <DialogTitle>رد على: {replyDialog.email}</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1">الرسالة الأصلية:</Typography>
          <Paper sx={{ p: 2 }}>{replyDialog.message}</Paper>
          <TextareaAutosize
            minRows={5}
            style={{ width: '100%', marginTop: '10px' }}
            placeholder="اكتب ردك هنا..."
            value={replyDialog.replyContent}
            onChange={(e) => setReplyDialog({ ...replyDialog, replyContent: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReplyDialog({ ...replyDialog, open: false })}>إلغاء</Button>
          <Button onClick={handleReplySubmit} variant="contained" color="primary" disabled={!replyDialog.replyContent.trim()}>إرسال الرد</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MessagesTable;