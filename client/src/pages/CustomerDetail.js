import { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Box, Button, Typography, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Chip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import api from '../api';
import { FaBoxOpen, FaMoneyBillWave, FaCoins, FaHashtag, FaReceipt, FaMapMarkerAlt } from 'react-icons';


const CustomerDetail = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [items, setItems] = useState([]);
  const [showPayments, setShowPayments] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');

  const fetchCustomerAndItems = async () => {
    try {
      const [customerRes, itemsRes] = await Promise.all([
        api.get('/customers'),
        api.get('/items')
      ]);

      const sortedCustomers = customerRes.data.sort((a, b) =>
        a.name.localeCompare(b.name, 'ku', { sensitivity: 'base' })
      );
      const foundCustomer = sortedCustomers.find(c => c._id === id);
      if (foundCustomer) {
        foundCustomer.billNo = 1000 + sortedCustomers.indexOf(foundCustomer) + 1;
        setCustomer(foundCustomer);
      }

      const filteredItems = itemsRes.data.items.filter(i =>
        i.customerId === id || i.customerId?._id === id
      );
      setItems(filteredItems);
    } catch (err) {
      console.error('شکەستن ئینا دزانیاریا دا:', err);
    }
  };
  

  useEffect(() => {
    fetchCustomerAndItems();
  }, [id]);

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('ئەرێ تەدڤێت بابەتی ژێبەی ؟')) {
      await api.delete(`/items/${itemId}`);
      fetchCustomerAndItems();
    }
  };

  const registerPayment = async () => {
    if (remaining <= 0) return alert('پارە بتەمامی هاتیە دان.');

    try {
      await api.post(`/customers/${customer._id}/payments`, {
        amount: parseFloat(paymentAmount)
      });
      setShowPayments(false);
      setPaymentAmount('');
      fetchCustomerAndItems();
    } catch (err) {
      console.error('خەلەتی دتومارکرنا پارە دانێ دا:', err);
      alert('خەلەتیەك رویدا.');
    }
  };

  if (!customer) {
    return <Typography align="center" mt={4}>جافەرێ بە...</Typography>;
  }
  const mailLink = `mailto:${customer.email}?subject=Bill%20Details&body=سلاف ${customer.name}، هیڤیە زانیاریا ب بینە.`;

  const totalValue = items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  const totalPaid = customer.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
  const remaining = totalValue - totalPaid;
  const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);


  const sendAllItemsViaWhatsApp = () => {
  const phone = customer.phone?.replace(/\D/g, '');
  if (!phone) return alert("ژمارا تەلەفۆنێ بەردەست نینە!");

  const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const remaining = totalAmount - totalPaid;

  let msg = `سلاڤ بەرێز. ${customer.name},\n\n`;
  msg += `🧾 ژمارا پسولێ: ${customer.billNo}\n`;
  msg += `📍 ناڤونیشان: ${customer.address || 'نینە'}\n\n`;

  msg += `📦 کەل و پەل:\n`;

  items.forEach((item, index) => {
    msg += `\n${index + 1}) ${item.name}\n`;
    msg += `🔢 ${item.quantity} x $${item.unitPrice} = $${item.totalPrice.toFixed(2)}`;
  });

  msg += `\n\n━━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `💳 بهایێ گشتی: $${totalAmount.toFixed(2)}\n`;
  msg += `💵 پارێ هاتیە دان: $${totalPaid.toFixed(2)}\n`;
  msg += `💰 پارێ مای: $${remaining.toFixed(2)}\n`;

  // ✅ encodeURIComponent پێویستە بکاربهێنیت بۆ URL
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  window.open(whatsappUrl, '_blank');
};


const sendAllItemsViaEmail = () => {
  if (!customer.email) {
    alert("ئیمەیلێ کڕیاری بەردەست نینە!");
    return;
  }

  let msg = `سلاڤ بەرێز. ${customer.name},\n\n`;
  msg += `ژمارا پسولێ: ${customer.billNo}\n`;
  msg += `ناڤونیشان: ${customer.address || 'نینە'}\n\n`;
  msg += `📦 کەل و پەل:\n`;

  items.forEach((item, index) => {
    msg += `${index + 1}) ${item.name}\n`;
    msg += `🔢 ${item.quantity}x $${item.unitPrice} = $${item.totalPrice.toFixed(2)}\n\n`;
  });

  msg += `\n\n━━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `💳 بهایێ گشتی: $${totalAmount.toFixed(2)}\n`;
  msg += `💳 پارێ هاتیە دان: $${totalPaid.toFixed(2)}\n`;
  msg += `💰 پارێ مای: $${remaining.toFixed(2)}\n`;
  

  const subject = `پێزانینیت پسولێ  ${customer.billNo}`;
  const mailtoLink = `mailto:${customer.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(msg)}`;

  window.open(mailtoLink, '_blank');
};


  return (
    <Box sx={{ p: 2, }}>
      <Button
        component={RouterLink}
        to="/"
        startIcon={<ArrowBackIcon />}
        variant="contained"
        sx={{ mb: 2, fontWeight: 'bold' }}
      >
        زفرین
      </Button>

      <Typography sx={{ textAlign: 'center', fontWeight: 'bold' }} variant="h4" gutterBottom>{customer.name}</Typography>
      <Typography sx={{ textAlign: 'center', fontWeight: 'bold' }}>🧾 <strong>ژمارا پسولێ:</strong> {customer.billNo}</Typography>
      <Typography sx={{ textAlign: 'center', fontWeight: 'bold' }}>📍 {customer.address || 'No address provided'}</Typography>
      <Typography sx={{ textAlign: 'center', fontWeight: 'bold' }}>📞 {customer.phone || 'No phone provided'}</Typography>
      <Typography sx={{ textAlign: 'center', fontWeight: 'bold' }}>✉️ {customer.email || 'No email provided'}</Typography>

      <Grid container spacing={2} sx={{ mt: 2, mb: 2, justifyContent: 'center' }}>
        {customer.phone && (
          <Grid item>
            <Button onClick={sendAllItemsViaWhatsApp} target="_blank" variant="contained" style={{ fontWeight: 'bold' }}>واتسئەپ 💬</Button>
          </Grid>
        )}

          <Grid>
            <Button onClick={sendAllItemsViaEmail} variant="contained" color="info" style={{ fontWeight: 'bold' }}>ئیمەیڵ 📧</Button>
          </Grid>

        <Grid item>
          <Button component={RouterLink} to={`/customer/${customer._id}/edit`} variant="contained" style={{ fontWeight: 'bold' }}>ئیدیت ✏️</Button>
        </Grid>
        <Grid item>
          <Button component={RouterLink} to={`/customer/${customer._id}/receipt`} variant="contained" style={{ fontWeight: 'bold' }}>پسولە 🧾</Button>
        </Grid>
        <Grid item>
          {remaining > 0 ? (
            <Button style={{ fontWeight: 'bold' }} variant="contained" color="warning" onClick={() => setShowPayments(true)}>
              💸 تومارکرنا پارەدانێ
            </Button>
          ) : (
            <Chip style={{ fontWeight: 'bold' }} label="✅ پارە بتەمامی هاتیە دان" color="success" />
          )}
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, justifyContent: 'center', textAlign: 'center' }}>
        <Typography variant="h5">📦 کەل و پەل</Typography>
        <Button
          component={RouterLink}
          to={`/customer/${customer._id}/item/new`}
          variant="contained"
          sx={{ mt: 2, mb: 2, fontWeight: 'bold' }}
        >
          ➕ زێدەکرنا کەل و پەلا
        </Button>

        {items.length === 0 ? (
          <Typography >.هیچ بابەتەک بوو ئەڤێ کردارێ نینە</Typography>
        ) : (
          <>

          <TableContainer component={Paper} className="table-container">
  <Table sx={{ direction: 'rtl' }}>
    <TableHead>
      <TableRow style={{ backgroundColor: '#f0f0f0' }}>
        <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>📦 نافێ گەل و پەلا</TableCell>
        <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>🔢 ژمارە</TableCell>
        <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>💵 بهایێ ئێکێ</TableCell>
        <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>💰 بهایێ گشتی</TableCell>
        <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>⚙️ کردار</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {items.map((item) => (
        <TableRow
          key={item._id}
          hover
          sx={{
            '&:hover': { backgroundColor: '#f9f9f9' },
            transition: 'all 0.3s ease',
          }}
        >
          <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>{item.name}</TableCell>
          <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>{item.quantity}</TableCell>
          <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>${item.unitPrice}</TableCell>
          <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>${item.totalPrice.toFixed(2)}</TableCell>
          <TableCell sx={{ textAlign: 'center' }}>
            <Button
              component={RouterLink}
              to={`/customer/${customer._id}/item/${item._id}/edit`}
              size="small"
              variant="outlined"
              color="primary"
              sx={{ mr: 1, marginLeft: '10px', marginBottom: '10px', fontWeight: 'bold' }}
            >
              ✏️ Edit
            </Button>
            <Button style={{ marginBottom: '10px' }}
              onClick={() => handleDeleteItem(item._id)}
              size="small"
              variant="contained"
              color="error"
            >
                  🗑 Delete
                </Button>
              </TableCell>
          </TableRow>
        ))}
        </TableBody>
      </Table>
    </TableContainer>

            <Box sx={{ textAlign: 'right', mt: 2, fontWeight: 'bold', color: 'blue' }}>
              <Typography sx={{ fontWeight: 'bold' }}><strong>💳 پارێ هاتیە دان:</strong> ${totalPaid.toFixed(2)}</Typography>
              <Typography sx={{ fontWeight: 'bold' }}><strong>💰 پارێ مای:</strong> ${remaining.toFixed(2)}</Typography>
              <Typography sx={{ fontWeight: 'bold' }}><strong>🧾 بهایێ گشتی:</strong> ${totalValue.toFixed(2)}</Typography>

              <details style={{ marginTop: '1rem' }}>
                <summary>مێژویا دیتنا پارەدانێ 📆</summary>
                <ul>
                  {customer.payments?.map((p, idx) => (
                    <li key={idx}>💵 ${p.amount} on {new Date(p.date).toLocaleDateString()}</li>
                  ))}
                </ul>
              </details>
            </Box>
          </>
        )}
      </Box>

      <Dialog open={showPayments} onClose={() => setShowPayments(false)}>
        <DialogTitle align='center'>تومارکرنا پارەدانێ</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            type="number"
            label="دانا پارەی"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPayments(false)} style={{ marginRight: '50px', fontWeight: 'bold' }}> رەتکرن ❌</Button>
          <Button onClick={registerPayment} variant="contained" style={{ fontWeight: 'bold' }}>تومارکرن 💾</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomerDetail;