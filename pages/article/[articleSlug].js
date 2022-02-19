import { useEffect, useState } from "react";
import Link from 'next/link';
import Image from 'next/image';
import HeadMetadata from "../../components/HeadMetadata";
import LayoutA from '../../components/layoutA'
import Nav from '../../components/nav'
import UserProfile from "../../lib/UserProfile/UserProfile";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { collection, doc, onSnapshot, orderBy, query } from "firebase/firestore";
import {
  commentAPI, deleteCommentAPI, disLikeArticleAPI, editDocAPI, getAllArticles,
  getArticleBySlug, hasSavedAPI, likeArticleAPI, saveItem, Unsave, replyCommentAPI, deleteReplyAPI
} from '../../lib/api';
import PostedBy from '../../components/PostedBy';
import style from '../../styles/pages/article.module.css'
import WebShareApi from "../../components/WebShareApi";
import { getDesc, loading } from "../../lib/myFunctions";
import { useRouter } from "next/router";


export default function ArticlePage({ article }) {
  const createArticle = {
    likes: [],
    disLikes: [],
  }
  const router = useRouter()
  const { articleSlug } = router.query

  const [user, setUser] = useState(UserProfile.getUser())
  // user
  useEffect(() => {
    onAuthStateChanged(auth, authUser => {
      if (authUser?.uid) {
        const userRef = doc(db, 'users', authUser?.uid);
        onSnapshot(userRef, doc => {
          doc.exists && setUser({ ...doc.data(), uid: doc.id });
        });
      }
    })
  }, [])

  // const [article, setArticle] = useState([]);
  // useEffect(() => {
  //   if (articleSlug) {
  //     const articleRef = doc(db, 'articles', articleSlug);
  //     onSnapshot(articleRef, doc => {
  //       doc.exists && setArticle({ ...doc.data(), articleId: doc.id })
  //     })
  //   }
  // }, [articleSlug])

  const [comments, setComments] = useState([])
  useEffect(() => {
    const fetch = async () => {
      if (articleSlug) {
        try {
          const commentsRef = collection(db, 'articles', articleSlug, 'comments');
          const q = query(commentsRef, orderBy('updatedAt', 'desc'));
          onSnapshot(q, snapshot => {
            if (!snapshot.empty) {
              setComments(snapshot?.docs?.map(doc => ({ ...doc.data(), commentId: doc?.id })))
            }
          })
        } catch (error) {
          console.log(error)
        }
      }
    }
    return fetch()
  }, [articleSlug])

  const [hasLiked, setHasLiked] = useState(false)
  const [hasDisLiked, setHasDisLiked] = useState(false)
  useEffect(() => {
    if (user && article) {
      let likesArr = article?.likes
      let a = likesArr?.filter(doc => doc.uid === user.uid)
      a?.length > 0 ? setHasLiked(true) : setHasLiked(false);

      let disLikesArr = article?.disLikes
      let b = disLikesArr?.filter(doc => doc.uid === user.uid)
      b?.length > 0 ? setHasDisLiked(true) : setHasDisLiked(false);
    }
  }, [article, user])

  const [hasSaved, setHasSaved] = useState(false)
  useEffect(() => {
    const fetch = () => {
      let res = hasSavedAPI(user?.savedList, article?.articleId)
      setHasSaved(res)
    }
    return fetch()
  }, [article, user])

  if (article) {
    return (<>
      <HeadMetadata
        title={`${article?.title} - Hairrrs`}
        ogImage={article?.mainImage}
      />

      <Nav />

      <LayoutA>
        <div className="flex justify-between">
          <div>
            <div>
              <div style={{ padding: '25px 20px' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 600 }}>{article && article?.title}</div>

                <div className="flex items-center" style={{ gap: '1rem', fontSize: '.7rem', marginTop: '10px' }}>
                  <div style={{ padding: '3px 5px', background: 'black', color: 'white', borderRadius: 5 }}>{article && article?.category}</div>
                  <div>{article && article?.updatedAt}</div>
                </div>
              </div>

              <div><hr style={{ width: '100%' }} /></div>
            </div>

            <div className="flex" style={{ gap: '1rem', margin: '20px 0', padding: '0 20px' }}>
              <div>{article?.likes?.length} Likes</div>
              <div>{article?.disLikes?.length} Dislikes</div>
              <div>{comments?.length} comments</div>
            </div>

            <div>
              <Image src="/images/0_NEgmVl2J_RRzI9Sr.jpg" alt={article?.title} width="1000px" height="600px" />
            </div>

            <div>
              {/* body */}
              <p style={{ fontSize: '16px', marginTop: 5, lineHeight: '26px', color: '#333', fontWeight: 400 }}>{article?.body}</p>

              <div style={{ padding: '5px 35px' }}>
                {/* share.... */}
                <div className="flex flex-wrap" style={{ gap: '1.3rem', margin: '30px 0' }}>
                  {hasLiked ?
                    <div
                      className="flex items-center"
                      style={{ gap: '.5rem', cursor: 'pointer', padding: '5px 10px', borderRadius: 5, background: '#eb004e', color: 'white' }}>
                      <Image src="/images/Icon feather-thumbs-up.png" alt="like" width="20px" height="20px" />
                      <div className="likes_count">{article?.likes?.length}</div>
                    </div> :
                    <div
                      onClick={async () => {
                        loading('open');
                        let res = await likeArticleAPI(article?.articleId, article?.likes, article?.disLikes, user)
                        res === 'success' && setHasLiked(true);
                        hasDisLiked && setHasDisLiked(false);
                        loading('close');
                      }}
                      className="flex items-center"
                      style={{ gap: '.5rem', cursor: 'pointer', padding: '5px 10px', borderRadius: 5, background: '#d0d0d0' }}>
                      <Image src="/images/Icon feather-thumbs-up.png" alt="like" width="20px" height="20px" />
                      <div className="likes_count">{article?.likes?.length}</div>
                    </div>
                  }

                  {hasDisLiked ?
                    <div
                      className="flex items-center"
                      style={{ gap: '.5rem', cursor: 'pointer', padding: '5px 10px', borderRadius: 5, background: '#eb004e', color: 'white' }}>
                      <Image src="/images/Icon feather-thumbs-down.png" alt="dislike" width="20px" height="20px" />
                      <div className="disLikes_count">{article?.disLikes?.length}</div>
                    </div> :
                    <div
                      onClick={async () => {
                        loading('open');
                        let res = await disLikeArticleAPI(article?.articleId, article?.likes, article?.disLikes, user)
                        res === 'success' && setHasDisLiked(true);
                        hasLiked && setHasLiked(false);
                        loading('close');
                      }}
                      className="flex items-center"
                      style={{ gap: '.5rem', cursor: 'pointer', padding: '5px 10px', borderRadius: 5, background: '#d0d0d0' }}>
                      <Image src="/images/Icon feather-thumbs-down.png" alt="dislike" width="20px" height="20px" />
                      <div className="disLikes_count">{article?.disLikes?.length}</div>
                    </div>
                  }

                  {hasSaved ?
                    <div
                      onClick={async () => {
                        loading('open');
                        let res = await Unsave(user, article?.articleId)
                        res === 'success' && setHasSaved(false);
                        loading('close');
                      }}
                      className="flex items-center"
                      style={{ gap: '.5rem', cursor: 'pointer', padding: '5px 10px', borderRadius: 5, background: '#eb004e', color: 'white' }}>
                      <Image src="/images/savebtn.png" alt="save" width="20px" height="20px" />
                      <div>Unsave</div>
                    </div> :
                    <div
                      onClick={async () => {
                        loading('open');
                        let res = await saveItem(user, article?.articleId, article?.mainImage, getDesc(article?.body, 60), `/article/${article?.slug}`, 'article');
                        res === 'success' && setHasSaved(true);
                        loading('close');
                      }}
                      className="flex items-center"
                      style={{ gap: '.5rem', cursor: 'pointer', padding: '5px 10px', borderRadius: 5, background: '#d0d0d0' }}>
                      <Image src="/images/savebtn.png" alt="save" width="20px" height="20px" />
                      <div>Save</div>
                    </div>
                  }
                  <WebShareApi url={`https://hairrrs.vercel.app/article/${article?.slug}`} title={article?.title} text={getDesc(article?.body, 60)} />
                </div>

                {/* comment */}
                <div className="flex" style={{ gap: '1rem', padding: '10px 15px', border: '1px solid rgb(183 183 183)', borderRadius: 10, width: '100%' }}>
                  <div>
                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', overflow: 'hidden' }}>
                      {user?.photoURL && <Image src={user?.photoURL} alt={user?.displayName} width="50px" height="50px" />}
                    </div>
                  </div>

                  <div style={{ marginTop: '10px', width: '90%' }}>
                    <form onSubmit={async (e) => {
                      // loading('open');
                      e.preventDefault();
                      const commentInput = document.querySelector('#comment');
                      let res = await commentAPI(user, commentInput?.value, article?.articleId)
                      if (res === 'success' && commentInput) { commentInput.value = '' }
                      loading('close');
                    }}>
                      <textarea name="comment" id="comment" placeholder="Write comment" style={{ height: '80px', width: '100%', resize: 'none', border: 'none', outline: 'none' }}></textarea>
                      <div><input type="submit" value="comment" /></div>
                    </form>
                  </div>
                </div>

                <br />
                <div style={{ fontWeight: 600 }}>{comments?.length} Comments</div>

                {/* comments */}
                <br />
                {comments?.length > 0 && <Comments articleId={article?.articleId} allComments={comments} user={user} />}

              </div>
            </div>

            <br />
            <div style={{ padding: '5px 35px', background: '#f1f1f1', color: '#eb004e', fontWeight: 600 }}>
              <p>Trending articles</p>
            </div>
          </div>

          {article?.author && <div className="sm-hidden" style={{ marginTop: 20 }}>
            <PostedBy initialOwner={article?.author} user={user} />
          </div>}
        </div>
      </LayoutA>
    </>)
  } else {
    return (<><h1>ERROR 404: NOT FOUND!</h1></>)
  }
}

