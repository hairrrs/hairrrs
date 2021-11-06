import '../styles/globals.css'
import '../styles/carousel.css'
import Modal from 'react-modal'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import AuthModal from '../components/AuthModal/authModal'
import ReportModal from '../components/reportModal'
import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '../lib/firebase'
import { doc, onSnapshot } from 'firebase/firestore'
import UserProfile from '../lib/UserProfile/UserProfile'

Modal.setAppElement('#__next');

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const currentPage = router.pathname
  
  useEffect(() => {
    onAuthStateChanged(auth, authUser => {
      if (authUser?.uid) {
        const userRef = doc(db, 'users', authUser?.uid);
        onSnapshot(userRef, doc => {
          UserProfile.setUser({ ...doc.data(), uid: doc.id });
        });
      }
    })
  }, [])

  return (<>
    {/* start selling */}
    <div id="startSelling" className="justify-center items-center" style={{ display: 'none', flexDirection: 'column', position: 'fixed', top: 0, left: 0, height: '100vh', width: '100%', background: 'white', zIndex: 20 }}>
      <div
        onClick={() => { document.querySelector('#startSelling').style.display = 'none' }}
        style={{ position: 'fixed', left: 40, top: 40 }}>
        <Link href="/"><a><Image src="/hairrrs-Logo-original.png" alt="logo" width="120" height="30" /></a></Link>
      </div>
      <div
        onClick={() => { document.querySelector('#startSelling').style.display = 'none' }}
        style={{ position: 'fixed', right: 40, top: 30, fontSize: '60px', color: '#eb004e', fontWeight: 700, lineHeight: 1, cursor: 'pointer' }}>×</div>

      <h1 style={{ fontWeight: 300, fontSize: '2.5rem' }}>Start selling</h1>
      <div className="md-flex flex-wrap justify-center" style={{ marginTop: 50 }}>
        <Link href="/"><a
          onClick={() => { document.querySelector('#startSelling').style.display = 'none' }}
          className="flex startSelling-box" style={{ margin: '30px', gap: '1.3rem', background: '#eb004e', color: 'white', padding: '15px 20px', borderRadius: 10 }}>
          <Image src="/images/icon-add-product.png" alt="add-product" width="60" height="53" />
          <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>
            <div>sell</div>
            <div>product</div>
          </div>
        </a></Link>
        <Link href="/"><a
          onClick={() => { document.querySelector('#startSelling').style.display = 'none' }}
          className="flex startSelling-box" style={{ margin: '30px', gap: '1.3rem', background: '#eb004e', color: 'white', padding: '15px 20px', borderRadius: 10 }}>
          <Image src="/images/icon-add-job.png" alt="add-product" width="60" height="53" />
          <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>
            <div>upload job</div>
            <div>vacancy</div>
          </div>
        </a></Link>
        <Link href="/"><a
          onClick={() => { document.querySelector('#startSelling').style.display = 'none' }}
          className="flex startSelling-box" style={{ margin: '30px', gap: '1.3rem', background: '#eb004e', color: 'white', padding: '15px 20px', borderRadius: 10 }}>
          <Image src="/images/icon-add-article.png" alt="add-product" width="60" height="53" />
          <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>
            <div>write an</div>
            <div>article</div>
          </div>
        </a></Link>
      </div>
    </div>

    {router.query.report_modal === "true" && <ReportModal />}
    {/* authModal */}
    <Modal
      isOpen={router.query.authModal === 'true'}
      onRequestClose={() => router.push(`${currentPage}`)}
      style={{
        overlay: {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.75)'
        },
        content: {
          position: 'absolute',
          top: '40px',
          left: '40px',
          right: '40px',
          bottom: '40px',
          border: '1px solid #ccc',
          background: '#fff',
          overflow: 'auto',
          WebkitOverflowScrolling: 'touch',
          borderRadius: '4px',
          outline: 'none',
          padding: '20px'
        }
      }}
    >
      <AuthModal />
    </Modal>
    <div id="loadingModal">
      {/* <Image src="/loader.gif" alt="Loading..." width="200px" height="200px" /> */}
    </div>
    <Component {...pageProps} />
  </>)
}

export default MyApp
console.clear();
console.log("...Welcome to Hairrrs.com");