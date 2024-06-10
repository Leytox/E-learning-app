import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import UserContext from "../../../UserContext.jsx";
import { Helmet } from "react-helmet";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    if (Cookies.get("token")) setRedirect(true);
  }, []);

  async function Login(event) {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        },
      );
      if (response.status === 200) setRedirect(true);
      if (response.data.token)
        Cookies.set("token", response.data.token, { expires: 1 });
      if (response.data.id) Cookies.set("id", response.data.id, { expires: 1 });
      if (response.data.username) {
        Cookies.set("username", response.data.username, { expires: 1 });
        setUser({ username: response.data.username });
      }
      if (response.data.role)
        Cookies.set("role", response.data.role, { expires: 1 });
    } catch (err) {
      setError(true);
    }
  }

  if (redirect) navigate("/");
  return (
    <form onSubmit={Login}>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <h1>Welcome back</h1>
      <input
        type="email"
        id="email"
        name="email"
        placeholder={"Email"}
        required={true}
        onChange={(event) => setEmail(event.target.value)}
      />
      <input
        type="password"
        id="password"
        name="password"
        placeholder={"Password"}
        required={true}
        onChange={(event) => setPassword(event.target.value)}
      />
      <button type={"submit"}>Continue</button>
      <p>
        Don&apos;t have an account?{" "}
        <Link to={"/signup"} style={{ color: "#007bff" }}>
          Sign up
        </Link>
      </p>
      {error && <p style={{ color: "red" }}>Invalid email or password</p>}
    </form>
  );
}
