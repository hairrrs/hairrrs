import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import HeadMetadata from '../../components/HeadMetadata'
import LayoutA from '../../components/layoutA'
import Nav from '../../components/nav'
import { getAllProducts, getProductsByCategory } from '../../lib/api'
import { collection, query, startAfter, orderBy, where, getDocs, limit } from "firebase/firestore";
import { db } from '../../lib/firebase'

export default function Products({ initialProducts, lastVisibleItem }) {
  const router = useRouter()
  const { category } = router.query
  const [docLimit, setDocLimit] = useState(25)
  const [products, setProducts] = useState(initialProducts)
  // const [totalProducts, setTotalProducts] = useState()

  useEffect(() => {
    const fetch = async () => {

    }
    return fetch();
  }, []);

  const fetchMore = async () => {
    const NlastVisibleItem = JSON.parse(lastVisibleItem)
    // console.log(NlastVisibleItem)
    if (NlastVisibleItem) {
      var nextQ = query(collection(db, "products"), orderBy('updatedAt', 'desc'), startAfter(NlastVisibleItem), limit(docLimit));
      if (category && category !== 'all') {
        nextQ = query(collection(db, "products"), where('category', '==', category), orderBy('updatedAt', 'desc'), startAfter(NlastVisibleItem), limit(docLimit));
      }
      const querySnapshot = await getDocs(nextQ).catch(error => console.log(error));
      let data = querySnapshot?.docs?.map(doc => ({ ...doc.data(), productId: doc.id }))
      data?.length > 0 ? setProducts(data) : document.querySelector('#seeMore').style.display = 'none';
    } else {
      alert('An error occured, please try again')
    }
  }

  return (<>
    <HeadMetadata />

    <Nav />

    <LayoutA>
      <div className="flex justify-between" style={{ padding: '10px 15px' }}>
        <div className="">
          <div>Home {`>`} Products {category && <>{`>`} <span style={{ color: '#eb004e' }}>{category}</span></>}</div>

          <br />
          <div className="flex flex-wrap" style={{ gap: '1.8rem' }}>
            {products?.map(product => {
              return (<div key={product.productId}><Card product={product} /></div>)
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
}

const Card = ({ product }) => {
  return (
    <div style={{ width: 140 }}>
      <div style={{ width: '100%', height: 120, background: '#eb004e', color: 'white' }}><Link href={`/product/${product?.slug}`}><a>
        <Image src="/images/0_NEgmVl2J_RRzI9Sr.jpg" alt="" width="140px" height="120" />
      </a></Link></div>

      <div style={{ padding: 10, border: '1px solid #e4e4e4', background: '#f8f8f8' }}>
        <div style={{ fontSize: '.7rem', fontWeight: 600 }}>
          <Link href={`/product/${product?.slug}`}><a>{product?.title}</a></Link>
        </div>
        <div style={{ fontSize: '.9rem', fontWeight: 600 }}>
          <strong>{product?.price}</strong>
        </div>
        <div style={{ marginTop: '15px', marginBottom: '3px' }}>
          <span style={{ background: '#ffd100', color: 'white', borderRadius: '5px', padding: '3px 10px', fontSize: '.6rem', fontWeight: 600 }}>Gold promotion</span>
        </div>
      </div>
    </div>
  )
}

const Filter = () => {
  return (
    <div className="flex-column" style={{ gap: '.5rem', width: '250px', padding: '20px 15px', boxShadow: '0 0 5px 0 rgb(0 0 0 / 20%)' }}>

      <div style={{ background: '#f8f8f8', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.4)', display: 'none' }}></div>
        <div style={{ background: '#eb004e', color: 'white', padding: '4px 10px' }}>Type</div>
        <div className="flex-column" style={{ gap: '.5rem', padding: '5px 10px', height: '120px', overflow: 'auto' }}>
          <Link href="wig"><a>Curly</a></Link>
          <Link href="wig"><a>Straight</a></Link>
          <Link href="wig"><a>Afro</a></Link>
          <Link href="wig"><a>Blonde</a></Link>
          <Link href="wig"><a>Brunette</a></Link>
          <Link href="wig"><a>Waves</a></Link>
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

export const getServerSideProps = async (context) => {
  const { category } = context.params;
  let products = [];
  if (!category) { return { notFound: true } };

  if (category === 'all') {
    let res = await getAllProducts(25)
    res && products.push(res)
  } else {
    let res = await getProductsByCategory(category, 25)
    res && products.push(res)
  }
  const result = products.length > 0 && products[0]?.data ? products[0]?.data : null
  // console.log(products[0]?.lastVisibleItem)
  // if (!!products?.length > 0) {
  return {
    props: {
      initialProducts: result,
      lastVisibleItem: products[0]?.lastVisibleItem ? products[0]?.lastVisibleItem : null
    }
  }
  // } else {
  //   return {
  //     notFound: true
  //   }
  // }
}