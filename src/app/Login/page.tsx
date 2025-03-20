"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Admin"); // Default role
  const [error, setError] = useState<string | null>(null);

  function routeToForgotPassword(){
    router.push("/ForgotPassword");
  }

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'login',
          email,
          password,
          role,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Login successful:', data);
        router.push("/Dashboard"); // Redirect to Dashboard after successful login
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError('Something went wrong');
    }
  };

  const handleRegisterRedirect = async () => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'register',
          email,
          password,
          role,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Registration successful:', data);
        router.push("/Dashboard"); // Redirect to Login page after successful registration
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (error) {
      setError('Something went wrong');
    }
  };

  return (
    <div style={styles.loginPage}>
      <h2 style={styles.title}>Login</h2>
      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.formGroup}>
        <input
          style={styles.input}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
      </div>

      <div style={styles.formGroup}>
        <input
          style={styles.input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
      </div>

      <div style={styles.formGroup}>
        <select
          style={styles.select}
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="Admin">Admin</option>
          <option value="Doctor">Doctor</option>
          <option value="Patient">Patient</option>
        </select>
      </div>

      <button style={styles.button} onClick={handleLogin}>Login</button>

      <div style={styles.forgotPassword}>
      <a 
          href="#" 
          onClick={routeToForgotPassword} 
          style={styles.passwordLink}
        >
          Forgot Password?
        </a>
      </div>

      <div style={styles.registerLink}>
        <p style={styles.registerText}>
          Don't have an account?{" "}
          <button
            style={styles.registerButton}
            onClick={handleRegisterRedirect}
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

const styles: any = {
  loginPage: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f4f4f9',
    padding: '20px',
    boxSizing: 'border-box',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '20px',
    color: '#333',
  },
  error: {
    color: 'red',
    marginBottom: '10px',
    fontSize: '0.9rem',
  },
  formGroup: {
    marginBottom: '15px',
    width: '100%',
    maxWidth: '400px',
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '1rem',
    outline: 'none',
  },
  select: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '1rem',
    outline: 'none',
  },
  button: {
    width: '30%',
    padding: '12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
  forgotPassword: {
    marginTop: '10px',
    fontSize: '0.9rem',
    color: '#007bff',
  },
  passwordLink: {
    color: '#007bff',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  registerLink: {
    marginTop: '20px',
    fontSize: '1rem',
    color: '#333',
  },
  registerText: {
    marginBottom: '10px',
  },
  registerButton: {
    backgroundColor: 'transparent',
    border: '1px solid #007bff',
    color: '#007bff',
    padding: '10px 15px',
    borderRadius: '5px',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '10px',
  },
  registerButtonHover: {
    backgroundColor: '#007bff',
    color: 'white',
  },
};

export default LoginPage;
