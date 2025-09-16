"use client";
import Link from "next/link";
import { useState } from "react";
import styles from "./page.module.css"; // <— import CSS module

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Logging in:", { email, password });
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-screen">

      <h1 className={styles.heading}>Welcome to Canvas!</h1>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <input
          type="email"
          placeholder="User ID"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.inputBox}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.inputBox}
        />
        <Link href="/dashboard" className={styles.submitBtn}>
                Sign In
        </Link>
      </form>
    </section>
  );
}
