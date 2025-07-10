export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  NIK: string;
  jobTitle?: string;
  joinDate: string;
  type?: 'full-time' | 'contract' | 'resigned';
  role: 'staff' | 'manager' | 'director';
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  NIK?: string;
  jobTitle?: string;
  joinDate?: string;
  type?: 'full-time' | 'contract' | 'resigned';
}

export interface LoginRequest {
  email: string;
  password: string;
}
