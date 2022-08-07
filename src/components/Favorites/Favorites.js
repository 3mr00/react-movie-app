import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { ArrowBackIos, ArrowForwardIos } from "@material-ui/icons";
import "./Favorites.css";
import axios from "axios";
import YouTube from "react-youtube";
import { useState } from "react";

const Favorites = ({ favourites, setFavourites, loginUser }) => {
  const [trailerUrl, setTrailerUrl] = useState("");

  const base_url = "https://image.tmdb.org/t/p/original/";

  const saveToLocalStorage = (items) => {
    localStorage.setItem("react-movie-app-favourites", JSON.stringify(items));
  };
  const removeFavouriteMovie = (m) => {
    const newFavouriteList = favourites.filter(
      (favourite) => favourite.id !== m.id
    );

    setFavourites(newFavouriteList);
    saveToLocalStorage(newFavouriteList);
  };

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

  var settings = {
    prevArrow: <PreviousBtn />,
    nextArrow: <NextBtn />,

    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    initialSlide: 0,
    variableWidth: true,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  const handleClick = async (m) => {
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      let trailerurl = await axios.get(
        `https://api.themoviedb.org/3/movie/${m.id}/videos?api_key=ae56b70e582bd2cef8ccc81804f671c8`
      );
      setTrailerUrl(trailerurl.data.results[0]?.key);
    }
  };

  const opts = {
    height: "390",
    width: "90%",
    playerVars: {
      autoplay: 1,
    },
  };

  const unavailableLandscape =
    "https://www.movienewz.com/img/films/poster-holder.jpg";
  return (
    <div className="fav_sec">
      <div className="row" style={{ margin: "30px" }}>
        <h4 style={{ margin: "0px auto", color: "#fff" }}>
          Hi {loginUser && loginUser.first_name}
        </h4>

        <Slider className="Slider__Large fav__Slider" {...settings}>
          {favourites.map((m) => (
            <div
              key={m.id}
              className="image__container"
              style={{ textAlign: "center" }}
            >
              <img
                key={m.id}
                src={
                  m.poster_path
                    ? base_url + m.poster_path
                    : unavailableLandscape
                }
                alt={m.name}
                className="multi__imageLarge"
                onClick={() => handleClick(m)}
              />

              <div
                onClick={() => removeFavouriteMovie(m)}
                className="overlay__fav"
              >
                <span className="Remove_btn">Remove Favourite</span>
                <FontAwesomeIcon style={{ color: "red" }} icon={faXmark} />
              </div>
            </div>
          ))}
        </Slider>
      </div>
      {trailerUrl && (
        <YouTube
          className="YouTube__Trailer"
          videoId={trailerUrl}
          opts={opts}
        />
      )}
      <div className="No_Movies">
        <div>{favourites.length === 0 && <h3>No Movies Added</h3>}</div>
      </div>
    </div>
  );
};

export default Favorites;
