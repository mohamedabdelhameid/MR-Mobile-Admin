import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import Header from "../components/Header";

const SlideBar = () => {
  const [images, setImages] = useState(JSON.parse(localStorage.getItem("sliderImages")) || []);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + images.length > 3) {
      alert("يمكنك رفع 3 صور فقط");
      return;
    }

    const newImages = files.map((file) => URL.createObjectURL(file));
    const updatedImages = [...images, ...newImages].slice(0, 3); // الاحتفاظ فقط بـ 3 صور

    setImages(updatedImages);
    localStorage.setItem("sliderImages", JSON.stringify(updatedImages));
  };

  return (
    <Box m="20px">
      <Header title="SlideBar" subtitle="Upload 3 images for the slider" />
      
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
        style={{ marginBottom: "10px" }}
      />

      <Box display="flex" gap="10px" mt="10px">
        {images.map((img, index) => (
          <img key={index} src={img} alt={`Slide ${index}`} width="100" height="80" />
        ))}
      </Box>

      <Button 
        variant="contained" 
        color="error" 
        onClick={() => {
          setImages([]);
          localStorage.removeItem("sliderImages");
        }}
        sx={{ mt: 2 }}
      >
        حذف الصور
      </Button>
    
    </Box>
  );
};

export default SlideBar;
