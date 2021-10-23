import { db } from "./firebase";
import { collection, query, orderBy, where, getDocs, limit } from "firebase/firestore";

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