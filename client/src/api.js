import axios from 'axios';

const api = axios.create({
  // Tenê baseURL diguhere û dibite '/api'
  baseURL: '/api', 
});

export default api;



// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:5000/api',
// });

// export default api;
