// src/components/toast/Toast.js
import { toast } from "react-toastify";

// Configurações padrão
const defaultOptions = {
    position: "top-left",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
};

export const Toast = {
    // Notificações básicas
    success: (message, options = {}) => {
        toast.success(message, { ...defaultOptions, ...options });
    },

    error: (message, options = {}) => {
        toast.error(message, { ...defaultOptions, autoClose: 4000, ...options });
    },

    info: (message, options = {}) => {
        toast.info(message, { ...defaultOptions, ...options });
    },

    warning: (message, options = {}) => {
        toast.warning(message, { ...defaultOptions, ...options });
    },

    // Funções específicas do carrinho
    cart: {
        added: (productName) => {
            toast.success(`✅ ${productName} adicionado ao carrinho!`, {
                ...defaultOptions,
                autoClose: 2000,
            });
        },

        removed: (productName) => {
            toast.info(`🗑️ ${productName} removido do carrinho`, {
                ...defaultOptions,
                autoClose: 2000,
            });
        },

        updated: (productName, quantity) => {
            toast.info(`📝 ${productName} - quantidade: ${quantity}`, {
                ...defaultOptions,
                autoClose: 2000,
            });
        },

        cleared: () => {
            toast.info(`🧹 Carrinho limpo`, {
                ...defaultOptions,
                autoClose: 2000,
            });
        },

        error: () => {
            toast.error(`❌ Erro ao modificar carrinho`, {
                ...defaultOptions,
                autoClose: 3000,
            });
        }
    },

    // Funções de autenticação
    auth: {
        loginSuccess: (userName) => {
            toast.success(`👋 Bem-vindo, ${userName}!`, {
                ...defaultOptions,
                autoClose: 3000,
            });
        },

        loginError: () => {
            toast.error(`❌ Email ou senha incorretos`, {
                ...defaultOptions,
                autoClose: 4000,
            });
        },

        registerSuccess: () => {
            toast.success(`🎉 Conta criada com sucesso!`, {
                ...defaultOptions,
                autoClose: 3000,
            });
        },

        registerError: (message) => {
            toast.error(`❌ ${message}`, {
                ...defaultOptions,
                autoClose: 4000,
            });
        },

        logout: () => {
            toast.info(`👋 Até logo!`, {
                ...defaultOptions,
                autoClose: 2000,
            });
        }
    },

    // Funções de loading
    loading: (message = "Carregando...") => {
        return toast.loading(message, {
            position: "top-left",
        });
    },

    updateLoading: (toastId, type, message) => {
        toast.update(toastId, {
            render: message,
            type: type,
            isLoading: false,
            autoClose: 3000,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    }
};
