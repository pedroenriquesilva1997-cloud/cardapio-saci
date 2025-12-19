import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

function AdminSupabase() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState('');

  // Cadastro
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [categoria, setCategoria] = useState('cervejas');
  const [imagem, setImagem] = useState(null);

  // Edição
  const [editando, setEditando] = useState(null);
  const [editNome, setEditNome] = useState('');
  const [editPreco, setEditPreco] = useState('');
  const [editCategoria, setEditCategoria] = useState('');
  const [editImagem, setEditImagem] = useState(null);

  useEffect(() => {
    fetchProdutos();
  }, []);

  const fetchProdutos = async () => {
    const { data } = await supabase.from('produtos').select('*').order('nome');
    setProdutos(data || []);
  };

  // EXCLUIR
  const excluir = async (id) => {
    if (!confirm('Tem certeza que quer excluir esse produto?')) return;
    setLoading(true);
    await supabase.from('produtos').delete().eq('id', id);
    setProdutos(produtos.filter(p => p.id !== id));
    setMensagem('Produto excluído!');
    setLoading(false);
  };

  // INICIAR EDIÇÃO
  const iniciarEdicao = (p) => {
    setEditando(p.id);
    setEditNome(p.nome);
    setEditPreco(p.preco);
    setEditCategoria(p.categoria_id);
    setEditImagem(null);
  };

  // SALVAR EDIÇÃO
  const salvarEdicao = async () => {
    if (!editando) return;
    setLoading(true);

    try {
      let novaUrl = null;
      if (editImagem) {
        const fileName = `${Date.now()}_${editImagem.name}`;
        const { error: uploadErr } = await supabase.storage.from('produtos').upload(fileName, editImagem);
        if (uploadErr) throw uploadErr;
        const { data: { publicUrl } } = supabase.storage.from('produtos').getPublicUrl(fileName);
        novaUrl = publicUrl;
      }

      const dados = {
        nome: editNome,
        preco: parseFloat(editPreco),
        categoria_id: editCategoria
      };
      if (novaUrl) dados.imagem_url = novaUrl;

      const { error } = await supabase.from('produtos').update(dados).eq('id', editando);
      if (error) throw error;

      setMensagem('Produto atualizado com sucesso!');
      setEditando(null);
      fetchProdutos();
    } catch (err) {
      setMensagem('Erro ao salvar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // CADASTRO
  const cadastrar = async (e) => {
    e.preventDefault();
    if (!imagem) return setMensagem('Selecione uma imagem');
    setLoading(true);

    try {
      const fileName = `${Date.now()}_${imagem.name}`;
      const { error: uploadErr } = await supabase.storage.from('produtos').upload(fileName, imagem);
      if (uploadErr) throw uploadErr;

      const { data: { publicUrl } } = supabase.storage.from('produtos').getPublicUrl(fileName);

      const { error } = await supabase.from('produtos').insert({
        nome, preco: parseFloat(preco), categoria_id: categoria, imagem_url: publicUrl
      });
      if (error) throw error;

      setMensagem('Produto cadastrado!');
      setNome(''); setPreco(''); setImagem(null);
      fetchProdutos();
    } catch (err) {
      setMensagem('Erro: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ color: '#006400', textAlign: 'center' }}>Dashboard Admin - SACI</h2>
      {mensagem && <p style={{ textAlign: 'center', color: mensagem.includes('sucesso') ? 'green' : 'red' }}>{mensagem}</p>}

      <h3 style={{ color: '#006400' }}>Produtos Cadastrados</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
        {produtos.map(p => (
          <div key={p.id} style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '15px', textAlign: 'center', background: 'white' }}>
            <img src={p.imagem_url} alt={p.nome} style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '8px' }} />
            
            {editando === p.id ? (
              <>
                <input value={editNome} onChange={e => setEditNome(e.target.value)} style={{ width: '100%', margin: '8px 0', padding: '8px' }} />
                <input type="number" step="0.01" value={editPreco} onChange={e => setEditPreco(e.target.value)} style={{ width: '100%', margin: '8px 0', padding: '8px' }} />
                <select value={editCategoria} onChange={e => setEditCategoria(e.target.value)} style={{ width: '100%', margin: '8px 0', padding: '8px' }}>
                  <option value="cervejas">Cervejas</option>
                  <option value="refrigerantes">Refrigerantes</option>
                  <option value="aguas">Águas</option>
                  <option value="energeticos">Energéticos</option>
                </select>
                <input type="file" accept="image/*" onChange={e => setEditImagem(e.target.files[0])} style={{ margin: '8px 0' }} />
                <div>
                  <button onClick={salvarEdicao} disabled={loading} style={{ background: 'green', color: 'white', padding: '10px 20px', margin: '5px' }}>Salvar</button>
                  <button onClick={() => setEditando(null)} style={{ background: 'gray', color: 'white', padding: '10px 20px', margin: '5px' }}>Cancelar</button>
                </div>
              </>
            ) : (
              <>
                <h4 style={{ margin: '10px 0' }}>{p.nome}</h4>
                <p style={{ fontSize: '1.5em', fontWeight: 'bold' }}>R$ {Number(p.preco).toFixed(2).replace('.', ',')}</p>
                <small>{p.categoria_id}</small>
                <div style={{ marginTop: '15px' }}>
                  <button onClick={() => iniciarEdicao(p)} style={{ background: '#006400', color: 'white', padding: '10px 15px', margin: '5px' }}>Editar</button>
                  <button onClick={() => excluir(p.id)} style={{ background: 'red', color: 'white', padding: '10px 15px', margin: '5px' }}>Excluir</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <h3 style={{ color: '#006400', marginTop: '50px' }}>Adicionar Novo Produto</h3>
      <form onSubmit={cadastrar}>
        <input type="text" value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome" required style={{ width: '100%', padding: '12px', margin: '10px 0' }} />
        <input type="number" step="0.01" value={preco} onChange={e => setPreco(e.target.value)} placeholder="Preço" required style={{ width: '100%', padding: '12px', margin: '10px 0' }} />
        <select value={categoria} onChange={e => setCategoria(e.target.value)} style={{ width: '100%', padding: '12px', margin: '10px 0' }}>
          <option value="cervejas">Cervejas</option>
          <option value="refrigerantes">Refrigerantes</option>
          <option value="aguas">Águas</option>
          <option value="energeticos">Energéticos</option>
        </select>
        <input type="file" accept="image/*" onChange={e => setImagem(e.target.files[0])} required style={{ margin: '10px 0' }} />
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '15px', background: '#006400', color: 'white', border: 'none', borderRadius: '8px' }}>
          {loading ? 'Adicionando...' : 'Adicionar Produto'}
        </button>
      </form>
    </div>
  );
}

export default AdminSupabase;