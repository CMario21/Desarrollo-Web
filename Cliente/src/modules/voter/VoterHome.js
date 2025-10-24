import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { Row, Col, Card, Badge, Button, Modal, ListGroup, Spinner, Alert } from 'react-bootstrap';
import api from '../../api/axios';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList } from 'recharts';
function computeClosed(c, now = dayjs()) {
    // Cerrada si el backend ya la marcó closed o si ya pasó fecha_fin
    const backendClosed = c.estado === 'closed';
    const timeClosed = !!c.fecha_fin && now.isAfter(dayjs(c.fecha_fin));
    return backendClosed || timeClosed;
}
function computeActive(c, now = dayjs()) {
    if (c.estado !== 'enabled')
        return false;
    const startOk = !c.fecha_inicio || now.isAfter(dayjs(c.fecha_inicio)) || now.isSame(dayjs(c.fecha_inicio), 'minute');
    const endOk = !c.fecha_fin || now.isBefore(dayjs(c.fecha_fin)) || now.isSame(dayjs(c.fecha_fin), 'minute');
    return startOk && endOk;
}
export default function VoterHome() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [campaigns, setCampaigns] = useState([]);
    // modal
    const [show, setShow] = useState(false);
    const [current, setCurrent] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [voteMsg, setVoteMsg] = useState(null);
    // detalle combinado
    const [votesPerUser, setVotesPerUser] = useState(1);
    const [enriched, setEnriched] = useState([]);
    // cargar campañas (activa o cerrada). se ocultan las disabled
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                setError(null);
                const { data } = await api.get('/campaigns');
                const now = dayjs();
                const visibles = data
                    .filter(c => c.estado !== 'disabled') // ocultamos disabled
                    .map(c => ({
                    ...c,
                    id: typeof c.id === 'bigint' ? String(c.id) : c.id
                }))
                    // mostramos activas (enabled en rango) y también cerradas (por tiempo o estado)
                    .filter(c => computeActive(c, now) || computeClosed(c, now));
                setCampaigns(visibles);
            }
            catch (e) {
                setError(e?.response?.data?.message || 'No se pudieron cargar las campañas');
            }
            finally {
                setLoading(false);
            }
        })();
    }, []);
    // abrir modal y cargar detalle (resultados + candidatos con bio)
    async function openCampaign(camp) {
        setCurrent(camp);
        setVoteMsg(null);
        setShow(true);
        setDetailLoading(true);
        try {
            // resultados con votos
            const res1 = await api.get(`/campaigns/${camp.id}`);
            const results = (res1.data?.candidates ?? []).map((r, i) => ({
                candidateId: r?.candidateId ?? r?.id ?? i, // fallback
                nombre: String(r?.nombre ?? `Candidato ${i + 1}`),
                votos: Number(r?.votos ?? 0),
            }));
            setVotesPerUser(Number(res1.data?.votes_per_user ?? camp.votes_per_user ?? 1));
            // datos de candidatos (bio, user_id, etc.)
            const res2 = await api.get(`/campaigns/${camp.id}/candidates`);
            const candList = (res2.data ?? []).map((c) => ({
                id: c?.id ?? c?.candidateId ?? c?.user_id ?? '',
                user_id: c?.user_id,
                nombre: String(c?.nombre ?? ''),
                bio: c?.bio ?? null,
            }));
            // index para fusionar por candidateId y como respaldo por nombre
            const byId = new Map();
            candList.forEach(c => byId.set(c.id, c));
            const byName = new Map();
            candList.forEach(c => byName.set(c.nombre.toLowerCase(), c));
            const merged = results.map(r => {
                let found;
                if (r.candidateId !== undefined) {
                    found = byId.get(r.candidateId);
                }
                if (!found) {
                    found = byName.get(r.nombre.toLowerCase());
                }
                return {
                    candidateId: (r.candidateId ?? found?.id ?? r.nombre),
                    nombre: r.nombre,
                    votos: r.votos,
                    bio: found?.bio ?? null,
                };
            });
            setEnriched(merged);
        }
        catch (e) {
            setVoteMsg(e?.response?.data?.message || 'No se pudo cargar el detalle de la campaña');
        }
        finally {
            setDetailLoading(false);
        }
    }
    function closeModal() {
        setShow(false);
        setCurrent(null);
        setEnriched([]);
        setVoteMsg(null);
    }
    // votar y refrescar resultados (bloqueado si está cerrada)
    async function votar(candidateId) {
        if (!current)
            return;
        if (computeClosed(current)) {
            setVoteMsg('❌ La campaña está cerrada.');
            return;
        }
        setVoteMsg(null);
        setDetailLoading(true);
        try {
            await api.post(`/campaigns/${current.id}/votes`, { candidateId });
            setVoteMsg('✅ ¡Voto registrado!');
            // refrescar resultados tras votar
            await openCampaign(current);
        }
        catch (e) {
            const msg = e?.response?.data?.message || 'No se pudo registrar el voto';
            setVoteMsg(`❌ ${msg}`);
        }
        finally {
            setDetailLoading(false);
        }
    }
    const chartData = useMemo(() => {
        return enriched.map(e => ({ nombre: e.nombre, votos: e.votos }));
    }, [enriched]);
    // ganador/empate (para mostrar en modal cuando esté cerrada)
    const winnerText = useMemo(() => {
        if (!enriched.length)
            return 'Sin votos';
        const max = Math.max(...enriched.map(e => e.votos));
        const winners = enriched.filter(e => e.votos === max);
        if (max === 0)
            return 'Sin votos';
        if (winners.length > 1)
            return `Empate: ${winners.map(w => w.nombre).join(', ')}`;
        return `Ganador: ${winners[0].nombre} (${max} votos)`;
    }, [enriched]);
    if (loading) {
        return (_jsx("div", { className: "d-flex justify-content-center p-5", children: _jsx(Spinner, { animation: "border" }) }));
    }
    if (error) {
        return _jsx(Alert, { variant: "danger", className: "m-3", children: error });
    }
    return (_jsxs(_Fragment, { children: [_jsxs(Row, { className: "g-3", children: [campaigns.length === 0 && (_jsx(Col, { xs: 12, children: _jsx(Alert, { variant: "info", className: "mb-0", children: "No hay campa\u00F1as disponibles en este momento." }) })), campaigns.map(c => {
                        const isClosed = computeClosed(c);
                        const badgeColor = isClosed ? 'secondary' : 'success';
                        const badgeText = isClosed ? 'closed' : 'enabled';
                        return (_jsx(Col, { xs: 12, sm: 6, lg: 4, children: _jsx(Card, { className: "h-100 shadow-sm", children: _jsxs(Card.Body, { children: [_jsxs("div", { className: "d-flex justify-content-between align-items-start mb-2", children: [_jsx(Card.Title, { className: "mb-0", children: c.titulo }), _jsx(Badge, { bg: badgeColor, children: badgeText })] }), c.descripcion && _jsx(Card.Text, { className: "text-muted", children: c.descripcion }), _jsxs("div", { className: "small text-muted mb-3", children: [c.fecha_inicio && _jsxs(_Fragment, { children: ["Inicio: ", dayjs(c.fecha_inicio).format('YYYY-MM-DD HH:mm'), _jsx("br", {})] }), c.fecha_fin && _jsxs(_Fragment, { children: ["Fin: ", dayjs(c.fecha_fin).format('YYYY-MM-DD HH:mm')] }), isClosed && _jsx("div", { className: "mt-2", children: _jsx(Badge, { bg: "dark", children: "Campa\u00F1a cerrada" }) })] }), _jsx(Button, { variant: "primary", onClick: () => openCampaign(c), children: isClosed ? 'Ver resultados' : 'Ver candidatos' })] }) }) }, String(c.id)));
                    })] }), _jsxs(Modal, { show: show, onHide: closeModal, size: "lg", centered: true, scrollable: true, children: [_jsx(Modal.Header, { closeButton: true, children: _jsxs(Modal.Title, { children: [current?.titulo, ' ', current && !computeClosed(current) && (current?.votes_per_user || votesPerUser) ? (_jsxs(Badge, { bg: "info", className: "ms-2", children: ["Votos por usuario: ", current?.votes_per_user ?? votesPerUser] })) : null] }) }), _jsxs(Modal.Body, { children: [current && computeClosed(current) && (_jsxs(Alert, { variant: "secondary", className: "mb-3", children: ["Esta campa\u00F1a est\u00E1 ", _jsx("strong", { children: "cerrada" }), ". Solo puedes ver los resultados."] })), voteMsg && (_jsx(Alert, { variant: voteMsg.startsWith('✅') ? 'success' : 'danger', children: voteMsg })), detailLoading && (_jsx("div", { className: "d-flex justify-content-center p-3", children: _jsx(Spinner, { animation: "border" }) })), !detailLoading && (_jsxs(_Fragment, { children: [!current || !computeClosed(current) ? (_jsxs(_Fragment, { children: [_jsx("h6", { className: "mb-2", children: "Candidatos" }), _jsxs(ListGroup, { className: "mb-3", children: [enriched.length === 0 && (_jsx(ListGroup.Item, { children: "No hay candidatos disponibles." })), enriched.map((c, i) => (_jsxs(ListGroup.Item, { className: "d-flex justify-content-between align-items-start", children: [_jsxs("div", { className: "me-3", children: [_jsx("div", { className: "fw-bold", children: c.nombre }), c.bio && _jsx("div", { className: "text-muted small", children: c.bio }), _jsxs("div", { className: "small", children: ["Votos actuales: ", _jsx("strong", { children: c.votos })] })] }), _jsx("div", { children: _jsx(Button, { size: "sm", variant: "primary", onClick: () => votar(c.candidateId), children: "Votar" }) })] }, `${c.candidateId}-${i}`)))] })] })) : (_jsxs(_Fragment, { children: [_jsx("h6", { className: "mb-2", children: "Resultados" }), _jsx(Alert, { variant: "info", children: winnerText })] })), _jsx("h6", { className: "mb-2", children: "Gr\u00E1fico de votos" }), _jsx("div", { style: { width: '100%', height: 320, minHeight: 300 }, children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(BarChart, { data: chartData, margin: { top: 20, right: 30, left: 0, bottom: 5 }, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "nombre" }), _jsx(YAxis, { allowDecimals: false }), _jsx(Tooltip, {}), _jsx(Bar, { dataKey: "votos", fill: "#0d6efd", children: _jsx(LabelList, { dataKey: "votos", position: "top" }) })] }) }) })] }))] }), _jsx(Modal.Footer, { children: _jsx(Button, { variant: "secondary", onClick: closeModal, children: "Cerrar" }) })] })] }));
}
