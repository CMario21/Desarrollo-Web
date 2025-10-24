import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Container, Row, Col } from 'react-bootstrap';
import { Navigate, Route, Routes } from 'react-router-dom';
import SidebarMenu from './SidebarMenu';
import CampaignList from './pages/CampaignList';
import CampaignForm from './pages/CampaignForm';
import CandidateAssign from './pages/CandidateAssign';
import ResultsView from './pages/ResultsView';
import Reports from './pages/Reports';
export default function AdminPanel() {
    return (_jsx(Container, { fluid: true, className: "mt-4", children: _jsxs(Row, { children: [_jsx(Col, { md: 3, lg: 2, className: "mb-3", children: _jsx(SidebarMenu, {}) }), _jsx(Col, { md: 9, lg: 10, children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(CampaignList, {}) }), _jsx(Route, { path: "campaigns/new", element: _jsx(CampaignForm, {}) }), _jsx(Route, { path: "campaigns/:id/edit", element: _jsx(CampaignForm, {}) }), _jsx(Route, { path: "campaigns/:id/candidates", element: _jsx(CandidateAssign, {}) }), _jsx(Route, { path: "campaigns/:id/results", element: _jsx(ResultsView, {}) }), _jsx(Route, { path: "reports", element: _jsx(Reports, {}) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }) })] }) }));
}
