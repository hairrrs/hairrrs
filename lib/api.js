import { db } from "./firebase";
import {
  collection, query, orderBy, where, doc, getDoc, getDocs,
  limit, setDoc, updateDoc, deleteDoc, increment, writeBatch
} from "firebase/firestore";
import UserProfile from "./UserProfile/UserProfile";

var user = UserProfile.getUser();

export const getUser = async () => {
  try {
    const userRef = doc(db, 'users', user?.uid)
    let res = await getDoc(userRef);
    if (res.exists()) {
      return ({ ...res.data(), uid: res.id })
    }
    return null
  } catch (error) {
    console.log(error)
  }
}

export const getUserById = async (uid) => {
  try {
    const userRef = doc(db, 'users', uid)
    let res = await getDoc(userRef);
    if (res.exists()) {
      return ({ ...res.data(), uid: res.id })
    }
    return null
  } catch (error) {
    console.log(error)
  }
}

export const updateLocalUser = async () => {
  let a = await getUser();
  UserProfile.setUser(a);
  return a
}

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
    let product = querySnapshot?.docs?.map(doc => ({ ...doc.data(), productId: doc.id }));
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
        await setDoc(doc(db, "users", uid, "savedList", itemId), data);
        await updateDoc(doc(db, "users", uid), {
          savedList: saveList
        });
        return 'success'
      }
    }
    return 'itemIdError'
  } else {
    alert('You have to login to continue');
    return 'authError'
  }
}

export const Unsave = async (user, itemId) => {
  if (user && itemId) {
    const savedList = user?.savedList
    const newSavedList = savedList?.filter(item => item?.itemId !== itemId)
    await deleteDoc(doc(db, "users", user?.uid, "savedList", itemId));
    await updateDoc(doc(db, "users", user?.uid), {
      savedList: newSavedList ? newSavedList : []
    });
    return 'success'
  } else {
    alert('You have to login to continue');
    return 'authError || itemId not specified!'
  }
}

export const hasSavedAPI = (savedList, id) => {
  let r = savedList?.filter(item => item.itemId === id);
  if (r?.length !== 0) { return true } else { return false }
}

export const updatePageViewAPI = async (productId) => {
  await updateDoc(doc(db, 'products', productId), {
    totalView: increment(1)
  })
}

export const updateUserPageViewed = async (url, title) => {
  const viewedPages = user?.viewedPages // [{ url: '', title: '', data: new Date }]
  viewedPages.push({ url, title, data: new Date })
  await updateDoc(doc(db, 'users', user?.uid), {
    viewedPages
  })
}

export const requestcall = async (product) => {
  if (user) {
    if (product?.seller?.uid !== user?.uid) {
      const d = {
        itemTitle: product?.title,
        itemPrice: product?.price,
        itemType: 'requestedCalls',
        itemLink: `/product/${product?.productId}`,
        createdAt: new Date()
      }
      const data = {
        ...d,
        displayName: user?.displayName,
        photoURL: user.photoURL,
        email: user.email,
        phone: user.phoneNumber,
      };
      const batch = writeBatch(db);
      batch.set(doc(db, "users", product?.seller?.uid, "history", `${product?.productId}_requestedCalls`), data);
      batch.set(doc(db, "users", user?.uid, "history", `${product?.productId}_requestedCalls`), { ...d });
      await batch.commit().catch(error => console.log(error));
      return 'success';
    } else {
      return "You can't request call from your own item!";
    }
  } else {
    return "You have to login to continue";
  }
}

export const deleteRequestcall = async (sellerId, productId) => {
  if (sellerId) {
    const batch = writeBatch(db);
    batch.delete(doc(db, 'users', sellerId, 'history', `${productId}_requestedCalls`))
    batch.delete(doc(db, 'users', user?.uid, 'history', `${productId}_requestedCalls`))
    await batch.commit();
    return 'success'
  }
}

export const hasRequestedCallAPI = async (uid, productId) => {
  const docRef = doc(db, 'users', uid, 'history', `${productId}_requestedCalls`);
  let res = await getDoc(docRef);
  if (res.exists()) { return true }
  return false
}

