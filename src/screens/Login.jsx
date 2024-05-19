import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate,useLocation } from "react-router-dom";
import { datacontext } from "../Datacontext";
import Loader from "../components/Loader";
import banner from "../Images/banner.jpg";

export default function Login() {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [err, seterr] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const { tokenState, setTokenState } = useContext(datacontext);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (tokenState) {
      navigate("/");
    }else{
      if(location.pathname==='/register'){
        navigate('/register')
      }else{
        navigate('/login)
      }
    }
  }, [tokenState, navigate]);
  const handleloginsubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!validation(loginData)) {
        setIsLoading(false);
        return;
      }
      const response = await fetch("https://rentify-backend-nine.vercel.app/api/loginuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setIsLoading(false);
        alert("You have successfully logged in.");
        setLoginData({
          email: "",
          password: "",
        });
        seterr({
          email: "",
          password: "",
        });
        setTokenState(true);
      } else {
        if (data.message.email) {
          setIsLoading(false);
          seterr({
            email: "Use the Email used to create your account.",
            password: "",
          });
        }
        if (data.message.password) {
          setIsLoading(false);
          seterr({ email: "", password: "Enter correct password." });
        }
      }
    } catch (error) {
      setIsLoading(false);
      alert("Server Error.");
    }
  };
  const validation = (data) => {
    let isValid = true;
    const errors = { email: "", password: "" };
    if (!data.email) {
      errors.email = "Email required.";
      isValid = false;
    } else {
      if (!isValidEmail(data.email)) {
        errors.email = "Invalid email format.";
        isValid = false;
      }
    }
    if (!data.password) {
      errors.password = "Password required.";
      isValid = false;
    } else {
      if (isValidPassword(data.password).length === 0) {
        if (data.password.length < 8) {
          errors.password = "Password must be min 8 characters";
          isValid = false;
        }
      }
      if (isValidPassword(data.password).length > 0) {
        if (data.password.length < 8) {
          errors.password = "Password must be min 8 characters";
          const passerr = isValidPassword(data.password);
          errors.password =
            errors.password + " and must contain atleast " + passerr.join(" ");
          isValid = false;
        } else {
          const passerr = isValidPassword(data.password);

          errors.password =
            "Password must atleast contain " + passerr.join(" ");
          isValid = false;
        }
      }
    }

    seterr(errors);
    return isValid;
  };

  const isValidEmail = (email) => {
    const emailRegex =
      /[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,8}(.[a-z{2,8}])?/g;
    return emailRegex.test(email);
  };

  const isValidPassword = (password) => {
    let errors = [];
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push("one uppercase letter");
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push("one lowercase letter");
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push("one number");
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      errors.push("one special character");
    }
    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  return (
    <section className="bg-white flex justify-between h-screen w-full">
      {isLoading ? <Loader /> : ""}
      <div className="w-1/2">
        <img src={banner} className="w-full h-full" alt="banner" />
      </div>
      <div className="w-1/2 flex justify-center items-center">
        <form onSubmit={handleloginsubmit} className="w-5/6">
          <h1 className="text-center text-xl underline underline-offset-8 font-bold text-green-600">
            LOG IN TO YOUR RENTIFY ACCOUNT
          </h1>
          <div className="flex flex-col w-full mt-6">
            <label htmlFor="email" className="text-gray-950 mb-1">
              Email
            </label>
            <input
              type="text"
              placeholder="Enter Email"
              id="email"
              name="email"
              className={`outline-none border py-3 px-2 w-full rounded drop-shadow-md ${
                err.email ? "border-red-500" : "border-gray-300"
              }`}
              value={loginData.email}
              onChange={handleInputChange}
            />
            <span className="text-red-500 text-center">{err.email}</span>
          </div>
          <div className="flex flex-col w-full mt-2">
            <label htmlFor="password" className="text-gray-950 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              id="password"
              name="password"
              className={`outline-none border py-3 px-2 w-full rounded drop-shadow-md ${
                err.password ? "border-red-500" : "border-gray-300"
              }`}
              value={loginData.password}
              onChange={handleInputChange}
            />
            <span className="text-red-500 text-center">{err.password}</span>
          </div>
          <div className="flex w-full mt-4">
            <input
              type="checkbox"
              name="check"
              id="check"
              required
              className="accent-green-600"
            />
            <label htmlFor="check" className="text-gray-950 ml-2">
              Keep me logged in.
            </label>
          </div>
          <div className="flex flex-col w-full mt-4 justify-center items-center">
            <input
              type="submit"
              value="Login"
              className="px-6 py-3 rounded bg-green-600 text-white w-full drop-shadow-md cursor-pointer"
            />
            <span className="flex text-gray-950 w-full mt-2">
              Don't have an account?
              <Link to="/register" className="underline ml-4">
                Register
              </Link>
            </span>
          </div>
        </form>
      </div>
    </section>
  );
}
