import Image from "next/image"
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getUserById } from "../lib/api";
import { db } from "../lib/firebase";

import { AiOutlineClockCircle } from 'react-icons/ai';
import { MdLocationSearching } from 'react-icons/md';

export default function LatestJobVacancies({ docLimit = "18" }) {
    const [jobs, setJobs] = useState([
        { jobId: 'se409sdkle', title: 'Sample job', slug: 'sample-job', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam, autem. Dolorem ducimus cum molestias esse.', type: 'Full time', location: 'Lagoes/Nigeria', promotion: 'Gold promotion', lister: { uid: 'slk39834kdlju' } },
        { jobId: 'se409sdkle', title: 'Sample job', slug: 'sample-job', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam, autem. Dolorem ducimus cum molestias esse.', type: 'Full time', location: 'Lagoes/Nigeria', promotion: 'Gold promotion', lister: { uid: 'slk39834kdlju' } },
        { jobId: 'se409sdkle', title: 'Sample job', slug: 'sample-job', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam, autem. Dolorem ducimus cum molestias esse.', type: 'Full time', location: 'Lagoes/Nigeria', promotion: 'Gold promotion', lister: { uid: 'slk39834kdlju' } },
    ])
    useEffect(() => {
        const fetch = async () => {
            const jobsRef = collection(db, "jobs");
            const q = query(jobsRef, orderBy('updatedAt', 'desc'), limit(docLimit));
            const documentSnapshots = await getDocs(q).catch(error => { console.log('LatestJobVacancies error:', error) });
            let data = documentSnapshots.docs.map(doc => ({ ...doc.data(), jobId: doc.id }));
            // const lastVisibleItem = documentSnapshots.docs[documentSnapshots.docs.length - 1];
            data && setJobs(data);
        }
        // return fetch()
    }, [docLimit])

    // console.log(jobs)

    if (jobs?.length > 0) {
        return (<>
            {jobs?.length > 0 && <>
                <div className="" style={{ background: '#eb004e', color: 'white', textAlign: 'center', padding: '10px' }}><strong>Job vacancies</strong></div>
                <br />

                <div className="flex flex-wrap justify-center featuredCatg_wig-body" style={{ gap: '1.2rem', padding: '10px' }}>
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
    } else {
        return (<>
            <h6>Loading Latest Job Vacancy</h6>
        </>)
    }
}

const Card = ({ job }) => {
    const [author, setAuthor] = useState({ photoURL: '/images/nutless braid.png', displayName: 'cent' });
    useEffect(() => {
        var width = (window.innerWidth > 0) ? window.innerWidth : document.documentElement.clientWidth;

        const fetch = async () => {
            if (width > 768) {
                const author = await getUserById(job?.lister?.uid);
                author && setAuthor(author);
            }
        }
        // return fetch()
    }, [job])

    return (
        <div className={`bg-[#ececec82] md:w-[300px] p-4`}>
            <div className="flex gap-3 items-center">
                <div className="" style={{ position: 'relative', borderRadius: '50%', background: '#fff', width: "43px", height: "43px" }}>
                    <div className="rounded-[50%] overflow-hidden w-[43px] h-[43px]">
                        {author?.photoURL && <Image src={author?.photoURL} alt={author?.displayName} width="43px" height="43px" />}
                    </div>
                </div>
                <strong style={{ fontSize: '.9rem' }}><Link href={`/article/${job?.slug}`}><a>{job?.title}</a></Link></strong>
            </div>
            <div><p style={{ fontSize: '.8rem' }}>{job?.description}</p></div>
            <div className="md-flex flex-col" style={{ marginTop: '.6rem', gap: '.8rem', fontSize: '.8rem' }}>
                <div className="flex gap-1 items-center">
                    <div><AiOutlineClockCircle color="#eb004e" size="18px" /></div>
                    <div>{job?.type}</div>
                </div>
                <div className="flex gap-1 items-center">
                    <div><MdLocationSearching color="#eb004e" size="18px" /></div>
                    <div>{job?.location}</div>
                </div>
            </div>
            {job?.promotion && <div style={{ marginTop: '15px', marginBottom: '3px' }}>
                <span style={{ background: '#ffd100', color: 'white', borderRadius: '5px', padding: '3px 20px', fontSize: '.8rem', fontWeight: 600 }}>{job?.promotion}</span>
            </div>}
        </div>
    )
}