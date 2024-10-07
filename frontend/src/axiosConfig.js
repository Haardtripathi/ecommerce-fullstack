import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "https://ecommerce-fullstack-demo1.onrender.com"

export default axios;