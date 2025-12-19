import { useState } from 'react';
import { supabase } from '../supabase/client';

const AdminSupabase = () => {
  const [produto, setProduto] = useState({ nome: '', preco: '', categoriaId: 'cervejas' });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMensagem('Selecione uma foto!');
      return;
    }

    setUploading(true);
    setMensagem('Subindo foto gelada... ⏳');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('produtos')
        .upload(`public/${fileName}`, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('produtos')
        .getPublicUrl(`public/${fileName}`);

      const { error: dbError } = await supabase
        .from('produtos')
        .insert({
          nome: produto.nome,
          preco: Number(produto.preco),
          categoria_id: produto.categoriaId,
          imagem_url: publicUrl
        });

      if (dbError) throw dbError;

      setMensagem('Produto salvo com sucesso! 🍻❄️🔥');
      setProduto({ nome: '', preco: '', categoriaId: 'cervejas' });
      setFile(null);
    } catch (error) {
      setMensagem('Erro: ' + error.message);
      console.error(error);
    }

    setUploading(false);
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Arial' }}>
      <h1 style={{ color: '#006400' }}>Dashboard Admin - SACI (Supabase)</h1>
      <p style={{ fontSize: '18px' }}>Adicionando produtos com fotos geladas de verdade!</p>

      <div style={{ background: '#f8fff8', padding: '40px', borderRadius: '20px', maxWidth: '600px', margin: '20px auto', boxShadow: '0 6px 20px rgba(0,100,0,0.2)' }}>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nome da cerveja (ex: Antarctica Gelada)"
            value={produto.nome}
            onChange={(e) => setProduto({ ...produto, nome: e.target.value })}
            style={{ width: '100%', padding: '15px', margin: '10px 0', fontSize: '18px', borderRadius: '8px', border: '1px solid #006400' }}
            required
            disabled={uploading}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Preço"
            value={produto.preco}
            onChange={(e) => setProduto({ ...produto, preco: e.target.value })}
            style={{ width: '100%', padding: '15px', margin: '10px 0', fontSize: '18px', borderRadius: '8px', border: '1px solid #006400' }}
            required
            disabled={uploading}
          />
          <select
            value={produto.categoriaId}
            onChange={(e) => setProduto({ ...produto, categoriaId: e.target.value })}
            style={{ width: '100%', padding: '15px', margin: '10px 0', fontSize: '18px', borderRadius: '8px', border: '1px solid #006400' }}
            disabled={uploading}
          >
            <option value="cervejas">Cervejas</option>
            <option value="drinks">Drinks</option>
            <option value="petiscos">Petiscos</option>
          </select>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ margin: '20px 0', fontSize: '18px' }}
            required
            disabled={uploading}
          />
          <br />
          <button
            type="submit"
            disabled={uploading}
            style={{ padding: '18px 50px', background: '#006400', color: 'white', fontSize: '20px', border: 'none', borderRadius: '10px' }}
          >
            {uploading ? 'Salvando...' : 'Adicionar Produto'}
          </button>
        </form>

        {mensagem && <p style={{ marginTop: '30px', fontSize: '20px', fontWeight: 'bold', color: mensagem.includes('sucesso') ? 'green' : 'red' }}>{mensagem}</p>}
      </div>
    </div>
  );
};

export default AdminSupabase;