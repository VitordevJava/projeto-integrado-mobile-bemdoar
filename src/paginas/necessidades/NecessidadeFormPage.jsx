import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../servicos/api'

/**
 * RF06/RF08 - cadastro e edicao de necessidade.
 * Exemplo de formulario com <select> carregado do backend.
 */
export default function NecessidadeFormPage() {
  const { id } = useParams()
  const navegar = useNavigate()
  const editando = id !== undefined

  const [formulario, setFormulario] = useState({
    titulo: '', descricao: '', categoriaId: '', quantidadeNecessaria: '', prioridade: 'MEDIA', justificativa: ''
  })
  const [categorias, setCategorias] = useState([])
  const [metadados, setMetadados] = useState(null)
  const [historico, setHistorico] = useState([])
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    api.get('/api/categorias/ativas').then(setCategorias).catch((e) => setErro(e.message))

    if (editando) {
      api.get(`/api/necessidades/${id}/admin`)
        .then((d) => { setMetadados(d); setFormulario({
          titulo: d.necessidade.titulo,
          descricao: d.necessidade.descricao,
          categoriaId: d.necessidade.categoriaId,
          quantidadeNecessaria: d.necessidade.quantidadeNecessaria,
          prioridade: d.necessidade.prioridade,
          justificativa: ''
        }) })
        .catch((e) => setErro(e.message))
      api.get(`/api/necessidades/${id}/auditoria`).then(setHistorico).catch((e) => setErro(e.message))
    }
  }, [id])

  function aoDigitar(evento) {
    const { name, value } = evento.target
    setFormulario({ ...formulario, [name]: value })
  }

  async function aoEnviar(evento) {
    evento.preventDefault()
    setErro('')
    setSalvando(true)
    try {
      const corpo = {
        ...formulario,
        categoriaId: Number(formulario.categoriaId),
        quantidadeNecessaria: Number(formulario.quantidadeNecessaria)
      }
      if (editando) {
        await api.put(`/api/necessidades/${id}`, corpo)
      } else {
        await api.post('/api/necessidades', corpo)
      }
      navegar('/admin/necessidades')
    } catch (e) {
      setErro(e.message)
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div>
      <div className="titulo-pagina">
        <h1>{editando ? 'Editar necessidade' : 'Nova necessidade'}</h1>
      </div>

      {erro && <div className="alerta erro">{erro}</div>}

      {metadados && <div className="cartao"><p>Criada por: <strong>{metadados.criadoPor}</strong>. Última atualização: {metadados.atualizadoPor || "nenhuma"}.</p><p>Justificativa atual: {metadados.justificativa || "Registro anterior à revisão"}</p>{historico.length > 0 && <details><summary>Ver histórico de alterações</summary><ul>{historico.map(r => <li key={r.id}>{new Date(r.dataHora).toLocaleString("pt-BR")} — {r.acao} por {r.responsavelNome}. {r.justificativa}<br/>Antes: {r.valorAnterior || "—"}<br/>Depois: {r.valorNovo || "—"}</li>)}</ul></details>}</div>}
      <div className="cartao">
        <form onSubmit={aoEnviar}>
          <div className="campo">
            <label htmlFor="titulo">Titulo *</label>
            <input id="titulo" name="titulo" value={formulario.titulo} onChange={aoDigitar} maxLength={150} />
          </div>

          <div className="campo">
            <label htmlFor="descricao">Descricao *</label>
            <textarea id="descricao" name="descricao" value={formulario.descricao} onChange={aoDigitar} maxLength={2000} />
          </div>

          <div className="campo">
            <label htmlFor="categoriaId">Categoria *</label>
            <select id="categoriaId" name="categoriaId" value={formulario.categoriaId} onChange={aoDigitar}>
              <option value="">Selecione...</option>
              {categorias.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </div>

          <div className="campo">
            <label htmlFor="quantidadeNecessaria">Quantidade necessaria *</label>
            <input id="quantidadeNecessaria" name="quantidadeNecessaria" type="number" min="1"
                   value={formulario.quantidadeNecessaria} onChange={aoDigitar} />
          </div>

          <div className="campo">
            <label htmlFor="prioridade">Prioridade *</label>
            <select id="prioridade" name="prioridade" value={formulario.prioridade} onChange={aoDigitar}>
              <option value="BAIXA">Baixa</option>
              <option value="MEDIA">Media</option>
              <option value="ALTA">Alta</option>
            </select>
          </div>

          <div className="campo"><label htmlFor="justificativa">Justificativa {editando ? "da alteração" : "da criação"} *</label><textarea id="justificativa" name="justificativa" required maxLength={1000} value={formulario.justificativa} onChange={aoDigitar} /></div>

          <div className="acoes-form">
            <button className="botao primario" type="submit" disabled={salvando}>
              {salvando ? 'Salvando...' : 'Salvar'}
            </button>
            <button className="botao" type="button" onClick={() => navegar('/admin/necessidades')}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
