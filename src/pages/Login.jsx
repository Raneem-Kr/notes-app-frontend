import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://notes-app-backend-6vkp.onrender.com/api/auth/login",
        {
          email,
          password,
        },
      );
      localStorage.setItem("token", response.data.token);
      toast.success("Login successful");
      navigate("/notes");
    } catch (error) {
      console.log(error.response.data);
      toast.error(error.respnse.data.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 p-5">
        <h1 className="text-3xl font-bold text-center mb-2"> Welcome</h1>
        <p className="text-slate-400 text-center mb-8">
          {" "}
          Login to manage your notes
        </p>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block mb-2 text-sm text-slate-300"> Email </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl  bg-slate-800 border border-slate-700 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-slate-300">
              {" "}
              Password{" "}
            </label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate800 border border-slate-700 outline-none focus:border-blue-500"
            ></input>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold transition"
          >
            {" "}
            Login{" "}
          </button>
        </form>

        <p className="text-center text-slate-400 mt-6">
          {" "}
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-blue-400 hover:text-blue-300">
            {" "}
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
