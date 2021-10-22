import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/nav.module.css'

export default function Nav() {
  return (
    <nav className={`${styles.nav}`}>
      

      <div className={styles.headerad}>
        <img src="/images/headerad.gif" alt="" width="100%" height="100%" className={styles.headeradImg} />
      </div>
      <div className={`${styles.mainNav} flex justify-between items-center`}>
        <div className={styles.navLogo}>
          <Link href="/"><a><Image src="/hairrrs-Logo-original.png" alt="logo" width="120" height="30" /></a></Link>
        </div>
        <div className="sm-show" style={{ padding: '5px 10px', border: '1px solid #eb004e', borderRadius: 4, color: '#eb004e', cursor: 'pointer' }}>
          MENU
        </div>
        <div className={`sm-hidden flex justify-between items-center`}>
          <form className={`mx-3 flex items-center ${styles.navSearch}`}>
            <input type="search" name="search" id="search" />
            <button type="submit" style={{ background: 'none', border: 'none', cursor: 'pointer' }}><i className="fa fa-search" aria-hidden="true" style={{ color: '#eb004e' }}></i></button>
          </form>
          <div className="mx-3"><Image src="/images/msg-header.svg" alt="" width="20px" height="20px" /></div>
          <div className="mx-3"><Image src="/images/notification-header.svg" alt="" width="20px" height="20px" /></div>
          <div className="mx-3"><Image src="/images/saved-header.svg" alt="" width="20px" height="20px" /></div>

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