export const followAPI = async (personToFollow, user) => {
  try {
    if (personToFollow && user) {
      var followers = personToFollow?.followers;
      if (followers) {
        followers?.push({ uid: user?.uid, displayName: user?.displayName, photoURL: user?.photoURL })
      } else {
        followers = [{ uid: user?.uid, displayName: user?.displayName, photoURL: user?.photoURL }]
      }
    
      var following = user?.following;
      if (following) {
        following?.push({ uid: personToFollow?.uid, displayName: personToFollow?.displayName, photoURL: personToFollow?.photoURL })
      } else {
        following = [{ uid: personToFollow?.uid, displayName: personToFollow?.displayName, photoURL: personToFollow?.photoURL }]
      }

      const batch = writeBatch(db);
      batch.update(doc(db, 'users', personToFollow?.uid), { followers });
      batch.update(doc(db, 'users', user?.uid), { following });
      await batch.commit();
      return 'success';
    } else {
      return 'error'
    }
  } catch (error) {
    console.log(error)
    return 'error'
  }
}

export const unFollowAPI = async (personToUnfollow, user) => {
  try {
    if (personToUnfollow && user) {
      const followers = personToUnfollow?.followers?.filter(doc => doc.uid !== user?.uid)
      const following = user?.following?.filter(doc => doc.uid !== personToUnfollow?.uid)
      
      const batch = writeBatch(db);
      batch.update(doc(db, 'users', personToUnfollow?.uid), { followers });
      batch.update(doc(db, 'users', user?.uid), { following });
      await batch.commit();
      return 'success';
    } else {
      return 'error'
    }
  } catch (error) {
    console.log(error)
    return 'error'
  }
}

// .........article........

export const getAllArticles = async (docLimit) => {
  // try {
  const articlesRef = collection(db, "articles");
  let q;
  if (docLimit) {
    q = query(articlesRef, orderBy('updatedAt', 'desc'), limit(docLimit));
  } else {
    q = query(articlesRef, orderBy('updatedAt', 'desc'));
  }
  const documentSnapshots = await getDocs(q).catch(error => { console.log('getAllArticles error:', error) });
  let data = documentSnapshots.docs.map(doc => ({ ...doc.data(), articleId: doc.id }));
  // Get the last visible document
  const lastVisibleItem = documentSnapshots.docs[documentSnapshots.docs.length - 1];
  return { data, lastVisibleItem: JSON.stringify(lastVisibleItem) }
  // } catch (error) {
  //   console.log(error)
  //   return { data: [], lastVisibleItem: [] }
  // }
}

export const getArticlesByCategory = async (category, docLimit) => {
  if (category) {
    try {
      const articlesRef = collection(db, "articles");
      let q;
      if (docLimit) {
        q = query(articlesRef, where('category', '==', category.toLowerCase()), orderBy('updatedAt', 'desc'), limit(docLimit));
      } else {
        q = query(articlesRef, where('category', '==', category), orderBy('updatedAt', 'desc'));
      }
      const documentSnapshots = await getDocs(q).catch(error => { console.log('getArticlesByCategory error:', error) });
      let data = documentSnapshots?.docs.map(doc => ({ ...doc.data(), articleId: doc.id }));
      // Get the last visible document
      const lastVisibleItem = documentSnapshots?.docs[documentSnapshots.docs.length - 1];
      // console.log(data)
      return { data, lastVisibleItem: JSON.stringify(lastVisibleItem) }
    } catch (error) {
      console.log('getArticlesByCategory error by trycatch:', error)
    }
  } else {
    return null
  }
}

export const getArticleBySlug = async (slug) => {
  if (slug) {
    const articlesRef = collection(db, "articles");
    const q = query(articlesRef, where('slug', '==', slug), orderBy('updatedAt', 'desc'));
    const querySnapshot = await getDocs(q).catch(error => { console.log('getArticlesBySlug error:', error) });
    let article = querySnapshot?.docs?.map(doc => ({ ...doc.data(), articleId: doc.id }));
    return article
  } else {
    return null
  }
}

export const likeArticleAPI = async (articleId, likes, disLikes, user) => {
  if(user){
    let newDisLikes = disLikes.filter(doc => doc.uid !== user?.uid)
    await likes?.push({ uid: user?.uid })
    let newLikes = likes
    await updateDoc(doc(db, 'articles', articleId), {likes: newLikes, disLikes: newDisLikes})
    return 'success'
  }
}

export const disLikeArticleAPI = async (articleId, likes, disLikes, user) => {
  if(user){
    let newLikes = likes.filter(doc => doc.uid !== user?.uid)
    await disLikes.push({ uid: user?.uid })
    let newDisLikes = disLikes
    await updateDoc(doc(db, 'articles', articleId), {likes: newLikes, disLikes: newDisLikes})
    return 'success'
  }
}