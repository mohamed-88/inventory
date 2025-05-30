import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ItemDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    api.get('/items').then(res => {
      const found = res.data.items.find(i => i._id === id);
      setItem(found);
    });
  }, [id]);

  if (!item) return <p>بارکرنا بابەتی...</p>;



const downloadPDF = () => {
  const input = document.getElementById('pdf-content');
  html2canvas(input).then((canvas) => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    const imgProps= pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save("item-detail.pdf");
  });
};


  return (
    <div className="item-detail">
      <img src={`http://localhost:5000${item.imageUrl}`} alt={item.name} />
      <h1>{item.name}</h1>
      <p>{item.description}</p>
      <p>Quantity: {item.quantity}</p>
      <p>Unit Price: ${item.unitPrice}</p>
      <p><strong>Total: ${item.totalPrice.toFixed(2)}</strong></p>
      <p>Customer: {item.customerId?.name}</p>
      <Link to="/">← Back to all items</Link>
      <div>
  <div className="item-detail" id="pdf-content">
    <img src={`http://localhost:5000${item.imageUrl}`} alt={item.name} />
    <h1>{item.name}</h1>
    <p>{item.description}</p>
    <p>Quantity: {item.quantity}</p>
    <p>Unit Price: ${item.unitPrice}</p>
    <p><strong>Total: ${item.totalPrice.toFixed(2)}</strong></p>
    <p>Customer: {item.customerId?.name}</p>
  </div>
  <button onClick={downloadPDF}>Download as PDF</button>
</div>
    </div>
  );
};

export default ItemDetail;
