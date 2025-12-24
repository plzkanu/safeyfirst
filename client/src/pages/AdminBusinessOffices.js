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
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import { format } from 'date-fns';
import Layout from '../components/Layout';

const AdminBusinessOffices = () => {
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingOffice, setEditingOffice] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    address: '',
    contact_person: '',
    contact_phone: '',
    contact_email: '',
    description: '',
    status: 'active',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOffices();
  }, []);

  const fetchOffices = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/documents/business-offices');
      setOffices(response.data);
    } catch (error) {
      console.error('사업소 목록 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (office = null) => {
    if (office) {
      setEditingOffice(office);
      setFormData({
        name: office.name || '',
        code: office.code || '',
        address: office.address || '',
        contact_person: office.contact_person || '',
        contact_phone: office.contact_phone || '',
        contact_email: office.contact_email || '',
        description: office.description || '',
        status: office.status || 'active',
      });
    } else {
      setEditingOffice(null);
      setFormData({
        name: '',
        code: '',
        address: '',
        contact_person: '',
        contact_phone: '',
        contact_email: '',
        description: '',
        status: 'active',
      });
    }
    setError('');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setError('');
    setEditingOffice(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    setError('');
    if (!formData.name || !formData.code) {
      setError('사업소명과 코드는 필수입니다.');
      return;
    }

    try {
      if (editingOffice) {
        await axios.put(`/documents/business-offices/${editingOffice.id}`, formData);
      } else {
        await axios.post('/documents/business-offices', formData);
      }
      handleCloseDialog();
      fetchOffices();
    } catch (error) {
      setError(
        error.response?.data?.error || '사업소 저장 중 오류가 발생했습니다.'
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) {
      return;
    }

    try {
      await axios.delete(`/documents/business-offices/${id}`);
      fetchOffices();
    } catch (error) {
      alert(error.response?.data?.error || '삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4">사업소 관리</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
          >
            새 사업소
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>코드</TableCell>
                <TableCell>사업소명</TableCell>
                <TableCell>주소</TableCell>
                <TableCell>담당자</TableCell>
                <TableCell>연락처</TableCell>
                <TableCell>상태</TableCell>
                <TableCell>작업</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {offices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    {loading ? '로딩 중...' : '사업소가 없습니다.'}
                  </TableCell>
                </TableRow>
              ) : (
                offices.map((office) => (
                  <TableRow key={office.id}>
                    <TableCell>{office.code}</TableCell>
                    <TableCell>{office.name}</TableCell>
                    <TableCell>{office.address || '-'}</TableCell>
                    <TableCell>{office.contact_person || '-'}</TableCell>
                    <TableCell>{office.contact_phone || '-'}</TableCell>
                    <TableCell>
                      <Chip
                        label={office.status === 'active' ? '활성' : '비활성'}
                        color={office.status === 'active' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(office)}
                        color="primary"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(office.id)}
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
            {editingOffice ? '사업소 수정' : '새 사업소 생성'}
          </DialogTitle>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <TextField
              fullWidth
              label="사업소명"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="사업소 코드"
              name="code"
              value={formData.code}
              onChange={handleChange}
              margin="normal"
              required
              disabled={!!editingOffice}
            />
            <TextField
              fullWidth
              label="주소"
              name="address"
              value={formData.address}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="담당자"
              name="contact_person"
              value={formData.contact_person}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="연락처"
              name="contact_phone"
              value={formData.contact_phone}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="이메일"
              name="contact_email"
              type="email"
              value={formData.contact_email}
              onChange={handleChange}
              margin="normal"
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
            {editingOffice && (
              <TextField
                fullWidth
                select
                label="상태"
                name="status"
                value={formData.status}
                onChange={handleChange}
                margin="normal"
                SelectProps={{
                  native: true,
                }}
              >
                <option value="active">활성</option>
                <option value="inactive">비활성</option>
              </TextField>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>취소</Button>
            <Button onClick={handleSubmit} variant="contained">
              {editingOffice ? '수정' : '생성'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
};

export default AdminBusinessOffices;

