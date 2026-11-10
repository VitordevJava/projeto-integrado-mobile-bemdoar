import { useEffect, useState } from 'react'
import { api } from '../servicos/api'
import { Link } from 'react-router-dom'
import Icone from '../componentes/Icone'

/** RF04 - perfil institucional publico. */
export default function HomePage() {
  const [instituicao, setInstituicao] = useState(null)
  const [erro, setErro] = useState('')

  useEffect(() => {
    api.get('/api/instituicao')
      .then(setInstituicao)
      .catch((e) => setErro(e.message))
  }, [])

  if (erro) return <div className="alerta erro">{erro}</div>
  if (!instituicao) return <div className="vazio">Carregando...</div>

  return (
    <div className="home">
      <section className="home-hero">
        <div className="home-hero-copy"><p className="sobrelinha">Uma rede de cuidado</p><h1>Doar amor,<br/><em>espalhar esperança.</em></h1><p>{instituicao.missao}</p><div className="hero-acoes"><Link className="botao primario" to="/necessidades"><Icone nome="coracao" tamanho={19}/>Quero ajudar</Link><Link className="botao secundario" to="/necessidades">Ver necessidades</Link></div></div>
        <div className="home-hero-imagem"><span className="selo-impacto">Juntos, fazemos mais</span><img src="/assets/familia-doacao-creme.png" alt="Familia reunida com uma caixa de alimentos e itens de higiene recebidos por doacao" /></div>
      </section>

      <section className="atalhos" aria-label="Acessos rapidos">
        <Link to="/necessidades"><span><Icone nome="caixa" /></span><div><strong>Doacoes</strong><small>Veja o que precisamos</small></div></Link>
        <Link to="/necessidades"><span><Icone nome="alvo" /></span><div><strong>Necessidades</strong><small>Veja as metas</small></div></Link>
        <Link to="/cadastro"><span><Icone nome="megafone" /></span><div><strong>Participe</strong><small>Entre para essa rede</small></div></Link>
      </section>

      <section className="secao-institucional">
        <div><p className="sobrelinha">Quem somos</p><h2>Cuidado que chega onde precisa.</h2><p>{instituicao.descricao}</p><p>Atendemos <strong>{instituicao.publicoAtendido.toLowerCase()}</strong> em {instituicao.cidade}/{instituicao.estado}.</p></div>
        <blockquote><span>“</span><p>Quando uma doacao chega, ela carrega mais que um item. Carrega a certeza de que ninguem esta sozinho.</p><footer>Equipe {instituicao.nome}</footer></blockquote>
      </section>
    </div>
  )
}
