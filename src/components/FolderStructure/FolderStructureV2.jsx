import React, {useState, useEffect} from 'react'

const RenderNode = ({nodeId, allData}) => {
        if(!nodeId) return;
        console.log(nodeId, allData)
        const nodeData = allData[nodeId];

        if(nodeData?.type === "folder"){
            return(
                <div key={nodeId}>
                    <div className='node-name'>{nodeData.name}</div>
                    {nodeData.children.map((child) => {
                        return(
                            <div className='node-child' key={child} style={{marginLeft: "15px"}}>
                                {<RenderNode nodeId={child} allData={allData}/>}
                            </div>
                        )
                    })}
                </div>
            )
        }
        else return(
            <div>
                {nodeData.name}
            </div>
        )
}

function FolderStructureV2({folderDataAll}) {
    

    const [allData, setAllData] = useState(folderDataAll)

    const rootNodes = Object.keys(allData).filter((item) => allData[item].parent === null)

  return (
    <div>
        {rootNodes.map((node) => {
            return <RenderNode nodeId={node} allData={allData} key={node}/>
        })}
    </div>
  )
}

export default FolderStructureV2