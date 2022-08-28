import React from "react";
import { Link, NavLink } from "react-router-dom";
import styles from "./PageNavbar.module.css";

function PageNavbar() {
  return (
    <div className={styles.header}>
      <Link to="/">
        <img
          className={styles.header__icon}
          src={"/Homepagelogo.png"}
          alt="logo"
        />
      </Link>
      <ul className={styles.header__link}>
        <li>
          <NavLink
            className={(navData) => (navData.isActive ? styles.active : "")}
            to="/borough"
          >
            Borough
          </NavLink>
        </li>
        <li>
          <NavLink
            className={(navData) => (navData.isActive ? styles.active : "")}
            to="/neighborhood"
          >
            Neighborhood
          </NavLink>
        </li>
        <li>
          <NavLink
            className={(navData) => (navData.isActive ? styles.active : "")}
            to="/search"
          >
            Search
          </NavLink>
        </li>
        <li>
          <NavLink
            className={(navData) => (navData.isActive ? styles.active : "")}
            to="/profile/wjq"
          >
            Profile
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default PageNavbar;
