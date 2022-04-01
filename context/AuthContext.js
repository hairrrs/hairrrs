import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { auth } from '../lib/firebase'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthContextProvider = ({
  children,
}) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  // console.log(user)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signup = (email, username, password) => {
    let msg = 'success';
    createUserWithEmailAndPassword(auth, email, password)
    .then(async (authUser) => {
      updateProfile(authUser.user, { displayName: username })
    })
    .catch(e => {
      msg = e.message
    });
    return msg
  }

  const login = async (email, password) => {
    let msg = 'success';
    await signInWithEmailAndPassword(auth, email, password).catch(e => {
      msg = e.message
    });
    return msg
  }

  const logout = async () => {
    setUser(null)
    let msg = 'success';
    await signOut(auth).catch(e => {
      msg = e.message
    });
    return msg
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {loading ? null : children}
    </AuthContext.Provider>
  )
}
