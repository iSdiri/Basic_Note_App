import { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const res = await api.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      navigate('/notes');
    } catch {
      setError('Invalid credentials.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.logo}>📝 NoteApp</h1>
        <h2 style={styles.title}>Sign in</h2>
        {error && <p style={styles.error}>{error}</p>}
        <input style={styles.input} placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
        <input style={styles.input} placeholder="Password" type="password" onChange={e => setForm({ ...form, password: e.target.value })} />
        <button style={styles.button} onClick={handleSubmit}>Sign in</button>
        <p style={styles.link}>No account? <Link to="/register" style={styles.a}>Register</Link></p>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#000', color: '#fff' },
  card: { background: '#0d1117', border: '1px solid #30363d', padding: '2rem', borderRadius: '8px', width: '340px', display: 'flex', flexDirection: 'column', gap: '1rem' },
  logo: { textAlign: 'center', margin: 0, fontSize: '1.5rem' },
  title: { textAlign: 'center', margin: 0, color: '#e6edf3', fontSize: '1.2rem', fontWeight: 400 },
  input: { padding: '0.6rem', borderRadius: '6px', border: '1px solid #30363d', background: '#010409', color: '#e6edf3', fontSize: '1rem' },
  button: { padding: '0.7rem', background: '#238636', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem', fontWeight: 600 },
  error: { color: '#f85149', margin: 0, fontSize: '0.85rem' },
  link: { textAlign: 'center', color: '#8b949e', fontSize: '0.9rem' },
  a: { color: '#58a6ff' }
};
