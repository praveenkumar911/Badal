import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Approval = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Set a timeout to navigate after 5 seconds
    const timeoutId = setTimeout(() => {
      navigate("/");
    }, 5000);

    // Clear the timeout if the component unmounts
    return () => clearTimeout(timeoutId);
  }, [navigate]);

  return (
    <>
      <h2>Your Approval from Admin is pending. Kindly wait for 48 hrs.</h2>
      <p>You will be redirected to the main page in 5 seconds.</p>
    </>
  );
};

export default Approval;
