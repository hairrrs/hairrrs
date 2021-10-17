import React from 'react'
import Image from 'next/image'

function WithFb() {
  const handleSignIn = () => {
    console.log('logging u in ....')
  }

  return (
  <div onClick={handleSignIn} style={{ margin: '0 5px' }}>
    <Image src="/images/facebook-icon-16x16.svg" width="16px" height="16px" alt="Sign in with facebook" />
  </div>
  )
}

export default WithFb
