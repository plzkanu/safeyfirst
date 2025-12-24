import React, { useState, useEffect } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  LinearProgress,
} from '@mui/material';
import { Upload, Download, Description } from '@mui/icons-material';
import axios from 'axios';
import { format } from 'date-fns';
import ko from 'date-fns/locale/ko';
import Layout from '../components/Layout';

const DocumentSubmission = () => {
  const [requirements, setRequirements] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOffice, setSelectedOffice] = useState('');
  const [submitDialog, setSubmitDialog] = useState({ open: false, requirement: null });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRequirements();
    fetchSubmissions();
    fetchOffices();
  }, [selectedOffice]);

  const fetchRequirements = async () => {
    setLoading(true);
    try {
      const params = selectedOffice ? { business_office_id: selectedOffice } : {};
      const response = await axios.get('/documents/requirements', { params });
      setRequirements(response.data.filter(r => r.status === 'active'));
    } catch (error) {
      console.error('제출 요구사항 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const response = await axios.get('/documents/submissions');
      setSubmissions(response.data);
    } catch (error) {
      console.error('제출 서류 조회 실패:', error);
    }
  };

  const fetchOffices = async () => {
    try {
      const response = await axios.get('/documents/business-offices');
      setOffices(response.data.filter(o => o.status === 'active'));
    } catch (error) {
      console.error('사업소 목록 조회 실패:', error);
    }
  };

  const handleOpenSubmit = (requirement) => {
    setSubmitDialog({ open: true, requirement });
    setSelectedFile(null);
    setError('');
  };

  const handleCloseSubmit = () => {
    setSubmitDialog({ open: false, requirement: null });
    setSelectedFile(null);
    setError('');
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    setError('');
    if (!selectedFile) {
      setError('파일을 선택하세요.');
      return;
    }

    const requirement = submitDialog.requirement;
    if (!requirement) {
      setError('요구사항 정보가 없습니다.');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('requirement_id', requirement.id);
      formData.append('business_office_id', requirement.business_office_id);
      formData.append('file', selectedFile);

      await axios.post('/documents/submissions', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      handleCloseSubmit();
      fetchSubmissions();
      fetchRequirements();
    } catch (error) {
      setError(error.response?.data?.error || '제출 중 오류가 발생했습니다.');
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadTemplate = async (id) => {
    try {
      const response = await axios.get(`/documents/requirements/${id}/template`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', response.headers['content-disposition']?.split('filename=')[1] || 'template');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert('템플릿 다운로드 중 오류가 발생했습니다.');
    }
  };

  const handleDownloadSubmission = async (id) => {
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

  const getSubmissionStatus = (requirementId) => {
    const submission = submissions.find(s => s.requirement_id === requirementId);
    return submission;
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

  const isDeadlinePassed = (deadline) => {
    return new Date(deadline) < new Date();
  };

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4">제출 서류</Typography>
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

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>사업소</TableCell>
                <TableCell>제목</TableCell>
                <TableCell>기한</TableCell>
                <TableCell>필수</TableCell>
                <TableCell>양식</TableCell>
                <TableCell>제출 상태</TableCell>
                <TableCell>작업</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requirements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    {loading ? '로딩 중...' : '제출 요구사항이 없습니다.'}
                  </TableCell>
                </TableRow>
              ) : (
                requirements.map((req) => {
                  const submission = getSubmissionStatus(req.id);
                  const deadlinePassed = isDeadlinePassed(req.deadline);
                  
                  return (
                    <TableRow key={req.id}>
                      <TableCell>
                        {req.business_office_name} ({req.business_office_code})
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">{req.title}</Typography>
                          {req.description && (
                            <Typography variant="caption" color="text.secondary">
                              {req.description}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          color={deadlinePassed ? 'error' : 'text.primary'}
                        >
                          {format(new Date(req.deadline), 'yyyy-MM-dd HH:mm', {
                            locale: ko,
                          })}
                        </Typography>
                        {deadlinePassed && (
                          <Chip label="기한 경과" color="error" size="small" sx={{ mt: 0.5 }} />
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={req.is_required ? '필수' : '선택'}
                          color={req.is_required ? 'error' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {req.template_file_path ? (
                          <IconButton
                            size="small"
                            onClick={() => handleDownloadTemplate(req.id)}
                            color="primary"
                          >
                            <Description />
                          </IconButton>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        {submission ? (
                          <Box>
                            <Chip
                              label={getStatusLabel(submission.status)}
                              color={getStatusColor(submission.status)}
                              size="small"
                            />
                            {submission.review_comment && (
                              <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                                {submission.review_comment}
                              </Typography>
                            )}
                          </Box>
                        ) : (
                          <Chip label="미제출" color="default" size="small" />
                        )}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenSubmit(req)}
                          color="primary"
                          disabled={uploading}
                        >
                          <Upload />
                        </IconButton>
                        {submission && (
                          <IconButton
                            size="small"
                            onClick={() => handleDownloadSubmission(submission.id)}
                            color="primary"
                          >
                            <Download />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={submitDialog.open} onClose={handleCloseSubmit} maxWidth="sm" fullWidth>
          <DialogTitle>제출 서류 업로드</DialogTitle>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {submitDialog.requirement && (
              <>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>사업소:</strong> {submitDialog.requirement.business_office_name}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>요구사항:</strong> {submitDialog.requirement.title}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  <strong>기한:</strong>{' '}
                  {format(new Date(submitDialog.requirement.deadline), 'yyyy-MM-dd HH:mm', {
                    locale: ko,
                  })}
                </Typography>
              </>
            )}
            {uploading && <LinearProgress sx={{ mb: 2 }} />}
            <input
              type="file"
              onChange={handleFileChange}
              style={{ width: '100%', marginTop: '16px' }}
              disabled={uploading}
            />
            {selectedFile && (
              <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                선택된 파일: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseSubmit} disabled={uploading}>
              취소
            </Button>
            <Button onClick={handleSubmit} variant="contained" disabled={uploading || !selectedFile}>
              제출
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
};

export default DocumentSubmission;

