import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
export default function Register() {
    const nav = useNavigate();
    const [form, setForm] = useState({
        colegiado: '',
        dpi: '',
        nombre: '',
        email: '',
        fecha_nacimiento: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [ok, setOk] = useState(null);
    function set(k, v) {
        setForm(prev => ({ ...prev, [k]: v }));
    }
    async function onSubmit(e) {
        e.preventDefault();
        setError(null);
        setOk(null);
        setLoading(true);
        try {
            await api.post('/auth/register', form);
            setOk('Usuario registrado correctamente. Ahora puedes iniciar sesión.');
            setTimeout(() => nav('/login'), 1200);
        }
        catch (err) {
            setError(err?.response?.data?.message ?? 'Error al registrar');
        }
        finally {
            setLoading(false);
        }
    }
    return (_jsx(Container, { className: "d-flex align-items-center justify-content-center", style: { minHeight: '95vh' }, children: _jsx(Row, { className: "w-100 justify-content-center", children: _jsx(Col, { md: 10, lg: 8, children: _jsx(Card, { className: "shadow-lg border-0 p-3", style: { borderRadius: '1rem' }, children: _jsxs(Card.Body, { children: [_jsx("h3", { className: "mb-4 text-center fw-bold text-success", children: "Crear cuenta" }), error && _jsx(Alert, { variant: "danger", children: error }), ok && _jsx(Alert, { variant: "success", children: ok }), _jsxs(Form, { onSubmit: onSubmit, children: [_jsxs(Row, { children: [_jsx(Col, { md: 6, children: _jsxs(Form.Group, { className: "mb-3", children: [_jsx(Form.Label, { children: "Colegiado" }), _jsx(Form.Control, { value: form.colegiado, onChange: e => set('colegiado', e.target.value), required: true, placeholder: "Ej. V-001" })] }) }), _jsx(Col, { md: 6, children: _jsxs(Form.Group, { className: "mb-3", children: [_jsx(Form.Label, { children: "DPI" }), _jsx(Form.Control, { value: form.dpi, onChange: e => set('dpi', e.target.value.slice(0, 13)), required: true, minLength: 13, maxLength: 13, placeholder: "13 d\u00EDgitos" })] }) })] }), _jsxs(Form.Group, { className: "mb-3", children: [_jsx(Form.Label, { children: "Nombre completo" }), _jsx(Form.Control, { value: form.nombre, onChange: e => set('nombre', e.target.value), required: true, placeholder: "Tu nombre completo" })] }), _jsxs(Row, { children: [_jsx(Col, { md: 6, children: _jsxs(Form.Group, { className: "mb-3", children: [_jsx(Form.Label, { children: "Email" }), _jsx(Form.Control, { type: "email", value: form.email, onChange: e => set('email', e.target.value), required: true, placeholder: "ejemplo@correo.com" })] }) }), _jsx(Col, { md: 6, children: _jsxs(Form.Group, { className: "mb-3", children: [_jsx(Form.Label, { children: "Fecha de nacimiento" }), _jsx(Form.Control, { type: "date", value: form.fecha_nacimiento, onChange: e => set('fecha_nacimiento', e.target.value), required: true })] }) })] }), _jsxs(Form.Group, { className: "mb-4", children: [_jsx(Form.Label, { children: "Contrase\u00F1a" }), _jsx(Form.Control, { type: "password", value: form.password, onChange: e => set('password', e.target.value), required: true, minLength: 6, placeholder: "M\u00EDnimo 6 caracteres" })] }), _jsx("div", { className: "d-grid", children: _jsx(Button, { type: "submit", size: "lg", variant: "success", disabled: loading, children: loading ? _jsx(Spinner, { size: "sm" }) : 'Registrar' }) })] })] }) }) }) }) }));
}
