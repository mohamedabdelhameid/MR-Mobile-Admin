import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import img from '../notFound.png';
import Logo from '../mobileLogo.svg';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div dir="ltr">
      {/* <img src={Logo} alt="" width='100px' /> */}
      <Box className="notFound" display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="80vh" textAlign="center" dir="rtl">
        <img src={img} alt="" style={{padding: '20px',position: 'relative',left: '10px'}}/>
        <Typography variant="h5" mb={2}>
          الصفحة غير موجودة
        </Typography>
        <Typography variant="body1" color="textSecondary" mb={3} maxWidth="400px">
          يبدو أنك وصلت إلى صفحة غير صحيحة. تأكد من العنوان أو عد إلى الصفحة الرئيسية.
        </Typography>
        <Button variant="contained" color="primary" size="large" style={{width:'fit-content'}} onClick={() => navigate("/")}>العودة إلى الصفحة الرئيسية</Button>
      </Box>
    </div>
  );
};

export default NotFound;
