import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Delete, Edit, Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import BASE_BACKEND_URL from '../API/config';

const ColorsList = () => {
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    colorId: null,
    colorName: ''
  });

  const navigate = useNavigate();

  // const API_URL = "http://127.0.0.1:8000/api/colors";
  const API_URL = `${BASE_BACKEND_URL}/colors`;

  useEffect(() => {
    const fetchColors = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(API_URL, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('فشل في جلب البيانات من السيرفر');
        }

        const data = await response.json();

        if (data.data && Array.isArray(data.data)) {
          setColors(data.data);
        } else if (Array.isArray(data)) {
          setColors(data);
        } else if (data.colors && Array.isArray(data.colors)) {
          setColors(data.colors);
        } else {
          throw new Error('هيكل البيانات غير متوقع من السيرفر');
        }
      } catch (err) {
        setError(err.message);
        showMessage(err.message, 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchColors();
  }, []);

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_URL}/${deleteDialog.colorId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        showMessage('تم حذف اللون بنجاح', 'success');
        setColors(colors.filter(color => color.id !== deleteDialog.colorId));
      } else {
        throw new Error('فشل في حذف اللون');
      }
    } catch (error) {
      showMessage(error.message, 'error');
    } finally {
      setDeleteDialog({ open: false, colorId: null, colorName: '' });
    }
  };

  const showMessage = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography color="error">{error}</Typography>
        <Button variant="contained" onClick={() => window.location.reload()} sx={{ mt: 2 }}>
          إعادة المحاولة
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">قائمة الألوان</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/addColor')}
        >
          إضافة لون جديد
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table sx={{ minWidth: 650 }} aria-label="جدول الألوان">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>#</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="right">اللون</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>الاسم</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>كود اللون</TableCell>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>الإجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {colors.length > 0 ? (
              colors.map((color, index) => (
                <TableRow key={color.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        backgroundColor: color.hex_code,
                        border: '1px solid #ccc'
                      }}
                    />
                  </TableCell>
                  <TableCell>{color.name}</TableCell>
                  <TableCell>
                    <code>{color.hex_code}</code>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <IconButton
                      color="primary"
                      onClick={() => navigate(`/updateColor/${color.id}`)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => setDeleteDialog({
                        open: true,
                        colorId: color.id,
                        colorName: color.name
                      })}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body1">لا توجد ألوان متاحة</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* حوار تأكيد الحذف */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ ...deleteDialog, open: false })}
      >
        <DialogTitle>تأكيد الحذف</DialogTitle>
        <DialogContent>
          هل أنت متأكد من رغبتك في حذف "{deleteDialog.colorName}"؟
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ ...deleteDialog, open: false })}>
            إلغاء
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
          >
            حذف
          </Button>
        </DialogActions>
      </Dialog>

      {/* رسائل التنبيه */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ColorsList;
