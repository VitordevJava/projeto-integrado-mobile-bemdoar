import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../servicos/api'
import Icone from '../../componentes/Icone'

export default function MinhasDoacoesPage() {
  const [doacoes, setDoacoes] = useState([])
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [aba, setAba] = useState('ANDAMENTO')

  async function carregar() {
    setCarregando(true)
    setErro('')
    try { setDoacoes(await api.get('/api/doacoes/minhas')) }
    catch (e) { setErro(e.message) }
    finally { setCarregando(false) }
  }

  useEffect(() => { carregar() }, [])

  async function cancelar(id) {
    if (!window.confirm('Deseja cancelar esta doacao?')) return
    try { await api.patch(`/api/doacoes/${id}/cancelar`); await carregar() }
    catch (e) { setErro(e.message) }
  }

  const filtradas = doacoes.filter(d => aba === 'ANDAMENTO'
    ? ['PENDENTE', 'CONFIRMADA'].includes(d.situacao)
    : ['RECEBIDA', 'CANCELADA'].includes(d.situacao))

  return <section className="pagina-doacoes">
    <header className="cabecalho-pagina"><div><p className="sobrelinha">Seu historico</p><h1>Minhas doacoes</h1><p>Acompanhe cada etapa das suas contribuicoes.</p></div><div className="resumo-causas"><strong>{doacoes.length}</strong><span>doacoes registradas</span></div></header>
    <div className="abas" role="tablist"><button className={aba === 'ANDAMENTO' ? 'ativa' : ''} onClick={() => setAba('ANDAMENTO')} role="tab">Em andamento</button><button className={aba === 'CONCLUIDAS' ? 'ativa' : ''} onClick={() => setAba('CONCLUIDAS')} role="tab">Concluidas</button></div>
    {erro && <div className="alerta erro" role="alert">{erro}</div>}
    {carregando ? <div className="vazio">Carregando...</div> : doacoes.length === 0 ?
      <div className="cartao vazio">Voce ainda nao registrou nenhuma doacao.</div> : filtradas.length === 0 ? <div className="estado-vazio compacto"><Icone nome="relogio" tamanho={32}/><h2>Nenhuma doacao nesta etapa</h2><p>Quando uma doacao mudar de situacao, ela aparecera aqui.</p></div> :
      <div className="grade-doacoes">{filtradas.map(doacao => <article className="cartao cartao-doacao" key={doacao.id}>
        <div className="linha-cartao"><div className="titulo-com-icone"><span><Icone nome="caixa" /></span><h2>{doacao.item}</h2></div><span className={`etiqueta situacao-${doacao.situacao.toLowerCase()}`}>{doacao.situacao.replaceAll('_', ' ')}</span></div>
        <p><strong>Protocolo: {doacao.protocolo}</strong></p>
        <dl className="detalhes-doacao"><div><dt>Prometido</dt><dd>{doacao.quantidadePrometida}</dd></div><div><dt>Efetivamente recebido</dt><dd>{doacao.quantidadeRecebida ?? "Ainda não recebido"}</dd></div><div><dt>Destino</dt><dd>{doacao.necessidadeTitulo || doacao.campanhaTitulo}</dd></div><div><dt>Entrega</dt><dd>{doacao.formaEntrega.replaceAll('_', ' ')}</dd></div></dl>
        {doacao.situacao === "PENDENTE" && <p className="texto-apoio">Aguardando análise até {new Date(doacao.prazoAnalise).toLocaleString("pt-BR")}</p>}
        {doacao.situacao === "CONFIRMADA" && <p className="texto-apoio">Entrega até {new Date(doacao.prazoEntrega).toLocaleString("pt-BR")}</p>}
        <Link className="botao" to={`/minhas-doacoes/${doacao.id}`}>Ver detalhes</Link>
        {doacao.motivoCancelamento && <p className="texto-apoio">Motivo: {doacao.motivoCancelamento}</p>}
        {['PENDENTE', 'CONFIRMADA'].includes(doacao.situacao) && <button className="botao perigo botao-bloco-mobile" onClick={() => cancelar(doacao.id)}>Cancelar doacao</button>}
      </article>)}</div>}
  </section>
}
