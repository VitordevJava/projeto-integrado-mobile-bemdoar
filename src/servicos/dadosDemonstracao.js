// API fictícia usada somente pelo build --mode firebase. Nenhuma senha é gravada.
const CHAVE = 'bemdoar_demo_dados_v2'
const CHAVE_USUARIO = 'bemdoar_usuario'
const agora = () => new Date().toISOString()
const dataMaisDias = (data, dias) => new Date(new Date(data).getTime() + dias * 86400000).toISOString()

const instituicao = {
  nome: 'Instituição parceira — demonstração',
  descricao: 'Prévia acadêmica do BemDoar. Dados e operações são fictícios e ficam somente neste navegador.',
  missao: 'Organizar necessidades e doações físicas para a comunidade.',
  publicoAtendido: 'Famílias em situação de vulnerabilidade social', cidade: 'Gama', estado: 'DF'
}

function inicial() {
  return {
    proximoId: 4,
    categorias: [
      { id: 1, nome: 'Alimentos', descricao: 'Alimentos não perecíveis', ativo: true },
      { id: 2, nome: 'Roupas e agasalhos', descricao: 'Vestuário em bom estado', ativo: true },
      { id: 3, nome: 'Higiene pessoal', descricao: 'Itens de higiene', ativo: true }
    ],
    necessidades: [
      { id: 1, titulo: 'Cestas básicas', descricao: 'Cestas básicas completas para famílias.', categoriaId: 1, quantidadeNecessaria: 50, prioridade: 'ALTA', situacao: 'ABERTA', dataCriacao: agora(), justificativa: 'Exemplo acadêmico', criadoPor: 'Equipe BemDoar' },
      { id: 2, titulo: 'Cobertores', descricao: 'Cobertores de solteiro para o inverno.', categoriaId: 2, quantidadeNecessaria: 100, prioridade: 'MEDIA', situacao: 'ABERTA', dataCriacao: agora(), justificativa: 'Exemplo acadêmico', criadoPor: 'Equipe BemDoar' },
      { id: 3, titulo: 'Kits de higiene', descricao: 'Kit com sabonete, pasta de dente e shampoo.', categoriaId: 3, quantidadeNecessaria: 80, prioridade: 'BAIXA', situacao: 'ABERTA', dataCriacao: agora(), justificativa: 'Exemplo acadêmico', criadoPor: 'Equipe BemDoar' }
    ],
    doacoes: [], auditoria: [], usuarios: []
  }
}

function ler() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CHAVE))
    if (guardado?.categorias && guardado?.necessidades && guardado?.doacoes) return guardado
  } catch { /* Recomeça a demonstração se o armazenamento estiver inválido. */ }
  const dados = inicial()
  localStorage.setItem(CHAVE, JSON.stringify(dados))
  return dados
}

