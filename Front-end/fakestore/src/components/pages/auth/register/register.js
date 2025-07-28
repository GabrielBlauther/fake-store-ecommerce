// src/components/pages/auth/register/register.js
import { useNavigate } from "react-router-dom"; 
import { useState, useEffect } from "react";
import { registerUser } from "../../../../services/api";
import { Toast } from "../../../toast/Toast";
import "./register.css";

const PasswordRequirement = ({ isValid, text }) => (
    <div className={`password-requirement ${isValid ? 'valid' : 'invalid'}`}>
        <span className="requirement-icon">{isValid ? '✓' : '✗'}</span>
        <span>{text}</span>
    </div>
);

function Register() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phone, setPhone] = useState("");
    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    const [passwordValidation, setPasswordValidation] = useState({
        minLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecialChar: false
    });
    
    const [showValidation, setShowValidation] = useState(false);
    
    useEffect(() => {
        if (password.length > 0) {
            setShowValidation(true);
            setPasswordValidation({
                minLength: password.length >= 8,
                hasUppercase: /[A-Z]/.test(password),
                hasLowercase: /[a-z]/.test(password),
                hasNumber: /\d/.test(password),
                hasSpecialChar: /[!@#$%^&*]/.test(password)
            });
        } else {
            setShowValidation(false);
        }
    }, [password]);

    const handleRegister = async () => {
        // Validação de campos vazios
        if(email === "" || name === "" || password === "" || confirmPassword === "" || phone === "") {
            Toast.warning("⚠️ Obrigatório preencher todos os campos");
            return;
        }
        
        // Validação de senhas iguais
        if (password !== confirmPassword) {
            Toast.error("❌ As senhas devem ser iguais");
            return;
        }
        
        // Validação de senha forte
        const isValidPassword = passwordRegex.test(password);
        if (!isValidPassword) {
            Toast.error("❌ A senha deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais");
            return;
        }
        
        // Validação de email
        const isValidEmail = emailRegex.test(email);
        if (!isValidEmail) {
            Toast.error("❌ Por favor, insira um endereço de e-mail válido");
            return;
        }
        
        // Loading toast
        const loadingToast = Toast.loading("Criando conta...");
        
        try {
            const response = await registerUser(name, email, password, confirmPassword, phone);
            console.log("Cadastro bem-sucedido", response);
            
            // Atualizar loading para sucesso
            Toast.updateLoading(loadingToast, 'success', ' Conta criada com sucesso!');
            
            setTimeout(() => {
                navigate("/login");
            }, 1500);
            
        } catch(error) {
            console.log("Erro ao fazer cadastro", error.message);
            
            // Atualizar loading para erro
            Toast.updateLoading(loadingToast, 'error', `❌ ${error.message || 'Erro no cadastro'}`);
        }
    };

    return(
        <div className="login-page">
            <img src="logo-bearByteInt.svg" alt="logo" className="logo" />
            <div className="container-register">
               <div className="login-text">
                <h2 className="Titulo">Cadastro</h2>
               <div className="email">
                 <label className="name">Nome:</label>
                 <input 
                    type="name" 
                    placeholder="Digite seu nome"
                    value={name}
                    onChange={(e)=> setName(e.target.value)} 
                    />
                 <label className="titulo-email">Email:</label>
                 <input type="email"
                    placeholder="Digite seu email"
                    value={email}
                    onChange={(e)=> setEmail(e.target.value)}
                  />
                 <label className="titulo-senha">Senha:</label>
                <input 
                type="password" 
                placeholder="Digite sua senha"
                value={password}
                onChange={(e)=> setPassword(e.target.value)}
                    />
                    {showValidation && (
                    <div className="password-validation">
                        <PasswordRequirement 
                        isValid={passwordValidation.minLength} 
                        text="Mínimo 8 caracteres" 
                        />
                        <PasswordRequirement 
                        isValid={passwordValidation.hasUppercase} 
                        text="Letra maiúscula" 
                        />
                        <PasswordRequirement 
                        isValid={passwordValidation.hasLowercase} 
                        text="Letra minúscula" 
                        />
                        <PasswordRequirement 
                        isValid={passwordValidation.hasNumber} 
                        text="Número" 
                        />
                        <PasswordRequirement 
                        isValid={passwordValidation.hasSpecialChar} 
                        text="Caractere especial (!@#$%^&*)" 
                        />
                    </div>
                    )}

                 <label className="titulo-confirmar-senha">Confirme sua senha:</label>
                 <input 
                    type="password" 
                    placeholder="Confirme sua senha"
                    value={confirmPassword}
                    onChange={(e)=> setConfirmPassword(e.target.value)}
                    />
                 <label className="titulo-senha">Numero:</label>
                 <input 
                    type="phone" 
                    placeholder="Digite seu numero"
                    value={phone}
                    onChange={(e)=> setPhone(e.target.value)}
                    />
                 <button className="btn-login" onClick={handleRegister}>Cadastrar</button>
               </div>
                </div>
            </div>
        </div>
    )
}

export default Register;