const Comments = ({ articleId, allComments, user }) => {
  const commentPerPage = 3;
  const [vcpp, setVcpp] = useState(commentPerPage); // visible comments per page
  const [currentPage, setCurrentPage] = useState(1);
  const [currentComments, setCurrentComments] = useState([]);
  const [indexOfLastComments, setIndexOfLastComments] = useState(0);
  // const [indexOfFirstComments, setIndexOfFirstComments] = useState(0);
  const [lastComment, setLastComment] = useState(null);
  const [otherComments, setOtherComments] = useState([]);

  useEffect(() => {
    setIndexOfLastComments(currentPage * commentPerPage);
    // setIndexOfFirstComments(indexOfLastComments - commentPerPage);
  }, [currentPage])

  useEffect(() => {
    if (allComments) {
      // const comments = allComments?.slice(indexOfFirstComments, indexOfLastComments)
      const comments = allComments?.slice(0, indexOfLastComments)
      comments && setCurrentComments(comments)
    }
  }, [allComments, indexOfLastComments])

  useEffect(() => {
    if (allComments.length > 0) {
      setLastComment(allComments[0])
    }
    if (currentComments.length > 0 && lastComment) {
      const comment = currentComments?.filter(doc => doc?.commentId !== lastComment?.commentId)
      setOtherComments(comment)
      // setOtherComments(currentComments?.slice(1))
    }
  }, [allComments, currentComments, lastComment])


  return (<>
    {/* last comment */}
    {lastComment && <Comment articleId={articleId} comment={lastComment} user={user} openReplyByDefault={true} />}

    {/* other comments */}
    {otherComments?.map(comment => {
      if (comment) {
        return (
          <div key={comment?.commentId} style={{ margin: '20px 0' }}>
            <Comment articleId={articleId} comment={comment} user={user} openReplyByDefault={false} />
          </div>
        )
      }
    })}

    {allComments
      && allComments?.length > commentPerPage
      && allComments?.length > currentComments?.length
      && <div onClick={() => {
        setCurrentPage(currentPage + 1);
      }} style={{ color: '#eb004e', cursor: 'pointer' }}>see more</div>}


  </>)
}

