import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

function NavbarComponent() {
  return (
    <Navbar expand="lg" style={{ backgroundColor: "#FF8C42" }}>
      <Navbar.Brand as={Link} to="/" className="text-white ms-3">
        Sitio de Cursos
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="navbar-nav" />
      <Navbar.Collapse id="navbar-nav">
        <Nav className="ms-auto me-3">
          <Nav.Link as={Link} to="/curso1" className="text-white">Programación I</Nav.Link>
          <Nav.Link as={Link} to="/curso2" className="text-white">Bases de Datos</Nav.Link>
          <Nav.Link as={Link} to="/curso3" className="text-white">Arquitectura</Nav.Link>
          <Nav.Link as={Link} to="/curso4" className="text-white">Física I</Nav.Link>
          <Nav.Link as={Link} to="/curso5" className="text-white">Redes</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavbarComponent;
