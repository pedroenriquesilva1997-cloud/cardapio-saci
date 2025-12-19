import React, { useState } from 'react';

function App() {
  const negocio = {
    nome: "Distribuidora Território",
    logo: "https://via.placeholder.com/150x60/198754/FFFFFF?text=TERRITÓRIO", // Troque pela sua logo real!
    whatsapp: "5511999999999",
    pix: "11999999999",
    endereco: "Rua Ônix 647, Capuava",
    horario: "Aberto todos os dias • 8h-22h",
    taxaEntrega: 10.00 // Taxa de entrega (mude conforme necessário)
  };

  const categorias = [
    { nome: "Cervejas", itens: [
      { id: 1, nome: "Skol Lata 350ml", preco: 5.50, desc: "Geladinha e refrescante",
        imagem: "https://http2.mlstatic.com/D_NQ_NP_973779-MLA99813994391_112025-O.webp" },
      { id: 2, nome: "Brahma Duplo Malte 600ml", preco: 9.90, desc: "Garrafa retornável",
        imagem: "https://m.media-amazon.com/images/I/514H47GTfML._AC_SL1000_.jpg" },
      { id: 3, nome: "Heineken Long Neck 330ml", preco: 8.90, desc: "Importada premium",
        imagem: "https://www.caveroyale.com.br/wp-content/uploads/2025/07/cerveja-heineken-long-neck-330ml.webp" },
    ]},
    { nome: "Refrigerantes", itens: [
      { id: 4, nome: "Coca-Cola 2L", preco: 9.50, desc: "Garrafa PET",
        imagem: "https://swiftbr.vteximg.com.br/arquivos/ids/208244-1500-1000/622530-coca-cola-garrafa_mck.jpg?v=638862948323200000" },
      { id: 5, nome: "Guaraná Antarctica 1L", preco: 6.00, desc: "Sabor brasileiro",
        imagem: "https://paulistaoatacadista.vtexassets.com/arquivos/ids/398229/refrigerante-antarctica-1l-pet-guarana.jpg" },
    ]},
    { nome: "Águas e Outros", itens: [
      { id: 6, nome: "Água Mineral sem Gás 510ml", preco: 3.00, desc: "Crystal ou similar",
        imagem: "https://mercantilnovaera.vtexassets.com/arquivos/ids/224172/agua-purificada-crystal-sem-gas-510ml.jpg" },
      { id: 7, nome: "Gelo 5kg", preco: 12.00, desc: "Pacote de gelo cristal",
        imagem: "https://samsclub.vtexassets.com/arquivos/ids/163409/gelo-em-cubos-cristal-pacote-5kg.jpg" },
    ]},
    // Novas categorias (exemplos - edite ou adicione mais!)
    { nome: "Destilados", itens: [
      { id: 8, nome: "Vodka Smirnoff 998ml", preco: 49.90, desc: "Premium russa",
        imagem: "https://via.placeholder.com/300x300?text=Vodka+Smirnoff" },
      { id: 9, nome: "Whisky Johnnie Walker Red 1L", preco: 119.90, desc: "Escocês clássico",
        imagem: "https://via.placeholder.com/300x300?text=Johnnie+Walker" },
    ]},
    { nome: "Carvão e Acessórios", itens: [
      { id: 10, nome: "Carvão 3kg", preco: 25.00, desc: "Para churrasco",
        imagem: "https://via.placeholder.com/300x300?text=Carvão+3kg" },
      { id: 11, nome: "Copos Descartáveis 300ml (50un)", preco: 15.00, desc: "Pacote",
        imagem: "https://via.placeholder.com/300x300?text=Copos" },
    ]}
  ];

  const [carrinho, setCarrinho] = useState({});
  const [busca, setBusca] = useState('');
  const [opcaoEntrega, setOpcaoEntrega] = useState('retirada'); // 'retirada' ou 'entrega'
  const [showModal, setShowModal] = useState(false);

  const adicionar = (id) => setCarrinho(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  const remover = (id) => setCarrinho(prev => {
    const novo = { ...prev };
    if (novo[id] > 1) novo[id]--;
    else delete novo[id];
    return novo;
  });
  const limpar = () => setCarrinho({});

  const totalItens = () => Object.values(carrinho).reduce((a, b) => a + b, 0);
  const subtotal = () => {
    let t = 0;
    Object.keys(carrinho).forEach(id => {
      const item = categorias.flatMap(c => c.itens).find(i => i.id === parseInt(id));
      if (item) t += item.preco * carrinho[id];
    });
    return t;
  };
  const totalPreco = () => {
    const taxa = opcaoEntrega === 'entrega' ? negocio.taxaEntrega : 0;
    return (subtotal() + taxa).toFixed(2);
  };

  const itensFiltrados = categorias.map(cat => ({
    ...cat,
    itens: cat.itens.filter(item =>
      item.nome.toLowerCase().includes(busca.toLowerCase()) ||
      item.desc.toLowerCase().includes(busca.toLowerCase())
    )
  })).filter(cat => cat.itens.length > 0);

  const finalizar = () => {
    if (totalItens() === 0) return alert("Adicione itens ao carrinho!");
    setShowModal(true);
  };

  const confirmarPedido = () => {
    let msg = `*Pedido - ${negocio.nome}*\n\n`;
    msg += `*Opção:* ${opcaoEntrega === 'entrega' ? `Entrega (taxa R$${negocio.taxaEntrega.toFixed(2)})` : 'Retirada no local'}\n\n`;
    Object.keys(carrinho).forEach(id => {
      const item = categorias.flatMap(c => c.itens).find(i => i.id === parseInt(id));
      if (item) msg += `${carrinho[id]}x ${item.nome} - R$ ${(item.preco * carrinho[id]).toFixed(2)}\n`;
    });
    const taxa = opcaoEntrega === 'entrega' ? negocio.taxaEntrega : 0;
    msg += `\n*Subtotal: R$ ${subtotal().toFixed(2)}*`;
    if (taxa > 0) msg += `\n*Taxa de entrega: R$ ${taxa.toFixed(2)}*`;
    msg += `\n*Total: R$ ${totalPreco()}*\n\n`;
    msg += `*Pagamento: PIX*\nChave: ${negocio.pix}`;

    window.open(`https://wa.me/${negocio.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
    setShowModal(false);
    limpar();
  };

  return (
    <>
      <nav className="navbar navbar-dark bg-success fixed-top shadow">
        <div className="container-fluid">
          <a className="navbar-brand d-flex align-items-center" href="#">
            <img src={negocio.logo} alt="Logo" height="60" className="me-3 rounded shadow"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/150x60/198754/FFFFFF?text=TERRITÓRIO'; }} />
            <span className="fs-3 fw-bold">{negocio.nome}</span>
          </a>
          <span className="badge bg-light text-dark fs-5 rounded-pill px-4 py-2">
            🛒 {totalItens()} itens • R$ {totalPreco()}
          </span>
        </div>
      </nav>

      <div className="container pt-5 mt-5">
        <h1 className="text-center my-5 display-4">Cardápio Digital</h1>
        <p className="text-center lead mb-5">Entrega rápida • Pagamento via PIX</p>

        {/* Barra de busca */}
        <div className="row mb-4">
          <div className="col-md-6 mx-auto">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="🔍 Buscar produto (ex: Skol, Coca)..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        </div>

        {/* Opção de entrega/retirada */}
        <div className="text-center mb-5">
          <div className="btn-group" role="group">
            <input type="radio" className="btn-check" name="entrega" id="retirada" checked={opcaoEntrega === 'retirada'} onChange={() => setOpcaoEntrega('retirada')} />
            <label className="btn btn-outline-success btn-lg" htmlFor="retirada">🚶 Retirada no local (grátis)</label>

            <input type="radio" className="btn-check" name="entrega" id="entrega" checked={opcaoEntrega === 'entrega'} onChange={() => setOpcaoEntrega('entrega')} />
            <label className="btn btn-outline-success btn-lg" htmlFor="entrega">🚚 Entrega (R$ {negocio.taxaEntrega.toFixed(2)})</label>
          </div>
        </div>

        {itensFiltrados.map(cat => (
          <div key={cat.nome} className="mb-5">
            <h2 className="text-center mb-4 display-5 border-bottom border-success pb-3">{cat.nome}</h2>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {cat.itens.map(item => (
                <div className="col" key={item.id}>
                  <div className="card bg-secondary text-white h-100 shadow-lg border-0">
                    <img src={item.imagem} className="card-img-top" alt={item.nome}
                      style={{ height: '250px', objectFit: 'cover' }}
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/300x250?text=Imagem+Indisponível'; }} />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{item.nome}</h5>
                      <p className="card-text flex-grow-1 text-white-50">{item.desc}</p>
                      <p className="fs-2 fw-bold text-success mb-4">R$ {item.preco.toFixed(2)}</p>
                      <div className="d-flex gap-3 mt-auto">
                        <button className="btn btn-outline-light btn-lg flex-fill" onClick={() => remover(item.id)} disabled={!carrinho[item.id]}>-</button>
                        <button className="btn btn-light btn-lg flex-fill" disabled>{carrinho[item.id] || 0}</button>
                        <button className="btn btn-outline-light btn-lg flex-fill" onClick={() => adicionar(item.id)}>+</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {totalItens() > 0 && (
          <div className="text-center my-5">
            <button className="btn btn-success btn-lg px-5 py-4 fs-3 shadow me-3" onClick={finalizar}>
              ✅ FINALIZAR PEDIDO • R$ {totalPreco()}
            </button>
            <button className="btn btn-outline-warning btn-lg" onClick={limpar}>
              Limpar Carrinho
            </button>
          </div>
        )}

        <footer className="text-center py-5 border-top border-secondary mt-5 text-muted">
          <p className="mb-1">{negocio.endereco}</p>
          <p className="mb-1">{negocio.horario}</p>
          <p>WhatsApp: {negocio.whatsapp}</p>
        </footer>
      </div>

      {/* Modal de confirmação */}
      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-white">
              <div className="modal-header border-0">
                <h5 className="modal-title fs-3">Confirmar Pedido?</h5>
              </div>
              <div className="modal-body text-center">
                <p>Total: <strong className="text-success fs-2">R$ {totalPreco()}</strong></p>
                <p>O pedido será enviado para o WhatsApp.</p>
              </div>
              <div className="modal-footer border-0 justify-content-center">
                <button className="btn btn-outline-light btn-lg me-3" onClick={() => setShowModal(false)}>Cancelar</button>
                <button className="btn btn-success btn-lg px-5" onClick={confirmarPedido}>Sim, enviar! ✅</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;