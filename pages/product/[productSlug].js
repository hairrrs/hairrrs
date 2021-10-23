import { useEffect } from "react";
import { useRouter } from "next/router";
import Image from 'next/image';
import HeadMetadata from "../../components/HeadMetadata";
import LayoutA from '../../components/layoutA'
import Nav from '../../components/nav'
import { getAllProducts, getProductBySlug } from "../../lib/api";
import style from '../../styles/pages/product.module.css'

export default function ProductPage({ product }) {
  const router = useRouter()
  const { productSlug } = router.query

  const DetailsStyle = { marginBottom: 5, fontSize: '1.1rem', fontWeight: 600 }

  if (product) {
    return (<>
      <HeadMetadata title={`${product?.title} - Hairrrs`} />

      <Nav />

      <LayoutA>
        <div className="flex justify-between" style={{ padding: '10px 15px' }}>
          <div>
            <div className="flex flex-wrap" style={{ gap: '.8rem' }}>
              <div>Home {`>`} Products {`>`} {product && product?.category}</div>
              <div>{productSlug && <>{`>`} <span style={{ color: '#eb004e' }}>{productSlug}</span></>}</div>
            </div>

            <div className={style.body}>
              <br />
              <div>
                <Carousel />
              </div>

              <br />
              <div className="flex flex-wrap items-center justify-between gap-1">
                <div className="flex items-center" style={{ gap: '.3rem' }}>
                  <Image src="/images/views.png" alt="" width="23px" height="14px" />
                  <div>23,052 Views</div>
                </div>

                <div className="flex flex-wrap items-center" style={{ gap: '1.3rem' }}>
                  <div className="flex items-center" style={{ gap: '.3rem', border: '1px solid #eb004e', borderRadius: 5, padding: '5px 10px' }}>
                    <Image src="/images/Sharebtn.png" alt="" width="18px" height="18px" />
                    <div>Share</div>
                  </div>
                  <div className="flex items-center" style={{ gap: '.3rem', border: '1px solid #eb004e', borderRadius: 5, padding: '5px 10px' }}>
                    <Image src="/images/savebtn.png" alt="" width="18px" height="18px" />
                    <div>Save</div>
                  </div>
                  <div className="flex items-center" style={{ gap: '.3rem', border: '1px solid #eb004e', borderRadius: 5, padding: '5px 10px' }}>
                    <Image src="/images/Icon material-flag.png" alt="" width="18px" height="14px" />
                    <div>Report this product</div>
                  </div>
                </div>
              </div>

              <br />
              <div className={style.detailsBody}>
                <div className="flex flex-wrap justify-between">
                  <div className={style.title}>{product?.title}</div>
                  <div className={style.price}>{product?.price}</div>
                </div>
                <br />
                <div><hr /></div>
                <br />

                {/* Details */}
                <div style={{ color: 'gray' }}>
                  <p style={DetailsStyle}>Details</p>
                  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure, eligendi excepturi quam labore incidunt asperiores? Ratione temporibus ad accusamus suscipit!</p>

                  <br />
                  <p style={DetailsStyle}>Posted</p>
                  <p>{product?.updatedAt}Jan. 24 2020 - 18:34</p>

                  <br />
                  <p style={DetailsStyle}>Category</p>
                  <p>{product?.category}</p>

                  <br />
                  <p style={DetailsStyle}>Type</p>
                  <p>Afro</p>

                  <br />
                  <p style={DetailsStyle}>Location</p>
                  <p>Lagos</p>

                  <br />
                  <p style={{ marginBottom: 5, fontSize: '1.1rem', fontWeight: 600 }}>Address</p>
                  <p>Lagos Island (Eko), Lagos State, Nigeria</p>
                </div>

                <br />
                <div className="flex flex-wrap justify-between sm-justify-center items-center gap-1">
                  <span className="flex justify-center items-center" style={{ color: '#eb004e', padding: '5px 10px', border: '1.5px solid #eb004e', fontSize: '.9rem', fontWeight: 600, borderRadius: 5 }}>Chat</span>
                  <span className="flex justify-center items-center" style={{ color: '#eb004e', padding: '5px 10px', border: '1.5px solid #eb004e', fontSize: '.9rem', fontWeight: 600, borderRadius: 5 }}>Request Call</span>
                </div>

                <br />
                <div className="flex justify-center">
                  <span className="flex justify-center items-center" style={{ color: '#eb004e', padding: '5px 10px', border: '1.5px solid #eb004e', fontSize: '.9rem', fontWeight: 600, borderRadius: 5 }}>Call +23481 0000 0000</span>
                </div>
              </div>

              <br />
              <div>
                <p>Related Products</p>
              </div>
            </div>
          </div>

          <div className="sm-hidden" style={{ marginTop: 20 }}><Seller /></div>
        </div>
      </LayoutA>
    </>)
  } else {
    return (<><h1>ERRROR 404: NOT FOUND!</h1></>)
  }
}

const Seller = () => {
  return (
    <div style={{ width: 250, padding: '20px 20px', boxShadow: 'rgb(0 0 0 / 20%) 0px 0px 4px 0px' }}>
      <div className="flex items-center justify-center" style={{ background: '#eb004e', color: 'white', padding: '10px 0', borderRadius: 5 }}>Posted by</div>

      <br />
      <div className="flex-column items-center" style={{ gap: '.8rem', background: '#f3f3f3', borderRadius: 5, padding: '25px 0' }}>
        <div style={{ width: 50, height: 50, background: '#eb004e', borderRadius: '50%', overflow: 'hidden' }}>
          {/* <Image src="/" */}
        </div>

        <div style={{ fontSize: '1rem', fontWeight: 650 }}>Hairrrs</div>

        <div className="flex" style={{ gap: '.6rem', fontSize: '.7rem' }}>
          <div className="button-outline">Message</div>
          <div className="button-solid">Follow</div>
          <div className="button-solid">2.4k</div>
        </div>
      </div>

      <br />
      <div className="flex justify-center" style={{ color: '#eb004e', padding: '8px 0', width: '100%', border: '1px solid #eb004e', fontSize: '.7rem', fontWeight: 600, borderRadius: 5, gap: '.4rem' }}>
        <Image src="/images/Icon material-flag.png" alt="" width="18px" height="14px" />
        <span>Report this business</span>
      </div>
    </div>
  )
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
      // setTimeout(showSlides, 5000); // Change image every 5 seconds
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
            // <img src={item.src} alt="" style={{ width: '100%', height: '250px' }} className="carousel_img" />
          }
          <Image src={item.src} alt="" width="800px" height="250px" className="carousel_img" />
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

export async function getStaticProps({ params }) {
  const { productSlug } = params
  const product = await getProductBySlug(productSlug).then(res => res);
  // console.log(product)

  if (!!product?.length > 0) {
    return {
      props: {
        product: product[0]
      },
      revalidate: 1
    }
  } else {
    return {
      notFound: true
    }
  }
}

export async function getStaticPaths() {
  const products = await getAllProducts();
  return {
    paths:
      products?.data?.map(product => ({
        params: {
          productSlug: product?.slug,
        },
      })) || [],
    fallback: true,
  }
}