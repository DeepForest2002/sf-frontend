import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:5000";

function App() {
  const [rules, setRules] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (window.location.search.includes("loggedIn=true")) {
      setLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    window.location.href = `${API}/auth/login`;
  };

  const fetchRules = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/api/validation-rules`);
      setRules(data);
    } catch (err) {
      alert("Error fetching rules");
    }
    setLoading(false);
  };

  const toggleRule = async (id, currentActive) => {
    try {
      await axios.patch(`${API}/api/validation-rules/${id}`, {
        active: !currentActive,
      });
      setRules(
        rules.map((r) => (r.Id === id ? { ...r, Active: !currentActive } : r)),
      );
    } catch (err) {
      alert("Error updating rule");
    }
  };

  const toggleAll = async (activate) => {
    for (const rule of rules) {
      await axios.patch(`${API}/api/validation-rules/${rule.Id}`, {
        active: activate,
      });
    }
    setRules(rules.map((r) => ({ ...r, Active: activate })));
  };

  return (
    <div
      style={{
        padding: "4rem",
        fontFamily: "sans-serif",
        maxWidth: 800,
        margin: "0 auto",
      }}
    >
      <h1>Salesforce Validation Manager</h1>

      {!loggedIn ? (
        <button onClick={handleLogin} style={btnStyle("#0070d2")}>
          🔐 Login to Salesforce
        </button>
      ) : (
        <>
          <button onClick={fetchRules} style={btnStyle("#0070d2")}>
            📋 Get Validation Rules
          </button>

          {rules.length > 0 && (
            <>
              <button
                onClick={() => toggleAll(true)}
                style={btnStyle("#4caf50")}
              >
                ✅ Enable All
              </button>
              <button
                onClick={() => toggleAll(false)}
                style={btnStyle("#f44336")}
              >
                ❌ Disable All
              </button>

              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginTop: "1rem",
                }}
              >
                <thead>
                  <tr style={{ background: "#f0f0f0" }}>
                    <th style={th}>Rule Name</th>
                    <th style={th}>Status</th>
                    <th style={th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rules.map((rule) => (
                    <tr key={rule.Id}>
                      <td style={td}>{rule.ValidationName}</td>
                      <td style={td}>
                        <span
                          style={{
                            color: rule.Active ? "green" : "red",
                            fontWeight: "bold",
                          }}
                        >
                          {rule.Active ? "● Active" : "● Inactive"}
                        </span>
                      </td>
                      <td style={td}>
                        <button
                          onClick={() => toggleRule(rule.Id, rule.Active)}
                          style={btnStyle(rule.Active ? "#f44336" : "#4caf50")}
                        >
                          {rule.Active ? "Deactivate" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
          {loading && <p>Loading...</p>}
        </>
      )}
    </div>
  );
}

const btnStyle = (bg) => ({
  background: bg,
  color: "white",
  border: "none",
  padding: "8px 16px",
  margin: "10px",
  borderRadius: 4,
  cursor: "pointer",
  fontWeight: "bold",
});
const th = { border: "1px solid #ddd", padding: "10px", textAlign: "left" };
const td = { border: "1px solid #ddd", padding: "10px" };

export default App;
