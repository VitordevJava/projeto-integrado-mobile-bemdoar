import { NavLink } from 'react-router-dom'
import { usuarioLogado, ehAdministrador } from '../servicos/auth'
import Icone from './Icone'

export default function BottomNav() {
  const usuario = usuarioLogado()
  const admin = ehAdministrador()
  const itens = [
    ['/', 'inicio', 'Inicio'],
    ['/necessidades', 'necessidades', 'Necessidades'],
    [admin ? '/admin/doacoes' : usuario ? '/minhas-doacoes' : '/login', 'doar', admin ? 'Gestao' : 'Doacoes'],
    [usuario ? '/minhas-doacoes' : '/cadastro', 'usuario', usuario ? 'Minha conta' : 'Cadastro']
  ]
  return <nav className="bottom-nav" aria-label="Navegacao mobile">{itens.map(([rota, icone, texto]) => <NavLink key={texto} to={rota} end={rota === '/'}><Icone nome={icone} /><span>{texto}</span></NavLink>)}</nav>
}
