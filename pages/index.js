import React from "react";
import styles from '../styles/pages/homePage.module.css'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
// import Nav from '../components/nav';
import Nav2 from '../components/nav';
import LayoutA from '../components/layoutA'
import TrendingArticles from '../components/trendingArticles'
import LatestJobVacancies from '../components/latestJobVacancies'
import { getProductsByCategory } from '../lib/api'
import MyCarousel from "../components/carousel";

export default function HomePage() {
  const featuredCatg = [
    { name: 'Wig' },
    { name: 'Weavon' },
    { name: 'Gadgets' },
    { name: 'Extras' }
  ]
  const catgBox = [
    { src: '/images/product-img.png', caption: 'Products' },
    { src: '/images/business-img.png', caption: 'Businesses' },
    { src: '/images/job-vacancy-img.png', caption: 'Job vacancies' },
    { src: '/images/article-img.png', caption: 'Articles' }
  ]

  return (<>
    <Nav2 />

    <LayoutA>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 col-md-7 col-lg-8 p-0">
            <div className={styles.MyCarousel}>
              <MyCarousel />
            </div>
          </div>
          <div className="col-12 col-md-5 col-lg-4 flex justify-center items-center my-5 my-md-0 px-4">
            {
              // eslint-disable-next-line @next/next/no-img-element
              <img src="/images/face_of_ohyanga.png" alt="" width="200px" />
            }
          </div>
        </div>
      </div>

      {/* <div className="sm-hidden flex justify-between items-center" style={{ paddingTop: 15 }}>
        {catgBox.map((item, index) => (
          <div key={index} className="homeComponent-catg_box">
            <Image src={item.src} alt="" width="143px" height="164px" />
            <div className="homeComponent-catg_box_text">{item.caption}</div>
          </div>
        ))}
      </div> */}

      {/* PRODUCTS BY FEATURED_CATG */}
      {featuredCatg?.map((category, index) => {
        return <ProductCard key={index} category={category?.name} />
      })}

      <br />
      <TrendingArticles docLimit={3} />

      <br />
      <LatestJobVacancies />
    </LayoutA>
  </>)
}



const ProductCard = ({ category }) => {
  const [products, setProducts] = useState([
    {title: 'Title of the item will be placed here', slug: 'title-of-the-item-will-be-placed-here', mainImage: '', price: 'N17,500'},
    {title: 'Title of the item will be placed here', slug: 'title-of-the-item-will-be-placed-here', mainImage: '', price: 'N17,500'},
    {title: 'Title of the item will be placed here', slug: 'title-of-the-item-will-be-placed-here', mainImage: '', price: 'N17,500'},
  ])

  useEffect(() => {
    const fetch = async () => {
      const res = await getProductsByCategory(category, 6);
      const serialized = res?.data ? res?.data : null
      serialized && setProducts(serialized)
    }
    // return fetch()
  }, [category])

  if (!!products.length > 0) {
    return (
      <div className="featuredCatg_wig" style={{ marginBottom: '1.5rem' }}>
        <div className="featuredCatg_wig-header" style={{
          // background: '#dcdcdc', 
          marginTop: 15,
          color: '#eb004e',
          fontSize: '1.2rem',
          fontWeight: 650,
          padding: '5px 15px'
        }}>{category}</div>

        <br />

        <div className="flex flex-wrap gap-5 homeComponent-featuredCatg_wig-body">
          {products?.map(product => {
            return (
              <div key={product?.slug} className="flex">
                <Link href={`/product/${product?.slug}`}><a className={`flex justify-center items-center ${styles.productCard_a_container}`}>
                  {product?.mainImage && <Image src={`/images/${product?.mainImage}`} alt={product?.title} width="200px" height="120px" />}
                </a></Link>

                <div className="flex flex-col justify-around p-1 bg-[#dcdcdc] text-sm text-black h-[120px] w-[140px]">
                  <div>
                    <div>
                      <Link href={`/product/${product?.slug}`}><a className="text-black" style={{ fontSize: '.9rem' }}>{product?.title}</a></Link>
                    </div>
                    <div><strong>{product?.price}</strong></div>
                  </div>
                  <div>
                    <Link href={`/product/${product?.slug}`}><a style={{ padding: '3px 6px', background: '#eb004e', color: 'white', borderRadius: '1px' }}>
                      check <i className="fa fa-caret-right"></i></a></Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <br />

        <Link href={`/products/${category}`}><a><span style={{ color: '#eb004e', marginLeft: 10 }}>see more</span></a></Link>
      </div>
    )
  } else { return (<></>) }
}