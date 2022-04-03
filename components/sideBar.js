import Link from "next/link"
import Image from "next/image"
import { useState } from 'react'
import { useAuth } from '../context/AuthContext';
import SwitchAccount from "./switchAccount"
import SwitchMenu from "./switchMenu"

export default function SideBar() {
  const { user } = useAuth();
  const [showMenu, setShowMenu] = useState(false)
  const [showSwitchAccount, setShowSwitchAccount] = useState(false)

  return (
    <div className="sm-hidden text-baseColor"
      style={{
        padding: '0 10px',
        fontWeight: 600,
        fontSize: '1.2rem',
        position: 'relative',
        background: 'white',
        boxShadow: '0 0 5px 0 rgba(0, 0, 0, 0.2)'
      }}
    >
      {showSwitchAccount && <SwitchAccount user={user} setShowSwitchAccount={setShowSwitchAccount} />}
      
      <div className="" style={{ width: '100%', padding: '15px 20px' }}>
        <div className="flex-column items-center justify-center">
          <div style={{
            position: 'relative',
            width: '60px',
            height: '60px',
            // border: '8px solid #eb004e',
            borderRadius: '50%',
            overflow: 'hidden',
            background: '#eb004e',
            marginBottom: '.5rem'
          }}>
            <Link href={`/u/${user?.displayName}`}><a>
              {user?.photoURL && <Image src={user ? user?.photoURL : "/images/user.png"} alt={user ? user.displayName : ""} width="60px" height="60px" />}
            </a></Link>
          </div>
          <div className="flex items-center" style={{ gap: '.5rem' }}>
            <div><Link href={`/u/${user?.displayName}`}><a style={{ fontSize: '1.2rem', fontWeight: 800 }} className="text-baseColor">{user ? user.displayName : 'Anonymous'}</a></Link></div>
          <div style={{ position: 'relative', cursor: 'pointer' }}>
            <i onClick={() => { setShowMenu(!showMenu) }} style={{ fontSize: '25px', marginTop: '5px' }} className="fa fa-angle-down text-baseColor" aria-hidden="true"></i>
            {showMenu && <SwitchMenu user={user} setShowSwitchAccount={setShowSwitchAccount} setShowMenu={setShowMenu} />}
          </div>
          </div>
        </div>

        <br /><br /><br />
        <div className="flex-column items-center" style={{ gap: '1.4rem', fontWeight: 700 }}>
          <Link href="/"><a>Analystics</a></Link>
          <Link href="/"><a>Products</a></Link>
          <Link href="/"><a>Job vacancies</a></Link>
          <Link href="/"><a>Articles</a></Link>
        </div>

        {/* <br />
        <div className="text-center" style={{ marginTop: '1rem', marginBottom: '1rem' }}>
          <Link href="/?authModal=true" as={`${router.pathname}?signin`}><a className="button-solid">login / signup</a></Link>
        </div> */}
      </div>
    </div>
  )
}