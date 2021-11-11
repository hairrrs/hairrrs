import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import HeadMetadata from "../../components/HeadMetadata";
import LayoutA from "../../components/layoutA";
import Nav from "../../components/nav";
import UserProfile from "../../lib/UserProfile/UserProfile";
import Resume from "../../components/Resume";
import { getUserById } from "../../lib/api";
import { loading } from "../../lib/myFunctions";

export default function ResumePage() {
  const router = useRouter()
  const { userId } = router.query
  const [user, setUser] = useState(UserProfile.getUser())
  useEffect(() => {
    const fetch = async () => {
      loading('open')
      if(userId){
        let res = await getUserById(userId);
        setUser(res);
      }
    }
    return fetch()
  }, [userId])

  useEffect(() => {
    if(user?.uid){
      loading('close');
    }
  }, [user])

  const handleSubmit = async () => {
    
  }

  return (<>
    <HeadMetadata title={`${user?.displayName} Resume - Hairrrs`} />

    <Nav />

    <LayoutA>
      <div style={{ padding: '15px' }}>
        <div className="flex-column justify-center align-center">
          <div style={{ fontSize: '2.3rem', fontWeight: 300 }}>
            <center>
              <div>RESUME</div>
            </center>
          </div>

          <br />
          <Resume user={user} handleSubmit={handleSubmit} />
        </div>
      </div>
    </LayoutA>
  </>)
}