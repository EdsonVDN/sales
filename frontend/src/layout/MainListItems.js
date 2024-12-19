import React, { useContext, useEffect, useReducer, useState } from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";
import "../layout/layout.css"; // Importe o arquivo CSS

import {
    Badge,
    Collapse,
    List,
    ListItem,
    ListItemIcon,
    IconButton,
    ListItemText,
    Divider,
    Typography,
    makeStyles,
} from "@material-ui/core";
import Tooltip from '@material-ui/core/Tooltip';
import contato from "../assets/contato.png";
import ajuda from "../assets/ajuda.png";
import chatinterno from "../assets/chatinterno.png";
import configuracoes from "../assets/configuracoes.png";
import automacao from "../assets/automacao.png";
import marketing from "../assets/marketing.png";
import organizacao from "../assets/organizacao.png";
import leads from "../assets/Leads.png";
import dashboard from "../assets/dashboard.png";
import comercial from "../assets/comercial.png";
import ticket from "../assets/ticket.png";
import agendarMensagem from "../assets/agendar-mensagem.png";
import { i18n } from "../translate/i18n";
import { WhatsAppsContext } from "../context/WhatsApp/WhatsAppsContext";
import { AuthContext } from "../context/Auth/AuthContext";
import { Can } from "../components/Can";
import { socketConnection } from "../services/socket";
import { isArray } from "lodash";
import api from "../services/api"; 
import ToDoList from "../pages/ToDoList/";
import toastError from "../errors/toastError";
import { AllInclusive, AttachFile, BlurCircular, Dashboard, DeviceHubOutlined, Schedule } from '@material-ui/icons';

import usePlans from "../hooks/usePlans";

const useStyles = makeStyles((theme) => ({
    listItem: {
        paddingLeft: theme.spacing(6),
        "&:hover": {
            backgroundColor: theme.palette.action.hover,
        },
        "&.Mui-selected": {
            backgroundColor: theme.palette.primary.light,
        },
        transition: theme.transitions.create(['background-color', 'color'], {
            duration: theme.transitions.duration.shortest,
        }),
    },

    collapseContainer: {
        transition: theme.transitions.create('height', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },

    drawerContainer: {
        display: "flex",
        border:"none",
        flexDirection: "column",
        minHeight: "50vh",
        position: "relative",
        "&::-webkit-scrollbar": {
            width: 8,
        },
        "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
        },
        "&::-webkit-scrollbar-thumb": {
            background: "#888",
            borderRadius: 4,
        },

        "&::-webkit-scrollbar-thumb:hover": {
            background: "#555",
        },
    },

    Icon: { 
      minWidth: 0,
      marginRight: theme.spacing(0), 
    },

  customListItemText: {
    whiteSpace: "nowrap", 
    overflow: "hidden",   
    transition: "opacity 0.3s ease", 
    color:theme.palette.primary,
  },

  customListItemTextCollapsed: {
    marginLeft: "50px", 
    opacity: 1,
  },
  
  customListItem: {
    "&:hover": {
      backgroundColor: "#003355",
      color: "white",
      transition: "opacity 0.3s ease",
    },
  },

    customIcon: {
      minWidth: 0,
      marginRight: theme.spacing(1),  
    },

}));

function ListItemLink(props) {
    const { icon, primary, to, className, onClick } = props;

    const renderLink = React.useMemo(
        () =>
            React.forwardRef((itemProps, ref) => (
                <RouterLink to={to} ref={ref} {...itemProps} onClick={onClick} />
            )),
        [to, onClick]
    );

    return (
        <li>
            <ListItem button dense component={renderLink} className={className}>
                {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
                <ListItemText primary={primary} />
            </ListItem>
        </li>
    );
}

const reducer = (state, action) => {
    if (action.type === "LOAD_CHATS") {
        const chats = action.payload;
        const newChats = [];

        if (isArray(chats)) {
            chats.forEach((chat) => {
                const chatIndex = state.findIndex((u) => u.id === chat.id);
                if (chatIndex !== -1) {
                    state[chatIndex] = chat;
                } else {
                    newChats.push(chat);
                }
            });
        }

        return [...state, ...newChats];
    }

    if (action.type === "UPDATE_CHATS") {
        const chat = action.payload;
        const chatIndex = state.findIndex((u) => u.id === chat.id);

        if (chatIndex !== -1) {
            state[chatIndex] = chat;
            return [...state];
        } else {
            return [chat, ...state];
        }
    }

    if (action.type === "DELETE_CHAT") {
        const chatId = action.payload;

        const chatIndex = state.findIndex((u) => u.id === chatId);
        if (chatIndex !== -1) {
            state.splice(chatIndex, 1);
        }
        return [...state];
    }

    if (action.type === "RESET") {
        return [];
    }

    if (action.type === "CHANGE_CHAT") {
        const changedChats = state.map((chat) => {
            if (chat.id === action.payload.chat.id) {
                return action.payload.chat;
            }
            return chat;
        });
        return changedChats;
    }
};

const MainListItems = (props) => {
  const [openSections, setOpenSections] = useState([null]);
  const classes = useStyles();
  const { drawerClose, collapsed, handleIconClick, drawerOpen, setDrawerOpen } = props;
    const { whatsApps } = useContext(WhatsAppsContext);
    const { user, handleLogout } = useContext(AuthContext);
    const [connectionWarning, setConnectionWarning] = useState(false);
    const history = useHistory();

        // States para controlar os collapses:
        const [showDashboards, setShowDashboards] = useState(false);
        const [showTickets, setShowTickets] = useState(false);
        const [showLeads, setShowLeads] = useState(false);
        const [showContacts, setShowContacts] = useState(false);
        const [showSupport, setShowSupport] = useState(false);
        const [showCommunication, setShowCommunication] = useState(false);
        const [showWhatsApp, setShowWhatsApp] = useState(false);
        const [showAutomation, setShowAutomation] = useState(false);
        const [showSettings, setShowSettings] = useState(false);
        const [showCommercial, setShowCommercial] = useState(false);
        const [showCampaigns, setShowCampaigns] = useState(false);
        const [showKanban, setShowKanban] = useState(false);
        const [showOpenAi, setShowOpenAi] = useState(false);
        const [showIntegrations, setShowIntegrations] = useState(false);
        const [showSchedules, setShowSchedules] = useState(false);
        const [showCampaignsConfig, setCampaignsConfig] = useState(false);
        const [showInternalChat, setShowInternalChat] = useState(false);
        const [showExternalApi, setShowExternalApi] = useState(false);
        const [invisible, setInvisible] = useState(true);
        const [pageNumber, setPageNumber] = useState(1);
        const [searchParam] = useState("");
        const [chats, dispatch] = useReducer(reducer, []);
        const { getPlanCompany } = usePlans();

 // Estado para controlar a seção aberta:
 const [openSection, setOpenSection] = useState(null);

    // Função para abrir/fechar as seções
    const handleSectionClick = (sectionName) => {
      setOpenSection(prevOpenSection => (prevOpenSection === sectionName ? null : sectionName));
  
      // Expande o menu se estiver colapsado
      if (collapsed) {
        handleIconClick();
      }
    };

    function CustomListItem({ children, ...props }) {
      const classes = useStyles();
    
      return (
        <ListItem button {...props} className={classes.customListItem}>
          {children}
        </ListItem>
      );
    }
    
    function CustomListItemIcon({ children, ...props }) {
      const classes = useStyles();
    
      return (
        <div className={classes.customIcon} {...props}> 
          {children}
        </div>
      );
    }

    function CustomListItemText({ children, primary, collapsed, fontSize, ...props }) { // Adicione a prop children
      const classes = useStyles();
    
      return (
        <div className={collapsed ? classes.customListItemTextCollapsed : classes.customListItemText} {...props} style={{ fontSize }}>
          {primary}
        </div>
      );
    }      

    // Função para buscar os dados da empresa e definir os estados
    const fetchData = async () => {
        const companyId = user.companyId;
        const planConfigs =
        await getPlanCompany(undefined, companyId);

        setShowCampaigns(planConfigs.plan.useCampaigns);
        setShowKanban(planConfigs.plan.useKanban);
        setShowOpenAi(planConfigs.plan.useOpenAi);
        setShowIntegrations(planConfigs.plan.useIntegrations);
        setShowSchedules(planConfigs.plan.useSchedules);
        setShowInternalChat(planConfigs.plan.useInternalChat);
        setShowExternalApi(planConfigs.plan.useExternalApi);
      };
    
      // useEffect para chamar fetchData após a montagem do componente
      useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
    
      // useEffect para fechar todos os collapses quando o menu é fechado
      useEffect(() => {
        if (collapsed) {
          setShowDashboards(false);
          setShowTickets(false);
          setShowLeads(false);
          setShowContacts(false);
          setShowSupport(false);
          setShowCommunication(false);
          setShowWhatsApp(false);
          setShowAutomation(false);
          setShowSettings(false);
          setShowCommercial(false);
          setOpenSection(null); // Fecha a seção aberta
        }
      }, [collapsed]);
        
      useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
          fetchChats();
        }, 500);
        return () => clearTimeout(delayDebounceFn);
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [searchParam, pageNumber]);
    
      useEffect(() => {
        const companyId = localStorage.getItem("companyId");
        const socket = socketConnection({ companyId });
    
        socket.on(`company-${companyId}-chat`, (data) => {
          if (data.action === "new-message") {
            dispatch({ type: "CHANGE_CHAT", payload: data });
          }
          if (data.action === "update") {
            dispatch({ type: "CHANGE_CHAT", payload: data });
          }
        });
        return () => {
          socket.disconnect();
        };
      }, []);
    
      useEffect(() => {
        let unreadsCount = 0;
        if (chats.length > 0) {
          for (let chat of chats) {
            for (let chatUser of chat.users) {
              if (chatUser.userId === user.id) {
                unreadsCount += chatUser.unreads;
              }
            }
          }
        }
        if (unreadsCount > 0) {
          setInvisible(false);
        } else {
          setInvisible(true);
        }
      }, [chats, user.id]);
    
      useEffect(() => {
        if (localStorage.getItem("cshow")) {
          setShowCampaigns(true);
        }
      }, []);
    
      useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
          if (whatsApps.length > 0) {
            const offlineWhats = whatsApps.filter((whats) => {
              return (
                whats.status === "qrcode" ||
                whats.status === "PAIRING" ||
                whats.status === "DISCONNECTED" ||
                whats.status === "TIMEOUT" ||
                whats.status === "OPENING"
              );
            });
            if (offlineWhats.length > 0) {
              setConnectionWarning(true);
            } else {
              setConnectionWarning(false);
            }
          }
        }, 2000);
        return () => clearTimeout(delayDebounceFn);
      }, [whatsApps]);
    
      const fetchChats = async () => {
        try {
          const { data } = await api.get("/chats/", {
            params: { searchParam, pageNumber },
          });
          dispatch({ type: "LOAD_CHATS", payload: data.records });
        } catch (err) {
          toastError(err);
        }
      };
        
      return (
        <div onClick={drawerClose} className={classes.drawerContainer}>
    
      {/* Dashboards */}
      <CustomListItem button onClick={() => handleSectionClick("dashboards")}>
        <CustomListItemIcon>
        <img src={dashboard} alt="dashboard" style={{ width: '25px', height: '25px' }}/>
        </CustomListItemIcon>
        <CustomListItemText primary="Dashboards" collapsed={collapsed} />
      </CustomListItem>
      <Collapse in={openSection === "dashboards"} timeout="auto" unmountOnExit className={classes.collapseContainer}>
        <List component="div" disablePadding>
          <ListItemLink to="/" primary="Visão Geral" className={classes.listItem} onClick={handleIconClick} />
        </List>
      </Collapse>

    {/* Atendimentos */}
      <div><Tooltip title="Atendimento">
        <CustomListItem button onClick={() => handleSectionClick("tickets")}>
          <CustomListItemIcon>
          <img src={ticket} alt="ticket" style={{ width: '25px', height: '25px' }}/>
          </CustomListItemIcon>
          <CustomListItemText primary="Atendimentos" collapsed={collapsed} />
      </CustomListItem>
      </Tooltip>
      </div>
      <Collapse in={openSection === "tickets"} timeout="auto" unmountOnExit className={classes.collapseContainer}>
        <List component="div" disablePadding>
          <ListItemLink to="/tickets" primary="Chats" className={classes.listItem} onClick={handleIconClick} />
          <ListItemLink to="/kanban" primary="Jornada do Cliente" className={classes.listItem} onClick={handleIconClick} />
          <ListItemLink to="/quick-messages" primary="Respostas Rápidas" className={classes.listItem} onClick={handleIconClick} />
        </List>
      </Collapse>

      {/* Automação */}
      <CustomListItem button onClick={() => { handleSectionClick("automation"); setShowAutomation(!showAutomation); handleIconClick(); }}>
        <CustomListItemIcon>
        <img 
          src={automacao} 
          alt="automacao" 
          style={{ width: '25px', height: '25px' }} 
        />
        </CustomListItemIcon>
        <CustomListItemText primary="Automação" collapsed={collapsed} />
      </CustomListItem>
      <Collapse in={openSection === "automation"} timeout="auto" unmountOnExit className={classes.collapseContainer}>
        <List component="div" disablePadding>
          <ListItemLink to="/queues" primary="Filas e ChatBot" className={classes.listItem} onClick={handleIconClick} />
          {showOpenAi && <ListItemLink to="/prompts" primary="Prompt GPT" className={classes.listItem} onClick={handleIconClick} />}
          {showIntegrations && <ListItemLink to="/queue-integration" primary="Integrações" className={classes.listItem} onClick={handleIconClick} />}
        </List>
      </Collapse>

  {/* Marketing */}
<CustomListItem button onClick={() => handleSectionClick("communication")}>
<CustomListItemIcon>
          <img src={marketing} alt="marketing" style={{ width: '25px', height: '25px' }}/>
        </CustomListItemIcon>
  <CustomListItemText primary="Marketing" collapsed={collapsed} />
</CustomListItem>
<Collapse in={openSection === "communication"} timeout="auto" unmountOnExit className={classes.collapseContainer}>
  <List component="div" disablePadding>
    <ListItem button onClick={() => setShowWhatsApp(!showWhatsApp)}>
      <ListItemText primary="WhatsApp" />
    </ListItem>
    <Collapse in={showWhatsApp} timeout="auto" unmountOnExit className={classes.collapseContainer}>
      <List component="div" disablePadding>
        {showCampaigns && (
          <>
            <ListItemLink to="/campaigns" primary="Campanhas" className={classes.listItem} onClick={handleIconClick} /> 
            <ListItemLink to="/campaigns-config" primary="Configurações" className={classes.listItem} onClick={handleIconClick} />
          </>
        )}
      </List>
    </Collapse>
  </List>
</Collapse>

        {/* Agendar Mensagem */}
        <CustomListItem button onClick={() => handleSectionClick("schedules")}>
        <CustomListItemIcon>
            <img src={agendarMensagem} alt="agendar-mensagem" style={{ width: '25px', height: '25px' }} />
          </CustomListItemIcon>
        <CustomListItemText primary="Agendar Mensagem" collapsed={collapsed} />
      </CustomListItem>
      <Collapse in={openSection === "schedules"} timeout="auto" unmountOnExit className={classes.collapseContainer}>
        <List component="div" disablePadding>
          <ListItemLink to="/schedules" primary="WhatsApp" className={classes.listItem} onClick={handleIconClick} />
        </List>
      </Collapse>

  {/* Leads */}
  <CustomListItem button onClick={() => handleSectionClick("leads")}>
        <CustomListItemIcon>
        <img src={leads} alt="leads" style={{ width: '25px', height: '25px' }}/>
        </CustomListItemIcon>
        <CustomListItemText primary="Leads" collapsed={collapsed} />
      </CustomListItem>
      <Collapse in={openSection === "leads"} timeout="auto" unmountOnExit className={classes.collapseContainer}>
        <List component="div" disablePadding>
          {showCampaigns && (
            <ListItemLink to="/contact-lists" primary="Importar Leads" className={classes.listItem} onClick={handleIconClick} />
          )}
        </List>
      </Collapse>

      {/* Contatos */}
      <CustomListItem button onClick={() => handleSectionClick("contacts")}>
        <CustomListItemIcon>
        <img 
          src={contato} 
          alt="contato" 
          style={{ width: '25px', height: '25px' }} 
        />
        </CustomListItemIcon>
        <CustomListItemText primary="Contatos" collapsed={collapsed} />
      </CustomListItem>
      <Collapse in={openSection === "contacts"} timeout="auto" unmountOnExit className={classes.collapseContainer}>
        <List component="div" disablePadding>
          <ListItemLink to="/contacts" primary="Contatos" className={classes.listItem} onClick={handleIconClick} />
        </List>
      </Collapse>

  {/* Organização*/}
  <CustomListItem button onClick={() => handleSectionClick("support")}>
        <CustomListItemIcon>
        <img src={organizacao} alt="organizacao" style={{ width: '25px', height: '25px' }}/>
        </CustomListItemIcon>
        <CustomListItemText primary="Organização" collapsed={collapsed} />
      </CustomListItem>
      <Collapse in={openSection === "support"} timeout="auto" unmountOnExit className={classes.collapseContainer}>
        <List component="div" disablePadding>
          <ListItemLink to="/tags" primary="Tags" className={classes.listItem} onClick={handleIconClick} />
          {user.super && (
            <ListItemLink to="/announcements" primary="Avisos" className={classes.listItem} onClick={handleIconClick} />
          )}
          <ListItemLink to="/todolist" primary="Tarefas" className={classes.listItem} onClick={handleIconClick} />
          <ListItemLink to="/files" primary="Arquivos" className={classes.listItem} onClick={handleIconClick} />
        </List>
      </Collapse>


      {/* Comercial */}
      <CustomListItem button onClick={() => { handleSectionClick("commercial"); setShowCommercial(!showCommercial); handleIconClick(); }}>
        <CustomListItemIcon>
        <img src={comercial} alt="comercial" style={{ width: '25px', height: '25px' }}/>
        </CustomListItemIcon>
        <CustomListItemText primary="Comercial" collapsed={collapsed} />
      </CustomListItem>
      <Collapse in={openSection === "commercial"} timeout="auto" unmountOnExit className={classes.collapseContainer}>
        <List component="div" disablePadding>
          <ListItemLink to="/financeiro" primary="Financeiro" className={classes.listItem} onClick={handleIconClick} />
          <ListItemLink to="/settings" primary="Planos" className={classes.listItem} onClick={handleIconClick} />
        </List>
      </Collapse>
    
          {/* Chat Interno */}
          <CustomListItem button onClick={() => { history.push("/chats"); handleIconClick(); }}>
              <CustomListItemIcon>
              <img src={chatinterno} alt="chatinterno" style={{ width: '25px', height: '25px' }}/>
              </CustomListItemIcon>
            <CustomListItemText primary="Chat Interno" collapsed={collapsed} /> 
          </CustomListItem>
   
     {/* Configurações */}
     <CustomListItem button onClick={() => { handleSectionClick("settings"); setShowSettings(!showSettings); handleIconClick(); }}>
        <CustomListItemIcon>
        <img src={configuracoes} alt="configuracoes" style={{ width: '25px', height: '25px' }}/>
        </CustomListItemIcon>
        <CustomListItemText primary="Configurações" collapsed={collapsed} />
      </CustomListItem>
      <Collapse in={openSection === "settings"} timeout="auto" unmountOnExit className={classes.collapseContainer}>
        <List component="div" disablePadding>
          <ListItemLink to="/connections" primary="Canais" className={classes.listItem} onClick={handleIconClick} />
          <ListItemLink to="/users" primary="Equipe" className={classes.listItem} onClick={handleIconClick} />
          {showExternalApi && <ListItemLink to="/messages-api" primary="Avançado" className={classes.listItem} onClick={handleIconClick} />}
        </List>
      </Collapse>

          {/* Ajuda */}
          <CustomListItem button onClick={() => { history.push("/helps"); handleIconClick(); }}>
              <CustomListItemIcon>
              <img src={ajuda} alt="ajuda" style={{ width: '25px', height: '25px' }}/>
              </CustomListItemIcon>
            <CustomListItemText primary="Central de Ajuda" collapsed={collapsed} />
          </CustomListItem>

        </div>
      );
    };
    
    export default MainListItems;   