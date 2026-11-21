import supabase, { supabaseUrl } from './supabase';

export type SignupType = {
  fullName: string;
  email: string;
  password: string;
};

export async function signup({ fullName, email, password }: SignupType) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        fullName,
        Avatar: '',
      },
    },
  });

  if (error) throw new Error(error.message);

  return data;
}

type LoginType = {
  email: string;
  password: string;
};

export async function login({ email, password }: LoginType) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);

  return data;
}

export async function getCurrentUser() {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) return null;

  const { data, error } = await supabase.auth.getUser();

  if (error) throw new Error(error.message);

  return data.user;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();

  if (error) throw new Error(error.message);
}

export type UpdateUserType = {
  fullName?: string;
  password?: string;
  avatar?: File | null; // ← was string
};

type UpdateUserData = {
  password?: string;
  data?: {
    fullName?: string;
    avatar?: string;
  };
};

export async function updateCurrentUser({
  password,
  fullName,
  avatar,
}: UpdateUserType) {
  // 1. Build the attributes object by MERGING
  const updateData: UpdateUserData = {};
  if (password) updateData.password = password;
  if (fullName) updateData.data = { ...updateData.data, fullName };

  // 2. Upload avatar if provided
  if (avatar) {
    const fileName = `avatar-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}`;
    const { error: storageError } = await supabase.storage
      .from('avatars')
      .upload(fileName, avatar);
    if (storageError) throw new Error(storageError.message);

    updateData.data = {
      ...updateData.data,
      avatar: `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`,
    };
  }

  // 3. Single update call
  const { data, error } = await supabase.auth.updateUser(updateData);
  if (error) throw new Error(error.message);

  return data.user; // consistent return shape
}