const Comment = ({ articleId, comment, user, openReplyByDefault }) => {
  const [docToEdit, setDocToEdit] = useState(null);
  const [openReplies, setOpenReplies] = useState(false);
  const [openReplyTextArea, setOpenReplyTextArea] = useState(openReplyByDefault);

  const toggleMenu = (id) => {
    const menu = document.querySelector(`#threeDotMenu_${id}`)
    if (menu) {
      if (menu.style.display === 'none') {
        menu.style.display = 'flex';
      } else {
        menu.style.display = 'none';
      }
    }
  }

  return (<>
    {docToEdit && <Edit articleId={articleId} setDocToEdit={setDocToEdit} docToEdit={docToEdit} />}
    <div style={{ padding: '15px 25px', background: "#f1f0f0", borderRadius: 10 }}>
      <div className="md-flex" style={{ gap: '1.2rem', padding: '10px 15px', borderRadius: 10 }}>
        <div>
          <div style={{ width: '35px', height: '35px', borderRadius: '50%', overflow: 'hidden', background: '#eb004e' }}>
            {comment?.user?.photoURL && <Image src={comment?.user?.photoURL} alt={comment?.user?.displayName} width="35px" height="35px" />}
          </div>
        </div>
        <div className="flex justify-between" style={{ width: '100%' }}>
          <div>{comment?.comment}</div>

          <div style={{ position: 'relative' }}>
            <div onClick={() => { toggleMenu(comment?.commentId) }}>
              <Image src="/images/Group 1192.svg" alt="" width="38px" height="7px" />
            </div>

            <div id={`threeDotMenu_${comment?.commentId}`} className="flex-column" style={{ gap: '1.2rem', display: 'none', position: 'absolute', top: '30px', right: 0, background: '#eee', boxShadow: '#7f7f7f33 0px 0px 4px 0px', padding: '10px 20px' }}>
              <div
                onClick={() => { setOpenReplyTextArea(!openReplyTextArea); toggleMenu(comment?.commentId) }}
                style={{ cursor: 'pointer' }}>Reply</div>

              {user?.uid !== comment?.user?.uid && <Link href={`/?report_modal=true&itemId=${comment?.commentId}`}><a>
                Report
              </a></Link>}

              {user?.uid === comment?.user?.uid && <>
                <div
                  onClick={() => { setDocToEdit({ ...comment, type: 'comment' }) }}
                  style={{ cursor: 'pointer' }}>Edit</div>

                <div onClick={async () => {
                  if (window.confirm('Do you want to delete your comment?')) {
                    loading('open')
                    let res = await deleteCommentAPI(articleId, comment?.commentId)
                    setOpenReplyTextArea(!openReplyTextArea);
                    loading('close')
                  }
                }} style={{ cursor: 'pointer' }}>Delete</div>
              </>}
            </div>
          </div>
        </div>
      </div>

      <div
        onClick={() => { setOpenReplies(!openReplies); setOpenReplyTextArea(true); }}
        style={{ padding: '10px 30px', background: 'white', color: "#bbb", margin: '10px 0', cursor: 'pointer' }}>
        View {comment?.replies?.length} replies
      </div>

      {openReplies && <Replies user={user} articleId={articleId} commentId={comment?.commentId} replies={comment?.replies} docToEdit={docToEdit} setDocToEdit={setDocToEdit} />}

      {openReplyTextArea && <div className="flex" style={{ gap: '1rem', padding: '10px 15px', background: 'white', borderRadius: 10 }}>
        <div>
          <div style={{ width: '50px', height: '50px', borderRadius: '50%', overflow: 'hidden' }}>
            {user?.photoURL && <Image src={user?.photoURL} alt={user?.displayName} width="50px" height="50px" />}
          </div>
        </div>

        <div style={{ marginTop: '10px', width: '90%' }}>
          <form onSubmit={async (e) => {
            e.preventDefault();
            // loading('open');
            const replyInput = document.querySelector(`#reply_${comment?.commentId}`);
            let res = await replyCommentAPI(user, articleId, comment?.commentId, comment, replyInput?.value)
            if (res === 'success' && replyInput) { replyInput.value = '' }
            !res && console.log(res);
            setOpenReplies(true); // setOpenReplyTextArea(false);
            loading('close');
          }}>
            <textarea name="reply" id={`reply_${comment?.commentId}`} placeholder="Reply..." style={{ height: '50px', width: '100%', resize: 'none', border: 'none', outline: 'none' }}></textarea>
            <div><input type="submit" value="reply" /></div>
          </form>
        </div>
      </div>}
    </div>
  </>)
}

