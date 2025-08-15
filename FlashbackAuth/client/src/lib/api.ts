import { PhoneNumberRequest, OTPVerificationRequest } from '@shared/schema';

const FLASHBACK_API_BASE = 'https://flashback.inc:9000/api/mobile';
const REFRESH_TOKEN = import.meta.env.VITE_REFRESH_TOKEN || 'your-refresh-token-here';

export class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

export async function sendOTP(phoneNumber: string) {
  const response = await fetch(`${FLASHBACK_API_BASE}/sendOTP`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `refreshToken=${REFRESH_TOKEN}`
    },
    body: JSON.stringify({ phoneNumber })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new APIError(response.status, errorText || 'Failed to send OTP');
  }

  return response.json();
}

export async function verifyOTP(phoneNumber: string, otp: string) {
  const response = await fetch(`${FLASHBACK_API_BASE}/verifyOTP`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `refreshToken=${REFRESH_TOKEN}`
    },
    body: JSON.stringify({
      phoneNumber,
      otp,
      login_platform: 'MobileApp'
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new APIError(response.status, errorText || 'Failed to verify OTP');
  }

  return response.json();
}

export async function uploadSelfie(imageBlob: Blob, phoneNumber: string, token: string) {
  const formData = new FormData();
  formData.append('image', imageBlob, 'selfie.jpg');
  formData.append('username', phoneNumber);

  const response = await fetch(`${FLASHBACK_API_BASE}/uploadUserPortrait`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Cookie': `refreshToken=${REFRESH_TOKEN}`
    },
    body: formData
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new APIError(response.status, errorText || 'Failed to upload selfie');
  }

  return response.json();
}

export async function createSession(phoneNumber: string, token: string, loginTime: string) {
  const response = await fetch('/api/session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      phoneNumber,
      token,
      loginTime
    })
  });

  if (!response.ok) {
    throw new Error('Failed to create session');
  }

  return response.json();
}

export async function updateSessionWithSelfie(phoneNumber: string, selfieUrl: string) {
  const response = await fetch(`/api/session/${encodeURIComponent(phoneNumber)}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ selfieUrl })
  });

  if (!response.ok) {
    throw new Error('Failed to update session');
  }

  return response.json();
}
