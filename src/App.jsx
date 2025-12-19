import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import CardapioPublic from './components/CardapioPublic';
import AdminSupabase from './components/AdminSupabase';
import Auth from './components/Auth';
import useCartStore from './store/cartStore';
import { supabase } from './supabaseClient'; // ajuste o caminho se necessário
import { useState, useEffect } from 'react';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const { items, getTotalItems, getTotalPrice, removeItem, updateQuantity, clearCart } = useCartStore();

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  const formatarPreco = (valor) => {
    return 'R$ ' + valor.toFixed(2).replace('.', ',');
  };

  useEffect(() => {
    // Verifica sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Escuta mudanças de auth
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
      if (!loading && !user) {
        navigate('/login', { state: { from: location } });
      }
    }, [loading, user, navigate, location]);

    if (loading) return <div className="text-center py-5"><div className="spinner-border text-success"></div></div>;
    if (!user) return null;

    return children;
  };

  const Header = () => {
    return (
      <header style={{
        background: '#006400',
        padding: '15px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: 'white',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
      }}>
        <h1 className="m-0 fs-2 fw-bold">Distribuidora SACI</h1>

        <div className="d-flex align-items-center gap-3">
          <Link to="/"><button className="btn btn-light fw-bold px-4 py-2">Cardápio</button></Link>
          {user ? (
            <>
              <Link to="/admin"><button className="btn btn-light fw-bold px-4 py-2">Admin</button></Link>
              <span className="text-white fw-bold">Olá, {user.email.split('@')[0]}</span>
              <button onClick={handleLogout} className="btn btn-outline-light fw-bold px-4 py-2">Sair</button>
            </>
          ) : (
            <Link to="/login"><button className="btn btn-light fw-bold px-4 py-2">Entrar</button></Link>
          )}
          <Link to="/carrinho">
            <button className="btn btn-warning text-dark fw-bold px-4 py-2 position-relative">
              🛒 Carrinho
              {totalItems > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {totalItems}
                </span>
              )}
            </button>
          </Link>
        </div>
      </header>
    );
  };

  const CarrinhoPage = () => {
    if (items.length === 0) {
      return (
        <div className="container text-center py-5 mt-5">
          <h2 className="display-4 fw-bold">Seu carrinho está vazio 😔</h2>
          <Link to="/"><button className="btn btn-success btn-lg mt-4 px-5 py-3">Voltar ao Cardápio</button></Link>
        </div>
      );
    }

    return (
      <div className="container py-5 mt-5">
        <h2 className="display-3 text-center mb-5 fw-bold text-success">Seu Carrinho</h2>

        <div className="row justify-content-center">
          <div className="col-lg-10">
            {items.map((item) => (
              <div key={item.id} className="card mb-4 shadow-lg border-0 rounded-4 overflow-hidden">
                <div className="card-body d-flex align-items-center p-4">
                  <img
                    src={item.imagem_url || 'https://via.placeholder.com/120'}
                    alt={item.nome}
                    className="rounded-3 me-4"
                    style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                  />
                  <div className="flex-grow-1">
                    <h4 className="fw-bold mb-1">{item.nome}</h4>
                    <p className="text-muted mb-0">{formatarPreco(item.preco)} cada</p>
                  </div>

                  <div className="d-flex align-items-center gap-3">
                    <button
                      className="btn btn-outline-secondary btn-lg"
                      onClick={() => updateQuantity(item.id, item.quantidade - 1)}
                      disabled={item.quantidade <= 1}
                    >
                      -
                    </button>
                    <span className="fw-bold fs-3 mx-3">{item.quantidade}</span>
                    <button
                      className="btn btn-outline-secondary btn-lg"
                      onClick={() => updateQuantity(item.id, item.quantidade + 1)}
                    >
                      +
                    </button>
                    <button className="btn btn-danger btn-lg ms-4" onClick={() => removeItem(item.id)}>
                      Remover
                    </button>
                  </div>

                  <div className="ms-5 text-end">
                    <p className="fs-4 fw-bold text-success">{formatarPreco(item.preco * item.quantidade)}</p>
                  </div>
                </div>
              </div>
            ))}

            <div className="text-end my-5">
              <h2 className="display-5 fw-bold text-success">Total: {formatarPreco(totalPrice)}</h2>
            </div>

            <div className="text-center">
              <button className="btn btn-success btn-lg px-5 py-4 fs-3 shadow-lg rounded-pill me-4">
                Finalizar Pedido no WhatsApp
              </button>
              <button onClick={clearCart} className="btn btn-outline-danger btn-lg px-5 py-4 fs-4 rounded-pill">
                Limpar Carrinho
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="d-flex justify-content-center align-items-center vh-100"><div className="spinner-border text-success" style={{width: '5rem', height: '5rem'}}></div></div>;
  }

  return (
    <Router>
      <div style={{ fontFamily: 'Arial, sans-serif' }}>
        <Header />

        <div style={{ marginTop: '90px', minHeight: '100vh', background: '#f8f9fa' }}>
          <Routes>
            <Route path="/" element={<CardapioPublic />} />
            <Route path="/login" element={user ? <CardapioPublic /> : <Auth />} />
            <Route path="/carrinho" element={<CarrinhoPage />} />
            <Route path="/admin" element={<ProtectedRoute><AdminSupabase /></ProtectedRoute>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;