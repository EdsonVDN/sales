import React, { useState, useEffect, useRef, useContext } from "react";

import { useHistory, useParams } from "react-router-dom";
import { parseISO, format, isSameDay } from "date-fns";
import clsx from "clsx";


import { makeStyles } from "@material-ui/core/styles";
import { green, grey, red, blue } from "@material-ui/core/colors";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import Badge from "@material-ui/core/Badge";
import Box from "@material-ui/core/Box";
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import UndoIcon from '@material-ui/icons/Undo';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import { ChevronRight } from '@material-ui/icons';




import { i18n } from "../../translate/i18n";

import api from "../../services/api";
import ButtonWithSpinner from "../ButtonWithSpinner";
import MarkdownWrapper from "../MarkdownWrapper";
import { Tooltip } from "@material-ui/core";
import { AuthContext } from "../../context/Auth/AuthContext";
import { TicketsContext } from "../../context/Tickets/TicketsContext";
import toastError from "../../errors/toastError";
import { v4 as uuidv4 } from "uuid";

import RoomIcon from '@material-ui/icons/Room';
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import AndroidIcon from "@material-ui/icons/Android";
import VisibilityIcon from "@material-ui/icons/Visibility";
import TicketMessagesDialog from "../TicketMessagesDialog";
import DoneIcon from '@material-ui/icons/Done';
import ClearOutlinedIcon from '@material-ui/icons/ClearOutlined';
import contrastColor from "../../helpers/contrastColor";
import ContactTag from "../ContactTag";