function salvar(dados) { localStorage.setItem(CHAVE, JSON.stringify(dados)) }
function usuario() {
  try { return JSON.parse(localStorage.getItem(CHAVE_USUARIO)) } catch { return null }
}
function proximoId(dados) { return dados.proximoId++ }
function falhar(mensagem) { throw new Error(mensagem) }
function item(lista, id, nome) { return lista.find(x => x.id === Number(id)) || falhar(`${nome} não encontrado(a).`) }
function exigirLogin() { return usuario() || falhar('Entre para continuar a demonstração.') }
function exigirAdmin() {
  const atual = exigirLogin()
  if (atual.perfil !== 'ADMINISTRADOR') falhar('Acesso de administrador necessário.')
  return atual
}
function evento(dados, tipo, id, acao, justificativa, anterior, novo) {
  dados.auditoria.push({ id: proximoId(dados), tipo, registroId: id, acao,
    responsavelNome: usuario()?.nome || 'Equipe BemDoar', dataHora: agora(),
    justificativa, valorAnterior: anterior == null ? null : String(anterior), valorNovo: novo == null ? null : String(novo) })
}
function categoriaNome(dados, id) { return dados.categorias.find(c => c.id === id)?.nome || 'Categoria removida' }
function necessidadePublica(dados, n) {
  const recebida = dados.doacoes.filter(d => d.necessidadeId === n.id && d.situacao === 'RECEBIDA')
    .reduce((soma, d) => soma + d.quantidadeRecebida, 0)
  const situacao = n.situacao === 'ENCERRADA' ? 'ENCERRADA' : recebida >= n.quantidadeNecessaria ? 'ATENDIDA' : recebida > 0 ? 'PARCIALMENTE_ATENDIDA' : 'ABERTA'
  return { ...n, situacao, categoriaNome: categoriaNome(dados, n.categoriaId), quantidadeRecebida: recebida,
    percentual: Math.round(recebida * 100 / n.quantidadeNecessaria) }
}
function doacaoPublica(dados, d) {
  return { ...d, necessidadeTitulo: dados.necessidades.find(n => n.id === d.necessidadeId)?.titulo || 'Necessidade removida',
    campanhaTitulo: null, usuarioNome: d.usuarioNome }
}
function expirar(dados) {
  let mudou = false
  for (const d of dados.doacoes) {
    if (d.situacao === 'PENDENTE' && Date.now() >= Date.parse(d.prazoAnalise)) {
      d.situacao = 'CANCELADA'; d.motivoCancelamento = 'NAO_ANALISADA_NO_PRAZO'; mudou = true
    } else if (d.situacao === 'CONFIRMADA' && Date.now() >= Date.parse(d.prazoEntrega)) {
      d.situacao = 'CANCELADA'; d.motivoCancelamento = 'PRAZO_EXPIRADO'; mudou = true
    }
  }
  if (mudou) salvar(dados)
}
function validarQuantidade(quantidade, maxima) {
  if (!Number.isInteger(Number(quantidade)) || Number(quantidade) < 1 || Number(quantidade) > maxima)
    falhar(`Informe uma quantidade de 1 a ${maxima}.`)
}

