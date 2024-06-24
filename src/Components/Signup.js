import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import '../signupauth.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const passwordRules = {
    minLength: 6,
    hasUpperCase: /[A-Z]/,
    hasLowerCase: /[a-z]/,
    hasNumber: /\d/,
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/
  };

  const validatePassword = (password) => {
    let errors = [];
    if (password.length < passwordRules.minLength) {
      errors.push(`Password must be at least ${passwordRules.minLength} characters long.`);
    }
    if (!passwordRules.hasUpperCase.test(password)) {
      errors.push('Password must contain at least one uppercase letter.');
    }
    if (!passwordRules.hasLowerCase.test(password)) {
      errors.push('Password must contain at least one lowercase letter.');
    }
    if (!passwordRules.hasNumber.test(password)) {
      errors.push('Password must contain at least one number.');
    }
    if (!passwordRules.hasSpecialChar.test(password)) {
      errors.push('Password must contain at least one special character.');
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      setError(passwordErrors.join(' '));
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Sign-up successful:', userCredential);

      // Send email verification
      await sendEmailVerification(userCredential.user);
      console.log('Email verification sent!');

      // Redirect to login page
      navigate('/login');
    } catch (error) {
      console.error('Error signing up:', error);
      setError('Error signing up. Please try again.');
    }
  };

  return (
    <div className="signup-form-container">
      <h2>Sign Up</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
