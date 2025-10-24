import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../../api/axios'
import { Badge, Spinner, Table, Button, ButtonGroup } from 'react-bootstrap'
import { Link } from 'react-router-dom'

interface Campaign {
  id: string
  titulo: string
  estado: 'enabled' | 'disabled' | 'closed'
  votes_per_user: number
  fecha_inicio?: string | null
  fecha_fin?: string | null
}

export default function CampaignList() {
  const qc = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => (await api.get<Campaign[]>('/campaigns')).data
  })

const patchState = useMutation({
  mutationFn: async ({ id, estado }: { id: string; estado: Campaign['estado'] }) =>
    api.patch(`/campaigns/${id}`, { estado }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`
      }
    }),
  onSuccess: () => qc.invalidateQueries({ queryKey: ['campaigns'] })
})


  function renderEstado(e: Campaign['estado']) {
    const map: Record<Campaign['estado'], string> = {
      enabled: 'success',
      disabled: 'warning',
      closed: 'secondary'
    }
    return <Badge bg={map[e]}>{e}</Badge>
  }

  if (isLoading) return <Spinner animation="border" />
  if (error) return <p>Error al cargar campañas</p>

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Campañas</h4>
        <Link to="/admin/campaigns/new" className="btn btn-primary">Nueva campaña</Link>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Estado</th>
            <th>Votos/usuario</th>
            <th>Inicio</th>
            <th>Fin</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data?.map(c => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.titulo}</td>
              <td>{renderEstado(c.estado)}</td>
              <td>{c.votes_per_user}</td>
              <td>{c.fecha_inicio ? new Date(c.fecha_inicio).toLocaleString() : '-'}</td>
              <td>{c.fecha_fin ? new Date(c.fecha_fin).toLocaleString() : '-'}</td>
              <td className="text-nowrap">
                <Link to={`/admin/campaigns/${c.id}/edit`} className="btn btn-outline-primary btn-sm me-2">
                  Editar
                </Link>
                <Link to={`/admin/campaigns/${c.id}/candidates`} className="btn btn-outline-success btn-sm me-2">
                  Candidatos
                </Link>
                <Link to={`/admin/campaigns/${c.id}/results`} className="btn btn-outline-dark btn-sm me-3">
                  Resultados
                </Link>

                <ButtonGroup size="sm">
                  <Button
                    variant="success"
                    disabled={c.estado === 'enabled' || patchState.isPending}
                    onClick={() => patchState.mutate({ id: c.id, estado: 'enabled' })}
                  >
                    Habilitar
                  </Button>
                  <Button
                    variant="warning"
                    disabled={c.estado === 'disabled' || patchState.isPending}
                    onClick={() => patchState.mutate({ id: c.id, estado: 'disabled' })}
                  >
                    Deshabilitar
                  </Button>
                  <Button
                    variant="secondary"
                    disabled={c.estado === 'closed' || patchState.isPending}
                    onClick={() => {
                      if (confirm('¿Cerrar campaña? No permitirá más votos.')) {
                        patchState.mutate({ id: c.id, estado: 'closed' })
                      }
                    }}
                  >
                    Cerrar
                  </Button>
                </ButtonGroup>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  )
}
