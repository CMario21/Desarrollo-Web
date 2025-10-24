import { useState } from 'react'
import { Alert, Button, Card, Col, Container, Form, Row, Spinner } from 'react-bootstrap'
import api from '../../api/axios'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const nav = useNavigate()
  const [form, setForm] = useState({
    colegiado: '',
    dpi: '',
    nombre: '',
    email: '',
    fecha_nacimiento: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ok, setOk] = useState<string | null>(null)

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm(prev => ({ ...prev, [k]: v }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setOk(null)
    setLoading(true)
    try {
      await api.post('/auth/register', form)
      setOk('Usuario registrado correctamente. Ahora puedes iniciar sesión.')
      setTimeout(() => nav('/login'), 1200)
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Error al registrar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '95vh' }}>
      <Row className="w-100 justify-content-center">
        <Col md={10} lg={8}>
          <Card className="shadow-lg border-0 p-3" style={{ borderRadius: '1rem' }}>
            <Card.Body>
              <h3 className="mb-4 text-center fw-bold text-success">Crear cuenta</h3>
              {error && <Alert variant="danger">{error}</Alert>}
              {ok && <Alert variant="success">{ok}</Alert>}

              <Form onSubmit={onSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Colegiado</Form.Label>
                      <Form.Control
                        value={form.colegiado}
                        onChange={e => set('colegiado', e.target.value)}
                        required
                        placeholder="Ej. V-001"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>DPI</Form.Label>
                      <Form.Control
                        value={form.dpi}
                        onChange={e => set('dpi', e.target.value.slice(0, 13))} // máx 13
                        required
                        minLength={13}
                        maxLength={13}
                        placeholder="13 dígitos"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Nombre completo</Form.Label>
                  <Form.Control
                    value={form.nombre}
                    onChange={e => set('nombre', e.target.value)}
                    required
                    placeholder="Tu nombre completo"
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        value={form.email}
                        onChange={e => set('email', e.target.value)}
                        required
                        placeholder="ejemplo@correo.com"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Fecha de nacimiento</Form.Label>
                      <Form.Control
                        type="date"
                        value={form.fecha_nacimiento}
                        onChange={e => set('fecha_nacimiento', e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    value={form.password}
                    onChange={e => set('password', e.target.value)}
                    required
                    minLength={6}
                    placeholder="Mínimo 6 caracteres"
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button type="submit" size="lg" variant="success" disabled={loading}>
                    {loading ? <Spinner size="sm" /> : 'Registrar'}
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
