import * as React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState } from "react";
import { auth, googleProvider } from "../config/firebase";
import GoogleIcon from "@mui/icons-material/Google";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function MyLogIn() {
  const [formInputs, setFormInputs] = useState({ email: "", password: "" });
  //error handling
  const [errors, setErrors] = useState({ email: "", password: "" });
  //password visibility
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  //navigate to home page
  const navigate = useNavigate();

  //form validation
  const validateForm = () => {
    let valid = true;
    let tempErrors = { email: "", password: "" };

    if (!formInputs.email) {
      tempErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formInputs.email)) {
      tempErrors.email = "Email address is invalid";
      valid = false;
    }
    //password validation
    if (!formInputs.password) {
      tempErrors.password = "Password is required";
      valid = false;
    } else if (formInputs.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters long";
      valid = false;
    }
    setErrors(tempErrors);
    return valid;
  };

  //submit form
  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateForm()) {
      console.log("Form submitted", formInputs);
      createUserWithEmailAndPassword(
        auth,
        formInputs.email,
        formInputs.password
      )
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log("User created", user);
          navigate("/searchimages");
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log("Error creating user", errorCode, errorMessage);
          // ..
        });
    }
  };

  //sign in with google
  const SignInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/searchimages");
    } catch (error) {
      console.log("Error signing in with google", error);
    }
  };

  //the html returned
  return (
    <>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Email"
          style={{ marginBottom: "20px" }}
          value={formInputs.email}
          onChange={(event) => {
            setFormInputs({ ...formInputs, email: event.target.value });
          }}
          error={!!errors.email}
          helperText={errors.email}
        />
        {/* password field */}
        <TextField
          fullWidth
          label="Password"
          type={showPassword ? "text" : "password"}
          style={{ marginBottom: "5px" }}
          value={formInputs.password}
          onChange={(event) => {
            setFormInputs({ ...formInputs, password: event.target.value });
          }}
          error={!!errors.password}
          helperText={errors.password}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          color="success"
          sx={{ marginTop: "20px", width: "100%" }}
          type="submit"
        >
          Submit
        </Button>
      </form>
    </>
  );
}
