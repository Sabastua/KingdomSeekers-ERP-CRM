import { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { memberService, pastorService, donationService } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalPastors: 0,
    totalDonations: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [membersRes, pastorsRes, donationsRes] = await Promise.all([
          memberService.getAll(),
          pastorService.getAll(),
          donationService.getAll()
        ]);
        
        setStats({
          totalMembers: membersRes.data.length,
          totalPastors: pastorsRes.data.length,
          totalDonations: donationsRes.data.length
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'primary.light',
              color: 'white'
            }}
          >
            <Typography variant="h6" gutterBottom>Total Members</Typography>
            <Typography variant="h3">{stats.totalMembers}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'secondary.light',
              color: 'white'
            }}
          >
            <Typography variant="h6" gutterBottom>Total Pastors</Typography>
            <Typography variant="h3">{stats.totalPastors}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'success.light',
              color: 'white'
            }}
          >
            <Typography variant="h6" gutterBottom>Total Donations</Typography>
            <Typography variant="h3">{stats.totalDonations}</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;