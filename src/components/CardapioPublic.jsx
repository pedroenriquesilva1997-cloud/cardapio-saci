import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import useCartStore from '../store/cartStore';
import { motion } from 'framer-motion';

function CardapioPublic() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState(''); // ← Nova state para busca

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchData = async () => {
      const { data: produtosData } = await supabase
        .from('produtos')
        .select('*')
        .order('categoria_id')
        .order('nome');

      setProdutos(produtosData || []);

      const uniqueCats = [...new Set(produtosData?.map(p => p.categoria_id) || [])].sort();
      setCategorias(uniqueCats);

      setLoading(false);
    };

    fetchData();

    const subscription = supabase
      .channel('produtos-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'produtos' }, fetchData)
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, []);

  const getCategoriaBadge = (categoria) => {
    const cores = {
      cervejas: 'bg-warning text-dark shadow',
      refrigerantes: 'bg-primary text-white shadow',
      aguas: 'bg-info text-white shadow',
      energeticos: 'bg-danger text-white shadow'
    };
    return cores[categoria] || 'bg-secondary text-white shadow';
  };

  // ← Filtra produtos pela busca
  const produtosFiltrados = produtos.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase()) ||
    p.categoria_id.toLowerCase().includes(busca.toLowerCase())
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100" style={{ background: 'linear-gradient(135deg, #006400 0%, #00c853 100%)' }}>
        <div className="spinner-border text-white" style={{ width: '6rem', height: '6rem' }} />
      </div>
    );
  }

  return (
    <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #e0f7fa 0%, #80deea 100%)' }}>
      {/* HERO GELADO */}
      <div className="position-relative text-center text-white overflow-hidden" style={{ height: '45vh', minHeight: '350px' }}>
        <img
          src="https://images.unsplash.com/photo-1608270586620-248524c67de9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80"
          alt="Bebidas geladas"
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(70%)' }}
        />
        <div className="position-absolute top-50 start-50 translate-middle w-100 px-4">
          <motion.h1
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="display-2 fw-bold"
            style={{ textShadow: '4px 4px 12px rgba(0,0,0,0.8)', letterSpacing: '2px' }}
          >
            Distribuidora SACI
          </motion.h1>
          <motion.p
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
            className="display-5 fw-light mb-0"
            style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}
          >
            As melhores bebidas geladas da região
          </motion.p>
        </div>
      </div>

      <div className="container py-5 mt-n5">
        <div className="row justify-content-center">
          <div className="col-lg-11 col-xl-10">

            {/* BARRA DE BUSCA NOVA */}
            <div className="mb-5">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="position-relative"
              >
                <input
                  type="text"
                  placeholder="🔍 Busque por nome ou categoria (ex: brahma, coca, água...)"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="form-control form-control-lg rounded-pill shadow-lg py-4 ps-5 fs-4"
                  style={{
                    background: 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(10px)',
                    border: 'none',
                    height: '70px'
                  }}
                />
                {busca && (
                  <button
                    onClick={() => setBusca('')}
                    className="position-absolute end-0 top-50 translate-middle-y me-4 btn btn-outline-danger rounded-pill"
                  >
                    Limpar
                  </button>
                )}
              </motion.div>
            </div>

            {produtosFiltrados.length === 0 ? (
              <div className="text-center py-5 my-5">
                <h3 className="text-muted fw-light fs-1">Nenhum produto encontrado</h3>
                <p className="fs-3 mt-4">Tente buscar por outro nome! 🍺</p>
              </div>
            ) : (
              <Tabs
                defaultActiveKey={categorias[0] || 'all'}
                className="mb-5 justify-content-center shadow-lg rounded-pill overflow-hidden"
                fill
                variant="pills"
              >
                {categorias.map((cat) => (
                  <Tab eventKey={cat} title={cat.toUpperCase()} key={cat}>
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-5 mt-4">
                      {produtosFiltrados
                        .filter((p) => p.categoria_id === cat)
                        .map((p, index) => (
                          <motion.div
                            key={p.id}
                            className="col"
                            initial={{ opacity: 0, scale: 0.85, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: index * 0.1, ease: "easeOut" }}
                            whileHover={{ y: -20, scale: 1.06 }}
                            whileTap={{ scale: 0.94 }}
                          >
                            <div
                              className="card h-100 border-0 rounded-5 overflow-hidden shadow-2xl"
                              style={{
                                background: 'rgba(255, 255, 255, 0.85)',
                                backdropFilter: 'blur(20px)',
                                WebkitBackdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.4)'
                              }}
                            >
                              <div className="position-relative">
                                <img
                                  src={p.imagem_url}
                                  className="card-img-top"
                                  alt={p.nome}
                                  style={{ height: '320px', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                />
                                <div className="position-absolute top-0 end-0 m-4">
                                  <span className={`badge rounded-pill ${getCategoriaBadge(p.categoria_id)} px-4 py-3 fs-6 fw-bold shadow-lg`}>
                                    {p.categoria_id.toUpperCase()}
                                  </span>
                                </div>
                              </div>
                              <div className="card-body text-center p-5 d-flex flex-column justify-content-end">
                                <h3 className="fw-bold text-success fs-3 mb-4" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.2)' }}>
                                  {p.nome}
                                </h3>
                                <p className="display-5 fw-bold text-dark mb-5">
                                  R$ {Number(p.preco).toFixed(2).replace('.', ',')}
                                </p>
                                <motion.button
                                  whileHover={{ scale: 1.12 }}
                                  whileTap={{ scale: 0.92 }}
                                  className="btn btn-lg w-100 fw-bold rounded-pill shadow-lg"
                                  style={{
                                    background: 'linear-gradient(45deg, #006400, #00c853)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '16px',
                                    fontSize: '1.2rem'
                                  }}
                                  onClick={() => addItem(p)}
                                >
                                  🛒 Adicionar ao Carrinho
                                </motion.button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                    </div>
                  </Tab>
                ))}
              </Tabs>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardapioPublic;