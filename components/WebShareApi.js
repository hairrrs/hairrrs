import { useState } from 'react';
import Image from 'next/image';
import { RWebShare } from "react-web-share";
import { isMobile } from 'react-device-detect';
import {
  FacebookShareButton,
  WhatsappShareButton,
  TwitterShareButton,
  EmailShareButton
} from 'next-share';

export default function WebShareApi({ url, title, text }) {
  const [showShareAlt, setShowShareAlt] = useState(false)

  // const [width, setWidth] = useState(window.innerWidth);
  // const [isMobile, setIsMobile] = useState(false);

  // function handleWindowSizeChange() {
  //     setWidth(window.innerWidth);
  // }
  // useEffect(() => {
  //     window.addEventListener('resize', handleWindowSizeChange);
  //     return () => {
  //         window.removeEventListener('resize', handleWindowSizeChange);
  //     }
  // }, []);

  // useEffect(() => {
  //     if (width <= 768) { setIsMobile(true) } else { setIsMobile(false) };

  // }, [width]);

  const closeStyle = { position: 'fixed', top: 50, right: 50, padding: '10px 15px', border: '2px solid #eb004e', borderRadius: 5, color: '#eb004e', fontWeight: 700, cursor: 'pointer', zIndex: 2 }


  return (
    <div>
      {showShareAlt && <>
        <div
          onClick={() => { setShowShareAlt(false) }}
          style={closeStyle}>cancel</div>
        <Share url={url} text={text} setShowShareAlt={setShowShareAlt} />
      </>}

      {!isMobile &&
        <button onClick={() => { setShowShareAlt(!showShareAlt) }}>
          <Image src="/images/saturday feather-share-2.svg" alt="share icon" width="20px" height="18px" />
        </button>
      }

      {isMobile && <RWebShare
        data={{ text, url, title }}
      // onClick={() => console.info("share successful!")}
      >
        <button><Image src="/images/saturday feather-share-2.svg" alt="share icon" width="20px" height="18px" /></button>
      </RWebShare>}
    </div>
  );
}

function Share({ url, text }) {
  const desktopShareMainStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', background: 'rgba(255, 255, 255, 0.75)', zIndex: 1 }
  const desktopShareStyle = { gap: '1.5rem', padding: '10px 15px', background: 'white', boxShadow: '#0000001f 0px 0px 5px 1px' }

  return (
    <div id="desktopShareMain" className="flex justify-center items-center" style={desktopShareMainStyle}>
      <div className="flex justify-center items-center" style={desktopShareStyle}>
        <Image src="/images/saturday feather-share-2.svg" alt="share icon" width="30px" height="30px" title="share to..." />

        <FacebookShareButton url={url} quote={`${text} \n \n`}>
          Facebook
          {/* <Image src="/images/saturday feather-share-2.svg" alt="share icon" width="20px" height="20px" title="Facebook" /> */}
        </FacebookShareButton>

        <WhatsappShareButton url={url} title={`*${text}* \n \n`}>
          Whatsapp
          {/* <Image src="/images/saturday feather-share-2.svg" alt="share icon" width="20px" height="20px" title="Whatsapp" /> */}
        </WhatsappShareButton>

        <TwitterShareButton url={url} title={`${text} \n \n`}>
          Twitter
          {/* <Image src="/images/saturday feather-share-2.svg" alt="share icon" width="20px" height="20px" title="Twitter" /> */}
        </TwitterShareButton>

        <EmailShareButton subject={`Check out what I did on GoodWerk`} body={`${text}: ${url}`}>
          Email
          {/* <Image src="/images/saturday feather-share-2.svg" alt="share icon" width="20px" height="20px" title="Email" /> */}
        </EmailShareButton>
      </div>
    </div>
  )
}
