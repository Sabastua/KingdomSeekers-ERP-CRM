import { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, MenuItem, IconButton,
  Chip
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { memberService, pastorService } from '../services/api';

interface Member {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  vettingStatus: string;
  pastorId: number | null;
}

interface Pastor {
  id: number;
  firstName: string;
  lastName: string;
}

const Members = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [pastors, setPastors] = useState<Pastor[]>([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentMember, setCurrentMember] = useState<Member>({
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    vettingStatus: 'PENDING',
    pastorId: null
  });

  useEffect(() => {
    fetchMembers();
    fetchPastors();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await memberService.getAll();
      setMembers(response.data);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const fetchPastors = async () => {
    try {
      const response = await pastorService.getAll();
      setPastors(response.data);
    } catch (error) {
      console.error('Error fetching pastors:', error);
    }
  };

  const handleOpen = (member?: Member) => {
    if (member) {
      setCurrentMember(member);
      setEditMode(true);
    } else {
      setCurrentMember({
        id: 0,
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        vettingStatus: 'PENDING',
        pastorId: null
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
    setCurrentMember({
      ...currentMember,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    try {
      if (editMode) {
        await memberService.update(currentMember.id, currentMember);
      } else {
        await memberService.create(currentMember);
      }
      fetchMembers();
      handleClose();
    } catch (error) {
      console.error('Error saving member:', error);
    }
  };

  const handleVettingChange = async (id: number, status: string) => {
    try {
      await memberService.updateVettingStatus(id, status);
      fetchMembers();
    } catch (error) {
      console.error('Error updating vetting status:', error);
    }
  };

  const handleAssignPastor = async (memberId: number, pastorId: number) => {
    try {
      await memberService.assignPastor(memberId, pastorId);
      fetchMembers();
    } catch (error) {
      console.error('Error assigning pastor:', error);
    }
  };

  const getVettingStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'success';
      case 'REJECTED': return 'error';
      case 'PENDING': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Members</Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={() => handleOpen()}
        >
          Add Member
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Vetting Status</TableCell>
              <TableCell>Assigned Pastor</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>{`${member.firstName} ${member.lastName}`}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.phone}</TableCell>
                <TableCell>
                  <Chip 
                    label={member.vettingStatus} 
                    color={getVettingStatusColor(member.vettingStatus) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {member.pastorId ? 
                    pastors.find(p => p.id === member.pastorId)?.firstName + ' ' + 
                    pastors.find(p => p.id === member.pastorId)?.lastName : 
                    'Not Assigned'}
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleOpen(member)}>
                    <Edit fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Edit Member' : 'Add New Member'}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="First Name"
              name="firstName"
              value={currentMember.firstName}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Last Name"
              name="lastName"
              value={currentMember.lastName}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={currentMember.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Phone"
              name="phone"
              value={currentMember.phone}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Address"
              name="address"
              value={currentMember.address}
              onChange={handleChange}
            />
            {editMode && (
              <>
                <TextField
                  select
                  margin="normal"
                  fullWidth
                  label="Vetting Status"
                  name="vettingStatus"
                  value={currentMember.vettingStatus}
                  onChange={handleChange}
                >
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="APPROVED">Approved</MenuItem>
                  <MenuItem value="REJECTED">Rejected</MenuItem>
                </TextField>
                <TextField
                  select
                  margin="normal"
                  fullWidth
                  label="Assigned Pastor"
                  name="pastorId"
                  value={currentMember.pastorId || ''}
                  onChange={handleChange}
                >
                  <MenuItem value="">None</MenuItem>
                  {pastors.map((pastor) => (
                    <MenuItem key={pastor.id} value={pastor.id}>
                      {`${pastor.firstName} ${pastor.lastName}`}
                    </MenuItem>
                  ))}
                </TextField>
              </>
            )}
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

export default Members;