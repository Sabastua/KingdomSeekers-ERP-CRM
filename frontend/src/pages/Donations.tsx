import { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, MenuItem
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { donationService, memberService } from '../services/api';

interface Donation {
  id: number;
  amount: number;
  donationType: string;
  campaignCode: string;
  donationDate: string;
  memberId: number;
}

interface Member {
  id: number;
  firstName: string;
  lastName: string;
}

const Donations = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [open, setOpen] = useState(false);
  const [currentDonation, setCurrentDonation] = useState<Donation>({
    id: 0,
    amount: 0,
    donationType: 'TITHE',
    campaignCode: '',
    donationDate: new Date().toISOString().split('T')[0],
    memberId: 0
  });

  useEffect(() => {
    fetchDonations();
    fetchMembers();
  }, []);

  const fetchDonations = async () => {
    try {
      const response = await donationService.getAll();
      setDonations(response.data);
    } catch (error) {
      console.error('Error fetching donations:', error);
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await memberService.getAll();
      setMembers(response.data);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const handleOpen = () => {
    setCurrentDonation({
      id: 0,
      amount: 0,
      donationType: 'TITHE',
      campaignCode: '',
      donationDate: new Date().toISOString().split('T')[0],
      memberId: 0
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentDonation({
      ...currentDonation,
      [name]: name === 'amount' ? parseFloat(value) : value
    });
  };

  const handleSubmit = async () => {
    try {
      await donationService.create(currentDonation);
      fetchDonations();
      handleClose();
    } catch (error) {
      console.error('Error saving donation:', error);
    }
  };

  const getMemberName = (memberId: number) => {
    const member = members.find(m => m.id === memberId);
    return member ? `${member.firstName} ${member.lastName}` : 'Unknown';
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
              Donations Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Track and manage all church donations and offerings
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpen}
            size="large"
          >
            Add Donation
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
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Member</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Campaign</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {donations.map((donation) => (
              <TableRow
                key={donation.id}
                sx={{
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                  transition: 'background-color 0.2s',
                }}
              >
                <TableCell sx={{ fontWeight: 500 }}>{getMemberName(donation.memberId)}</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'success.main' }}>${donation.amount.toFixed(2)}</TableCell>
                <TableCell sx={{ color: 'text.secondary' }}>{donation.donationType}</TableCell>
                <TableCell sx={{ color: 'text.secondary' }}>{donation.campaignCode || 'N/A'}</TableCell>
                <TableCell sx={{ color: 'text.secondary' }}>{new Date(donation.donationDate).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Donation</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              select
              margin="normal"
              required
              fullWidth
              label="Member"
              name="memberId"
              value={currentDonation.memberId}
              onChange={handleChange}
            >
              {members.map((member) => (
                <MenuItem key={member.id} value={member.id}>
                  {`${member.firstName} ${member.lastName}`}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Amount"
              name="amount"
              type="number"
              value={currentDonation.amount}
              onChange={handleChange}
              InputProps={{
                startAdornment: '$'
              }}
            />
            <TextField
              select
              margin="normal"
              required
              fullWidth
              label="Donation Type"
              name="donationType"
              value={currentDonation.donationType}
              onChange={handleChange}
            >
              <MenuItem value="TITHE">Tithe</MenuItem>
              <MenuItem value="OFFERING">Offering</MenuItem>
              <MenuItem value="SPECIAL">Special</MenuItem>
              <MenuItem value="CAMPAIGN">Campaign</MenuItem>
            </TextField>
            {currentDonation.donationType === 'CAMPAIGN' && (
              <TextField
                margin="normal"
                required
                fullWidth
                label="Campaign Code"
                name="campaignCode"
                value={currentDonation.campaignCode}
                onChange={handleChange}
              />
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              label="Donation Date"
              name="donationDate"
              type="date"
              value={currentDonation.donationDate}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Donations;