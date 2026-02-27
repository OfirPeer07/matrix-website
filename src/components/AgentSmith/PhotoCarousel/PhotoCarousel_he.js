import React, { useState, useEffect, useRef } from 'react';
import './PhotoCarousel.css';
import '../../../styles/sections/Sections.css';

// Image imports
import Story1 from './Story1.png';
import Story2 from './Story2.png';

const images = [
    { src: Story1, name: '“משרת Entry-level עם 3 שנות ניסיון”' },
    { src: Story2, name: '\”תחרות  ג\'וניורים יוצאת לדרך”' },
];

const PHOTO_INTERVAL = 5000;
const PROGRESS_UPDATE_INTERVAL = 50;

const PhotoCarousel_he = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [progress, setProgress] = useState(0);
    const intervalRef = useRef(null);
    const progressRef = useRef(null);

    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        setProgress(0);
    };

    const play = () => setIsPlaying(true);
    const pause = () => setIsPlaying(false);

    const selectImage = (index) => {
        setCurrentIndex(index);
        setProgress(0);
    };

    useEffect(() => {
        if (isPlaying) {
            clearInterval(intervalRef.current);
            clearInterval(progressRef.current);
            intervalRef.current = setInterval(nextImage, PHOTO_INTERVAL);
            progressRef.current = setInterval(() => {
                setProgress((prev) => {
                    const progressIncrement = (100 / (PHOTO_INTERVAL / PROGRESS_UPDATE_INTERVAL));
                    return Math.min(prev + progressIncrement, 100);
                });
            }, PROGRESS_UPDATE_INTERVAL);
        } else {
            clearInterval(intervalRef.current);
            clearInterval(progressRef.current);
        }
        return () => {
            clearInterval(intervalRef.current);
            clearInterval(progressRef.current);
        };
    }, [isPlaying]);

    return (
        <div className="photo-carousel">
            <img src={images[currentIndex].src} alt={images[currentIndex].name} className="carousel-image" />
            <button className="control-button" onClick={isPlaying ? pause : play}>
                {isPlaying ? '❚❚' : '►'}
            </button>
            <div className="image-name">{images[currentIndex].name}</div>
            <div className="progress-bar-container">
                {images.map((_, index) => (
                    <div key={index} className={`progress-bar ${index === currentIndex ? 'active' : ''}`} onClick={() => selectImage(index)}>
                        <div className="progress-bar-background" style={{ width: index === currentIndex ? `${progress}%` : '0%' }} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PhotoCarousel_he;
