import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import clsx from "clsx";

import { ReactComponent as Logo } from "../../assets/logo.svg";

import TicketsManager from "../../components/TicketsManagerTabs/";
import Ticket from "../../components/Ticket/";

import { i18n } from "../../translate/i18n";

const useStyles = makeStyles(theme => ({
	chatContainer: {
		flex: 1,
		padding: theme.spacing(2), //Aqui ele ajusta espaço na tela de ticket
		height: `calc(100% - 48px)`,
		overflowY: "hidden",
	},

	chatPapper: {
		display: "flex",
		height: "100%",
		backgroundColor: "transparent",
	},

	contactsWrapper: {
		display: "flex",
		height: "100%",
		borderRadius:"16px",
		flexDirection: "column",
		overflowY: "hidden",
		//boxShadow: "0px 0px 30px 5px rgba(82,82,82,0.10)", 
	},
	messagesWrapper: {
		display: "flex",
		height: "100%",
		flexDirection: "column",
	},
	welcomeMsg: {
		backgroundColor: theme.palette.boxticket, //DARK MODE //
		display: "flex",
		marginLeft:"20px",
    justifyContent:"center",
		borderRadius:"16px",
		transition: "1000ms linear", 
       // boxShadow: "0px 0px 30px 5px rgba(82,82,82,0.10)", 
		alignItems: "center",
		height: "100%",
		textAlign: "center",
		border:"none",
	},
}));

const TicketsCustom = () => {
  const classes = useStyles();
  const { ticketId } = useParams();
  const theme = useTheme(); // Use o hook useTheme

  return (
    <div className={classes.chatContainer}>
      <div className={classes.chatPapper}>
        <Grid container spacing={0}>
          <Grid item xs={4} className={classes.contactsWrapper}>
            <TicketsManager />
          </Grid>
          <Grid item xs={8} className={classes.messagesWrapper}>
            {ticketId ? (
              <>
                <Ticket />
              </>
            ) : (
              <Paper square variant="outlined" className={classes.welcomeMsg}>
                {/*  LOGO */}
                <Logo
  className={clsx(classes.logo, {
    [classes.logoLight]: theme.palette.mode === "light",
    [classes.logoDark]: theme.palette.mode === "dark",
  })}
  alt="logo"
  width="60%" // Largura em pixels
  height="auto" 
/>
                {/*  LOGO */}
                {/*<span>{i18n.t("chat.noTicketMessage")}</span>*/}
              </Paper>
            )}
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default TicketsCustom;
