import React, {useState} from 'react'
import {folderData} from "../components/FolderStructure/data"
import Folder from '../components/FolderStructure/Folder'
import { folderDataStructured } from '../constants/folderData'
import FolderStructureV2 from '../components/FolderStructure/FolderStructureV2'

function FolderStructure() {

  const [data, setData] = useState(folderData)

  return (
    <>
      {/* <Folder folderData={data}/> */}
      <FolderStructureV2 folderDataAll={folderDataStructured} />
    </>
  )
}

export default FolderStructure