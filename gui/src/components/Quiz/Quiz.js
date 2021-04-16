import React, { useState, useEffect, useRef } from 'react'
import { Link } from "react-router-dom";

import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import Slider from "react-slick";

import SurveyCard from './SurveyCard.js';

import food from './QuizPhoto/food.jpg';
import star from './QuizPhoto/star.jpg';
import personality from './QuizPhoto/personality.jpg';
import question from './QuizPhoto/question.jpg';

import { Typography } from '@material-ui/core';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import './Quiz.css';

// Referenced and Learned from https://github.com/chrisdesilva/3d-slider

function Quiz() {

    const _isMounted = useRef(true); // Initial value _isMounted = true

    useEffect(() => {
      return () => { // ComponentWillUnmount in Class Component
          _isMounted.current = false;
      }
    }, []);

    const [currentIndex, setIndex] = useState(1);

    function handleChange(current) {
        console.log(current);
        setIndex(current);
    }

    function showQuizPurpose() {
        console.log('purpuse');
    }

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        swipeToSlide: true,
        centerMode: true,
        centerPadding: 0,
        afterChange: handleChange,
        adaptiveHeight: true,
        initialSlide: currentIndex
    };

    const sliderItems = [
        {
            id: 'food',
            children: <Link to='/quizzes/food' className='survey-slicker-item'>
                <SurveyCard imageLink={food} title="Food Survey"
                body="Explore the culinary boundaries of your relationship with food 
                in our 'creative' survey right here!" />
            </Link>
        },
        {
            id: 'horoscope',
            children: <Link to='/quizzes/horoscope' className='survey-slicker-item'>
                <SurveyCard imageLink={star} title="Horoscope Survey"
                body="Tell us what your Horoscope is!" />
            </Link>
        },
        {
            id: 'mbti',
            children: <Link to='/quizzes/mbti' className='survey-slicker-item'>
                <SurveyCard imageLink={personality} title="MBTI Survey 'Simplified'"
                body="Ever wanted to try a simplified personality quiz, here's your
                chance!" />
            </Link>
        },
        {
            id: 'about-quiz',
            children: <div className='survey-slicker-item' onClick={showQuizPurpose}>
                <SurveyCard imageLink={question} title="About Quizzes"
                body="Learn More on the purposes of these surveys and how they are used here" />
            </div>
        }
    ];

    return (
        <div className="quiz-container">
            <br />   
            <Typography variant="h1" className="signup-title">Quizzes</Typography>
        <Slider {...settings}>
            {sliderItems.map((item, index) => {
                return(<div key={item.id}>
                    <div className={ index===currentIndex ? "selected-item" : "unselected-item"}>
                    {item.children}
                    </div>
                </div>);
            })}
        </Slider>
      </div>
    )
}

export default Quiz