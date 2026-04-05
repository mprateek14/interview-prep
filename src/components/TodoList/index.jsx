import React, {useState, useRef, useMemo} from 'react'
import "./index.css"

const TABS = [{name: "All", value: 0}, {name: "Completed", value: 1}, {name: "In Progress", value: 2}, {name: "Deleted", value: 3}]

const ListItem = ({data, handleOperation}) => {
    const {name, completed, id} = data;
    return(
        <div className='todo-item' >
            <div className='todo-item-circle' onClick={() => handleOperation(id, "completed")}>{completed ? "🚀" : ""}</div>
            <div className='todo-item-name' style={{textDecoration: completed ? "line-through" : ""}}>{name}</div>
            <div className='todo-item-remove' onClick={() => handleOperation(id, "deleted")}>❌</div>
        </div>
    )
}

function TodoListComponent() {

    const inputRef = useRef(null)
    const[list, setList] = useState([])
    const [activeTab, setActiveTab] = useState(0)

    const handleAddTask = (e) => {
        if(e.key === 'Enter'){

        setList([...list, {name: e.target.value, completed: false, deleted:false, id: Date.now()}])
        inputRef.current.value = ""
        }
    }

    const handleOperation = (id, operation) => {
        const updatedList = list.map((item) => {
            if(item.id === id){
                if(operation === "deleted") item.deleted = true
                else item.completed = !item.completed
            }
            return item
        })
        setList(updatedList)
    }

    const filteredList = useMemo(() => {
        if(activeTab === 1){
            return list.filter((item) => item.completed === true)
        }
        if(activeTab === 2){
            return list.filter((item) => !item.completed && !item.deleted)
        }
        if(activeTab === 3){
            return list.filter((item) => item.deleted === true)
        }

        return list;
    }, [list, activeTab])

console.log(filteredList)
  return (
    <>
        <div className='todo-wrapper'>
            <input ref={inputRef} onKeyDown={(e) => handleAddTask(e)}/>

            <div className='todo-list-tabs'>
                {TABS.map((tab) => {
                    return(
                        <button key={tab.value} onClick={() => setActiveTab(tab.value)}>{tab.name}</button>
                    )
                })}
            </div>

            <div className='todo-list'>
                {filteredList.map((item) => {
                    return(
                        <ListItem data={item} key={item.id} handleOperation={handleOperation}/>
                    )
                })}
            </div>
        </div>
    </>
  )
}

export default TodoListComponent