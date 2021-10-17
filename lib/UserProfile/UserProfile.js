import { auth } from '../firebase';
import { getUserCache, setUserToCache } from './userProfileCache'

let authUser = auth.currentUser
var cacheUser = getUserCache('user')

var UserProfile = (function () {
  var setUser = function (newUser) {
    if (newUser) {
      setUserToCache('user', newUser);
    }
  };

  var getUser = function () {
    if (authUser) {
      return auth.currentUser
    } else {
      return cacheUser.data?.user?.user
    }
  };

  return { getUser, setUser }

})();

export default UserProfile;