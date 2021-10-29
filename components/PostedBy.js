import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { followAPI, unFollowAPI } from '../lib/api';
import { db } from "../lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

export default function PostedBy({ initialOwner, user }) {
  const [owner, setOwner] = useState([]);
  const [totalFollowers, setTotalFollowers] = useState(0);
  const [hasFollowed, setHasFollowed] = useState(false);

  // setOwner
  useEffect(() => {
    const ownerRef = doc(db, 'users', initialOwner?.uid);
    onSnapshot(ownerRef, doc => {
      doc.exists && setOwner({ ...doc.data(), uid: doc.id });
    });
  }, [initialOwner])

  // setHasFollowed, setTotalFollowers
  useEffect(() => {
    if (user) {
      if (user?.uid !== owner?.uid) {
        let arr = owner?.followers;
        arr && setTotalFollowers(arr?.length);
        let r = arr?.filter(doc => doc?.uid === user?.uid);
        r?.length > 0 ? setHasFollowed(true) : setHasFollowed(false)
      }
    }
  }, [owner, user])

  const follow = async () => {
    if (owner && user) {
      // loading('open');
      let res = await followAPI(owner, user);
      res === 'success' && setHasFollowed(true);
      loading('close');
    }
  }

  const unFollow = async () => {
    if (owner && user) {
      // loading('open');
      let res = await unFollowAPI(owner, user);
      console.log(res)
      // res === 'success' && setHasFollowed(true);
      loading('close');
    }
  }

  return (
    <div style={{ width: 250, padding: '20px 20px', boxShadow: 'rgb(0 0 0 / 20%) 0px 0px 4px 0px' }}>
      <div className="flex items-center justify-center" style={{ background: '#eb004e', color: 'white', padding: '10px 0', borderRadius: 5 }}>Posted by</div>

      <br />
      <div className="flex-column items-center" style={{ gap: '.8rem', background: '#f3f3f3', borderRadius: 5, padding: '25px 0' }}>
        <div style={{ width: 50, height: 50, background: '#eb004e', borderRadius: '50%', overflow: 'hidden' }}>
          {/* <Image src="/" */}
        </div>

        <div style={{ fontSize: '1rem', fontWeight: 650 }}>{owner?.displayName === user?.displayName ? 'You' : owner?.displayName}</div>

        <div className="flex" style={{ gap: '.6rem', fontSize: '.7rem' }}>
          {owner?.displayName !== user?.displayName && <div className="button-outline">Message</div>}
          {owner?.displayName !== user?.displayName && <>
            {hasFollowed ? <div className="button-solid" onClick={unFollow}>Unfollow</div> :
              <div className="button-solid" onClick={follow}>Follow</div>}
          </>}
          {owner?.displayName === user?.displayName && <div className="button-solid">Following</div>}
          <div className="button-solid">{totalFollowers}</div>
        </div>
      </div>

      <br />
      <Link href={`/?report_modal=true&itemId=${owner?.uid}`}>
      <a className="flex justify-center" style={{ color: '#eb004e', padding: '8px 0', width: '100%', border: '1px solid #eb004e', fontSize: '.7rem', fontWeight: 600, borderRadius: 5, gap: '.4rem' }}>
        <Image src="/images/Icon material-flag.png" alt="" width="18px" height="14px" />
        <span>Report this business</span>
      </a>
      </Link>
    </div>
  )
}