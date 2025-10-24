import { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import {
  Row, Col, Card, Badge, Button, Modal, ListGroup, Spinner, Alert
} from 'react-bootstrap'
import api from '../../api/axios'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList
} from 'recharts'

type Campaign = {
  id: string | number
  titulo: string
  descripcion?: string | null
  estado: 'enabled' | 'disabled' | 'closed'
  fecha_inicio?: string | null
  fecha_fin?: string | null
  votes_per_user?: number
}

type ResultRow = {
  candidateId?: string | number
  nombre: string
  votos: number
}

type CandidateRow = {
  id: string | number
  user_id: string | number
  nombre: string
  bio?: string | null
}

type EnrichedCandidate = {
  candidateId: string | number
  nombre: string
  bio?: string | null
  votos: number
}

function computeClosed(c: Campaign, now = dayjs()): boolean {
  // Cerrada si el backend ya la marcó closed o si ya pasó fecha_fin
  const backendClosed = c.estado === 'closed'
  const timeClosed = !!c.fecha_fin && now.isAfter(dayjs(c.fecha_fin))
  return backendClosed || timeClosed
}
function computeActive(c: Campaign, now = dayjs()): boolean {
  if (c.estado !== 'enabled') return false
  const startOk = !c.fecha_inicio || now.isAfter(dayjs(c.fecha_inicio)) || now.isSame(dayjs(c.fecha_inicio), 'minute')
  const endOk   = !c.fecha_fin || now.isBefore(dayjs(c.fecha_fin)) || now.isSame(dayjs(c.fecha_fin), 'minute')
  return startOk && endOk
}

