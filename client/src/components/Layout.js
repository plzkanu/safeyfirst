import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  AddCircle as AddCircleIcon,
  List as ListIcon,
  BarChart as BarChartIcon,
  People as PeopleIcon,
  ExitToApp as ExitToAppIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import Logo from './Logo';

const drawerWidth = 240;

const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: '대시보드', icon: <DashboardIcon />, path: '/', adminOnly: false },
    { text: '활동 기록', icon: <ListIcon />, path: '/activities', adminOnly: false },
    { text: '활동 추가', icon: <AddCircleIcon />, path: '/activity/new', adminOnly: false },
  ];

  if (isAdmin) {
    menuItems.push(
      { text: '관리자 대시보드', icon: <BarChartIcon />, path: '/admin', adminOnly: true },
      { text: '통계', icon: <BarChartIcon />, path: '/admin/statistics', adminOnly: true },
      { text: '사용자 관리', icon: <PeopleIcon />, path: '/admin/users', adminOnly: true }
    );
  }

  const drawer = (
    <Box>
      <Toolbar
        sx={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e0e0e0',
          minHeight: '64px !important',
          px: 1.5,
          py: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            px: 1.5,
            py: 1.5,
          }}
        >
          <Logo />
          <Typography 
            variant="body2" 
            component="div" 
            sx={{ 
              mt: 0.5,
              color: '#333333',
              fontWeight: 600,
              fontSize: '0.875rem',
              textAlign: 'center',
              whiteSpace: 'nowrap',
            }}
          >
            안전 관리
          </Typography>
        </Box>
      </Toolbar>
      <List sx={{ px: 1, py: 2 }}>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            selected={location.pathname === item.path}
            onClick={() => {
              navigate(item.path);
              if (isMobile) {
                setMobileOpen(false);
              }
            }}
            sx={{
              borderRadius: '8px',
              mb: 0.5,
              '&.Mui-selected': {
                backgroundColor: '#e3f2fd',
                color: '#1976d2',
                '&:hover': {
                  backgroundColor: '#bbdefb',
                },
                '& .MuiListItemIcon-root': {
                  color: '#1976d2',
                },
              },
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: location.pathname === item.path ? '#1976d2' : '#666666',
                minWidth: 40,
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text}
              primaryTypographyProps={{
                fontSize: '0.95rem',
                fontWeight: location.pathname === item.path ? 600 : 400,
                color: location.pathname === item.path ? '#1976d2' : '#333333',
              }}
            />
          </ListItem>
        ))}
        <ListItem
          button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          sx={{
            borderRadius: '8px',
            mt: 1,
            '&:hover': {
              backgroundColor: '#ffebee',
              '& .MuiListItemIcon-root': {
                color: '#d32f2f',
              },
              '& .MuiListItemText-primary': {
                color: '#d32f2f',
              },
            },
          }}
        >
          <ListItemIcon
            sx={{
              color: '#666666',
              minWidth: 40,
            }}
          >
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText 
            primary="로그아웃"
            primaryTypographyProps={{
              fontSize: '0.95rem',
            }}
          />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        elevation={1}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: '#ffffff',
          color: '#333333',
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2, 
              display: { md: 'none' },
              color: '#333333',
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ 
              flexGrow: 1,
              color: '#333333',
              fontWeight: 500,
            }}
          >
            {user?.name}님 환영합니다
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: '#fafafa',
              borderRight: '1px solid #e0e0e0',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: '#fafafa',
              borderRight: '1px solid #e0e0e0',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;

