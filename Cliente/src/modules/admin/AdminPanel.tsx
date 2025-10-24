import { Container, Row, Col } from 'react-bootstrap'
import { Navigate, Route, Routes } from 'react-router-dom'
import SidebarMenu from './SidebarMenu'
import CampaignList from './pages/CampaignList'
import CampaignForm from './pages/CampaignForm'
import CandidateAssign from './pages/CandidateAssign'
import ResultsView from './pages/ResultsView'
import Reports from './pages/Reports'

export default function AdminPanel() {
  return (
    <Container fluid className="mt-4">
      <Row>
        {/* Sidebar */}
        <Col
          md={3}
          lg={2}
          className="mb-3"
        >
          <SidebarMenu />
        </Col>

        {/* Contenido principal */}
        <Col md={9} lg={10}>
          <Routes>
            {/* Listar campañas */}
            <Route path="/" element={<CampaignList />} />

            {/* Crear o editar campaña */}
            <Route path="campaigns/new" element={<CampaignForm />} />
            <Route path="campaigns/:id/edit" element={<CampaignForm />} />

            {/* Candidatos y resultados */}
            <Route path="campaigns/:id/candidates" element={<CandidateAssign />} />
            <Route path="campaigns/:id/results" element={<ResultsView />} />

            {/* Reportes */}
            <Route path="reports" element={<Reports />} />

            {/* Redirección por defecto */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Col>
      </Row>
    </Container>
  )
}
