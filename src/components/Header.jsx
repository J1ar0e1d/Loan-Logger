import React from "react";
import classes from "../components/components.module.css";

const Header = ({ ...props }) => {
  return (
    <header className={classes["page-header"]}>
      <p className={classes["eyebrow"]}>Gestión de Clientes</p>
      <h1>Crea un nuevo perfil de cliente</h1>
      <p className={classes["page-subtitle"]}>
        Añade un nuevo cliente y su información de préstamo para comenzar a
        realizar un seguimiento de sus pagos.
      </p>
      <div className={classes["client-counter"]}>
        <span>{props.clients?.length}</span>
        <small>Clientes Activos</small>
      </div>
    </header>
  );
};

export default Header;
