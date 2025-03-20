"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const PasswordResetPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handlePasswordReset = async () => {
    if (!email) {
      setError("Please enter your registered email.");
      return;
    }

    try {
      // Simulating a request for password reset email
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'reset-password',
          email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Password reset email sent:', data);
        // Redirect or show success message (could also add a state for confirmation)
        router.push("/login"); // Redirect to login after successful reset request
      } else {
        setError(data.message || 'Password reset failed');
      }
    } catch (error) {
      setError('Something went wrong');
    }
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>Reset Your Password</h2>
      <p style={styles.instructions}>
        To reset your password, please follow these simple steps:
        <ol style={styles.instructionsList}>
          <li>Enter your email address.</li>
          <li>Check your inbox for the 'Password Reset Request' email from us.</li>
          <li>Open the email and click on the 'Reset Password' button.</li>
          <li>You will be prompted to enter your new password.</li>
          <li>Click 'Update' to finalize the password reset process.</li>
        </ol>
        Once your password is updated, use the new credentials to sign in to MocDoc.
      </p>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.formGroup}>
        <input
          style={styles.input}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Registered Email"
        />
      </div>

      <button style={styles.button} onClick={handlePasswordReset}>Submit</button>
    </div>
  );
};

const styles: any = {
  page: {
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
  instructions: {
    fontSize: '1rem',
    color: '#333',
    lineHeight: '1.6',
    marginBottom: '30px',
    maxWidth: '600px',
    textAlign: 'center',
  },
  instructionsList: {
    paddingLeft: '20px',
    textAlign: 'left',
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
  button: {
    width: '25%',
    padding: '12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};

export default PasswordResetPage;
