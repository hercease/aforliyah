import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const CustomImage = ({ src, alt, fallbackSrc, ...props }) => {
    const [imageSrc, setImageSrc] = useState(fallbackSrc);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const response = await fetch(src);
                if (!response.ok) throw new Error('Image fetch failed');

                const blob = await response.blob();
                const imageURL = URL.createObjectURL(blob);
                setImageSrc(imageURL);
            } catch (error) {
                console.error('Error fetching image:', error);
                setImageSrc(fallbackSrc);
            } finally {
                setIsLoading(false);
            }
        };

        fetchImage();
    }, [src, fallbackSrc]);

    return (
        <>
            {isLoading && <div className="skeleton-loader">Loading...</div>}
            <Image
                src={imageSrc}
                alt={alt}
                layout="intrinsic"
                loading="lazy"
                {...props}
            />
        </>
    );
};

export default CustomImage;
