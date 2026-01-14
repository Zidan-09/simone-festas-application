"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFeedback } from "@/app/hooks/feedback/feedbackContext";
import { Eye, EyeClosed } from "lucide-react";
import PersonalData from "./components/PersonalData";
import Address from "./components/Address";
import config from "@/app/config-api.json";
import styles from "./Auth.module.css";

export type Address = {
  cep: string;
  city: string;
  neighborhood: string;
  street: string;
  number: string;
  complement: string;
}

export default function AuthPage() {
  const [login, setLogin] = useState<boolean>(true);
  const [name, setName] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [address, setAddress] = useState<Address>({ cep: "", city: "", neighborhood: "", street: "", number: "", complement: "" });

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

  const [registerPart, setRegiterPart] = useState<number>(2);
  const [blockAll, setBlockAll] = useState<boolean>(false);

  const { showFeedback } = useFeedback();
  const router = useRouter();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function resetInputs() {
    setName("");
    setContact("");
    setEmail("");
    setPassword("");
    setAddress({
      cep: "",
      city: "",
      neighborhood: "",
      street: "",
      number: "",
      complement: ""
    });

    setNameError(false);
    setNameTouched(false);
    setContactError(false);
    setContactTouched(false);
    setEmailError(false);
    setContactTouched(false);
    setPassError(false);
    setPassTouched(false);
  };

  function maskPhone(value: string) {
    const numbers = value.replace(/\D/g, "");

    if (numbers.length === 0) return "";

    if (numbers.length <= 2) {
      return `(${numbers}`;
    }

    if (numbers.length <= 3) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    }

    if (numbers.length <= 7) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 3)} ${numbers.slice(3)}`;
    }

    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 3)} ${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  }

  const handleChangePart = (sum: number) => {
    setRegiterPart(registerPart + sum);
  };

  async function submit(): Promise<boolean> {
    if (blockAll) return false;
    setBlockAll(true);

    try {
      const res = await fetch(`${config.api_url}/${login ? "auth" : "register"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: name,
          contact: contact.replace(/\D/g, ""),
          email,
          password,
          address
        })
      }).then(res => res.json());

      if (!res.success) throw new Error(res.message);

      showFeedback(`${login ? "Login realizado!" : "Cadastrado com sucesso!"}`, "success");

      if (login) {
        router.push("/home");
        return true;
      };

      window.location.reload();
      return res.success;

    } catch (err) {
      console.error(err);
      showFeedback(`${login ? "Erro ao fazer login" : "Erro ao realizar o cadastro"}`, "error");
      return false;

    } finally {
      setBlockAll(false);
    }
  };

  return (
    <main className={styles.container}>
      <div className={login ? styles.login : styles.hide}>
        <h2 className={styles.title}>Faça seu Login!</h2>

        <div className={styles.fieldWrapper}>
          <label
          htmlFor="email"
          className={emailError ? styles.emailError : styles.label}
          >
            Digite seu email*
          </label>

          <input
            type="email"
            value={email}
            placeholder="Ex: fulano@exemplo.com"
            className={emailError ? styles.emailInputError : styles.input}
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
        </div>

        <div className={styles.fieldWrapper}>
          <label
          htmlFor="password"
          className={passError ? styles.passError : styles.label}
          >
            Digite sua senha*
          </label>

          <div className={passError ? styles.passInputError : styles.password}>
            <input
            type={show ? "text" : "password"}
            name="password"
            placeholder="Ex: fulano123"
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
        </div>

        <div className={styles.infoWrapper}>
          <label className={styles.check}>
            <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            />
            <span className={styles.box}></span>
            Lembrar-me
          </label>
          
          <a
          href=""
          className={styles.forgotPass}
          >Esqueci minha senha</a>
        </div>

        <button
        type="submit"
        className={!email || password.trim().length < 8 ? styles.disabled : styles.submitBtn}
        disabled={!email || password.trim().length < 8 }
        onClick={() => {
          if (blockAll) return;
          submit();
        }}
        >
          Login
        </button>

        <div className={styles.switchWrapper}>
          <a
          onClick={() => {
            if (blockAll) return;
            setLogin(false);
            resetInputs();
          }}
          className={styles.switch}
          >
            Não tenho cadastro
          </a>
        </div>
      </div>

      <div className={login || registerPart !== 1 ? styles.hide : styles.register}>
        <h2 className={styles.title}>Realize seu Cadastro!</h2>

        <p className={styles.registerSection}>Vamos começar com alguns dados básicos</p>

        <div className={styles.fieldWrapper}>
          <label
            htmlFor="name"
            className={nameError ? styles.nameError : styles.label}
          >
            Digite seu nome completo*
          </label>
          
          <input
            type="name"
            name="name"
            value={name}
            placeholder="Ex: Fulano da Costa"
            className={nameError ? styles.nameInputError : styles.name}
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
        </div>

        <div className={styles.fieldWrapper}>
          <label
            htmlFor="contact"
            className={contactError ? styles.contactError : styles.label}
          >
            Digite seu telefone*
          </label>
          
          <input
            type="contact"
            name="contact"
            value={contact}
            placeholder="Ex: (12) 3 4567-8910"
            className={contactError ? styles.contactInputError : styles.input}
            onChange={(e) => {
              const value = e.target.value;
              const masked = maskPhone(value);

              setContact(masked);

              if (contactTouched) {
                const onlyNumbers = masked.replace(/\D/g, "");
                setContactError(onlyNumbers.length < 11);
              }
            }}
            onBlur={() => {
              setContactTouched(true);
              const onlyNumbers = contact.replace(/\D/g, "");
              setContactError(onlyNumbers.length < 11);
            }}
          />
        </div>

        <button
          type="button"
          className={name.split(" ").length < 2 || contact.length < 16 || blockAll ? styles.disabled : styles.submitBtn}
          disabled={name.split(" ").length < 2 || contact.length < 16 || blockAll}
          onClick={() => handleChangePart(1)}
        >
          Próximo
        </button>

        <div className={styles.switchWrapper}>
          <a
          onClick={() => {
            if (blockAll) return;
            setLogin(true);
            resetInputs();
          }}
          className={styles.switch}
          >
            Já tenho cadastro
          </a>
        </div>
      </div>

      {registerPart === 2 ? (
        <PersonalData
          changePart={handleChangePart}
          email={email}
          setEmail={setEmail}
          emailError={emailError}
          setEmailError={setEmailError}
          emailTouched={emailTouched}
          setEmailTouched={setEmailTouched}
          password={password}
          setPassword={setPassword}
          passError={passError}
          setPassError={setPassError}
          passTouched={passTouched}
          setPassTouched={setPassTouched}
          show={show}
          setShow={setShow}
        />
      ) : registerPart === 3 ? (
        <Address
          changePart={handleChangePart}
          address={address}
          setAddress={setAddress}
          submit={submit}
        />
      ) : ""}

    </main>
  )
}