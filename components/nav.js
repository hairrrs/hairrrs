import { useEffect, useState } from 'react'
// import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/nav.module.css'
// import { useAuth } from '../context/AuthContext'
import SwitchAccount from './switchAccount'
import SwitchMenu from './switchMenu'
import {useTheme} from 'next-themes'
import { FaRegCaretSquareDown } from 'react-icons/fa';
import { BsFillBellFill } from 'react-icons/bs';
import { MdDarkMode, MdOutlineDarkMode } from 'react-icons/md';

export default function Nav() {
  const {theme, setTheme} = useTheme()
  // const { user } = useAuth();
  // console.log(user)

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

  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleMenuClick = () => {
    console.log('clicked!')
    setShowMobileMenu(!showMobileMenu);
  }

  const [showMenu, setShowMenu] = useState(false)
  const [showSwitchAccount, setShowSwitchAccount] = useState(false)

  return (<>

    <nav className={`nav ${styles.nav}`}>





      {showMobileMenu && <div className={`sm-show ${styles.mobileMenu}`}>
        <div className={styles.menucont}>
          <div style={{
            display: 'grid',
            placeItems: 'center',
            margin: '20px 0'
          }}>
            <i className="close icon menuIcon" onClick={handleMenuClick}></i>
          </div>
          <form className={`flex items-center ${styles.navSearch}`}>
            <input type="search" name="search" id="search" placeholder="search" />
            <button type="submit" style={{ background: 'none', border: 'none', cursor: 'pointer' }}><i className="fa fa-search" style={{ color: '#eb004e' }}></i></button>
          </form>

          <div className={`flex justify-between items-center mt-3`}>
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

            <div
              onClick={() => { document.querySelector('#startSelling').style.display = 'flex' }}
              style={{ padding: '7px 23px', background: '#eb004e', color: 'white', borderRadius: '5px', cursor: 'pointer' }}>start selling</div>
          </div>

          <div className="container-fluid my-5" style={{ position: 'relative' }}>
            {showSwitchAccount && <SwitchAccount user={user} setShowSwitchAccount={setShowSwitchAccount} />}
            <div className="row items-center">
              <div className="col-3">
                {
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user ? user?.photoURL : "/images/user.png"} alt="" style={{ width: 60, height: 60, borderRadius: '50%' }} />
                }
              </div>
              <div className="col-3 d-flex items-center" style={{ position: 'relative' }}>
                <span style={{ textTransform: 'uppercase', fontWeight: 800, color: '#eb004e', marginRight: 10 }}>{user?.displayName}</span>
                <i onClick={() => { setShowMenu(!showMenu) }} className="fa fa-angle-down text-baseColor"></i>
                {showMenu && <SwitchMenu user={user} setShowSwitchAccount={setShowSwitchAccount} setShowMenu={setShowMenu} />}
              </div>
            </div>
          </div>

          <div className="row justify-center " style={{ display: 'grid' }}>
            <span>
              <span>Analystics</span>
              <span style={{ margin: '0 10px' }}>|</span>
              <span>Products</span>
            </span>
            <div>
              <span>Articles</span>
              <span style={{ margin: '0 10px' }}>|</span>
              <span>Job vacancies</span>
            </div>
          </div>

          <div className="mt-5 text-center">
            @ hairrrs.com
          </div>
        </div>
      </div>}





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
        <div className={`${styles.mobileMenuTrigger} sm-show`}>
          <i className="fa fa-bars pt-2" onClick={handleMenuClick}></i>
          {/* <i className="menu icon menuIcon" onClick={(e) => { handleMenuClick(e, 'show')}}></i> */}
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
  
  </>)
}
