import { useRouter } from "next/router";
import Link from 'next/link';
import Image from 'next/image';
import HeadMetadata from "../components/HeadMetadata";
import LayoutA from "../components/layoutA";
import Nav from "../components/nav";
import UserProfile from "../lib/UserProfile/UserProfile";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import Resume from "../components/Resume";
import { loading } from "../lib/myFunctions";
import { applyForJob } from "../lib/api";

export default function Apply() {
  const router = useRouter()
  const { jobTitle, jobId, l } = router.query
  const [user, setUser] = useState(UserProfile.getUser())
  useEffect(() => {
    onAuthStateChanged(auth, authUser => {
      if (authUser?.uid) {
        const userRef = doc(db, 'users', authUser?.uid);
        onSnapshot(userRef, doc => {
          doc.exists && setUser({ ...doc.data(), uid: doc.id });
        });
      }
    })
  }, [])

  const handleSubmit = async (resumeData) => {
    if (resumeData && l) {
      loading('open')
      const data = { ...resumeData, jobId }
      let res = await applyForJob(l, data);
      if (res === 'success') {
        setTimeout(() => {
          router.push(`/job/${jobId}`)
        }, 1500);
      }
      loading('close')
    }
  }

  return (<>
    <HeadMetadata title={`Apply for > ${jobTitle} - Hairrrs`} />

    <Nav />

    <LayoutA>
      <div style={{ padding: '15px' }}>
        <div className="flex-column justify-center align-center">
          <div style={{ fontSize: '2.3rem', fontWeight: 300 }}>
            <center>
              <div>APPLY FOR THE POSITION OF <span style={{ fontWeight: 500, textTransform: 'uppercase' }}>{jobTitle}</span></div>
              <br />
              <div>YOUR RESUME</div>
            </center>
          </div>

          <br />
          <Resume user={user} jobId={jobId} handleSubmit={handleSubmit} />
        </div>
      </div>
    </LayoutA>
  </>)
}