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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  IconButton,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Download, Visibility } from '@mui/icons-material';
import axios from 'axios';
import { format } from 'date-fns';
import ko from 'date-fns/locale/ko';
import Layout from '../components/Layout';

const AdminDocumentSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [offices, setOffices] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedOffice, setSelectedOffice] = useState('');
  const [reviewDialog, setReviewDialog] = useState({ open: false, submission: null });
  const [reviewData, setReviewData] = useState({ status: 'approved', review_comment: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSubmissions();
    fetchOffices();
    fetchStatistics();
  }, [selectedOffice]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const params = selectedOffice ? { business_office_id: selectedOffice } : {};
      const response = await axios.get('/documents/submissions', { params });
      setSubmissions(response.data);
    } catch (error) {
      console.error('제출 서류 목록 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOffices = async () => {
    try {
      const response = await axios.get('/documents/business-offices');
      setOffices(response.data);
    } catch (error) {
      console.error('사업소 목록 조회 실패:', error);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await axios.get('/documents/statistics');
      setStatistics(response.data);
    } catch (error) {
      console.error('통계 조회 실패:', error);
    }
  };

  const handleDownload = async (id) => {
    try {
      const response = await axios.get(`/documents/submissions/${id}/download`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', response.headers['content-disposition']?.split('filename=')[1] || 'file');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert('파일 다운로드 중 오류가 발생했습니다.');
    }
  };

  const handleOpenReview = (submission) => {
    setReviewDialog({ open: true, submission });
    setReviewData({
      status: submission.status || 'approved',
      review_comment: submission.review_comment || '',
    });
    setError('');
  };

  const handleCloseReview = () => {
    setReviewDialog({ open: false, submission: null });
    setReviewData({ status: 'approved', review_comment: '' });
    setError('');
  };

  const handleReviewSubmit = async () => {
    setError('');
    try {
      await axios.put(
        `/documents/submissions/${reviewDialog.submission.id}/review`,
        reviewData
      );
      handleCloseReview();
      fetchSubmissions();
      fetchStatistics();
    } catch (error) {
      setError(error.response?.data?.error || '검토 중 오류가 발생했습니다.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'submitted':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'approved':
        return '승인';
      case 'rejected':
        return '반려';
      case 'submitted':
        return '제출됨';
      default:
        return status;
    }
  };

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4">제출 서류 현황</Typography>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>사업소 필터</InputLabel>
            <Select
              value={selectedOffice}
              onChange={(e) => setSelectedOffice(e.target.value)}
              label="사업소 필터"
            >
              <MenuItem value="">전체</MenuItem>
              {offices.map((office) => (
                <MenuItem key={office.id} value={office.id.toString()}>
                  {office.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {statistics && (
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Paper sx={{ p: 2, flex: 1 }}>
              <Typography variant="h6">전체 요구사항</Typography>
              <Typography variant="h4">{statistics.stats.total_requirements}</Typography>
            </Paper>
            <Paper sx={{ p: 2, flex: 1 }}>
              <Typography variant="h6">전체 제출</Typography>
              <Typography variant="h4">{statistics.stats.total_submissions}</Typography>
            </Paper>
            <Paper sx={{ p: 2, flex: 1 }}>
              <Typography variant="h6">승인</Typography>
              <Typography variant="h4" color="success.main">
                {statistics.stats.approved_submissions}
              </Typography>
            </Paper>
            <Paper sx={{ p: 2, flex: 1 }}>
              <Typography variant="h6">대기</Typography>
              <Typography variant="h4" color="warning.main">
                {statistics.stats.pending_submissions}
              </Typography>
            </Paper>
          </Box>
        )}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>사업소</TableCell>
                <TableCell>요구사항</TableCell>
                <TableCell>제출자</TableCell>
                <TableCell>파일명</TableCell>
                <TableCell>제출일</TableCell>
                <TableCell>상태</TableCell>
                <TableCell>작업</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {submissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    {loading ? '로딩 중...' : '제출 서류가 없습니다.'}
                  </TableCell>
                </TableRow>
              ) : (
                submissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell>
                      {submission.business_office_name} ({submission.business_office_code})
                    </TableCell>
                    <TableCell>{submission.requirement_title}</TableCell>
                    <TableCell>{submission.user_name}</TableCell>
                    <TableCell>{submission.file_name}</TableCell>
                    <TableCell>
                      {format(new Date(submission.submitted_at), 'yyyy-MM-dd HH:mm', {
                        locale: ko,
                      })}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(submission.status)}
                        color={getStatusColor(submission.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleDownload(submission.id)}
                        color="primary"
                      >
                        <Download />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenReview(submission)}
                        color="primary"
                      >
                        <Visibility />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={reviewDialog.open} onClose={handleCloseReview} maxWidth="sm" fullWidth>
          <DialogTitle>제출 서류 검토</DialogTitle>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {reviewDialog.submission && (
              <>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>사업소:</strong> {reviewDialog.submission.business_office_name}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>요구사항:</strong> {reviewDialog.submission.requirement_title}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>제출자:</strong> {reviewDialog.submission.user_name}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  <strong>파일명:</strong> {reviewDialog.submission.file_name}
                </Typography>
              </>
            )}
            <TextField
              fullWidth
              select
              label="상태"
              name="status"
              value={reviewData.status}
              onChange={(e) => setReviewData({ ...reviewData, status: e.target.value })}
              margin="normal"
            >
              <MenuItem value="approved">승인</MenuItem>
              <MenuItem value="rejected">반려</MenuItem>
              <MenuItem value="pending">대기</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="검토 의견"
              name="review_comment"
              value={reviewData.review_comment}
              onChange={(e) => setReviewData({ ...reviewData, review_comment: e.target.value })}
              margin="normal"
              multiline
              rows={4}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseReview}>취소</Button>
            <Button onClick={handleReviewSubmit} variant="contained">
              저장
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
};

export default AdminDocumentSubmissions;

