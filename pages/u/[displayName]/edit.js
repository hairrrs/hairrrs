import Image from 'next/image';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import { auth, db } from '../../../lib/firebase';
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { deleteObject, getDownloadURL, getStorage, listAll, ref, uploadBytesResumable } from "firebase/storage";
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import HeadMetadata from '../../../components/HeadMetadata';
import LayoutA from '../../../components/layoutA';
import Nav from '../../../components/nav';
import { loading, resizeSingleImage, UrlSlug } from '../../../lib/myFunctions';
import styles from '../../../styles/pages/editProfile.module.css'

export default function EditProfile() {
  const router = useRouter();
  let displayName = (router?.asPath?.split("/"))[2]
  const [user, setUser] = useState(null)
  const [authUserC, setAuthUserC] = useState(null)
  useEffect(() => {
    onAuthStateChanged(auth, authUser => {
      setAuthUserC(authUser)
      console.log(authUser)
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

        {user && <>
          <div className={styles.editProfile} style={{ margin: '20px 15px', background: '##f8f8f8', padding: '40px 25px', flexGrow: 8 }}>
            <h1>Account</h1>
            <br />

            <div id="account" style={{ marginBottom: '0 70px' }}>
              <Account user={user} />
            </div>

            <hr style={{ marginTop: 10, marginBottom: 50, color: '#e5e5e570', border: '.1px solid' }} />

            <div id="personalSettings">
              <PersonalSettings user={user} />
            </div>

            <hr style={{ marginTop: 10, marginBottom: 50, color: '#e5e5e570', border: '.1px solid' }} />

            <div id="business">
              <Business user={user} />
            </div>

            <hr style={{ marginTop: 10, marginBottom: 50, color: '#e5e5e570', border: '.1px solid' }} />

            <div id="location">
              <Location user={user} />
            </div>

            <hr style={{ marginTop: 10, marginBottom: 50, color: '#e5e5e570', border: '.1px solid' }} />

            <div id="notification">
              <Notification user={user} />
            </div>

            <hr style={{ marginTop: 10, marginBottom: 50, color: '#e5e5e570', border: '.1px solid' }} />

            {authUserC?.providerData[0].providerId === 'password' && <div id="password">
              <Password user={user} />
            </div>}

            <hr style={{ marginTop: 10, marginBottom: 50, color: '#e5e5e570', border: '.1px solid' }} />

            <div id="verify">
              <Verify user={user} />
            </div>

            <hr style={{ marginTop: 10, marginBottom: 50, color: '#e5e5e570', border: '.1px solid' }} />

            <div id="deleteAccount">
              <DeleteAccount user={user} />
            </div>

            <hr style={{ marginTop: 10, marginBottom: 50, color: '#e5e5e570', border: '.1px solid' }} />

            <div id="aboutUs">
              <AboutUs user={user} />
            </div>
          </div>
        </>}
      </div>
    </>)
  }

  return (<div>
    Error: Not Found!
  </div>)
}

const Account = ({ user }) => {
  const [photoURLPrevw, setPhotoURLPrevw] = useState(null)
  const [photoURL, setPhotoURL] = useState(null)
  const [coverPhotoURLPrevw, setCoverPhotoURLPrevw] = useState(null)
  const [coverPhotoURL, setCoverPhotoURL] = useState(null)
  const [updating, setUpdating] = useState(false)
  const [updatingCoverPics, setUpdatingCoverPics] = useState(false)

  useEffect(() => {
    if (user) {
      setPhotoURLPrevw(user.photoURL);
      setCoverPhotoURLPrevw(user.coverPhotoURL);
    }
  }, [user])


  const handleUploadImage = (requestType) => {
    // resizeSingleImage(handleUpdatePics, photoURL, 35, 'min');
    // resizeSingleImage(handleUpdatePics, photoURL, 300, 'max');
    var min = 500;
    var max = 500;
    if (requestType !== 'profilePicture') {
      resizeSingleImage(handleUpdatePics, requestType, coverPhotoURL, 700, 'max');
    } else {
      resizeSingleImage(handleUpdatePics, requestType, photoURL, min, 'min');
      resizeSingleImage(handleUpdatePics, requestType, photoURL, max, 'max');
    }
  }

  const handleUpdatePics = async (imageFile, fileNameRef, type, contentType, requestType) => {
    const storage = getStorage();
    if (requestType === 'profilePicture') {
      setUpdating(true)
    } else {
      setUpdatingCoverPics(true)
    }

    if (requestType === 'profilePicture') {
      const desertRef = ref(storage, `images/${auth?.currentUser?.uid}_${type}`);
      await listAll(desertRef).then((res) => {
        res.prefixes.forEach((folderRef) => {
          // All the prefixes under listRef.
          // You may call listAll() recursively on them.
        });
        res.items.forEach((itemRef) => {
          deleteObject(itemRef).then(() => {
            console.log('File deleted successfully') // File deleted successfully
          }).catch((error) => {
            console.log('Uh-oh, an error occurred!', error) // Uh-oh, an error occurred!
          });
          // All the items under listRef.
        });
      }).catch((error) => {
        // Uh-oh, an error occurred!
      });
    }

    var fileName = requestType
    var storagePATH = '';
    if (requestType === 'profilePicture') {
      storagePATH = `images/${auth?.currentUser?.uid}_${type}/${fileName}`;
    } else {
      storagePATH = `images/${auth?.currentUser?.uid}_${requestType}/${fileName}`;
    }

    if (fileName) {
      const metadata = { contentType };
      var file = new File([imageFile], fileName, { type: contentType });

      if (user && storagePATH) {
        const storageRef = ref(storage, storagePATH);
        const uploadTask = uploadBytesResumable(storageRef, file, metadata);

        uploadTask.on("state_change", (snapshot) => {
          // const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          // console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              // console.log('Upload is paused');
              break;
            case 'running':
              // console.log('Upload is running');
              break;
          }
        },
          (error) => {
            console.log(error.message);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
              // console.log('File available at', url);
              const userRef = doc(db, "users", user.uid);
              if (requestType === 'profilePicture') {
                if (type === 'min') {
                  await updateDoc(userRef, { photoURL: url })
                } else {
                  await updateDoc(userRef, { photoURLmax: url })
                }
                updateProfile(auth.currentUser, { photoURL: url }).then(() => {
                  console.log('Profile updated!') // Profile updated!
                  // ...
                }).catch((error) => {
                  console.log('An error occurred') // An error occurred
                  // ...
                });
              } else {
                await updateDoc(userRef, { coverPhotoURL: url })
              }

              // photoURL.replace(url)
              if (requestType === 'profilePicture') {
                setPhotoURL(false)
                setUpdating(false)
              } else {
                setCoverPhotoURL(false)
                setUpdatingCoverPics(false)
              }
            });
          }
        );
      }
    }
  }

  return (<>
    <input
      onChange={(e) => {
        setPhotoURLPrevw(URL.createObjectURL(e.target.files[0]))
        setPhotoURL(e.target.files[0]);
      }}
      type="file" id="chooseProfilePics" hidden />
    <input
      onChange={(e) => {
        setCoverPhotoURLPrevw(URL.createObjectURL(e.target.files[0]))
        setCoverPhotoURL(e.target.files[0]);
      }}
      type="file" id="chooseCoverPics" hidden />

    <div className="flex-column" style={{ alignItems: 'center', width: '150px' }}>
      <div className="profilePicture" style={{ width: '150px', height: '150px', borderRadius: '50%', position: 'relative', overflow: 'hidden' }}>
        {user?.photoURL && <img src={photoURLPrevw} alt={user?.displayName} width="150px" height="150px" />}

        <label htmlFor="chooseProfilePics"
          style={{ background: 'rgba(0,0,0,.7)', color: 'white', width: "150px", height: "150px", borderRadius: '50%', position: 'absolute', overflow: 'hidden', top: 0, left: 0, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', cursor: 'pointer' }}>
          <div style={{ marginBottom: '15px', fontSize: '1.3rem', fontWeight: 600 }}>upload</div>
        </label>
      </div>

      <div className="d-flex align-items-center">
        <span style={{ marginRight: '15px', marginTop: 10, marginBottom: 10, fontWeight: 600 }}>Profile picture</span>

        {photoURL && <button onClick={() => { handleUploadImage('profilePicture') }}>Update profile picture</button>}
        &nbsp; &nbsp;
        {updating && <Image src="/loader.gif" alt="Loading..." width="20px" height="20px" />}
      </div>
    </div>

    <br />
    <br />

    <div>
      <div style={{ width: '50%', height: '200px', borderRadius: 5, position: 'relative', overflow: 'hidden' }}>
        {user?.photoURL && <img src={coverPhotoURLPrevw} alt={user?.displayName} width="100%" height="100%" />}

        <label htmlFor="chooseCoverPics"
          style={{ background: 'rgba(0,0,0,.5)', color: 'white', width: "100%", height: "100%", borderRadius: 5, position: 'absolute', overflow: 'hidden', top: 0, left: 0, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', cursor: 'pointer' }}>
          <div style={{ marginBottom: '15px', fontSize: '1.3rem', fontWeight: 600 }}>update cover picture</div>
        </label>
      </div>

      <div className="d-flex align-items-center">
        <div style={{ marginTop: '15px', fontSize: '1.3rem', fontWeight: 600 }}>Cover picture</div>

        {coverPhotoURL && <button onClick={() => { handleUploadImage('coverPicture') }}>Update cover picture</button>}
        &nbsp; &nbsp;
        {updatingCoverPics && <Image src="/loader.gif" alt="Loading..." width="20px" height="20px" />}
      </div>
    </div>
  </>)
}

const PersonalSettings = ({ user }) => {
  const [showUpdateBtn, setShowUpdateBtn] = useState(false);
  const [content, setContent] = useState({ firstName: user?.firstName, lastName: user?.lastName, email: user.email, phoneNumber: user?.phoneNumber, dob: user?.dob, gender: user?.gender });
  const onChange = (e) => {
    const { value, name } = e.target;
    setContent(prevState => ({ ...prevState, [name]: value }));
    setShowUpdateBtn(true);
  }

  const handleUpdate = async () => {
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      firstName: content.firstName, lastName: content.lastName, phoneNumber: content.phoneNumber, dob: content.dob, gender: content.gender
    })
    setShowUpdateBtn(false);
  }

  return (<div style={{ marginTop: 20 }}>
    <div>
      <div>First name</div>
      <input
        id="firstName"
        name="firstName"
        value={content.firstName}
        onChange={onChange}
        type="text" />
    </div>

    <div>
      <div>Last name</div>
      <input
        id="lastName"
        name="lastName"
        value={content.lastName}
        onChange={onChange}
        type="text" />
    </div>
    <br />

    <div>
      <div>Email</div>
      <input
        id="email"
        name="email"
        value={content.email}
        onChange={onChange}
        type="email" />
    </div>
    <br />

    <div>
      <div>Phone number</div>
      <input
        id="phoneNumber"
        name="phoneNumber"
        value={content.phoneNumber}
        onChange={onChange}
        type="tel" />
    </div>
    <br />

    <div>
      <div>Birthday</div>
      <input
        id="dob"
        name="dob"
        value={content.dob}
        onChange={onChange}
        type="date" />
    </div>
    <br />

    <div>
      <div>Gender</div>
      <select
        value={content.gender}
        onChange={onChange}
        name="gender" id="gender">
        <option value="">select</option>
        <option value="male">male</option>
        <option value="female">female</option>
      </select>
    </div>
    <br />

    {showUpdateBtn && <button onClick={handleUpdate}>Update</button>}
  </div>)
}

const Business = ({ user }) => {
  const [showUpdateBtn, setShowUpdateBtn] = useState(false);
  const [content, setContent] = useState({ displayName: user?.displayName, aboutBusiness: user?.aboutBusiness, website: user?.website, services: user?.services });
  const onChange = (e) => {
    const { value, name } = e.target;
    setContent(prevState => ({ ...prevState, [name]: value }));
    setShowUpdateBtn(true);
  }

  const handleUpdate = async () => {
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      displayName: content.displayName, aboutBusiness: content.aboutBusiness, website: content.website, services: content.services
    })
    setShowUpdateBtn(false);
  }

  return (<div>
    <div>
      <div>Username</div>
      <input type="text" name="displayName" id="displayName" value={content.displayName} onChange={onChange} />
    </div>
    <br />

    <div>
      <div>About business</div>
      <input type="text" name="aboutBusiness" id="aboutBusiness" value={content.aboutBusiness} onChange={onChange} />
    </div>
    <br />

    <div>
      <div>Website</div>
      <input type="text" name="website" id="website" value={content.website} onChange={onChange} />
    </div>
    <br />

    <div>
      <div>Services</div>
      <input type="text" name="services" id="services" value={content.services} onChange={onChange} />
    </div>
    <br />

    {showUpdateBtn && <button onClick={handleUpdate}>Update</button>}
  </div>)
}

