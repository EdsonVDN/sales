import React, { useState, useContext, useEffect } from "react";
import { ReactComponent as Logo } from "../assets/logo.svg";

import clsx from "clsx";

import './layout.css';
import {
  makeStyles,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  MenuItem,
  IconButton,
  Menu,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";

import Tooltip from '@material-ui/core/Tooltip';
import MenuIcon from "@material-ui/icons/Menu";
import ExitToApp from "@material-ui/icons/ExitToApp";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import AccountCircle from "@material-ui/icons/AccountCircle";
import CachedIcon from "@material-ui/icons/Cached";
import MainListItems from "./MainListItems";
import NotificationsPopOver from "../components/NotificationsPopOver";
import NotificationsVolume from "../components/NotificationsVolume";
import UserModal from "../components/UserModal";
import { AuthContext } from "../context/Auth/AuthContext";
import BackdropLoading from "../components/BackdropLoading";
import { i18n } from "../translate/i18n";
import toastError from "../errors/toastError";
import AnnouncementsPopover from "../components/AnnouncementsPopover";
import DarkModeToggle from "../components/DarkMode/DarkModeToggle"

import { socketConnection } from "../services/socket";
import ChatPopover from "../pages/Chat/ChatPopover";

import { useDate } from "../hooks/useDate";

import ColorModeContext from "../layout/themeContext";
import zIndex from "@material-ui/core/styles/zIndex";

const drawerWidth = 200;

const useStyles = makeStyles((theme, palette, mode) => ({
  root: {
    display: "flex",
    height: "100vh",
    [theme.breakpoints.down("sm")]: {
      height: "calc(100vh - 56px)",
    },
    backgroundColor: theme.palette.fancyBackground,
    transition: "1000ms linear", 
 
    '& .MuiButton-outlinedPrimary': {
      color: theme.mode === 'light' ? '#FFF' : '#FFF',
      backgroundColor: theme.mode === 'light' ? '#004A77' : '#1c1c1c',
      //border: theme.mode === 'light' ? '1px solid rgba(0 124 102)' : '1px solid rgba(255, 255, 255, 0.5)',
    },
    '& .MuiTab-textColorPrimary.Mui-selected': {
      color: theme.mode === 'light' ? '##004A77' : '#FFF',
    },
    '& .MuiListItem-button':{
      transition:"none",
    },
    "& .MuiIconButton-root": { 
      color: theme.mode === "light" ? "#004A77" : "#f7f7f7", 
    },

    "& .MuiSvgIcon-root": { 
      color: theme.mode === "light" ? "#004A77" : "#f7f7f7", 
    },

    "& .rbc-toolbar button": { 
      color: theme.mode === "light" ? "#004A77" : "#f7f7f7", 
    },
  },

  avatar: {
    width: "100%",
  },

  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
    boxShadow:"none",
    transition: "1000ms linear", 
    background: theme.palette.barraSuperior,
  },

  toolbarIcon: {
    backgroundColor: theme.palette.sidebar,
    transition: "1000ms linear", 
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 8px",
    minHeight: "48px",
    [theme.breakpoints.down("sm")]: {
      height: "48px"
    }
  },

  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: "400ms linear", 
  },

  appBarShift: {
    marginLeft: drawerWidth,
    boxShadow:"none",
    width: `calc(100% - ${drawerWidth}px)`,
    transition: "400ms linear", 
    [theme.breakpoints.down("sm")]: {
      display: "none"
    }
  },

  closemenu:{
    zindex:999,  
    padding:0,
  },

  menuChevron: {
    width:"35px",
    height:"35px",
    color: theme.palette.text.primary,      
    backgroundColor:theme.palette.menuChevron,
    position:"relative",
    top:"55px",
    right:"0px",
    margin:"-20px",
    zIndex:"9999",
 "& :active":{
    backgroundColor:theme.palette.menuChevron,
    borderRadius:"50%",
    width:"35px",
    height:"35px",
 },
 "& :hover":{
    backgroundColor:theme.palette.menuChevron,
    borderRadius:"50%",
    width:"35px",
    height:"35px",
 },
},

 menuChevronCollapsed: { 
  backgroundColor:theme.palette.menuChevronCollapsed,
},
  title: {
    flexGrow: 1,
    fontSize: 14,
    color: theme.palette.textoBarraSuperior,
  },

  drawerPaper: {
    overflowX: "hidden",
    border:"none",
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: "400ms linear", 
    [theme.breakpoints.down("sm")]: {
      width: "100%"
    },
    ...theme.scrollbarStylesSoft
  },

  drawerPaperClose: {
    transition: "400ms linear", 
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
    [theme.breakpoints.down("sm")]: {
      width: "100%"
    }
  },

  appBarSpacer: {
    minHeight: "48px",
  },

  content: {
    flex: 1,
    overflow: "auto",
  },
  
  drawerContainer: {
    backgroundColor: theme.palette.sidebar,
    transition: "1000ms linear", 
    display: 'flex',
    flexDirection: 'column',
    minHeight: '50vh', 
    height:"90vh",
  },

  logoutContainer: {
    position: "relative",
    marginTop: "auto",
    width: "100%",
    zIndex: 1,
    padding: theme.spacing(0),
    display: "flex",
    backgroundColor: theme.palette.sidebar,
    transition: "1000ms linear", 
    alignItems: "center", 
    justifyContent:"center",
    flexDirection: (props) => (props.collapsed ? "column" : "row"),
    gap: theme.spacing(1), 
  },

  logout:{
      color:theme.mode === 'light' ? '#004A77' : '#FFF',
  },

  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column"
  },

  containerWithScroll: {
    flex: 1,
    alignContent:"center",
    overflowY: "scroll",
    overflowX: "hidden",
    ...theme.scrollbarStyles,
  },

  NotificationsPopOver: {
    // color: theme.barraSuperior.secondary.main,
  },

  logo: {
    width: "100%",
    padding:"0px",
    margin:"0px",
    height: "auto",
    maxWidth: 180,
    transition: "none",  // Adiciona a transição para o transform
    [theme.breakpoints.down("sm")]: {
      maxWidth: 180,
    },
    logo: theme.logo,
  },

  logoCollapsed: {
    transform: "scale(0.4)", // Define o zoom out (80% do tamanho original)
m: "scale(0.8)", // Define o zoom out (80% do tamanho original)
transition: "all .5s ease-in .1s",  
  },

  customIcon: { 
    marginRight: theme.spacing(2), 
  },

}));

