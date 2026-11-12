import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api, MODO_DEMONSTRACAO } from '../servicos/api'
import Brand from '../componentes/Brand'

/** RF01 - cadastro publico. Sempre cria perfil USUARIO. */
export default function CadastroPage() {
  const [formulario, setFormulario] = useState({
    nome: '', email: '', senha: '', confirmacaoSenha: '',
    telefone: '', dataNascimento: '', aceiteTermos: false
  })
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)
  const navegar = useNavigate()

  function aoDigitar(evento) {
    const { name, value, type, checked } = evento.target
    setFormulario({ ...formulario, [name]: type === 'checkbox' ? checked : value })
  }

  async function aoEnviar(evento) {
    evento.preventDefault()
    setErro('')
    setEnviando(true)
    try {
      await api.post('/api/auth/cadastro', formulario)
      navegar('/login')
    } catch (e) {
      setErro(e.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section className="auth-pagina auth-pagina-cadastro">
      <div className="auth-card">
        <Brand />
        <div className="auth-intro"><p className="sobrelinha">Comece por aqui</p><h1>Crie sua conta</h1><p>Leva menos de dois minutos para começar a ajudar.</p></div>

        {MODO_DEMONSTRACAO && <div className="alerta ok">Cadastro fictício: você poderá entrar depois com qualquer senha. Os dados ficam apenas neste navegador.</div>}
        {erro && <div className="alerta erro">{erro}</div>}

        <form onSubmit={aoEnviar} className="auth-form auth-form-grid">
          <div className="campo">
            <label htmlFor="nome">Nome *</label>
            <input id="nome" name="nome" autoComplete="name" required placeholder="Seu nome completo" value={formulario.nome} onChange={aoDigitar} />
          </div>
          <div className="campo">
            <label htmlFor="email">E-mail *</label>
            <input id="email" name="email" type={MODO_DEMONSTRACAO ? "text" : "email"} autoComplete="email" required placeholder="voce@email.com" value={formulario.email} onChange={aoDigitar} />
          </div>
          <div className="campo">
            <label htmlFor="senha">Senha * {MODO_DEMONSTRACAO ? '(qualquer texto)' : '(mínimo de 8 caracteres)'}</label>
            <input id="senha" name="senha" type="password" autoComplete="new-password" minLength={MODO_DEMONSTRACAO ? 1 : 8} required placeholder={MODO_DEMONSTRACAO ? 'Qualquer senha para demonstração' : 'Mínimo de 8 caracteres'} value={formulario.senha} onChange={aoDigitar} />
          </div>
          <div className="campo">
            <label htmlFor="confirmacaoSenha">Confirmar senha *</label>
            <input id="confirmacaoSenha" name="confirmacaoSenha" type="password" autoComplete="new-password" required placeholder="Repita sua senha"
                   value={formulario.confirmacaoSenha} onChange={aoDigitar} />
          </div>
          <div className="campo">
            <label htmlFor="telefone">Telefone</label>
            <input id="telefone" name="telefone" type="tel" autoComplete="tel" placeholder="(00) 00000-0000" value={formulario.telefone} onChange={aoDigitar} />
          </div>
          <div className="campo">
            <label htmlFor="dataNascimento">Data de nascimento {MODO_DEMONSTRACAO ? '(opcional)' : '*'}</label>
            <input id="dataNascimento" name="dataNascimento" type="date" required={!MODO_DEMONSTRACAO}
                   value={formulario.dataNascimento} onChange={aoDigitar} />
          </div>
          <div className="campo campo-termos">
            <label>
              <input type="checkbox" name="aceiteTermos" required={!MODO_DEMONSTRACAO} checked={formulario.aceiteTermos}
                     onChange={aoDigitar} />
              Aceito os Termos de Uso e a Politica de Privacidade {MODO_DEMONSTRACAO ? '(opcional nesta demonstração)' : '*'}
            </label>
          </div>

          <button className="botao primario botao-bloco" type="submit" disabled={enviando}>
            {enviando ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        <p className="auth-alternativa">
          Ja tem conta? <Link to="/login">Entrar</Link>
        </p>
      </div>
      <div className="auth-ondas" aria-hidden="true"><i /><b /></div>
    </section>
  )
}
