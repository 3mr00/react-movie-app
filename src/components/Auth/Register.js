import axios from "axios";
import Joi from "joi";
import React, { useState } from "react";
import "./Auth.css";
const Register = (props) => {
  let [errorList, setErrorList] = useState(null);
  let [error, setError] = useState("");
  let [loading, setLoading] = useState(false);

  let [user, setUser] = useState({
    first_name: "",
    last_name: "",
    age: 0,
    email: "",
    password: "",
  });

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
        `https://route-egypt-api.herokuapp.com/signup`,
        user
      );
      if (data.message === "success") {
        props.history.push("/Login");
        setLoading(false);
      } else {
        setLoading(false);
        setError(data.message);
      }
    }
  }

  function validateRegisterForm() {
    let scheme = Joi.object({
      first_name: Joi.string().min(3).max(10).required(),
      last_name: Joi.string().min(3).max(10).required(),
      age: Joi.number().min(16).max(80).required(),
      email: Joi.string()
        .email({ tlds: { allow: ["com", "net", "org"] } })
        .required(),
      password: Joi.string().pattern(new RegExp("^[A-Z][a-z]{2,8}$")),
    });

    return scheme.validate(user, { abortEarly: false });
  }

  return (
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
              {error && <li> {error.substr(34, 100)}</li>}
            </ul>
          </div>
        ) : (
          ""
        )}

        <h1>Register</h1>
        <div className="form-element">
          <input
            onChange={getUser}
            type="text"
            className="form-control"
            name="first_name"
            id="first_name"
            required
          />
          <label className="floating-label" htmlFor="first_name">
            Frist Name
          </label>
        </div>
        <div className="form-element">
          <input
            onChange={getUser}
            type="text"
            className="form-control"
            name="last_name"
            id="last_name"
            required
          />
          <label className="floating-label" htmlFor="last_name">
            Last Name
          </label>
        </div>
        <div className="form-element">
          <input
            onChange={getUser}
            type="age"
            className="form-control"
            name="age"
            id="age"
            required
          />
          <label className="floating-label" htmlFor="age">
            age
          </label>
        </div>
        <div className="form-element">
          <input
            onChange={getUser}
            type="email"
            className="form-control"
            name="email"
            id="email"
            required
          />
          <label className="floating-label" htmlFor="email">
            Email
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
          {loading ? <i className="fas fa-spinner fa-spin"></i> : "register"}
        </button>
      </form>
    </div>
  );
};
export default Register;
