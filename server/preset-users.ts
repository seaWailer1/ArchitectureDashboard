import { storage } from './storage';
import { createUserSampleData } from './seed-data';

interface PresetUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  currentRole: string;
  kycStatus: string;
  phoneVerified: boolean;
  documentsVerified: boolean;
  biometricVerified: boolean;
}

const PRESET_USERS: PresetUser[] = [
  {
    id: "consumer-001",
    email: "amara.okafor@example.com",
    firstName: "Amara",
    lastName: "Okafor",
    phone: "+234 123 456 7890",
    address: "15 Ademola Street, Victoria Island",
    city: "Lagos",
    country: "NG",
    currentRole: "consumer",
    kycStatus: "verified",
    phoneVerified: true,
    documentsVerified: true,
    biometricVerified: true,
  },
  {
    id: "merchant-001",
    email: "kwame.asante@example.com",
    firstName: "Kwame",
    lastName: "Asante",
    phone: "+233 234 567 8901",
    address: "42 Oxford Street, Osu",
    city: "Accra",
    country: "GH",
    currentRole: "merchant",
    kycStatus: "verified",
    phoneVerified: true,
    documentsVerified: true,
    biometricVerified: true,
  },
  {
    id: "agent-001",
    email: "fatima.hassan@example.com",
    firstName: "Fatima",
    lastName: "Hassan",
    phone: "+254 345 678 9012",
    address: "88 Kimathi Street, CBD",
    city: "Nairobi",
    country: "KE",
    currentRole: "agent",
    kycStatus: "verified",
    phoneVerified: true,
    documentsVerified: true,
    biometricVerified: true,
  },
  {
    id: "consumer-002",
    email: "thabo.mthembu@example.com",
    firstName: "Thabo",
    lastName: "Mthembu",
    phone: "+27 456 789 0123",
    address: "123 Long Street, City Bowl",
    city: "Cape Town",
    country: "ZA",
    currentRole: "consumer",
    kycStatus: "verified",
    phoneVerified: true,
    documentsVerified: true,
    biometricVerified: true,
  },
  {
    id: "merchant-002",
    email: "aisha.mohammed@example.com",
    firstName: "Aisha",
    lastName: "Mohammed",
    phone: "+20 567 890 1234",
    address: "55 Tahrir Square, Downtown",
    city: "Cairo",
    country: "EG",
    currentRole: "merchant",
    kycStatus: "verified",
    phoneVerified: true,
    documentsVerified: true,
    biometricVerified: true,
  },
  {
    id: "consumer-new",
    email: "john.newcomer@example.com",
    firstName: "John",
    lastName: "Newcomer",
    phone: "+234 678 901 2345",
    address: "78 Allen Avenue, Ikeja",
    city: "Lagos",
    country: "NG",
    currentRole: "consumer",
    kycStatus: "pending",
    phoneVerified: false,
    documentsVerified: false,
    biometricVerified: false,
  },
  {
    id: "consumer-kyc",
    email: "mary.inprogress@example.com",
    firstName: "Mary",
    lastName: "InProgress",
    phone: "+254 789 012 3456",
    address: "45 Kenyatta Avenue, CBD",
    city: "Nairobi",
    country: "KE",
    currentRole: "consumer",
    kycStatus: "in_progress",
    phoneVerified: true,
    documentsVerified: false,
    biometricVerified: false,
  },
];

export async function createPresetUsers(): Promise<void> {
  console.log("Creating preset user accounts...");
  
  for (const presetUser of PRESET_USERS) {
    try {
      // Check if user already exists
      const existingUser = await storage.getUser(presetUser.id);
      if (existingUser) {
        console.log(`User ${presetUser.id} already exists, skipping...`);
        continue;
      }

      // Create the user
      const user = await storage.upsertUser({
        id: presetUser.id,
        email: presetUser.email,
        firstName: presetUser.firstName,
        lastName: presetUser.lastName,
        phone: presetUser.phone,
        address: presetUser.address,
        city: presetUser.city,
        country: presetUser.country,
        currentRole: presetUser.currentRole,
        kycStatus: presetUser.kycStatus,
        phoneVerified: presetUser.phoneVerified,
        documentsVerified: presetUser.documentsVerified,
        biometricVerified: presetUser.biometricVerified,
      });

      console.log(`Created user: ${user.firstName} ${user.lastName} (${user.currentRole})`);

      // Generate sample data for verified users
      if (presetUser.kycStatus === 'verified') {
        try {
          await createUserSampleData(presetUser.id, presetUser.currentRole);
          console.log(`Generated sample data for ${presetUser.id}`);
        } catch (error) {
          console.error(`Error generating sample data for ${presetUser.id}:`, error);
        }
      }
    } catch (error) {
      console.error(`Error creating preset user ${presetUser.id}:`, error);
    }
  }
  
  console.log("Preset user creation completed!");
}

export async function getPresetUserCredentials(): Promise<Array<{
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  description: string;
}>> {
  return PRESET_USERS.map(user => ({
    id: user.id,
    email: user.email,
    name: `${user.firstName} ${user.lastName}`,
    role: user.currentRole,
    status: user.kycStatus,
    description: getUserDescription(user)
  }));
}

function getUserDescription(user: PresetUser): string {
  const location = `${user.city}, ${getCountryName(user.country)}`;
  
  switch (user.currentRole) {
    case 'consumer':
      if (user.kycStatus === 'verified') {
        return `Verified consumer from ${location} with full wallet access and transaction history`;
      } else if (user.kycStatus === 'pending') {
        return `New user from ${location} requiring onboarding completion`;
      } else {
        return `User from ${location} with partial KYC verification`;
      }
    case 'merchant':
      return `Verified merchant from ${location} with business dashboard and payment processing`;
    case 'agent':
      return `Verified agent from ${location} with commission tracking and service provider tools`;
    default:
      return `User from ${location}`;
  }
}

function getCountryName(code: string): string {
  const countries: Record<string, string> = {
    'NG': 'Nigeria',
    'GH': 'Ghana',
    'KE': 'Kenya',
    'ZA': 'South Africa',
    'EG': 'Egypt',
    'MA': 'Morocco'
  };
  return countries[code] || code;
}

export { PRESET_USERS };