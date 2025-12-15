import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../components/Logo';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
        },
      }}
    >
      {/* 헤더 영역 */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          pt: 4,
          pb: 2,
          px: 3,
        }}
      >
        <Box
          sx={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              px: 3,
              py: 2,
              mb: 2,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              width: '100%',
              maxWidth: '400px',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Logo />
              <Typography
                variant="h6"
                component="div"
                sx={{
                  color: '#333333',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  textAlign: 'center',
                  mt: 1,
                  whiteSpace: 'nowrap',
                }}
              >
                안전 관리 시스템
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* 로그인 폼 영역 */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1,
          px: 2,
          pb: 4,
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={24}
            sx={{
              padding: { xs: 3, sm: 4 },
              width: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(10px)',
              borderRadius: '24px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            }}
          >
            <Typography
              component="h1"
              variant="h4"
              align="center"
              gutterBottom
              sx={{
                fontWeight: 700,
                color: '#333333',
                mb: 1,
              }}
            >
              로그인
            </Typography>
            <Typography
              variant="body2"
              align="center"
              sx={{
                color: '#666666',
                mb: 4,
              }}
            >
              시스템에 접속하려면 로그인하세요
            </Typography>

            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: '12px',
                }}
              >
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="사용자명"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: '#fafafa',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    },
                    '&.Mui-focused': {
                      backgroundColor: '#ffffff',
                    },
                  },
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="비밀번호"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: '#fafafa',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    },
                    '&.Mui-focused': {
                      backgroundColor: '#ffffff',
                    },
                  },
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 4,
                  mb: 2,
                  py: 1.5,
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5568d3 0%, #6a3d8f 100%)',
                    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)',
                  },
                  '&:disabled': {
                    background: '#cccccc',
                  },
                }}
              >
                {loading ? '로그인 중...' : '로그인'}
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default Login;

