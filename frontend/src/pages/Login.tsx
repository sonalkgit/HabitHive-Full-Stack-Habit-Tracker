import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/userSlice';
import { Link, useNavigate } from 'react-router-dom';
import { RootState } from '../redux/store';
import styles from './Pages.module.css';


const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const { loading, error, user } = useSelector((state: RootState) => state.user);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password })).then((res: any) => {
      if (res.meta.requestStatus === 'fulfilled') {
        navigate('/dashboard');
      }
    });
  };

  return (
    <div className={styles.pageContainer}>
  <form onSubmit={handleSubmit} className={styles.formBox}>
    <h2 className={styles.heading}>Login</h2>
    {error && <p className={styles.error}>{error}</p>}
    <input
      className={styles.input}
      type="email"
      value={email}
      placeholder="Email"
      onChange={(e) => setEmail(e.target.value)}
    />
    <input
      className={styles.input}
      type="password"
      value={password}
      placeholder="Password"
      onChange={(e) => setPassword(e.target.value)}
    />
    <button className={styles.button} type="submit" disabled={loading}>
      {loading ? 'Logging in...' : 'Login'}
    </button>
    <p className={styles.linkText}>
      Don’t have an account? <Link to="/register">Register here</Link>
    </p>
  </form>
</div>
  );
};

export default Login;
