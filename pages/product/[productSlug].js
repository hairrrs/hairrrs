import { useEffect, useState } from "react";
import Link from 'next/link';
import Image from 'next/image';
import HeadMetadata from "../../components/HeadMetadata";
import LayoutA from '../../components/layoutA'
import Nav from '../../components/nav'
import {
  getAllProducts, getProductBySlug, hasSavedAPI, saveItem, Unsave, updatePageViewAPI,
  updateLocalUser, requestcall, deleteRequestcall, hasRequestedCallAPI, followAPI, unFollowAPI
} from "../../lib/api";
import { getDesc, loading } from "../../lib/myFunctions";
import style from '../../styles/pages/product.module.css'
import UserProfile from "../../lib/UserProfile/UserProfile";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import WebShareApi from "../../components/WebShareApi";
import PostedBy from '../../components/PostedBy';

export default function ProductPage({ product }) {
  const createProduct = {
    title: '',
    slug: '',
    price: '',
    description: '',
    type: '',
    location: '',
    address: '',
    phone: 0,
    requestedCall: [], // [{ name: '', date: new Date(), phone: 0 }]
    createdAt: new Date(),
    updatedAt: new Date(),
    totalView: 0,
    // totalShared: 0,
    reported: false,
    category: '',
    mainImage: null,
    images: [],
    seller: [{ displayName: '', uid: '', photoURL: '' }]
  }
  const [user, setUser] = useState(UserProfile.getUser())
  // console.log(user)
  useEffect(() => {
    onAuthStateChanged(auth, authUser => {
      if (authUser?.uid) {
        const userRef = doc(db, 'users', authUser?.uid);
        onSnapshot(userRef, doc => {
          doc.exists && setUser({ ...doc.data(), uid: doc.id });
        });
      }
    })
  }, [])

  const [hasSavedItem, setHasSavedItem] = useState(false);
  useEffect(() => {
    const fetch = async () => {
      if (user && product) {
        let res = hasSavedAPI(user?.savedList, product?.id)
        if (res === true) {
          setHasSavedItem(true)
        } else {
          setHasSavedItem(false)
        }
      }
    }
    return fetch()
  }, [product, user])

  const DetailsStyle = { marginBottom: 5, fontSize: '1.1rem', fontWeight: 600 };

  // set page viewed
  useEffect(() => {
    async function setPageView() {
      const productId = product?.productId
      var totalPageView = document.querySelector('#totalPageViewSection');
      var pageUrl = window.location.href;
      var isPageStored = await JSON.parse(localStorage.getItem(pageUrl));
      let UpdatedViewCount = parseInt(totalPageView?.textContent) + 1

      if (
        isPageStored === null
        && totalPageView?.textContent
        && productId
        && pageUrl
      ) {
        localStorage.setItem(pageUrl, JSON.stringify(pageUrl));
        document.querySelector('#totalPageViewSection').textContent = UpdatedViewCount
        updatePageViewAPI(productId)
        if (user && product) {
          updateUserPageViewed(pageUrl, product?.title);
        }
      }
    }

    const isAuthor = (a, b) => a === b ? true : false;
    const unsub = async () => {
      if (product) {
        if (user) {
          let sellerId = product?.seller?.uid
          let cUserId = user?.uid

          if (sellerId && cUserId) {
            if (!isAuthor(sellerId, cUserId)) {
              setPageView()
              return;
            }
          }
        } else {
          setPageView();
          return;
        }
      }
    }

    return unsub()
  }, [product, user])
  // localStorage.removeItem(window.location.href)

  const [hasRequestedCall, setHasRequestedCall] = useState(false);
  useEffect(() => {
    const fetch = async () => {
      if (user && product) {
        let res = await hasRequestedCallAPI(user?.uid, product?.productId);
        setHasRequestedCall(res)
      }
    }
    return fetch()
  }, [user, product])

  if (product) {
    return (<>
      <HeadMetadata title={`${product?.title} - Hairrrs`} ogImage={product?.mainImage} />

      <Nav />

      <LayoutA>
        <div className="flex justify-between" style={{ padding: '10px 15px' }}>
          <div>
            <div className="flex flex-wrap" style={{ gap: '.8rem' }}>
              <div>Home {`>`} Products {`>`} {product && product?.category}</div>
              <div>{product && <>{`>`} <span style={{ color: '#eb004e' }}>{product?.title}</span></>}</div>
            </div>

            <div className={style.body}>
              <br />
              <div>
                <Carousel />
              </div>

              <br />
              <br />
              <div className="flex flex-wrap items-center justify-between gap-1">
                <div className="flex items-center" style={{ gap: '.3rem' }}>
                  <Image src="/images/views.png" alt="" width="23px" height="14px" />
                  <div><span id="totalPageViewSection">{product?.totalView}</span> Views</div>
                </div>

                {/* share... */}
                <div className="flex flex-wrap items-center" style={{ gap: '1.3rem' }}>
                  {/* <div className={`flex items-center ${style.style_share}`}>
                    <Image src="/images/Sharebtn.png" alt="" width="18px" height="18px" />
                    <div>Share</div>
                  </div> */}
                  <WebShareApi url={`https://hairrrs.vercel.app/product/${product?.slug}`} title={product?.title} text={getDesc(product?.description, 60)} />
                  {!hasSavedItem ?
                    <div className={`flex items-center ${style.style_share}`} onClick={async () => {
                      loading('open')
                      let res = await saveItem(user, product?.productId, '', product?.title, `/product/${product?.slug}`, 'product')
                      let a = await updateLocalUser();
                      setUser(a);
                      res !== 'success' && alert(res);
                      res === 'success' && setHasSavedItem(true);
                      loading('close')
                    }}>
                      <Image src="/images/savebtn.png" alt="" width="18px" height="18px" />
                      <div>Save</div>
                    </div> :
                    <div className={`flex items-center ${style.style_share}`} style={{ background: '#eb004e', color: 'white' }} onClick={async () => {
                      loading('open')
                      let res = await Unsave(user, product?.productId)
                      let a = await updateLocalUser();
                      setUser(a);
                      res !== 'success' && alert(res);
                      res === 'success' && setHasSavedItem(false);
                      loading('close')
                    }}>
                      <Image src="/images/savebtn.png" alt="" width="18px" height="18px" />
                      <div>Unsave{hasSavedItem}</div>
                    </div>
                  }
                  <Link href={`/?report_modal=true&itemId=${product?.productId}`}><a className={`flex items-center ${style.style_share}`}>
                    <Image src="/images/Icon material-flag.png" alt="" width="18px" height="14px" />
                    <div>Report this product</div>
                  </a></Link>
                </div>
              </div>

              <br />
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
                  <p>{product?.description}</p>

                  <br />
                  <p style={DetailsStyle}>Posted</p>
                  <p>{product?.updatedAt}</p>

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
                  {hasRequestedCall ?
                    <span
                      onClick={async () => {
                        loading('open');
                        let res = await deleteRequestcall(product?.seller?.uid, product?.productId);
                        if (res === 'success') { setHasRequestedCall(false) };
                        loading('close');
                      }}
                      className="flex justify-center items-center"
                      style={{ color: '#eb004e', padding: '5px 10px', border: '1.5px solid #eb004e', fontSize: '.9rem', fontWeight: 600, borderRadius: 5, cursor: 'pointer' }}>Cancel request</span>
                    :
                    <span
                      onClick={async () => {
                        loading('open');
                        let res = await requestcall(product);
                        if (res === 'success') { setHasRequestedCall(true) };
                        if (res !== 'success') { alert(res) };
                        loading('close');
                      }}
                      className="flex justify-center items-center"
                      style={{ color: '#eb004e', padding: '5px 10px', border: '1.5px solid #eb004e', fontSize: '.9rem', fontWeight: 600, borderRadius: 5, cursor: 'pointer', position: 'relative' }}>
                      {product?.seller?.uid === user?.uid && <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(198, 198, 198, 0.1)', cursor: 'not-allowed' }}></div>}
                      Request Call</span>
                  }
                </div>

                <br />
                <div className="flex justify-center">
                  <Link href={`tel:${'+2348100000000'}`}><a className="flex justify-center items-center" style={{ color: '#eb004e', padding: '5px 10px', border: '1.5px solid #eb004e', fontSize: '.9rem', fontWeight: 600, borderRadius: 5 }}>Call +234 810 000 0000</a></Link>
                </div>
              </div>

              <br />
              <br />
              <div>
                <p>Related Products</p>
              </div>
            </div>
          </div>

          {product?.seller && <div className="sm-hidden" style={{ marginTop: 20 }}><PostedBy initialOwner={product?.seller} user={user} /></div>}
        </div>
      </LayoutA>
    </>)
  } else {
    return (<><h1>ERROR 404: NOT FOUND!</h1></>)
  }
}

const Carousel = () => {
  var slideIndex = 0;
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
      for (i = 0; i < slides?.length; i++) {
        if (slides[i]) {
          slides[i].style.display = "none";
        }
      }
      slideIndex++;
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (slideIndex > slides?.length) { slideIndex = 1 }

      for (i = 0; i < dots?.length; i++) {
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
          <Image src={item.src} alt="" width="800px" height="500px" className="carousel_img" />
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
        product: product[0],
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