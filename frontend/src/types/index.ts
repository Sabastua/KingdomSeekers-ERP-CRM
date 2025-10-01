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