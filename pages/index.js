import styles from '../styles/pages/homePage.module.css'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Nav from '../components/nav';
import LayoutA from '../components/layoutA'
import TrendingArticles from '../components/trendingArticles'
import LatestJobVacancies from '../components/latestJobVacancies'
import { getProductsByCategory } from '../lib/api'

export default function HomePage() {
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
    <Nav />
    <LayoutA>
      {/* <div className={styles.carouselWrapper}>
          <Carousel />
          <div className="sm-hidden flex justify-center items-center" style={{ padding: '0 1rem'}}>
            {
              // eslint-disable-next-line @next/next/no-img-element
              <img src="/images/face_of_ohyanga.png" alt="" />
            }
          </div>
        </div> */}
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 col-md-7 col-lg-8">
            <div id="carouselExampleDark" className="carousel carousel-dark slide" data-bs-ride="carousel">
              <div className="carousel-indicators">
                <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="1" aria-label="Slide 2"></button>
                <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="2" aria-label="Slide 3"></button>
              </div>
              <div className="carousel-inner">
                <div className="carousel-item active" data-bs-interval="1000">
                  {
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src="/images/img-01.png" className="d-block w-100" alt="..." />
                  }
                  <div className="carousel-caption d-none d-md-block">
                    <h5>First slide label</h5>
                    <p>Some representative placeholder content for the first slide.</p>
                  </div>
                </div>
                <div className="carousel-item" data-bs-interval="1000">
                  {
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src="/images/nutless braid.png" className="d-block w-100" alt="..." />
                  }
                  <div className="carousel-caption d-none d-md-block">
                    <h5>Second slide label</h5>
                    <p>Some representative placeholder content for the second slide.</p>
                  </div>
                </div>
                <div className="carousel-item" data-bs-interval="1000">
                  {
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src="/images/signin img.png" className="d-block w-100" alt="..." />
                  }
                  <div className="carousel-caption d-none d-md-block">
                    <h5>Third slide label</h5>
                    <p>Some representative placeholder content for the third slide.</p>
                  </div>
                </div>
              </div>
              <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </div>
          <div className="col-12 col-md-5 col-lg-4 flex justify-center items-center my-5 my-md-0" style={{ padding: '0 1rem'}}>
            {
              // eslint-disable-next-line @next/next/no-img-element
              <img src="/images/face_of_ohyanga.png" alt="" width="200px" />
            }
          </div>
        </div>
      </div>

      <div className="sm-hidden flex justify-between items-center" style={{ paddingTop: 15 }}>
        {catgBox.map((item, index) => (
          <div key={index} className="homeComponent-catg_box">
            <Image src={item.src} alt="" width="143px" height="164px" />
            <div className="homeComponent-catg_box_text">{item.caption}</div>
          </div>
        ))}
      </div>

      {/* PRODUCTS BY FEATURED_CATG */}
      {featuredCatg?.map((category, index) => {
        return <ProductCard key={index} category={category?.name} />
      })}

      <br />
      <TrendingArticles docLimit={3} />

      <br />
      <LatestJobVacancies />
    </LayoutA>
  </>)
}



const ProductCard = ({ category }) => {
  // const [products, setProducts] = useState([])
  const [products, setProducts] = useState([

  ])

  useEffect(() => {
    const fetch = async () => {
      const res = await getProductsByCategory(category, 6);
      const serialized = res?.data ? res?.data : null
      serialized && setProducts(serialized)
    }
    return fetch()
  }, [category])

  if (!!products.length > 0) {
    return (
      <div className="featuredCatg_wig" style={{ marginBottom: '1.5rem' }}>
        <div className="featuredCatg_wig-header" style={{
          // background: '#dcdcdc', 
          marginTop: 15,
          color: '#eb004e',
          fontSize: '1.2rem',
          fontWeight: 650,
          padding: '5px 15px'
        }}>{category}</div>
        <br />
        <div className="flex flex-wrap gap-1 homeComponent-featuredCatg_wig-body">

          {/* <ProductCard /> */}
          {products?.map(product => {
            return (
              <div key={product?.slug} className="flex" style={{ borderBottom: '1px solid #eb004e' }}>
                <Link href={`/product/${product?.slug}`}><a className={`flex justify-center items-center ${styles.productCard_a_container}`}>
                  {product?.mainImage && <Image src={`/images/${product?.mainImage}`} alt={product?.title} width="100px" height="120px" />}
                </a></Link>

                <div style={{ width: '140px', height: '120px', background: '#dcdcdc', padding: '5px', justifyContent: 'space-around' }} className="flex-column">
                  <div>
                    <div>
                      <Link href={`/product/${product?.slug}`}><a style={{ fontSize: '.9rem', color: '#494949' }}>{product?.title}</a></Link>
                    </div>
                    <div><strong>{product?.price}</strong></div>
                  </div>
                  <div>
                    <Link href={`/product/${product?.slug}`}><a style={{ padding: '3px 6px', background: '#eb004e', color: 'white', borderRadius: '1px' }}>
                      check <i className="fa fa-caret-right"></i></a></Link>
                  </div>
                </div>
              </div>
            )
          })}
          {/* <ProductCard /> */}

        </div>
        <br />
        <Link href={`/products/${category}`}><a><span style={{ color: '#eb004e', marginLeft: 10 }}>see more</span></a></Link>
      </div>
    )
  } else { return (<></>) }
}




