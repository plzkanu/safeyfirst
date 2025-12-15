import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import { BarChart, People, List } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalActivities: 0,
    totalUsers: 0,
    todayActivities: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [activitiesRes, usersRes] = await Promise.all([
        axios.get('/admin/activities', { params: { limit: 1 } }),
        axios.get('/admin/users'),
      ]);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayActivitiesRes = await axios.get('/admin/activities', {
        params: {
          start_date: today.toISOString(),
          limit: 1,
        },
      });

      setStats({
        totalActivities: activitiesRes.data.pagination.total,
        totalUsers: usersRes.data.length,
        todayActivities: todayActivitiesRes.data.pagination.total,
      });
    } catch (error) {
      console.error('통계 조회 실패:', error);
    }
  };

  return (
    <Layout>
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom>
          관리자 대시보드
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  전체 활동 수
                </Typography>
                <Typography variant="h4">{stats.totalActivities}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  전체 사용자 수
                </Typography>
                <Typography variant="h4">{stats.totalUsers}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  오늘 활동 수
                </Typography>
                <Typography variant="h4">{stats.todayActivities}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<BarChart />}
            onClick={() => navigate('/admin/statistics')}
            sx={{ minWidth: 200 }}
          >
            통계 보기
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<People />}
            onClick={() => navigate('/admin/users')}
            sx={{ minWidth: 200 }}
          >
            사용자 관리
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<List />}
            onClick={() => navigate('/admin/activities')}
            sx={{ minWidth: 200 }}
          >
            전체 활동 보기
          </Button>
        </Box>
      </Container>
    </Layout>
  );
};

export default AdminDashboard;

