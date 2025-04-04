import { useState, useEffect } from "react";
import './form.css';
import loginPhoto from './Img/LoginPh.png';
import welcomePhoto from './Img/correctData.png';
import wrongPhoto from './Img/wrongData.png';
import firstChance from './Img/firstChance.png';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [attempts, setAttempts] = useState(0);
  const [validationError, setValidationError] = useState(""); // لإظهار أخطاء الإدخال

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setValidationError("البريد الإلكتروني غير صحيح! يرجى إدخال بريد إلكتروني صالح.");
      return;
    }

    if (password.length < 6) {
      setValidationError("كلمة المرور يجب أن تكون على الأقل 6 أحرف!");
      return;
    }

    setValidationError(""); // مسح الأخطاء عند التحقق بنجاح

    const response = await fetch("http://localhost:8000/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.access_token) {
      localStorage.setItem("token", data.access_token);
      setSuccess(true);
      setCountdown(3);
    } else {
      setAttempts(attempts + 1);
      setError(true);
      setCountdown(3);
    }
  };

  useEffect(() => {
    if (success && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (success && countdown === 0) {
      window.location.href = "/";
    }
  }, [success, countdown]);

  useEffect(() => {
    if (error && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (error && countdown === 0) {
      if (attempts >= 2) {
        window.location.href = "/";
      } else {
        setError(false);
      }
    }
  }, [error, countdown, attempts]);

  return (
    <div className="LoginContainer">
    <div className="form">
      {success ? (
        <>
          <img src={welcomePhoto} alt="مرحبًا بعودتك" width="300px" height="300px" />
          <h1>مرحبًا بعودتك! سيتم توجيهك بعد {countdown} ثوانٍ...</h1>
        </>
      ) : error ? (
        attempts >= 2 ? (
          <>
            <img src={wrongPhoto} alt="خطأ" width="300px" height="300px" />
            <h1>تم استنفاد المحاولات! سيتم تحويلك إلى مستر موبايل ستور بعد {countdown} ثوانٍ...</h1>
          </>
        ) : (
          <>
            <img src={firstChance} alt="خطأ" width="300px" height="300px" />
            <h1>معاك محاولة تاني بعد {countdown} ثوانٍ</h1>
          </>
        )
      ) : (
        <>
          <img src={loginPhoto} alt="تسجيل الدخول" width="300px" height="300px" />
          <p>Welcome to MR Mobile dashboard. Please enter the correct username and password to log in.</p>
          <form onSubmit={handleLogin}>
            {validationError && <p style={{ color: "red" }}>{validationError}</p>}
            <input type="email" placeholder="البريد الإلكتروني" onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="كلمة المرور" onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">تسجيل الدخول</button>
          </form>
        </>
      )}
    </div>
    </div>
  );
};

export default Login;