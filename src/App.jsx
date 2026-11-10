import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './componentes/Layout'
import RotaProtegida from './componentes/RotaProtegida'

import LoginPage from './paginas/LoginPage'
import CadastroPage from './paginas/CadastroPage'
import HomePage from './paginas/HomePage'

import NecessidadesPublicasPage from './paginas/necessidades/NecessidadesPublicasPage'
import NecessidadeListaPage from './paginas/necessidades/NecessidadeListaPage'
import NecessidadeFormPage from './paginas/necessidades/NecessidadeFormPage'

import CategoriaListaPage from './paginas/categorias/CategoriaListaPage'
import CategoriaFormPage from './paginas/categorias/CategoriaFormPage'
import DoacaoFormPage from './paginas/doacoes/DoacaoFormPage'
import MinhasDoacoesPage from './paginas/doacoes/MinhasDoacoesPage'
import DoacaoAdminPage from './paginas/doacoes/DoacaoAdminPage'
import DoacaoDetalhePage from './paginas/doacoes/DoacaoDetalhePage'
import RecuperarSenhaPage from './paginas/RecuperarSenhaPage'
import NecessidadeDetalhePage from './paginas/necessidades/NecessidadeDetalhePage'

export default function App() {
  return (
    <Layout>
      <Routes>

        {/* ---------- publico ---------- */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<CadastroPage />} />
        <Route path="/recuperar-senha" element={<RecuperarSenhaPage />} />
        <Route path="/necessidades" element={<NecessidadesPublicasPage />} />
        <Route path="/necessidades/:id" element={<NecessidadeDetalhePage />} />

        {/* ---------- administrativo: categorias (MOLDE) ---------- */}
        <Route path="/admin/categorias"
               element={<RotaProtegida somenteAdmin><CategoriaListaPage /></RotaProtegida>} />
        <Route path="/admin/categorias/nova"
               element={<RotaProtegida somenteAdmin><CategoriaFormPage /></RotaProtegida>} />
        <Route path="/admin/categorias/:id"
               element={<RotaProtegida somenteAdmin><CategoriaFormPage /></RotaProtegida>} />

        {/* ---------- administrativo: necessidades ---------- */}
        <Route path="/admin/necessidades"
               element={<RotaProtegida somenteAdmin><NecessidadeListaPage /></RotaProtegida>} />
        <Route path="/admin/necessidades/nova"
               element={<RotaProtegida somenteAdmin><NecessidadeFormPage /></RotaProtegida>} />
        <Route path="/admin/necessidades/:id"
               element={<RotaProtegida somenteAdmin><NecessidadeFormPage /></RotaProtegida>} />

        {/* ================= FRENTE 1 - DOACOES ================= */}
        <Route path="/doar/necessidade/:id" element={<RotaProtegida><DoacaoFormPage /></RotaProtegida>} />
        <Route path="/minhas-doacoes" element={<RotaProtegida><MinhasDoacoesPage /></RotaProtegida>} />
        <Route path="/minhas-doacoes/:id" element={<RotaProtegida><DoacaoDetalhePage /></RotaProtegida>} />
        <Route path="/admin/doacoes" element={<RotaProtegida somenteAdmin><DoacaoAdminPage /></RotaProtegida>} />

        {/* endereco que nao existe volta para a home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}
