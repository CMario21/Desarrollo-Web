import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/axios';
const AuthCtx = createContext(undefined);
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    useEffect(() => {
        const t = localStorage.getItem('token');
        const u = localStorage.getItem('user');
        if (t && u) {
            setToken(t);
            try {
                setUser(JSON.parse(u));
            }
            catch { }
        }
    }, []);
    async function login(cred) {
        const { data } = await api.post('/auth/login', cred);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
    }
    function logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    }
    const value = useMemo(() => ({ user, token, login, logout }), [user, token]);
    return _jsx(AuthCtx.Provider, { value: value, children: children });
}
export function useAuth() {
    const ctx = useContext(AuthCtx);
    if (!ctx)
        throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