const Location = ({ user }) => {
  const [showUpdateBtn, setShowUpdateBtn] = useState(false);
  const [content, setContent] = useState({ country: user?.country, location: user?.location, address: user?.address });
  const onChange = (e) => {
    const { value, name } = e.target;
    setContent(prevState => ({ ...prevState, [name]: value }));
    setShowUpdateBtn(true);
  }

  const handleUpdate = async () => {
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      country: content.country, location: content.location, address: content.address
    })
    setShowUpdateBtn(false);
  }

  return (<div>
    <div>
      <div>Country</div>
      <select id="country" name="country" onChange={onChange} >
        <option value={content?.country ? content?.country : ''}>{content?.country ? content?.country : ''}</option>
        <option value="Afganistan">Afghanistan</option>
        <option value="Albania">Albania</option>
        <option value="Algeria">Algeria</option>
        <option value="American Samoa">American Samoa</option>
        <option value="Andorra">Andorra</option>
        <option value="Angola">Angola</option>
        <option value="Anguilla">Anguilla</option>
        <option value="Antigua & Barbuda">Antigua & Barbuda</option>
        <option value="Argentina">Argentina</option>
        <option value="Armenia">Armenia</option>
        <option value="Aruba">Aruba</option>
        <option value="Australia">Australia</option>
        <option value="Austria">Austria</option>
        <option value="Azerbaijan">Azerbaijan</option>
        <option value="Bahamas">Bahamas</option>
        <option value="Bahrain">Bahrain</option>
        <option value="Bangladesh">Bangladesh</option>
        <option value="Barbados">Barbados</option>
        <option value="Belarus">Belarus</option>
        <option value="Belgium">Belgium</option>
        <option value="Belize">Belize</option>
        <option value="Benin">Benin</option>
        <option value="Bermuda">Bermuda</option>
        <option value="Bhutan">Bhutan</option>
        <option value="Bolivia">Bolivia</option>
        <option value="Bonaire">Bonaire</option>
        <option value="Bosnia & Herzegovina">Bosnia & Herzegovina</option>
        <option value="Botswana">Botswana</option>
        <option value="Brazil">Brazil</option>
        <option value="British Indian Ocean Ter">British Indian Ocean Ter</option>
        <option value="Brunei">Brunei</option>
        <option value="Bulgaria">Bulgaria</option>
        <option value="Burkina Faso">Burkina Faso</option>
        <option value="Burundi">Burundi</option>
        <option value="Cambodia">Cambodia</option>
        <option value="Cameroon">Cameroon</option>
        <option value="Canada">Canada</option>
        <option value="Canary Islands">Canary Islands</option>
        <option value="Cape Verde">Cape Verde</option>
        <option value="Cayman Islands">Cayman Islands</option>
        <option value="Central African Republic">Central African Republic</option>
        <option value="Chad">Chad</option>
        <option value="Channel Islands">Channel Islands</option>
        <option value="Chile">Chile</option>
        <option value="China">China</option>
        <option value="Christmas Island">Christmas Island</option>
        <option value="Cocos Island">Cocos Island</option>
        <option value="Colombia">Colombia</option>
        <option value="Comoros">Comoros</option>
        <option value="Congo">Congo</option>
        <option value="Cook Islands">Cook Islands</option>
        <option value="Costa Rica">Costa Rica</option>
        <option value="Cote DIvoire">Cote DIvoire</option>
        <option value="Croatia">Croatia</option>
        <option value="Cuba">Cuba</option>
        <option value="Curaco">Curacao</option>
        <option value="Cyprus">Cyprus</option>
        <option value="Czech Republic">Czech Republic</option>
        <option value="Denmark">Denmark</option>
        <option value="Djibouti">Djibouti</option>
        <option value="Dominica">Dominica</option>
        <option value="Dominican Republic">Dominican Republic</option>
        <option value="East Timor">East Timor</option>
        <option value="Ecuador">Ecuador</option>
        <option value="Egypt">Egypt</option>
        <option value="El Salvador">El Salvador</option>
        <option value="Equatorial Guinea">Equatorial Guinea</option>
        <option value="Eritrea">Eritrea</option>
        <option value="Estonia">Estonia</option>
        <option value="Ethiopia">Ethiopia</option>
        <option value="Falkland Islands">Falkland Islands</option>
        <option value="Faroe Islands">Faroe Islands</option>
        <option value="Fiji">Fiji</option>
        <option value="Finland">Finland</option>
        <option value="France">France</option>
        <option value="French Guiana">French Guiana</option>
        <option value="French Polynesia">French Polynesia</option>
        <option value="French Southern Ter">French Southern Ter</option>
        <option value="Gabon">Gabon</option>
        <option value="Gambia">Gambia</option>
        <option value="Georgia">Georgia</option>
        <option value="Germany">Germany</option>
        <option value="Ghana">Ghana</option>
        <option value="Gibraltar">Gibraltar</option>
        <option value="Great Britain">Great Britain</option>
        <option value="Greece">Greece</option>
        <option value="Greenland">Greenland</option>
        <option value="Grenada">Grenada</option>
        <option value="Guadeloupe">Guadeloupe</option>
        <option value="Guam">Guam</option>
        <option value="Guatemala">Guatemala</option>
        <option value="Guinea">Guinea</option>
        <option value="Guyana">Guyana</option>
        <option value="Haiti">Haiti</option>
        <option value="Hawaii">Hawaii</option>
        <option value="Honduras">Honduras</option>
        <option value="Hong Kong">Hong Kong</option>
        <option value="Hungary">Hungary</option>
        <option value="Iceland">Iceland</option>
        <option value="Indonesia">Indonesia</option>
        <option value="India">India</option>
        <option value="Iran">Iran</option>
        <option value="Iraq">Iraq</option>
        <option value="Ireland">Ireland</option>
        <option value="Isle of Man">Isle of Man</option>
        <option value="Israel">Israel</option>
        <option value="Italy">Italy</option>
        <option value="Jamaica">Jamaica</option>
        <option value="Japan">Japan</option>
        <option value="Jordan">Jordan</option>
        <option value="Kazakhstan">Kazakhstan</option>
        <option value="Kenya">Kenya</option>
        <option value="Kiribati">Kiribati</option>
        <option value="Korea North">Korea North</option>
        <option value="Korea Sout">Korea South</option>
        <option value="Kuwait">Kuwait</option>
        <option value="Kyrgyzstan">Kyrgyzstan</option>
        <option value="Laos">Laos</option>
        <option value="Latvia">Latvia</option>
        <option value="Lebanon">Lebanon</option>
        <option value="Lesotho">Lesotho</option>
        <option value="Liberia">Liberia</option>
        <option value="Libya">Libya</option>
        <option value="Liechtenstein">Liechtenstein</option>
        <option value="Lithuania">Lithuania</option>
        <option value="Luxembourg">Luxembourg</option>
        <option value="Macau">Macau</option>
        <option value="Macedonia">Macedonia</option>
        <option value="Madagascar">Madagascar</option>
        <option value="Malaysia">Malaysia</option>
        <option value="Malawi">Malawi</option>
        <option value="Maldives">Maldives</option>
        <option value="Mali">Mali</option>
        <option value="Malta">Malta</option>
        <option value="Marshall Islands">Marshall Islands</option>
        <option value="Martinique">Martinique</option>
        <option value="Mauritania">Mauritania</option>
        <option value="Mauritius">Mauritius</option>
        <option value="Mayotte">Mayotte</option>
        <option value="Mexico">Mexico</option>
        <option value="Midway Islands">Midway Islands</option>
        <option value="Moldova">Moldova</option>
        <option value="Monaco">Monaco</option>
        <option value="Mongolia">Mongolia</option>
        <option value="Montserrat">Montserrat</option>
        <option value="Morocco">Morocco</option>
        <option value="Mozambique">Mozambique</option>
        <option value="Myanmar">Myanmar</option>
        <option value="Nambia">Nambia</option>
        <option value="Nauru">Nauru</option>
        <option value="Nepal">Nepal</option>
        <option value="Netherland Antilles">Netherland Antilles</option>
        <option value="Netherlands">Netherlands (Holland, Europe)</option>
        <option value="Nevis">Nevis</option>
        <option value="New Caledonia">New Caledonia</option>
        <option value="New Zealand">New Zealand</option>
        <option value="Nicaragua">Nicaragua</option>
        <option value="Niger">Niger</option>
        <option value="Nigeria">Nigeria</option>
        <option value="Niue">Niue</option>
        <option value="Norfolk Island">Norfolk Island</option>
        <option value="Norway">Norway</option>
        <option value="Oman">Oman</option>
        <option value="Pakistan">Pakistan</option>
        <option value="Palau Island">Palau Island</option>
        <option value="Palestine">Palestine</option>
        <option value="Panama">Panama</option>
        <option value="Papua New Guinea">Papua New Guinea</option>
        <option value="Paraguay">Paraguay</option>
        <option value="Peru">Peru</option>
        <option value="Phillipines">Philippines</option>
        <option value="Pitcairn Island">Pitcairn Island</option>
        <option value="Poland">Poland</option>
        <option value="Portugal">Portugal</option>
        <option value="Puerto Rico">Puerto Rico</option>
        <option value="Qatar">Qatar</option>
        <option value="Republic of Montenegro">Republic of Montenegro</option>
        <option value="Republic of Serbia">Republic of Serbia</option>
        <option value="Reunion">Reunion</option>
        <option value="Romania">Romania</option>
        <option value="Russia">Russia</option>
        <option value="Rwanda">Rwanda</option>
        <option value="St Barthelemy">St Barthelemy</option>
        <option value="St Eustatius">St Eustatius</option>
        <option value="St Helena">St Helena</option>
        <option value="St Kitts-Nevis">St Kitts-Nevis</option>
        <option value="St Lucia">St Lucia</option>
        <option value="St Maarten">St Maarten</option>
        <option value="St Pierre & Miquelon">St Pierre & Miquelon</option>
        <option value="St Vincent & Grenadines">St Vincent & Grenadines</option>
        <option value="Saipan">Saipan</option>
        <option value="Samoa">Samoa</option>
        <option value="Samoa American">Samoa American</option>
        <option value="San Marino">San Marino</option>
        <option value="Sao Tome & Principe">Sao Tome & Principe</option>
        <option value="Saudi Arabia">Saudi Arabia</option>
        <option value="Senegal">Senegal</option>
        <option value="Seychelles">Seychelles</option>
        <option value="Sierra Leone">Sierra Leone</option>
        <option value="Singapore">Singapore</option>
        <option value="Slovakia">Slovakia</option>
        <option value="Slovenia">Slovenia</option>
        <option value="Solomon Islands">Solomon Islands</option>
        <option value="Somalia">Somalia</option>
        <option value="South Africa">South Africa</option>
        <option value="Spain">Spain</option>
        <option value="Sri Lanka">Sri Lanka</option>
        <option value="Sudan">Sudan</option>
        <option value="Suriname">Suriname</option>
        <option value="Swaziland">Swaziland</option>
        <option value="Sweden">Sweden</option>
        <option value="Switzerland">Switzerland</option>
        <option value="Syria">Syria</option>
        <option value="Tahiti">Tahiti</option>
        <option value="Taiwan">Taiwan</option>
        <option value="Tajikistan">Tajikistan</option>
        <option value="Tanzania">Tanzania</option>
        <option value="Thailand">Thailand</option>
        <option value="Togo">Togo</option>
        <option value="Tokelau">Tokelau</option>
        <option value="Tonga">Tonga</option>
        <option value="Trinidad & Tobago">Trinidad & Tobago</option>
        <option value="Tunisia">Tunisia</option>
        <option value="Turkey">Turkey</option>
        <option value="Turkmenistan">Turkmenistan</option>
        <option value="Turks & Caicos Is">Turks & Caicos Is</option>
        <option value="Tuvalu">Tuvalu</option>
        <option value="Uganda">Uganda</option>
        <option value="United Kingdom">United Kingdom</option>
        <option value="Ukraine">Ukraine</option>
        <option value="United Arab Erimates">United Arab Emirates</option>
        <option value="United States of America">United States of America</option>
        <option value="Uraguay">Uruguay</option>
        <option value="Uzbekistan">Uzbekistan</option>
        <option value="Vanuatu">Vanuatu</option>
        <option value="Vatican City State">Vatican City State</option>
        <option value="Venezuela">Venezuela</option>
        <option value="Vietnam">Vietnam</option>
        <option value="Virgin Islands (Brit)">Virgin Islands (Brit)</option>
        <option value="Virgin Islands (USA)">Virgin Islands (USA)</option>
        <option value="Wake Island">Wake Island</option>
        <option value="Wallis & Futana Is">Wallis & Futana Is</option>
        <option value="Yemen">Yemen</option>
        <option value="Zaire">Zaire</option>
        <option value="Zambia">Zambia</option>
        <option value="Zimbabwe">Zimbabwe</option>
      </select>
    </div>
    <br />

    <div>
      <div>Location</div>
      <input type="text" name="location" id="location" value={content.location} onChange={onChange} />
    </div>
    <br />

    <div>
      <div>Address</div>
      <input type="text" name="address" id="address" value={content.address} onChange={onChange} />
    </div>
    <br />

    {showUpdateBtn && <button onClick={handleUpdate}>Update</button>}
  </div>)
}

