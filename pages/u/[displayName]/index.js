import Image from 'next/image'
import Link from 'next/link'
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import HeadMetadata from "../../../components/HeadMetadata";
import LayoutA from "../../../components/layoutA";
import Nav from "../../../components/nav";
import { auth, db } from "../../../lib/firebase";
import UserProfile from "../../../lib/UserProfile/UserProfile";
import { getUserByDisplayName } from '../../../lib/api';
import { loading } from '../../../lib/myFunctions';

export default function Profile() {
  const router = useRouter()
  const { displayName } = router.query;
  const [currentUser, setCurrentUser] = useState(UserProfile.getUser())
  useEffect(() => {
    onAuthStateChanged(auth, authUser => {
      if (authUser?.uid) {
        loading('open');
        const userRef = doc(db, 'users', authUser?.uid);
        onSnapshot(userRef, doc => {
          doc.exists && setCurrentUser({ ...doc.data(), uid: doc.id });
        });
        loading('close');
      }
    })
  }, [])
  const [ownerMode, setOwnerMode] = useState(false)
  useEffect(() => {
    if (displayName && currentUser?.displayName === displayName) {
      setOwnerMode(true);
    }
  }, [displayName, currentUser])
  const [user, setUser] = useState([]);
  useEffect(() => {
    const fetch = async () => {
      loading('open')
      let res = await getUserByDisplayName(displayName)
      let r = res?.docs?.map(doc => ({ ...doc.data(), uid: doc.id }))
      r?.length > 0 && setUser(r[0])
      loading('close')
    }
    return fetch()
  }, [displayName])


  return (<>
    <HeadMetadata title={`${user?.displayName} - Hairrrs`} />

    <Nav />

    <LayoutA>
      <div className="flex justify-center items-center" style={{ background: '#eb004e', color: 'white', width: '100%', height: '200px' }}>
        {ownerMode && <div style={{ padding: '5px 10px', background: 'white', color: 'black', marginTop: '-20px' }}>complete updating your profile</div>}
      </div>

      <div className="flex" style={{ gap: '2rem', marginTop: '-50px', alignItems: 'center', padding: '0 45px', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative' }}>
          <div style={{ width: '150px', height: '150px', overflow: 'hidden', background: '#eee', borderRadius: '50%' }}>
            {user && user?.photoURL && <Image src={user?.photoURL} alt={user?.displayName} width="150px" height="150px" />}
          </div>
          <div style={{ position: 'absolute', bottom: '20%', right: '-7px' }}>
            <Image src="/images/tick.png" alt="" width="30px" height="30px" />
          </div>
        </div>
        <div style={{ marginBottom: '-20px' }}>
          <div><strong style={{ color: '#eb004e', fontSize: '1.1rem', fontWeight: 700 }}>{user?.displayName}</strong></div>
          <div>{user?.email}</div>
        </div>
      </div>

      <div className="flex justify-center" style={{ gap: '1.3rem', marginBottom: '1.3rem' }}>
        <button>Beauty company</button>
        <button>Blog</button>
        <button>Locale</button>
      </div>

      <div className="flex justify-center" style={{ gap: '1.3rem', marginBottom: '1.5rem' }}>
        <button>Go premium</button>
        <button>Productions</button>
        <button>Become a Contestant</button>
        {ownerMode && <Link href={`/u/${user?.displayName}/edit`}><a>Settings</a></Link>}
      </div>

      {/* <br />
      <div className="flex flex-wrap justify-around">
        <div style={{ wdith: '100px', height: '10px', overflow: 'hidden', background: '#eee', padding: '50%' }}></div>
        <div style={{ wdith: '100px', height: '10px', overflow: 'hidden', background: '#eee', padding: '50%' }}></div>
        <div style={{ wdith: '100px', height: '10px', overflow: 'hidden', background: '#eee', padding: '50%' }}></div>
        <div style={{ wdith: '100px', height: '10px', overflow: 'hidden', background: '#eee', padding: '50%' }}></div>
        <div style={{ wdith: '100px', height: '10px', overflow: 'hidden', background: '#eee', padding: '50%' }}></div>
        <div style={{ wdith: '100px', height: '10px', overflow: 'hidden', background: '#eee', padding: '50%' }}></div>
      </div> */}


      <div className="flex justify-center" style={{ gap: '1.4rem', marginBottom: '1.5rem' }}>
        <div className="flex justify-center items-center" style={{ gap: '1rem', borderRadius: 5, background: '#eb004e', color: 'white', padding: '10px 20px' }}>
          <div>
            <Image src="/images/business-img.png" alt="" width="70px" height="70px" />
          </div>
          <div>sell product</div>
        </div>

        <div className="flex justify-center items-center" style={{ gap: '1rem', borderRadius: 5, background: '#eb004e', color: 'white', padding: '10px 20px' }}>
          <div>
            <Image src="/images/business-img.png" alt="" width="70px" height="70px" />
          </div>
          <div>upload job vacancy</div>
        </div>

        <div className="flex justify-center items-center" style={{ gap: '1rem', borderRadius: 5, background: '#eb004e', color: 'white', padding: '10px 20px' }}>
          <div>
            <Image src="/images/business-img.png" alt="" width="70px" height="70px" />
          </div>
          <div>write an article</div>
        </div>
      </div>

      <div className="flex-column">
        <div className="flex justify-center" style={{ fontSize: '1.1rem' }}>
          <div className="flex justify-center items-center"
            style={{ width: '300px', height: '120px', background: '#eee', gap: '.8rem' }}>
            <div style={{ fontSize: '35px' }}>{user?.followers?.length}</div>
            <div>Followers</div>
          </div>
          <div className="flex justify-center items-center"
            style={{ width: '300px', height: '120px', background: '#eee', gap: '.8rem' }}>
            <div style={{ fontSize: '35px' }}>{user?.following?.length}</div>
            <div>Following</div>
          </div>
          <div className="flex justify-center items-center"
            style={{ width: '300px', height: '120px', background: '#eee', gap: '.8rem' }}>
            <div style={{ fontSize: '35px' }}>{user?.totalEngagement}</div>
            <div>Total engagement</div>
          </div>
        </div>

        <div className="flex justify-center" style={{ fontSize: '1.1rem', color: 'white' }}>
          <div className="flex-column justify-center items-center"
            style={{ width: '300px', height: '120px', background: 'gray' }}>
            <div style={{ fontSize: '35px' }}>{user?.totalProducts}</div>
            <div>Products</div>
          </div>
          <div className="flex-column justify-center items-center"
            style={{ width: '300px', height: '120px', background: 'gray' }}>
            <div style={{ fontSize: '35px' }}>{user?.totalJobs}</div>
            <div>Job vacancies</div>
          </div>
          <div className="flex-column justify-center items-center"
            style={{ width: '300px', height: '120px', background: 'gray' }}>
            <div style={{ fontSize: '35px' }}>{user?.totalArticles}</div>
            <div>Articles</div>
          </div>
        </div>

        <div className="flex justify-center">
          <Link href={`/resume/${user?.uid}`}>
            <a className='flex justify-center items-center'
              style={{ width: '900px', height: '120px', background: '#00c2f4', color: 'white', fontSize: '1.1rem' }}>View resume</a>
          </Link>
        </div>
      </div>
    </LayoutA>
  </>)
}