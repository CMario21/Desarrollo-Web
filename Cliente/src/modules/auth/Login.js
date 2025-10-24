import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
export default function Login() {
    const { login } = useAuth();
    const nav = useNavigate();
    const [colegiado, setColegiado] = useState('');
    const [dpi, setDpi] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    async function onSubmit(e) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await login({ colegiado, dpi, password });
            nav('/');
        }
        catch (err) {
            setError(err?.response?.data?.message ?? 'Credenciales inválidas');
        }
        finally {
            setLoading(false);
        }
    }
    return (_jsx(Container, { className: "d-flex align-items-center justify-content-center", style: { minHeight: '90vh' }, children: _jsx(Row, { className: "w-100 justify-content-center", children: _jsx(Col, { md: 8, lg: 6, children: _jsx(Card, { className: "shadow-lg border-0 p-3", style: { borderRadius: '1rem' }, children: _jsxs(Card.Body, { children: [_jsx("h3", { className: "mb-4 text-center fw-bold text-primary", children: "Iniciar sesi\u00F3n" }), error && _jsx(Alert, { variant: "danger", children: error }), _jsxs(Form, { onSubmit: onSubmit, children: [_jsxs(Form.Group, { className: "mb-3", children: [_jsx(Form.Label, { children: "Colegiado" }), _jsx(Form.Control, { value: colegiado, onChange: e => setColegiado(e.target.value), required: true, placeholder: "Ej. V-001" })] }), _jsxs(Form.Group, { className: "mb-3", children: [_jsx(Form.Label, { children: "DPI" }), _jsx(Form.Control, { value: dpi, onChange: e => setDpi(e.target.value.slice(0, 13)), required: true, minLength: 13, maxLength: 13, placeholder: "13 d\u00EDgitos" })] }), _jsxs(Form.Group, { className: "mb-3", children: [_jsx(Form.Label, { children: "Contrase\u00F1a" }), _jsx(Form.Control, { type: "password", value: password, onChange: e => setPassword(e.target.value), required: true, minLength: 6, placeholder: "M\u00EDnimo 6 caracteres" })] }), _jsx("div", { className: "d-grid", children: _jsx(Button, { type: "submit", size: "lg", disabled: loading, children: loading ? _jsx(Spinner, { size: "sm" }) : 'Entrar' }) })] })] }) }) }) }) }));
}