const Notification = ({ user }) => {
  const [pushNotifications, setPushNotifications] = useState(false)
  const [messageNotifications, setMessageNotifications] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(false)
  const [appAutoUpdate, setAppAutoUpdate] = useState(false)
  const [hasChanged, setHasChanged] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      if (user.pushNotifications) { setPushNotifications(true) }
      if (user.messageNotifications) { setMessageNotifications(true) }
      if (user.emailNotifications) { setEmailNotifications(true) }
      if (user.appAutoUpdate) { setAppAutoUpdate(true) }
    }
  }, [user])

  const handleUpdateNotficationSettings = async () => {
    setUpdating(true)
    if (user.uid) {
      let data = {
        pushNotifications, messageNotifications, emailNotifications, appAutoUpdate
      }
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, data).catch(e => {
        setError('Unsuccessfull!, an error occured while updating your settings');
        console.log("Error updating notification settings:", e)
      });
      setHasChanged(false)
      setUpdating(false)
    } else { setUpdating(false); alert('You are not logged-in !') }
  }

  return (
    <>
      <h4>Notification</h4>
      <>
        {/* push notification */}
        <div>
          <span><span className=''>Push Notifications</span></span>
          <label className={styles.switch}>
            <input
              checked={pushNotifications}
              onChange={(e) => { setPushNotifications(e.target.checked); setHasChanged(true) }}
              type="checkbox" />
            <span className={styles.slider}></span>
          </label>
        </div>

        {/* email notification */}
        <div>
          <span><span className=''>Email Notifications</span></span>
          <label className={styles.switch}>
            <input
              checked={emailNotifications}
              onChange={(e) => { setEmailNotifications(e.target.checked); setHasChanged(true) }}
              type="checkbox" />
            <span className={styles.slider}></span>
          </label>
        </div>

        {/* message notification */}
        <div>
          <span><span className=''>Message Notifications</span></span>
          <label className={styles.switch}>
            <input
              checked={messageNotifications}
              onChange={(e) => { setMessageNotifications(e.target.checked); setHasChanged(true) }}
              type="checkbox" />
            <span className={styles.slider}></span>
          </label>
        </div>
      </>

      <br />

      <span><h4>App</h4></span>

      {/* Auto app update */}
      <div>
        <span><span className=''>Auto app update</span></span>
        <label className={styles.switch}>
          <input
            checked={appAutoUpdate}
            onChange={(e) => { setAppAutoUpdate(e.target.checked); setHasChanged(true) }}
            type="checkbox" />
          <span className={styles.slider}></span>
        </label>
      </div>

      {error && <span style={{ color: 'red' }}>{error}</span>}

      <div className="d-flex align-items-center" style={{ margin: 25 }}>
        {hasChanged && <button onClick={handleUpdateNotficationSettings}>update</button>}
        &nbsp; &nbsp;
        {updating && <img src="/loader.gif" width="30" height="30" alt="" />}
      </div>
    </>
  )
}

