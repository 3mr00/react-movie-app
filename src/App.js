import { Route, Switch, useHistory } from "react-router";
import { useState, useEffect } from "react";

import Navbar from "./components/Navbar/Navbar";
import Banner from "./components/Banner/Banner";
import requests from "./components/requests/requests";
import Row from "./components/Row/Row";
import Search from "./components/Search/Search";
import Favorites from "./components/Favorites/Favorites";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import jwtDecode from "jwt-decode";

function App() {
  const history = useHistory();

  const [favourites, setFavourites] = useState([]);

  let [loginUser, setLoginUser] = useState(null);

  function getUserInfo() {
    let encodedToken = localStorage.getItem("userToken");
    let useData = jwtDecode(encodedToken);
    setLoginUser(useData);
  }

  function logOut() {
    localStorage.removeItem("userToken");
    setLoginUser(null);
    history.push("/Login");
  }

  useEffect(() => {
    if (localStorage.getItem("userToken")) {
      getUserInfo();
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const movieFavourites = JSON.parse(
      localStorage.getItem("react-movie-app-favourites")
    );

    if (movieFavourites && isMounted) {
      setFavourites(movieFavourites);
    }
    return () => {
      isMounted = false;
    };
  }, []);

  const saveToLocalStorage = (items) => {
    localStorage.setItem("react-movie-app-favourites", JSON.stringify(items));
  };

  const addFavouriteMovie = (m) => {
    if (localStorage.getItem("userToken")) {
      let id = m.id;
      if (favourites.filter((k) => k.id === id).length > 0) {
        return;
      } else {
        const newFavoritelist = [...favourites, m];
        setFavourites(newFavoritelist);
        saveToLocalStorage(newFavoritelist);
      }
    } else {
      history.push("/Login");
    }
  };

  return (
    <div className="App">
      <Navbar loginUser={loginUser} logOut={logOut} />

      <Switch>
        <Route exact path="/">
          <Banner />
          <Row
            isLargeRow
            title="NETFLIX ORIGINALS"
            fetchUrl={requests.fetchNetflixOriginals}
            handleFavouritesClick={addFavouriteMovie}
          />

          <Row
            title="Trending Now"
            fetchUrl={requests.fetchTrending}
            handleFavouritesClick={addFavouriteMovie}
          />
          <Row
            title="Top Rated"
            fetchUrl={requests.fetchTopRated}
            handleFavouritesClick={addFavouriteMovie}
          />
          <Row
            title="Action Movies"
            fetchUrl={requests.fetchActionMovies}
            handleFavouritesClick={addFavouriteMovie}
          />
          <Row
            title="Comedy  Movies"
            fetchUrl={requests.fetchComedyMovies}
            handleFavouritesClick={addFavouriteMovie}
          />
          <Row
            title="Horror Movies"
            fetchUrl={requests.fetchHorrorMovies}
            handleFavouritesClick={addFavouriteMovie}
          />
          <Row
            title="Romance Movies"
            fetchUrl={requests.fetchRomanceMovies}
            handleFavouritesClick={addFavouriteMovie}
          />
          <Row
            title="Animes"
            fetchUrl={requests.fetchAnimes}
            handleFavouritesClick={addFavouriteMovie}
          />
        </Route>
        <Route path="/Search">
          <Search />
        </Route>

        <Route path="/Register" render={(props) => <Register {...props} />} />
        <Route
          path="/Login"
          render={(props) => <Login {...props} getUserInfo={getUserInfo} />}
        />
        <ProtectedRoute
          path="/favorites"
          component={Favorites}
          favourites={favourites}
          loginUser={loginUser}
          setFavourites={setFavourites}
        />
      </Switch>
    </div>
  );
}

export default App;
