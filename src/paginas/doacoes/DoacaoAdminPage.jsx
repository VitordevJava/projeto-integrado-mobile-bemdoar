import { useEffect, useState } from 'react'
import { api } from '../../servicos/api'

const data = valor => valor ? new Date(valor).toLocaleString('pt-BR') : '—'

export default function DoacaoAdminPage() {
  const [doacoes, setDoacoes] = useState([])
  const [situacao, setSituacao] = useState('')
  const [protocolo, setProtocolo] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [historico, setHistorico] = useState({})

  async function carregar(filtro = situacao) {
    setCarregando(true)
    setErro('')
    try { setDoacoes(await api.get(`/api/doacoes${filtro ? `?situacao=${filtro}` : ''}`)) }
    catch (e) { setErro(e.message) }
    finally { setCarregando(false) }
  }

  useEffect(() => { carregar(situacao) }, [situacao])

  async function buscar(evento) {
    evento.preventDefault()
    if (!protocolo.trim()) { await carregar(); return }
    setErro('')
    setCarregando(true)
    try { setDoacoes([await api.get(`/api/doacoes/protocolo/${encodeURIComponent(protocolo.trim())}`)]) }
    catch (e) { setDoacoes([]); setErro(e.message) }
    finally { setCarregando(false) }
  }

  async function executar(doacao, acao) {
    let corpo
    if (acao === 'cancelar' || acao === 'anular') {
      const justificativa = window.prompt(acao === 'anular' ? 'Justifique a anulação do recebimento:' : 'Informe o motivo do cancelamento:')
      if (justificativa === null) return
      if (!justificativa.trim()) { setErro('A justificativa é obrigatória.'); return }
      corpo = acao === 'anular' ? { justificativa } : { motivo: justificativa }
    }
    if (acao === 'receber') {
      const resposta = window.prompt(`Quantidade física recebida (1 a ${doacao.quantidadePrometida}):`, doacao.quantidadePrometida)
      if (resposta === null) return
      const quantidadeRecebida = Number(resposta)
      if (!Number.isInteger(quantidadeRecebida) || quantidadeRecebida < 1 || quantidadeRecebida > doacao.quantidadePrometida) {
        setErro('Informe uma quantidade inteira entre 1 e a quantidade prometida.'); return
      }
      if (!window.confirm(`O item físico é exatamente "${doacao.item}"? Se for diferente, cancele esta intenção.`)) return
      corpo = { quantidadeRecebida, itemConfere: true }
    }
    if (acao === 'retificar') {
      const resposta = window.prompt(`Nova quantidade efetivamente recebida (1 a ${doacao.quantidadePrometida}):`, doacao.quantidadeRecebida)
      if (resposta === null) return
      const quantidadeRecebida = Number(resposta)
      const justificativa = window.prompt('Justifique a correção:')
      if (justificativa === null) return
      if (!Number.isInteger(quantidadeRecebida) || quantidadeRecebida < 1 || quantidadeRecebida > doacao.quantidadePrometida || !justificativa.trim()) {
        setErro('Informe quantidade válida e justificativa.'); return
      }
      corpo = { quantidadeRecebida, justificativa }
    }
    setErro('')
    try { await api.patch(`/api/doacoes/${doacao.id}/${acao}`, corpo); await carregar() }
    catch (e) { setErro(e.message) }
  }

  async function verHistorico(id) {
    try { setHistorico({ ...historico, [id]: await api.get(`/api/doacoes/${id}/auditoria`) }) }
    catch (e) { setErro(e.message) }
  }

  return <section>
    <p className="sobrelinha">Administração</p>
    <div className="titulo-pagina"><h1>Gerir doações</h1></div>
    <div className="filtros cartao filtros-compactos">
      <div className="campo"><label htmlFor="filtroSituacao">Situação</label><select id="filtroSituacao" value={situacao} onChange={e => setSituacao(e.target.value)}><option value="">Todas</option><option value="PENDENTE">Pendentes</option><option value="CONFIRMADA">Confirmadas</option><option value="RECEBIDA">Recebidas</option><option value="CANCELADA">Canceladas</option></select></div>
      <form onSubmit={buscar} className="campo"><label htmlFor="protocolo">Protocolo</label><input id="protocolo" value={protocolo} onChange={e => setProtocolo(e.target.value)} placeholder="BD-..." /><button className="botao" type="submit">Buscar</button></form>
    </div>
    {erro && <div className="alerta erro" role="alert">{erro}</div>}
    {carregando ? <div className="vazio">Carregando...</div> : doacoes.length === 0 ? <div className="cartao vazio">Nenhuma doação encontrada.</div> :
      <div className="grade-doacoes">{doacoes.map(doacao => <article className="cartao cartao-doacao" key={doacao.id}>
        <div className="linha-cartao"><h2>{doacao.item}</h2><span className={`etiqueta situacao-${doacao.situacao.toLowerCase()}`}>{doacao.situacao}</span></div>
        <p><strong>Protocolo: {doacao.protocolo}</strong></p>
        <dl className="detalhes-doacao"><div><dt>Doador</dt><dd>{doacao.usuarioNome}</dd></div><div><dt>Prometido</dt><dd>{doacao.quantidadePrometida}</dd></div><div><dt>Recebido</dt><dd>{doacao.quantidadeRecebida ?? 'Ainda não recebido'}</dd></div><div><dt>Necessidade</dt><dd>{doacao.necessidadeTitulo || doacao.campanhaTitulo}</dd></div><div><dt>Prazo de análise</dt><dd>{data(doacao.prazoAnalise)}</dd></div><div><dt>Prazo de entrega</dt><dd>{data(doacao.prazoEntrega)}</dd></div></dl>
        {doacao.motivoCancelamento && <p>Motivo: {doacao.motivoCancelamento}</p>}
        {doacao.responsavelRecebimento && <p>Conferido por: {doacao.responsavelRecebimento}</p>}
        <div className="acoes-form acoes-administrativas">
          {doacao.situacao === 'PENDENTE' && <button className="botao" onClick={() => executar(doacao, 'confirmar')}>Confirmar manualmente</button>}
          {doacao.situacao === 'CONFIRMADA' && <button className="botao primario" onClick={() => executar(doacao, 'receber')}>Registrar recebimento</button>}
          {doacao.situacao === 'RECEBIDA' && <><button className="botao" onClick={() => executar(doacao, 'retificar')}>Corrigir quantidade</button><button className="botao perigo" onClick={() => executar(doacao, 'anular')}>Anular recebimento</button></>}
          {['PENDENTE', 'CONFIRMADA'].includes(doacao.situacao) && <button className="botao perigo" onClick={() => executar(doacao, 'cancelar')}>Cancelar</button>}
          <button className="botao" onClick={() => verHistorico(doacao.id)}>Ver auditoria</button>
        </div>
        {historico[doacao.id] && <div><h3>Auditoria</h3>{historico[doacao.id].length === 0 ? <p>Sem registros.</p> : <ul>{historico[doacao.id].map(r => <li key={r.id}>{data(r.dataHora)} — {r.acao} por {r.responsavelNome}: {r.valorAnterior ?? '—'} → {r.valorNovo ?? '—'}. {r.justificativa}</li>)}</ul>}</div>}
      </article>)}</div>}
  </section>
}
