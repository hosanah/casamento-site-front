import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/GlobalStyles.css';

// Páginas públicas
import Home from './pages/Home';
import NossaHistoria from './pages/NossaHistoria';
import ListaPresentes from './pages/ListaPresentes';
import ConfirmacaoPresente from './pages/ConfirmacaoPresente';
import ConfirmePresenca from './pages/ConfirmePresenca';
import Informacoes from './pages/Informacoes';
import Album from './pages/Album';

// Páginas do Admin
import AdminLogin from './pages/Admin/Login';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminPresentes from './pages/Admin/Presentes';
import AdminConfig from './pages/Admin/Config';
import AdminConteudo from './pages/Admin/Conteudo';
import AdminHistoria from './pages/Admin/Historia';
import AdminAlbum from './pages/Admin/Album';
import AdminRSVP from './pages/Admin/RSVP';
import AdminVendas from './pages/Admin/Vendas';

// Componentes
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/nossa-historia" element={<NossaHistoria />} />
          <Route path="/lista-de-presentes" element={<ListaPresentes />} />
          <Route path="/presentes/confirmacao" element={<ConfirmacaoPresente />} />
          <Route path="/confirme-sua-presenca" element={<ConfirmePresenca />} />
          <Route path="/informacoes" element={<Informacoes />} />
          <Route path="/album" element={<Album />} />
          
          {/* Rotas do Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/presentes" 
            element={
              <ProtectedRoute>
                <AdminPresentes />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/config" 
            element={
              <ProtectedRoute>
                <AdminConfig />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/conteudo" 
            element={
              <ProtectedRoute>
                <AdminConteudo />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/album" 
            element={
              <ProtectedRoute>
                <AdminAlbum />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/rsvp" 
            element={
              <ProtectedRoute>
                <AdminRSVP />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/historia" 
            element={
              <ProtectedRoute>
                <AdminHistoria />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/vendas" 
            element={
              <ProtectedRoute>
                <AdminVendas />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
