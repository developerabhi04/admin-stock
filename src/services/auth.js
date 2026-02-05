import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    admin: null,
    token: localStorage.getItem('adminToken') || null,
    isAuthenticated: !!localStorage.getItem('adminToken'),
    loading: true,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.admin = action.payload.admin;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.loading = false;

            // ✅ Store in localStorage
            localStorage.setItem('adminToken', action.payload.token);
            localStorage.setItem('adminData', JSON.stringify(action.payload.admin));

            console.log('✅ Admin logged in:', action.payload.admin);
        },

        logout: (state) => {
            state.admin = null;
            state.token = null;
            state.isAuthenticated = false;
            state.loading = false;

            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminData');

            console.log('🚪 Admin logged out');
        },

        loadAdmin: (state) => {
            const token = localStorage.getItem('adminToken');
            const adminData = localStorage.getItem('adminData');

            if (token && adminData) {
                try {
                    state.token = token;
                    state.admin = JSON.parse(adminData);
                    state.isAuthenticated = true;

                    console.log('✅ Admin loaded from storage:', state.admin);
                } catch (error) {
                    console.error('❌ Error loading admin data:', error);
                    localStorage.removeItem('adminToken');
                    localStorage.removeItem('adminData');
                }
            }

            state.loading = false;
        },
    },
});

export const { loginSuccess, logout, loadAdmin } = authSlice.actions;
export default authSlice.reducer;
