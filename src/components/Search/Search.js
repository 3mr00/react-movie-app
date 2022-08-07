import { useState } from "react";
import axios from "axios";
import "./Search.css";
import YouTube from "react-youtube";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [content, setContent] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");
  const [found, setFound] = useState(false);

  const fetchSearch = async (e) => {
    e.preventDefault();
    axios
      .get(
        `https://api.themoviedb.org/3/search/movie?api_key=fb34530271b349314af0de263d16ab5a&language=en-US&query=${searchTerm}&page=1&include_adult=false`
      )
      .then((res) => {
        setContent(res.data.results);
        setFound(true);
      })
      .catch((err) => {
        console.log(err);
      });
    setTrailerUrl("");
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
    "https://user-images.githubusercontent.com/10515204/56117400-9a911800-5f85-11e9-878b-3f998609a6c8.jpg";
  return (
    <div className="home">
      {trailerUrl && (
        <YouTube
          className="YouTube__Trailer"
          videoId={trailerUrl}
          opts={opts}
        />
      )}

      <div className="box">
        <div className="container-4">
          <form onSubmit={fetchSearch}>
            <input
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setFound(false);
              }}
              value={searchTerm}
              type="search"
              placeholder="Search..."
              className="search"
            />
            <button disabled={!searchTerm} className="icon">
              <i className="fa fa-search"></i>
            </button>
          </form>
        </div>
      </div>
      <article className="video-sec-wrap">
        {found === true && content.length === 0 && (
          <h1 className="not__found">Not Found..</h1>
        )}
        <div className="video-sec">
          <ul className="video-sec-middle" id="vid-grid">
            {content.length >= 1
              ? content &&
                content.map((m) => (
                  <li
                    key={m.id}
                    onClick={() => window.scroll(0, 0) + handleClick(m)}
                    className="thumb-wrap"
                  >
                    <img
                      className="thumb"
                      src={
                        m.backdrop_path
                          ? "https://image.tmdb.org/t/p/original/" +
                            m.backdrop_path
                          : unavailableLandscape
                      }
                      alt={m.title}
                    />
                    <div className="thumb-info">
                      <p className="thumb-user">{m.release_dat}</p>
                      <p className="thumb-text">{m.title}</p>
                    </div>
                  </li>
                ))
              : ""}
          </ul>
        </div>
      </article>
    </div>
  );
};

export default Search;