export default function VoterHome() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [campaigns, setCampaigns] = useState<Campaign[]>([])

  // modal
  const [show, setShow] = useState(false)
  const [current, setCurrent] = useState<Campaign | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [voteMsg, setVoteMsg] = useState<string | null>(null)

  // detalle combinado
  const [votesPerUser, setVotesPerUser] = useState<number>(1)
  const [enriched, setEnriched] = useState<EnrichedCandidate[]>([])

  // cargar campañas (activa o cerrada). se ocultan las disabled
  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        setError(null)
        const { data } = await api.get('/campaigns')
        const now = dayjs()

        const visibles: Campaign[] = (data as Campaign[])
          .filter(c => c.estado !== 'disabled') // ocultamos disabled
          .map(c => ({
            ...c,
            id: typeof c.id === 'bigint' ? String(c.id) : c.id
          }))
          // mostramos activas (enabled en rango) y también cerradas (por tiempo o estado)
          .filter(c => computeActive(c, now) || computeClosed(c, now))

        setCampaigns(visibles)
      } catch (e: any) {
        setError(e?.response?.data?.message || 'No se pudieron cargar las campañas')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  // abrir modal y cargar detalle (resultados + candidatos con bio)
  async function openCampaign(camp: Campaign) {
    setCurrent(camp)
    setVoteMsg(null)
    setShow(true)
    setDetailLoading(true)
    try {
      // resultados con votos
      const res1 = await api.get(`/campaigns/${camp.id}`)
      const results: ResultRow[] = (res1.data?.candidates ?? []).map((r: any, i: number) => ({
        candidateId: r?.candidateId ?? r?.id ?? i, // fallback
        nombre: String(r?.nombre ?? `Candidato ${i + 1}`),
        votos: Number(r?.votos ?? 0),
      }))
      setVotesPerUser(Number(res1.data?.votes_per_user ?? camp.votes_per_user ?? 1))

      // datos de candidatos (bio, user_id, etc.)
      const res2 = await api.get(`/campaigns/${camp.id}/candidates`)
      const candList: CandidateRow[] = (res2.data ?? []).map((c: any) => ({
        id: c?.id ?? c?.candidateId ?? c?.user_id ?? '',
        user_id: c?.user_id,
        nombre: String(c?.nombre ?? ''),
        bio: c?.bio ?? null,
      }))

      // index para fusionar por candidateId y como respaldo por nombre
      const byId = new Map<string | number, CandidateRow>()
      candList.forEach(c => byId.set(c.id, c))
      const byName = new Map<string, CandidateRow>()
      candList.forEach(c => byName.set(c.nombre.toLowerCase(), c))

      const merged: EnrichedCandidate[] = results.map(r => {
        let found: CandidateRow | undefined
        if (r.candidateId !== undefined) {
          found = byId.get(r.candidateId)
        }
        if (!found) {
          found = byName.get(r.nombre.toLowerCase())
        }
        return {
          candidateId: (r.candidateId ?? found?.id ?? r.nombre),
          nombre: r.nombre,
          votos: r.votos,
          bio: found?.bio ?? null,
        }
      })

      setEnriched(merged)
    } catch (e: any) {
      setVoteMsg(e?.response?.data?.message || 'No se pudo cargar el detalle de la campaña')
    } finally {
      setDetailLoading(false)
    }
  }

  function closeModal() {
    setShow(false)
    setCurrent(null)
    setEnriched([])
    setVoteMsg(null)
  }

  // votar y refrescar resultados (bloqueado si está cerrada)
  async function votar(candidateId: string | number) {
    if (!current) return
    if (computeClosed(current)) {
      setVoteMsg('❌ La campaña está cerrada.')
      return
    }
    setVoteMsg(null)
    setDetailLoading(true)
    try {
      await api.post(`/campaigns/${current.id}/votes`, { candidateId })
      setVoteMsg('✅ ¡Voto registrado!')
      // refrescar resultados tras votar
      await openCampaign(current)
    } catch (e: any) {
      const msg = e?.response?.data?.message || 'No se pudo registrar el voto'
      setVoteMsg(`❌ ${msg}`)
    } finally {
      setDetailLoading(false)
    }
  }

  const chartData = useMemo(() => {
    return enriched.map(e => ({ nombre: e.nombre, votos: e.votos }))
  }, [enriched])

  // ganador/empate (para mostrar en modal cuando esté cerrada)
  const winnerText = useMemo(() => {
    if (!enriched.length) return 'Sin votos'
    const max = Math.max(...enriched.map(e => e.votos))
    const winners = enriched.filter(e => e.votos === max)
    if (max === 0) return 'Sin votos'
    if (winners.length > 1) return `Empate: ${winners.map(w => w.nombre).join(', ')}`
    return `Ganador: ${winners[0].nombre} (${max} votos)`
  }, [enriched])

  if (loading) {
    return (
      <div className="d-flex justify-content-center p-5">
        <Spinner animation="border" />
      </div>
    )
  }

  if (error) {
    return <Alert variant="danger" className="m-3">{error}</Alert>
  }

  return (
    <>
      {/* GRID DE CAMPAÑAS */}
      <Row className="g-3">
        {campaigns.length === 0 && (
          <Col xs={12}>
            <Alert variant="info" className="mb-0">
              No hay campañas disponibles en este momento.
            </Alert>
          </Col>
        )}

        {campaigns.map(c => {
          const isClosed = computeClosed(c)
          const badgeColor = isClosed ? 'secondary' : 'success'
          const badgeText  = isClosed ? 'closed' : 'enabled'
          return (
            <Col key={String(c.id)} xs={12} sm={6} lg={4}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Card.Title className="mb-0">{c.titulo}</Card.Title>
                    <Badge bg={badgeColor}>{badgeText}</Badge>
                  </div>
                  {c.descripcion && <Card.Text className="text-muted">{c.descripcion}</Card.Text>}

                  <div className="small text-muted mb-3">
                    {c.fecha_inicio && <>Inicio: {dayjs(c.fecha_inicio).format('YYYY-MM-DD HH:mm')}<br/></>}
                    {c.fecha_fin && <>Fin: {dayjs(c.fecha_fin).format('YYYY-MM-DD HH:mm')}</>}
                    {isClosed && <div className="mt-2"><Badge bg="dark">Campaña cerrada</Badge></div>}
                  </div>

                  <Button variant="primary" onClick={() => openCampaign(c)}>
                    {isClosed ? 'Ver resultados' : 'Ver candidatos'}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          )
        })}
      </Row>

      {/* MODAL DETALLE DE CAMPAÑA */}
      <Modal show={show} onHide={closeModal} size="lg" centered scrollable>
        <Modal.Header closeButton>
          <Modal.Title>
            {current?.titulo}{' '}
            {current && !computeClosed(current) && (current?.votes_per_user || votesPerUser) ? (
              <Badge bg="info" className="ms-2">
                Votos por usuario: {current?.votes_per_user ?? votesPerUser}
              </Badge>
            ) : null}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {current && computeClosed(current) && (
            <Alert variant="secondary" className="mb-3">
              Esta campaña está <strong>cerrada</strong>. Solo puedes ver los resultados.
            </Alert>
          )}

          {voteMsg && (
            <Alert variant={voteMsg.startsWith('✅') ? 'success' : 'danger'}>
              {voteMsg}
            </Alert>
          )}

          {detailLoading && (
            <div className="d-flex justify-content-center p-3">
              <Spinner animation="border" />
            </div>
          )}

          {!detailLoading && (
            <>
              {!current || !computeClosed(current) ? (
                <>
                  <h6 className="mb-2">Candidatos</h6>
                  <ListGroup className="mb-3">
                    {enriched.length === 0 && (
                      <ListGroup.Item>No hay candidatos disponibles.</ListGroup.Item>
                    )}
                    {enriched.map((c, i) => (
                      <ListGroup.Item
                        key={`${c.candidateId}-${i}`}
                        className="d-flex justify-content-between align-items-start"
                      >
                        <div className="me-3">
                          <div className="fw-bold">{c.nombre}</div>
                          {c.bio && <div className="text-muted small">{c.bio}</div>}
                          <div className="small">Votos actuales: <strong>{c.votos}</strong></div>
                        </div>
                        <div>
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => votar(c.candidateId)}
                          >
                            Votar
                          </Button>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </>
              ) : (
                <>
                  <h6 className="mb-2">Resultados</h6>
                  <Alert variant="info">{winnerText}</Alert>
                </>
              )}

              <h6 className="mb-2">Gráfico de votos</h6>
              <div style={{ width: '100%', height: 320, minHeight: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nombre" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="votos" fill="#0d6efd">
                      <LabelList dataKey="votos" position="top" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>Cerrar</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
