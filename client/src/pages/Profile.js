import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import PageNavbar from "../components/PageNavbar";
import { ReactComponent as User } from "../assets/user.svg";
import styles from "./Profile.module.css";

function Profile() {
  let { username } = useParams();
  const [name, setUsername] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:8081/profile/${username}`).then((response) => {
      setUsername(response.data[0].username);
    });
  }, [username]);

  return (
    <div className={styles.container}>
      <PageNavbar />
      <div className={styles.login_container}>
        <User style={{ width: "40px" }} />
        <div className={styles.text}>{name}</div>
      </div>
      <h2 className={styles.text}>Page Under Construction</h2>
      <img
        src={"https://thumbs.gfycat.com/UnsungForsakenFish-size_restricted.gif"}
        alt="Profile Page Under Construction"
        className={styles.center}
      />
    </div>
  );
}

export default Profile;
