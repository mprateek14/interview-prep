import React from 'react'
import { ToastStackProvider } from '../contexts/ToastStack'
import ToastList from '../components/Toast/ToastList'

function ToastStacker() {
  return (
    <ToastStackProvider maxStack={5}>
        <ToastList/>
        Toast checker page
    </ToastStackProvider>

  )
}

export default ToastStacker