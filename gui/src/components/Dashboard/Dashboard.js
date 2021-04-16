import React, { useState, useEffect, useRef } from 'react'
import { Link } from "react-router-dom";

import circus from "./selection/circus-transparent.png";
import book from "./selection/book-transparent.png";
import wheel from "./selection/setting-transparent.png";
import profile from "./selection/profile-transparent.png";
import match from "./selection/match-transparent.png";

import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import Slider from "react-slick";

import "./Dashboard.css";

import { Typography } from '@material-ui/core';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Referenced and Learned from https://github.com/chrisdesilva/3d-slider

function Dashboard() {

    const _isMounted = useRef(true); // Initial value _isMounted = true

    useEffect(() => {
      return () => { // ComponentWillUnmount in Class Component
          _isMounted.current = false;
      }
    }, []);

    const [currentIndex, setIndex] = useState(0);

    function handleChange(current) {
        console.log(current);
        setIndex(current);
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
            id: 'games-tag',
            children: <Link to='/games'>
                <img src={circus} width={'300px'} height={'300px'} className="unselected-item" />
            </Link>
        },
        {
            id: 'quizzes-tag',
            children: <Link to='/quizzes'>
                <img src={book} width={'300px'} height={'300px'} className="unselected-item" />
                </Link>
        },
        {
            id: 'setting-tag',
            children: <Link to='/setting'>
                <img src={wheel} width={'300px'} height={'300px'} className="unselected-item" /></Link>
        },
        {
            id: 'profile-tag',
            children: <Link to='/profile'>
                <img src={profile} width={'300px'} height={'300px'} className="unselected-item"  /></Link>
        },
        {
            id: 'match-tag',
            children: <Link to='/match'>
                <img src={match} width={'300px'} height={'300px'} className="unselected-item" /></Link>
        }
    ];

    return (
        <div className="dashboard-container">
            <br />
            <Typography variant="h1" className="signup-title">Dashboard</Typography>
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

export default Dashboard