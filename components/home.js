import React, { useEffect } from 'react'
import Image from 'next/image'
import TrendingArticles from './trendingArticles'
import LatestJobVacancies from './latestJobVacancies'

function Home() {
    const featuredCatg = [
        { name: 'Wig' },
        { name: 'Weavon' },
        { name: 'Gadgets' },
        { name: 'Extras' }
    ]
    const catgBox = [
        { src: '/images/product-img.png', caption: 'Products' },
        { src: '/images/business-img.png', caption: 'Businesses' },
        { src: '/images/job-vacancy-img.png', caption: 'Job vacancies' },
        { src: '/images/article-img.png', caption: 'Articles' }
    ]


    return (<>
        <div className="" style={{ background: 'white', padding: '15px', paddingTop: 0 }}>
            <div className="flex">
                <div className="" style={{ width: '100%' }}><Carousel /></div>
                <div className="sm-hidden flex justify-center items-center" style={{ width: '50%' }}>
                    <Image src="/images/face_of_ohyanga.png" alt="" width="100px" height="50px" />
                </div>
            </div>
            <div className="flex justify-between items-center" style={{ padding: '15px 0' }}>
                {catgBox.map((item, index) => (
                    <div key={index} className="homeComponent-catg_box">
                        <Image src={item.src} alt="" width="143px" height="164px" />
                        <div className="homeComponent-catg_box_text">{item.caption}</div>
                    </div>
                ))}
            </div>
        </div>

        {featuredCatg.map((item, index) => (
            <div key={index} className="featuredCatg_wig" style={{ marginBottom: '1.5rem' }}>
                <div className="featuredCatg_wig-header" style={{ background: '#dcdcdc', color: '#eb004e', fontSize: '1.2rem', fontWeight: 650, padding: '5px 15px' }}>{item.name}</div>
                <br />
                <div className="flex flex-wrap gap-1 homeComponent-featuredCatg_wig-body">
                    <ProductCard category={item.name} />
                </div>
                <br />
                <span style={{ color: 'red' }}>see more</span>
            </div>
        ))}
        <br />
        <TrendingArticles />

        <br />
        <LatestJobVacancies />
    </>)
}

const Carousel = () => {
    var slideIndex = 1;
    // Next/previous controls
    function plusSlides(n) {
        changeShowSlides(slideIndex += n);
    }

    // Thumbnail image controls
    function currentSlide(n) {
        changeShowSlides(slideIndex = n);
    }

    function changeShowSlides(n) {
        var i;
        var slides = document.getElementsByClassName("mySlides");
        var dots = document.getElementsByClassName("carousel_dot");
        if (n > slides.length) { slideIndex = 1 }
        if (n < 1) { slideIndex = slides.length }
        for (i = 0; i < slides.length; i++) {
            if (slides[i]) {
                slides[i].style.display = "none";
            }
        }
        for (i = 0; i < dots.length; i++) {
            if (dots[i]) {
                dots[i].className = dots[i].className.replace(" carousel_active", "");
            }
        }
        if (slides[slideIndex - 1]) {
            slides[slideIndex - 1].style.display = "block";
        }
        if (dots[slideIndex - 1]) {
            dots[slideIndex - 1].className += " carousel_active";
        }
    }

    useEffect(() => {
        showSlides(slideIndex);
        function showSlides() {
            var i;
            var slides = document.getElementsByClassName("mySlides");
            var dots = document.getElementsByClassName("carousel_dot");
            for (i = 0; i < slides.length; i++) {
                if (slides[i]) {
                    slides[i].style.display = "none";
                }
            }
            slideIndex++;
            if (slideIndex > slides.length) { slideIndex = 1 }

            for (i = 0; i < dots.length; i++) {
                if (dots[i]) {
                    dots[i].className = dots[i].className.replace(" carousel_active", "");
                }
            }
            if (slides[slideIndex - 1]) {
                slides[slideIndex - 1].style.display = "block";
            }
            if (dots[slideIndex - 1]) {
                dots[slideIndex - 1].className += " carousel_active";
            }
            setTimeout(showSlides, 5000); // Change image every 5 seconds
        }
    }, [slideIndex])

    const images = [
        { src: '/images/img-01.png' },
        { src: '/images/nutless braid.png' },
        { src: '/images/signin img.png' }
    ]

    return (<>
        <div className="slideshow-container">
            {images.map((item, index) => (
                <div key={index + 1} className="mySlides fade">
                    {/* <div className="carousel_numbertext">{index+1} / {images.length}</div> */}
                    {// eslint-disable-next-line @next/next/no-img-element
                        <img src={item.src} alt="" style={{ width: '100%', height: '250px' }} className="carousel_img" />
                    }
                    {/* <div className="carousel_text">Caption Text</div> */}
                </div>
            ))}

            {/* Next and previous buttons */}
            <i style={{ cursor: 'pointer' }} className="carousel_prev" onClick={() => { plusSlides(-1) }}>&#10094;</i>
            <i style={{ cursor: 'pointer' }} className="carousel_next" onClick={() => { plusSlides(1) }}>&#10095;</i>
        </div>

        <div style={{ textAlign: 'center', background: '#eb004e', paddingTop: 10 }}>
            {images.map((item, index) => (
                <span key={index} className="carousel_dot" onClick={() => { currentSlide(index + 1) }}></span>
            ))}
        </div>
    </>)
}

const ProductCard = ({ category }) => {

    return (
        <div className="flex">
            <div style={{ width: '100px', height: '120px', background: '#eb004e' }}></div>
            <div style={{ width: '140px', height: '120px', background: '#dcdcdc', padding: '5px', justifyContent: 'space-around' }} className="flex-column">
                <div>
                    <div style={{ fontSize: '.9rem', color: '#494949' }}>Title of the item will be placed here</div>
                    <div><strong>N45,000</strong></div>
                </div>
                <div><span style={{ padding: '3px 6px', background: '#eb004e', color: 'white', borderRadius: '1px' }}>check <i className="fa fa-caret-right"></i></span></div>
            </div>
        </div>
    )
}

export default Home
