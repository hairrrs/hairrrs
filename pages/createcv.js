import { useRouter } from "next/router";
import Image from 'next/image';
import HeadMetadata from "../components/HeadMetadata";
import LayoutA from "../components/layoutA";
import Nav from "../components/nav";
import UserProfile from "../lib/UserProfile/UserProfile";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import Questions from "../components/questions/Questions";
import { createResume, hasCreatedCv } from "../lib/api";

export default function CreateCv() {
  const router = useRouter()
  const [editMode, setEditMode] = useState(true)
  const [user, setUser] = useState(UserProfile.getUser())
  useEffect(() => {
    onAuthStateChanged(auth, authUser => {
      if (authUser?.uid) {
        const userRef = doc(db, 'users', authUser?.uid);
        onSnapshot(userRef, doc => {
          doc.exists && setUser({ ...doc.data(), uid: doc.id }); setUid(doc?.id);
          if(!doc.exists){
            alert('you have to login to continue');
            router.back();
          }
        });
      }
    })
  }, [router])

  useEffect(() => {
    const fetch = async () => {
      const res = await hasCreatedCv(user?.uid)
      console.log(res)
      res && router.push(`/resume/${user?.displayName}`)
    }
    return fetch()
  }, [router, user])

  const [uid, setUid] = useState('')
  const [name, setName] = useState('')
  const [about, setAbout] = useState('')
  const [skills, setSkills] = useState([/*{ id: 0, content: '' }*/])
  const [interests, setInterests] = useState([])
  const [experience, setExperience] = useState([])
  const [education, setEducation] = useState([])
  const [contact, setContact] = useState([])
  const [email, setEmail] = useState([])
  const [website, setWebsite] = useState([])

  const saveEditedCv = async () => {
    if (user) {
      const data = { uid, name, about, skills, interests, experience, education, contact, email, website }
      loading('open')
      let res = await createResume(user?.uid, data);
      loading('close')
      res === 'success' ? setEditMode(false) : alert('an error occured! \n make sure no field is empty');
    }
  }

  return (<>
    <HeadMetadata title={`Create resume - Hairrrs`} />

    <Nav />

    <LayoutA>
      <div style={{ padding: '15px' }}>
        <div className="flex-column justify-center align-center">
          <Resume user={user}
            editMode={editMode} name={name} about={about} skills={skills} interests={interests} experience={experience} education={education} contact={contact} email={email} website={website}
            setName={setName} setAbout={setAbout} setSkills={setSkills} setInterests={setInterests} setExperience={setExperience} setEducation={setEducation} setContact={setContact} setEmail={setEmail} setWebsite={setWebsite}
          />

          <div className="flex justify-center align-center" style={{ gap: '1.7rem' }}>
            {!editMode && <input
              onClick={() => { setEditMode(true) }}
              type="button" value="edit resume" />}

            {editMode && <input
              onClick={saveEditedCv}
              type="button" value="save" />}

            {!editMode && currentPage === '/resume/[userId]' && <input type="button" value="download resume" />}
          </div>
        </div>
      </div>
    </LayoutA>
  </>)
}

const Resume = ({ user, editMode, name, about, skills, interests, experience, education, contact, email, website,
  setName, setAbout, setSkills, setInterests, setExperience, setEducation, setContact, setEmail, setWebsite }) => {

  return (<>
    <div className="flex" style={{ gap: '1rem' }}>
      <div className="b-photo-1" style={{
        flexGrow: 0,
        marginRight: '50px', width: '120px', height: '120px', overflow: 'hidden', background: '#eb004e', borderRadius: '50%'
      }}>
        {user && user?.photoURL && <Image src={user ? user.photoURL : user.photoURLmax} alt={user?.userName} width="120px" height="120px" />}
      </div>
      <div style={{ flexGrow: 1 }}>
        <div>
          <span>Name</span>
          <br />
          <input
            value={name}
            onChange={(e) => { editMode && setName(e.target.value) }}
            type="text"
            style={{ width: '100%', border: '1px solid #eee' }}
          />
        </div>

        <br />
        <div>
          <span>About</span>
          <br />
          <div>
            <textarea
              value={about}
              onChange={(e) => { editMode && setAbout(e.target.value) }}
              type="text" style={{
                height: '125px',
                width: '100%',
                border: '1px solid #c5c5c56e',
                resize: 'none',
                padding: 15,
                fontSize: '1rem',
                fontFamily: 'sans-serif'
              }}></textarea>
          </div>
        </div>

        <br />
        <div>
          <span>Skills</span>
          <br />
          <div>
            <Questions
              editMode={editMode}
              questions={skills} setQuestions={setSkills}
            />
          </div>
        </div>

        <br />
        <div>
          <span>Interests</span>
          <br />
          <div>
            <Questions
              editMode={editMode}
              questions={interests} setQuestions={setInterests}
            />
          </div>
        </div>

        <br />
        <div>
          <span>Experience</span>
          <br />
          <div>
            <Questions
              editMode={editMode}
              questions={experience} setQuestions={setExperience}
            />
          </div>
        </div>

        <br />
        <div>
          <span>Education</span>
          <br />
          <div>
            <Questions
              editMode={editMode}
              questions={education} setQuestions={setEducation}
            />
          </div>
        </div>

        <br />
        <div style={{ marginBottom: 5 }}>Contact information</div>

        <div style={{ padding: '1rem', border: '1px solid #eee' }}>
          <span>Contact number</span>
          <br />
          <input
            value={contact}
            onChange={(e) => { editMode && setContact(e.target.value) }}
            type="text"
            style={{ width: '100%', padding: '10px 5px', border: '1px solid #eee' }}
          />

          <br />
          <span>Contact email</span>
          <br />
          <input
            value={email}
            onChange={(e) => { editMode && setEmail(e.target.value) }}
            type="text"
            style={{ width: '100%', padding: '10px 5px', border: '1px solid #eee' }}
          />

          <br />
          <span>Contact website</span>
          <br />
          <input
            value={website}
            onChange={(e) => { editMode && setWebsite(e.target.value) }}
            type="text"
            style={{ width: '100%', padding: '10px 5px', border: '1px solid #eee' }}
          />
        </div>
      </div>
    </div>
  </>)
}