export function respostaDemonstracao(metodo, caminho, corpo) {
  const url = new URL(caminho, 'https://bemdoar.example')
  const rota = url.pathname
  const dados = ler()
  expirar(dados)

  if (rota === '/api/instituicao' && metodo === 'GET') return instituicao
  if (rota === '/api/auth/cadastro' && metodo === 'POST') {
    if (!corpo?.nome?.trim() || !corpo?.email?.trim()) falhar('Informe nome e e-mail.')
    const existente = dados.usuarios.find(u => u.email.toLowerCase() === corpo.email.trim().toLowerCase())
    if (existente) existente.nome = corpo.nome.trim()
    else dados.usuarios.push({ id: proximoId(dados), nome: corpo.nome.trim(), email: corpo.email.trim() })
    salvar(dados)
    return { mensagem: 'Conta fictícia criada.' }
  }
  if (rota === '/api/auth/login' && metodo === 'POST') {
    if (!corpo?.email?.trim() || !corpo?.senha?.trim()) falhar('Preencha e-mail e senha para entrar.')
    const cadastro = dados.usuarios.find(u => u.email.toLowerCase() === corpo.email.trim().toLowerCase())
    const nome = cadastro?.nome || corpo.email.split('@')[0].replace(/[._-]/g, ' ') || 'Visitante'
    return { token: 'TOKEN_FICTICIO_SEM_ACESSO_A_API', id: cadastro?.id || corpo.email.trim().toLowerCase(),
      nome, email: corpo.email.trim(), perfil: corpo.perfilDemo === 'ADMINISTRADOR' ? 'ADMINISTRADOR' : 'USUARIO' }
  }

  if (rota === '/api/categorias/ativas' && metodo === 'GET') return dados.categorias.filter(c => c.ativo)
  if (rota === '/api/categorias' && metodo === 'GET') { exigirAdmin(); return dados.categorias }
  if (rota === '/api/categorias' && metodo === 'POST') {
    exigirAdmin()
    if (!corpo?.nome?.trim()) falhar('Informe o nome da categoria.')
    const nova = { id: proximoId(dados), nome: corpo.nome.trim(), descricao: corpo.descricao || '', ativo: true }
    dados.categorias.push(nova); salvar(dados); return nova
  }
  const categoria = rota.match(/^\/api\/categorias\/(\d+)(?:\/(desativar|reativar))?$/)
  if (categoria) {
    exigirAdmin()
    const c = item(dados.categorias, categoria[1], 'Categoria')
    if (metodo === 'GET') return c
    if (metodo === 'PUT') { c.nome = corpo.nome?.trim() || falhar('Informe o nome.'); c.descricao = corpo.descricao || ''; salvar(dados); return c }
    if (metodo === 'PATCH') { c.ativo = categoria[2] === 'reativar'; salvar(dados); return c }
    if (metodo === 'DELETE') {
      if (dados.necessidades.some(n => n.categoriaId === c.id)) falhar('Categoria vinculada a uma necessidade.')
      dados.categorias = dados.categorias.filter(x => x.id !== c.id); salvar(dados); return null
    }
  }

  if (rota === '/api/necessidades' && metodo === 'GET') {
    const termo = (url.searchParams.get('termo') || '').toLocaleLowerCase('pt-BR')
    const lista = dados.necessidades.map(n => necessidadePublica(dados, n)).filter(n =>
      (!termo || `${n.titulo} ${n.descricao}`.toLocaleLowerCase('pt-BR').includes(termo)) &&
      (!url.searchParams.get('categoriaId') || String(n.categoriaId) === url.searchParams.get('categoriaId')) &&
      (!url.searchParams.get('prioridade') || n.prioridade === url.searchParams.get('prioridade')) &&
      (!url.searchParams.get('situacao') || n.situacao === url.searchParams.get('situacao'))
    ).sort((a,b) => b.id-a.id)
    const pagina = Math.max(Number(url.searchParams.get('pagina') || 0), 0)
    return { content: lista.slice(pagina*20, pagina*20+20), totalPages: Math.max(1, Math.ceil(lista.length/20)), number: pagina }
  }
  if (rota === '/api/necessidades' && metodo === 'POST') {
    const admin = exigirAdmin()
    if (!corpo?.titulo?.trim() || !corpo?.justificativa?.trim()) falhar('Informe título e justificativa.')
    item(dados.categorias, corpo.categoriaId, 'Categoria')
    const n = { id: proximoId(dados), titulo: corpo.titulo.trim(), descricao: corpo.descricao || '',
      categoriaId: Number(corpo.categoriaId), quantidadeNecessaria: Number(corpo.quantidadeNecessaria),
      prioridade: corpo.prioridade || 'MEDIA', situacao: 'ABERTA', dataCriacao: agora(),
      justificativa: corpo.justificativa.trim(), criadoPor: admin.nome }
    if (!Number.isInteger(n.quantidadeNecessaria) || n.quantidadeNecessaria < 1) falhar('Informe uma meta positiva.')
    dados.necessidades.push(n); evento(dados,'NECESSIDADE',n.id,'CRIACAO',n.justificativa,null,n.titulo)
    salvar(dados); return necessidadePublica(dados,n)
  }
  const necessidade = rota.match(/^\/api\/necessidades\/(\d+)(?:\/(admin|auditoria|encerrar))?$/)
  if (necessidade) {
    const n = item(dados.necessidades, necessidade[1], 'Necessidade')
    const publica = necessidadePublica(dados,n)
    if (metodo === 'GET' && !necessidade[2]) return publica
    if (metodo === 'GET' && necessidade[2] === 'admin') {
      exigirAdmin(); return { necessidade: publica, justificativa: n.justificativa,
        criadoPor: n.criadoPor, atualizadoPor: n.atualizadoPor || null, atualizadoEm: n.atualizadoEm || null }
    }
    if (metodo === 'GET' && necessidade[2] === 'auditoria') {
      exigirAdmin(); return dados.auditoria.filter(a => a.tipo === 'NECESSIDADE' && a.registroId === n.id)
    }
    if (metodo === 'PUT') {
      const admin = exigirAdmin()
      if (n.situacao === 'ENCERRADA') falhar('Necessidade encerrada não pode ser editada.')
      if (!corpo?.justificativa?.trim() || !corpo?.titulo?.trim()) falhar('Informe título e justificativa.')
      if (Number(corpo.quantidadeNecessaria) < publica.quantidadeRecebida) falhar('A meta não pode ser menor que a quantidade recebida.')
      const anterior = `${n.titulo}; meta ${n.quantidadeNecessaria}`
      Object.assign(n,{ titulo: corpo.titulo.trim(), descricao: corpo.descricao || '', categoriaId: Number(corpo.categoriaId),
        quantidadeNecessaria: Number(corpo.quantidadeNecessaria), prioridade: corpo.prioridade,
        justificativa: corpo.justificativa.trim(), atualizadoPor: admin.nome, atualizadoEm: agora() })
      evento(dados,'NECESSIDADE',n.id,'EDICAO',n.justificativa,anterior,`${n.titulo}; meta ${n.quantidadeNecessaria}`)
      salvar(dados); return necessidadePublica(dados,n)
    }
    if (metodo === 'PATCH' && necessidade[2] === 'encerrar') {
      exigirAdmin(); n.situacao = 'ENCERRADA'; evento(dados,'NECESSIDADE',n.id,'ENCERRAMENTO','Encerramento administrativo',publica.situacao,'ENCERRADA'); salvar(dados); return necessidadePublica(dados,n)
    }
    if (metodo === 'DELETE') {
      exigirAdmin()
      if (dados.doacoes.some(d => d.necessidadeId === n.id)) falhar('Esta necessidade possui doações vinculadas.')
      dados.necessidades = dados.necessidades.filter(x => x.id !== n.id); salvar(dados); return null
    }
  }

  if (rota === '/api/doacoes' && metodo === 'POST') {
    const atual = exigirLogin()
    const n = item(dados.necessidades, corpo.necessidadeId, 'Necessidade')
    if (['ATENDIDA','ENCERRADA'].includes(necessidadePublica(dados,n).situacao)) falhar('Esta necessidade não aceita novas intenções.')
    const quantidade = Number(corpo.quantidade)
    if (!Number.isInteger(quantidade) || quantidade < 1 || !corpo.item?.trim()) falhar('Informe item e quantidade positiva.')
    const registro = agora()
    const d = { id: proximoId(dados), protocolo: `BD-DEMO-${crypto.randomUUID().slice(0,8).toUpperCase()}`,
      usuarioId: atual.id, usuarioNome: atual.nome, necessidadeId: n.id, campanhaId: null,
      item: corpo.item.trim(), quantidade, quantidadePrometida: quantidade, quantidadeRecebida: null,
      observacao: corpo.observacao || '', formaEntrega: corpo.formaEntrega || 'ENTREGA_NA_INSTITUICAO',
      situacao: 'PENDENTE', dataRegistro: registro, prazoAnalise: dataMaisDias(registro,3), prazoEntrega: null,
      dataConfirmacao: null, dataRecebimento: null, motivoCancelamento: null, responsavelRecebimento: null }
    dados.doacoes.push(d); salvar(dados); return doacaoPublica(dados,d)
  }
  if (rota === '/api/doacoes/minhas' && metodo === 'GET') {
    const atual = exigirLogin()
    return dados.doacoes.filter(d => String(d.usuarioId) === String(atual.id)).reverse().map(d => doacaoPublica(dados,d))
  }
  if (rota === '/api/doacoes' && metodo === 'GET') {
    exigirAdmin()
    return dados.doacoes.filter(d => !url.searchParams.get('situacao') || d.situacao === url.searchParams.get('situacao'))
      .reverse().map(d => doacaoPublica(dados,d))
  }
  const protocolo = rota.match(/^\/api\/doacoes\/protocolo\/(.+)$/)
  if (protocolo && metodo === 'GET') {
    exigirAdmin()
    const d = dados.doacoes.find(x => x.protocolo.toUpperCase() === decodeURIComponent(protocolo[1]).toUpperCase()) || falhar('Protocolo não encontrado.')
    return doacaoPublica(dados,d)
  }
  const doacao = rota.match(/^\/api\/doacoes\/(\d+)(?:\/(auditoria|confirmar|receber|retificar|anular|cancelar))?$/)
  if (doacao) {
    const d = item(dados.doacoes, doacao[1], 'Doação')
    if (metodo === 'GET' && doacao[2] === 'auditoria') {
      exigirAdmin(); return dados.auditoria.filter(a => a.tipo === 'DOACAO' && a.registroId === d.id)
    }
    if (metodo === 'GET' && !doacao[2]) {
      const atual = exigirLogin()
      if (atual.perfil !== 'ADMINISTRADOR' && String(atual.id) !== String(d.usuarioId)) falhar('Esta doação pertence a outra conta.')
      return doacaoPublica(dados,d)
    }
    if (metodo === 'PATCH') {
      const atual = exigirLogin()
      if (doacao[2] !== 'cancelar') exigirAdmin()
      if (doacao[2] === 'confirmar') {
        if (d.situacao !== 'PENDENTE') falhar('Esta intenção não está pendente.')
        d.situacao = 'CONFIRMADA'; d.dataConfirmacao = agora(); d.prazoEntrega = dataMaisDias(d.dataConfirmacao,15)
      } else if (doacao[2] === 'receber') {
        if (d.situacao !== 'CONFIRMADA') falhar('Confirme a intenção antes do recebimento.')
        if (!corpo?.itemConfere) falhar('O item deve corresponder ao prometido.')
        validarQuantidade(corpo.quantidadeRecebida,d.quantidadePrometida)
        d.quantidadeRecebida = Number(corpo.quantidadeRecebida); d.situacao = 'RECEBIDA'
        d.dataRecebimento = agora(); d.responsavelRecebimento = atual.nome
        evento(dados,'DOACAO',d.id,'RECEBIMENTO','Entrega física demonstrativa',null,d.quantidadeRecebida)
      } else if (doacao[2] === 'retificar') {
        if (d.situacao !== 'RECEBIDA') falhar('Somente recebimentos podem ser corrigidos.')
        validarQuantidade(corpo.quantidadeRecebida,d.quantidadePrometida)
        if (!corpo?.justificativa?.trim()) falhar('Informe a justificativa.')
        const anterior = d.quantidadeRecebida
        d.quantidadeRecebida = Number(corpo.quantidadeRecebida)
        evento(dados,'DOACAO',d.id,'RETIFICACAO',corpo.justificativa,anterior,d.quantidadeRecebida)
      } else if (doacao[2] === 'anular') {
        if (d.situacao !== 'RECEBIDA' || !corpo?.justificativa?.trim()) falhar('Informe uma justificativa para anular o recebimento.')
        d.situacao = 'CANCELADA'; d.motivoCancelamento = 'RECEBIMENTO_INDEVIDO'
        evento(dados,'DOACAO',d.id,'ANULACAO',corpo.justificativa,d.quantidadeRecebida,0)
      } else if (doacao[2] === 'cancelar') {
        if (atual.perfil !== 'ADMINISTRADOR' && String(atual.id) !== String(d.usuarioId)) falhar('Esta doação pertence a outra conta.')
        if (!['PENDENTE','CONFIRMADA'].includes(d.situacao)) falhar('Esta intenção não pode ser cancelada.')
        d.situacao = 'CANCELADA'; d.motivoCancelamento = corpo?.motivo || 'CANCELADA_PELO_TITULAR'
      } else falhar('Operação indisponível nesta demonstração.')
      salvar(dados); return doacaoPublica(dados,d)
    }
  }
  falhar('Página indisponível nesta demonstração.')
}

export function reiniciarDemonstracao() { localStorage.removeItem(CHAVE) }
