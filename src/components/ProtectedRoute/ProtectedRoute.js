import React from "react";
import { Redirect, Route } from "react-router";

export default function ProtectedRoute(props) {
  if (localStorage.getItem("userToken")) {
    return (
      <Route path={props.path}>
        <props.component
          favourites={props.favourites}
          setFavourites={props.setFavourites}
          loginUser={props.loginUser}
        />
      </Route>
    );
  } else {
    return <Redirect to="/Login" />;
  }
}
