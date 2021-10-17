import { auth, db, storage } from "./firebase";

export const uploadToFirebase = (imageFile, fileName, setProgress) => {
  const currentUser = auth.currentUser;

  if (currentUser?.uid) {
    var file = new File([imageFile], fileName, { type: "image/png" });
    const ref = `images/${currentUser?.uid}/${fileName}`;
    const uploadTask = storage.ref(ref).put(file);

    uploadTask.on("state_change", (snapshot) => {
      const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      setProgress(progress)
      if (snapshot.bytesTransferred === snapshot.totalBytes) {
        // success
      }
    }, (error) => { 
      console.log(error.message)
     },
      () => {
        // setShowProgBar(false)
        storage
          .ref(ref)
          .getDownloadURL()
          .then(url => {
            db.collection('users').doc(currentUser?.uid).collection('images').add({ fileName, url, createdAt: new Date });
          });
      }
    );
  } else {
    alert('You have to login to continue');
    // triggerAuthUser(true)
  }
};

export async function outOfStock(id) {
  await db.collection('products').doc(id).delete();
  return 'success'
}

export async function deleteImagesFromML(uid, checkedImageList) {
  let totalLength = checkedImageList?.length;
  var length = 0;
  var isFileNameAvailable = false
  checkedImageList?.forEach(async (image) => {
    length += 1;
    let fileName = image.dataset.filename;
    let imageId = image.dataset.imageid;
    const ref = `images/${uid}/${fileName}`;
    if (uid && fileName) {
      isFileNameAvailable = true
      await db.collection('users').doc(uid).collection('images').doc(imageId).delete();
      await storage.ref(ref).delete();
    } else { isFileNameAvailable = false }
  });

  if (length === totalLength && isFileNameAvailable) {
    return 'success';
  }
  return 'not successful'
}

export function isAccountSavedToDevice(uid) {
  var allUsers = JSON.parse(localStorage.getItem('allUsers'));
  let myArray = allUsers?.filter(function (obj) {
    return obj?.uid === uid;
  });
  if (myArray && myArray?.length > 0) { return true; } else { return false; }
}