const Password = ({ user }) => {
  return (<div>
    <div>
      <div>Location</div>
      <input type="text" name="location" id="location" />
    </div>
    <br />
  </div>)
}

const Verify = ({ user }) => {
  const [isVerify, setIsVerify] = useState(false)
  const [hasRequested, setHasRequested] = useState(false)
  const [fullName, setFullName] = useState(null)
  const [docForVerification, setDocForVerification] = useState(null)
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (user) {
      if (user.verified) {
        setIsVerify(true)
      }
      if (user.hasRequestedForAccVerification) {
        setHasRequested(true)
      }
    }
  }, [user])

  const verifyAccount = () => {
    if (auth.currentUser && user?.email) {
      if (fullName && docForVerification) {
        setProgress(1)
        const storage = getStorage();
        const storageRef = ref(storage, `VerificationFiles/${docForVerification.name}`)
        const uploadTask = uploadBytesResumable(storageRef, docForVerification)
        // .put(docForVerification);
        uploadTask.on("state_change", (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setProgress(progress);

          switch (snapshot.state) {
            case 'paused':
              // console.log('Upload is paused');
              break;
            case 'running':
              // console.log('Upload is running');
              break;
          }
        },
          (error) => {
            console.log(error);
            alert(error.message)
          },
          () => {
            // complete function...
            // storage.ref('VerificationFiles').child(docForVerification.name).getDownloadURL()
            getDownloadURL(uploadTask.snapshot.ref)
              .then(async (url) => {
                let email = user.email;
                let displayName = user.displayName;
                var data = { fullName, url, email, displayName }
                const userRef = doc(db, "users", auth.currentUser.uid);

                await updateDoc(userRef, {
                  reqVerificationDate: new Date(),
                  docForVerification: url,
                  hasRequestedForAccVerification: true
                })
                const verifyAccountRef = doc(db, "verifyAccount", auth.currentUser.uid);
                setDoc(verifyAccountRef, data);

                setProgress(0);
                setDocForVerification(null);
                alert('Your account will be verified soon');
                // setHasRequested(true)
              });
          }
        );
      } else { alert(`You have not tell us your name :(`) }
    } else { console.log('error') }
  }

  return (
    <div>
      <h2>Verify Account</h2>

      {!isVerify && !hasRequested ? <>
        <div className="margin-top">
          <span className='txt'>Full name</span>
          <br />

          <input id="fullName"
            value={fullName}
            onChange={(e) => { setFullName(e.target.value) }}
            type="text" className="classctl" />
        </div>

        <div className="margins-top">
          <h3><strong>Upload document</strong></h3>
          <p>let us verify you well via document(s) uploads</p>

          <input className="docForVerification"
            // value={docForVerification}
            onChange={(e) => {
              setDocForVerification(e.target.files[0])
            }}
            type="file" id="fileupload" hidden />
          <br />

          <div className="d-flex align-items-center">
            <label htmlFor="fileupload">Upload file</label>
            <span style={{ marginLeft: '15px' }}>{docForVerification ? (docForVerification.name)?.toString() : "Choose a file"}</span>
          </div>

          <br />

          {progress > 0 && <progress value={progress} max='100' />}


          <div className="requestdoc d-flex align-items-center">
            <button onClick={verifyAccount} className="btnSolid" style={{ cursor: 'pointer' }}>Request</button>
            {progress >= 1 && progress <= 100 && <span style={{ marginLeft: '15px' }}>
              <img src="/loading.gif" alt="" width="30" height='30' />
            </span>}
          </div>
        </div>
      </> :
        <>
          {!hasRequested ? <strong>Verified!</strong> : <strong>Your verification is in process ...
            {/* <img src="/loader.gif" alt="" width={20} height={20} /> */}
          </strong>}
        </>
      }

    </div>
  )
}

