import Image from 'next/image'
import styles from '../styles/nav.module.css'

export default function Nav() {
  return (
    <nav className={`${styles.nav}`}>
      <Image src="/images/headerad.gif" alt="" width="2500" height="50px" />
      <div className="flex justify-between items-center" style={{ padding: '15px 80px' }}>
        <div className={styles.navLogo}>
          <Image src="/hairrrs-Logo-original.png" alt="logo" width="180" height="36" />
        </div>
        <div className={`flex justify-between items-center`}>
          <form className={`mx-3 flex items-center ${styles.navSearch}`}>
            <input type="search" name="search" id="search" />
            <button type="submit" style={{ background: 'none', border: 'none', cursor: 'pointer' }}><i className="fa fa-search" aria-hidden="true" style={{ color: '#eb004e' }}></i></button>
          </form>
          <div className="mx-3"><Image src="/images/msg-header.svg" alt="" width="20px" height="20px" /></div>
          <div className="mx-3"><Image src="/images/notification-header.svg" alt="" width="20px" height="20px" /></div>
          <div className="mx-3"><Image src="/images/saved-header.svg" alt="" width="20px" height="20px" /></div>
          
          <div className="mx-3" style={{ padding: '7px 23px', background: '#eb004e', color: 'white', borderRadius: '5px' }}>start selling</div>
        </div>
      </div>
      <div className={`flex justify-around mt-3 ${styles.topMenu}`} style={{ fontWeight: 600 }}>
        <div>Products</div>
        <div>Business</div>
        <div>Job Vacancies</div>
        <div>Articles</div>
      </div>
    </nav>
  )
}
