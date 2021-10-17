const USER_CACHE="USER_CACHE"
const TWO_WEEKS = 1000 * 60 * 60 * 24 * 14

const currentTime=()=>{
    return Date.now()
}

const getUserCache=()=>{

    let userCache={
        data:{},
        nextCleanup:new Date().getTime()+TWO_WEEKS
    }  

    try {
        const data = localStorage.getItem('user')

        if(data){
            userCache = JSON.parse(data)
        }
    }
    catch(e){
        console.error(e.message)
    }

    return userCache
}

const setUserToCache=(cacheName, user)=>{

    const userCache=getUserCache()
    const data=userCache.data


    const item={
        id:cacheName,
        expiry:new Date().getTime()+TWO_WEEKS,
        user
    }

    data[cacheName]=item

    try{
        localStorage.setItem(cacheName, JSON.stringify(userCache))
    }
    catch(e){
        cleanUpStorage(data)
    }

}

const cleanUpStorage=(data)=>{

    let isDeleted
    let oldest
    let oldestKey


    //if 14 days have been passed, it removes the cache
    for (const key in data) {
        const expiry = data[key].expiry
        if (expiry && expiry <=currentTime()) {
          delete data[key]
          isDeleted = true
        }
    
        //finding the oldest cache in case none of them are expired
        if (!oldest || oldest > expiry) {
          oldest = expiry
          oldestKey=key
        }
    }

    //remove the oldest cache if there is no more space in local storage (5 MB)
    if(!isDeleted && oldestKey){
        delete data[oldestKey]
    }

    localStorage.setItem(
        USER_CACHE,
        JSON.stringify({
          data: data,
          nextCleanup:currentTime() + TWO_WEEKS,
        })
    )

}

export {setUserToCache,getUserCache}