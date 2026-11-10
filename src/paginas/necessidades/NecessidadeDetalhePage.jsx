import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../../servicos/api'
import Icone from '../../componentes/Icone'

export default function NecessidadeDetalhePage() {
  const { id } = useParams()
  const [necessidade, setNecessidade] = useState(null)
  const [erro, setErro] = useState('')
  useEffect(() => { api.get(`/api/necessidades/${id}`).then(setNecessidade).catch(e => setErro(e.message)) }, [id])
  if (erro) return <div className="estado-vazio"><h1>Nao foi possivel abrir esta necessidade</h1><p>{erro}</p><Link className="botao secundario" to="/necessidades">Voltar</Link></div>
  if (!necessidade) return <div className="vazio">Carregando detalhes...</div>
  return <section className="detalhe-necessidade">
    <Link className="link-voltar link-voltar-pagina" to="/necessidades"><Icone nome="seta" tamanho={18}/>Voltar para necessidades</Link>
    <div className="detalhe-grid">
      <div className="detalhe-visual"><img src="/assets/familia-doacao-creme.png" alt="Familia com caixa de doacoes"/><span>{necessidade.categoriaNome}</span></div>
      <div className="detalhe-conteudo"><div className="linha-cartao"><span className="etiqueta amarela">{necessidade.situacao.replaceAll('_',' ')}</span><span className={`prioridade prioridade-${necessidade.prioridade.toLowerCase()}`}>{necessidade.prioridade}</span></div><p className="sobrelinha">Detalhes da necessidade</p><h1>{necessidade.titulo}</h1><p className="texto-apoio">{necessidade.descricao}</p>
        <div className="numeros-meta"><div><span>Meta</span><strong>{necessidade.quantidadeNecessaria}</strong><small>unidades</small></div><div><span>Recebido</span><strong>{necessidade.quantidadeRecebida}</strong><small>unidades</small></div></div>
        <div className="barra-progresso barra-grande"><i style={{width: Math.min(necessidade.percentual,100)+'%'}}/></div>
        <span className="percentual-detalhe">{necessidade.percentual}% da meta alcançada</span>
        {!['ATENDIDA', 'ENCERRADA'].includes(necessidade.situacao) && <Link className="botao destaque botao-bloco" to={`/doar/necessidade/${necessidade.id}`}><Icone nome="coracao" tamanho={19}/>Quero doar</Link>}
      </div>
    </div>
  </section>
}
