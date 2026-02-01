import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.code}>404</h1>
        <h2 style={styles.title}>Page not found</h2>
        <p style={styles.desc}>
          The page you are looking for doesn’t exist or the route is incorrect.
        </p>

        <div style={styles.buttons}>
          <button style={styles.primary} onClick={() => navigate("/")}>
            Go to Home
          </button>
          <button style={styles.secondary} onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    color: "#fff",
    fontFamily: "system-ui, sans-serif",
  },
  card: {
    textAlign: "center",
    padding: "40px",
    borderRadius: "12px",
    background: "#111827",
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
    maxWidth: "420px",
  },
  code: {
    fontSize: "72px",
    margin: "0",
    fontWeight: 700,
  },
  title: {
    margin: "10px 0",
    fontSize: "24px",
  },
  desc: {
    fontSize: "14px",
    color: "#9ca3af",
    marginBottom: "30px",
  },
  buttons: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
  },
  primary: {
    padding: "10px 18px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    background: "#3b82f6",
    color: "#fff",
    fontWeight: 600,
  },
  secondary: {
    padding: "10px 18px",
    borderRadius: "8px",
    border: "1px solid #374151",
    cursor: "pointer",
    background: "transparent",
    color: "#d1d5db",
    fontWeight: 600,
  },
};
