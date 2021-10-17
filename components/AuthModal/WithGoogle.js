import React from 'react'
import firebase from "firebase";
import { auth, db } from '../../firebase';
import { loading, triggerAuthUser } from '../../myFunctions';
import UserProfile from '../UserProfile/UserProfile';
import { isAccountSavedToDevice } from '../../lib/api';
import { useState } from 'react';
import AlertModal from './AlertModal';

function WithGoogle({ defaults }) {
  // const [saveAccountToDevice, setSaveAccountToDevice] = useState(false)
  const [alertModal, setAlertModal] = useState(false);
  const [alertMsg, setAlertMsg] = useState('')

  const handleSignIn = () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    // const provider = new firebase.auth.FacebookAuthProvider()
    auth.signInWithPopup(provider)
      .then(async (authUser) => {
        // if (!authUser.additionalUserInfo.isNewUser) {
        fetch('https://api.ipdata.co/?api-key=f4332401282ddc4b12019f87256936ad24586eca9f5ce05ad5c079db')
          .then(res => res.json())
          .then(d2 => {
            let d1 = {
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
              userName: authUser?.user?.displayName,
              uid: authUser.user.uid,
              email: authUser.user.email,
              photoURL: authUser.additionalUserInfo.profile.picture
            }
            let a = { ...defaults, ...d1, ...d2 };
            let data = a;
            db.collection('users').doc(authUser.user.uid).set(data);
            UserProfile.setUser(data);

            // setOpenLoading(false)

            if (isAccountSavedToDevice(authUser?.user?.uid)) {
              loading('close'); triggerAuthUser(false);
            } else {
              loading('close');
              triggerAuthUser(false)
              // setSaveAccountToDevice(true);
            }
          })
          .catch((error) => {
            // console.log(error)
            setAlertMsg(error.message);
            setAlertModal(true)
          })

      })
      .catch((error) => {
        // console.log(error)
        loading('close');
        if (error?.code === 'auth/popup-closed-by-user') {
          setAlertMsg("The popup has been closed before finalizing the operation.");
        } else { setAlertMsg(error.message) }

        setAlertModal(true)
      });
  }

  // const handleSaveAccountToDevice = (res) => {
  //   if (res === 'yes') {
  //     loading('open');
  //     var allUsers = JSON.parse(localStorage.getItem('allUsers'))
  //     var u = JSON.parse(localStorage.getItem('user'))
  //     var user = u?.data?.user?.user
  //     if (user) {
  //       let cUser = [{
  //         uid: user?.uid,
  //         userName: user?.userName,
  //         photoURL: user?.photoURL
  //       }];
  //       // add_cUser_to_list
  //       if (allUsers && isSavedUsersListOpen()) {
  //         allUsers.push(cUser[0]);
  //         localStorage.setItem('allUsers', JSON.stringify(allUsers));
          
  //       } else {
  //         localStorage.setItem('allUsers', JSON.stringify(cUser));
  //       }

  //       allUsers && !isSavedUsersListOpen() && alert('Account full!, you can only have 4 accounts saved');

  //       loading('close');
  //       setSaveAccountToDevice(false);
  //       triggerAuthUser(false);
  //     }
  //   }
  // }

  return (<>
    <AlertModal alertModal={alertModal} setAlertModal={setAlertModal} alertMsg={alertMsg} />

    <img
      onClick={handleSignIn}
      style={{ margin: '0 5px' }}
      src="/images/google-icon-16x16.png" alt="Sign in with google" />


    {/* {saveAccountToDevice && <div
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
    </div>} */}

  </>)
}

export default WithGoogle
