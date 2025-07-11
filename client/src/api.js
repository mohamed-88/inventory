import axios from 'axios';

// Awayê herî baş ji bo birêvebirina herdu jîngehan
let baseURL;

if (process.env.NODE_ENV === 'production') {
  // Dema li ser Vercel e
  baseURL = process.env.REACT_APP_API_URL;
} else {
  // Dema li ser komputerê ye (localhost)
  baseURL = 'http://localhost:5000/api';
}

const api = axios.create({
  baseURL: baseURL
});

export default api;



// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:5000/api',
// });

// export default api;
