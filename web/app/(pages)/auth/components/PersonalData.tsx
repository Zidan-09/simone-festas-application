import { Dispatch, SetStateAction } from "react";
import { Eye, EyeClosed } from "lucide-react";
import styles from "./PersonalData.module.css";

interface PersonalDataProps {
  changePart: (sum: number) => void;
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  emailTouched: boolean;
  setEmailTouched: Dispatch<SetStateAction<boolean>>;
  emailError: boolean;
  setEmailError: Dispatch<SetStateAction<boolean>>;
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
  passTouched: boolean;
  setPassTouched: Dispatch<SetStateAction<boolean>>;
  passError: boolean;
  setPassError: Dispatch<SetStateAction<boolean>>;
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
};

export default function PersonalData({
  changePart,
  email,
  setEmail,
  emailTouched,
  setEmailTouched,
  emailError,
  setEmailError,
  password,
  setPassword,
  passTouched,
  setPassTouched,
  passError,
  setPassError,
  show,
  setShow
}: PersonalDataProps) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return (
    <div className={styles.personalContainer}>
      <h2 className={styles.title}>Realize seu Cadastro!</h2>

      <p className={styles.registerSection}>Agora seus dados de login</p>
      
      <div className={styles.inputWrapper}>
        <div className={styles.fieldWrapper}>
          <input
            type="email"
            value={email}
            placeholder="Digite seu email..."
            className={styles.email}
            onChange={(e) => {
              const value = e.target.value;
              setEmail(value);
              if (emailTouched) setEmailError(!emailRegex.test(value));
            }}
            onBlur={() => {
              setEmailTouched(true);
              setEmailError(!emailRegex.test(email));
            }}
          />

          <span className={emailError ? styles.emailError : styles.hide}>Insira um email válido!</span>
        </div>

        <div className={styles.fieldWrapper}>
          <div className={styles.password}>
            <input
            type={show ? "text" : "password"}
            placeholder="Digite uma senha..."
            className={styles.passInput}
            value={password}
            onChange={(e) => {
              const value = e.target.value;
              setPassword(value);
              if (passTouched) setPassError(value.trim().length < 8)
            }}
          onBlur={() => {
            setPassTouched(true);
            setPassError(password.trim().length < 8)
          }}
            />

            <button
            className={styles.showBtn}
            onClick={() => setShow(!show)}
            >
              {show ? (
                <Eye
                  className={styles.showBtnIcon}
                />
              ) : (
                <EyeClosed
                  className={styles.showBtnIcon}
                />
              )}
            </button>
          </div>

          <span className={passError ? styles.passError : styles.hide}>A senha deve ter no mínimo 8 dígitos!</span>
        </div>
      </div>

      <div className={styles.buttonsWrapper}>
        <button
          type="button"
          className={styles.btn}
          onClick={() => changePart(-1)}
        >
          Voltar
        </button>

        <button
          type="button"
          className={ !email.trim() || password.trim().length < 8 ? styles.disabled : styles.btn}
          onClick={() => changePart(1)}
          disabled={ !email.trim() || password.trim().length < 8 }
        >
          Próximo
        </button>
      </div>
    </div>
  )
}