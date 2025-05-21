import { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Box, Button, Typography, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Chip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import api from '../api';
import './CustomerDetail.css';


const CustomerDetail = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [items, setItems] = useState([]);
  const [showPayments, setShowPayments] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');

  const fetchCustomerAndItems = async () => {
    try {
      const customerRes = await api.get('/customers');
      const sortedCustomers = customerRes.data.sort((a, b) =>
        a.name.localeCompare(b.name, 'ku', { sensitivity: 'base' })
      );

      const foundIndex = sortedCustomers.findIndex(c => c._id === id);
      const foundCustomer = sortedCustomers[foundIndex];
      if (foundCustomer) {
        foundCustomer.billNo = 1000 + foundIndex + 1;
        setCustomer(foundCustomer);
      }

      const itemsRes = await api.get('/items');
      const filtered = itemsRes.data.items.filter(i =>
        i.customerId === id || i.customerId?._id === id
      );
      setItems(filtered);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    fetchCustomerAndItems();
  }, [id]);

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('ئەرێ تە دڤێت ئەفی بابەتی مسح بکەی?')) {
      await api.delete(`/items/${itemId}`);
      fetchCustomerAndItems(); 
    }
  };

  const registerPayment = async () => {
    if (remaining <= 0) {
      alert('كریار بێشتر بتەمامی پارە هاتیە دان.');
      return;
    }

    try {
      await api.post(`/customers/${customer._id}/payments`, {
        amount: parseFloat(paymentAmount)
      });
      setShowPayments(false);
      setPaymentAmount('');
      fetchCustomerAndItems();
    } catch (err) {
      alert('شكەستن ئینا دپارە دانا دپاشەکەفتنی دا');
      console.error(err);
    }
  };

  if (!customer) return <p style={{ textAlign: 'center', marginTop: '20px' }}>جافەرێ بە...</p>;

  const totalValue = items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  const totalPaid = customer.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
  const remaining = totalValue - totalPaid;

  const whatsappLink = `https://wa.me/${customer.phone?.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(customer.name)},%20regarding%20your%20inventory`;
  const mailLink = `mailto:${customer.email}?subject=Inventory Update`;

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
            <Button href={whatsappLink} target="_blank" variant="contained" style={{ fontWeight: 'bold' }}>واتسئەپ 💬</Button>
          </Grid>
        )}
        {customer.email && (
          <Grid item>
            <Button href={mailLink} variant="contained" color="info" style={{ fontWeight: 'bold' }}>ئیمەیڵ 📧</Button>
          </Grid>
        )}
        <Grid item>
          <Button component={RouterLink} to={`/customer/${customer._id}/edit`} variant="contained" style={{ fontWeight: 'bold' }}>ئیدیت ✏️</Button>
        </Grid>
        <Grid item>
          <Button component={RouterLink} to={`/customer/${customer._id}/receipt`} variant="contained" style={{ fontWeight: 'bold' }}>پسولە 🧾</Button>
        </Grid>
        <Grid item>
          {remaining > 0 ? (
            <Button variant="contained" color="warning" onClick={() => setShowPayments(true)}>
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
          <Typography>.هیچ بابەتەک بوو ئەڤێ کردارێ نینە</Typography>
        ) : (
          <>

          <TableContainer component={Paper} className="table-container">
  <Table sx={{ direction: 'rtl' }}>
    <TableHead>
      <TableRow>
        <TableCell>📦 نافێ گەل و پەلا</TableCell>
        <TableCell>🔢 ژمارە</TableCell>
        <TableCell>💵 بهایێ ئێکێ</TableCell>
        <TableCell>💰 بهایێ گشتی</TableCell>
        <TableCell>⚙️ کردار</TableCell>
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
          <TableCell>{item.name}</TableCell>
          <TableCell>{item.quantity}</TableCell>
          <TableCell>${item.unitPrice}</TableCell>
          <TableCell>${item.totalPrice.toFixed(2)}</TableCell>
          <TableCell>
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

            <Box sx={{ textAlign: 'right', mt: 2, fontWeight: 'bold' }}>
              <Typography><strong>💳 پارێ هاتیە دان:</strong> ${totalPaid.toFixed(2)}</Typography>
              <Typography><strong>💰 پارێ مای:</strong> ${remaining.toFixed(2)}</Typography>
              <Typography><strong>🧾 بهایێ گشتی:</strong> ${totalValue.toFixed(2)}</Typography>

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