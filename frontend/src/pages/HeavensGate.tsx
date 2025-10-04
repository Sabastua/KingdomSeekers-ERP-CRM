import { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Card, CardContent, 
  Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, IconButton, MenuItem, FormControl, InputLabel, Select,
  Alert, Snackbar
} from '@mui/material';
import { 
  Add, Edit, Delete, Bed, Login
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { roomService, bookingService } from '../services/api';

// Mock data for now - will be replaced with API calls
const mockRooms = [
  { id: 1, roomNumber: 'HG-001', type: 'Standard', capacity: 2, price: 5000, status: 'available', package: 'Basic' },
  { id: 2, roomNumber: 'HG-002', type: 'Deluxe', capacity: 4, price: 8000, status: 'occupied', package: 'Premium' },
  { id: 3, roomNumber: 'HG-003', type: 'VIP', capacity: 6, price: 15000, status: 'maintenance', package: 'Luxury' },
  { id: 4, roomNumber: 'HG-004', type: 'Family Suite', capacity: 8, price: 20000, status: 'available', package: 'Family' },
];

const mockBookings = [
  { id: 1, guestName: 'John Doe', roomNumber: 'HG-002', checkIn: '2024-01-15', checkOut: '2024-01-18', amount: 24000, paymentMethod: 'M-Pesa', status: 'confirmed' },
  { id: 2, guestName: 'Jane Smith', roomNumber: 'HG-004', checkIn: '2024-01-16', checkOut: '2024-01-20', amount: 80000, paymentMethod: 'Bank Transfer', status: 'pending' },
];

const mockOccupancyData = [
  { date: '2024-01-01', occupancy: 65, revenue: 150000 },
  { date: '2024-01-02', occupancy: 72, revenue: 180000 },
  { date: '2024-01-03', occupancy: 68, revenue: 165000 },
  { date: '2024-01-04', occupancy: 75, revenue: 195000 },
  { date: '2024-01-05', occupancy: 80, revenue: 210000 },
  { date: '2024-01-06', occupancy: 85, revenue: 225000 },
  { date: '2024-01-07', occupancy: 78, revenue: 200000 },
];

const paymentMethodData = [
  { name: 'M-Pesa', value: 65, color: '#0088FE' },
  { name: 'Bank Transfer', value: 25, color: '#00C49F' },
  { name: 'Cash', value: 10, color: '#FFBB28' },
];

const HeavensGate = () => {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openBookingDialog, setOpenBookingDialog] = useState(false);
  const [openRoomDialog, setOpenRoomDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [bookingForm, setBookingForm] = useState({
    guestName: '',
    email: '',
    phone: '',
    roomId: '',
    checkIn: '',
    checkOut: '',
    paymentMethod: 'M-Pesa',
    package: 'Basic'
  });

  const [roomForm, setRoomForm] = useState({
    roomNumber: '',
    type: 'Standard',
    capacity: 2,
    price: 5000,
    package: 'Basic'
  });

  const roomTypes = ['Standard', 'Deluxe', 'VIP', 'Family Suite'];
  const packages = ['Basic', 'Premium', 'Luxury', 'Family'];
  const paymentMethods = ['M-Pesa', 'Bank Transfer', 'Cash'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [roomsRes, bookingsRes] = await Promise.all([
        roomService.getAll(),
        bookingService.getAll()
      ]);
      setRooms(roomsRes.data);
      setBookings(bookingsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setSnackbar({ open: true, message: 'Error loading data', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'success';
      case 'occupied': return 'error';
      case 'maintenance': return 'warning';
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const handleBookingSubmit = async () => {
    try {
      const bookingData = {
        ...bookingForm,
        room: { id: parseInt(bookingForm.roomId) },
        checkInDate: bookingForm.checkIn,
        checkOutDate: bookingForm.checkOut,
        paymentMethod: bookingForm.paymentMethod.toUpperCase().replace('-', '_')
      };
      
      await bookingService.create(bookingData);
      setSnackbar({ open: true, message: 'Booking created successfully!', severity: 'success' });
      setOpenBookingDialog(false);
      setBookingForm({
        guestName: '',
        email: '',
        phone: '',
        roomId: '',
        checkIn: '',
        checkOut: '',
        paymentMethod: 'M-Pesa',
        package: 'Basic'
      });
      fetchData();
    } catch (error) {
      console.error('Error creating booking:', error);
      setSnackbar({ open: true, message: 'Error creating booking', severity: 'error' });
    }
  };

  const handleRoomSubmit = async () => {
    try {
      const roomData = {
        ...roomForm,
        type: roomForm.type.toUpperCase().replace(' ', '_'),
        packageType: roomForm.package.toUpperCase(),
        status: 'AVAILABLE'
      };
      
      await roomService.create(roomData);
      setSnackbar({ open: true, message: 'Room added successfully!', severity: 'success' });
      setOpenRoomDialog(false);
      setRoomForm({
        roomNumber: '',
        type: 'Standard',
        capacity: 2,
        price: 5000,
        package: 'Basic'
      });
      fetchData();
    } catch (error) {
      console.error('Error creating room:', error);
      setSnackbar({ open: true, message: 'Error creating room', severity: 'error' });
    }
  };

  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter(room => room.status === 'OCCUPIED').length;
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
  const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Bed color="primary" />
          Heaven's Gate Prayer Mountain
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="contained" 
            startIcon={<Add />}
            onClick={() => setOpenRoomDialog(true)}
          >
            Add Room
          </Button>
          <Button 
            variant="contained" 
            startIcon={<Login />}
            onClick={() => setOpenBookingDialog(true)}
          >
            New Booking
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
        <Card sx={{ bgcolor: 'primary.light', color: 'white', minWidth: 200, flex: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Total Rooms</Typography>
            <Typography variant="h3">{totalRooms}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ bgcolor: 'secondary.light', color: 'white', minWidth: 200, flex: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Occupancy Rate</Typography>
            <Typography variant="h3">{occupancyRate}%</Typography>
          </CardContent>
        </Card>
        <Card sx={{ bgcolor: 'success.light', color: 'white', minWidth: 200, flex: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Available Rooms</Typography>
            <Typography variant="h3">{totalRooms - occupiedRooms}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ bgcolor: 'warning.light', color: 'white', minWidth: 200, flex: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Today's Revenue</Typography>
            <Typography variant="h3">KSh {totalRevenue.toLocaleString()}</Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Charts Section */}
      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
        <Paper sx={{ p: 3, flex: 2, minWidth: 400 }}>
          <Typography variant="h6" gutterBottom>Occupancy & Revenue Trends</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockOccupancyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="occupancy" stroke="#8884d8" name="Occupancy %" />
              <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#82ca9d" name="Revenue (KSh)" />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
        <Paper sx={{ p: 3, flex: 1, minWidth: 300 }}>
          <Typography variant="h6" gutterBottom>Payment Methods</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentMethodData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(props: any) => `${props.name} ${(props.percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {paymentMethodData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Box>

      {/* Rooms Table */}
      <Paper sx={{ mb: 3 }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">Room Management</Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Room Number</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Capacity</TableCell>
                <TableCell>Package</TableCell>
                <TableCell>Price (KSh)</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell>{room.roomNumber}</TableCell>
                  <TableCell>{room.type?.replace('_', ' ')}</TableCell>
                  <TableCell>{room.capacity}</TableCell>
                  <TableCell>{room.packageType?.replace('_', ' ')}</TableCell>
                  <TableCell>{room.price?.toLocaleString()}</TableCell>
                  <TableCell>
                    <Chip 
                      label={room.status?.replace('_', ' ')} 
                      color={getStatusColor(room.status?.toLowerCase()) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small">
                      <Edit />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Recent Bookings */}
      <Paper>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">Recent Bookings</Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Guest Name</TableCell>
                <TableCell>Room</TableCell>
                <TableCell>Check-in</TableCell>
                <TableCell>Check-out</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.guestName}</TableCell>
                  <TableCell>{booking.room?.roomNumber}</TableCell>
                  <TableCell>{booking.checkInDate}</TableCell>
                  <TableCell>{booking.checkOutDate}</TableCell>
                  <TableCell>KSh {booking.totalAmount?.toLocaleString()}</TableCell>
                  <TableCell>{booking.paymentMethod?.replace('_', ' ')}</TableCell>
                  <TableCell>
                    <Chip 
                      label={booking.status?.replace('_', ' ')} 
                      color={getStatusColor(booking.status?.toLowerCase()) as any}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Booking Dialog */}
      <Dialog open={openBookingDialog} onClose={() => setOpenBookingDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>New Booking</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Guest Name"
                value={bookingForm.guestName}
                onChange={(e) => setBookingForm({...bookingForm, guestName: e.target.value})}
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={bookingForm.email}
                onChange={(e) => setBookingForm({...bookingForm, email: e.target.value})}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Phone"
                value={bookingForm.phone}
                onChange={(e) => setBookingForm({...bookingForm, phone: e.target.value})}
              />
              <FormControl fullWidth>
                <InputLabel>Room</InputLabel>
                <Select
                  value={bookingForm.roomId}
                  onChange={(e) => setBookingForm({...bookingForm, roomId: e.target.value})}
                >
                  {rooms.filter(room => room.status === 'AVAILABLE').map((room) => (
                    <MenuItem key={room.id} value={room.id}>
                      {room.roomNumber} - {room.type?.replace('_', ' ')} (KSh {room.price?.toLocaleString()})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Check-in Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={bookingForm.checkIn}
                onChange={(e) => setBookingForm({...bookingForm, checkIn: e.target.value})}
              />
              <TextField
                fullWidth
                label="Check-out Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={bookingForm.checkOut}
                onChange={(e) => setBookingForm({...bookingForm, checkOut: e.target.value})}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={bookingForm.paymentMethod}
                  onChange={(e) => setBookingForm({...bookingForm, paymentMethod: e.target.value})}
                >
                  {paymentMethods.map((method) => (
                    <MenuItem key={method} value={method}>{method}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Package</InputLabel>
                <Select
                  value={bookingForm.package}
                  onChange={(e) => setBookingForm({...bookingForm, package: e.target.value})}
                >
                  {packages.map((pkg) => (
                    <MenuItem key={pkg} value={pkg}>{pkg}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBookingDialog(false)}>Cancel</Button>
          <Button onClick={handleBookingSubmit} variant="contained">Create Booking</Button>
        </DialogActions>
      </Dialog>

      {/* Room Dialog */}
      <Dialog open={openRoomDialog} onClose={() => setOpenRoomDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Room</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Room Number"
                value={roomForm.roomNumber}
                onChange={(e) => setRoomForm({...roomForm, roomNumber: e.target.value})}
              />
              <FormControl fullWidth>
                <InputLabel>Room Type</InputLabel>
                <Select
                  value={roomForm.type}
                  onChange={(e) => setRoomForm({...roomForm, type: e.target.value})}
                >
                  {roomTypes.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Capacity"
                type="number"
                value={roomForm.capacity}
                onChange={(e) => setRoomForm({...roomForm, capacity: parseInt(e.target.value)})}
              />
              <TextField
                fullWidth
                label="Price (KSh)"
                type="number"
                value={roomForm.price}
                onChange={(e) => setRoomForm({...roomForm, price: parseInt(e.target.value)})}
              />
            </Box>
            <FormControl fullWidth>
              <InputLabel>Package</InputLabel>
              <Select
                value={roomForm.package}
                onChange={(e) => setRoomForm({...roomForm, package: e.target.value})}
              >
                {packages.map((pkg) => (
                  <MenuItem key={pkg} value={pkg}>{pkg}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRoomDialog(false)}>Cancel</Button>
          <Button onClick={handleRoomSubmit} variant="contained">Add Room</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({...snackbar, open: false})}
      >
        <Alert severity={snackbar.severity as any}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default HeavensGate;