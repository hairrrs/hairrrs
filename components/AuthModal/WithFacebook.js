import React from 'react'

function WithFb() {
  const handleSignIn = () => {
    console.log('logging u in ....')
  }

  return (<>
    <img
      onClick={handleSignIn}
      style={{ margin: '0 5px' }}
      src="/images/facebook-icon-16x16.svg" width="16px" height="16px" alt="Sign in with facebook" />
  </>)
}

export default WithFb
