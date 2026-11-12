const instituicao = {
  nome: 'Instituição parceira — demonstração',
  descricao: 'Esta é uma prévia visual do BemDoar. A instituição oficial será identificada após confirmação pelo PO.',
  missao: 'Organizar necessidades e doações físicas para a comunidade.',
  publicoAtendido: 'Famílias em situação de vulnerabilidade social',
  cidade: 'Gama',
  estado: 'DF'
}

const categorias = [
  { id: 1, nome: 'Alimentos' },
  { id: 2, nome: 'Roupas e agasalhos' },
  { id: 3, nome: 'Higiene pessoal' }
]

const necessidades = [
  { id: 1, titulo: 'Cestas básicas', descricao: 'Cestas básicas completas para famílias.', categoriaId: 1, categoriaNome: 'Alimentos', quantidadeNecessaria: 50, quantidadeRecebida: 0, percentual: 0, prioridade: 'ALTA', situacao: 'ABERTA' },
  { id: 2, titulo: 'Cobertores', descricao: 'Cobertores de solteiro para o inverno.', categoriaId: 2, categoriaNome: 'Roupas e agasalhos', quantidadeNecessaria: 100, quantidadeRecebida: 0, percentual: 0, prioridade: 'MEDIA', situacao: 'ABERTA' },
  { id: 3, titulo: 'Kits de higiene', descricao: 'Kit com sabonete, pasta de dente e shampoo.', categoriaId: 3, categoriaNome: 'Higiene pessoal', quantidadeNecessaria: 80, quantidadeRecebida: 0, percentual: 0, prioridade: 'BAIXA', situacao: 'ABERTA' }
]

export function respostaDemonstracao(metodo, caminho) {
  if (metodo !== 'GET') throw new Error('Esta é uma prévia visual. Login e doações estarão disponíveis quando a API for publicada.')
  const url = new URL(caminho, 'https://bemdoar.example')
  if (url.pathname === '/api/instituicao') return instituicao
  if (url.pathname === '/api/categorias/ativas') return categorias
  if (url.pathname === '/api/necessidades') {
    const termo = (url.searchParams.get('termo') || '').toLocaleLowerCase('pt-BR')
    const lista = necessidades.filter(n =>
      (!termo || `${n.titulo} ${n.descricao}`.toLocaleLowerCase('pt-BR').includes(termo)) &&
      (!url.searchParams.get('categoriaId') || String(n.categoriaId) === url.searchParams.get('categoriaId')) &&
      (!url.searchParams.get('prioridade') || n.prioridade === url.searchParams.get('prioridade')) &&
      (!url.searchParams.get('situacao') || n.situacao === url.searchParams.get('situacao'))
    )
    return { content: lista, totalPages: 1, number: 0 }
  }
  const detalhe = url.pathname.match(/^\/api\/necessidades\/(\d+)$/)
  if (detalhe) {
    const n = necessidades.find(item => item.id === Number(detalhe[1]))
    if (n) return n
  }
  throw new Error('Página indisponível nesta prévia visual.')
}
