import React from 'react'
import { Link } from 'react-router'

function Home() {
  return (
    <div>
      <nav>
        <ul>
          <li><Link to="/folder-structure">FolderStructure</Link></li>
          <li><Link to="/feature-flags">FeatureFlag</Link></li>
          <li><Link to="/single-slider">ImageCarousel</Link></li>
          <li><Link to="/modal">Modal</Link></li>
          <li><Link to="/autocomplete">Autocomplete</Link></li>
          <li><Link to="/todo">TodoList</Link></li>
          <li><Link to="/tictactoe">TicTacToe</Link></li>
          <li><Link to="/connect4">Connect4</Link></li>
          <li><Link to="/select-search">SelectWithSearch</Link></li>
          <li><Link to="/accordian">Accordian</Link></li>
          <li><Link to="/text-selector">TextSelectionPopup</Link></li>
          <li><Link to="/toast-stack">ToastStacker</Link></li>
        </ul>
      </nav>
    </div>
  )
}

export default Home