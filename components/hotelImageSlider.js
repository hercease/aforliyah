import Slider from "react-slick";
import Image from "next/image";
import React, {  useEffect, useState, useRef, useMemo, Suspense, useCallback } from 'react';

const HotelImageSlider = ({ hoteldetails }) => {
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const [currentSlide, setCurrentSlide] = useState(0);

  const slider1 = useRef(null);
   const slider2 = useRef(null);

        useEffect(() => {
            setNav2(nav1);
        }, [nav1]);

      const settingsMain = {
        asNavFor: nav2,
        //arrows: true,
        autoplay: true,
        onReInit: () => setCurrentSlide(nav1?.innerSlider.state.currentSlide),
      };
    
      const settingsThumbs = {
        asNavFor: nav1,
        slidesToShow: 6,
        swipeToSlide: true,
        focusOnSelect: true,
        swipeToSlide:true
      };
    

  const handleImageError = (index) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <>
      {/* Main Slider */}
      <Slider {...settingsMain} asNavFor={nav2} ref={(slider) => setNav1(slider)}>
        {hoteldetails?.Hotels?.[0]?.HotelImages?.length > 0 &&
          hoteldetails.Hotels[0].HotelImages.map((src, index) => (
            <div key={index}>
              <Image
                src={imageErrors[index] ? "/assets/imgs/hotelimage.gif" : src}
                width={300}
                height={300}
                quality={100}
                priority
                alt={`Slide ${index}`}
                style={{ width: "100%" }}
                onError={() => handleImageError(index)}
              />
            </div>
          ))}
      </Slider>

      {/* Thumbnail Slider */}
      <Slider {...settingsThumbs} asNavFor={nav1}>
        {hoteldetails?.Hotels?.[0]?.HotelImages?.length > 0 &&
          hoteldetails.Hotels[0].HotelImages.map((src, index) => (
            <div onClick={() => nav1?.slickGoTo(index)} key={index}>
              <Image
                src={imageErrors[index] ? "/assets/imgs/hotelimage.gif" : src}
                width={100}
                height={100}
                quality={100}
                priority
                alt={`Thumbnail ${index}`}
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                }}
                onError={() => handleImageError(index)}
              />
            </div>
          ))}
      </Slider>
    </>
  );
};

export default HotelImageSlider;
