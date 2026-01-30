// frontend/src/components/HomeSlider.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper";
const BASE_URL = import.meta.env.VITE_BASE_URL;


export default function HomeSlider() {
    const [slides, setSlides] = useState([]);


    useEffect(() => {
        axios.get(`${BASE_URL}/api/slider`)
            .then(res => setSlides(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 3000 }}
            loop={true}
            slidesPerView={1}
        >
            {slides.map(slide => (
                <SwiperSlide key={slide._id}>
                    <img src={`${BASE_URL}${slide.imageUrl}`} alt={slide.title} style={{ width: '100%' }} />
                </SwiperSlide>
            ))}
        </Swiper>
    );
}
