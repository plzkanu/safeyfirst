import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
} from '@mui/material';
import { AddCircle, List } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import Layout from '../components/Layout';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    thisWeek: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);

      const response = await axios.get('/activities/my', {
        params: {
          start_date: weekAgo.toISOString(),
        },
      });

      const activities = response.data.activities || [];
      const todayActivities = activities.filter(
        (a) => new Date(a.date_time).toDateString() === today.toDateString()
      );

      setStats({
        total: response.data.pagination.total,
        today: todayActivities.length,
        thisWeek: activities.length,
      });
    } catch (error) {
      console.error('통계 조회 실패:', error);
    }
  };

  return (
    <Layout>
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom>
          대시보드
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  전체 활동
                </Typography>
                <Typography variant="h4">{stats.total}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  오늘 활동
                </Typography>
                <Typography variant="h4">{stats.today}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  이번 주 활동
                </Typography>
                <Typography variant="h4">{stats.thisWeek}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddCircle />}
            onClick={() => navigate('/activity/new')}
            sx={{ minWidth: 200 }}
          >
            활동 기록하기
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<List />}
            onClick={() => navigate('/activities')}
            sx={{ minWidth: 200 }}
          >
            활동 목록 보기
          </Button>
        </Box>
      </Container>
    </Layout>
  );
};

export default Dashboard;

