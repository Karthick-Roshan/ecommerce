import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/auth';

export const loginUser = async (data) => {
  const res = await axios.post(`${API_BASE}/login`, data);
  return res.data;
};

export const signupUser = async (data) => {
  const res = await axios.post(`${API_BASE}/signup`, data);
  return res.data;
};
