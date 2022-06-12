import React from "react";

import { UncontrolledCarousel } from "reactstrap";

export default function MyCarousel() {
  const items = [
    {
      src: "/images/0_NEgmVl2J_RRzI9Sr.jpg",
      altText: "Slide 1",
      caption: "",
      header: "",
      key: "1",
    },
    {
      src: "/images/0_NEgmVl2J_RRzI9Sr.jpg",
      altText: "Slide 2",
      caption: "",
      header: "",
      key: "2",
    },
    {
      src: "/images/0_NEgmVl2J_RRzI9Sr.jpg",
      altText: "Slide 3",
      caption: "",
      header: "",
      key: "3",
    },
  ];

  return (
    <UncontrolledCarousel items={items} />
  )
}




// import Carousel from 'flat-carousel';

// export default function MyCarousel() {
//   const images = [
//     { src: '/images/img-01.png' },
//     { src: '/images/nutless braid.png' },
//     { src: '/images/signin img.png' }
//   ]

//   return (
//     <Carousel>
//       {images.map((image, index) => (
//         <div
//           key={index}
//           className="demo-item"
//           style={{ backgroundImage: 'url(' + image.src + ')' }}
//         />
//       ))}
//     </Carousel>
//   )
// }
