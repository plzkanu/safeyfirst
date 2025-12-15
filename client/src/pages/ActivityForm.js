import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  Alert,
} from '@mui/material';
import axios from 'axios';
import Layout from '../components/Layout';

const ACTIVITY_TYPES = [
  '안전 점검',
  '설비 점검',
  '교육 실시',
  '사고 보고',
  '개선 사항',
  '기타',
];

const ActivityForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    activity_type: '',
    location: '',
    description: '',
    status: 'completed',
    date_time: new Date().toISOString().slice(0, 16),
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchActivity();
    }
  }, [id]);

  const fetchActivity = async () => {
    try {
      const response = await axios.get(`/activities/${id}`);
      const activity = response.data;
      setFormData({
        activity_type: activity.activity_type || '',
        location: activity.location || '',
        description: activity.description || '',
        status: activity.status || 'completed',
        date_time: activity.date_time
          ? new Date(activity.date_time).toISOString().slice(0, 16)
          : new Date().toISOString().slice(0, 16),
      });
    } catch (error) {
      console.error('활동 조회 실패:', error);
      setError('활동 정보를 불러오는데 실패했습니다.');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        date_time: new Date(formData.date_time).toISOString(),
      };

      if (isEdit) {
        await axios.put(`/activities/${id}`, submitData);
      } else {
        await axios.post('/activities', submitData);
      }

      navigate('/activities');
    } catch (error) {
      setError(
        error.response?.data?.error || '저장 중 오류가 발생했습니다.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            {isEdit ? '활동 수정' : '새 활동 기록'}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              select
              fullWidth
              label="활동 유형"
              name="activity_type"
              value={formData.activity_type}
              onChange={handleChange}
              required
              margin="normal"
              disabled={loading}
            >
              {ACTIVITY_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="위치"
              name="location"
              value={formData.location}
              onChange={handleChange}
              margin="normal"
              disabled={loading}
            />

            <TextField
              fullWidth
              label="설명"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              multiline
              rows={4}
              margin="normal"
              disabled={loading}
            />

            <TextField
              select
              fullWidth
              label="상태"
              name="status"
              value={formData.status}
              onChange={handleChange}
              margin="normal"
              disabled={loading}
            >
              <MenuItem value="completed">완료</MenuItem>
              <MenuItem value="pending">대기</MenuItem>
              <MenuItem value="in_progress">진행 중</MenuItem>
            </TextField>

            <TextField
              fullWidth
              label="날짜 및 시간"
              name="date_time"
              type="datetime-local"
              value={formData.date_time}
              onChange={handleChange}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              disabled={loading}
            />

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                fullWidth
              >
                {loading ? '저장 중...' : '저장'}
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/activities')}
                disabled={loading}
                fullWidth
              >
                취소
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Layout>
  );
};

export default ActivityForm;

