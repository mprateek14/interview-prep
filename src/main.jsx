import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import './index.css'
import Home from "./Pages/Home"
import FolderStructure from "./Pages/FolderStructure"
import FeatureFlag from './Pages/FeatureFlag';
import ImageCarousel from './Pages/ImageCarousel';
import Modal from './Pages/Modal';
import Autocomplete from './Pages/Autocomplete';
import TodoList from './Pages/TodoList';
import TicTacToe from './Pages/TicTacToe';
import Connect4 from './Pages/Connect4';
import SelectWithSearch from './Pages/SelectWithSearch';
import Accordian from './Pages/Accordian';
import TextSelectionPopup from './Pages/TextSelectionPopup';
import ToastStacker from './Pages/ToastStacker';
import NestedCheckbox from './Pages/NestedCheckbox';
import ToggleSwitch from './Pages/ToggleSwitch';
import VirtualList from './Pages/VirtualList';
import InputTypes from './Pages/InputTypes';
import OTPInput from './Pages/OTPInput';
import InfiniteScroll from './Pages/InfiniteScroll';
import StarRating from './Pages/StarRating';
import ProgressBar from './Pages/ProgressBar';
import Pagination from './Pages/Pagination';
import Playground from './Pages/Playground';

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/folder-structure" element={<FolderStructure />} />
        <Route path="/feature-flags" element={<FeatureFlag />} />
        <Route path="/single-slider" element={<ImageCarousel />} />
        <Route path="/modal" element={<Modal />} />
        <Route path="/autocomplete" element={<Autocomplete />} />
        <Route path='/todo' element={<TodoList />} />
        <Route path="/tictactoe" element={<TicTacToe />} />
        <Route path="/connect4" element={<Connect4 />} />
        <Route path='/select-search' element={<SelectWithSearch />} />
        <Route path='/accordian' element={<Accordian />} />
        <Route path='/text-selector' element={<TextSelectionPopup />} />
        <Route path='/toast-stack' element={<ToastStacker />} />
        <Route path='/nested-checkbox' element={<NestedCheckbox />} />
        <Route path='/toggle-switch' element={<ToggleSwitch />} />
        <Route path='/virtual-list' element={<VirtualList />} />
        <Route path='/input-types' element={<InputTypes />} />
        <Route path='/otp-input' element={<OTPInput />} />
        <Route path='/scroller' element={<InfiniteScroll />} />
        <Route path='/star-rating' element={<StarRating />} />
        <Route path='/progress-bar' element={<ProgressBar />} />
        <Route path='/pagination' element={<Pagination />} />
        <Route path='/playground' element={<Playground />} />
        <Route path="/" element={<Home />} />
      </Routes>

    </BrowserRouter>
  // </StrictMode>,
)
