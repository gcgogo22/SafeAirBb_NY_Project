import React from "react";
import { Link } from "react-router-dom";
import { Slide } from "react-slideshow-image";
import styles from "./HomePage.module.css";
import "react-slideshow-image/dist/styles.css";

function HomePage(prop) {
  return (
    <div>
      <section className={styles.container}>
        <div className={styles.right_split_container}>
          <img
            src={"/Homepagelogo.png"}
            className={styles.homepage_logo}
            alt=""
          />
          <nav>
            <ul>
              <li>
                <Link className={styles.title_text} to="/borough">
                  Borough
                </Link>
              </li>
              <li>
                <h2 className={styles.title_text}>/</h2>
              </li>
              <li>
                <Link className={styles.title_text} to="/neighborhood">
                  Neighborhood
                </Link>
              </li>
              <li>
                <h2 className={styles.title_text}>/</h2>
              </li>
              <li>
                <Link className={styles.title_text} to="/search">
                  Search
                </Link>
              </li>
              <li>
                <h2 className={styles.title_text}>/</h2>
              </li>

              {!prop.authState.status ? (
                <span>
                  <li>
                    <Link className={styles.title_text} to="/login">
                      {" "}
                      Login{" "}
                    </Link>
                  </li>

                  <li>
                    <h2 className={styles.title_text}>/</h2>
                  </li>

                  <li>
                    <Link className={styles.title_text} to="/registration">
                      {" "}
                      Registration{" "}
                    </Link>
                  </li>
                </span>
              ) : (
                <span>
                  <li>
                    <Link
                      className={styles.title_text}
                      to={`/profile/${prop.authState.username}`}
                    >
                      {" "}
                      Profile{" "}
                    </Link>
                  </li>
                  <li>
                    <button
                      className={styles.logout_button}
                      onClick={() => {
                        localStorage.removeItem("accessToken");
                        prop.setAuthState({ username: "", status: false });
                      }}
                    >
                      {" "}
                      Logout
                    </button>
                  </li>
                </span>
              )}
            </ul>
          </nav>
        </div>

        <div className={styles.left_split_container}>
          <div className={styles.slide_container}>
            <Slide>
              <div className={styles.each_slide}>
                <div style={{ backgroundImage: "url(/image1.jpeg)" }}>
                  <p className={styles.slide_text}>Travel NYC</p>
                </div>
              </div>
              <div className={styles.each_slide}>
                <div style={{ backgroundImage: "url(image2.jpeg)" }}>
                  <p className={styles.slide_text}>Stay @NYC</p>
                </div>
              </div>
              <div className={styles.each_slide}>
                <div style={{ backgroundImage: "url(image3.jpeg)" }}>
                  <p className={styles.slide_text}>Explore NYC</p>
                </div>
              </div>
            </Slide>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