const DeleteAccount = ({ user }) => {
  const deleteAccount = async () => {
    if (auth.currentUser) {
      if (window.confirm('Are you sure?')) {
        const reqToDelAccRef = doc(db, 'reqToDelAcc', auth.currentUser?.uid);
        await setDoc(reqToDelAccRef, {
          uid: auth.currentUser?.uid,
          email: auth.currentUser?.email,
          phoneNumber: auth.currentUser?.phoneNumber,
          createdAt: new Date
        })
        const userRef = doc(db, 'users', auth.currentUser?.uid);
        await updateDoc(userRef, {
          requestedDeleteAcc: true
        })
      }
    } else { alert('You can\'t delete this account!') }
  }

  const cancilRequestedDeleteAcc = async () => {
    const userRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(userRef, { requestedDeleteAcc: false })
  }

  return (

    <>
      <h2>Delete account</h2>
      <p>Account will be deactivated and <span>deleted after 10days</span> if delete request is not cancelled.</p>
      <p><span>Note: all account informations will be lost after account is deleted</span></p>
      <div style={{  }} />
      <div>
        {!user?.requestedDeleteAcc ?
          <button onClick={deleteAccount}>Request delete</button> :
          <div className="d-flex align-items-center">
            <span style={{ color: 'red', marginRight: '10px' }}>Your request is under process</span>
            <button className="btnSolid" style={{ cursor: 'pointer' }} onClick={cancilRequestedDeleteAcc}>Cancil</button>
          </div>
        }
      </div>
    </>
  )
}

const AboutUs = ({ user }) => {
  return (<div>
    <h3>About us</h3>

    <p><strong style={{ fontWeight: 400 }}>Contact us at</strong> - <span style={{ color: '#eb004e' }}>
      <Link href='maito'><a>support@Ohyanga.com</a></Link>
      </span></p>
  </div>)
}