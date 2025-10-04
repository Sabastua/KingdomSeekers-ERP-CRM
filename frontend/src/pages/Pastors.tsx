import { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, IconButton
} from '@mui/material';
import { Add, Edit } from '@mui/icons-material';
import { pastorService } from '../services/api';

interface Pastor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  churchBranch: string;
  countryCode: string;
}

const Pastors = () => {
  const [pastors, setPastors] = useState<Pastor[]>([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPastor, setCurrentPastor] = useState<Pastor>({
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    churchBranch: '',
    countryCode: ''
  });

  useEffect(() => {
    fetchPastors();
  }, []);

  const fetchPastors = async () => {
    try {
      const response = await pastorService.getAll();
      setPastors(response.data);
    } catch (error) {
      console.error('Error fetching pastors:', error);
    }
  };

  const handleOpen = (pastor?: Pastor) => {
    if (pastor) {
      setCurrentPastor(pastor);
      setEditMode(true);
    } else {
      setCurrentPastor({
        id: 0,
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        churchBranch: '',
        countryCode: ''
      });
      setEditMode(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentPastor({
      ...currentPastor,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    try {
      if (editMode) {
        // Update pastor - assuming there's an update endpoint
        await pastorService.create(currentPastor);
      } else {
        await pastorService.create(currentPastor);
      }
      fetchPastors();
      handleClose();
    } catch (error) {
      console.error('Error saving pastor:', error);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
              Pastors Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage pastors and church branch information
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpen()}
            size="large"
          >
            Add Pastor
          </Button>
        </Box>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Phone</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Church Branch</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Country</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pastors.map((pastor) => (
              <TableRow
                key={pastor.id}
                sx={{
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                  transition: 'background-color 0.2s',
                }}
              >
                <TableCell sx={{ fontWeight: 500 }}>{`${pastor.firstName} ${pastor.lastName}`}</TableCell>
                <TableCell sx={{ color: 'text.secondary' }}>{pastor.email}</TableCell>
                <TableCell sx={{ color: 'text.secondary' }}>{pastor.phone}</TableCell>
                <TableCell sx={{ color: 'text.secondary' }}>{pastor.churchBranch}</TableCell>
                <TableCell sx={{ color: 'text.secondary' }}>{pastor.countryCode}</TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleOpen(pastor)}
                    sx={{
                      color: 'primary.main',
                      '&:hover': {
                        bgcolor: 'primary.lighter',
                      },
                    }}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Edit Pastor' : 'Add New Pastor'}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="First Name"
              name="firstName"
              value={currentPastor.firstName}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Last Name"
              name="lastName"
              value={currentPastor.lastName}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={currentPastor.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Phone"
              name="phone"
              value={currentPastor.phone}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Church Branch"
              name="churchBranch"
              value={currentPastor.churchBranch}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Country Code"
              name="countryCode"
              value={currentPastor.countryCode}
              onChange={handleChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editMode ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Pastors;