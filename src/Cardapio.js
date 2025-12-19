import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from './firebase/config';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

function Cardapio() {
  const negocio = {
    nome: "Distribuidora Território",
    logo: "https://via.placeholder.com/150x50/198754/FFFFFF?text=LOGO+TERRITÓRIO",
    whatsapp: "5511999999999",
    pix: "11999999999",
    endereco: "Rua Ônix 647, Capuava",
    horario: "Aberto todos os dias • 8h–22h"
  };

  const categorias = [
    {
      nome: "Cervejas",
      itens: [
        { id: 1, nome: "Skol Lata 350ml", preco: 5.50, desc: "Geladinha e refrescante", imagem: "https://m.media-amazon.com/images/I/51J75NZ88gL.jpg" },
        { id: 2, nome: "Brahma Duplo Malte 600ml", preco: 9.90, desc: "Garrafa retornável", imagem: "https://m.media-amazon.com/images/I/514H47GTfML.jpg" },
        { id: 3, nome: "Heineken Long Neck", preco: 8.90, desc: "Importada premium", imagem: "https://www.caveroyale.com.br/wp-content/uploads/2025/07/cerveja-heineken-long-neck-330ml.webp" },
      ]
    },
    {
      nome: "Refrigerantes",
      itens: [
        { id: 4, nome: "Coca-Cola 2L", preco: 9.50, desc: "Garrafa PET", imagem: "https://zaffari.vtexassets.com/arquivos/ids/283215-800-450?v=638893855660330000&width=800&height=450&aspect=true" },
        { id: 5, nome: "Guaraná Antarctica 1L", preco: 6.00, desc: "Sabor brasileiro", imagem: "https://zonasul.vtexassets.com/arquivos/ids/4252470-800-450?v=638909093439070000&width=800&height=450&aspect=true" },
      ]
    },
    {
      nome: "Águas e Outros",
      itens: [
        { id: 6, nome: "Água Mineral sem Gás 510ml", preco: 3.00, desc: "Crystal ou similar", imagem: "https://mercantilnovaera.vtexassets.com/arquivos/ids/224172-800-450?v=638939105534930000&width=800&height=450&aspect=true" },
        { id: 7, nome: "Gelo 5kg", preco: 12.00, desc: "Pacote de gelo cristal", imagem: "https://samsclub.vtexassets.com/arquivos/ids/163409-800-450?v=637541816465830000&width=800&height=450&aspect=true" },
      ]
    }
  ];

  const [carrinho, setCarrinho] = useState({});
  const [user, setUser] = useState(null);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const adicionar = (id) => setCarrinho(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  const remover = (id) => setCarrinho(prev => {
    const novo = { ...prev };
    if (novo[id] > 1) novo[id]--;
    else delete novo[id];
    return novo;
  });
  const limpar = () => setCarrinho({});

  const totalItens = () => Object.values(carrinho).reduce((a, b) => a + b, 0);

  const totalPreco = () => {
    let t = 0;
    Object.keys(carrinho).forEach(idStr => {
      const id = parseInt(idStr);
      const item = categorias.flatMap(c => c.itens).find(i => i.id === id);
      if (item) t += item.preco * carrinho[idStr];
    });
    return t.toFixed(2);
  };

  const handleLogout = async () => {
    await signOut(auth);
    window.location.reload();
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);
    try {
      if (isLoginMode) {
        await signInWithEmailAndPassword(auth, email, senha);
      } else {
        await createUserWithEmailAndPassword(auth, email, senha);
      }
      setShowLoginForm(false);
      window.location.reload();
    } catch (err) {
      setErro('Email ou senha incorretos');
    }
    setLoading(false);
  };

  const finalizar = () => {
    if (totalItens() === 0) return alert("Adicione itens ao carrinho!");
    let msg = `*Pedido - ${negocio.nome}* 🍻\n\n`;
    Object.keys(carrinho).forEach(idStr => {
      const id = parseInt(idStr);
      const item = categorias.flatMap(c => c.itens).find(i => i.id === id);
      if (item) {
        msg += `• ${carrinho[idStr]}x ${item.nome} - R$ ${(item.preco * carrinho[idStr]).toFixed(2)}\n`;
      }
    });
    msg += `\n*Total: R$ ${totalPreco()}*\n\n`;
    msg += `*Pagamento via PIX*\nChave: ${negocio.pix}\n\nObrigado! 🚀`;
    window.open(`https://wa.me/${negocio.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <>
      <nav className="navbar navbar-dark bg-success fixed-top shadow-lg">
        <div className="container-fluid">
          <a className="navbar-brand d-flex align-items-center" href="#">
            <img src={negocio.logo} alt="Logo" height="70" className="me-3 rounded-3 shadow" onError={(e) => e.target.src = 'https://via.placeholder.com/180x70/198754/FFFFFF?text=TERRITÓRIO'} />
            <span className="fs-3 fw-bold text-white">{negocio.nome}</span>
          </a>

          <div className="d-flex align-items-center gap-4">
            <motion.div className="badge bg-white text-success fs-5 rounded-pill px-4 py-3 shadow" whileTap={{ scale: 0.95 }}>
              <strong>🛒 {totalItens()} itens</strong> • R$ {totalPreco()}
            </motion.div>

            {user ? (
              <div className="d-flex align-items-center gap-3">
                <span className="text-white fw-bold">Olá, {user.email.split('@')[0]}</span>
                <button onClick={handleLogout} className="btn btn-outline-light rounded-pill px-4">Sair</button>
              </div>
            ) : (
              <button onClick={() => setShowLoginForm(true)} className="btn btn-outline-light rounded-pill px-4">Entrar</button>
            )}
          </div>
        </div>
      </nav>

      {/* Form de login/cadastro abaixo do navbar quando clicar no botão */}
      {showLoginForm && (
        <div className="container mt-5 pt-5">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card shadow-lg p-4">
                <h3 className="text-center mb-4 text-success fw-bold">{isLoginMode ? 'Entrar na conta' : 'Criar conta'}</h3>
                <form onSubmit={handleAuth}>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Email</label>
                    <input type="email" className="form-control form-control-lg" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Senha (mín. 6 caracteres)</label>
                    <input type="password" className="form-control form-control-lg" value={senha} onChange={(e) => setSenha(e.target.value)} required />
                  </div>
                  {erro && <div className="alert alert-danger">{erro}</div>}
                  <button type="submit" className="btn btn-success w-100 py-3 fw-bold" disabled={loading}>
                    {loading ? 'Carregando...' : (isLoginMode ? 'Entrar' : 'Cadastrar')}
                  </button>
                </form>
                <div className="text-center mt-4">
                  <button type="button" className="btn btn-link text-success fw-bold" onClick={() => setIsLoginMode(!isLoginMode)}>
                    {isLoginMode ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entrar'}
                  </button>
                </div>
                <div className="text-center mt-3">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowLoginForm(false)}>
                    Voltar ao cardápio
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cardápio normal (só mostra se não estiver no form de login) */}
      {!showLoginForm && (
        <div className="container pt-5 mt-5 pb-5">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center my-5">
            <h1 className="display-3 fw-bold text-success mb-3">Cardápio Digital</h1>
            <p className="lead text-muted fs-4">Entrega rápida • Pagamento via PIX • Gelado na hora</p>
          </motion.div>

          {categorias.map((cat, catIndex) => (
            <motion.section key={cat.nome} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: catIndex * 0.2 }} className="mb-5">
              <h2 className="text-center display-5 fw-bold mb-5 position-relative d-inline-block">
                {cat.nome}
                <span className="position-absolute bottom-0 start-50 translate-middle-x w-50 border-4 border-success rounded" style={{ bottom: '-12px' }}></span>
              </h2>

              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 g-lg-5">
                {cat.itens.map((item) => (
                  <motion.div key={item.id} className="col" whileHover={{ y: -10 }} transition={{ type: "spring", stiffness: 300 }}>
                    <div className="card bg-dark text-white h-100 border-0 overflow-hidden shadow-lg rounded-4 position-relative">
                      <div className="position-relative">
                        <img src={item.imagem} className="card-img-top" alt={item.nome} style={{ height: '280px', objectFit: 'cover' }} onError={(e) => e.target.src = 'https://via.placeholder.com/400x280/333333/FFFFFF?text=Imagem+Indisponível'} />
                        <div className="position-absolute top-0 end-0 p-3">
                          <span className="badge bg-success rounded-pill fs-6">Gelado</span>
                        </div>
                      </div>

                      <div className="card-body d-flex flex-column p-4">
                        <h5 className="card-title fw-bold fs-4">{item.nome}</h5>
                        <p className="card-text text-white-50 flex-grow-1">{item.desc}</p>

                        <div className="d-flex align-items-end justify-content-between mt-4">
                          <p className="fs-1 fw-bold text-success mb-0">R$ {item.preco.toFixed(2)}</p>

                          <div className="d-flex align-items-center gap-2 bg-secondary rounded-pill overflow-hidden shadow">
                            <button className="btn btn-dark rounded-pill px-4 py-2" onClick={() => remover(item.id)} disabled={!carrinho[item.id]}>
                              <strong>−</strong>
                            </button>
                            <motion.span key={carrinho[item.id] || 0} initial={{ scale: 1.5 }} animate={{ scale: 1 }} className="px-4 fw-bold text-white" style={{ minWidth: '40px', textAlign: 'center' }}>
                              {carrinho[item.id] || 0}
                            </motion.span>
                            <button className="btn btn-success rounded-pill px-4 py-2" onClick={() => adicionar(item.id)}>
                              <strong>+</strong>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          ))}

          <AnimatePresence>
            {totalItens() > 0 && (
              <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }} className="text-center my-5 py-5">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn btn-success btn-lg px-5 py-4 fs-3 shadow-lg rounded-pill me-4" onClick={finalizar}>
                  <strong>✅ FINALIZAR PEDIDO</strong> • R$ {totalPreco()}
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn btn-outline-danger btn-lg rounded-pill px-4" onClick={limpar}>
                  Limpar Carrinho
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          <footer className="text-center py-5 border-top border-secondary mt-5">
            <p className="mb-2 text-muted fs-5">{negocio.endereco}</p>
            <p className="mb-2 text-muted">{negocio.horario}</p>
            <p className="mb-0">
              <a href={`https://wa.me/${negocio.whatsapp}`} className="text-success text-decoration-none fw-bold">
                📱 WhatsApp: {negocio.whatsapp.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')}
              </a>
            </p>
          </footer>
        </div>
      )}
    </>
  );
}

export default Cardapio;