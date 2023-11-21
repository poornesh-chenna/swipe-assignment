import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Invoice from './pages/Invoice'
import InvoiceList from './pages/InvoiceList'
import InvoiceBulkEdit from './pages/InvoiceBulkEdit'

const App = () => {
  return (
    <div className="App d-flex flex-column align-items-center justify-content-center w-100">
      <Routes>
        <Route path="/" element={<InvoiceList />} />
        <Route path="/create" element={<Invoice />} />
        <Route path="/create/:id" element={<Invoice />} />
        <Route path="/edit/:id" element={<Invoice />} />
        <Route path="/bulkedit" element={<InvoiceBulkEdit />} />
      </Routes>
    </div>
  )
}

export default App
