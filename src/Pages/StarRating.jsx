import React, {useState} from 'react'
import Rating from '../components/StarRating/Rating'

function StarRating() {

    const [rating, setRating] = useState(3)

  return (
    <div><Rating maxRating={5} currentRating={rating} handleRating={(val) => setRating(val)}/></div>
  )
}

export default StarRating