"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link.");
      return;
    }

    fetch(`/api/auth/verify?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setStatus("error");
          setMessage(data.error);
        } else {
          setStatus("success");
          setMessage(data.message || "Your email is verified. You can now log in.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      });
  }, [token]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", maxWidth: 400, padding: "0 24px" }}>
        {status === "loading" && <p>Verifying your email...</p>}

        {status === "success" && (
          <>
            <h2 style={{ marginBottom: 12 }}>✅ Your email is verified</h2>
            <p style={{ color: "#555" }}>{message}</p>
            <a
              href="/login"
              style={{
                display: "inline-block",
                marginTop: 20,
                padding: "10px 24px",
                background: "#111",
                color: "#fff",
                borderRadius: 6,
                textDecoration: "none",
              }}
            >
              Log in
            </a>
          </>
        )}

        {status === "error" && (
          <>
            <h2 style={{ marginBottom: 12 }}>❌ Invalid or expired link</h2>
            <p style={{ color: "#555" }}>{message}</p>
            <a
              href="/login"
              style={{
                display: "inline-block",
                marginTop: 20,
                padding: "10px 24px",
                background: "#111",
                color: "#fff",
                borderRadius: 6,
                textDecoration: "none",
              }}
            >
              Back to login
            </a>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: "center", padding: 40 }}>Loading...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
