import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Avatar, Divider, ListItemIcon, Typography } from "@mui/material";
import {
  Login,
  Logout,
  Settings,
  DarkMode,
  LightMode,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

interface ButtonAppBarProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const ButtonAppBar: React.FC<ButtonAppBarProps> = ({
  setIsOpen,
  isLoggedIn,
  setIsLoggedIn,
  darkMode,
  setDarkMode,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDarkMode = () => {
    setDarkMode((prev) => !prev);
    handleClose();
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLoginModal = () => {
    setIsOpen(true);
  };

  const handleAccount = () => {
    navigate("/account");
    handleClose();
  };

  return (
    <Box
      sx={{ flexGrow: 1, textAlign: "center", height: "80px" }}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <AppBar
        position="fixed"
        elevation={1}
        sx={{
          height: "80px",
          justifyContent: "center",
          background: darkMode ? "#333" : "primary.main",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/*  Logo Section */}
          <Typography
            sx={{ flexGrow: 0, display: "flex", alignItems: "center" }}
            component={Link}
            to="/home"
          >
            <img
              src="/logo.png"
              alt="Logo"
              style={{ height: 32, marginRight: 32 }}
            />
            <img src="/talection.png" alt="Talection" style={{ height: 24 }} />
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          {/*  User Menu */}
          <div>
            {isLoggedIn ? (
              <>
                <IconButton
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle fontSize="large" />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={open}
                  onClose={handleClose}
                  slotProps={{
                    paper: {
                      elevation: 2,
                      sx: {
                        minWidth: 180,
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.2))",
                        mt: 1.5,
                        "& .MuiAvatar-root": {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                        "&::before": {
                          content: '""',
                          display: "block",
                          position: "absolute",
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: "background.paper",
                          transform: "translateY(-50%) rotate(45deg)",
                          zIndex: 0,
                        },
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <MenuItem onClick={handleAccount}>
                    <Avatar /> Profile
                  </MenuItem>

                  <Divider />

                  <MenuItem>
                    <ListItemIcon>
                      <Settings fontSize="small" />
                    </ListItemIcon>
                    Settings
                  </MenuItem>

                  {/*  Dark Mode Toggle */}
                  <MenuItem onClick={handleDarkMode}>
                    <ListItemIcon>
                      {darkMode ? (
                        <LightMode fontSize="small" />
                      ) : (
                        <DarkMode fontSize="small" />
                      )}
                    </ListItemIcon>
                    {darkMode ? "Light Mode" : "Dark Mode"}
                  </MenuItem>

                  {/*  Logout Button */}
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <IconButton
                size="large"
                aria-label="login"
                onClick={handleLoginModal}
                color="inherit"
                sx={{ display: "flex", alignItems: "center", borderRadius: 2 }}
              >
                <Login sx={{ marginRight: 1 }} />
                <Typography variant="button" display="block">
                  Login
                </Typography>
              </IconButton>
            )}
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default ButtonAppBar;
