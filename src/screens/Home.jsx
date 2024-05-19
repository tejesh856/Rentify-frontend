import React, { useState, useEffect, useContext } from "react";
import { datacontext } from "../Datacontext";
import { useNavigate } from "react-router-dom";
export default function Home() {
  const { tokenState } = useContext(datacontext);
  const navigate = useNavigate();
  useEffect(() => {
    if (tokenState) {
      navigate("/");
    }
  }, [tokenState, navigate]);
  return <div>Home</div>;
}
