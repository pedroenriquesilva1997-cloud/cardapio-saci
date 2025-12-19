import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link, useNavigate } from 'react-router-dom';

function Cadastro() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const navigate = useNavigate();

  const handleCadastro = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');
    setSucesso('');

    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
    });

    if (error) {
      setErro(error.message);
    } else if (data.user) {
      if (data.session) {
        setSucesso('Cadastro realizado com sucesso! Bem-vindo!');
        setTimeout(() => navigate('/'), 2000);
      } else {
        setSucesso('Cadastro realizado! Verifique seu email para confirmar a conta.');
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(135deg, #e0f7fa 0%, #80deea 100%)' }}>
      <div className="card shadow-lg p-5" style={{ maxWidth: '400px', width: '100%', borderRadius: '20px' }}>
        <div className="text-center mb-4">
          <h1 className="fw-bold text-success">Distribuidora SACI</h1>
          <h3 className="mt-3">Criar Conta</h3>
        </div>

        {sucesso && <div className="alert alert-success text-center">{sucesso}</div>}
        {erro && <div className="alert alert-danger text-center">{erro}</div>}

        <form onSubmit={handleCadastro}>
          <div className="mb-3">
            <label className="form-label fw-bold">Email</label>
            <input
              type="email"
              className="form-control form-control-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold">Senha</label>
            <input
              type="password"
              className="form-control form-control-lg"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              minLength="6"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-success btn-lg w-100 fw-bold shadow"
          >
            {loading ? 'Criando conta...' : 'Cadastrar'}
          </button>
        </form>

        <div className="text-center mt-4">
          <p>Já tem conta? <Link to="/login" className="text-success fw-bold">Fazer login</Link></p>
          <Link to="/" className="text-muted">← Voltar ao cardápio</Link>
        </div>
      </div>
    </div>
  );
}

export default Cadastro;