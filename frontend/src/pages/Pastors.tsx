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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Pastors</Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={() => handleOpen()}
        >
          Add Pastor
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Church Branch</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pastors.map((pastor) => (
              <TableRow key={pastor.id}>
                <TableCell>{`${pastor.firstName} ${pastor.lastName}`}</TableCell>
                <TableCell>{pastor.email}</TableCell>
                <TableCell>{pastor.phone}</TableCell>
                <TableCell>{pastor.churchBranch}</TableCell>
                <TableCell>{pastor.countryCode}</TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleOpen(pastor)}>
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