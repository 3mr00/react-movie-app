import axios from "axios";
import Joi from "joi";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Auth.css";

export default function Login(props) {
  let [errorList, setErrorList] = useState(null);
  let [error, setError] = useState(null);
  let [loading, setLoading] = useState(false);

  let [user, setUser] = useState({ email: "", password: "" });

  function getUser(e) {
    let myUser = { ...user }; //Note
    myUser[e.target.name] = e.target.value;
    setUser(myUser);
  }

  async function formSubmit(e) {
    e.preventDefault();
    setLoading(true);
    let validattionResponse = validateRegisterForm();

    if (validattionResponse.error) {
      setErrorList(validattionResponse.error.details);
      setLoading(false);
    } else {
      let { data } = await axios.post(
        `https://route-egypt-api.herokuapp.com/signin`,
        user
      );
      if (data.message === "success") {
        localStorage.setItem("userToken", data.token);
        props.getUserInfo();
        props.history.push("/");
        setLoading(false);
      } else {
        setLoading(false);
        setError(data.message);
      }
    }
  }

  function validateRegisterForm() {
    let scheme = Joi.object({
      email: Joi.string()
        .email({ tlds: { allow: ["com", "net", "org"] } })
        .required(),
      password: Joi.string().pattern(new RegExp("^[A-Z][a-z]{2,8}$")),
    });

    return scheme.validate(user, { abortEarly: false });
  }
  return (
    <div>
      <div style={{ marginTop: "10%" }}>
        <form className="container" onSubmit={formSubmit}>
          {errorList || error ? (
            <div className="alert tip">
              <b>Warning</b>
              <br></br>
              <ul>
                {errorList &&
                  errorList.map((err, index) =>
                    index === errorList.length - 1 ? (
                      <li key={err.id}>password invalid </li>
                    ) : (
                      <li key={err.id}>{err.message}</li>
                    )
                  )}
                {error && <li> {error}</li>}
              </ul>
            </div>
          ) : (
            ""
          )}

          <h1>Login Now</h1>
          <div className="form-element">
            <input
              onChange={getUser}
              type="email"
              className="form-control "
              name="email"
              id="email"
              required
            />
            <label className="floating-label" htmlFor="email">
              Email{" "}
            </label>
          </div>
          <div className="form-element">
            <input
              onChange={getUser}
              type="password"
              className="form-control"
              name="password"
              id="password"
              required
            />
            <label className="floating-label" htmlFor="password">
              Password
            </label>
          </div>
          <button type="submit" className="btn">
            {loading ? <i className="fas fa-spinner fa-spin"></i> : "login"}
          </button>
          <div className="Create_Account">
            <Link to="/Register">Create Account</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
