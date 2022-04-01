import React from 'react'
import Head from "next/head"
import { HOME_OG_IMAGE_URL } from '../lib/constants'

function HeadMetadata({ title, metaDescription, ogImage }) {
  return (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="shortcut icon" href="/favicon.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
      <meta name="theme-color" content="#ffffff" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="msvalidate.01" content="your_msvalidate" />
      <meta name="google-site-verification" content="your_google_site_verification" />
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossOrigin="anonymous"></link>
      
      <meta property="og:image" content={ogImage ? ogImage : HOME_OG_IMAGE_URL} />
      <title>{title ? title : 'Hairrrs'}</title>
      <meta name="description" content={metaDescription ? metaDescription : 'Everything Hair!'} />
    </Head>
  )
}

export default HeadMetadata