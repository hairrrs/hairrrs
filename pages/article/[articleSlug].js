import { useEffect, useState } from "react";
import Link from 'next/link';
import Image from 'next/image';
import HeadMetadata from "../../components/HeadMetadata";
import LayoutA from '../../components/layoutA'
import Nav from '../../components/nav'
import UserProfile from "../../lib/UserProfile/UserProfile";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { disLikeArticleAPI, getAllArticles, getArticleBySlug, hasSavedAPI, likeArticleAPI, saveItem, Unsave } from '../../lib/api';
import PostedBy from '../../components/PostedBy';
import style from '../../styles/pages/article.module.css'
import WebShareApi from "../../components/WebShareApi";
import { getDesc, loading } from "../../lib/myFunctions";


export default function ArticlePage({ initialArticle }) {
  const createArticle = {
    likes: [],
    disLikes: [],
  }
  const [user, setUser] = useState(UserProfile.getUser())
  // console.log(user)
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

  const [article, setArticle] = useState(initialArticle);
  useEffect(() => {
    if(initialArticle){
      const articleRef = doc(db, 'articles', initialArticle?.articleId);
      onSnapshot(articleRef, doc => {
        doc.exists && setArticle({ ...doc.data(), articleId: doc.id })
      })
    }
  }, [initialArticle])

  const [hasLiked, setHasLiked] = useState(false)
  const [hasDisLiked, setHasDisLiked] = useState(false)
  useEffect(() => {
    if (user && article) {
      let likesArr = article?.likes
      let a = likesArr?.filter(doc => doc.uid === user.uid)
      a?.length > 0 && setHasLiked(true);

      let disLikesArr = article?.disLikes
      let b = disLikesArr?.filter(doc => doc.uid === user.uid)
      b?.length > 0 && setHasDisLiked(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
      <HeadMetadata title={`${article?.title} - Hairrrs`} ogImage={article?.mainImage} />

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
              <div>233 Likes</div>
              <div>12 Dislikes</div>
              <div>53 comments</div>
            </div>

            <div>
              <Image src="/images/0_NEgmVl2J_RRzI9Sr.jpg" alt={article?.title} width="1000px" height="600px" />
            </div>

            <div style={{ padding: '5px 35px' }}>
              {/* body */}
              <div style={{ fontSize: '1.4rem', fontWeight: 300, letterSpacing: '1px' }}>{article?.body}</div>

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
              <div className="" style={{ gap: '1rem', padding: '10px 15px', border: '1px solid rgb(183 183 183)', borderRadius: 10, width: '100%' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', overflow: 'hidden' }}>{user?.photoURL && <Image src={user?.photoURL} alt={user?.displayName} width="50px" height="50px" />}</div>
                <form style={{ marginTop: '20px' }}>
                  <textarea name="comment" id="comment" placeholder="Write comment" rol="30" col="10" style={{ resize: 'none', border: 'none', outline: 'none' }}></textarea>
                  <div><input type="submit" value="comment" /></div>
                </form>
              </div>

              <br />
              <div style={{ fontWeight: 600 }}>53 Comments</div>

              {/* comments */}
              {/* last comment */}
              <br />
              <div style={{ padding: '15px 25px', background: "#f1f0f0", borderRadius: 10 }}>
                <div className="flex" style={{ gap: '1rem', padding: '10px 15px', borderRadius: 10, width: '100%' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '50%', overflow: 'hidden' }}>{user?.photoURL && <Image src={user?.photoURL} alt={user?.displayName} width="50px" height="50px" />}</div>
                  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur, necessitatibus placeat nisi vitae optio nobis inventore vel fugit quidem mollitia.</p>
                </div>

                <div style={{ padding: '10px 30px', background: 'white', color: "#bbb", margin: '10px 0' }}>View 3 replies</div>

                <div className="flex" style={{ gap: '1rem', padding: '10px 15px', background: 'white', borderRadius: 10, width: '100%' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '50%', overflow: 'hidden' }}>{user?.photoURL && <Image src={user?.photoURL} alt={user?.displayName} width="50px" height="50px" />}</div>
                  <form style={{ marginTop: '20px' }}>
                    <textarea name="comment" id="comment" placeholder="Write comment" style={{ height: '100px', resize: 'none', border: 'none', outline: 'none', color: "#bbb" }}></textarea>
                    <div><input type="submit" value="Reply" /></div>
                  </form>
                </div>
              </div>

              {/* other comments */}
              <br />
              <div style={{ padding: '15px 25px', background: "#f1f0f0", borderRadius: 10 }}>
                <div className="flex" style={{ gap: '1rem', padding: '10px 15px', borderRadius: 10, width: '100%' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '50%', overflow: 'hidden' }}>{user?.photoURL && <Image src={user?.photoURL} alt={user?.displayName} width="50px" height="50px" />}</div>
                  <div className="flex-column">
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur, necessitatibus placeat...</p>
                    <div style={{ color: '#eb004e' }}>View 3 replies</div>
                  </div>
                  <div><Image src="/images/Icon feather-chevron-downBLACK.svg" alt="" width="22px" height="12px" /></div>
                </div>
              </div>

              <div>
                <p style={{ color: '#eb004e' }}>see more</p>
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

export async function getStaticProps({ params }) {
  const { articleSlug } = params
  console.log(articleSlug)
  const article = await getArticleBySlug(articleSlug).then(res => res);
  console.log(article)

  if (!!article?.length > 0) {
    return {
      props: {
        initialArticle: article[0],
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