const useStyles = makeStyles((theme) => ({
  ticket: {
    minHeight:"110px",
    position: "relative",
    paddingTop: "5px",
    paddingRight:"4px",
    alignItems:"center",
    paddingBottom: "5px",
    boxShadow: "0px 0px 30px 3px rgba(82,82,82,0.1)",
    backgroundColor: theme.palette.ticketlist,
    transition: "1000ms linear", 
    "&:hover": { 
      backgroundColor: theme.palette.barraSuperior,
    },
  },

  aboveTicket:{
  display: "flex",
  flexDirection: "row",
  marginTop: "10px",
  alignItems: "center",
  justifyContent:"space-between", 
  },

  ticketActionsContainer: {
    display: "flex",
    marginTop:"20px",
    flexDirection: "column", // Organiza os botões em linha
    gap: "2px", // Espaçamento entre os botões
  },
  ticketActionButton: { // Estilos para os botões
    textTransform: 'none', // Remove a transformação de texto padrão do Material UI (caixa alta)
  },

  pendingTicket: {
    cursor: "unset",
  },
  queueTag: {
    background: "#FCFCFC",
    color: "#000",
    marginRight: 1,
    padding: 1,
    fontWeight: 'bold',
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 3,
    fontSize: "0.8em",
    whiteSpace: "nowrap"
  },
  noTicketsDiv: {
    display: "flex",
    height: "100px",
    margin: 40,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  newMessagesCount: {
    position: "absolute",
    alignSelf: "center",
    marginRight: 8,
    marginLeft: "auto",
    top: "30px",
    left: "60px",
    borderRadius: 0,
  },
  noTicketsText: {
    textAlign: "center",
    color: "rgb(104, 121, 146)",
    fontSize: "14px",
    lineHeight: "1.4",
  },
  connectionTag: {
    background: "green",
    color: "#FFF",
    marginRight: 1,
    padding: 1,
    fontWeight: 'bold',
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 3,
    fontSize: "0.8em",
    whiteSpace: "nowrap"
  },
  noTicketsTitle: {
    textAlign: "center",
    fontSize: "16px",
    fontWeight: "600",
    margin: "0px",
  },

  contactNameWrapper: {
    display: "flex",
    justifyContent: "space-between",
    marginLeft: "10px",
    flexDirection:"column",
    width:"90%"
  },

  lastMessageTime: {
    justifySelf: "flex-end",
    textAlign: "right",
    position: "relative",
    marginTop:"-20px",
    top: 0,
  },

  closedBadge: {
    alignSelf: "center",
    justifySelf: "flex-end",
    marginRight: 32,
    marginLeft: "auto",
  },

  contactLastMessage: {
    paddingRight: "0%",
    marginLeft: "5px",
    whiteSpace: "nowrap"
  },


  badgeStyle: {
    color: "white",
    backgroundColor: green[500],
  },

  acceptButton: {
    position: "absolute",
    right: "108px",
  },


  acceptButton: {
    position: "absolute",
    left: "50%",
  },

  ticketQueueColor: {
    flex: "none",
    width: "8px",
    height: "100%",
    position: "absolute",
    top: "0%",
    left: "0%",
  },

  ticketInfo: {
    position: "relative",
    top: -13
  },
  secondaryContentSecond: {
    display: 'flex',
    // marginTop: 5,
    //marginLeft: "5px",
    alignItems: "flex-start",
    flexWrap: "wrap",
    flexDirection: "row",
    alignContent: "flex-start",
  },
  ticketInfo1: {
    position: "relative",
    top: 13,
    right: 0
  },
  Radiusdot: {
    "& .MuiBadge-badge": {
      borderRadius: 2,
      position: "inherit",
      height: 16,
      margin: 2,
      padding: 3,
    },
    "& .MuiBadge-anchorOriginTopRightRectangle": {
      transform: "scale(1) translate(0%, -40%)",
    },

  }
}));
  {/*PLW DESIGN INSERIDO O dentro do const handleChangeTab*/}
  const TicketListItemCustom = ({ ticket }) => {
  const classes = useStyles();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [ticketUser, setTicketUser] = useState(null);
  const [ticketQueueName, setTicketQueueName] = useState(null);
  const [ticketQueueColor, setTicketQueueColor] = useState(null);
  const [tag, setTag] = useState([]);
  const [whatsAppName, setWhatsAppName] = useState(null);
  const [showTags, setShowTags] = useState(false);

  const [openTicketMessageDialog, setOpenTicketMessageDialog] = useState(false);
  const { ticketId } = useParams();
  const isMounted = useRef(true);
  const { setCurrentTicket } = useContext(TicketsContext);
  const { user } = useContext(AuthContext);
  const { profile } = user;

  useEffect(() => {
    if (ticket.userId && ticket.user) {
      setTicketUser(ticket.user?.name?.toUpperCase());
    }
    setTicketQueueName(ticket.queue?.name?.toUpperCase());
    setTicketQueueColor(ticket.queue?.color);

    if (ticket.whatsappId && ticket.whatsapp) {
      setWhatsAppName(ticket.whatsapp.name?.toUpperCase());
    }

    setTag(ticket?.tags);

    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  {/*CÓDIGO NOVO SAUDAÇÃO*/}
  const handleCloseTicket = async (id) => {
    setTag(ticket?.tags);
    setLoading(true);
    try {
      await api.put(`/tickets/${id}`, {
        status: "closed",
        userId: user?.id,
        queueId: ticket?.queue?.id,
        useIntegration: false,
        promptId: null,
        integrationId: null
      });
    } catch (err) {
      setLoading(false);
      toastError(err);
    }
    if (isMounted.current) {
      setLoading(false);
    }
    history.push(`/tickets/`);
  };

  const handleReopenTicket = async (id) => {
    setLoading(true);
    try {
      await api.put(`/tickets/${id}`, {
        status: "open",
        userId: user?.id,
        queueId: ticket?.queue?.id
      });
    } catch (err) {
      setLoading(false);
      toastError(err);
    }
    if (isMounted.current) {
      setLoading(false);
    }
    history.push(`/tickets/${ticket.uuid}`);
  };

    const handleAcepptTicket = async (id) => {
        setLoading(true);
        try {
            await api.put(`/tickets/${id}`, {
                status: "open",
                userId: user?.id,
            });
            
            let settingIndex;

            try {
                const { data } = await api.get("/settings/");
                
                settingIndex = data.filter((s) => s.key === "sendGreetingAccepted");
                
            } catch (err) {
                toastError(err);
                   
            }
            
            if (settingIndex[0].value === "enabled" && !ticket.isGroup) {
                handleSendMessage(ticket.id);
                
            }

        } catch (err) {
            setLoading(false);
            
            toastError(err);
        }
        if (isMounted.current) {
            setLoading(false);
        }

        // handleChangeTab(null, "tickets");
        // handleChangeTab(null, "open");
        history.push(`/tickets/${ticket.uuid}`);
    };
	
	    const handleSendMessage = async (id) => {
        
        const msg = `{{ms}} *{{name}}*, meu nome é *${user?.name}* e agora vou prosseguir com seu atendimento!`;
        const message = {
            read: 1,
            fromMe: true,
            mediaUrl: "",
            body: `*Mensagem Automática:*\n${msg.trim()}`,
        };
        try {
            await api.post(`/messages/${id}`, message);
        } catch (err) {
            toastError(err);
            
        }
    };
	{/*CÓDIGO NOVO SAUDAÇÃO*/}

  const handleSelectTicket = (ticket) => {
    const code = uuidv4();
    const { id, uuid } = ticket;
    setCurrentTicket({ id, uuid, code });
  };


  const renderTicketInfo = () => {
    if (ticketUser) {

      return (
        <>
          {ticket.chatbot && (
            <Tooltip title="Chatbot">
              <AndroidIcon
                fontSize="small"
                style={{ color: grey[700], marginRight: 5 }}
              />
            </Tooltip>
          )}

          {/* </span> */}
        </>
      );
    } else {
      return (
        <>
          {ticket.chatbot && (
            <Tooltip title="Chatbot">
              <AndroidIcon
                fontSize="small"
                style={{ color: grey[700], marginRight: 5 }}
              />
            </Tooltip>
          )}
        </>
      );
    }
  };

  return (
    <React.Fragment key={ticket.id}>
      <TicketMessagesDialog
        open={openTicketMessageDialog}

        handleClose={() => setOpenTicketMessageDialog(false)}
        ticketId={ticket.id}
      ></TicketMessagesDialog>

{/* Container Superior ao Ticket */}
      <div className={classes.aboveTicket} >
        <div display="flex" alignItems="center" mt={1} style={{marginLeft:"10px"}}>
      <Box > 
      <Typography noWrap component="span" variant="body2" color="textSecondary">
        Tags
    </Typography>
    <IconButton style={{marginLeft:"5px"}} size="small" sx={{ ml: 1 }} onClick={() => setShowTags(!showTags)}> 
      <ChevronRight />
    </IconButton>
    </Box>

      {/* Tags (com Collapse) */}
      <Collapse in={showTags} timeout="auto" unmountOnExit>
    <Box mt={1} style={{marginLeft:"10px"}}>
      <span className={classes.secondaryContentSecond}>
        {ticket?.whatsapp?.name ? (
          <Badge className={classes.connectionTag}>{ticket?.whatsapp?.name?.toUpperCase()}</Badge>
        ) : (
          <br />
        )}
        {ticketUser ? (
          <Badge style={{ backgroundColor: "#000000" }} className={classes.connectionTag}>
            {ticketUser}
          </Badge>
        ) : (
          <br />
        )}
        <Badge style={{ backgroundColor: ticket.queue?.color || "#7c7c7c" }} className={classes.connectionTag}>
          {ticket.queue?.name?.toUpperCase() || "SEM FILA"}
        </Badge>
      </span>
      <span style={{ paddingTop: "2px" }} className={classes.secondaryContentSecond}>
        {tag?.map((tag) => (
          <ContactTag tag={tag} key={`ticket-contact-tag-${ticket.id}-${tag.id}`} />
        ))}
      </span>
    </Box>
  </Collapse>
  </div>
          
          {/* Espiar Conversa */}
  {profile === "admin" && (
                  <Tooltip title="Espiar Conversa">
                    <VisibilityIcon
                      onClick={() => setOpenTicketMessageDialog(true)}
                      fontSize="small"
                      style={{
                        color: blue[700],
                        cursor: "pointer",
                        marginRight: "10px",
                        verticalAlign: "middle",
                        
                      }}
                    />
                  </Tooltip>
                )}
                </div>
      
      <ListItem dense button
        onClick={(e) => {
          if (ticket.status === "pending") return;
          handleSelectTicket(ticket);
        }}
        selected={ticketId && +ticketId === ticket.id}
        className={clsx(classes.ticket, {
          [classes.pendingTicket]: ticket.status === "pending",
        })}
      >
        <Tooltip arrow placement="right" title={ticket.queue?.name?.toUpperCase() || "SEM FILA"} >
          <span style={{ backgroundColor: ticket.queue?.color || "#7C7C7C" }} className={classes.ticketQueueColor}></span>
        </Tooltip>
        
        <div style={{ display: "flex", flexDirection: "column", alignItems: "left" }}> {/* Container para avatar e tags */}
  <ListItemAvatar>
    {ticket.status !== "pending" ? (
      <Avatar
        style={{
          marginTop: "0px",
          marginLeft: "-3px",
          width: "55px",
          height: "55px",
          borderRadius: "10%",
        }}
        src={ticket?.contact?.profilePicUrl}
      />
    ) : (
      <Avatar
        style={{
          marginTop: "0px",
          marginLeft: "0px",
          width: "50px",
          height: "50px",
          borderRadius: "10%",
        }}
        src={ticket?.contact?.profilePicUrl}
      />
    )}
  </ListItemAvatar>
</div>
  
<ListItemText
          disableTypography

          primary={
            <span className={classes.contactNameWrapper}>
              <Typography
                noWrap
                component="span"
                variant="body2"
                color="textPrimary"
              >
                {ticket.contact.name}
                
              </Typography>
              <ListItemSecondaryAction>
                <Box className={classes.ticketInfo1}>{renderTicketInfo()}</Box>
              </ListItemSecondaryAction>
            </span>

          }
          secondary={
            <span className={classes.contactNameWrapper}>

              <Typography
                className={classes.contactLastMessage}
                noWrap
                component="span"
                variant="body2"
                color="textSecondary"
              > {ticket.lastMessage.includes('data:image/png;base64') ? <MarkdownWrapper> Localização</MarkdownWrapper> : <MarkdownWrapper>{ticket.lastMessage}</MarkdownWrapper>}
                
              </Typography>

              <Badge
                className={classes.newMessagesCount}
                badgeContent={ticket.unreadMessages}
                classes={{
                  badge: classes.badgeStyle,
                }}
              />
            </span>
          }

        />

{/* Container dos botões de ação */}
<div className={classes.ticketActionsContainer}>

<Tooltip title="Última Mensagem">
<Typography
        className={classes.lastMessageTime}
        component="span"
        variant="body2"
        color="textSecondary"
      >
        {isSameDay(parseISO(ticket.updatedAt), new Date()) ? (
          <>{format(parseISO(ticket.updatedAt), "HH:mm")}</>
        ) : (
          <>{format(parseISO(ticket.updatedAt), "dd/MM/yyyy")}</>
        )}
      </Typography>
      </Tooltip >

  {ticket.status === "pending" && (
   <Tooltip title={i18n.t("ticketsList.buttons.accept")}>
   <ButtonWithSpinner
     startIcon={<CheckCircleOutlineIcon style={{color:"white"}}/>} 
     style={{ backgroundColor: 'green', color: 'white', padding: '10px', borderRadius: '8px', fontSize: '0.6rem' }}
     variant="contained"
     size="small"
     loading={loading}
     onClick={(e) => handleAcepptTicket(ticket.id)}
   >
     {i18n.t("ticketsList.buttons.accept")}
   </ButtonWithSpinner>
 </Tooltip>
)}
{ticket.status !== "closed" && (
 <Tooltip title={i18n.t("ticketsList.buttons.closed")}>
   <ButtonWithSpinner
     startIcon={<CancelOutlinedIcon style={{color:"white"}}/>} 
     style={{ backgroundColor: '#c90a0a', color: 'white', padding: '10px', borderRadius: '8px', fontSize: '0.6rem' }}
     variant="contained"
     size="small"
     loading={loading}
     onClick={(e) => handleCloseTicket(ticket.id)}
   >
     {i18n.t("ticketsList.buttons.closed")}
   </ButtonWithSpinner>
 </Tooltip>
)}
{ticket.status === "closed" && (
 <Tooltip title={i18n.t("ticketsList.buttons.reopen")}>
   <ButtonWithSpinner
     startIcon={<UndoIcon />} // Update icon
     style={{ backgroundColor: 'orange', color: 'white', padding: '10px', borderRadius: '8px', fontSize: '0.6rem' }}
     variant="contained"
     size="small"
     loading={loading}
     onClick={(e) => handleReopenTicket(ticket.id)}
   >
     {i18n.t("ticketsList.buttons.reopen")}
   </ButtonWithSpinner>
 </Tooltip>
)}
</div>
</ListItem>

      <Divider variant="inset" component="li" />
    </React.Fragment>
  );
};

export default TicketListItemCustom;