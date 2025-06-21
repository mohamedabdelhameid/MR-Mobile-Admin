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
  Avatar,
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
import BASE_BACKEND_LOCAHOST_URL from '../API/localhost';
import BASE_BACKEND_URL from '../API/config';

const BrandsList = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    brandId: null,
    brandName: ''
  });
  const [imagePreview, setImagePreview] = useState({
    open: false,
    imageUrl: ''
  });
  const navigate = useNavigate();

  // const BASE_BACKEND_LOCAHOST_URL = "http://127.0.0.1:8000";
  const API_URL = `${BASE_BACKEND_URL}/brands`;

  useEffect(() => {
    const fetchBrands = async () => {
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
          setBrands(data.data);
        } else if (Array.isArray(data)) {
          setBrands(data);
        } else if (data.brands && Array.isArray(data.brands)) {
          setBrands(data.brands);
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

    fetchBrands();
  }, []);

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_URL}/${deleteDialog.brandId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        showMessage('تم حذف البراند بنجاح', 'success');
        setBrands(brands.filter(brand => brand.id !== deleteDialog.brandId));
      } else {
        throw new Error('فشل في حذف البراند');
      }
    } catch (error) {
      showMessage(error.message, 'error');
    } finally {
      setDeleteDialog({ open: false, brandId: null, brandName: '' });
    }
  };

  const handleOpenImagePreview = (imagePath) => {
    setImagePreview({
      open: true,
      imageUrl: `${BASE_BACKEND_LOCAHOST_URL}${imagePath}`
    });
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
        <Typography variant="h4">قائمة البراندات</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/createBrand')}
        >
          إضافة براند جديد
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table sx={{ minWidth: 650 }} aria-label="جدول البراندات">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>#</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>الصورة</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>الاسم</TableCell>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>الإجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {brands.length > 0 ? (
              brands.map((brand, index) => (
                <TableRow
                  key={brand.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {brand.image ? (
                      <Box
                        component="img"
                        src={`${BASE_BACKEND_LOCAHOST_URL}${brand.image}`}
                        alt={brand.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%23eee'/%3E%3Ctext x='50%25' y='50%25' fill='%23000' font-family='Arial' font-size='20' text-anchor='middle' dominant-baseline='middle'%3E${brand.name.charAt(0)}%3C/text%3E%3C/svg%3E`;
                        }}
                        sx={{
                          width: 80,
                          height: 80,
                          objectFit: 'contain',
                          borderRadius: 1,
                          border: '1px solid #eee',
                          cursor: 'pointer'
                        }}
                        onClick={() => handleOpenImagePreview(brand.image)}
                      />
                    ) : (
                      <Avatar sx={{ width: 80, height: 80 }}>
                        {brand.name.charAt(0)}
                      </Avatar>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" fontWeight="medium">
                      {brand.name}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <IconButton
                      color="primary"
                      onClick={() => navigate(`/updateBrand/${brand.id}`)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => setDeleteDialog({
                        open: true,
                        brandId: brand.id,
                        brandName: brand.name
                      })}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography variant="body1">لا توجد براندات متاحة</Typography>
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
          هل أنت متأكد من رغبتك في حذف "{deleteDialog.brandName}"؟
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

      {/* معاينة الصورة */}
      <Dialog
        open={imagePreview.open}
        onClose={() => setImagePreview({ ...imagePreview, open: false })}
        maxWidth="md"
      >
        <DialogTitle>معاينة صورة البراند</DialogTitle>
        <DialogContent>
          <Box
            component="img"
            src={imagePreview.imageUrl}
            alt="معاينة الصورة"
            sx={{
              width: '100%',
              height: 'auto',
              maxHeight: '70vh',
              objectFit: 'contain'
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'600\' height=\'400\' viewBox=\'0 0 600 400\'%3E%3Crect width=\'600\' height=\'400\' fill=\'%23eee\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' fill=\'%23000\' font-family=\'Arial\' font-size=\'24\' text-anchor=\'middle\' dominant-baseline=\'middle\'%3Eتعذر تحميل الصورة%3C/text%3E%3C/svg%3E';
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImagePreview({ ...imagePreview, open: false })}>
            إغلاق
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

export default BrandsList;