// const Carousel = () => {
//   var slideIndex = 1;
//   // Next/previous controls
//   function plusSlides(n) {
//     changeShowSlides(slideIndex += n);
//   }

//   // Thumbnail image controls
//   function currentSlide(n) {
//     changeShowSlides(slideIndex = n);
//   }

//   function changeShowSlides(n) {
//     var i;
//     var slides = document.getElementsByClassName("mySlides");
//     var dots = document.getElementsByClassName("carousel_dot");
//     if (n > slides.length) { slideIndex = 1 }
//     if (n < 1) { slideIndex = slides.length }
//     for (i = 0; i < slides.length; i++) {
//       if (slides[i]) {
//         slides[i].style.display = "none";
//       }
//     }
//     for (i = 0; i < dots.length; i++) {
//       if (dots[i]) {
//         dots[i].className = dots[i].className.replace(" carousel_active", "");
//       }
//     }
//     if (slides[slideIndex - 1]) {
//       slides[slideIndex - 1].style.display = "block";
//     }
//     if (dots[slideIndex - 1]) {
//       dots[slideIndex - 1].className += " carousel_active";
//     }
//   }

//   useEffect(() => {
//     showSlides(slideIndex);
//     function showSlides() {
//       var i;
//       var slides = document.getElementsByClassName("mySlides");
//       var dots = document.getElementsByClassName("carousel_dot");
//       for (i = 0; i < slides.length; i++) {
//         if (slides[i]) {
//           slides[i].style.display = "none";
//         }
//       }
//       slideIndex++;
//       if (slideIndex > slides.length) { slideIndex = 1 }

//       for (i = 0; i < dots.length; i++) {
//         if (dots[i]) {
//           dots[i].className = dots[i].className.replace(" carousel_active", "");
//         }
//       }
//       if (slides[slideIndex - 1]) {
//         slides[slideIndex - 1].style.display = "block";
//       }
//       if (dots[slideIndex - 1]) {
//         dots[slideIndex - 1].className += " carousel_active";
//       }
//       setTimeout(showSlides, 5000);
//     }
//   }, [slideIndex])

//   const images = [
//     { src: '/images/img-01.png' },
//     { src: '/images/nutless braid.png' },
//     { src: '/images/signin img.png' }
//   ]

//   return (<div>
//     <div className="slideshow-container">
//       {images.map((item, index) => (
//         <div key={index + 1} className="mySlides fade">
//           {/* <div className="carousel_numbertext">{index+1} / {images.length}</div> */}

//           {// eslint-disable-next-line @next/next/no-img-element
//             <img src={item.src} alt="" width="100%" className="carousel_img" />
//           }

//           {/* <div className="carousel_text">Caption Text</div> */}
//         </div>
//       ))}

//       {/* Next and previous buttons */}
//       <i style={{ cursor: 'pointer' }} className="carousel_prev" onClick={() => { plusSlides(-1) }}>&#10094;</i>
//       <i style={{ cursor: 'pointer' }} className="carousel_next" onClick={() => { plusSlides(1) }}>&#10095;</i>
//     </div>

//     <div style={{ textAlign: 'center', background: '#eb004e', paddingTop: 10 }}>
//       {images.map((item, index) => (
//         <span key={index} className="carousel_dot" onClick={() => { currentSlide(index + 1) }}></span>
//       ))}
//     </div>
//   </div>)
// }