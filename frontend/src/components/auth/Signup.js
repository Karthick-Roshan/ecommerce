import React, { useState } from 'react';
import { signupUser } from '../../services/authService';
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
  background: #f9f9f9;
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
  background-color: #9a4b52 !important;
  color: white !important;
  font-weight: bold;
`;

const PasswordStrength = styled(Typography)`
  font-size: 0.1rem;
  margin-top: 0.25rem;
  margin-left: 0.25rem;
  color: ${(props) =>
    props.strength === 'Strong'
      ? 'green'
      : props.strength === 'Medium'
      ? 'orange'
      : 'red'};
`;

const ErrorText = styled(Typography)`
  font-size: 0.8rem;
  color: red;
  margin-top: 0.25rem;
  margin-left: 0.25rem;
`;

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [emailError, setEmailError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === 'email') {
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      setEmailError(valid ? '' : 'Invalid email format');
    }

    if (name === 'password') {
      const strength = getPasswordStrength(value);
      setPasswordStrength(strength);
    }
  };

  const getPasswordStrength = (password) => {
    if (password.length < 6) return 'Weak';
    if (password.match(/[A-Z]/) && password.match(/[0-9]/) && password.length >= 8) {
      return 'Strong';
    }
    return 'Medium';
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (emailError) {
      alert("Please correct the email");
      return;
    }

    try {
      const data = await signupUser({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      alert(data.message || 'Signup successful!');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <Container>
      <FormBox elevation={5}>
        <Typography variant="h5" gutterBottom>Sign Up</Typography>
        <form onSubmit={handleSubmit}>
          <StyledTextField
            label="Name"
            name="name"
            fullWidth
            required
            onChange={handleChange}
          />
          <StyledTextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            required
            onChange={handleChange}
          />
          {emailError && <ErrorText>{emailError}</ErrorText>}

          <StyledTextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            required
            onChange={handleChange}
          />
          <PasswordStrength strength={passwordStrength}>
            {form.password ? `Password ${passwordStrength.toLowerCase()}` : ''}
          </PasswordStrength>

          <StyledTextField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
            required
            onChange={handleChange}
          />
          <StyledButton type="submit" variant="contained" fullWidth>Sign Up</StyledButton>
        </form>
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Already have an account? <Link to="/login">Login</Link>
        </Typography>
      </FormBox>
    </Container>
  );
};

export default Signup;
