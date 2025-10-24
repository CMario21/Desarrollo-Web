import { useEffect, useState } from 'react'
import api from '../../../api/axios'
import { Card, Spinner, Table } from 'react-bootstrap'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

interface ReportItem {
  id: string
  titulo: string
  totalVotos: number
  ganador?: string
  empate?: boolean
}

interface CandidateResult {
  nombre: string
  votos: number
}

export default function Reports() {
  const [data, setData] = useState<ReportItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: campaigns } = await api.get('/campaigns')
      const enriched: ReportItem[] = await Promise.all(
        (campaigns as any[]).map(async (c: any): Promise<ReportItem> => {
          const res = await api.get(`/campaigns/${c.id}`)
          const candidates: CandidateResult[] = (res.data?.candidates ?? []).map(
            (r: any, idx: number): CandidateResult => ({
              nombre: String(r?.nombre ?? `Candidato ${idx + 1}`),
              votos: Number(r?.votos ?? 0),
            })
          )

          const total = candidates.reduce(
            (acc: number, cur: CandidateResult) => acc + cur.votos,
            0
          )

          const max =
            candidates.length > 0
              ? Math.max(...candidates.map((r: CandidateResult) => r.votos))
              : 0

          const winners = candidates.filter(
            (r: CandidateResult) => r.votos === max
          )

          let ganador: string | undefined = undefined
          let empate = false

          if (total === 0) {
            // sin votos
          } else if (winners.length > 1) {
            empate = true
          } else if (winners.length === 1) {
            ganador = winners[0].nombre || '—'
          }

          return {
            id: String(c.id),
            titulo: String(c.titulo ?? 'Campaña'),
            totalVotos: total,
            ganador,
            empate,
          }
        })
      )
      setData(enriched)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <Spinner animation="border" />

  const pieData: { name: string; value: number }[] = data.map((d: ReportItem) => ({
    name: d.titulo,
    value: d.totalVotos,
  }))

  const COLORS = ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6610f2', '#20c997']

  return (
    <Card>
      <Card.Body>
        <h4>Reporte general de votaciones</h4>

        <Table bordered hover responsive>
          <thead>
            <tr>
              <th>Campaña</th>
              <th>Total de votos</th>
              <th>Ganador / Empate</th>
            </tr>
          </thead>
          <tbody>
            {data.map((c: ReportItem) => (
              <tr key={c.id}>
                <td>{c.titulo}</td>
                <td>{c.totalVotos}</td>
                <td>
                  {c.totalVotos === 0
                    ? 'Sin votos'
                    : c.empate
                    ? 'Empate'
                    : c.ganador ?? '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                dataKey="value"
                data={pieData}
                nameKey="name"
                // 🔧 Tipado correcto del label
                label={(props) => props.name ?? ''}
                outerRadius={120}
              >
                {pieData.map((_, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card.Body>
    </Card>
  )
}
