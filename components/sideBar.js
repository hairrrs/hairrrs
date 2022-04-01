import Link from "next/link"
import Image from "next/image"
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { auth } from '../lib/firebase'
import { onAuthStateChanged } from "firebase/auth";
import { handleSwitchAccount, loading } from '../lib/myFunctions'
import { useAuth } from '../context/AuthContext';

export default function SideBar() {
  const { user, logout } = useAuth();
  const [userDetails, setuserDetails] = useState(null)
  const [showMenu, setShowMenu] = useState(false)
  const [showSwitchAccount, setShowSwitchAccount] = useState(false)

  useEffect(() => {
    onAuthStateChanged(auth, (userDetails) => {
      userDetails?.reload();
      setuserDetails(userDetails);
      // console.log(userDetails)
    })
  }, [])

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
      {showSwitchAccount && <SwithAccount setShowSwitchAccount={setShowSwitchAccount} />}
      <div className="" style={{ width: '100%', padding: '15px 20px' }}>
        <div className="flex-column items-center justify-center">
          <div style={{
            position: 'relative',
            width: '80px',
            height: '80px',
            border: '2px solid #eb004e',
            borderRadius: '50%',
            overflow: 'hidden',
            background: '#eb004e',
            marginBottom: '1.5rem'
          }}>
            <Link href={`/u/${userDetails?.displayName}`}><a>
              {userDetails?.photoURL && <Image src={userDetails ? userDetails?.photoURL : "/images/userDetails.png"} alt={userDetails ? userDetails.displayName : ""} width="80px" height="80px" />}
            </a></Link>
          </div>
          <div className="flex items-center" style={{ gap: '1rem' }}>
            <div><Link href={`/u/${userDetails?.displayName}`}><a style={{ fontSize: '1.2rem', fontWeight: 600, textDecoration: 'underline' }} className="text-baseColor">{userDetails ? userDetails.displayName : 'Anonymous'}</a></Link></div>
          <div style={{ position: 'relative', cursor: 'pointer' }}>
            <i onClick={() => { setShowMenu(!showMenu) }} style={{ fontSize: '25px', marginTop: '5px' }} className="fa fa-angle-down text-baseColor" aria-hidden="true"></i>
            {showMenu && <Menu setShowSwitchAccount={setShowSwitchAccount} setShowMenu={setShowMenu} />}
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

const Menu = ({ setShowMenu, setShowSwitchAccount }) => {
  const router = useRouter();

  return (
    <div className="flex-column" style={{ gap: '.7rem', padding: '10px 15px', background: '#f2f2f2', position: 'absolute', right: 0, top: 30, width: 180 }}>
      {user ? <>
        <div onClick={() => { setShowSwitchAccount(true); setShowMenu(false) }}>Switch account</div>
        <div><Link href="/signout"><a onClick={(e) => { e.preventDefault(); logout; setShowMenu(false) }}>Logout</a></Link></div>
      </> :
        <Link href="/?authModal=true" as={`${router.pathname}?signin`}><a onClick={() => { setShowMenu(false) }}>login / signup</a></Link>}
    </div>
  )
}

const SwithAccount = ({ setShowSwitchAccount }) => {
  const [savedAccounts, setSavedAccounts] = useState(JSON.parse(localStorage.getItem('allUserDetailss')));

  const handleSwitch = async (accountId) => {
    loading('open');
    let res = await handleSwitchAccount(accountId);
    if (res === 'success') {
      setTimeout(() => {
        setShowSwitchAccount(false);
        loading('close');
      }, 1000);
      return;
    }
    loading('close');
  }

  const handleRemoveAccountFromDevice = (displayName, accountId) => {
    const confirmation = window.confirm(`Are you sure you want to remove "${displayName}" from your device?`)
    if (confirmation) {
      let newSavedAccounts = savedAccounts?.filter(function (obj) {
        return obj?.uid !== accountId;
      });
      setSavedAccounts(newSavedAccounts)
      localStorage.setItem('allUserDetailss', JSON.stringify(newSavedAccounts))
    }
  }

  return (
    <div style={{ position: 'absolute', zIndex: 1, padding: '10px 0', background: 'white', border: '1px solid #d0d0d0', borderRadius: 4, boxShadow: '0 0 15px 1px rgb(199 199 199 / 50%)' }}>
      <i onClick={() => { setShowSwitchAccount(false) }} className="fa fa-times" style={{ position: 'absolute', top: 10, right: 10 }}></i>
      <div style={{ textAlign: 'center', fontSize: '1.5rem' }}>Switch Account</div>
      <hr style={{ margin: '10px 0', borderBlockEndColor: '#d0d0d0' }} />
      <div style={{ padding: '0 10px', color: '#5b5b5b' }}>
        <div>currently logged in as: <span className="text-baseColor">{user?.displayName}</span></div>
        <br />

        <div>
          <div>switch to:</div>
          <div className="flex-column" style={{ gap: '.8rem' }}>

            {savedAccounts?.map((account, index) => {
              // console.log(doc)
              return (
                <div key={index} className="flex justify-between items-center" style={{ paddingRight: 20 }}>
                  <div onClick={() => { handleSwitch(account?.uid) }} className="flex items-center" style={{ gap: '1rem', cursor: 'pointer' }}>
                    <div style={{ borderRadius: '50%', overflow: 'hidden', width: "35px", height: '35px' }}>
                      <Image src={account ? account?.photoURL : "/images/userDetails.png"} alt={account?.displayName || account?.userDetailsName} width="100%" height="100%" />
                    </div>
                    <div className="text-baseColor">{account.displayName || account.userDetailsName}</div>
                  </div>

                  <i onClick={() => { handleRemoveAccountFromDevice(account?.displayName || account?.userDetailsName, account?.uid) }} className="fa fa-window-close" aria-hidden="true" title="Remove account"></i>
                </div>
              )
            })}

          </div>
        </div>
        <br />

        <div className="flex" style={{ fontSize: '.8rem', gap: '1rem' }}>
          <Link href="/?authModal=true" as="/?signup"><a onClick={() => { setShowSwitchAccount(false) }} className="button-solid">Add new account</a></Link>
          <Link href="/?signout"><a onClick={(e) => { e.preventDefault(); logout; setShowSwitchAccount(false) }} className="button-outline">Logout</a></Link>
        </div>
      </div>
    </div>
  )
}