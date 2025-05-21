import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import './CustomerForm.css';

const CustomerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    if (id && id !== 'new') {
      api.get('/customers').then(res => {
        const existing = res.data.find(c => c._id === id);
        if (existing) setForm(existing);
      });
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    // پاککردنی 0 لە سەرەتا و زیادکردنی +964
    let cleanedPhone = form.phone.trim();
    if (cleanedPhone.startsWith('0')) {
      cleanedPhone = cleanedPhone.slice(1);
    }
    const formToSend = {
      ...form,
      phone: `+964${cleanedPhone}`
    };

    if (!id || id === 'new') {
      await api.post('/customers', formToSend);
    } else {
      await api.put(`/customers/${id}`, formToSend);
    }
    navigate('/');
  } catch (err) {
    alert('Error saving customer');
    console.error(err);
  }
};


  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="customer-form" style={{ direction: 'rtl' }}>
        <h1>{!id || id === 'new' ? 'زێدەکرنا بکری' : 'دەستکاری کرنا بکری'}</h1>

        <div className="row">
          <input name="name" placeholder="ناف" value={form.name} onChange={handleChange} required />
          <input name="email" placeholder="ئیمەیڵ" value={form.email} onChange={handleChange} />
          {/* <input name="phone" placeholder="تەلەفۆن" value={form.phone} onChange={handleChange} /> */}
          <div className="phone-input-wrapper" style={{ padding: '0 0' }}>
            <input
              type="tel"
              name="phone"
              placeholder="750xxxxxxx"
              value={form.phone}
              onChange={handleChange}
              required
            />
            <span className="country-code">+964</span>
          </div>
        </div>

        <div className="row">
          <input name="address" placeholder="نافونیشان" value={form.address} onChange={handleChange} />
        </div>

        <div className="button-row">
          <button type="button" className="back-button" onClick={() => navigate(-1)}>زفرین 🔙</button>
          <button type="submit" className="save-button">تومارکرن 💾</button>
        </div>
      </form>
    </div>
  );
};

export default CustomerForm;