// import { formatValue } from 'react-currency-input-field';
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";

var user = auth.currentUser;
var uid = user?.uid

export var month = [];
month[0] = "January";
month[1] = "February";
month[2] = "March";
month[3] = "April";
month[4] = "May";
month[5] = "June";
month[6] = "July";
month[7] = "August";
month[8] = "September";
month[9] = "October";
month[10] = "November";
month[11] = "December";


function strip(html) {
    let doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
}

export const getDesc = (articleStr, limit = 150) => {
    if (articleStr) {
        var str = strip(articleStr)
        str = str.replace(/\s+/g, ' ').trim()
        const res = str.slice(0, limit)
        if (str.length <= limit) {
            return str;
        } else {
            return res + "...";
        }
    }
}


export const getRandomInt = (limit) => {
    return Math.floor(Math.random() * limit) + 1;
}

export function makeid(length) {
    var result = '';
    // var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

export const deleteArticle = (id) => {
    if (id) {
        db.collection('articles').doc(id).delete()
        return `${id} has been deleted successfully`
    }
}

export const save = (id, articleCover, articleTitle, link, type) => {
    if (user) {
        if (id) {
            let data = {
                photoURL: articleCover,
                description: articleTitle,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                link,
                type
            }
            if (data && uid) {
                const usersRef = collection(db, "users");
                db.collection('users').doc(uid).collection('saveList').doc(id).set(data)
            }
        }
    } else {
        alert('You have to login to continue');
        triggerAuthUser(true)
    }
}

export const Unsave = async (id) => {
    if (id && uid) {
        db.collection('users').doc(uid).collection('saveList').doc(id).delete()
    } else {
        alert('You have to login to continue');
        triggerAuthUser(true)
    }
}

export const hasSaved = (saveList, id) => {
    let r = saveList.filter(item => item.id === id);
    if (r.length !== 0) { return true } else { return false }
}

export const followUser = (userId, photoURL, displayName, userName = 'Username') => {
    if (uid) {
        db.collection('users').doc(uid).collection('following').doc(userId).set({
            uid: userId, photoURL, displayName, userName
        })

        db.collection('users').doc(userId).collection('follower').doc(uid).set({
            uid,
            photoURL: user?.map(doc => doc.photoURL),
            displayName: user?.map(doc => doc.displayName),
            userName
            // userName: user?.map(doc => doc.userName )
        })
    }
}

export const unFollowUser = (userId) => {
    if (uid) {
        db.collection('users').doc(uid).collection('following').doc(userId).delete()
        db.collection('users').doc(userId).collection('follower').doc(uid).delete()
    }
}

export const hasFollowed = async (userId) => {
    if (uid) {
        let followerRef = await db.collection('users').doc(userId).collection('follower').doc(uid).get()
        return followerRef.exists
    }

}

export function pasteHtmlAtCaret(html) {
    var sel, range;
    if (window.getSelection) {
        // IE9 and non-IE
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();

            // Range.createContextualFragment() would be useful here but is
            // non-standard and not supported in all browsers (IE9, for one)
            var el = document.createElement("div");
            el.innerHTML = html;
            var frag = document.createDocumentFragment(), node, lastNode;
            while ((node = el.firstChild)) {
                lastNode = frag.appendChild(node);
            }
            range.insertNode(frag);

            // Preserve the selection
            if (lastNode) {
                range = range.cloneRange();
                range.setStartAfter(lastNode);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    } else if (document.selection && document.selection.type !== "Control") {
        // IE < 9
        document.selection.createRange().pasteHTML(html);
    }
}

export function UrlSlug(str, action) {
    if (str) {
        if (action === 'encode') {
            return str.replace(/\s+/g, '-')
        } else {
            return str.replace(/-/g, ' ')
        }
    } else { return str }
}

export const loading = (state = 'open') => {
    var loadingModal = document.querySelector('#loadingModal');
    if (state === 'open') {
        loadingModal.style.display = 'grid'
    } else {
        loadingModal.style.display = 'none'
    }
}

export const isBusinessAvailable = async (slug) => {
    let ref = await db.collection('businesses').doc(slug).get();
    return ref.exists
}

export const customAlert = (msg, state = 'open') => {
    var customAlert = document.querySelector('#customAlert');
    var msgCardBody = document.querySelector('#msgCardBody');

    if (state === 'open') {
        msgCardBody.textContent = msg
        customAlert.style.display = 'grid'
    } else {
        customAlert.style.display = 'none'
    }
}

export const capitalize = (str) => {
    let firstChar = str.charAt(0);
    let remaindingChar = str.slice(1);
    let firstCharUpperCase = firstChar.toUpperCase();
    return `${firstCharUpperCase}${remaindingChar}`
}

export const confirmPasswordMatch = (pass, cpass) => {
    if (pass === cpass) { return true } else { return false }
}

export const isSavedUsersListOpen = () => {
    var allUsers = JSON.parse(localStorage.getItem('allUsers'))
    if (allUsers && allUsers?.length < 4) { return true }
    else { return false }
}

export const ReactToArticle = ({
    reaction,
    articleId,
    disLiked,
    setDisLiked,
    liked,
    articleAuthorUid,
    setLiked,
}) => {
    if (user) {
        const uid = user.uid;
        if (articleId) {
            if (reaction === 'likes') {
                if (disLiked) {
                    db.collection('articles').doc(articleId).collection('disLikes').doc(uid).delete().catch(error => {
                        console.log(error)
                    });
                    db.collection('articles').doc(articleId).update({ totalDisLikes: firebase.firestore.FieldValue.increment(-1) });

                    // db.collection('users').doc(articleAuthorUid).update({
                    //   totalEngagement: firebase.firestore.FieldValue.increment(-1)
                    // })
                    setDisLiked(false)
                }
                if (liked) {
                    db.collection('articles').doc(articleId).collection('likes').doc(uid).delete();
                    db.collection('articles').doc(articleId).update({ totalLikes: firebase.firestore.FieldValue.increment(-1) });

                    db.collection('users').doc(articleAuthorUid).update({
                        totalEngagement: firebase.firestore.FieldValue.increment(-1)
                    })
                    setLiked(false)
                } else {
                    db.collection('articles').doc(articleId).collection('likes').doc(uid).set({ userName: user.userName, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
                    db.collection('articles').doc(articleId).update({ totalLikes: firebase.firestore.FieldValue.increment(1) });

                    db.collection('users').doc(articleAuthorUid).update({
                        totalEngagement: firebase.firestore.FieldValue.increment(1)
                    })
                    setLiked(true)
                }
            }

            if (reaction === 'disLikes') {
                if (liked) {
                    db.collection('articles').doc(articleId).collection('likes').doc(uid).delete();
                    db.collection('articles').doc(articleId).update({ totalLikes: firebase.firestore.FieldValue.increment(-1) });

                    db.collection('users').doc(articleAuthorUid).update({
                        totalEngagement: firebase.firestore.FieldValue.increment(-1)
                    })
                    setLiked(false)
                }
                if (disLiked) {
                    db.collection('articles').doc(articleId).collection('disLikes').doc(uid).delete();
                    db.collection('articles').doc(articleId).update({ totalDisLikes: firebase.firestore.FieldValue.increment(-1) });

                    // db.collection('users').doc(articleAuthorUid).update({
                    //   totalEngagement: firebase.firestore.FieldValue.increment(-1)
                    // })
                    setDisLiked(false)
                } else {
                    db.collection('articles').doc(articleId).collection(reaction).doc(uid).set({ userName: user.userName, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
                    db.collection('articles').doc(articleId).update({ totalDisLikes: firebase.firestore.FieldValue.increment(1) });

                    // db.collection('users').doc(articleAuthorUid).update({
                    //   totalEngagement: firebase.firestore.FieldValue.increment(1)
                    // })
                    setDisLiked(true)
                }
            }

        }
    } else {
        alert('sorry you have to login');
        triggerAuthUser(true);
    }
}