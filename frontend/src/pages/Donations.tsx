import { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, MenuItem, IconButton
} from '@mui/material';
import { Add, Edit } from '@mui/icons-material';
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Donations</Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={handleOpen}
        >
          Add Donation
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Member</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Campaign</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {donations.map((donation) => (
              <TableRow key={donation.id}>
                <TableCell>{getMemberName(donation.memberId)}</TableCell>
                <TableCell>${donation.amount.toFixed(2)}</TableCell>
                <TableCell>{donation.donationType}</TableCell>
                <TableCell>{donation.campaignCode || 'N/A'}</TableCell>
                <TableCell>{new Date(donation.donationDate).toLocaleDateString()}</TableCell>
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