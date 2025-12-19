import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import useCartStore from '../store/cartStore';  // Importa o carrinho real

function CardapioPublic() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  // Função do Zustand para adicionar item
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchData = async () => {
      const { data: produtosData } = await supabase
        .from('produtos')
        .select('*')
        .order('categoria_id')
        .order('nome');

      setProdutos(produtosData || []);

      // Pega categorias únicas
      const uniqueCats = [...new Set(produtosData?.map(p => p.categoria_id) || [])].sort();
      setCategorias(uniqueCats);

      setLoading(false);
    };

    fetchData();

    // Realtime: atualiza automático quando admin adiciona produto
    const subscription = supabase
      .channel('produtos-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'produtos' }, fetchData)
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, []);

  const getCategoriaBadge = (categoria) => {
    const cores = {
      cervejas: 'bg-warning text-dark',
      refrigerantes: 'bg-primary',
      aguas: 'bg-info',
      energeticos: 'bg-danger'
    };
    return cores[categoria] || 'bg-secondary';
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-success" style={{width: '5rem', height: '5rem'}} />
      </div>
    );
  }

  return (
    <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <div className="container py-5">
        <div className="text-center mb-5">
          <h1 className="display-3 fw-bold text-success mb-3" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>
            Distribuidora SACI
          </h1>
          <h2 className="display-5 text-dark">Cardápio Digital</h2>
          <p className="lead text-muted">As melhores bebidas geladas da região</p>
        </div>

        {produtos.length === 0 ? (
          <div className="text-center py-5">
            <h3 className="text-muted">Nenhum produto cadastrado ainda</h3>
            <p className="fs-3">Volte em breve! 🍺</p>
          </div>
        ) : (
          <Tabs defaultActiveKey={categorias[0] || 'all'} className="mb-5 justify-content-center">
            {categorias.map((cat) => (
              <Tab eventKey={cat} title={cat.toUpperCase()} key={cat}>
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-5 mt-3">
                  {produtos
                    .filter((p) => p.categoria_id === cat)
                    .map((p) => (
                      <div key={p.id} className="col">
                        <div className="card h-100 border-0 shadow-lg rounded-4 overflow-hidden position-relative">
                          <div className="position-relative overflow-hidden">
                            <img
                              src={p.imagem_url}
                              className="card-img-top"
                              alt={p.nome}
                              style={{ height: '320px', objectFit: 'cover' }}
                            />
                            <div className="position-absolute top-0 end-0 m-3">
                              <span className={`badge rounded-pill ${getCategoriaBadge(p.categoria_id)} px-3 py-2 fs-6`}>
                                {p.categoria_id.toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="card-body text-center d-flex flex-column justify-content-between bg-white">
                            <h3 className="card-title fw-bold text-success fs-2 mb-3">{p.nome}</h3>
                            <p className="display-4 fw-bold text-dark mb-3">
                              R$ {Number(p.preco).toFixed(2).replace('.', ',')}
                            </p>
                            <button
                              className="btn btn-success btn-lg w-100"
                              onClick={() => addItem(p)}  // Usa o carrinho real – sem alert!
                            >
                              Adicionar ao Carrinho
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </Tab>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  );
}

export default CardapioPublic;