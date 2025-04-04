import { useEffect, useState } from "react";
import { Box } from "@mui/material";

const ShowSlider = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const storedImages = JSON.parse(localStorage.getItem("sliderImages")) || [];
    setImages(storedImages);
  }, []);

  return (
    <Box m="20px">
      <h2>Slider Preview</h2>

      {images.length > 0 ? (
        <div id="carouselExample" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">
            {images.map((img, index) => (
              <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                <img
                  src={img}
                  className="d-block w-100"
                  alt={`Slide ${index}`}
                  style={{
                    maxHeight: "500px", 
                    objectFit: "cover",
                  }}
                />
              </div>
            ))}
          </div>

          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
          </button>
        </div>
      ) : (
        <p>لم يتم رفع أي صور بعد.</p>
      )}
    </Box>
  );
};

export default ShowSlider;
