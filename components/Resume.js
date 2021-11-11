import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import { getResume, updateResume } from "../lib/api";
import { loading } from '../lib/myFunctions';
import Questions from './questions/Questions';

export default function Resume({ handleSubmit, user }) {
  const router = useRouter()
  const currentPage = router.pathname
  const [editMode, setEditMode] = useState(false)

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

  // getResume
  const [cv, setCv] = useState([])
  useEffect(() => {
    const fetch = async () => {
      if (user) {
        let res = await getResume(user?.uid);
        if (res) {
          setCv(res);
          setUid(res?.uid)
          setName(res?.name)
          setAbout(res?.about)
          setSkills(res?.skills)
          setInterests(res?.interests)
          setExperience(res?.experience)
          setEducation(res?.education)
          setContact(res?.contact)
          setEmail(res?.email)
          setWebsite(res?.website)
        } else {
          alert('You do not have any cv created yet');
          router.push('/createcv')
        }
      }
    }
    return fetch()
  }, [router, user])

  const saveEditedCv = () => {
    const action = async (data) => {
      if (data) {
        loading('open')
        let res = await updateResume(user?.uid, data);
        loading('close')
        res === 'success' ? setEditMode(false) : alert('an error occured! \n make sure no field is empty');
      } else { alert('error') }
    }

    if (user) {
      const data = { uid, name, about, skills, interests, experience, education, contact, email, website }
      if (cv?.length > 0 && cv?.uid === user?.uid) {
        if (window.confirm
          ('Do you want to overwrite your original resume? \n Click cancel if you just want to use it to apply for this vacancy')) {
          action(data)
        }
      } else {
        action(data)
      }
    }
  }

  const submit = async () => {
    const data = { uid, name, about, skills, interests, experience, education, contact, email, website }
    !name && alert("you can't leave the name field empty");
    !about && alert("you can't leave the about field empty");
    !skills && alert("you can't leave the skills field empty");
    !interests && alert("you can't leave the interests field empty");
    !experience && alert("you can't leave the experience field empty");
    !education && alert("you can't leave the education field empty");
    !contact && alert("you can't leave the contact field empty");
    !email && alert("you can't leave the email field empty");
    !website && alert("you can't leave the website field empty");
    handleSubmit(data);
    setEditMode(false);
  }

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

        <br />
        <br />
        <br />

        <div className="flex justify-center align-center" style={{ gap: '1.7rem' }}>
          {!editMode && cv?.uid === user?.uid && <input
            onClick={() => { setEditMode(true) }}
            type="button" value="edit resume" />}

          {editMode && <input
            onClick={saveEditedCv}
            type="button" value="save" />}

          {!editMode && currentPage !== '/resume/[userId]' && <input
            onClick={submit}
            type="button" value="submit" />}

          {!editMode && currentPage === '/resume/[userId]' && <input type="button" value="download resume" />}
        </div>

      </div>
    </div>
  </>)
}