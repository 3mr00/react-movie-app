import React, { useState, useEffect } from "react";
import axios from "../axios/axios";
import "./Row.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { ArrowBackIos, ArrowForwardIos } from "@material-ui/icons";
import YouTube from "react-youtube";
import Loading from "../Loading/Loading";

import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Row({ title, fetchUrl, isLargeRow, handleFavouritesClick }) {
  const base_url = "https://image.tmdb.org/t/p/original/";
  const unavailableLandscape =
    "https://user-images.githubusercontent.com/10515204/56117400-9a911800-5f85-11e9-878b-3f998609a6c8.jpg";

  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");
  const [isPending, setIsPending] = useState(true);

  const PreviousBtn = (props) => {
    const { className, onClick } = props;
    return (
      <div
        style={{
          background: "rgba(20, 20, 20, 0.5)",
        }}
        className={`${className}`}
        onClick={onClick}
      >
        <ArrowBackIos style={{ color: "#ffff", fontSize: "2.5vw" }} />
      </div>
    );
  };
  const NextBtn = (props) => {
    const { className, onClick } = props;
    return (
      <div
        style={{
          background: "rgba(20, 20, 20, 0.5)",
        }}
        className={`${className}`}
        onClick={onClick}
      >
        <ArrowForwardIos
          style={{
            color: "#ffff",
            fontSize: "2.5vw",
          }}
        />
      </div>
    );
  };

  const carouselProperties = {
    prevArrow: <PreviousBtn />,
    nextArrow: <NextBtn />,
    slidesToShow: 4,
    // infinite={false}
    slidesToScroll: 1,
    centerPadding: "360px",
    centerMode: true,
    responsive: [
      // {
      //   breakpoint: 375,
      //   settings: {
      //     slidesToShow: 1,
      //     centerPadding: "10px",
      //     centerMode: true,
      //   },
      // },
      {
        breakpoint: 320,
        settings: {
          slidesToShow: 1,
          centerPadding: "5px",
          centerMode: true,
        },
      },
      {
        breakpoint: 375,
        settings: {
          slidesToShow: 1,
          centerPadding: "60px",
          centerMode: true,
        },
      },
      {
        breakpoint: 426,
        settings: {
          slidesToShow: 1,
          centerPadding: "90px",
          centerMode: true,
        },
      },
      {
        breakpoint: 769,
        settings: {
          slidesToShow: 4,
          centerMode: false,
        },
      },
      {
        breakpoint: 635,
        settings: {
          slidesToShow: 3,
          centerMode: false,
        },
      },
      {
        breakpoint: 1340,
        settings: {
          slidesToShow: 8,
          centerMode: false,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1220,
        settings: {
          slidesToShow: 7,
          centerMode: false,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 990,
        settings: {
          slidesToShow: 5,
          centerMode: false,
          slidesToScroll: 1,
        },
      },
    ],
  };
  useEffect(() => {
    // if [1, run once when the row loads, and dont run again
    const abortCont = new AbortController(); // creating an AbortController
    axios
      .get(fetchUrl, { signal: abortCont.signal })
      .then((res) => {
        setMovies(res.data.results.slice(0, 10));
        setIsPending(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
      });
    return () => {
      abortCont.abort(); // stop the query by aborting on the AbortController on unmount
    };
  }, [fetchUrl]);

  const opts = {
    height: "390",
    width: "90%",
    playerVars: {
      autoplay: 1,
    },
  };
  const handleClick = async (m, isLargeRow) => {
    if (trailerUrl) {
      setTrailerUrl("");
    } else if (!isLargeRow) {
      let trailerurl = await axios.get(
        `/movie/${m.id}/videos?api_key=fb34530271b349314af0de263d16ab5a`
      );
      setTrailerUrl(trailerurl.data.results[0]?.key);
    }
  };

  return (
    <div>
      {isPending && (
        <div class="loader_home">
          <div class="loader__filmstrip"></div>
          <p class="loader__text">loading</p>
        </div>
      )}
      <div className="row" style={{ margin: "30px" }}>
        <h2 style={{ color: "#fff" }}>{title}</h2>
        <Slider
          className={`${isLargeRow && "Slider__Large"}`}
          {...carouselProperties}
        >
          {movies.length >= 1 ? (
            movies &&
            movies.map((m) => (
              <div
                key={m.id}
                className="image__container"
                style={{ textAlign: "center" }}
              >
                <img
                  onClick={() => handleClick(m, isLargeRow)}
                  className={`multi__image ${
                    isLargeRow && "multi__imageLarge"
                  } `}
                  key={m.id}
                  src={
                    isLargeRow
                      ? m.poster_path
                        ? base_url + m.poster_path
                        : unavailableLandscape
                      : m.backdrop_path
                      ? base_url + m.backdrop_path
                      : unavailableLandscape
                  }
                  alt={m.name}
                />
                {movies && (
                  <div>
                    <div
                      onClick={() => handleFavouritesClick(m)}
                      className="overlay"
                    >
                      <span className="Add_fav_btn">Add to Favourites</span>
                      <FontAwesomeIcon
                        icon={faHeart}
                        style={{ color: "red" }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <Loading />
          )}
        </Slider>
        {trailerUrl && (
          <YouTube
            config={{
              youtube: { playerVars: { origin: "https://www.youtube.com" } },
            }}
            videoId={trailerUrl}
            opts={opts}
          />
        )}
      </div>
    </div>
  );
}
export default Row;
