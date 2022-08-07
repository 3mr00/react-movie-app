import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./NavBar.css";

const Navbar = ({ loginUser, logOut }) => {
  const [navShadow, setnavShadow] = useState("unset");
  const [navColor, setnavColor] = useState(
    "linear-gradient( to bottom, rgba(0, 0, 0, 0.7) 10%, rgba(0, 0, 0, 0) )"
  );

  const listenScrollEvent = () => {
    window.scrollY > 10
      ? setnavColor("#141414")
      : setnavColor(
          "linear-gradient( to bottom, rgba(0, 0, 0, 0.7) 10%, rgba(0, 0, 0, 0) )"
        );

    window.scrollY > 10
      ? setnavShadow("2px 0px 20px #000")
      : setnavShadow("unset");
  };

  useEffect(() => {
    window.addEventListener("scroll", listenScrollEvent);
    return () => {
      window.removeEventListener("scroll", listenScrollEvent);
    };
  }, []);

  return (
    <div className="home">
      <nav
        className="navbar"
        style={{
          background: navColor,
          boxShadow: navShadow,
        }}
      >
        <NavLink exact to="/">
          <h3 style={{ color: "red" }} className="navbar-brand">
            TILER MOViE
          </h3>
        </NavLink>
        <div className="navbar-nav">
          <ul className="nav-list">
            <li className="nav-item">
              <NavLink
                exact
                to="/"
                className="nav-link "
                activeClassName="active_Nav"
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/Favorites"
                className="nav-link "
                activeClassName="active_Nav"
              >
                Favorites
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="rightNav">
          <NavLink to="/Search">
            <div className="searchbar">
              <div className="icon">
                <i className="fas fa-search"></i>
              </div>
            </div>
          </NavLink>
          {loginUser ? (
            <>
              <div className="auth">
                <li onClick={logOut}>Logout</li>
              </div>
            </>
          ) : (
            <>
              <NavLink activeClassName="active_Nav" to="/Register">
                <div className="auth">
                  <li>Register</li>
                </div>
              </NavLink>
              <span className="slash">/</span>
              <NavLink activeClassName="active_Nav" to="/Login">
                <div className="auth">
                  <li>Login</li>
                </div>
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
