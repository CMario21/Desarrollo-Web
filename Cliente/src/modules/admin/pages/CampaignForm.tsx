import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Alert, Button, Card, Form, Spinner, Row, Col } from 'react-bootstrap'
import api from '../../../api/axios'

type Estado = 'enabled' | 'disabled' | 'closed'

function toInputDT(iso?: string | null) {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = (n: number) => n.toString().padStart(2, '0')
  const yyyy = d.getFullYear()
  const mm = pad(d.getMonth() + 1)
  const dd = pad(d.getDate())
  const hh = pad(d.getHours())
  const mi = pad(d.getMinutes())
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`
}

function fromInputDT(v: string) {
  return v ? new Date(v).toISOString() : null
}

export default function CampaignForm() {
  const { id } = useParams()
  const nav = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    votes_per_user: 1,
    allow_duplicate_candidate_votes: false,
    estado: 'disabled' as Estado,
    fecha_inicio: '' as string, // datetime-local
    fecha_fin: '' as string     // datetime-local
  })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    if (isEdit) {
      setLoading(true)
      api.get(`/campaigns/${id}`)
        .then(r => {
          const c = r.data
          setForm({
            titulo: c.titulo ?? '',
            descripcion: c.descripcion ?? '',
            votes_per_user: c.votes_per_user ?? 1,
            allow_duplicate_candidate_votes: c.allow_duplicate_candidate_votes ?? false,
            estado: c.estado as Estado,
            fecha_inicio: toInputDT(c.fecha_inicio),
            fecha_fin: toInputDT(c.fecha_fin),
          })
        })
        .catch(() => setErr('Error al cargar campaña'))
        .finally(() => setLoading(false))
    }
  }, [id, isEdit])

  function set<K extends keyof typeof form>(k: K, v: any) {
    setForm(p => ({ ...p, [k]: v }))
  }

    async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErr(null)
    setMsg(null)

    // Validar fechas (inicio < fin)
    if (form.fecha_inicio && form.fecha_fin) {
        const ini = new Date(form.fecha_inicio).getTime()
        const fin = new Date(form.fecha_fin).getTime()
        if (ini > fin) {
        setErr('La fecha de inicio no puede ser mayor que la fecha de finalización')
        setLoading(false)
        return
        }
    }
    try {
      const payload = {
        titulo: form.titulo,
        descripcion: form.descripcion || undefined,
        votes_per_user: Number(form.votes_per_user),
        allow_duplicate_candidate_votes: form.allow_duplicate_candidate_votes,
        estado: form.estado,
        // el backend acepta strings ISO; enviamos null si no hay fecha
        fecha_inicio: fromInputDT(form.fecha_inicio) ?? undefined,
        fecha_fin: fromInputDT(form.fecha_fin) ?? undefined,
      }

      if (isEdit) await api.patch(`/campaigns/${id}`, payload)
      else await api.post('/campaigns', payload)

      setMsg('Guardado correctamente')
      setTimeout(() => nav('/admin'), 800)
    } catch (e: any) {
      setErr(e?.response?.data?.message ?? 'Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <Card.Body>
        <h4 className="mb-3">{isEdit ? 'Editar campaña' : 'Nueva campaña'}</h4>
        {msg && <Alert variant="success">{msg}</Alert>}
        {err && <Alert variant="danger">{err}</Alert>}

        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Título</Form.Label>
            <Form.Control value={form.titulo} onChange={e => set('titulo', e.target.value)} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={form.descripcion}
              onChange={e => set('descripcion', e.target.value)}
            />
          </Form.Group>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Votos por usuario</Form.Label>
                <Form.Control
                  type="number"
                  min={1}
                  value={form.votes_per_user}
                  onChange={e => set('votes_per_user', Number(e.target.value))}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Estado</Form.Label>
                <Form.Select
                  value={form.estado}
                  onChange={e => set('estado', e.target.value as Estado)}
                >
                  <option value="disabled">disabled</option>
                  <option value="enabled">enabled</option>
                  <option value="closed">closed</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4} className="d-flex align-items-center">
              <Form.Check
                type="switch"
                id="allow-dup"
                label="Permitir votos duplicados al mismo candidato"
                checked={form.allow_duplicate_candidate_votes}
                onChange={e => set('allow_duplicate_candidate_votes', e.target.checked)}
              />
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Fecha de inicio</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={form.fecha_inicio}
                  onChange={e => set('fecha_inicio', e.target.value)}
                />
                <Form.Text>Opcional.</Form.Text>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Fecha de fin</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={form.fecha_fin}
                  onChange={e => set('fecha_fin', e.target.value)}
                />
                <Form.Text>Opcional.</Form.Text>
              </Form.Group>
                {form.fecha_inicio && form.fecha_fin && new Date(form.fecha_inicio) > new Date(form.fecha_fin) && (
                <Form.Text className="text-danger">
                    La fecha de inicio no puede ser mayor que la de finalización.
                </Form.Text>
                )}
            </Col>
          </Row>

          <Button type="submit" disabled={loading}>
            {loading ? <Spinner size="sm" /> : 'Guardar'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  )
}
