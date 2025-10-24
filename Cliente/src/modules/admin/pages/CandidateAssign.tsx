import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../../api/axios'
import { Alert, Button, Card, Form, Spinner, Table } from 'react-bootstrap'

interface User {
  id: string
  nombre: string
  colegiado: string
  dpi: string
}

interface Candidate {
  id: string
  user_id: string
  nombre: string
  colegiado: string
  bio?: string | null
}

export default function CandidateAssign() {
  const { id: campaignId } = useParams()
  const [users, setUsers] = useState<User[]>([])
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [selected, setSelected] = useState('')
  const [bio, setBio] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  async function loadAll() {
    const [usr, cand] = await Promise.all([
      api.get<User[]>('/auth/users?voter=true').catch(() => ({ data: [] })),
      api.get<Candidate[]>(`/campaigns/${campaignId}/candidates`)
    ])
    setUsers(usr.data)
    setCandidates(cand.data)
  }

  useEffect(() => {
    loadAll()
  }, [])

  async function addCandidate() {
    if (!selected) return
    setLoading(true)
    try {
      await api.post(`/campaigns/${campaignId}/candidates`, { user_id: selected, bio })
      setMsg('Candidato agregado correctamente')
      setSelected('')
      setBio('')
      await loadAll()
    } catch (e: any) {
      setMsg(e?.response?.data?.message ?? 'Error al agregar candidato')
    } finally {
      setLoading(false)
    }
  }

  async function removeCandidate(id: string) {
    if (!confirm('¿Eliminar candidato?')) return
    await api.delete(`/campaigns/${campaignId}/candidates/${id}`)
    await loadAll()
  }

  return (
    <Card>
      <Card.Body>
        <h4>Asignar candidatos</h4>
        {msg && <Alert variant="info">{msg}</Alert>}

        <Form className="d-flex gap-2 align-items-end mb-4" onSubmit={e => { e.preventDefault(); addCandidate() }}>
          <Form.Group className="flex-grow-1">
            <Form.Label>Seleccionar usuario</Form.Label>
            <Form.Select value={selected} onChange={e => setSelected(e.target.value)} required>
              <option value="">-- Elige un usuario votante --</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>
                  {u.nombre} ({u.colegiado})
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="flex-grow-1">
            <Form.Label>Biografía</Form.Label>
            <Form.Control value={bio} onChange={e => setBio(e.target.value)} placeholder="Ej. Trayectoria o lema" required />
          </Form.Group>
          <Button type="submit" disabled={loading}>
            {loading ? <Spinner size="sm" /> : 'Agregar'}
          </Button>
        </Form>

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Colegiado</th>
              <th>Biografía</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((c, i) => (
              <tr key={c.id}>
                <td>{i + 1}</td>
                <td>{c.nombre}</td>
                <td>{c.colegiado}</td>
                <td>{c.bio ?? '-'}</td>
                <td>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => removeCandidate(c.id)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  )
}
