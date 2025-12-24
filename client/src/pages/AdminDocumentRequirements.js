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
  MenuItem,
} from '@mui/material';
import { Add, Edit, Delete, Download } from '@mui/icons-material';
import axios from 'axios';
import { format } from 'date-fns';
import ko from 'date-fns/locale/ko';
import Layout from '../components/Layout';

const AdminDocumentRequirements = () => {
  const [requirements, setRequirements] = useState([]);
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingRequirement, setEditingRequirement] = useState(null);
  const [formData, setFormData] = useState({
    business_office_id: '',
    title: '',
    description: '',
    deadline: '',
    is_required: '1',
    status: 'active',
  });
  const [templateFile, setTemplateFile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRequirements();
    fetchOffices();
  }, []);

  const fetchRequirements = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/documents/requirements');
      setRequirements(response.data);
    } catch (error) {
      console.error('제출 요구사항 목록 조회 실패:', error);
    } finally {
      setLoading(false);
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

  const handleOpenDialog = (requirement = null) => {
    if (requirement) {
      setEditingRequirement(requirement);
      setFormData({
        business_office_id: requirement.business_office_id.toString(),
        title: requirement.title || '',
        description: requirement.description || '',
        deadline: requirement.deadline ? format(new Date(requirement.deadline), 'yyyy-MM-dd\'T\'HH:mm') : '',
        is_required: requirement.is_required ? '1' : '0',
        status: requirement.status || 'active',
      });
      setTemplateFile(null);
    } else {
      setEditingRequirement(null);
      setFormData({
        business_office_id: '',
        title: '',
        description: '',
        deadline: '',
        is_required: '1',
        status: 'active',
      });
      setTemplateFile(null);
    }
    setError('');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setError('');
    setEditingRequirement(null);
    setTemplateFile(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setTemplateFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    setError('');
    if (!formData.business_office_id || !formData.title || !formData.deadline) {
      setError('사업소, 제목, 기한은 필수입니다.');
      return;
    }

    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });
      if (templateFile) {
        submitData.append('template', templateFile);
      }

      if (editingRequirement) {
        await axios.put(`/documents/requirements/${editingRequirement.id}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await axios.post('/documents/requirements', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      handleCloseDialog();
      fetchRequirements();
    } catch (error) {
      setError(
        error.response?.data?.error || '제출 요구사항 저장 중 오류가 발생했습니다.'
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) {
      return;
    }

    try {
      await axios.delete(`/documents/requirements/${id}`);
      fetchRequirements();
    } catch (error) {
      alert(error.response?.data?.error || '삭제 중 오류가 발생했습니다.');
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

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4">제출 요구사항 관리</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
          >
            새 요구사항
          </Button>
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
                <TableCell>상태</TableCell>
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
                requirements.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell>{req.business_office_name} ({req.business_office_code})</TableCell>
                    <TableCell>{req.title}</TableCell>
                    <TableCell>
                      {format(new Date(req.deadline), 'yyyy-MM-dd HH:mm', {
                        locale: ko,
                      })}
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
                          <Download />
                        </IconButton>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={req.status === 'active' ? '활성' : '비활성'}
                        color={req.status === 'active' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(req)}
                        color="primary"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(req.id)}
                        color="error"
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

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingRequirement ? '제출 요구사항 수정' : '새 제출 요구사항 생성'}
          </DialogTitle>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <TextField
              fullWidth
              select
              label="사업소"
              name="business_office_id"
              value={formData.business_office_id}
              onChange={handleChange}
              margin="normal"
              required
              disabled={!!editingRequirement}
            >
              {offices.map((office) => (
                <MenuItem key={office.id} value={office.id.toString()}>
                  {office.name} ({office.code})
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="제목"
              name="title"
              value={formData.title}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="설명"
              name="description"
              value={formData.description}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={3}
            />
            <TextField
              fullWidth
              label="기한"
              name="deadline"
              type="datetime-local"
              value={formData.deadline}
              onChange={handleChange}
              margin="normal"
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              fullWidth
              select
              label="필수 여부"
              name="is_required"
              value={formData.is_required}
              onChange={handleChange}
              margin="normal"
            >
              <MenuItem value="1">필수</MenuItem>
              <MenuItem value="0">선택</MenuItem>
            </TextField>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                양식 파일 {editingRequirement && editingRequirement.template_file_path && '(기존 파일이 있으면 새 파일로 교체됩니다)'}
              </Typography>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                onChange={handleFileChange}
                style={{ width: '100%' }}
              />
            </Box>
            {editingRequirement && (
              <TextField
                fullWidth
                select
                label="상태"
                name="status"
                value={formData.status}
                onChange={handleChange}
                margin="normal"
              >
                <MenuItem value="active">활성</MenuItem>
                <MenuItem value="inactive">비활성</MenuItem>
              </TextField>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>취소</Button>
            <Button onClick={handleSubmit} variant="contained">
              {editingRequirement ? '수정' : '생성'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
};

export default AdminDocumentRequirements;

