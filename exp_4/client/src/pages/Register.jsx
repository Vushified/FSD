import { useState } from "react";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setMessage("Please fill in all fields.");
      return;
    }
    if (formData.password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }
    setMessage("Registration successful!");
  }

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-16">
      <div className="mx-auto max-w-md rounded-xl bg-white p-8 shadow-md">
        <h1 className="text-3xl font-bold text-slate-900">
          Create Account
        </h1>
        <p className="mt-2 text-slate-600">
          Register to start exploring events.
        </p>
        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4"
        >
          {/* Name */}
          <div>
            <label className="mb-1 block font-medium">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          {/* Email */}
          <div>
            <label className="mb-1 block font-medium">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          {/* Password */}
          <div>
            <label className="mb-1 block font-medium">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700"
          >
            Register
          </button>
          {message && (
            <p className="mt-4 text-center font-semibold text-indigo-600">
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default Register;
