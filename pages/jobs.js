import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import HeadMetadata from "../components/HeadMetadata";
import LayoutA from "../components/layoutA";
import Nav from "../components/nav";
import { getAllJobs } from '../lib/api'

export default function Jobs() {
  const router = useRouter()
  // console.log(router.query)
  const category = 'all'
  const [jobs, setJobs] = useState([]);
  const [lastVisibleItem, setLastVisibleItem] = useState(null);
  useEffect(() => {
    const fetch = async () => {
      let res = await getAllJobs();
      // console.log(res);
      setJobs(res.data);
      setLastVisibleItem(res.lastVisibleItem);
    }
    return fetch()
  }, [])

  const fetchMore = async () => {
    const NlastVisibleItem = JSON.parse(lastVisibleItem)
    // console.log(NlastVisibleItem)
    if (NlastVisibleItem) {
      var nextQ = query(collection(db, "jobs"),
      orderBy('updatedAt', 'desc'),
      startAfter(NlastVisibleItem),
      limit(docLimit));
      if (category && category !== 'all') {
        nextQ = query(collection(db, "jobs"),
        where('category', '==', category),
        orderBy('updatedAt', 'desc'),
        startAfter(NlastVisibleItem),
        limit(docLimit));
      }
      const querySnapshot = await getDocs(nextQ).catch(error => console.log(error));
      let data = querySnapshot?.docs?.map(doc => ({ ...doc.data(), productId: doc.id }));
      data?.length > 0 ? setProducts(data) : document.querySelector('#seeMore').style.display = 'none';
    } else {
      alert('An error occured, please try again');
    }
  }

  if (jobs?.length > 0) {
    return (<>
      <HeadMetadata title={`Jobs > ${category} - Hairrrs`} />

      <Nav />

      <LayoutA>
        <div className="flex justify-between" style={{ padding: '10px 15px' }}>
          <div style={{ padding: '2%' }}>
            <div>Home {`>`} Jobs {category && category !== 'all' && <>{`>`} <span style={{ color: '#eb004e' }}>{category}</span></>}</div>

            <br />
            <div className="flex flex-wrap" style={{ gap: '1rem' }}>
              {jobs?.map(job => {
                return (<div key={job.jobId}><Card job={job} /></div>)
              })}
            </div>

            <br />
            <br />
            <div className="flex justify-center" id="seeMore" style={{ cursor: 'pointer' }} onClick={() => { fetchMore() }}>
              <span style={{ color: '#eb004e', padding: '10px 100px', border: '2px solid #eb004e', fontWeight: 600, borderRadius: 5 }}>see more</span>
            </div>
          </div>

          <div className="sm-hidden"><Filter /></div>
        </div>
      </LayoutA>
    </>)
  } else {
    return (
      <div id="loadingModal">
        {/* <Image src="/loader.gif" alt="Loading..." width="200px" height="200px" /> */}
        nothing found!
      </div>
    )
  }
}

const Card = ({ job }) => {
  if (job) {
    return (
      <div className="flex" style={{ gap: '.2rem', background: '#eee', padding: '15px' }}>
        <div style={{ width: '50px', height: '50px', borderRadius: '50%', border: '1px solid #eb004e', padding: '2px', overflow: 'hidden' }}>
          <Image src="/images/user.png" alt={job?.user?.displayName} width="50px" height="50px" />
        </div>

        <div style={{ width: '75%', padding: "0 15px" }}>
          <div className=""><Link href={`/job/${job?.slug}`}><a>
            <strong style={{ fontSize: '.9rem' }}>{job?.title}</strong>
          </a></Link></div>
          <div><p style={{ fontSize: '.8rem' }}>{job?.description}</p></div>
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
}

const Filter = () => {
  return (
    <div className="flex-column" style={{ gap: '.5rem', width: '250px', padding: '20px 15px', boxShadow: '0 0 5px 0 rgb(0 0 0 / 20%)' }}>

      <div style={{ background: '#f8f8f8', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.4)', display: 'none' }}></div>
        <div style={{ background: '#eb004e', color: 'white', padding: '4px 10px' }}>Type</div>
        <div className="flex-column" style={{ gap: '.5rem', padding: '5px 10px', height: '120px', overflow: 'auto' }}>
          <Link href="?wig"><a>Curly</a></Link>
          <Link href="?wig"><a>Straight</a></Link>
          <Link href="?wig"><a>Afro</a></Link>
          <Link href="?wig"><a>Blonde</a></Link>
          <Link href="?wig"><a>Brunette</a></Link>
          <Link href="?wig"><a>Waves</a></Link>
        </div>
      </div>

      <div style={{ background: '#f8f8f8', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.4)', display: 'block' }}></div>
        <div style={{ background: '#eb004e', color: 'white', padding: '4px 10px' }}>Services</div>
        <div className="flex-column" style={{ gap: '.5rem', padding: '5px 10px', height: '120px', overflow: 'auto' }}>
          <Link href="#Curly"><a>Curly</a></Link>
          <Link href="#Straight"><a>Straight</a></Link>
          <Link href="#Afro"><a>Afro</a></Link>
          <Link href="#Blonde"><a>Blonde</a></Link>
          <Link href="#Brunette"><a>Brunette</a></Link>
          <Link href="#Waves"><a>Waves</a></Link>
        </div>
      </div>

      <div style={{ background: '#f8f8f8', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.4)', display: 'none' }}></div>
        <div style={{ background: '#eb004e', color: 'white', padding: '4px 10px' }}>Location</div>
        <div className="flex-column" style={{ gap: '.5rem', padding: '5px 10px', height: '120px', overflow: 'auto' }}>
          <Link href="#Curly"><a>Curly</a></Link>
          <Link href="#Straight"><a>Straight</a></Link>
          <Link href="#Afro"><a>Afro</a></Link>
          <Link href="#Blonde"><a>Blonde</a></Link>
          <Link href="#Brunette"><a>Brunette</a></Link>
          <Link href="#Waves"><a>Waves</a></Link>
        </div>
      </div>

      <div style={{ background: '#f8f8f8', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.4)', display: 'none' }}></div>
        <div style={{ background: '#eb004e', color: 'white', padding: '4px 10px' }}>Price</div>
        <div className="flex-column" style={{ gap: '.5rem', padding: '15px 10px', height: '150px', overflow: 'auto' }}>
          <form>
            <div>
              <input type="text" style={{ width: '100%' }} />
            </div>
            <div>
              <input type="text" style={{ width: '100%' }} />
            </div>
            <div>
              <button type="submit" style={{ background: '#eb004e', color: 'white', width: '100%', textAlign: 'center' }}>filter</button>
            </div>
          </form>
        </div>
      </div>

    </div>
  )
}