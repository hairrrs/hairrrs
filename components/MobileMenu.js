import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import SwitchAccount from './switchAccount'
import SwitchMenu from './switchMenu'

import { FiSearch } from 'react-icons/fi'

import styles from '../styles/nav.module.css'

export default function MobileMenu({handleMenuClick}) {
  const { user } = useAuth();

  const [showMenu, setShowMenu] = useState(false)
  const [showSwitchAccount, setShowSwitchAccount] = useState(false)
  
  return (<>
    <div className={`sm-show ${styles.mobileMenu}`}>
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
            <button type="submit" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              {/* <i className="fa fa-search" style={{ color: '#eb004e' }}></i> */}
              <FiSearch color="#eb004e" />
            </button>
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
      </div>
  </>)
}
