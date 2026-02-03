
import { DbStatus, UserSession } from "../types";

// The target MongoDB Cluster URI provided by the user
const MONGO_URL = "mongodb+srv://forex:forex@cluster0.qbg3ixa.mongodb.net/forex";

// Internal key for simulated cloud persistence
const CLOUD_SNAPSHOT_KEY = 'cluster0_forex_snapshot';

interface UserRecord {
  email: string;
  password: string; // In a real app, this would be hashed
  role: 'admin' | 'user';
  createdAt: string;
}

// Initial system state
const getCloudSnapshot = (): { users: UserRecord[] } => {
  const saved = localStorage.getItem(CLOUD_SNAPSHOT_KEY);
  if (saved) return JSON.parse(saved);
  return { 
    users: [
      { email: 'admin@cryptostrike.io', password: 'admin_password_2025', role: 'admin', createdAt: '2025-01-01' }
    ] 
  };
};

const saveCloudSnapshot = (snapshot: { users: UserRecord[] }) => {
  localStorage.setItem(CLOUD_SNAPSHOT_KEY, JSON.stringify(snapshot));
};

export const connectToCloudDatabase = async (): Promise<DbStatus> => {
  // Simulating connection handshake to MongoDB Atlas
  await new Promise(resolve => setTimeout(resolve, 1500));
  return {
    connected: true,
    cluster: "Cluster0 (Atlas)",
    latency: Math.floor(Math.random() * 30) + 15,
    lastSync: new Date().toLocaleTimeString(),
    url: MONGO_URL
  };
};

export const registerUserInDb = async (email: string, password: string): Promise<boolean> => {
  console.log(`[DB] INSERT INTO forex.users VALUES ('${email}', '***') ON ${MONGO_URL}`);
  await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate write latency
  
  const snapshot = getCloudSnapshot();
  if (snapshot.users.find(u => u.email === email)) {
    throw new Error("Conflict: This communication node (email) is already enrolled in the database.");
  }

  snapshot.users.push({
    email,
    password,
    role: 'user',
    createdAt: new Date().toISOString()
  });

  saveCloudSnapshot(snapshot);
  return true;
};

export const verifyUserInDb = async (email: string, password: string): Promise<UserSession> => {
  console.log(`[DB] SELECT * FROM forex.users WHERE email = '${email}' ON ${MONGO_URL}`);
  await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate query latency
  
  const snapshot = getCloudSnapshot();
  const user = snapshot.users.find(u => u.email === email);

  if (!user) {
    throw new Error("Identity not found in the forex database.");
  }

  if (user.password !== password) {
    throw new Error("Invalid access manifest (password). Credentials do not match cloud records.");
  }

  return { email: user.email, role: user.role };
};

export const fetchAllUsersFromDb = async (): Promise<UserRecord[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return getCloudSnapshot().users;
};

export const syncProgressToCloud = async (data: any): Promise<boolean> => {
  console.log(`[Cloud Sync] PUSHING node metrics to Cluster0...`, data);
  await new Promise(resolve => setTimeout(resolve, 800));
  return true;
};

export const getObfuscatedUrl = (url: string) => {
  try {
    const parts = url.split('@');
    if (parts.length < 2) return url;
    return `mongodb+srv://****:****@${parts[1]}`;
  } catch {
    return "Invalid Database Connection String";
  }
};
