import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

// Configure axios base URL
const api = axios.create({
    baseURL: "http://localhost:5000/api",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

function App() {
    // ===== STATES =====
    // Exercise 2 & 3
    const [num1, setNum1] = useState("");
    const [result, setResult] = useState(null);

    // Exercise 4
    const [logs, setLogs] = useState([]);

    // PostgreSQL
    const [calculations, setCalculations] = useState([]);

    // OTP
    const [otp, setOtp] = useState("");
    const [otpMessage, setOtpMessage] = useState("");
    const [otpSuccess, setOtpSuccess] = useState(null);

    // Like & Comments
    const [likes, setLikes] = useState(0);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    // ===== LIFECYCLE =====
    useEffect(() => {
        loadLikes();
        loadComments();
    }, []);

    // ===== HELPER FUNCTIONS =====
    const addLog = (message) => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs((prev) => [...prev, `[${timestamp}] ${message}`]);
    };

    // ===== EXERCISE 1: TEST CONNECTION =====
    const testConnection = async () => {
        try {
            const response = await api.get("/hello");
            alert(`✓ ${response.data.message}`);
            console.log("Backend response:", response.data);
        } catch (error) {
            console.error("Connection error:", error);
            alert(
                "✗ Connection failed! Make sure backend is running on port 5000"
            );
        }
    };

    // ===== EXERCISE 2 & 3: SEND DATA TO SERVER =====
    const handleAddNumber = async () => {
        if (!num1 && num1 !== "0") {
            alert("Please enter a number!");
            return;
        }

        try {
            // This is the AJAX call - no page reload!
            const response = await api.post("/add", { num1: num1 });

            setResult(response.data);
            alert(`Result: ${response.data.result}`);

            // Save to database
            await saveToDatabase(num1, response.data.result);

            console.log("Server response:", response.data);
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to process request");
        }
    };

    // ===== EXERCISE 4: ASYNCHRONOUS AJAX =====
    const handleAsyncRequests = async () => {
        setLogs([]);
        addLog("🚀 Starting ASYNCHRONOUS requests...");
        addLog("Both requests sent simultaneously (non-blocking)");

        // Both start at the same time (don't wait for each other)
        hit1Async();
        hit2Async();
    };

    const hit1Async = async () => {
        addLog("📡 hit1: Calling SLOW endpoint (5 second delay)...");
        try {
            const response = await api.get("/slow");
            addLog(`✅ hit1: ${response.data.message}`);
        } catch (error) {
            addLog(`❌ hit1: Error - ${error.message}`);
        }
    };

    const hit2Async = async () => {
        addLog("📡 hit2: Calling FAST endpoint...");
        try {
            const response = await api.get("/fast");
            addLog(`✅ hit2: ${response.data.message}`);
        } catch (error) {
            addLog(`❌ hit2: Error - ${error.message}`);
        }
    };

    // ===== EXERCISE 4: SYNCHRONOUS AJAX =====
    const handleSyncRequests = async () => {
        setLogs([]);
        addLog("🔒 Starting SYNCHRONOUS requests...");
        addLog("Second request will WAIT for first to complete");

        // Wait for each to finish before starting the next
        await hit1Sync();
        await hit2Sync();

        addLog("✅ All requests completed!");
    };

    const hit1Sync = async () => {
        addLog("📡 hit1: Calling SLOW endpoint (5 second delay)...");
        try {
            const response = await api.get("/slow");
            addLog(`✅ hit1: ${response.data.message}`);
        } catch (error) {
            addLog(`❌ hit1: Error - ${error.message}`);
        }
    };

    const hit2Sync = async () => {
        addLog("📡 hit2: Calling FAST endpoint...");
        try {
            const response = await api.get("/fast");
            addLog(`✅ hit2: ${response.data.message}`);
        } catch (error) {
            addLog(`❌ hit2: Error - ${error.message}`);
        }
    };

    // ===== POSTGRESQL FUNCTIONS =====
    const setupDatabase = async () => {
        try {
            const response = await api.get("/setup-database");
            alert(response.data.message);
            console.log("Database setup:", response.data);
        } catch (error) {
            console.error("Database setup error:", error);
            alert("Database setup failed. Check console for details.");
        }
    };

    const saveToDatabase = async (input, resultValue) => {
        try {
            const response = await api.post("/save-calculation", {
                num1: input,
                result: resultValue,
            });
            console.log("Saved to database:", response.data);
            loadCalculations();
        } catch (error) {
            console.error("Error saving to database:", error);
        }
    };

    const loadCalculations = async () => {
        try {
            const response = await api.get("/calculations");
            setCalculations(response.data.calculations || []);
            console.log("Loaded calculations:", response.data);
        } catch (error) {
            console.error("Error loading calculations:", error);
            setCalculations([]);
        }
    };

    const clearCalculations = async () => {
        if (!window.confirm("Delete all calculations from database?")) {
            return;
        }

        try {
            await api.delete("/calculations");
            setCalculations([]);
            alert("All calculations deleted!");
        } catch (error) {
            console.error("Error deleting calculations:", error);
            alert("Failed to delete calculations");
        }
    };

    // ===== REAL-WORLD EXAMPLE: OTP VERIFICATION =====
    const verifyOtp = async () => {
        if (!otp) {
            setOtpMessage("Please enter OTP");
            setOtpSuccess(false);
            return;
        }

        try {
            const response = await api.post("/verify-otp", { otp: otp });
            setOtpMessage(response.data.message);
            setOtpSuccess(response.data.success);

            if (response.data.success) {
                setTimeout(() => {
                    setOtp("");
                    setOtpMessage("");
                    setOtpSuccess(null);
                }, 2000);
            }
        } catch (error) {
            setOtpMessage("Verification failed. Please try again.");
            setOtpSuccess(false);
        }
    };

    // ===== REAL-WORLD EXAMPLE: LIKES & COMMENTS =====
    const handleLike = async () => {
        try {
            const response = await api.post("/like");
            setLikes(response.data.likes);
        } catch (error) {
            console.error("Error liking:", error);
        }
    };

    const loadLikes = async () => {
        try {
            const response = await api.get("/likes");
            setLikes(response.data.likes);
        } catch (error) {
            console.error("Error loading likes:", error);
        }
    };

    const handleComment = async () => {
        if (!newComment.trim()) {
            return;
        }

        try {
            const response = await api.post("/comment", {
                comment: newComment,
            });
            setComments(response.data.comments);
            setNewComment("");
        } catch (error) {
            console.error("Error posting comment:", error);
            alert("Failed to post comment");
        }
    };

    const loadComments = async () => {
        try {
            const response = await api.get("/comments");
            setComments(response.data.comments || []);
        } catch (error) {
            console.error("Error loading comments:", error);
        }
    };

    // ===== RENDER =====
    return (
        <div className="app-container">
            <div className="main-content">
                {/* ===== HEADER ===== */}
                <div className="card">
                    <h1>🚀 AJAX Lab - Complete Implementation</h1>
                    <p className="subtitle">
                        React + Axios + Express.js + PostgreSQL
                        <span className="badge badge-success">
                            All Exercises
                        </span>
                    </p>
                    <button
                        onClick={testConnection}
                        className="button button-success"
                    >
                        Test Backend Connection
                    </button>
                </div>

                {/* ===== EXERCISE 2 & 3: SEND DATA ===== */}
                <div className="card">
                    <h2>📝 Exercise 2 & 3: Send Data Without Page Reload</h2>
                    <p className="subtitle">
                        Your PHP Lab: Enter number → Server adds 20 → Display
                        result (NO RELOAD!)
                    </p>

                    <div className="input-group">
                        <input
                            type="number"
                            className="input"
                            value={num1}
                            onChange={(e) => setNum1(e.target.value)}
                            placeholder="Enter a number (e.g., 5)"
                            onKeyPress={(e) =>
                                e.key === "Enter" && handleAddNumber()
                            }
                        />
                        <button onClick={handleAddNumber} className="button">
                            Click Here (Send to Server)
                        </button>
                    </div>

                    {result && (
                        <div className="result-box success">
                            <h3>✅ Result from Server:</h3>
                            <p
                                style={{
                                    fontSize: "1.5em",
                                    fontWeight: "bold",
                                    color: "#2d3748",
                                }}
                            >
                                {result.result}
                            </p>
                            <p style={{ color: "#4a5568", marginTop: "10px" }}>
                                {result.message}
                            </p>
                            <p
                                style={{
                                    fontSize: "0.9em",
                                    color: "#718096",
                                    marginTop: "10px",
                                }}
                            >
                                💾 Automatically saved to PostgreSQL database
                            </p>
                        </div>
                    )}

                    <div
                        style={{
                            marginTop: "20px",
                            padding: "15px",
                            background: "#f7fafc",
                            borderRadius: "8px",
                        }}
                    >
                        <h4 style={{ color: "#4a5568", marginBottom: "10px" }}>
                            📖 What's happening:
                        </h4>
                        <ol
                            style={{
                                color: "#718096",
                                lineHeight: "1.8",
                                paddingLeft: "20px",
                            }}
                        >
                            <li>You enter a number</li>
                            <li>
                                Click button → Axios sends POST request to{" "}
                                <code>/api/add</code>
                            </li>
                            <li>Express server receives data, adds 20</li>
                            <li>Server sends result back</li>
                            <li>
                                React displays result →{" "}
                                <strong>NO PAGE RELOAD!</strong>
                            </li>
                            <li>Data saved to PostgreSQL database</li>
                        </ol>
                    </div>
                </div>

                {/* ===== EXERCISE 4: ASYNC vs SYNC ===== */}
                <div className="card">
                    <h2>⚡ Exercise 4: Asynchronous vs Synchronous AJAX</h2>
                    <p className="subtitle">
                        Your PHP Lab: Understanding async: true vs async: false
                    </p>

                    <div className="grid-2">
                        <div className="async-box">
                            <h3>🔄 Asynchronous (Non-blocking)</h3>
                            <p
                                style={{
                                    fontSize: "0.9em",
                                    color: "#2c5282",
                                    marginBottom: "15px",
                                }}
                            >
                                Both requests start at the SAME TIME. Fast one
                                finishes first!
                            </p>
                            <button
                                onClick={handleAsyncRequests}
                                className="button"
                            >
                                Run Async Requests
                            </button>
                            <div
                                style={{
                                    marginTop: "10px",
                                    fontSize: "0.85em",
                                    color: "#2c5282",
                                }}
                            >
                                Expected: "fast" logs first, then "slow" (after
                                5 sec)
                            </div>
                        </div>

                        <div className="sync-box">
                            <h3>🔒 Synchronous (Blocking)</h3>
                            <p
                                style={{
                                    fontSize: "0.9em",
                                    color: "#744210",
                                    marginBottom: "15px",
                                }}
                            >
                                Second request WAITS for first. Total time = 5+
                                seconds
                            </p>
                            <button
                                onClick={handleSyncRequests}
                                className="button button-warning"
                            >
                                Run Sync Requests
                            </button>
                            <div
                                style={{
                                    marginTop: "10px",
                                    fontSize: "0.85em",
                                    color: "#744210",
                                }}
                            >
                                Expected: "slow" (5 sec), then "fast"
                                immediately after
                            </div>
                        </div>
                    </div>

                    <div className="console">
                        <div className="console-header">
                            📟 Console Output (Watch the timing!):
                        </div>
                        {logs.length === 0 ? (
                            <div className="console-empty">
                                Click a button above to see AJAX requests in
                                action...
                            </div>
                        ) : (
                            logs.map((log, index) => (
                                <div key={index} className="log-entry">
                                    {log}
                                </div>
                            ))
                        )}
                    </div>

                    <div
                        style={{
                            marginTop: "20px",
                            padding: "15px",
                            background: "#fffaf0",
                            borderRadius: "8px",
                            border: "2px solid #fbd38d",
                        }}
                    >
                        <h4 style={{ color: "#744210", marginBottom: "10px" }}>
                            💡 Key Concept:
                        </h4>
                        <p style={{ color: "#744210", lineHeight: "1.6" }}>
                            <strong>Asynchronous:</strong> Your code continues
                            running while waiting for server response. Multiple
                            requests can run at once. This is the DEFAULT and
                            recommended approach.
                            <br />
                            <br />
                            <strong>Synchronous:</strong> Your code STOPS and
                            waits for server response before continuing. This
                            blocks the UI and is generally NOT recommended.
                        </p>
                    </div>
                </div>

                {/* ===== POSTGRESQL DATABASE ===== */}
                <div className="card">
                    <h2>🗄️ PostgreSQL Database Integration</h2>
                    <p className="subtitle">
                        All calculations are automatically saved to PostgreSQL
                    </p>

                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                            marginBottom: "20px",
                            flexWrap: "wrap",
                        }}
                    >
                        <button
                            onClick={setupDatabase}
                            className="button"
                            style={{ background: "#9333ea" }}
                        >
                            Setup Database Table
                        </button>
                        <button onClick={loadCalculations} className="button">
                            Refresh Calculations
                        </button>
                        <button
                            onClick={clearCalculations}
                            className="button button-danger"
                        >
                            Clear All Data
                        </button>
                    </div>

                    {calculations.length === 0 ? (
                        <div
                            style={{
                                padding: "20px",
                                background: "#f7fafc",
                                borderRadius: "8px",
                                textAlign: "center",
                                color: "#718096",
                            }}
                        >
                            No calculations yet. Try the "Send Data" exercise
                            above!
                        </div>
                    ) : (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Input Value</th>
                                        <th>Result (Input + 20)</th>
                                        <th>Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {calculations.map((calc) => (
                                        <tr key={calc.id}>
                                            <td>#{calc.id}</td>
                                            <td>{calc.input_value}</td>
                                            <td>
                                                <strong>{calc.result}</strong>
                                            </td>
                                            <td>
                                                {new Date(
                                                    calc.created_at
                                                ).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* ===== REAL-WORLD EXAMPLES ===== */}
                <h2
                    style={{
                        color: "white",
                        textAlign: "center",
                        marginBottom: "20px",
                    }}
                >
                    🌟 Real-World AJAX Examples
                </h2>

                <div className="grid-2">
                    {/* OTP VERIFICATION */}
                    <div className="card">
                        <h3>🔐 OTP Verification</h3>
                        <p className="subtitle">
                            Like banking apps - verify code without reload
                        </p>

                        <div
                            style={{
                                padding: "15px",
                                background: "#ebf8ff",
                                borderRadius: "8px",
                                marginBottom: "15px",
                            }}
                        >
                            <p style={{ fontSize: "0.9em", color: "#2c5282" }}>
                                <strong>Try it:</strong> Enter{" "}
                                <code>123456</code> for success, or any other
                                code for failure
                            </p>
                        </div>

                        <div className="input-group">
                            <input
                                type="text"
                                className="input"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="Enter OTP (try: 123456)"
                                maxLength={6}
                                onKeyPress={(e) =>
                                    e.key === "Enter" && verifyOtp()
                                }
                            />
                            <button onClick={verifyOtp} className="button">
                                Verify OTP
                            </button>
                        </div>

                        {otpMessage && (
                            <div
                                className={`result-box ${
                                    otpSuccess ? "success" : "error"
                                }`}
                            >
                                <p
                                    style={{
                                        fontSize: "1.1em",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {otpMessage}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* LIKES & COMMENTS */}
                    <div className="card">
                        <h3>👍 Likes & Comments</h3>
                        <p className="subtitle">
                            Like Facebook/Instagram - instant feedback!
                        </p>

                        <button
                            onClick={handleLike}
                            className="button like-button"
                        >
                            <span style={{ fontSize: "1.5em" }}>👍</span>
                            <span>Like</span>
                            <span className="like-count">{likes}</span>
                        </button>

                        <div className="input-group">
                            <input
                                type="text"
                                className="input"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write a comment..."
                                onKeyPress={(e) =>
                                    e.key === "Enter" && handleComment()
                                }
                            />
                            <button
                                onClick={handleComment}
                                className="button button-success"
                            >
                                Post
                            </button>
                        </div>

                        <div className="comment-list">
                            {comments.length === 0 ? (
                                <div
                                    style={{
                                        textAlign: "center",
                                        color: "#a0aec0",
                                        padding: "20px",
                                    }}
                                >
                                    No comments yet. Be the first to comment!
                                </div>
                            ) : (
                                comments.map((comment) => (
                                    <div
                                        key={comment.id}
                                        className="comment-item"
                                    >
                                        <p className="comment-text">
                                            {comment.text}
                                        </p>
                                        <p className="comment-time">
                                            {new Date(
                                                comment.timestamp
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* ===== FOOTER INFO ===== */}
                <div
                    className="card"
                    style={{ background: "#2d3748", color: "white" }}
                >
                    <h3 style={{ color: "white" }}>📚 What You've Learned:</h3>
                    <ul style={{ lineHeight: "2", paddingLeft: "20px" }}>
                        <li>
                            ✅ AJAX communication without page reload (Exercise
                            2 & 3)
                        </li>
                        <li>
                            ✅ Asynchronous vs Synchronous requests (Exercise 4)
                        </li>
                        <li>✅ PostgreSQL database integration</li>
                        <li>
                            ✅ Real-world examples: OTP verification, Likes,
                            Comments
                        </li>
                        <li>
                            ✅ Modern stack: React + Axios + Express +
                            PostgreSQL
                        </li>
                    </ul>

                    <div
                        style={{
                            marginTop: "20px",
                            padding: "15px",
                            background: "rgba(255,255,255,0.1)",
                            borderRadius: "8px",
                        }}
                    >
                        <h4 style={{ color: "white", marginBottom: "10px" }}>
                            🎯 Lab Complete!
                        </h4>
                        <p style={{ color: "#cbd5e0" }}>
                            You've successfully implemented all AJAX concepts
                            from your PHP lab using modern technologies. This is
                            how real-world web applications work!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default App;