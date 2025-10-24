import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../../api/axios';
import { Alert, Card, Spinner, Table } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LabelList } from 'recharts';
export default function ResultsView() {
    const { id } = useParams();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState(null);
    useEffect(() => {
        async function load() {
            try {
                const res = await api.get(`/campaigns/${id}`);
                const results = (res.data.candidates ?? []).map((c, i) => ({
                    nombre: String(c.nombre || `Candidato ${i + 1}`),
                    votos: Number(c.votos ?? 0)
                }));
                setData(results);
                if (results.length) {
                    const max = Math.max(...results.map((r) => r.votos));
                    const winners = results.filter((r) => r.votos === max);
                    setMsg(winners.length > 1
                        ? `Empate entre: ${winners.map((w) => w.nombre).join(', ')}`
                        : `Ganador: ${winners[0].nombre} (${max} votos)`);
                }
                else {
                    setMsg('No hay votos registrados.');
                }
            }
            finally {
                setLoading(false);
            }
        }
        load();
    }, [id]);
    if (loading)
        return _jsx(Spinner, { animation: "border" });
    return (_jsx(Card, { children: _jsxs(Card.Body, { children: [_jsx("h4", { children: "Resultados de la campa\u00F1a" }), msg && _jsx(Alert, { variant: "info", children: msg }), _jsxs(Table, { bordered: true, hover: true, responsive: true, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Candidato" }), _jsx("th", { children: "Votos" })] }) }), _jsx("tbody", { children: data.map((r, i) => (_jsxs("tr", { children: [_jsx("td", { children: r.nombre }), _jsx("td", { children: r.votos })] }, `${r.nombre}-${i}`))) })] }), _jsx("div", { style: { width: '100%', height: 350, minHeight: 300 }, children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(BarChart, { data: data, margin: { top: 20, right: 30, left: 0, bottom: 5 }, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "nombre" }), _jsx(YAxis, { allowDecimals: false }), _jsx(Tooltip, {}), _jsx(Bar, { dataKey: "votos", fill: "#007bff", children: _jsx(LabelList, { dataKey: "votos", position: "top" }) })] }) }) })] }) }));
}
