import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from 'next/link';
import Image from 'next/image';
import HeadMetadata from "../../components/HeadMetadata";
import LayoutA from '../../components/layoutA'
import Nav from '../../components/nav'
import UserProfile from "../../lib/UserProfile/UserProfile";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import PostedBy from '../../components/PostedBy';
import WebShareApi from "../../components/WebShareApi";
import { getDesc, loading } from "../../lib/myFunctions";
import { hasSavedAPI, saveItem, Unsave } from '../../lib/api';
import styles from '../../styles/pages/product.module.css'

export default function JobPage() {
  const router = useRouter()
  const { jobSlug } = router.query

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

  const [job, setJob] = useState([]);
  useEffect(() => {
    if (jobSlug) {
      const jobRef = doc(db, 'jobs', jobSlug);
      onSnapshot(jobRef, doc => {
        doc.exists && setJob({ ...doc.data(), jobId: doc.id })
      })
    }
  }, [jobSlug])

  const [hasSaved, setHasSaved] = useState(false)
  useEffect(() => {
    const fetch = () => {
      if (job) {
        let res = hasSavedAPI(user?.savedList, job?.jobId)
        setHasSaved(res)
      }
    }
    return fetch()
  }, [job, user])

  return (<>
    <HeadMetadata title={`${job?.title} - Hairrrs`} ogImage={job?.mainImage} />

    <Nav />

    <LayoutA>
      <div className="flex justify-between">
        <div>
          <div style={{ padding: '2%' }}>
            <div>Home {`>`} Job vacancies {job && job?.title && <>{`>`} <span style={{ color: '#eb004e' }}>{job?.title}</span></>}</div>
          </div>

          <div style={{ padding: '0 20px' }}>
            <div>
              <Carousel />
            </div>

            <div style={{ padding: '5px 35px' }}>
              {/* share.... */}
              <div className="flex flex-wrap" style={{ gap: '1.3rem', margin: '30px 0' }}>
                {user?.uid !== job?.lister?.uid && <Link href={`/apply?jobTitle=${job?.title}&jobId=${job?.jobId}&l=${job?.lister?.uid}`}><a className={`flex items-center ${styles.style_share}`}>
                  <Image src="/images/Icon material-flag.png" alt="" width="18px" height="14px" />
                  <div>Apply</div>
                </a></Link>}
                {hasSaved ?
                  <div
                    onClick={async () => {
                      loading('open');
                      let res = await Unsave(user, job?.jobId)
                      res === 'success' && setHasSaved(false);
                      loading('close');
                    }}
                    className="flex items-center"
                    style={{ gap: '.5rem', cursor: 'pointer', padding: '5px 10px', borderRadius: 5, background: '#eb004e', color: 'white' }}>
                    <Image src="/images/savebtn.png" alt="save" width="20px" height="20px" />
                    <div>Unsave</div>
                  </div> :
                  <div
                    onClick={async () => {
                      loading('open');
                      let res = await saveItem(user, job?.jobId, job?.mainImage, getDesc(job?.description, 60), `/job/${job?.slug}`, 'job');
                      res === 'success' && setHasSaved(true);
                      loading('close');
                    }}
                    className="flex items-center"
                    style={{ gap: '.5rem', cursor: 'pointer', padding: '5px 10px', borderRadius: 5, background: '#d0d0d0' }}>
                    <Image src="/images/savebtn.png" alt="save" width="20px" height="20px" />
                    <div>Save</div>
                  </div>
                }
                <Link href={`/?report_modal=true&itemId=${job?.jobId}`}><a className={`flex items-center ${styles.style_share}`}>
                  <Image src="/images/Icon material-flag.png" alt="" width="18px" height="14px" />
                  <div>Report</div>
                </a></Link>
                <WebShareApi
                  url={`https://hairrrs.vercel.app/job/${job?.slug}`}
                  title={job?.title}
                  text={getDesc(job?.description, 60)} />
              </div>

              {/* body */}
              <div style={{ padding: '15px' }}>
                <div><strong>How to Apply</strong></div>
                <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil at minus voluptatem quam, nemo fugiat porro, deserunt, ea optio alias non eius. Nemo, ipsa dolores...<span style={{ cursor: 'pointer', color: '#eb004e' }}>read more</span></div>
              </div>

              <div style={{ padding: '5px' }}>
                <div className="flex flex-wrap justify-between" style={{ padding: '15px' }}>
                  <div><strong>{job?.title}</strong></div>
                  <div><strong style={{ fontSize: '.9rem', fontWeight: 700, color: '#eb004e' }}>{job?.price}</strong></div>
                </div>

                <div style={{ width: '100%', height: '1px', background: 'black' }}></div>

                <br />
                <div>Details</div>
                <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda laborum vel placeat, ipsam facilis impedit accusamus numquam? Asperiores sit laborum odio. Vitae nostrum sunt recusandae illo consequuntur iste. Rem, natus?</div>

                <br />
                <div>Posted</div>
                <div><strong>{job?.updatedAt}</strong></div>

                <br />
                <div>Salary plan</div>
                <div><strong>{job?.salaryPlan}</strong></div>

                <br />
                <div>Type</div>
                <div><strong>{job?.type}</strong></div>

                <br />
                <div>Location</div>
                <div><strong>{job?.location}</strong></div>

                <br />
                <div>Address</div>
                <div><strong>{job?.address}</strong></div>

              </div>
            </div>

            <br />
            <div style={{ padding: '5px 35px', background: '#f1f1f1', color: '#eb004e', fontWeight: 600 }}>
              <p>Trending jobs</p>
            </div>
          </div>
        </div>

        {job?.lister && <div className="sm-hidden" style={{ marginTop: 20 }}>
          <PostedBy initialOwner={job?.lister} user={user} />
        </div>}
      </div>
    </LayoutA>
  </>)
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