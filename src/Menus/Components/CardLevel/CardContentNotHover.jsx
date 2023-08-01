import { CardContent, CardHeader, CardMedia } from '@mui/material'
import React from 'react'

export const CardContentNotHover = ({level}) => {
  return (
    <CardContent>
        <CardMedia
         component="img"
         height={200}
         width={"100%"}
         image={`/levels/images/${level.image}`}
         title={level.title}
         sx={{ objectFit: "contain", justifyContent: "center", display: "flex" }}
        />
        <CardHeader
            title={level.title}
            subheader={level.description}
        />
    </CardContent>
  );
}
