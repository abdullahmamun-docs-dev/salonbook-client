"use client";

import { useEffect, useState } from "react";

export default function AdminTestPage() {
  const [result, setResult] = useState("Checking...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testAdminAccess = async () => {
      try {
        const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/api/admin/test`,
  {
    credentials: "include",
  }
);

        const data = await response.json();

        setResult(
          `${response.status}: ${
            data.message || "No message"
          }`
        );
      } catch (error) {
        console.error(error);
        setResult("Request failed");
      } finally {
        setLoading(false);
      }
    };

    testAdminAccess();
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "40px",
      }}
    >
      <div>
        <h1>Admin Access Test</h1>

        {loading ? (
          <p>Checking...</p>
        ) : (
          <p>{result}</p>
        )}
      </div>
    </main>
  );
}