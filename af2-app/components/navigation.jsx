import * as React from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Typography,
} from "@mui/material";
import {
  ImageSearch as EpicIcon,
  PhotoCamera as PictureIcon,
  Explore as MarsIcon,
  Menu as MenuIcon,
  Home as HomeIcon,
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";

export default function EnhancedNavigationHeader() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();

  const navigationItems = [
    {
      label: "Home",
      path: "/",
      icon: <HomeIcon />,
      description: "Welcome page",
    },
    {
      label: "EPIC Images",
      path: "/epicpictures",
      icon: <EpicIcon />,
      description: "Earth Polychromatic Imaging Camera",
    },
    {
      label: "Mars Images",
      path: "/marsroverpictures",
      icon: <MarsIcon />,
      description: "Mars Rover Photography",
    },
  ];

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const renderDesktopNavigation = () => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {navigationItems.map((item) => (
        <Button
          key={item.path}
          component={Link}
          to={item.path}
          startIcon={item.icon}
          sx={{
            color: isActivePath(item.path) ? "secondary.main" : "inherit",
            backgroundColor: isActivePath(item.path)
              ? "rgba(255, 255, 255, 0.1)"
              : "transparent",
            borderRadius: 2,
            px: 2,
            py: 1,
            textTransform: "none",
            fontWeight: isActivePath(item.path) ? 600 : 400,
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              transform: "translateY(-1px)",
            },
          }}
        >
          {item.label}
        </Button>
      ))}
    </Box>
  );

  const renderMobileNavigation = () => (
    <>
      <IconButton
        edge="end"
        color="inherit"
        aria-label="menu"
        onClick={handleMenuOpen}
        sx={{
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          },
        }}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 250,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
            borderRadius: 2,
          },
        }}
      >
        {navigationItems.map((item) => (
          <MenuItem
            key={item.path}
            component={Link}
            to={item.path}
            onClick={handleMenuClose}
            selected={isActivePath(item.path)}
            sx={{
              py: 1.5,
              px: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              "&.Mui-selected": {
                backgroundColor: "primary.light",
                "&:hover": {
                  backgroundColor: "primary.light",
                },
              },
            }}
          >
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}
            >
              {item.icon}
              <Typography
                variant="body1"
                fontWeight={isActivePath(item.path) ? 600 : 400}
              >
                {item.label}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ ml: 3 }}>
              {item.description}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );

  return (
    <AppBar
      position="sticky"
      sx={{
        background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
        backdropFilter: "blur(10px)",
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          px: { xs: 2, sm: 3, md: 4 },
          py: 1,
        }}
      >
        {/* Logo/Brand Section */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              textDecoration: "none",
              color: "inherit",
              fontWeight: 700,
              background: "linear-gradient(45deg, #fff, #e3f2fd)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              "&:hover": {
                textShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
              },
            }}
          >
            NASA Explorer
          </Typography>
        </Box>

        {/* Navigation Section */}
        {isMobile ? renderMobileNavigation() : renderDesktopNavigation()}
      </Toolbar>
    </AppBar>
  );
}
