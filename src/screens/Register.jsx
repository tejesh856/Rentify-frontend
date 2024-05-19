import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate,useLocation } from "react-router-dom";
import banner from "../Images/banner.jpg";
import Loader from "../components/Loader";
import { datacontext } from "../Datacontext";

export default function Register() {
  const { tokenState } = useContext(datacontext);
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
  const [isLoading, setIsLoading] = useState(false);
  const [signupData, setSignupData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    password: "",
  });
  const [err, seterr] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    password: "",
  });
  const handleregistersubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const validate = await validation(signupData);
      if (!validate) {
        setIsLoading(false);
        return;
      }
      const response = await fetch("https://rentify-backend-nine.vercel.app/api/createuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setIsLoading(false);
        alert(
          "You have successfully created the account, now proceed to login."
        );
        navigate("/login");
        setSignupData({
          firstname: "",
          lastname: "",
          email: "",
          phone: "",
          password: "",
        });
        seterr({
          firstname: "",
          lastname: "",
          email: "",
          phone: "",
          password: "",
        });
      } else {
        if (data.message.email) {
          setIsLoading(false);
          seterr({
            firstname: "",
            lastname: "",
            email: data.message.email[0],
            phone: "",
            password: "",
          });
        }
        if (data.message.phone) {
          setIsLoading(false);
          seterr({
            firstname: "",
            lastname: "",
            email: "",
            phone: data.message.phone[0],
            password: "",
          });
        }
        if (data.message.usercreation) {
          setIsLoading(false);
          seterr({
            firstname: "",
            lastname: "",
            email: "",
            phone: "",
            password: "",
          });
          alert(data.message.usercreation);
        }
      }
    } catch (error) {
      setIsLoading(false);
      alert("Server Error.");
    }
  };
  const validation = async (data) => {
    let isValid = true;
    const errors = {
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      password: "",
    };
    if (!data.firstname) {
      errors.firstname = "FullName required.";
      isValid = false;
    } else {
      if (data.firstname.length < 3) {
        errors.firstname = "FullName must be atleast 3  characters.";
        isValid = false;
      }
    }
    if (!data.lastname) {
      errors.lastname = "LastName required.";
      isValid = false;
    } else {
      if (data.lastname.length < 3) {
        errors.lastname = "LastName must be atleast 3  characters.";
        isValid = false;
      }
    }
    if (!data.email) {
      errors.email = "Email required.";
      isValid = false;
    } else {
      if (!isValidEmail(data.email)) {
        errors.email = "Invalid email format.";
        isValid = false;
      } else {
        const res = await isActiveEmail(data.email);
        if (res.success && !res.valid) {
          errors.email = "Your Email Address is invalid.";
          isValid = false;
        }
      }
    }
    if (!data.phone) {
      errors.phone = "Phone required.";
      isValid = false;
    } else {
      if (!isValidPhone(data.phone)) {
        errors.phone = "Invalid Phone format.";
        isValid = false;
      } else {
        const res = await isActivePhone(data.phone);
        if (!res.valid) {
          errors.phone = "Your Phone number is invalid.";
          isValid = false;
        }
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
  const isValidPhone = (phone) => {
    const phoneRegex = /(\d{9})/;
    return phoneRegex.test(phone);
  };

  const isActiveEmail = async (email) => {
    const url = `https://ipqualityscore-ipq-proxy-detection-v1.p.rapidapi.com/json/email/JPvN22bzJRDtHVsameBKGVqN6w0fJhf6/${email}`;
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "ad2b41a87cmsh35c394c0619fefcp115506jsna018fdad8030",
        "X-RapidAPI-Host":
          "ipqualityscore-ipq-proxy-detection-v1.p.rapidapi.com",
      },
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      return result;
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      alert("Internal server error.");
      return;
    }
  };
  const isActivePhone = async (phone) => {
    const url = `https://api.apilayer.com/number_verification/validate?number=+91${phone}`;
    const options = {
      method: "GET",
      redirect: "follow",
      headers: {
        apikey: "Wr27dqHNCr70dhNMWdL1MdwLkHPmrpEW",
      },
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      alert("Internal server error.");
      return;
    }
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
    setSignupData((prevData) => ({
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
        <form onSubmit={handleregistersubmit} className="w-5/6">
          <h1 className="text-center text-xl underline underline-offset-8 font-bold text-green-600">
            CREATE YOUR RENTIFY ACCOUNT
          </h1>
          <div className="flex justify-between items-center mt-6">
            <div className="flex flex-col w-full mr-4">
              <label htmlFor="firstname" className=" text-gray-950 mb-1">
                First Name
              </label>
              <input
                type="text"
                placeholder="Enter First Name"
                name="firstname"
                id="firstname"
                className={`outline-none border py-3 px-2 w-full rounded drop-shadow-md ${
                  err.firstname ? "border-red-500" : "border-gray-300"
                }`}
                value={signupData.firstname}
                onChange={handleInputChange}
              />
              <span className="text-red-500 text-center">{err.firstname}</span>
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="lastname" className="text-gray-950 mb-1">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Enter Last Name"
                id="lastname"
                name="lastname"
                className={`outline-none border py-3 px-2 w-full rounded drop-shadow-md ${
                  err.lastname ? "border-red-500" : "border-gray-300"
                }`}
                value={signupData.lastname}
                onChange={handleInputChange}
              />
              <span className="text-red-500 text-center">{err.lastname}</span>
            </div>
          </div>
          <div className="flex flex-col w-full mt-2">
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
              value={signupData.email}
              onChange={handleInputChange}
            />
            <span className="text-red-500 text-center">{err.email}</span>
          </div>
          <div className="flex flex-col w-full mt-2">
            <label htmlFor="phone" className="text-gray-950 mb-1">
              Phone
            </label>
            <input
              type="text"
              placeholder="Enter Phone Number"
              id="phone"
              name="phone"
              className={`outline-none border py-3 px-2 w-full rounded drop-shadow-md ${
                err.phone ? "border-red-500" : "border-gray-300"
              }`}
              value={signupData.phone}
              onChange={handleInputChange}
            />
            <span className="text-red-500 text-center">{err.phone}</span>
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
              value={signupData.password}
              onChange={handleInputChange}
            />
            <span className="text-red-500 text-center">{err.password}</span>
          </div>
          <div className="flex w-full mt-2">
            <input
              type="checkbox"
              name="check"
              id="check"
              required
              className="accent-green-600"
            />
            <label htmlFor="check" className="text-gray-950 ml-2">
              I agree to the terms and conditions and privacy policy
            </label>
          </div>
          <div className="flex w-full mt-4 justify-center items-center">
            <input
              type="submit"
              value="Create an Account"
              className="px-6 py-3 rounded bg-green-600 text-white mr-4 drop-shadow-md cursor-pointer"
            />
            <span className="flex text-gray-950">
              Already have an account?
              <Link to="/login" className="underline ml-4">
                Login
              </Link>
            </span>
          </div>
        </form>
      </div>
    </section>
  );
}
