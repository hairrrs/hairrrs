import Image from "next/image"
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getUserById } from "../lib/api";
import { db } from "../lib/firebase";

export default function LatestJobVacancies({ docLimit = "18" }) {
    const [jobs, setJobs] = useState([])
    useEffect(() => {
        const fetch = async () => {
            const jobsRef = collection(db, "jobs");
            const q = query(jobsRef, orderBy('updatedAt', 'desc'), limit(docLimit));
            const documentSnapshots = await getDocs(q).catch(error => { console.log('LatestJobVacancies error:', error) });
            let data = documentSnapshots.docs.map(doc => ({ ...doc.data(), jobId: doc.id }));
            // const lastVisibleItem = documentSnapshots.docs[documentSnapshots.docs.length - 1];
            setJobs(data);
        }
        return fetch()
    }, [docLimit])

    // console.log(jobs)

    if(jobs?.length>0){
        return (<>
        {jobs?.length>0 && <>
            <div className="" style={{ background: '#eb004e', color: 'white', textAlign: 'center', padding: '10px' }}><strong>Job vacancies</strong></div>
            <br />
            <div className="flex flex-wrap featuredCatg_wig-body" style={{ gap: '1.2rem', padding: '10px' }}>
                {jobs?.map(job => {
                    return <Card key={job.jobId} job={job} />
                })}
            </div>
            <br />
            <div className="flex justify-center">
                <Link href="/"><a style={{ color: '#eb004e', padding: '10px 100px', border: '2px solid #eb004e', fontWeight: 600, borderRadius: 5 }}>see more</a></Link>
            </div>
        </>}
    </>)
    }else{
        return(<>
            <h6>Loading Latest Job Vacancy</h6>
        </>)
    }
}

const Card = ({ job }) => {
    const [author, setAuthor] = useState(null);
    useEffect(() => {
        const fetch = async () => {
            const author = await getUserById(job?.lister?.uid);
            setAuthor(author);
        }
        return fetch()
    }, [job])

    return (
        <div className="flex" style={{ width: 340, background: '#ececec82' }}>
            <div className="flex justify-center" style={{ width: '25%', paddingTop: 15 }}>
                <>
                    <div className="" style={{ position: 'relative', borderRadius: '50%', background: '#fff', width: "43px", height: "43px" }}>
                        {// eslint-disable-next-line @next/next/no-img-element
                            <img src="/images/nutless braid.png" alt="" width="100%" height="100%" style={{ borderRadius: '50%' }} />
                        }
                        <div style={{ position: 'absolute', top: '27%', right: -5 }}>
                            {author?.photoURL && <Image src={author?.photoURL} alt={author?.displayName} width="15px" height="15px" />}
                        </div>
                    </div>
                </>
            </div>
            <div style={{ width: '75%', padding: 15 }}>
                <div className=""><strong style={{ fontSize: '.9rem' }}><Link href={`/article/${job?.slug}`}><a>{job?.title}</a></Link></strong></div>
                <div><p style={{ fontSize: '.8rem' }}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam, autem. Dolorem ducimus cum molestias esse.</p></div>
                <div className="md-flex flex-column" style={{ marginTop: '.6rem', gap: '1.2rem', fontSize: '.8rem' }}>
                    <div className="flex">
                        <Image src="/images/Icon material-access-time.png" alt="" width="15px" height="15px" />
                        <div style={{ marginLeft: '8px', }}>Full time</div>
                    </div>
                    <div className="flex">
                        <Image src="/images/Icon material-location-searching.png" alt="" width="15px" height="15px" />
                        <div style={{ marginLeft: '8px', }}>Lagoes/Nigeria</div>
                    </div>
                </div>
                <div style={{ marginTop: '15px', marginBottom: '3px' }}>
                    <span style={{ background: '#ffd100', color: 'white', borderRadius: '5px', padding: '3px 20px', fontSize: '.8rem', fontWeight: 600 }}>Gold promotion</span>
                </div>
            </div>
        </div>
    )
}