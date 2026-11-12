import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { entrar } from '../servicos/auth'
import { MODO_DEMONSTRACAO } from '../servicos/api'
import Brand from '../componentes/Brand'

/** RF02 - login. */
export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [perfilDemo, setPerfilDemo] = useState('USUARIO')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)
  const navegar = useNavigate()

  async function aoEnviar(evento) {
    evento.preventDefault()
    setErro('')
    setEnviando(true)
    try {
      await entrar(email, senha, perfilDemo)
      navegar('/')
    } catch (e) {
      setErro(e.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section className="auth-pagina">
      <div className="auth-decor auth-decor-topo" />
      <div className="auth-card">
        <Brand />
        <div className="auth-intro"><p className="sobrelinha">Bem-vindo de volta</p><h1>Acesse sua conta</h1><p>Continue acompanhando suas doacoes e o impacto gerado.</p></div>

        {MODO_DEMONSTRACAO && <div className="alerta ok">Demonstração: use qualquer identificação e senha. Nenhuma senha será salva.</div>}
        {erro && <div className="alerta erro">{erro}</div>}

        <form onSubmit={aoEnviar} className="auth-form">
          <div className="campo">
            <label htmlFor="email">E-mail</label>
            <input id="email" type={MODO_DEMONSTRACAO ? "text" : "email"} autoComplete="email" required placeholder="voce@email.com" value={email}
                   onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="campo">
            <label htmlFor="senha">Senha</label>
            <input id="senha" type="password" autoComplete="current-password" required placeholder="Sua senha" value={senha}
                   onChange={(e) => setSenha(e.target.value)} />
          </div>
          {MODO_DEMONSTRACAO && <div className="campo"><label htmlFor="perfilDemo">Perfil para apresentar</label><select id="perfilDemo" value={perfilDemo} onChange={e => setPerfilDemo(e.target.value)}><option value="USUARIO">Doador</option><option value="ADMINISTRADOR">Administrador</option></select></div>}
          <div className="auth-ajuda"><Link to="/recuperar-senha">Esqueci minha senha</Link></div>
          <button className="botao primario botao-bloco" type="submit" disabled={enviando}>
            {enviando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="auth-alternativa">
          Ainda nao participa? <Link to="/cadastro">Criar conta</Link>
        </p>
      </div>
      <div className="auth-ondas" aria-hidden="true"><i /><b /></div>
    </section>
  )
}
