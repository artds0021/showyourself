export interface Profile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  age?: number;
  profession: string;
  experience?: string;
  skills?: string;
  education?: string;
  workExperience?: string;
  achievements?: string;
  profilePhoto?: string;
  slug: string;
  createdAt?: Date;
}

export interface CreateProfileData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  age?: number;
  profession: string;
  experience?: string;
  skills?: string;
  education?: string;
  workExperience?: string;
  achievements?: string;
  profilePhoto?: File;
}