const LoggedInLayout = ({ children, themeToggle, ...props}) => {
  const classes = useStyles();
  const [collapsed, setCollapsed] = useState(false);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { handleLogout, loading } = useContext(AuthContext);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerVariant, setDrawerVariant] = useState("permanent");
  const [showlastIcons, setShowlastIcons] = useState(false);
  // const [dueDate, setDueDate] = useState("");
  const { user } = useContext(AuthContext);

  const logoutClasses = useStyles({ collapsed: !drawerOpen });
  const theme = useTheme();
  const { colorMode } = useContext(ColorModeContext);
  const greaterThenSm = useMediaQuery(theme.breakpoints.up("sm"));

  const [volume, setVolume] = useState(localStorage.getItem("volume") || 1);
  

  const { dateToClient } = useDate();
    // Função handleIconClick dentro do LoggedInLayout
    const handleIconClick = () => {
      setDrawerOpen(true);
      setCollapsed(false);
    };

  //################### CODIGOS DE TESTE #########################################
  // useEffect(() => {
  //   navigator.getBattery().then((battery) => {
  //     console.log(`Battery Charging: ${battery.charging}`);
  //     console.log(`Battery Level: ${battery.level * 100}%`);
  //     console.log(`Charging Time: ${battery.chargingTime}`);
  //     console.log(`Discharging Time: ${battery.dischargingTime}`);
  //   })
  // }, []);

  // useEffect(() => {
  //   const geoLocation = navigator.geolocation

  //   geoLocation.getCurrentPosition((position) => {
  //     let lat = position.coords.latitude;
  //     let long = position.coords.longitude;

  //     console.log('latitude: ', lat)
  //     console.log('longitude: ', long)
  //   })
  // }, []);

  // useEffect(() => {
  //   const nucleos = window.navigator.hardwareConcurrency;

  //   console.log('Nucleos: ', nucleos)
  // }, []);

  // useEffect(() => {
  //   console.log('userAgent', navigator.userAgent)
  //   if (
  //     navigator.userAgent.match(/Android/i)
  //     || navigator.userAgent.match(/webOS/i)
  //     || navigator.userAgent.match(/iPhone/i)
  //     || navigator.userAgent.match(/iPad/i)
  //     || navigator.userAgent.match(/iPod/i)
  //     || navigator.userAgent.match(/BlackBerry/i)
  //     || navigator.userAgent.match(/Windows Phone/i)
  //   ) {
  //     console.log('é mobile ', true) //celular
  //   }
  //   else {
  //     console.log('não é mobile: ', false) //nao é celular
  //   }
  // }, []);
  //##############################################################################

  useEffect(() => {
    if (document.body.offsetWidth > 600) {
      setDrawerOpen(true);
    }
  }, []);

  useEffect(() => {
    if (document.body.offsetWidth < 600) {
      setDrawerVariant("temporary");
    } else {
      setDrawerVariant("permanent");
    }
  }, [drawerOpen]);

  useEffect(() => {
    const companyId = localStorage.getItem("companyId");
    const userId = localStorage.getItem("userId");

    const socket = socketConnection({ companyId });

    socket.on(`company-${companyId}-auth`, (data) => {
      if (data.user.id === +userId) {
        toastError("Sua conta foi acessada em outro computador.");
        setTimeout(() => {
          localStorage.clear();
          window.location.reload();
        }, 1000);
      }
    });

    socket.emit("userStatus");
    const interval = setInterval(() => {
      socket.emit("userStatus");
    }, 1000 * 60 * 5);

    return () => {
      socket.disconnect();
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setMenuOpen(false);
  };

  const handleOpenUserModal = () => {
    setUserModalOpen(true);
    handleCloseMenu();
  };

  const handleClickLogout = () => {
    handleCloseMenu();
    handleLogout();
  };

  const drawerClose = () => {
    if (document.body.offsetWidth < 600) {
      setDrawerOpen(false);
    }
  };
  

  const handleRefreshPage = () => {
    window.location.reload(false);
  }

  const handleMenuItemClick = () => {
    const { innerWidth: width } = window;
    if (width <= 600) {
      setDrawerOpen(false);
    }
  };

  const toggleColorMode = () => {
    colorMode.toggleColorMode();
  }

  if (loading) {
    return <BackdropLoading />;
  }

  return (
		<div className={classes.root}>
		  <Drawer // Drawer de volta no LoggedInLayout
        variant={drawerVariant}
        className={drawerOpen ? classes.drawerPaper : classes.drawerPaperClose}
        classes={{
          paper: clsx(classes.drawerPaper, !drawerOpen && classes.drawerPaperClose),
        }}
        open={drawerOpen}
      >
        
        <div className={classes.toolbarIcon}>
       
        <Logo
  className={clsx(classes.logo, {
    [classes.logoLight]: theme.palette.mode === "light",
    [classes.logoDark]: theme.palette.mode === "dark",
  })}
  alt="logo"
/>

</div>

    {/* Conteúdo do Drawer */}
      <div className={classes.drawerContainer}> 
        <List className={classes.containerWithScroll}>
           <MainListItems
              drawerClose={drawerClose}
              collapsed={!drawerOpen}
              handleIconClick={handleIconClick}
           />
        </List>
      </div>

      <div><Divider style={{ width: "100%" }} /></div>
      <div className={logoutClasses.logoutContainer}>
        
            <Tooltip title="Volume das Notificações">
            <div>
              <NotificationsVolume setVolume={setVolume} volume={volume} />
            </div>
          </Tooltip>

          <div>
          <Tooltip title="Alterar Tema">
            <IconButton edge="start" onClick={toggleColorMode}>
            <DarkModeToggle onClick={toggleColorMode}  />
          </IconButton>
          </Tooltip>
          </div>

          <div>
          <Tooltip title="Logout">
        <IconButton className={classes.logout} onClick={handleClickLogout}>
            <ExitToApp/>
            </IconButton>
          </Tooltip>
        </div>
</div>
       </Drawer>

       <div
  className={classes.menuButtonContainer}
  sx={{
    left: drawerOpen ? drawerWidth - theme.spacing(7) : theme.spacing(7) - 12,
  }}
>
  <IconButton
    onClick={() => setDrawerOpen(!drawerOpen)}
    className={clsx(classes.menuChevron, { [classes.menuChevronCollapsed]: !drawerOpen })} // Aplique a classe condicionalmente
  >
    {drawerOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
  </IconButton>
</div>
<UserModal
        open={userModalOpen}
        onClose={() => setUserModalOpen(false)}
        userId={user?.id}
      />
      <AppBar
        position="absolute"
        className={clsx(classes.appBar, drawerOpen && classes.appBarShift)}
        color="primary"
      >
        <Toolbar variant="dense" className={classes.toolbar}>

          <Typography
            component="h2"
            variant="h6"
            color="primary"
            noWrap
            className={classes.title}
          >
            {/* {greaterThenSm && user?.profile === "admin" && getDateAndDifDays(user?.company?.dueDate).difData < 7 ? ( */}
            {greaterThenSm && user?.profile === "admin" && user?.company?.dueDate ? (
              <>
                Olá <b>{user.name}</b>, Bem vindo a <b>{user?.company?.name}</b>! {/*(Ativo até {dateToClient(user?.company?.dueDate)})*/}
              </>
            ) : (
              <>
                Olá  <b>{user.name}</b>, Bem vindo a <b>{user?.company?.name}</b>!
              </>
            )}
          </Typography>

          <IconButton
          onClick={handleRefreshPage}
          aria-label={i18n.t("mainDrawer.appBar.refresh")}
          color={theme.palette.mode === "light" ? "primary" : "inherit"} // Cor condicional
        >
          <CachedIcon />
        </IconButton>

          {user.id && <NotificationsPopOver volume={volume} />}

          <AnnouncementsPopover />

          <ChatPopover />

          <div>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              variant="contained"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              getContentAnchorEl={null}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={menuOpen}
              onClose={handleCloseMenu}
            >
              <MenuItem onClick={handleOpenUserModal}>
                {i18n.t("mainDrawer.appBar.user.profile")}
              </MenuItem>
              <MenuItem onClick={handleClickLogout}>
                {i18n.t("mainDrawer.appBar.user.logout")}
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />

        {children ? children : null}
      </main>
    </div>
  );
};

export default LoggedInLayout;