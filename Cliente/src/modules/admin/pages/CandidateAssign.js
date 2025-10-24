import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../../api/axios';
import { Alert, Button, Card, Form, Spinner, Table } from 'react-bootstrap';
export default function CandidateAssign() {
    const { id: campaignId } = useParams();
    const [users, setUsers] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [selected, setSelected] = useState('');
    const [bio, setBio] = useState('');
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState(null);
    async function loadAll() {
        const [usr, cand] = await Promise.all([
            api.get('/auth/users?voter=true').catch(() => ({ data: [] })),
            api.get(`/campaigns/${campaignId}/candidates`)
        ]);
        setUsers(usr.data);
        setCandidates(cand.data);
    }
    useEffect(() => {
        loadAll();
    }, []);
    async function addCandidate() {
        if (!selected)
            return;
        setLoading(true);
        try {
            await api.post(`/campaigns/${campaignId}/candidates`, { user_id: selected, bio });
            setMsg('Candidato agregado correctamente');
            setSelected('');
            setBio('');
            await loadAll();
        }
        catch (e) {
            setMsg(e?.response?.data?.message ?? 'Error al agregar candidato');
        }
        finally {
            setLoading(false);
        }
    }
    async function removeCandidate(id) {
        if (!confirm('¿Eliminar candidato?'))
            return;
        await api.delete(`/campaigns/${campaignId}/candidates/${id}`);
        await loadAll();
    }
    return (_jsx(Card, { children: _jsxs(Card.Body, { children: [_jsx("h4", { children: "Asignar candidatos" }), msg && _jsx(Alert, { variant: "info", children: msg }), _jsxs(Form, { className: "d-flex gap-2 align-items-end mb-4", onSubmit: e => { e.preventDefault(); addCandidate(); }, children: [_jsxs(Form.Group, { className: "flex-grow-1", children: [_jsx(Form.Label, { children: "Seleccionar usuario" }), _jsxs(Form.Select, { value: selected, onChange: e => setSelected(e.target.value), required: true, children: [_jsx("option", { value: "", children: "-- Elige un usuario votante --" }), users.map(u => (_jsxs("option", { value: u.id, children: [u.nombre, " (", u.colegiado, ")"] }, u.id)))] })] }), _jsxs(Form.Group, { className: "flex-grow-1", children: [_jsx(Form.Label, { children: "Biograf\u00EDa" }), _jsx(Form.Control, { value: bio, onChange: e => setBio(e.target.value), placeholder: "Ej. Trayectoria o lema", required: true })] }), _jsx(Button, { type: "submit", disabled: loading, children: loading ? _jsx(Spinner, { size: "sm" }) : 'Agregar' })] }), _jsxs(Table, { striped: true, bordered: true, hover: true, responsive: true, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "#" }), _jsx("th", { children: "Nombre" }), _jsx("th", { children: "Colegiado" }), _jsx("th", { children: "Biograf\u00EDa" }), _jsx("th", { children: "Acciones" })] }) }), _jsx("tbody", { children: candidates.map((c, i) => (_jsxs("tr", { children: [_jsx("td", { children: i + 1 }), _jsx("td", { children: c.nombre }), _jsx("td", { children: c.colegiado }), _jsx("td", { children: c.bio ?? '-' }), _jsx("td", { children: _jsx(Button, { size: "sm", variant: "outline-danger", onClick: () => removeCandidate(c.id), children: "Eliminar" }) })] }, c.id))) })] })] }) }));
}
