import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import Image from "next/image"
import Link from "next/link";
import { useEffect, useState } from "react";
import { getUserById } from "../lib/api";
import { db } from "../lib/firebase";
import { getDesc } from "../lib/myFunctions";

export default function TrendingArticles({ docLimit = "18" }) {
    const [articles, setArticles] = useState([])
    useEffect(() => {
        const fetch = async () => {
            console.log('Loading trending articles');
            const articlesRef = collection(db, "articles");
            const q = query(articlesRef, orderBy('updatedAt', 'desc'), limit(docLimit));
            const documentSnapshots = await getDocs(q).catch(error => { console.log('TrendingArticles error:', error) });
            let data = documentSnapshots.docs.map(doc => ({ ...doc.data(), articleId: doc.id }));
            // const lastVisibleItem = documentSnapshots.docs[documentSnapshots.docs.length - 1];
            setArticles(data);
        }
        return fetch()
    }, [docLimit])

    return (<>
        <div className="" style={{ background: '#eb004e', color: 'white', textAlign: 'center', padding: '10px' }}><strong>Trending Articles</strong></div>
        <br />
        <div className="flex flex-wrap featuredCatg_wig-body" style={{ gap: '2.5rem', padding: '0 3.9%' }}>
            {articles?.map(article => {
                return <Card key={article.articleId} article={article} />
            })}
        </div>
        <br />
        <div className="flex justify-center">
            <Link href="/articles"><a style={{ color: '#eb004e', padding: '10px 100px', border: '2px solid #eb004e', fontWeight: 600, borderRadius: 5 }}>see more</a></Link>
        </div>
    </>)
}

const Card = ({ article }) => {
    const [author, setAuthor] = useState(null);
    useEffect(() => {
        const fetch = async () => {
            const res = await getUserById(article?.author?.uid);
            setAuthor(res);
        }
        return () => { fetch() }
    }, [article])

    return (
        <div style={{ width: 300 }}>
            <div style={{ padding: '15px 25px', background: '#eb004e', gap: '1rem', height: 140, position: 'relative' }}>
                <Link href="/"><a className="flex items-center">
                    <div className="" style={{ borderRadius: '50%', background: '#fff', width: "43px", height: "43px" }}>
                        {// eslint-disable-next-line @next/next/no-img-element
                            <img src={author?.photoURL} alt={author?.displayName} width="100%" height="100%" style={{ borderRadius: '50%' }} />
                        }
                    </div>
                    <div style={{ padding: '5px 10px', fontSize: '.7rem', borderRadius: 5, marginLeft: 12, background: '#fff' }}><strong>{author?.displayName}</strong></div>
                </a></Link>
                {
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={article?.mainImage} alt="" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
                }
            </div>
            <div className="" style={{ padding: '10px', background: '#fff', boxShadow: 'rgb(0 0 0 / 12%) 0px 1px 7px 0px' }}>
                <div className=""><strong><Link href={`/article/${article?.slug}`}><a>{article?.title}</a></Link></strong></div>
                <div className="flex">
                    <div className="">
                        <p style={{ fontSize: '.8rem' }}>
                            {getDesc(article?.body)}
                        </p>
                        {/* <p style={{ fontSize: '.9rem', margin: '5px 0' }}>category <Link href={`/articles/${article.category}`}><a style={{ color: '#eb004e' }}>{article?.category}</a></Link></p> */}
                        <p style={{ fontSize: '.9rem', margin: '5px 0' }}>category <span style={{ color: '#eb004e' }}>{article?.category}</span></p>
                        <div className="flex" style={{ gap: '2rem' }}>
                            <div>likes: {article?.likes?.length}</div>
                            <div>dislikes: {article?.disLikes?.length}</div>
                            <div>chat</div>
                        </div>
                    </div>
                    <div className="flex-column" style={{ justifyContent: 'flex-end' }}>
                        <div className="" aria-hidden="true">
                            <Image src="/images/Icon awesome-share-alt.png" alt="" width="30px" height="30px" />
                        </div>
                        <div className="mt-3" aria-hidden="true">
                            <Image src="/images/Icon awesome-chevron-circlee-down.png" alt="" width="30px" height="30px" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}