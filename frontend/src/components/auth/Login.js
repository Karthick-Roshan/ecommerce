import React, { useState } from 'react';
import { loginUser } from '../../services/authService';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
} from '@mui/material';
import { styled } from 'styled-components';

const Container = styled(Box)`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f2f2f2;
`;

const FormBox = styled(Paper)`
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0px 10px 20px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
`;

const StyledTextField = styled(TextField)`
  margin-top: 1rem !important;
`;

const StyledButton = styled(Button)`
  margin-top: 2rem !important;
  background-color: #5a357a !important;
  color: white !important;
  font-weight: bold;
`;

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const data = await loginUser(form);
      localStorage.setItem('token', data.token);
      alert('Login Successful!');
      navigate('/home');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Container>
      <FormBox elevation={5}>
        <Typography variant="h5" gutterBottom>Login</Typography>
        <form onSubmit={handleSubmit}>
          <StyledTextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            required
            onChange={handleChange}
          />
          <StyledTextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            required
            onChange={handleChange}
          />
          <StyledButton type="submit" variant="contained" fullWidth>Login</StyledButton>
        </form>
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          New user? <Link to="/signup">Sign up</Link>
        </Typography>
      </FormBox>
    </Container>
  );
};

export default Login;
