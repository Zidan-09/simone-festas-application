"use client";
import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import styles from "./Auth.module.css";

export default function AuthPage() {
  const [login, setLogin] = useState<boolean>(true);
  const [name, setName] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [address, setAddress] = useState();
  const [password, setPassword] = useState<string>("");

  const [show, setShow] = useState<boolean>(false);
  const [remember, setRemember] = useState<boolean>(false);

  const [emailError, setEmailError] = useState<boolean>(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passError, setPassError] = useState<boolean>(false);
  const [passTouched, setPassTouched] = useState<boolean>(false);

  const [nameError, setNameError] = useState<boolean>(false);
  const [nameTouched, setNameTouched] = useState<boolean>(false);

  const [contactError, setContactError] = useState<boolean>(false);
  const [contactTouched, setContactTouched] = useState<boolean>(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function resetInputs() {
    setName("");
    setContact("");
    setEmail("");
    setPassword("");

    setNameError(false);
    setNameTouched(false);
    setContactError(false);
    setContactTouched(false);
    setEmailError(false);
    setContactTouched(false);
    setPassError(false);
    setPassTouched(false);
  };

  return (
    <main className={styles.container}>
      <div className={login ? styles.login : styles.hide}>
        <h2 className={styles.title}>Faça seu Login!</h2>

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
            placeholder="Digite sua senha..."
            className={styles.passInput}
            value={password}
            onChange={(e) => {
              const value = e.target.value;
              setPassword(value);
              if (passTouched) setPassError(!value.trim())
            }}
          onBlur={() => {
            setPassTouched(true);
            setPassError(!password.trim())
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

          <span className={passError ? styles.passError : styles.hide}>Insira sua senha!</span>
        </div>

        <div>
          <label className={styles.check}>
            <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            />
            <span className={styles.box}></span>
            Lembrar-me
          </label>

        </div>

        <button
        type="submit"
        className={!email || !password ? styles.disabled : styles.submitBtn}
        disabled={!email || !password}
        >
          Login
        </button>

        <div className={styles.switchWrapper}>
          <a
          onClick={() => {
            setLogin(false);
            resetInputs();
          }}
          className={styles.switch}
          >
            Não tenho cadastro
          </a>
        </div>
      </div>

      <div className={login ? styles.hide : styles.register}>
        <h2 className={styles.title}>Realize seu Cadastro!</h2>

        <div className={styles.registerGrid}>
          <div className={styles.register1}>
            <div className={styles.fieldWrapper}>
            <input
              type="text"
              value={name}
              placeholder="Digite seu nome..."
              className={styles.name}
              onChange={(e) => {
                const value = e.target.value;
                setName(value);
                if (nameTouched) setNameError(!value.trim());
              }}
              onBlur={() => {
                setNameTouched(true);
                setNameError(!name.trim());
              }}
            />

            <span className={nameError ? styles.nameError : styles.hide}>Insira seu nome!</span>
          </div>

          <div className={styles.fieldWrapper}>
            <input
              type="text"
              value={contact}
              placeholder="Digite seu contato..."
              className={styles.contact}
              onChange={(e) => {
                const value = e.target.value;
                setContact(value);
                if (contactTouched) setContactError(!value.trim());
              }}
              onBlur={() => {
                setContactTouched(true);
                setContactError(!contact.trim());
              }}
            />

            <span className={contactError ? styles.contactError : styles.hide}>Insira seu contato!</span>
          </div>
          
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
                placeholder="Digite sua senha..."
                className={styles.passInput}
                value={password}
                onChange={(e) => {
                  const value = e.target.value;
                  setPassword(value);
                  if (passTouched) setPassError(!value.trim())
                }}
              onBlur={() => {
                setPassTouched(true);
                setPassError(!password.trim())
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

              <span className={passError ? styles.passError : styles.hide}>Insira sua senha!</span>
            </div>
          </div>

          <div className={styles.register2}>
            <p>Aki vai ficar o endereço</p>
          </div>
        </div>

        <button
        type="submit"
        className={!name || !contact || !email || !password ? styles.disabled : styles.submitBtn}
        disabled={!name || !contact || !email || !password}
        >
          Cadastrar
        </button>

        <div className={styles.switchWrapper}>
          <a
          onClick={() => {
            setLogin(true);
            resetInputs();
          }}
          className={styles.switch}
          >
            Já tenho cadastro
          </a>
        </div>
      </div>
    </main>
  )
}