import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/effect-fade";
import HomeData from '../../../data/home/swiper-data.json';
import Intro from '../../../components/intro/intro';

const IntroContainer = () => {
  return (
    <div className="intro-slider-wrap ml-0 mr-0">
      <Swiper
        loop={true}
        speed={750}
        spaceBetween={0}
        slidesPerView={1}
        effect="fade"
        pagination={{ clickable: true }}
        autoplay={{
          delay: 9000,
          disableOnInteraction: false,
        }}
        modules={[Pagination, Autoplay, EffectFade]}
        className="intro-slider"
      >
        {HomeData[0].slider &&
          HomeData[0].slider.map((single, key) => (
            <SwiperSlide key={key}>
              <Intro data={single} />
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
};

export default IntroContainer;
