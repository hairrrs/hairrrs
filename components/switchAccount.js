import { useState } from 'react'
import Image from "next/image";
import Link from "next/link";
import { handleSwitchAccount, loading } from '../lib/myFunctions'

export default function SwitchAccount({ user, setShowSwitchAccount }) {
  const [savedAccounts, setSavedAccounts] = useState(JSON.parse(localStorage.getItem('allUsers')));

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
      localStorage.setItem('allUsers', JSON.stringify(newSavedAccounts))
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
                      <Image src={account ? account?.photoURL : "/images/user.png"} alt={account?.displayName || account?.userName} width="100%" height="100%" />
                    </div>
                    <div className="text-baseColor">{account.displayName || account.userName}</div>
                  </div>

                  <i onClick={() => { handleRemoveAccountFromDevice(account?.displayName || account?.userName, account?.uid) }} className="fa fa-window-close" aria-hidden="true" title="Remove account"></i>
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