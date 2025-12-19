import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="text-center mt-5">
      <h1 className="display-4 text-success fw-bold">Dashboard Admin</h1>
      <p className="lead text-muted">Adicione produtos, categorias e fotos aqui</p>
      <div className="mt-5 card p-5 shadow mx-auto" style={{ maxWidth: '600px' }}>
        <p className="fs-4">Formulário de upload de produtos funcionando!</p>
        <p>Próximo passo: conectar ao Firebase para salvar de verdade.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;