const Replies = ({ user, articleId, commentId, replies }) => {
  const [docToEdit, setDocToEdit] = useState(null);
  const toggleMenu = (id) => {
    const menu = document.querySelector(`#threeDotMenu_${id}`)
    if (menu) {
      if (menu.style.display === 'none') {
        menu.style.display = 'flex';
      } else {
        menu.style.display = 'none';
      }
    }
  }

  return (<>
    {docToEdit && <Edit
      articleId={articleId}
      setDocToEdit={setDocToEdit}
      docToEdit={docToEdit}
      replies={replies} />}

    {replies?.map((reply, index) => {
      return (
        <div key={index} style={{ padding: '15px 25px', background: "#f1f0f0", borderRadius: 10 }}>
          <div className="md-flex" style={{ gap: '1.2rem', padding: '10px 15px', borderRadius: 10 }}>
            <div>
              <div style={{ width: '35px', height: '35px', borderRadius: '50%', overflow: 'hidden', background: '#eb004e' }}>
                {reply?.user?.photoURL && <Image src={reply?.user?.photoURL} alt={reply?.user?.displayName} width="35px" height="35px" />}
              </div>
            </div>

            <div className="flex justify-between" style={{ width: '100%' }}>
              <div>{reply?.reply}</div>

              <div style={{ position: 'relative' }}>
                <div onClick={() => { toggleMenu(reply?.replyId) }}>
                  <Image src="/images/Group 1192.svg" alt="" width="38px" height="7px" />
                </div>

                <div id={`threeDotMenu_${reply?.replyId}`} className="flex-column" style={{ gap: '1.2rem', display: 'none', position: 'absolute', top: '30px', right: 0, background: '#eee', boxShadow: '#7f7f7f33 0px 0px 4px 0px', padding: '10px 20px' }}>
                  {user?.uid !== reply?.user?.uid && <Link href={`/?report_modal=true&itemId=${reply?.replyId}`}><a>
                    Report
                  </a></Link>}

                  {user?.uid === reply?.user?.uid && <>
                    <div
                      onClick={() => { setDocToEdit(reply); toggleMenu(reply?.replyId); }}
                      style={{ cursor: 'pointer' }}>Edit</div>

                    <div onClick={async () => {
                      if (window.confirm('Do you want to delete your reply to this comment?')) {
                        loading('open')
                        let res = await deleteReplyAPI(user, replies, reply)
                        toggleMenu(reply?.replyId)
                        loading('close')
                      }
                    }} style={{ cursor: 'pointer' }}>Delete</div>
                  </>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    })}
  </>)
}

const Edit = ({ articleId, docToEdit, setDocToEdit, replies }) => {
  return (<>
    <div
      className="flex justify-center items-center"
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', background: 'rgba(0,0,0,0.4)', zIndex: 2 }}>
      <div style={{ padding: '20px 40px', background: 'white', color: 'black' }}>
        <form onSubmit={async (e) => {
          e.preventDefault();
          // loading('open');
          const body = document.querySelector('#editArea').value
          let res = await editDocAPI(articleId, docToEdit, body, replies);
          setDocToEdit(null);
          loading('close')
        }}>
          <div>
            <textarea
              name="editArea"
              id="editArea"
              style={{ width: '100%' }}
              cols="30" rows="10">
              {docToEdit?.comment || docToEdit?.reply || ''}
            </textarea>
          </div>
          <div>
            <input type="submit" value="edit" />
          </div>
        </form>
      </div>
    </div>
  </>)
}

export async function getStaticProps({ params }) {
  const { articleSlug } = params
  const article = await getArticleBySlug(articleSlug).then(res => res);
  console.log(article)

  if (!!article?.length > 0) {
    return {
      props: {
        article: article[0],
      },
      revalidate: 1
    }
  } else {
    return {
      notFound: true
    }
  }
}

export async function getStaticPaths() {
  const articles = await getAllArticles();
  return {
    paths:
      articles?.data?.map(article => ({
        params: {
          articleSlug: article?.slug,
        },
      })) || [],
    fallback: true,
  }
}