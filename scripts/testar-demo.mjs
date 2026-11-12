import assert from 'node:assert/strict'
import { respostaDemonstracao as api, reiniciarDemonstracao } from '../src/servicos/dadosDemonstracao.js'

const memoria = new Map()
globalThis.localStorage = {
  getItem: chave => memoria.get(chave) ?? null,
  setItem: (chave, valor) => memoria.set(chave, String(valor)),
  removeItem: chave => memoria.delete(chave)
}

const chamar = (metodo, rota, corpo) => api(metodo, rota, corpo)
const autenticar = (email, perfilDemo) => {
  const usuario = chamar('POST', '/api/auth/login', { email, senha: 'qualquer', perfilDemo })
  memoria.set('bemdoar_usuario', JSON.stringify(usuario))
  return usuario
}

reiniciarDemonstracao()
assert.equal(chamar('GET', '/api/necessidades').content.length, 3)
chamar('POST', '/api/auth/cadastro', { nome: 'Ana', email: 'ana@demo' })
chamar('POST', '/api/auth/cadastro', { nome: 'Ana Silva', email: 'ana@demo' })
const doador = autenticar('ana@demo', 'USUARIO')
assert.equal(doador.nome, 'Ana Silva')
const doacao = chamar('POST', '/api/doacoes', {
  necessidadeId: 1, item: 'Cesta básica', quantidade: 5
})
assert.match(doacao.protocolo, /^BD-DEMO-/)
assert.equal(chamar('GET', '/api/doacoes/minhas').length, 1)
assert.equal(chamar('GET', '/api/necessidades/1').quantidadeRecebida, 0)
assert.throws(() => chamar('GET', '/api/categorias'), /administrador/)

autenticar('apresentador@demo', 'ADMINISTRADOR')
const categoria = chamar('POST', '/api/categorias', { nome: 'Brinquedos' })
const necessidade = chamar('POST', '/api/necessidades', {
  titulo: 'Brinquedos para crianças', descricao: 'Brinquedos em bom estado',
  categoriaId: categoria.id, quantidadeNecessaria: 10, prioridade: 'MEDIA',
  justificativa: 'Apresentação acadêmica'
})
assert.equal(chamar('GET', `/api/necessidades/${necessidade.id}`).titulo, necessidade.titulo)
chamar('PATCH', `/api/doacoes/${doacao.id}/confirmar`)
chamar('PATCH', `/api/doacoes/${doacao.id}/receber`, { itemConfere: true, quantidadeRecebida: 3 })
assert.equal(chamar('GET', '/api/necessidades/1').quantidadeRecebida, 3)
chamar('PATCH', `/api/doacoes/${doacao.id}/retificar`, { quantidadeRecebida: 4, justificativa: 'Conferência' })
assert.equal(chamar('GET', '/api/necessidades/1').quantidadeRecebida, 4)
assert.equal(chamar('GET', `/api/doacoes/protocolo/${doacao.protocolo}`).id, doacao.id)
assert.equal(chamar('GET', `/api/doacoes/${doacao.id}/auditoria`).length, 2)

autenticar('outra@demo', 'USUARIO')
assert.throws(() => chamar('GET', `/api/doacoes/${doacao.id}`), /outra conta/)
autenticar('ana@demo', 'USUARIO')
assert.equal(chamar('GET', `/api/doacoes/${doacao.id}`).quantidadeRecebida, 4)
reiniciarDemonstracao()
assert.equal(chamar('GET', '/api/doacoes/minhas').length, 0)
console.log('Demonstração: cadastro, perfis, CRUD, doação, recebimento, auditoria e isolamento verificados.')
