import Head from 'next/head'
import Image from 'next/image'
import LayoutA from '../components/layoutA'
import Nav from '../components/nav'
import Home from '../components/home'
import HeadMetadata from '../components/HeadMetadata'

export default function HomePage() {
  return (<>
      <HeadMetadata />

      <Nav />
      
      <LayoutA>
        <Home />
      </LayoutA>
    </>)
}
