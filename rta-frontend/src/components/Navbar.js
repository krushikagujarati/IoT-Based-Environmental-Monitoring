import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SourceIcon from '@mui/icons-material/Source';
import SettingsIcon from '@mui/icons-material/Settings';
import ScatterPlotIcon from '@mui/icons-material/ScatterPlot';
import FunctionsIcon from '@mui/icons-material/Functions';
import InsightsIcon from '@mui/icons-material/Insights';

function Navbar() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const navigateTo = (path) => {
    navigate(path);
    handleMenuClose();
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#076c93' }}>
      <Toolbar>
        {/* <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={handleMenuOpen}>
          <MenuIcon />
        </IconButton> */}
        <Typography variant="h6" sx={{ flexGrow: 1, color:'white' }}>
          IOT-Project
        </Typography>
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <Button color="inherit" startIcon={<DashboardIcon />} onClick={() => navigateTo('/')}>
            Dashboard
          </Button>
          <Button color="inherit" startIcon={<SettingsIcon />} onClick={() => navigateTo('/settings')}>
            Settings
          </Button>
        </Box>
        {/* Responsive menu for mobile */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          sx={{ display: { xs: 'block', md: 'none' } }}
        >
          <MenuItem onClick={() => navigateTo('/')}>
            <DashboardIcon sx={{ mr: 1 }} /> Dashboard
          </MenuItem>
          <MenuItem onClick={() => navigateTo('/data-source')}>
            <SourceIcon sx={{ mr: 1 }} /> Data Source
          </MenuItem>
          <MenuItem onClick={() => navigateTo('/pattern-definition')}>
            <ScatterPlotIcon sx={{ mr: 1 }} /> Pattern Definition
          </MenuItem>
          <MenuItem onClick={() => navigateTo('/model-config')}>
            <FunctionsIcon sx={{ mr: 1 }} /> ML Model Config
          </MenuItem>
          <MenuItem onClick={() => navigateTo('/visualization')}>
            <InsightsIcon sx={{ mr: 1 }} /> Visualization
          </MenuItem>
          <MenuItem onClick={() => navigateTo('/settings')}>
            <SettingsIcon sx={{ mr: 1 }} /> Settings
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
