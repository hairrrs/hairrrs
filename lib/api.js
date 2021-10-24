import { auth, db } from "./firebase";
import { collection, query, orderBy, where, doc, getDocs, getDoc,
  getDocFromCache, limit, setDoc, updateDoc, deleteDoc } from "firebase/firestore";

// export const getUser = async () => {
//   const userRef = doc(db, "users", auth?.currentUser?.uid);
//   const userSnapshot = await getDoc(userRef).catch(error => { console.log(error) });
//   if (userSnapshot.exists) {
//     var user = res?.data();
//     var uid = res?.id;
//     const response = { user, uid }
//     return response
//   }
//   // const res = await getDoc(db, 'users', auth?.currentUser?.uid).catch(error => { console.log(error) });
// }

export function isAccountSavedToDevice(uid) {
  var allUsers = JSON.parse(localStorage.getItem('allUsers'));
  let myArray = allUsers?.filter(function (obj) {
    return obj?.uid === uid;
  });
  if (myArray && myArray?.length > 0) { return true; } else { return false; }
}

export const getAllProducts = async (docLimit) => {
  // try {
  const productsRef = collection(db, "products");
  let q;
  if (docLimit) {
    q = query(productsRef, orderBy('updatedAt', 'desc'), limit(docLimit));
  } else {
    q = query(productsRef, orderBy('updatedAt', 'desc'));
  }
  const documentSnapshots = await getDocs(q).catch(error => { console.log('getAllProducts error:', error) });
  let data = documentSnapshots.docs.map(doc => ({ ...doc.data(), productId: doc.id }));
  // Get the last visible document
  const lastVisibleItem = documentSnapshots.docs[documentSnapshots.docs.length - 1];
  return { data, lastVisibleItem: JSON.stringify(lastVisibleItem) }
  // } catch (error) {
  //   console.log(error)
  //   return { data: [], lastVisibleItem: [] }
  // }
}

export const getProductsByCategory = async (category, docLimit) => {
  if (category) {
    try {
      const productsRef = collection(db, "products");
      let q;
      if (docLimit) {
        q = query(productsRef, where('category', '==', category.toLowerCase()), orderBy('updatedAt', 'desc'), limit(docLimit));
      } else {
        q = query(productsRef, where('category', '==', category), orderBy('updatedAt', 'desc'));
      }
      const documentSnapshots = await getDocs(q).catch(error => { console.log('getProductsByCategory error:', error) });
      let data = documentSnapshots?.docs.map(doc => ({ ...doc.data(), productId: doc.id }));
      // Get the last visible document
      const lastVisibleItem = documentSnapshots?.docs[documentSnapshots.docs.length - 1];
      // console.log(data)
      return { data, lastVisibleItem: JSON.stringify(lastVisibleItem) }      
    } catch (error) {
      console.log('getProductsByCategory error by trycatch:', error)
    }
  } else {
    return null
  }
}

export const getProductBySlug = async (slug) => {
  if (slug) {
    const productsRef = collection(db, "products");
    const q = query(productsRef, where('slug', '==', slug), orderBy('updatedAt', 'desc'));
    const querySnapshot = await getDocs(q).catch(error => { console.log('getProductBySlug error:', error) });
    let product = querySnapshot.docs.map(doc => ({ ...doc.data(), productId: doc.id }));
    return product
  } else {
    return null
  }
}

export const saveItem = async (user, itemId, mainImage, description, itemLink, type) => {
  if (user) {
    var uid = user?.uid
    if (itemId) {
      let data = {
        photoURL: mainImage,
        description,
        createdAt: new Date(),
        itemLink,
        type
      }
      if (data && uid) {
        const saveList = user?.savedList
        saveList.push({ itemId })
        // console.log(saveList)
        await setDoc(doc(db, "users", uid, "savedList", itemId ), data);
        await updateDoc(doc(db, "users", uid), {
          savedList: saveList
        });
        return 'success'
      }
    }
  } else {
    alert('You have to login to continue');
    return 'authError'
  }
}

export const Unsave = async (user, itemId) => {
  if (user && itemId) {
    const savedList = user?.savedList
    await deleteDoc(doc(db, "users", user?.uid, "savedList", itemId ));
    const newSavedList = savedList?.filter(item => item?.itemId !== itemId)
    await updateDoc(doc(db, "users", user?.uid), {
      savedList: newSavedList ? newSavedList : []
    });
    return 'success'
  } else {
      alert('You have to login to continue');
      return 'authError || itemId not specified!'
  }
}

export const hasSaved = (saveList, id) => {
  let r = saveList?.filter(item => item.id === id);
  if (r?.length !== 0) { return true } else { return false }
}