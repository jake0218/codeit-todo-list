import axios from 'axios';
import { API_BASE } from '@/constants/api'

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;