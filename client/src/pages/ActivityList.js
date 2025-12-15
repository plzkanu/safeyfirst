import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  TextField,
  MenuItem,
  Pagination,
} from '@mui/material';
import { Edit, Delete, AddCircle } from '@mui/icons-material';
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

const ActivityList = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    activity_type: '',
    page: 1,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  useEffect(() => {
    fetchActivities();
  }, [filters]);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/activities/my', {
        params: {
          page: filters.page,
          limit: 10,
          activity_type: filters.activity_type || undefined,
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

  const handleDelete = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) {
      return;
    }

    try {
      await axios.delete(`/activities/${id}`);
      fetchActivities();
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제 중 오류가 발생했습니다.');
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4">활동 목록</Typography>
          <Button
            variant="contained"
            startIcon={<AddCircle />}
            onClick={() => navigate('/activity/new')}
          >
            새 활동
          </Button>
        </Box>

        <Paper sx={{ p: 2, mb: 2 }}>
          <TextField
            select
            label="활동 유형 필터"
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
        </Paper>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>날짜/시간</TableCell>
                <TableCell>활동 유형</TableCell>
                <TableCell>위치</TableCell>
                <TableCell>설명</TableCell>
                <TableCell>상태</TableCell>
                <TableCell align="right">작업</TableCell>
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
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/activity/edit/${activity.id}`)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(activity.id)}
                      >
                        <Delete />
                      </IconButton>
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

export default ActivityList;

