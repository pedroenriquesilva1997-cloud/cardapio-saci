import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let data;
      if (isLogin) {
        data = await supabase.auth.signInWithPassword({ email, password });
      } else {
        data = await supabase.auth.signUp({ email, password });
      }
      if (data.error) throw data.error;
      navigate('/'); // Vai pro cardápio após login/cadastro
    } catch (err) {
      if (err.message.includes('Invalid login credentials')) {
        setError('Email ou senha incorretos.');
      } else if (err.message.includes('duplicate key')) {
        setError('Este email já está cadastrado.');
      } else if (err.message.includes('Password should be at least 6 characters')) {
        setError('Senha deve ter pelo menos 6 caracteres.');
      } else {
        setError('Erro ao conectar. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-lg p-5" style={{ maxWidth: '420px', width: '100%', borderRadius: '20px' }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold text-success">Distribuidora SACI</h2>
          <p className="text-muted">{isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta'}</p>
        </div>

        {error && <div className="alert alert-danger text-center">{error}</div>}

        <form onSubmit={handleAuth}>
          <div className="mb-3">
            <label className="form-label fw-bold">Email</label>
            <input
              type="email"
              className="form-control form-control-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <label className="form-label fw-bold">Senha</label>
            <input
              type="password"
              className="form-control form-control-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
              disabled={loading}
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-success btn-lg w-100 mb-3"
            disabled={loading}
          >
            {loading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Criar Conta')}
          </button>
        </form>

        <div className="text-center">
          <button 
            type="button"
            className="btn btn-link"
            onClick={() => setIsLogin(!isLogin)}
            disabled={loading}
          >
            {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça login'}
          </button>
        </div>

        <div className="text-center mt-4">
          <button 
            className="btn btn-outline-secondary"
            onClick={() => navigate('/')}
            disabled={loading}
          >
            Continuar sem login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Auth;