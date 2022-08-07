import React, { useState, useEffect } from "react";
import axios from "../axios/axios";
import requests from "../requests/requests";
import "./Banner.css";

const Banner = () => {
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    let isMounted = true;
    axios
      .get(requests.fetchNetflixOriginals)
      .then((res) => {
        if (isMounted)
          setMovie(
            res.data.results[
              Math.floor(Math.random() * res.data.results.length - 1)
            ]
          );
      })
      .catch((err) => {
        console.log(err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  }
  const unavailableLandscape =
    "https://user-images.githubusercontent.com/10515204/56117400-9a911800-5f85-11e9-878b-3f998609a6c8.jpg";

  const css = `@media (min-width: 650px) {
      .Banner {
        background-Image: ${
          movie && movie.backdrop_path.length >= 1
            ? `url("https://image.tmdb.org/t/p/original/${movie.backdrop_path}")`
            : unavailableLandscape
        }      }
  }
  @media (max-width: 750px) {
      .Banner {
        background-Image: ${
          movie && movie.backdrop_path.length >= 1
            ? `url("https://image.tmdb.org/t/p/original/${movie?.poster_path}")`
            : unavailableLandscape
        }      }
  }`;
  return (
    <div className="Banner">
      <style scoped>{movie && css}</style>

      <div className="image-container">
        <div className="left-side">
          <h1>
            {(movie && movie?.title) ||
              (movie && movie?.name) ||
              (movie && movie?.original_name)}
          </h1>
          <p>{truncate(movie?.overview, 150)}</p>
          <div className="button-section">
            <div className="watch">
              <h3>Play</h3>
              <svg fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z" />
              </svg>
            </div>
            <div className="queue">
              <h3>Watch Later</h3>
              <svg fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="banner--fadeBottom" />
      </div>
    </div>
  );
};

export default Banner;
