import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // ajusta o caminho se necessário

function CardapioPublic() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const { data, error } = await supabase
          .from('produtos')
          .select('*')
          .order('nome');

        if (error) throw error;

        setProdutos(data || []);
      } catch (err) {
        console.error('Erro ao carregar produtos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProdutos();
  }, []);

  if (loading) {
    return <p style={{ textAlign: 'center', padding: '100px', fontSize: '20px' }}>Carregando cardápio...</p>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', color: '#006400', marginBottom: '30px' }}>
        Cardápio Digital - Distribuidora SACI
      </h2>

      {produtos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', fontSize: '20px', color: '#666' }}>
          <p>Nenhum produto cadastrado ainda.</p>
          <p>Vá no <strong>Dashboard Admin</strong> e adicione o primeiro produto!</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '25px'
        }}>
          {produtos.map((produto) => (
            <div
              key={produto.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '15px',
                overflow: 'hidden',
                boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
                background: '#fff',
                textAlign: 'center'
              }}
            >
              {produto.imagem_url ? (
                <img
                  src={produto.imagem_url}
                  alt={produto.nome}
                  style={{ width: '100%', height: '220px', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ height: '220px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span>Sem imagem</span>
                </div>
              )}
              <div style={{ padding: '15px' }}>
                <h3 style={{ margin: '0 0 10px', color: '#006400', fontSize: '1.3em' }}>
                  {produto.nome}
                </h3>
                <p style={{ fontSize: '1.6em', fontWeight: 'bold', color: '#333', margin: '10px 0' }}>
                  R$ {Number(produto.preco).toFixed(2).replace('.', ',')}
                </p>
                <small style={{ color: '#666' }}>{produto.categoria_id}</small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CardapioPublic;  // <-- ESSA LINHA É OBRIGATÓRIA!