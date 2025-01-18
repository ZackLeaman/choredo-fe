import { useState } from "react";
import { User } from "../models";

export interface LoginPageProps {
  setUser: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const onLogin = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (email && password) {
      // TODO encrypt password before sending
      fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })
        .then((res) => {
          if (res.status === 422) {
            console.log("VALIDATION FAILURE");
            throw new Error("Validation failed.");
          }
          if (res.status !== 200 && res.status !== 201) {
            console.log("Error!");
            throw new Error("Could not authenticate you!");
          }
          return res.json();
        })
        .then((resData) => {
          console.log(resData);
          setUser({
            id: resData.id,
            username: resData.username,
            email: resData.email,
          });
          // TODO REMOVE ONCE LOGIN ITS OWN PAGE
          setEmail("");
          setPassword("");
          setLoginError("");
        })
        .catch((e) => {
          setLoginError(e.message);
        });
    }
  };

  return (
    <div>
      <h1>Choredos</h1>
      <form>
        {loginError && <div>{loginError as string}</div>}
        <div>
          <label htmlFor="email">email</label>
          <input id="email" type="email" onChange={onEmailChange} />
        </div>
        <div>
          <label htmlFor="password">password</label>
          <input id="password" type="password" onChange={onPasswordChange} />
        </div>
        <button className="btn" onClick={(e) => onLogin(e)}>
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
