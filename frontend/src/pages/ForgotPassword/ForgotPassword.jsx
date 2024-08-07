import { Helmet } from "react-helmet";
import { useState } from "react";
import axios from "axios";
import "./ForgotPassword.css";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next"; // Import useTranslation

export default function ForgotPassword() {
  const { t } = useTranslation(); // Initialize useTranslation
  const [email, setEmail] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/auth/forgot-password`,
        {
          email,
        },
      );
      console.log(response);
      if (response.status === 200) alert("Email was sent");
    } catch (error) {
      if (error.response.status === 404) alert("User not found");
      else alert("Server error");
    }
  };
  return (
    <div className="forgot-password-container main-wrapper">
      <Helmet>
        <title>{t("forgotPassword")}</title>
      </Helmet>
      <h1>{t("forgotPassword")}</h1>
      <form onSubmit={handleSubmit}>
        <input
          required={true}
          type="email"
          id="email"
          placeholder={t("email")}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">
          {t("submit")} <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </form>
    </div>
  );
}
