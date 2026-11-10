import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../../servicos/api'

const data = valor => valor ? new Date(valor).toLocaleString('pt-BR') : '—'

export default function DoacaoDetalhePage() {
  const { id } = useParams()
  const [doacao, setDoacao] = useState(null)
  const [erro, setErro] = useState('')

  useEffect(() => {
    api.get(`/api/doacoes/${id}`).then(setDoacao).catch(e => setErro(e.message))
  }, [id])

  return <section className="pagina-estreita">
    <Link className="link-voltar link-voltar-pagina" to="/minhas-doacoes">Voltar para minhas doações</Link>
    <h1>Detalhes da doação</h1>
    {erro && <div className="alerta erro" role="alert">{erro}</div>}
    {!doacao && !erro && <p>Carregando...</p>}
    {doacao && <article className="cartao cartao-doacao">
      <h2>{doacao.item}</h2>
      <p><strong>Protocolo: {doacao.protocolo}</strong></p>
      <dl className="detalhes-doacao">
        <div><dt>Situação</dt><dd>{doacao.situacao.replaceAll('_', ' ')}</dd></div>
        <div><dt>Necessidade</dt><dd>{doacao.necessidadeTitulo || doacao.campanhaTitulo}</dd></div>
        <div><dt>Quantidade prometida</dt><dd>{doacao.quantidadePrometida}</dd></div>
        <div><dt>Quantidade efetivamente recebida</dt><dd>{doacao.quantidadeRecebida ?? 'Ainda não recebida'}</dd></div>
        <div><dt>Registrada em</dt><dd>{data(doacao.dataRegistro)}</dd></div>
        <div><dt>Prazo de análise</dt><dd>{data(doacao.prazoAnalise)}</dd></div>
        <div><dt>Confirmada em</dt><dd>{data(doacao.dataConfirmacao)}</dd></div>
        <div><dt>Prazo de entrega</dt><dd>{data(doacao.prazoEntrega)}</dd></div>
        <div><dt>Recebida em</dt><dd>{data(doacao.dataRecebimento)}</dd></div>
      </dl>
      {doacao.observacao && <p>Observação: {doacao.observacao}</p>}
      {doacao.motivoCancelamento && <p>Motivo do cancelamento: {doacao.motivoCancelamento}</p>}
    </article>}
  </section>
}
