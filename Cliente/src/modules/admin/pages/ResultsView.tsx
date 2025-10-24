import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../../api/axios'
import { Alert, Card, Spinner, Table } from 'react-bootstrap'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LabelList
} from 'recharts'

interface CandidateResult {
  nombre: string
  votos: number
}

export default function ResultsView() {
  const { id } = useParams()
  const [data, setData] = useState<CandidateResult[]>([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get(`/campaigns/${id}`)
        const results: CandidateResult[] = (res.data.candidates ?? []).map(
          (c: any, i: number): CandidateResult => ({
            nombre: String(c.nombre || `Candidato ${i + 1}`),
            votos: Number(c.votos ?? 0)
          })
        )

        setData(results)

        if (results.length) {
          const max = Math.max(...results.map((r) => r.votos))
          const winners = results.filter((r) => r.votos === max)
          setMsg(
            winners.length > 1
              ? `Empate entre: ${winners.map((w) => w.nombre).join(', ')}`
              : `Ganador: ${winners[0].nombre} (${max} votos)`
          )
        } else {
          setMsg('No hay votos registrados.')
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return <Spinner animation="border" />

  return (
    <Card>
      <Card.Body>
        <h4>Resultados de la campaña</h4>
        {msg && <Alert variant="info">{msg}</Alert>}

        {/* Tabla de resultados */}
        <Table bordered hover responsive>
          <thead>
            <tr>
              <th>Candidato</th>
              <th>Votos</th>
            </tr>
          </thead>
          <tbody>
            {data.map((r, i) => (
              <tr key={`${r.nombre}-${i}`}>
                <td>{r.nombre}</td>
                <td>{r.votos}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Gráfico de barras */}
        <div style={{ width: '100%', height: 350, minHeight: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nombre" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="votos" fill="#007bff">
                <LabelList dataKey="votos" position="top" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card.Body>
    </Card>
  )
}
