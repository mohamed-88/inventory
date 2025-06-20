import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomerList from './pages/CustomerList';
import CustomerDetail from './pages/CustomerDetail';
import ItemDetail from './pages/ItemDetail';
import ItemForm from './pages/ItemForm';
import CustomerForm from './pages/CustomerForm';
import CustomerReceipt from './pages/CustomerReceipt';
import CustomerInvoiceList from './pages/CustomerInvoiceList';
import './App.css';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CustomerList />} />
        <Route path="/customer/new" element={<CustomerForm />} />         {/* ✅ Add new */}
        <Route path="/customer/:id/edit" element={<CustomerForm />} />    {/* ✅ Edit */}
        <Route path="/customer/:id" element={<CustomerDetail />} />
        <Route path="/item/:id" element={<ItemDetail />} />
        <Route path="/customer/:customerId/item/new" element={<ItemForm />} />
        <Route path="/customer/:customerId/item/:itemId/edit" element={<ItemForm />} />
        <Route path="/customer/:id/receipt" element={<CustomerReceipt />} />
        <Route path="/customer/:id/invoices" element={<CustomerInvoiceList />} />
   
      </Routes>
    </Router>
  );
}

export default App;
