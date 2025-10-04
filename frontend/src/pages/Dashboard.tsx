import { useEffect, useState } from 'react';
import { Paper, Typography, Box, Card, CardContent } from '@mui/material';
import { People, Person, MonetizationOn, TrendingUp } from '@mui/icons-material';
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

  const statsCards = [
    {
      title: 'Total Members',
      value: stats.totalMembers,
      icon: <People sx={{ fontSize: 40 }} />,
      color: 'primary',
      bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      title: 'Total Pastors',
      value: stats.totalPastors,
      icon: <Person sx={{ fontSize: 40 }} />,
      color: 'secondary',
      bgGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    {
      title: 'Total Donations',
      value: stats.totalDonations,
      icon: <MonetizationOn sx={{ fontSize: 40 }} />,
      color: 'success',
      bgGradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
    {
      title: 'Growth Rate',
      value: '+12%',
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      color: 'warning',
      bgGradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
          Dashboard Overview
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Welcome back! Here's what's happening with your organization today.
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
        {statsCards.map((stat, index) => (
          <Box key={index}>
            <Card
              sx={{
                background: stat.bgGradient,
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                height: '100%',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '100px',
                  height: '100px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%',
                  transform: 'translate(30%, -30%)',
                },
              }}
            >
              <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      p: 1.5,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                  {stat.title}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      <Box>
          <Paper
            sx={{
              p: 4,
              background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%)',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2 }}>
                <Box
                  sx={{
                    p: 3,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                      borderColor: 'primary.main',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  <People color="primary" sx={{ fontSize: 32, mb: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Add Member
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Register new member
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 3,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                      borderColor: 'secondary.main',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  <MonetizationOn color="secondary" sx={{ fontSize: 32, mb: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Record Donation
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Log new donation
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 3,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                      borderColor: 'success.main',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  <Person color="success" sx={{ fontSize: 32, mb: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Add Pastor
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Register new pastor
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 3,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                      borderColor: 'warning.main',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  <TrendingUp color="warning" sx={{ fontSize: 32, mb: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                    View Reports
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Analytics & insights
                  </Typography>
                </Box>
            </Box>
          </Paper>
      </Box>
    </Box>
  );
};

export default Dashboard;