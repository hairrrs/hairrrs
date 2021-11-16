import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import HeadMetadata from '../../../components/HeadMetadata';
import LayoutA from '../../../components/layoutA';
import Nav from '../../../components/nav';
import { auth, db } from '../../../lib/firebase';
import { loading } from '../../../lib/myFunctions';

export default function EditProfile() {
  const router = useRouter();
  let displayName = (router?.asPath?.split("/"))[2]
  const [user, setUser] = useState(null)
  useEffect(() => {
    onAuthStateChanged(auth, authUser => {
      if (authUser?.uid) {
        loading('open');
        const userRef = doc(db, 'users', authUser?.uid);
        onSnapshot(userRef, doc => {
          doc.exists && setUser({ ...doc.data(), uid: doc.id });
        });
        loading('close');
      }
    })
  }, [])
  useEffect(() => {
    if (user) {
      if (displayName?.toLowerCase() !== user?.displayName?.toLowerCase()) {
        router.push(`/u/${user?.displayName}/edit`)
      }
    }
  }, [user, router, displayName])

  if (user) {
    return (<>
      <HeadMetadata title={`${displayName} | edit - Hairrrs`} />
      <Nav />

      <div className="flex" style={{ background: '#fff', marginTop: '165px', width: '100%' }}>
        <div className="flex-column" style={{ gap: '.5rem', margin: '20px 15px', background: '##f8f8f8', padding: '40px 25px', flexGrow: 1 }}>
          <Link href="#account"><a>Account</a></Link>
          <Link href="#business"><a>Business</a></Link>
          <Link href="#location"><a>Location</a></Link>
        </div>
        <div style={{ margin: '20px 15px', background: '##f8f8f8', padding: '40px 25px', flexGrow: 8 }}>
          <div id="account" style={{ height: '400px' }}>
            <h1>account setting section</h1>
            <hr />
          </div>
          <div id="business" style={{ height: '400px' }}>
            <h1>business setting section</h1>
            <hr />
          </div>
          <div id="location" style={{ height: '400px' }}>
            <h1>location setting section</h1>
            <hr />
          </div>
        </div>
      </div>
    </>)
  }

  return (<div>
    Error: Not Found!
  </div>)
}