import React, {useState} from 'react'
import {folderData} from "../components/FolderStructure/data"
import Folder from '../components/FolderStructure/Folder'

function FolderStructure() {

  const [data, setData] = useState(folderData)

  return (
    <>
      <Folder folderData={data}/>
    </>
  )
}

export default FolderStructure