import { useState } from 'react';
import Image from 'next/image';
import { auth, db } from '../../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc } from "firebase/firestore";
import { isAccountSavedToDevice } from '../../lib/api';
import { handleSwitchAccount, loading } from '../../lib/myFunctions';
import AlertModal from './AlertModal';
import UserProfile from '../../lib/UserProfile/UserProfile';
import { useRouter } from 'next/router'
// import Forgetpassword from '../Forgetpassword';

function Signin() {
  const router = useRouter();
  const currentPage = router.pathname
  const [saveAccountToDevice, setSaveAccountToDevice] = useState(false)
  const [alertModal, setAlertModal] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [togglePassRest, setTogglePassRest] = useState(false)
  const [content, setContent] = useState({ email: '', password: '' });
  const onChange = (e) => {
    const { value, name } = e.target;
    setContent(prevState => ({ ...prevState, [name]: value }));
  }

  // email & password
  const handleSignIn = () => {
    loading('open')
    signInWithEmailAndPassword(auth, content.email, content.password)
      .then(async (data) => {
        const docRef = doc(db, "users", data?.user?.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          UserProfile.setUser(docSnap.data());
          if (!isAccountSavedToDevice(data?.user?.uid)) {
            setSaveAccountToDevice(true);
            loading('close');
            return;
          } else { router.push(`${currentPage}`); loading('close'); }
        }
      })
      .catch((error) => {
        loading('close');
        setAlertMsg(error.message);
        setAlertModal(true)
      });
  }

  const handleSaveAccountToDevice = (res) => {
    if (res === 'yes') {
      var allUsers = JSON.parse(localStorage.getItem('allUsers')) || []
      console.log(allUsers)
      // console.log(allUsers)

      if (allUsers?.length < 4) {
        var u = JSON.parse(localStorage.getItem('user'))
        var user = u?.data?.user?.user
        let cUser = [{
          uid: user?.uid,
          userName: user?.userName,
          // encode => "Buffer.from(str, 'base64')" and decode => "buf.toString('base64')"
          password: Buffer.from(user?.password, 'base64'),
          photoURL: user?.photoURL
        }]
        allUsers ? allUsers.push(cUser[0]) : allUsers = cUser;
        let data = allUsers
        localStorage.setItem('allUsers', JSON.stringify(data));
      } else { alert('Account full!, you can only have 4 accounts saved') }
    }
    setSaveAccountToDevice(false)
    router.push(`${currentPage}`);
    loading('close');
  }

  const handleSwitch = async (uid) => {
    loading('open')
    let res = await handleSwitchAccount(uid);
    // console.log(res);
    if(res === 'success'){
      setTimeout(() => {
        loading('close');
        router.push(`${currentPage}`);   
      }, 1000);
      return;
    }
    loading('close');
  }

  const [showLoginWithSavedAcc, setShowLoginWithSavedAcc] = useState(true)
  const savedAccounts = JSON.parse(localStorage.getItem('allUsers'));


  return (<div style={{ position: 'relative' }}>
    <br />
    <br />

    {alertModal && <AlertModal alertModal={alertModal} setAlertModal={setAlertModal} alertMsg={alertMsg} />}

    {showLoginWithSavedAcc && savedAccounts && <div className="loginWithSavedAcc" style={{
      position: 'fixed',
      top: 15,
      left: 15,
      width: 250,
      minHeight: 300,
      background: 'rgb(0 0 0 / 79%)',
      color: 'white',
      padding: 15
    }}>
      <div
        onClick={() => { setShowLoginWithSavedAcc(false) }}
        style={{ textAlign: 'right', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>X</div>

      <center><div style={{ fontSize: '1.3rem', fontWeight: 700 }}>Login as</div></center>
      <div style={{ height: 15 }}></div>

      {savedAccounts?.map((account, index) => {
        // console.log(account)
        return (
          <div key={index} onClick={() => { handleSwitch(account?.uid) }} className="flex items-center" style={{ gap: '1rem', cursor: 'pointer', padding: '10px', borderBottom: '1px solid gray' }}>
            <div style={{ borderRadius: '50%', overflow: 'hidden', width: "35px", height: '35px' }}>
              <Image src={account ? account?.photoURL : "/images/user.png"} alt={account?.displayName || account?.userName} width="100%" height="100%" />
            </div>
            <div className="" style={{ fontWeight: 700, fontSize: '1.2rem' }}>{account?.displayName || account?.userName}</div>
          </div>
        )
      })}

    </div>}

    <form onSubmit={(e) => { e.preventDefault(); handleSignIn() }}>
      <div className="form-control">
        <input
          name="email"
          value={content.email}
          onChange={onChange}
          type="email" id="email" placeholder="Email" />
      </div><br />

      <div className="form-control">
        <input
          name="password"
          value={content.password}
          onChange={onChange}
          type="password" id="password" placeholder="Password" />
      </div>
      <div>Lost password? <span onClick={() => { setTogglePassRest(true) }} style={{ color: 'brown', cursor: 'pointer' }}>click here</span></div>
      <button>Sign in</button>
    </form>


    {saveAccountToDevice && <div
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%', height: '100vh',
        background: 'rgba(0,0,0,0.2)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 95
      }}
    >
      <div
        style={{
          background: 'white',
          padding: '10px 30px',
          boxShadow: 'rgb(0 0 0 / 50%) -1px 1px 5px 0px'
        }}
      >
        <div>Do you want to save this Account for easy login?</div>
        <div className="d-flex" style={{ justifyContent: 'flex-end', marginTop: '2rem' }}>
          <button
            style={{ cursor: 'pointer' }}
            className="btnSolid"
            onClick={() => { handleSaveAccountToDevice('yes') }}>yes</button>
          <div style={{ width: 20 }}></div>
          <button
            style={{ cursor: 'pointer' }}
            onClick={() => { handleSaveAccountToDevice('no') }}>no</button>
        </div>
      </div>
    </div>}


    {/* {togglePassRest && <Forgetpassword setTogglePassRest={setTogglePassRest} />} */}
  </div>)
}

export default Signin
