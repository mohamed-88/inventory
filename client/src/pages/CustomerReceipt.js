import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import tablelogo from '../assets/tablelogo.png';
import ahmedtype from '../assets/ahmedtype.png';
import { Container, Typography, Box, Button, Grid } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
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
          api.get('/items'),
        ]);

        const sortedCustomers = customerRes.data.sort((a, b) =>
          a.name.localeCompare(b.name, 'ku', { sensitivity: 'base' })
        );
        const foundIndex = sortedCustomers.findIndex((c) => c._id === id);
        const foundCustomer = sortedCustomers[foundIndex];
        const customerItems = itemRes.data.items.filter(
          (i) => i.customerId === id || i.customerId?._id === id
        );

        setCustomer(foundCustomer);
        setItems(customerItems);
        setBillNo(1000 + foundIndex + 1);
        setCurrentDateTime(new Date());
      } catch (err) {
        console.error('شکەستن ئینا دبارکرنا پسولێ دا:', err);
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

  const sendWhatsApp = async () => {
    const input = document.getElementById('pdf-content');
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    const blob = pdf.output('blob');

    const file = new File([blob], 'receipt.pdf', { type: 'application/pdf' });
    const url = URL.createObjectURL(file);

    const message = `سڵاو بەرێز ${customer.name}، سوپاس بۆ هەلبژارتنەکەت. تکایە وەسڵی PDF لە لینکەکە داونلۆد بکە: ${url}`;
    const phone = customer.phone?.replace(/\D/g, '');

    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  };

  const savePdfLocally = async () => {
    const input = document.getElementById('pdf-content');
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');

    const imgProps = {
      width: canvas.width,
      height: canvas.height,
    };

    const pdfWidth = 210; // A4 mm
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    const pdf = new jsPDF('p', 'mm', [pdfWidth, pdfHeight]);
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`پسولا ${customer.name}.pdf`);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4, fontFamily: "'Noto Naskh Arabic', sans-serif" }}>
      <div id="pdf-content">
        <Box mb={3}>
          <img src={tablelogo} alt="Logo" style={{ width: 100, margin: 'left' }} />
          <div style={{ textAlign: 'center' }}>
            <img src={ahmedtype} alt="Logo" style={{ width: '50%', marginTop: '-120px' }} />
          </div>

          <Typography
            variant="h5"
            fontWeight="bold"
            mt={1}
            sx={{ fontSize: '21px', textAlign: 'center', marginTop: '-20px' }}
          >
            نڤێسینگەها ئەحمد بوو بازرگانیا کەل و پەلێت کارەبێ ب کت و کوم
            <p style={{ fontSize: '20px' }}>
              هەر وەسا ئەم دئامادەینە بوو دروستکرنا هەمی جوری ئاڤاهیا ب دیزاینێت سەردەمانە و مودرن
            </p>
          </Typography>
        </Box>

      <Grid item xs={6} textAlign="right" sx={{ fontFamily: 'KurdishSorani', fontWeight: 'bold' }}>
      <Typography><strong>بەرێز:</strong> {customer.name}</Typography>
      <Typography><div>{customer.phone} <strong>:ژ. مۆبایل</strong></div></Typography>
      <Typography><strong>ژمارا ( پسولێ ) :</strong> {billNo}</Typography>
      <Typography><strong>مێژویا:</strong> {formattedDate}</Typography>
      <Typography sx={{ direction: 'rtl' }}><strong>کاتژمێر:</strong> {formattedTime}</Typography>
    </Grid>

        {/* <Grid item xs={6} textAlign="right">
          <Typography><strong>بەرێز:</strong> {customer.name}</Typography>
          <Typography><div>{customer.phone} <strong>:ژ. مۆبایل</strong></div></Typography>
          <Typography><strong>ژمارا ( پسولێ ) :</strong> {billNo}</Typography>
          <Typography><strong>مێژویا:</strong> {formattedDate}</Typography>
          <Typography sx={{ direction: 'rtl' }}><strong>کاتژمێر:</strong> {formattedTime}</Typography>
        </Grid> */}

        <Grid container spacing={2} mb={2}>
          <Typography style={{ textAlign: 'center' }}>
            📞 07503414123 - 📞 07507325775 - 📞 07504810978
          </Typography>
        </Grid>

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

        <Box mt={3} style={{ 
          borderTop: '1px solid #ccc',
          paddingTop: '10px',
          direction: 'rtl',
          fontFamily: 'KHejar',
          }}>
          <Typography variant="h6"><strong>💵 پارێ هاتیە دان:</strong> ${paid.toFixed(2)}</Typography>
          <Typography variant="h6"><strong>📌 پارێ مای:</strong> ${remaining.toFixed(2)}</Typography>
          <Typography variant="h6"><strong>💰 پارێ گشتی:</strong> ${total.toFixed(2)}</Typography>
        </Box>

        <p style={{ textAlign: 'center', marginTop: '20px' }}>شاش بون بوو هەردوو لا دزفریت</p>
      </div>

      <Box mt={4} display="flex" justifyContent="center" gap={2}>
        {/* <Button
          variant="contained"
          color="success"
          startIcon={<PrintIcon />}
          onClick={sendWhatsApp}
        >
          نڤێسینگەی WhatsApp 📱
        </Button> */}
        <Button variant="contained" color="info" onClick={savePdfLocally}>
          Download PDF 📄
        </Button>

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
