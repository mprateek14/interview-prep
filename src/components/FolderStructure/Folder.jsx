import React, { useState } from 'react'
import "./index.css"

function Folder({ folderData }) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [children, setChildren] = useState(folderData.children)
    const [showInput, setShowInput] = useState({ visible: false, type: null })
    const [inputValue, setInputValue] = useState("")

    const handleNewEntry = (e) => {
        console.log("enter")
        e.preventDefault()
        if (inputValue.trim() === "") return

        const newEntry = {
            id: Date.now().toString(),
            name: inputValue,
            type: showInput.type,
            children: []
        }

        let temp = children
        temp.unshift(newEntry)
        console.log(temp, "temp")
        setChildren(temp)
        setInputValue("")
        setShowInput({ visible: false, type: null })
    }

    if (folderData.type === "folder") {
        return (
            <>
                <div className='folder-container' onClick={() => setIsExpanded(!isExpanded)}>
                    <div>{folderData.name}</div>
                    <div className='folder-actions'>
                        <button onClick={(e) => {
                            isExpanded ? e.stopPropagation() : null
                            setShowInput({ visible: true, type: "folder" })
                        }}>Add Folder</button>
                        <button onClick={(e) => {
                            e.stopPropagation()
                            setShowInput({ visible: true, type: "file" })
                        }}>Add File</button>
                    </div>
                </div>
                {showInput.visible && <div style={{ marginLeft: "10px", marginTop: "5px"}} >
                    <input placeholder='Enter name' value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
                    <button onClick={(e)=> handleNewEntry(e)}>Submit</button>
                </div>}
                {isExpanded && <div className='folder-children'>
                    {children.map((child) => {
                        return <div style={{ marginLeft: "10px", marginTop: "5px" }} key={child.id}>
                            <Folder folderData={child} />
                        </div>
                    })}
                </div>}

            </>
        )
    }
    else {
        return (
            <>
                <div className='file-container'>
                    <div>{folderData.name}</div>
                </div>
            </>
        )
    }

}

export default Folder