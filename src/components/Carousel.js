import React from 'react';
import Slider from 'react-slick';

const Carousel = ({ photos = [] }) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
    };

    if (!photos.length) {
        return null;
    }

    return (
        <Slider {...settings}>
            {photos.map((photo, i) => {
                return (
                    <div
                        key={i}
                        className="img-rez"
                        style={{
                            'backgroundImage': `url(${photo})`,
                        }}
                    />
                );
            })}
        </Slider>
    );
};

export default Carousel;
