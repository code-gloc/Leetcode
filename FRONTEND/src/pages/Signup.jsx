import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../authSlice";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const signupSchema = z.object({
  firstName: z.string().min(3, "Minimum characters should be 3"),
  email: z.string().email("Invalid Email"),
  password: z.string().min(8, "Password is too weak"),
});

function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });

  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    dispatch(registerUser(data));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-indigo-900 p-6">
      <div className="w-full max-w-md">
        <div className="card bg-gray-900/90 backdrop-blur-sm shadow-lg border border-gray-700 rounded-2xl p-8">
          <h2 className="text-4xl font-bold text-center text-white mb-6">
            Create Account
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* First Name */}
            <div>
              <label className="label text-gray-300 font-medium">First Name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-3 text-gray-500" />
                <input
                  type="text"
                  placeholder="John"
                  className={`input input-bordered w-full pl-10 rounded-lg bg-gray-800 text-white border-gray-600 focus:border-indigo-400 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 ${
                    errors.firstName ? "input-error border-red-600" : ""
                  }`}
                  {...register("firstName")}
                />
              </div>
              {errors.firstName && (
                <p className="text-red-500 mt-1 text-sm">{errors.firstName.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="label text-gray-300 font-medium">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-3 text-gray-500" />
                <input
                  type="email"
                  placeholder="john@example.com"
                  className={`input input-bordered w-full pl-10 rounded-lg bg-gray-800 text-white border-gray-600 focus:border-indigo-400 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 ${
                    errors.email ? "input-error border-red-600" : ""
                  }`}
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 mt-1 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="label text-gray-300 font-medium">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-3 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`input input-bordered w-full pl-10 pr-10 rounded-lg bg-gray-800 text-white border-gray-600 focus:border-indigo-400 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 ${
                    errors.password ? "input-error border-red-600" : ""
                  }`}
                  {...register("password")}
                />
                <span
                  className="absolute right-3 top-3 cursor-pointer text-gray-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </span>
              </div>
              {errors.password && (
                <p className="text-red-500 mt-1 text-sm">{errors.password.message}</p>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="btn btn-primary w-full rounded-lg text-lg font-semibold tracking-wide hover:scale-105 transition-transform duration-200"
            >
              Sign Up
            </button>
          </form>

          {/* Divider */}
          <div className="divider text-gray-400 my-8">OR</div>

          {/* Social Login Buttons */}
          <div className="flex flex-col gap-4">
            <button className="btn btn-outline text-white border-gray-600 hover:bg-indigo-600 hover:border-indigo-600 rounded-lg">
              Continue with Google
            </button>
            <button className="btn btn-outline text-white border-gray-600 hover:bg-purple-600 hover:border-purple-600 rounded-lg">
              Continue with GitHub
            </button>
          </div>

          {/* Footer */}
          <p className="text-center mt-6 text-gray-400 text-sm">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-indigo-400 font-medium hover:underline"
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
