import React, { useRef } from 'react';
import bedRoom from '../../../assets/image/bedroom.jpg';
import a6 from '../../../assets/image/a6.jpg';
import slice from '../../../assets/image/Slice 1 1 .png';
import a2 from '../../../assets/image/a2.jpg';
import a3 from '../../../assets/image/a3.jpg';
import workRoom from '../../../assets/image/workroom2.jpg';

import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

export default function WovenImageList() {
  return (
    <ImageList sx={{ width: 500, height: 450 }} variant="woven" cols={3} gap={8}>
      {itemData.map((item) => (
        <ImageListItem key={item.img}>
          <img
            srcSet={`${item.img}?w=161&fit=crop&auto=format&dpr=2 2x`}
            src={`${item.img}?w=161&fit=crop&auto=format`}
            alt={item.title}
            loading="lazy"
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}

const itemData = [
  {
    img: a6,
    title: 'Bed',
  },
  {
    img: slice,
    title: 'Kitchen',
  },
  {
    img: a2,
    title: 'Sink',
  },
  {
    img: a3,
    title: 'Books',
  },
  {
    img: a6,
    title: 'Chairs',
  },
  {
    img: a2,
    title: 'Candle',
  },
  {
    img: workRoom,
    title: 'Laptop',
  },
  {
    img: bedRoom,
    title: 'Doors',
  },
  {
    img: bedRoom,
    title: 'Doors',
  }
]