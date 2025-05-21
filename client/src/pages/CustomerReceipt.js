import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import tablelogo from '../assets/tablelogo.png';
import { Container, Typography, Box, Button, Grid } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import '../pages/CustomerReceipt.css';


const CustomerReceipt = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [items, setItems] = useState([]);
  const [billNo, setBillNo] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const load = async () => {
      try {
        const [customerRes, itemRes] = await Promise.all([
          api.get('/customers'),
          api.get('/items')
        ]);

        const sortedCustomers = customerRes.data.sort((a, b) =>
          a.name.localeCompare(b.name, 'ku', { sensitivity: 'base' })
        );
        const foundIndex = sortedCustomers.findIndex(c => c._id === id);
        const foundCustomer = sortedCustomers[foundIndex];
        const customerItems = itemRes.data.items.filter(
          i => i.customerId === id || i.customerId?._id === id
        );

        setCustomer(foundCustomer);
        setItems(customerItems);
        setBillNo(1000 + foundIndex + 1);
        setCurrentDateTime(new Date());
      } catch (err) {
        console.error('Failed to load receipt:', err);
      }
    };

    load();
  }, [id]);

  if (!customer) return <Typography>جافەرێبە...</Typography>;

  const total = items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  const paid = customer.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
  const remaining = total - paid;

  const formattedDate = currentDateTime.toLocaleDateString();
  const formattedTime = currentDateTime.toLocaleTimeString();

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <br />
      <br />
      {/* Header */}
      <Box textAlign="center" mb={2}>
        <img src={tablelogo} alt="Logo" style={{ width: 200 }} />
        <Typography variant="h5" fontWeight="bold" mt={1} sx={{ fontSize: '21px' }}>
          نڤێسینگەها ئەحمد بوو بازرگانیا کەل و پەلێت کارەبێ ب کت و کوم
          <p style={{ fontSize: '20px' }}>هەر وەسا ئەم دئامادەینە بوو دروستکرنا هەمی جوری ئاڤاهیا ب دیزاینێت مودرن و سەردەمانە</p>
        </Typography>
      </Box>

      {/* Date & Bill Info */}
      <Grid item xs={6} textAlign="right">
        <Typography><strong>بەرێز:</strong> {customer.name}</Typography>
        <Typography><strong>ژ. مۆبایل:</strong> {customer.phone}</Typography>
        <Typography><strong>ژمارا ( پسولێ ) :</strong> {billNo}</Typography>
          <Typography><strong>مێژویا:</strong> {formattedDate}</Typography>
          <Typography sx={{direction: 'rtl'}}><strong>کاتژمێر:</strong> {formattedTime}</Typography>
        </Grid>
        
      <Grid container spacing={2} mb={2}>

      <Typography style={{ textAlign: 'center' }}>📞 07503414123 - 📞 07507325775 - 📞 07504810978</Typography>
      
        <Grid item xs={6}>
          
        </Grid>
        
      </Grid>

      {/* Table */}
            <div className="custom-table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th>بهایێ گشتی</th>
               <th>بهایێ ئێکێ</th>
               <th>ژمارە</th>
               <th>نافێ کەل و پەلی</th>
               <th>ڕیز</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 20 }, (_, index) => {
              const item = items[index];
              return (
                <tr key={index}>
                   <td>{item?.totalPrice ? `$${item.totalPrice.toFixed(2)}` : ''}</td>
                   <td>{item?.unitPrice ? `$${item.unitPrice}` : ''}</td>
                   <td>{item?.quantity || ''}</td>
                   <td>{item?.name || ''}</td>
                   <td>{index + 1}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>


      {/* Summary */}
      <Box mt={3} style={{ borderTop: '1px solid #ccc', paddingTop: '10px', direction: 'rtl' }}>
         <Typography variant="h6"><strong>💵 پارێ هاتیە دان:</strong> ${paid.toFixed(2)}</Typography>
         <Typography variant="h6"><strong>📌 پارێ مای:</strong> ${remaining.toFixed(2)}</Typography>
        <Typography variant="h6"><strong>💰 پارێ گشتی:</strong> ${total.toFixed(2)}</Typography>
      </Box>

      <p style={{ textAlign: 'center', marginTop: '20px' }}>خەلەت بون بوو هەردوو لا دزفریت</p>

      <Box mt={4} display="flex" justifyContent="center" gap={2}>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<PrintIcon />}
          onClick={() => window.print()}
        >
          چاپکرن
        </Button>

      </Box>
    </Container>
  );
};

export default CustomerReceipt;