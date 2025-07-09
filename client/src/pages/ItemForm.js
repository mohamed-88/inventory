import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { Button } from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

const ItemForm = () => {
  const { customerId, itemId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    description: '',
    quantity: 1,
    unitPrice: 0,
  });

  // 1. Ev stateên bêmifa yên ji bo wêneyan hatin jêbirin.
  // const [image, setImage] = useState(null);
  // const [, setPreview] = useState(null);

  useEffect(() => {
    if (itemId && itemId !== 'new') {
      api.get('/items').then(res => {
        const item = res.data.items.find(i => i._id === itemId);
        if (item) {
          setForm({
            name: item.name,
            description: item.description || '',
            quantity: item.quantity || 1,
            unitPrice: item.unitPrice || 0,
          });
          // Ev beş ji bo previewa wêneyê bû, hate jêbirin.
          // if (item.imageUrl) {
          //   setPreview(`http://localhost:5000${item.imageUrl}`);
          // }
        }
      });
    }
  }, [itemId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === 'quantity' || name === 'unitPrice' ? Number(value) : value
    });
  };

  // 2. Ev fenkşina bêmifa hate jêbirin, ji ber ku nehatiye bikaranîn.
  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   setImage(file);
  //   if (file) {
  //     setPreview(URL.createObjectURL(file));
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 3. Kodê FormData hate sadekirin ji ber ku êdî wêne tune.
    const itemData = { ...form, customerId };

    try {
      if (!itemId || itemId === 'new') {
        // Bi JSONê dişîne, ne wek FormData
        await api.post('/items', itemData);
      } else {
        // Bi JSONê dişîne, ne wek FormData
        await api.put(`/items/${itemId}`, itemData);
      }
      navigate(`/customer/${customerId}`);
    } catch (err) {
      console.error('❌ Error saving item:', err.response?.data || err.message);
      alert('Error saving item: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="container my-4">
      <Button onClick={() => navigate(`/customer/${customerId}`)} variant="contained" style={{ position: 'absolute', top: '20px', left: '30px', fontWeight: 'bold' }}><KeyboardBackspaceIcon /> زفرین</Button>
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', }}>

        <form
          dir="rtl"
          onSubmit={handleSubmit}
          className="bg-white p-5 rounded shadow"
          style={{ width: '100%', maxWidth: '600px', marginBottom: '-10px' }}
        >
          <h4 className="m-0" style={{ textAlign: 'center', marginBottom: '20px', color: 'blue' }}>
            {!itemId || itemId === 'new' ? 'زێدەکرنا کەل و پەلا ➕' : ' دەستکاری کرنا کەل و پەلا ✏️'}
          </h4>
          <div className="mb-4 d-flex justify-content-between align-items-center">
          </div>

          <div className="mb-3">
            <label className="form-label" style={{ fontWeight: 'bold' }}>ناف:</label>
            <input
              name="name"
              className="form-control"
              placeholder="نافێ کەل و پەلی"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label" style={{ fontWeight: 'bold' }}>وەسف:</label>
            <input
              name="description"
              className="form-control"
              placeholder="کورتکرنا وەسفێ"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label" style={{ fontWeight: 'bold' }}>ژمارە:</label>
            <input
              name="quantity"
              type="number"
              min="1"
              className="form-control"
              value={form.quantity}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label" style={{ fontWeight: 'bold' }}>بهایێ ئێکێ:</label>
            <input
              name="unitPrice"
              type="number"
              step="0.01"
              min="0"
              className="form-control"
              value={form.unitPrice}
              onChange={handleChange}
              required
            />
          </div>

          <div className="d-grid">
            <Button type="submit" variant="contained" style={{ fontWeight: 'bold' }}>تومارکرن 💾</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemForm;