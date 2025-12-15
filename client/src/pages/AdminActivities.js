import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  MenuItem,
  Pagination,
} from '@mui/material';
import axios from 'axios';
import { format } from 'date-fns';
import ko from 'date-fns/locale/ko';
import Layout from '../components/Layout';

const ACTIVITY_TYPES = [
  '안전 점검',
  '설비 점검',
  '교육 실시',
  '사고 보고',
  '개선 사항',
  '기타',
];

const AdminActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    activity_type: '',
    user_id: '',
    page: 1,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [filters]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('사용자 목록 조회 실패:', error);
    }
  };

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/admin/activities', {
        params: {
          page: filters.page,
          limit: 20,
          activity_type: filters.activity_type || undefined,
          user_id: filters.user_id || undefined,
        },
      });
      setActivities(response.data.activities || []);
      setPagination(response.data.pagination || {});
    } catch (error) {
      console.error('활동 목록 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'warning';
      case 'pending':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed':
        return '완료';
      case 'in_progress':
        return '진행 중';
      case 'pending':
        return '대기';
      default:
        return status;
    }
  };

  return (
    <Layout>
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom>
          전체 활동 목록
        </Typography>

        <Paper sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              select
              label="활동 유형"
              value={filters.activity_type}
              onChange={(e) =>
                setFilters({ ...filters, activity_type: e.target.value, page: 1 })
              }
              sx={{ minWidth: 200 }}
              size="small"
            >
              <MenuItem value="">전체</MenuItem>
              {ACTIVITY_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="사용자"
              value={filters.user_id}
              onChange={(e) =>
                setFilters({ ...filters, user_id: e.target.value, page: 1 })
              }
              sx={{ minWidth: 200 }}
              size="small"
            >
              <MenuItem value="">전체</MenuItem>
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name} ({user.username})
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Paper>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>날짜/시간</TableCell>
                <TableCell>사용자</TableCell>
                <TableCell>활동 유형</TableCell>
                <TableCell>위치</TableCell>
                <TableCell>설명</TableCell>
                <TableCell>상태</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {activities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    {loading ? '로딩 중...' : '기록된 활동이 없습니다.'}
                  </TableCell>
                </TableRow>
              ) : (
                activities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>
                      {format(
                        new Date(activity.date_time),
                        'yyyy-MM-dd HH:mm',
                        { locale: ko }
                      )}
                    </TableCell>
                    <TableCell>
                      {activity.user_name} ({activity.username})
                    </TableCell>
                    <TableCell>{activity.activity_type}</TableCell>
                    <TableCell>{activity.location || '-'}</TableCell>
                    <TableCell
                      sx={{
                        maxWidth: 300,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {activity.description}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(activity.status)}
                        color={getStatusColor(activity.status)}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {pagination.totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={pagination.totalPages}
              page={pagination.page}
              onChange={(e, page) => setFilters({ ...filters, page })}
            />
          </Box>
        )}
      </Container>
    </Layout>
  );
};

export default AdminActivities;

