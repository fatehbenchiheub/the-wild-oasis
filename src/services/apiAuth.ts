import supabase from './supabase';

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

  console.log(data);
  return data;
}
