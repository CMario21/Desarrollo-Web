import { useState } from 'react'
import { Alert, Button, Card, Col, Container, Form, Row, Spinner } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const [colegiado, setColegiado] = useState('')
  const [dpi, setDpi] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login({ colegiado, dpi, password })
      nav('/')
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Credenciales inválidas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '90vh' }}>
      <Row className="w-100 justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-lg border-0 p-3" style={{ borderRadius: '1rem' }}>
            <Card.Body>
              <h3 className="mb-4 text-center fw-bold text-primary">Iniciar sesión</h3>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Colegiado</Form.Label>
                  <Form.Control
                    value={colegiado}
                    onChange={e => setColegiado(e.target.value)}
                    required
                    placeholder="Ej. V-001"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>DPI</Form.Label>
                  <Form.Control
                    value={dpi}
                    onChange={e => setDpi(e.target.value.slice(0, 13))} // máximo 13
                    required
                    minLength={13}
                    maxLength={13}
                    placeholder="13 dígitos"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="Mínimo 6 caracteres"
                  />
                </Form.Group>
                <div className="d-grid">
                  <Button type="submit" size="lg" disabled={loading}>
                    {loading ? <Spinner size="sm" /> : 'Entrar'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}
