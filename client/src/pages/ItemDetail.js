import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

const ItemDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    api.get('/items').then(res => {
      const found = res.data.items.find(i => i._id === id);
      setItem(found);
    });
  }, [id]);

  if (!item) return <p>Loading item...</p>;

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
    </div>
  );
};

export default ItemDetail;
