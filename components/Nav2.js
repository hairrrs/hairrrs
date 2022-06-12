import Link from 'next/link';
import { useState } from 'react'
import { useTheme } from 'next-themes'

import Search from "./Search";
import MobileMenu from './MobileMenu';

import { FaRegCaretSquareDown } from 'react-icons/fa';
import { BsFillBellFill } from 'react-icons/bs';
import { MdDarkMode, MdOutlineDarkMode } from 'react-icons/md';
import { HiMenuAlt4 } from 'react-icons/hi';

export default function Nav2() {
  const { theme, setTheme } = useTheme()
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleMenuClick = () => {
    console.log('clicked!')
    setShowMobileMenu(!showMobileMenu);
  }



  return (<>
    {
      // eslint-disable-next-line @next/next/no-img-element
      <img src="/images/headerad.gif" alt="" width="100%" height="100%" />
    }

    {showMobileMenu && <MobileMenu handleMenuClick={handleMenuClick} />}

    <header className="flex items-center justify-between sticky top-0 drop-shadow shadow-gray-600 px-3 md:px-20 py-2 bg-white text-black dark:bg-black dark:text-white z-10">
      <div>
        <Link href="/"><a>
          {
            // eslint-disable-next-line @next/next/no-img-element
            <img src="/hairrrs-Logo-original.png" alt="logo" width="100" />
          }
        </a></Link>
      </div>
      <div className={` sm-show`}>
        <div onClick={handleMenuClick}>
          <HiMenuAlt4 />
        </div>
      </div>
      <div className="flex items-center sm-hidden">
        <div className="mr-16">
          <Search />
        </div>
        <div className={`mr-16 relative`}>
          <FaRegCaretSquareDown size="1.3em" />
          <span style={{ position: 'absolute', top: -5, right: -10, fontSize: '.6em', background: 'var(--main-color)', color: 'white', width: 18, height: 18, borderRadius: '50%', display: 'grid', placeItems: 'center' }}>7</span>
        </div>
        <div className={`mr-10 relative`}>
          <BsFillBellFill size="1.3em" />
          <span style={{ position: 'absolute', top: -5, right: -10, fontSize: '.6em', background: 'var(--main-color)', color: 'white', width: 18, height: 18, borderRadius: '50%', display: 'grid', placeItems: 'center' }}>7</span>
        </div>
        <div className={`mr-10 mt-1`}>
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? <MdDarkMode size="1.3em" /> : <MdOutlineDarkMode size="1.3em" />}
          </button>
        </div>
        <div className="default-btn" onClick={() => { document.querySelector('#startSelling').style.display = 'flex' }}>start selling</div>
      </div>
    </header>
    <div className="flex items-center justify-evenly bg-[#EB004E] text-white p-1 py-2">
      <div className="cursor-pointer">Products</div>
      <div className="cursor-pointer">Businesses</div>
      <div className="cursor-pointer">Job Vacancies</div>
      <div className="cursor-pointer">Articles</div>
    </div>
  </>)
}