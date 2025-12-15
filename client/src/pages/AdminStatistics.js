import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import axios from 'axios';
import Layout from '../components/Layout';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const AdminStatistics = () => {
  const [statistics, setStatistics] = useState({
    byType: [],
    daily: [],
    byUser: [],
    byStatus: [],
  });
  const [dateRange, setDateRange] = useState({
    start_date: '',
    end_date: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/admin/statistics', {
        params: dateRange.start_date || dateRange.end_date ? dateRange : {},
      });
      setStatistics(response.data);
    } catch (error) {
      console.error('통계 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (field, value) => {
    setDateRange({
      ...dateRange,
      [field]: value,
    });
  };

  const handleFilter = () => {
    fetchStatistics();
  };

  const handleReset = () => {
    setDateRange({ start_date: '', end_date: '' });
    setTimeout(() => {
      fetchStatistics();
    }, 100);
  };

  return (
    <Layout>
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom>
          통계 분석
        </Typography>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              label="시작 날짜"
              type="date"
              value={dateRange.start_date}
              onChange={(e) => handleDateChange('start_date', e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
            <TextField
              label="종료 날짜"
              type="date"
              value={dateRange.end_date}
              onChange={(e) => handleDateChange('end_date', e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
            <Button variant="contained" onClick={handleFilter}>
              필터 적용
            </Button>
            <Button variant="outlined" onClick={handleReset}>
              초기화
            </Button>
          </Box>
        </Paper>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                활동 유형별 통계
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statistics.byType}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="activity_type" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#1976d2" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                상태별 통계
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statistics.byStatus}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {statistics.byStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                일별 활동 추이 (최근 30일)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={statistics.daily}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#1976d2" />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                사용자별 활동 통계
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statistics.byUser}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default AdminStatistics;

