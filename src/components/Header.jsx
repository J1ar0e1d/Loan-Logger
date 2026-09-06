import React from "react";
import heroImg from "../assets/hero.png";
import classes from "../components/components.module.css";

const Header = ({ ...props }) => {
  return (
    <header className={classes["page-header"]}>
      <p className={classes["eyebrow"]}>Client Management</p>
      <h1>Create a new client profile</h1>
      <p className={classes["page-subtitle"]}>
        Add loan details and keep a clean, professional overview of each client.
      </p>
      <div className={classes["client-counter"]}>
        <span>{props.clients?.length}</span>
        <small>Active Clients</small>
      </div>
    </header>
  );
};

export default Header;
