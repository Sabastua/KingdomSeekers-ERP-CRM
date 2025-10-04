export interface Member {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  vettingStatus: string;
  pastorId: number | null;
}

export interface Pastor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  churchBranch: string;
  countryCode: string;
}

export interface Donation {
  id: number;
  amount: number;
  donationType: string;
  campaignCode: string;
  donationDate: string;
  memberId: number;
}

export interface Room {
  id: number;
  roomNumber: string;
  type: string;
  capacity: number;
  price: number;
  status: string;
  packageType: string;
}

export interface Booking {
  id: number;
  guestName: string;
  email: string;
  phone: string;
  room: Room;
  checkInDate: string;
  checkOutDate: string;
  totalAmount: number;
  paymentMethod: string;
  status: string;
}