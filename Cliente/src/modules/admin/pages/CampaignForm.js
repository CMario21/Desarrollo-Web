import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Button, Card, Form, Spinner, Row, Col } from 'react-bootstrap';
import api from '../../../api/axios';
function toInputDT(iso) {
    if (!iso)
        return '';
    const d = new Date(iso);
    const pad = (n) => n.toString().padStart(2, '0');
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const mi = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}
function fromInputDT(v) {
    return v ? new Date(v).toISOString() : null;
}
export default function CampaignForm() {
    const { id } = useParams();
    const nav = useNavigate();
    const isEdit = Boolean(id);
    const [form, setForm] = useState({
        titulo: '',
        descripcion: '',
        votes_per_user: 1,
        allow_duplicate_candidate_votes: false,
        estado: 'disabled',
        fecha_inicio: '', // datetime-local
        fecha_fin: '' // datetime-local
    });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState(null);
    const [err, setErr] = useState(null);
    useEffect(() => {
        if (isEdit) {
            setLoading(true);
            api.get(`/campaigns/${id}`)
                .then(r => {
                const c = r.data;
                setForm({
                    titulo: c.titulo ?? '',
                    descripcion: c.descripcion ?? '',
                    votes_per_user: c.votes_per_user ?? 1,
                    allow_duplicate_candidate_votes: c.allow_duplicate_candidate_votes ?? false,
                    estado: c.estado,
                    fecha_inicio: toInputDT(c.fecha_inicio),
                    fecha_fin: toInputDT(c.fecha_fin),
                });
            })
                .catch(() => setErr('Error al cargar campaña'))
                .finally(() => setLoading(false));
        }
    }, [id, isEdit]);
    function set(k, v) {
        setForm(p => ({ ...p, [k]: v }));
    }
    async function onSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setErr(null);
        setMsg(null);
        // Validar fechas (inicio < fin)
        if (form.fecha_inicio && form.fecha_fin) {
            const ini = new Date(form.fecha_inicio).getTime();
            const fin = new Date(form.fecha_fin).getTime();
            if (ini > fin) {
                setErr('La fecha de inicio no puede ser mayor que la fecha de finalización');
                setLoading(false);
                return;
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
            };
            if (isEdit)
                await api.patch(`/campaigns/${id}`, payload);
            else
                await api.post('/campaigns', payload);
            setMsg('Guardado correctamente');
            setTimeout(() => nav('/admin'), 800);
        }
        catch (e) {
            setErr(e?.response?.data?.message ?? 'Error al guardar');
        }
        finally {
            setLoading(false);
        }
    }
    return (_jsx(Card, { children: _jsxs(Card.Body, { children: [_jsx("h4", { className: "mb-3", children: isEdit ? 'Editar campaña' : 'Nueva campaña' }), msg && _jsx(Alert, { variant: "success", children: msg }), err && _jsx(Alert, { variant: "danger", children: err }), _jsxs(Form, { onSubmit: onSubmit, children: [_jsxs(Form.Group, { className: "mb-3", children: [_jsx(Form.Label, { children: "T\u00EDtulo" }), _jsx(Form.Control, { value: form.titulo, onChange: e => set('titulo', e.target.value), required: true })] }), _jsxs(Form.Group, { className: "mb-3", children: [_jsx(Form.Label, { children: "Descripci\u00F3n" }), _jsx(Form.Control, { as: "textarea", rows: 3, value: form.descripcion, onChange: e => set('descripcion', e.target.value) })] }), _jsxs(Row, { children: [_jsx(Col, { md: 4, children: _jsxs(Form.Group, { className: "mb-3", children: [_jsx(Form.Label, { children: "Votos por usuario" }), _jsx(Form.Control, { type: "number", min: 1, value: form.votes_per_user, onChange: e => set('votes_per_user', Number(e.target.value)), required: true })] }) }), _jsx(Col, { md: 4, children: _jsxs(Form.Group, { className: "mb-3", children: [_jsx(Form.Label, { children: "Estado" }), _jsxs(Form.Select, { value: form.estado, onChange: e => set('estado', e.target.value), children: [_jsx("option", { value: "disabled", children: "disabled" }), _jsx("option", { value: "enabled", children: "enabled" }), _jsx("option", { value: "closed", children: "closed" })] })] }) }), _jsx(Col, { md: 4, className: "d-flex align-items-center", children: _jsx(Form.Check, { type: "switch", id: "allow-dup", label: "Permitir votos duplicados al mismo candidato", checked: form.allow_duplicate_candidate_votes, onChange: e => set('allow_duplicate_candidate_votes', e.target.checked) }) })] }), _jsxs(Row, { children: [_jsx(Col, { md: 6, children: _jsxs(Form.Group, { className: "mb-3", children: [_jsx(Form.Label, { children: "Fecha de inicio" }), _jsx(Form.Control, { type: "datetime-local", value: form.fecha_inicio, onChange: e => set('fecha_inicio', e.target.value) }), _jsx(Form.Text, { children: "Opcional." })] }) }), _jsxs(Col, { md: 6, children: [_jsxs(Form.Group, { className: "mb-3", children: [_jsx(Form.Label, { children: "Fecha de fin" }), _jsx(Form.Control, { type: "datetime-local", value: form.fecha_fin, onChange: e => set('fecha_fin', e.target.value) }), _jsx(Form.Text, { children: "Opcional." })] }), form.fecha_inicio && form.fecha_fin && new Date(form.fecha_inicio) > new Date(form.fecha_fin) && (_jsx(Form.Text, { className: "text-danger", children: "La fecha de inicio no puede ser mayor que la de finalizaci\u00F3n." }))] })] }), _jsx(Button, { type: "submit", disabled: loading, children: loading ? _jsx(Spinner, { size: "sm" }) : 'Guardar' })] })] }) }));
}
