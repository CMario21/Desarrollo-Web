import { Container, Navbar, Nav } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const nav = useNavigate()
  return (
    <>
      <Navbar bg="dark" variant="dark" expand="sm">
        <Container>
          <Navbar.Brand as={Link} to="/">Votaciones</Navbar.Brand>
          <Nav className="ms-auto">
            {!user && <Nav.Link as={Link} to="/login">Login</Nav.Link>}
            {!user && <Nav.Link as={Link} to="/register">Register</Nav.Link>}
            {user && <Navbar.Text className="me-3">Hola, {user.nombre}</Navbar.Text>}
            {user && <Nav.Link onClick={() => { logout(); nav('/login') }}>Salir</Nav.Link>}
          </Nav>
        </Container>
      </Navbar>
      <Container className="py-4">{children}</Container>
    </>
  )
}
