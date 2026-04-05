import React from 'react'
import "./index.css"

function ImageModal({children, isOpen, toggleOpen}) {
    if(!isOpen) return null;
  return (
    <>
        <div className='modal-backdrop'>
            <div className='modal-wrapper'>
            <div className='modal-container'>
                <div className='modal-header'>
                    <button onClick={() => toggleOpen(!isOpen)}>Close</button>
                </div>
                <div className='modal-content'>
                    {children}
                </div>
            </div>
            </div>
        </div>
    </>
  )
}

export default ImageModal