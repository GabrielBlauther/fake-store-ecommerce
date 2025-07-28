// src/components/pages/auth/conta/login.js
import "./login.css";
import { Toast } from "../../../toast/Toast"; // Corrigindo o import
import { useNavigate, Link } from "react-router-dom"; 
import { useState } from "react";
import { loginUser } from "../../../../services/api";
import { useAuth } from "../../../../context/AuthContext";

function Login(){
    const [errors, setErrors] = useState({
        email: '',
        password: '',
    });
    
    const clearErrors = () => {
        setErrors({ email: '', password: ''});
    };

    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const handleLogin = async () => {
        clearErrors();
        
        // Validação de campos vazios
        if(email === "" || password === "") {
            setErrors({
                email: email === "" ? "Email é obrigatório" : "",
                password: password === "" ? "Senha é obrigatória" : "",
            });
            Toast.warning("⚠️ Preencha todos os campos");
            return;
        }
        
        // Loading toast
        const loadingToast = Toast.loading("Fazendo login...");
        
        try {
            const response = await loginUser(email, password);
            login(response);
            
            // Atualizar loading para sucesso
            Toast.updateLoading(loadingToast, 'success', `👋 Bem-vindo, ${response.name || 'Usuário'}!`);
            
            navigate("/");
        } catch(error) {
            // Atualizar loading para erro
            Toast.updateLoading(loadingToast, 'error', '❌ Email ou senha incorretos');
            
            setErrors({
                email: error.message.includes('email') ? 'Email não encontrado' : '',
                password: error.message.includes('senha') ? 'Senha incorreta' : '',
            });
        }
    };

    return(
        <div className="login-page">
            <img src="logo-bearByteInt.svg" alt="logo" className="logo" />
            <div className="container-login">
               <div className="login-text">
                <h2 className="Titulo">Login</h2>
               <div className="email">
                    <label className="titulo-email">Email:</label>
                    <input 
                        type="email" 
                        placeholder="Digite seu email"
                        value={email}
                        onChange={(e)=> setEmail(e.target.value)}
                        className={errors.email ? 'input-error' : ''}
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}

                    <label className="titulo-senha">Senha:</label>
                    <input 
                        type="password" 
                        placeholder="Digite sua senha"
                        value={password}
                        onChange={(e)=> setPassword(e.target.value)}
                        className={errors.password ? 'input-error' : ''}
                    />
                    {errors.password && <span className="error-message">{errors.password}</span>}
                 <button className="btn-login" onClick={handleLogin}>Entrar</button>
               </div>
               <div className="Register">
                    <p>Novo por aqui?</p><Link to = "/register">Registre-se</Link>
               </div>
                </div>
            </div>
        </div>
    )
}

export default Login;
