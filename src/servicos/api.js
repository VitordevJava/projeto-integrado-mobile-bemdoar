import { respostaDemonstracao } from './dadosDemonstracao'

export const MODO_DEMONSTRACAO = import.meta.env.VITE_MODO_DEMONSTRACAO === 'true'
export const URL_API = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const CHAVE_TOKEN = 'bemdoar_token'

export function salvarToken(token) {
  localStorage.setItem(CHAVE_TOKEN, token)
}

export function lerToken() {
  return localStorage.getItem(CHAVE_TOKEN)
}

export function apagarToken() {
  localStorage.removeItem(CHAVE_TOKEN)
}

async function requisicao(metodo, caminho, corpo) {
  if (MODO_DEMONSTRACAO) return respostaDemonstracao(metodo, caminho)
  const cabecalhos = { 'Content-Type': 'application/json' }

  const token = lerToken()
  if (token) {
    cabecalhos['Authorization'] = 'Bearer ' + token
  }

  const resposta = await fetch(URL_API + caminho, {
    method: metodo,
    headers: cabecalhos,
    body: corpo ? JSON.stringify(corpo) : undefined
  })

  // 204 = deu certo e nao tem conteudo (ex: DELETE)
  if (resposta.status === 204) {
    return null
  }

  const texto = await resposta.text()
  const dados = texto ? JSON.parse(texto) : null

  if (!resposta.ok) {
    // O backend sempre devolve { mensagem: "..." } quando da erro.
    // Quando o erro e de validacao, vem tambem { campos: {...} }.
    let mensagem = (dados && dados.mensagem) || 'Nao foi possivel concluir a operacao.'
    if (dados && dados.campos) {
      mensagem = Object.values(dados.campos).join(' ')
    }
    if (resposta.status === 401) {
      apagarToken()
    }
    throw new Error(mensagem)
  }

  return dados
}

export const api = {
  get: (caminho) => requisicao('GET', caminho),
  post: (caminho, corpo) => requisicao('POST', caminho, corpo),
  put: (caminho, corpo) => requisicao('PUT', caminho, corpo),
  patch: (caminho, corpo) => requisicao('PATCH', caminho, corpo),
  remove: (caminho) => requisicao('DELETE', caminho)
}
