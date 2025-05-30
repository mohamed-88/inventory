import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const CustomerInvoiceList = () => {
  const { id: customerId } = useParams();
  const [invoices, setInvoices] = useState([]);
  const [customer, setCustomer] = useState(null);
  const printRef = useRef();

  useEffect(() => {
    const load = async () => {
      try {
        const customerRes = await api.get(`/customers/${customerId}`);
        setCustomer(customerRes.data);

        const invoicesRes = await api.get(`/invoices?customerId=${customerId}`);
        setInvoices(invoicesRes.data);
      } catch (err) {
        console.error('❌ Failed to load invoices:', err);
      }
    };
    load();
  }, [customerId]);

  const exportPDF = async () => {
    const input = printRef.current;
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`invoices_${customer.name}.pdf`);
  };

  if (!customer) return <p>Loading...</p>;

  return (
    <div className="item-detail">
      <div ref={printRef}>
        <h2>🧾 Invoices for {customer.name}</h2>
        <table className="customer-table">
          <thead>
            <tr>
              <th>Invoice No</th>
              <th>Date</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Remaining</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => {
              const total = inv.items?.reduce((sum, i) => sum + (i.totalPrice || 0), 0);
              const paid = inv.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
              const remaining = total - paid;

              return (
                <tr key={inv._id}>
                  <td>{inv.billNo}</td>
                  <td>{new Date(inv.createdAt).toLocaleDateString()}</td>
                  <td>${total?.toFixed(2)}</td>
                  <td>${paid.toFixed(2)}</td>
                  <td>${remaining.toFixed(2)}</td>
                  <td>
                    <Link to={`/invoice/${inv._id}`} className="button">
                      🖨️ Print
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <button className="button" onClick={exportPDF} style={{ marginTop: '1rem' }}>
        📄 Export to PDF
      </button>

      <Link to={`/customer/${customerId}`} className="button" style={{ marginTop: '2rem', display: 'inline-block' }}>
        ← Back to Customer
      </Link>
    </div>
  );
};

export default CustomerInvoiceList;



// import React, { useEffect, useState } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import api from '../api';

// const CustomerInvoiceList = () => {
//   const { id: customerId } = useParams();
//   const [invoices, setInvoices] = useState([]);
//   const [customer, setCustomer] = useState(null);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const customerRes = await api.get(`/customers/${customerId}`);
//         setCustomer(customerRes.data);

//         const invoicesRes = await api.get(`/invoices?customerId=${customerId}`);
//         setInvoices(invoicesRes.data);
//       } catch (err) {
//         console.error('❌ Failed to load invoices:', err);
//       }
//     };
//     load();
//   }, [customerId]);

//   if (!customer) return <p>Loading...</p>;

//   return (
//     <div className="item-detail">
//       <h2>🧾 Invoices for {customer.name}</h2>

//       <table className="customer-table">
//         <thead>
//           <tr>
//             <th>Invoice No</th>
//             <th>Date</th>
//             <th>Total</th>
//             <th>Paid</th>
//             <th>Remaining</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {invoices.map((inv) => {
//             const total = inv.items?.reduce((sum, i) => sum + (i.totalPrice || 0), 0);
//             const paid = inv.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
//             const remaining = total - paid;

//             return (
//               <tr key={inv._id}>
//                 <td>{inv.billNo}</td>
//                 <td>{new Date(inv.createdAt).toLocaleDateString()}</td>
//                 <td>${total?.toFixed(2)}</td>
//                 <td>${paid.toFixed(2)}</td>
//                 <td>${remaining.toFixed(2)}</td>
//                 <td>
//                   <Link to={`/invoice/${inv._id}`} className="button">
//                     🖨️ Print
//                   </Link>
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>

//       <Link to={`/customer/${customerId}`} className="button" style={{ marginTop: '2rem', display: 'inline-block' }}>
//         ← Back to Customer
//       </Link>
//     </div>
//   );
// };

// export default CustomerInvoiceList;