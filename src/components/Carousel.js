import React from 'react';
import ReactSiema from 'react-siema';

const Slide = (props) => <img {...props} alt="slide" />

const Carousel = ({ photos }) => {
    return (
        <ReactSiema>
            {photos.map((photo, i) => <Slide src={photo} key={i} />)}
        </ReactSiema>
    );
};

export default Carousel;
