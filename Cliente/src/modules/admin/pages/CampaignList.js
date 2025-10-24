import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../api/axios';
import { Badge, Spinner, Table, Button, ButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
export default function CampaignList() {
    const qc = useQueryClient();
    const { data, isLoading, error } = useQuery({
        queryKey: ['campaigns'],
        queryFn: async () => (await api.get('/campaigns')).data
    });
    const patchState = useMutation({
        mutationFn: async ({ id, estado }) => api.patch(`/campaigns/${id}`, { estado }),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['campaigns'] })
    });
    function renderEstado(e) {
        const map = {
            enabled: 'success',
            disabled: 'warning',
            closed: 'secondary'
        };
        return _jsx(Badge, { bg: map[e], children: e });
    }
    if (isLoading)
        return _jsx(Spinner, { animation: "border" });
    if (error)
        return _jsx("p", { children: "Error al cargar campa\u00F1as" });
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "d-flex justify-content-between align-items-center mb-3", children: [_jsx("h4", { children: "Campa\u00F1as" }), _jsx(Link, { to: "/admin/campaigns/new", className: "btn btn-primary", children: "Nueva campa\u00F1a" })] }), _jsxs(Table, { striped: true, bordered: true, hover: true, responsive: true, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "ID" }), _jsx("th", { children: "T\u00EDtulo" }), _jsx("th", { children: "Estado" }), _jsx("th", { children: "Votos/usuario" }), _jsx("th", { children: "Inicio" }), _jsx("th", { children: "Fin" }), _jsx("th", { children: "Acciones" })] }) }), _jsx("tbody", { children: data?.map(c => (_jsxs("tr", { children: [_jsx("td", { children: c.id }), _jsx("td", { children: c.titulo }), _jsx("td", { children: renderEstado(c.estado) }), _jsx("td", { children: c.votes_per_user }), _jsx("td", { children: c.fecha_inicio ? new Date(c.fecha_inicio).toLocaleString() : '-' }), _jsx("td", { children: c.fecha_fin ? new Date(c.fecha_fin).toLocaleString() : '-' }), _jsxs("td", { className: "text-nowrap", children: [_jsx(Link, { to: `/admin/campaigns/${c.id}/edit`, className: "btn btn-outline-primary btn-sm me-2", children: "Editar" }), _jsx(Link, { to: `/admin/campaigns/${c.id}/candidates`, className: "btn btn-outline-success btn-sm me-2", children: "Candidatos" }), _jsx(Link, { to: `/admin/campaigns/${c.id}/results`, className: "btn btn-outline-dark btn-sm me-3", children: "Resultados" }), _jsxs(ButtonGroup, { size: "sm", children: [_jsx(Button, { variant: "success", disabled: c.estado === 'enabled' || patchState.isPending, onClick: () => patchState.mutate({ id: c.id, estado: 'enabled' }), children: "Habilitar" }), _jsx(Button, { variant: "warning", disabled: c.estado === 'disabled' || patchState.isPending, onClick: () => patchState.mutate({ id: c.id, estado: 'disabled' }), children: "Deshabilitar" }), _jsx(Button, { variant: "secondary", disabled: c.estado === 'closed' || patchState.isPending, onClick: () => {
                                                        if (confirm('¿Cerrar campaña? No permitirá más votos.')) {
                                                            patchState.mutate({ id: c.id, estado: 'closed' });
                                                        }
                                                    }, children: "Cerrar" })] })] })] }, c.id))) })] })] }));
}
