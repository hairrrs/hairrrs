import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/nav.module.css'

export default function Nav() {
  // const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      // setScrollY(window.scrollY);
      let nav = document.querySelector('nav');
      if (nav && window.scrollY > 100) {
        nav.classList.add("sticky")
      } else {
        nav.classList.remove("sticky")
      }
    };

    // just trigger this so that the initial state 
    // is updated as soon as the component is mounted
    // related: https://stackoverflow.com/a/63408216
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <nav className={`nav ${styles.nav}`}>

      <div className={styles.headerad}>
        {
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/images/headerad.gif" alt="" width="100%" height="100%" className={styles.headeradImg} />
        }
      </div>
      <div className={`${styles.mainNav} flex justify-between items-center`}>
        <div className={styles.navLogo}>
          <Link href="/"><a>
            {
              // eslint-disable-next-line @next/next/no-img-element
              <img src="/hairrrs-Logo-original.png" alt="logo" width="120" height="30" />
            }
          </a></Link>
        </div>
        <div className="sm-show" style={{ padding: '5px 10px', border: '1px solid #eb004e', borderRadius: 4, color: '#eb004e', cursor: 'pointer' }}>
          MENU
        </div>
        <div className={`sm-hidden flex justify-between items-center`}>
          <form className={`mx-3 flex items-center ${styles.navSearch}`}>
            <input type="search" name="search" id="search" placeholder="search" />
            <button type="submit" style={{ background: 'none', border: 'none', cursor: 'pointer' }}><i className="fa fa-search" style={{ color: '#eb004e' }}></i></button>
          </form>
          <div className="mx-3">
            {
              // eslint-disable-next-line @next/next/no-img-element
              <img src="/images/msg-header.svg" alt="" width="20px" height="20px" />
            }
          </div>
          <div className="mx-3">
            {
              // eslint-disable-next-line @next/next/no-img-element
              <img src="/images/notification-header.svg" alt="" width="20px" height="20px" />
            }
          </div>
          <div className="mx-3">
            {
              // eslint-disable-next-line @next/next/no-img-element
              <img src="/images/saved-header.svg" alt="" width="20px" height="20px" />
            }
          </div>

          <div className="mx-3"
            onClick={() => { document.querySelector('#startSelling').style.display = 'flex' }}
            style={{ padding: '7px 23px', background: '#eb004e', color: 'white', borderRadius: '5px', cursor: 'pointer' }}>start selling</div>
        </div>
      </div>


      <div className={`flex justify-around mt-3 ${styles.topMenu}`} style={{ fontWeight: 600 }}>
        <div>Products</div>
        <div>Business</div>
        <div >Jobs</div>
        <div>Articles</div>
      </div>
    </nav>
  )
}
