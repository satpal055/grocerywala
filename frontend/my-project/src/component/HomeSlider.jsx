// frontend/src/components/HomeSlider.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper";

export default function HomeSlider() {
    const [slides, setSlides] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:3000/api/slider")
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
                    <img src={`http://localhost:3000${slide.imageUrl}`} alt={slide.title} style={{ width: '100%' }} />
                </SwiperSlide>
            ))}
        </Swiper>
    );
}
