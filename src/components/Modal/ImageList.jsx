import React, {useState} from 'react'
import "./index.css"
import { imagesData } from '../../constants/imagesData'
import ImageModal from './ImageModal';

function ImageList() {
    const [isOpen, toggleOpen] = useState(false);
    const [activeImage, setActiveImage] = useState(null)
  return (
    <>
        <div className='modal-images-list-container'>
            {imagesData?.map((image, idx) => {
                return(
                    <div className='modal-image-list-item' key={idx} onClick={() => {
                        setActiveImage(image)
                        toggleOpen(true)
                    }}>
                        <img src={image} style={{width:"100%", height:"100%"}} />
                    </div>
                )
            })}
        </div>

        <ImageModal isOpen={isOpen} toggleOpen={toggleOpen}>
            <img src={activeImage} style={{width:"100%", height:"100%"}} />
        </ImageModal>

    </>
  )
}

export default ImageList