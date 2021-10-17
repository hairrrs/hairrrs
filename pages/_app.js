import '../styles/globals.css'
import '../styles/carousel.css'
import Modal from 'react-modal'
import { useRouter } from 'next/router'
import Image from 'next/image'
import AuthModal from '../components/AuthModal/authModal'

Modal.setAppElement('#__next');

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const currentPage = router.pathname

  return (<>

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
        <Image src="/loader.gif" alt="Loading..." width="200px" height="200px" />
      </div>
    <Component {...pageProps} />
  </>)
}

export default MyApp
console.clear();
console.log("...Welcome to Hairrrs.com");