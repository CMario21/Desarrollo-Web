import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import api from '../../../api/axios';
import { Card, Spinner, Table } from 'react-bootstrap';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
export default function Reports() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function load() {
            const { data: campaigns } = await api.get('/campaigns');
            const enriched = await Promise.all(campaigns.map(async (c) => {
                const res = await api.get(`/campaigns/${c.id}`);
                const candidates = (res.data?.candidates ?? []).map((r, idx) => ({
                    nombre: String(r?.nombre ?? `Candidato ${idx + 1}`),
                    votos: Number(r?.votos ?? 0),
                }));
                const total = candidates.reduce((acc, cur) => acc + cur.votos, 0);
                const max = candidates.length > 0
                    ? Math.max(...candidates.map((r) => r.votos))
                    : 0;
                const winners = candidates.filter((r) => r.votos === max);
                let ganador = undefined;
                let empate = false;
                if (total === 0) {
                    // sin votos
                }
                else if (winners.length > 1) {
                    empate = true;
                }
                else if (winners.length === 1) {
                    ganador = winners[0].nombre || '—';
                }
                return {
                    id: String(c.id),
                    titulo: String(c.titulo ?? 'Campaña'),
                    totalVotos: total,
                    ganador,
                    empate,
                };
            }));
            setData(enriched);
            setLoading(false);
        }
        load();
    }, []);
    if (loading)
        return _jsx(Spinner, { animation: "border" });
    const pieData = data.map((d) => ({
        name: d.titulo,
        value: d.totalVotos,
    }));
    const COLORS = ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6610f2', '#20c997'];
    return (_jsx(Card, { children: _jsxs(Card.Body, { children: [_jsx("h4", { children: "Reporte general de votaciones" }), _jsxs(Table, { bordered: true, hover: true, responsive: true, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Campa\u00F1a" }), _jsx("th", { children: "Total de votos" }), _jsx("th", { children: "Ganador / Empate" })] }) }), _jsx("tbody", { children: data.map((c) => (_jsxs("tr", { children: [_jsx("td", { children: c.titulo }), _jsx("td", { children: c.totalVotos }), _jsx("td", { children: c.totalVotos === 0
                                            ? 'Sin votos'
                                            : c.empate
                                                ? 'Empate'
                                                : c.ganador ?? '—' })] }, c.id))) })] }), _jsx("div", { style: { width: '100%', height: 300 }, children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(PieChart, { children: [_jsx(Pie, { dataKey: "value", data: pieData, nameKey: "name", 
                                    // 🔧 Tipado correcto del label
                                    label: (props) => props.name ?? '', outerRadius: 120, children: pieData.map((_, index) => (_jsx(Cell, { fill: COLORS[index % COLORS.length] }, `cell-${index}`))) }), _jsx(Tooltip, {})] }) }) })] }) }));
}
