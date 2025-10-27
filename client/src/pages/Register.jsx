import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../utils/auth";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await register({ name, email, password });
      localStorage.setItem("cloudscape_token", data.token);
      localStorage.setItem("cloudscape_user", JSON.stringify({ _id: data._id, name: data.name, email: data.email }));
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create your Cloudscape account</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Full name"
          required
          className="w-full border p-2 rounded"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
          required
          className="w-full border p-2 rounded"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          required
          className="w-full border p-2 rounded"
        />
        <button disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded">
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>
    </div>
  );
};

export default Register;
