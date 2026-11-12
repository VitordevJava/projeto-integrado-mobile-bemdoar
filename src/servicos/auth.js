// ============================================================
// Guarda quem esta logado.
// NAO E NECESSARIO ALTERAR ESTE ARQUIVO.
// ============================================================
import { api, salvarToken, apagarToken, lerToken } from './api'

const CHAVE_USUARIO = 'bemdoar_usuario'

export async function entrar(email, senha, perfilDemo) {
  const resposta = await api.post('/api/auth/login', { email, senha, perfilDemo })
  salvarToken(resposta.token)
  localStorage.setItem(CHAVE_USUARIO, JSON.stringify(resposta))
  return resposta
}

export function sair() {
  apagarToken()
  localStorage.removeItem(CHAVE_USUARIO)
}

export function usuarioLogado() {
  if (!lerToken()) return null
  const bruto = localStorage.getItem(CHAVE_USUARIO)
  return bruto ? JSON.parse(bruto) : null
}

export function estaLogado() {
  return usuarioLogado() !== null
}

export function ehAdministrador() {
  const usuario = usuarioLogado()
  return usuario !== null && usuario.perfil === 'ADMINISTRADOR'
}
