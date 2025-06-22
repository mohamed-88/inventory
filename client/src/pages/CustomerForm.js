import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import { Button, TextField, Typography, Box } from '@mui/material';
import './CustomerForm.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { Phone } from 'lucide-react';
import { InputGroup, Form } from 'react-bootstrap';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';



const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [rtlPlugin],
});

const theme = createTheme({
  direction: 'rtl',
});

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
      alert('شاشیەک دتومارکرنا کریاری دا دروست بو');
      console.error(err);
    }
  };

  return (
    <Box className="form-container">
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate(-1)}
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2, fontWeight: 'bold', margin: '15px' }}
      >
        زفرین
      </Button>

      <form onSubmit={handleSubmit} className="customer-form">
        <Typography style={{ textAlign: 'center' }} variant="h4" gutterBottom>
          {!id || id === 'new' ? 'زێدەکرنا بکری' : 'دەستکاری کرنا بکری'}
        </Typography>

        <Box className="row" sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <CacheProvider value={cacheRtl}>
          <ThemeProvider theme={theme}>
            <div dir="rtl">
              <TextField
            fullWidth
            name="name"
            label="ناف"
            value={form.name}
            onChange={handleChange}
          />
            </div>
          </ThemeProvider>
        </CacheProvider>

          <CacheProvider value={cacheRtl}>
          <ThemeProvider theme={theme}>
            <div>
              <TextField
                fullWidth
                name="email"
                label="ئیمەیڵ"
                value={form.email}
                onChange={handleChange}
              />
            </div>
          </ThemeProvider>
        </CacheProvider>
 
          <InputGroup dir="rtl">
            <Form.Control
              type="tel"
              placeholder="750xxxxxxx"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              style={{ textAlign: 'left', fontSize: '16px' }}
            />
            <InputGroup.Text style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
              964+ <Phone size={18} style={{ opacity: 0.7 }} />
            </InputGroup.Text>
          </InputGroup>
        </Box>

        <Box className="row" sx={{ mt: 2, }}>
          <CacheProvider value={cacheRtl}>
          <ThemeProvider theme={theme}>
            <div dir="rtl">
              <TextField
                fullWidth
                name="address"
                label="نافونیشان"
                value={form.address}
                onChange={handleChange}
                sx={{ fontWeight: 'bold' }}
              />
            </div>
          </ThemeProvider>
        </CacheProvider>
        </Box>

        <Box className="button-row" sx={{ mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
          >
            💾 تومارکرن
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default CustomerForm;




// import React, { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import api from '../api';
// import './CustomerForm.css';

// const CustomerForm = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     address: ''
//   });

//   useEffect(() => {
//     if (id && id !== 'new') {
//       api.get('/customers').then(res => {
//         const existing = res.data.find(c => c._id === id);
//         if (existing) setForm(existing);
//       });
//     }
//   }, [id]);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   try {
//     // پاککردنی 0 لە سەرەتا و زیادکردنی +964
//     let cleanedPhone = form.phone.trim();
//     if (cleanedPhone.startsWith('0')) {
//       cleanedPhone = cleanedPhone.slice(1);
//     }
//     const formToSend = {
//       ...form,
//       phone: `+964${cleanedPhone}`
//     };

//     if (!id || id === 'new') {
//       await api.post('/customers', formToSend);
//     } else {
//       await api.put(`/customers/${id}`, formToSend);
//     }
//     navigate('/');
//   } catch (err) {
//     alert('Error saving customer');
//     console.error(err);
//   }
// };


//   return (
//     <div className="form-container">
//       <button type="button" onClick={() => navigate(-1)}>زفرین 🔙</button>
//       <form onSubmit={handleSubmit} className="customer-form" style={{ direction: 'rtl' }}>
//         <h1>{!id || id === 'new' ? 'زێدەکرنا بکری' : 'دەستکاری کرنا بکری'}</h1>

//         <div className="row">
//           <input name="name" placeholder="ناف" value={form.name} onChange={handleChange} required />
//           <input name="email" placeholder="ئیمەیڵ" value={form.email} onChange={handleChange} />
//           <div className="phone-input-wrapper" style={{ padding: '0 0' }}>
//             <input
//               type="tel"
//               name="phone"
//               placeholder="750xxxxxxx"
//               value={form.phone}
//               onChange={handleChange}
//               required
//             />
//             <span className="country-code">+964</span>
//           </div>
//         </div>

//         <div className="row">
//           <input name="address" placeholder="نافونیشان" value={form.address} onChange={handleChange} />
//         </div>

//         <div className="button-row">
//           {/* <button type="button" className="back-button" onClick={() => navigate(-1)}>زفرین 🔙</button> */}
//           <button type="submit" className="save-button">تومارکرن 💾</button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CustomerForm;