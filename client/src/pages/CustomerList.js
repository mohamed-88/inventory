import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Stack, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination } from '@mui/material';
import api from '../api';
import './CustomerList.css';

const ITEMS_PER_PAGE = 5;

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true); // Ji bo nîşandana "Loading..."
  const [error, setError] = useState(null); // Ji bo nîşandana xeta

  // 1. Bikaranîna async/await bi try/catch ji bo birêvebirina çêtir a xeletiyan
  const fetchCustomers = useCallback(async () => {
    try {
      console.log("Daxwazî tê şandin bo API..."); // Ji bo testa
      setLoading(true); // Destpêkirina barkirinê
      setError(null); // Paqijkirina xeletiya berê

      const res = await api.get('/customers');
      
      console.log("Bersiv hat:", res.data); // Ji bo testa

      const customersWithBill = res.data.map((c, i) => ({
        ...c,
        billNo: 1000 + i + 1,
      }));
      setCustomers(customersWithBill);

    } catch (err) {
      console.error("XETA DI ÎNANA DATAYAN DE:", err); // Xeletiya rastîn nîşan bide
      setError("Neşiyam datayan bînim. Ji kerema xwe piştrast be ku server kar dike û hewl bide."); // Peyama xeletiyê ji bo bikarhêner
    } finally {
      setLoading(false); // Dawîkirina barkirinê
    }
  }, []); // useCallback piştrast dike ku ev fonksiyon tenê carekê tê çêkirin

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]); // useEffect dê dema fetchCustomers amade be kar bike

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const filteredCustomers = customers.filter((c) => {
    const lowerSearch = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(lowerSearch) ||
      c.phone?.toLowerCase().includes(lowerSearch) ||
      c.email?.toLowerCase().includes(lowerSearch) ||
      c.address?.toLowerCase().includes(lowerSearch) ||
      c.billNo?.toString().includes(lowerSearch)
    );
  });

  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);
  const visibleCustomers = filteredCustomers.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <Box p={2}>
      <br />
      <Typography variant="h4" align="center" gutterBottom>
        لیستا بکرا 📋
      </Typography>
      <br />
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems="stretch"
        justifyContent="flex-start"
        mb={3}
        sx={{
          p: 2,
          backgroundColor: 'background.paper',
          borderRadius: 3,
          boxShadow: 3,
          gap: 2,
          flexWrap: 'nowrap',
        }}
      >
        <TextField
          variant="outlined"
          size="medium"
          fullWidth
          placeholder="🔍 لێگەریانا ناف, تەلەفون, ئیمەیڵ, نافونیشان, یان ژمارا پسولێ"
          value={search}
          onChange={handleSearchChange}
          sx={{
            backgroundColor: '#fff',
            borderRadius: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            },
            flex: 1,
            direction: 'rtl',
            textAlign: 'right',
          }}
        />
        <Button
          component={Link}
          to="/customer/new"
          variant="contained"
          color="primary"
          size="medium"
          className="customer-add-button"
        >
          زێدەکرنا بکری ➕
        </Button>
      </Stack>

      {/* 2. Nîşandana peyama Loading an Error */}
      {loading && <Typography align="center">داتا دهێنە بارکرن...</Typography>}
      {error && <Typography align="center" color="error">{error}</Typography>}

      {!loading && !error && (
        <>
          <TableContainer component={Paper} className="table-container" style={{ direction: 'rtl' }}>
            <Table className="customer-table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ textAlign: 'center' }}>ناف</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>تەلەفۆن</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>نافونیشان</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>ئیمەیڵ</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>ژمارا پسولێ</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>کردار</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} style={{ direction: 'rtl', textAlign: 'right' }}>
                      هیچ بکرەک نەهاتیە تومارکرن.
                    </TableCell>
                  </TableRow>
                ) : (
                  visibleCustomers.map((c) => (
                    <TableRow key={c._id}>
                      <TableCell style={{ textAlign: 'center' }}>{c.name}</TableCell>
                      <TableCell style={{ textAlign: 'center', direction: 'ltr' }}>{c.phone}</TableCell>
                      <TableCell style={{ textAlign: 'center' }}>{c.address}</TableCell>
                      <TableCell style={{ textAlign: 'center' }}>{c.email}</TableCell>
                      <TableCell style={{ textAlign: 'center' }}>{c.billNo}</TableCell>
                      <TableCell>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                          <Button
                            component={Link}
                            to={`/customer/${c._id}`}
                            size="small"
                            variant="contained"
                          >
                            View
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {totalPages > 1 && (
            <Box mt={3} display="flex" justifyContent="center">
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, value) => setPage(value)}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default CustomerList;


// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { Box, Button, Stack, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination } from '@mui/material';
// import api from '../api';
// import './CustomerList.css';

// const ITEMS_PER_PAGE = 5;

// const CustomerList = () => {
//   const [customers, setCustomers] = useState([]);
//   const [search, setSearch] = useState('');
//   const [page, setPage] = useState(1);
  
//   // 1. Ev rêza bêmifa ya 'selectedLetter' bi temamî hate jêbirin.
//   // const [selectedLetter, setSelectedLetter] = useState('');

//   useEffect(() => {
//     api.get('/customers').then((res) => {
//       const customersWithBill = res.data.map((c, i) => ({
//         ...c,
//         billNo: 1000 + i + 1,
//       }));
//       setCustomers(customersWithBill);
//     });
//   }, []);

//   const handleSearchChange = (e) => {
//     setSearch(e.target.value);
//     setPage(1);
//   };

//   const filteredCustomers = customers.filter((c) => {
//     const lowerSearch = search.toLowerCase();
//     return (
//       c.name.toLowerCase().includes(lowerSearch) ||
//       c.phone?.toLowerCase().includes(lowerSearch) ||
//       c.email?.toLowerCase().includes(lowerSearch) ||
//       c.address?.toLowerCase().includes(lowerSearch) ||
//       c.billNo?.toString().includes(lowerSearch)
//     );
//   });

//   const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);
//   const visibleCustomers = filteredCustomers.slice(
//     (page - 1) * ITEMS_PER_PAGE,
//     page * ITEMS_PER_PAGE
//   );

//   return (
//     <Box p={2}>
//       <br />
//       <Typography variant="h4" align="center" gutterBottom>
//         لیستا بکرا 📋
//       </Typography>
//       <br />
//       <Stack
//         direction={{ xs: 'column', sm: 'row' }}
//         spacing={2}
//         alignItems="stretch"
//         justifyContent="flex-start"
//         mb={3}
//         sx={{
//           p: 2,
//           backgroundColor: 'background.paper',
//           borderRadius: 3,
//           boxShadow: 3,
//           gap: 2,
//           flexWrap: 'nowrap',
//         }}
//       >
//         <TextField
//           variant="outlined"
//           size="medium"
//           fullWidth
//           placeholder="🔍 لێگەریانا ناف, تەلەفون, ئیمەیڵ, نافونیشان, یان ژمارا پسولێ"
//           value={search}
//           onChange={handleSearchChange}
//           sx={{
//             backgroundColor: '#fff',
//             borderRadius: 2,
//             '& .MuiOutlinedInput-root': {
//               borderRadius: 2,
//             },
//             flex: 1,
//             direction: 'rtl',
//             textAlign: 'right',
//           }}
//         />
//         <Button
//           component={Link}
//           to="/customer/new"
//           variant="contained"
//           color="primary"
//           size="medium"
//           className="customer-add-button"
//         >
//           زێدەکرنا بکری ➕
//         </Button>
//       </Stack>

//       <TableContainer component={Paper} className="table-container" style={{ direction: 'rtl' }}>
//         <Table className="customer-table">
//           <TableHead>
//             <TableRow>
//               <TableCell style={{ textAlign: 'center' }}>ناف</TableCell>
//               <TableCell style={{ textAlign: 'center' }}>تەلەفۆن</TableCell>
//               <TableCell style={{ textAlign: 'center' }}>نافونیشان</TableCell>
//               <TableCell style={{ textAlign: 'center' }}>ئیمەیڵ</TableCell>
//               <TableCell style={{ textAlign: 'center' }}>ژمارا پسولێ</TableCell>
//               <TableCell style={{ textAlign: 'center' }}>کردار</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {visibleCustomers.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={6} style={{ direction: 'rtl', textAlign: 'right' }}>
//                   هیچ بکرەک نەهاتیە تومارکرن.
//                 </TableCell>
//               </TableRow>
//             ) : (
//               visibleCustomers.map((c) => (
//                 <TableRow key={c._id}>
//                   <TableCell style={{ textAlign: 'center' }}>{c.name}</TableCell>
//                   <TableCell style={{ textAlign: 'center', direction: 'ltr' }}>{c.phone}</TableCell>
//                   <TableCell style={{ textAlign: 'center' }}>{c.address}</TableCell>
//                   <TableCell style={{ textAlign: 'center' }}>{c.email}</TableCell>
//                   <TableCell style={{ textAlign: 'center' }}>{c.billNo}</TableCell>
//                   <TableCell>
//                     <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
//                       <Button
//                         component={Link}
//                         to={`/customer/${c._id}`}
//                         size="small"
//                         variant="contained"
//                       >
//                         View
//                       </Button>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {totalPages > 1 && (
//         <Box mt={3} display="flex" justifyContent="center">
//           <Pagination
//             count={totalPages}
//             page={page}
//             onChange={(e, value) => setPage(value)}
//             color="primary"
//           />
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default CustomerList;