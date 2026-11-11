import supabase, { supabaseUrl } from './supabase';
// import { CabinFormData } from '../features/cabins/CreateCabinForm';

export async function getCabins() {
  const { data, error } = await supabase.from('cabins').select('*');

  if (error) {
    console.error(error);
    throw new Error('cabins could not be loaded!');
  }
  return data;
}

export type CabinFormData = {
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  description: string;
  image: FileList; // FileInput outputs a FileList
};

export async function createCabin(newCabin: CabinFormData) {
  const imageName = `${Math.random()}-${newCabin.image[0].name}`.replaceAll(
    '/',
    ''
  );
  console.log(newCabin.image[0].name);
  const imagePath = `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;
  // https://lxykzuyeaglmvhjkfeyz.supabase.co/storage/v1/object/public/cabin-images/cabin-001.jpg
  // 1- create cabin
  const { data, error } = await supabase
    .from('cabins')
    .insert([{ ...newCabin, image: imagePath }])
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error('cabin could not be created');
  }

  // 2- Upload image
  // async function uploadFile(file)
  const { error: imgStorageError } = await supabase.storage
    .from('cabin-images')
    .upload(imageName, newCabin.image[0]);

  // 3- delete cabin in case of uploading image error
  if (imgStorageError) {
    await supabase.from('cabins').delete().eq('id', data.id);
    console.error(error);
    throw new Error(
      'image could not be uploaded, and the cabin was not created'
    );
  }

  return data;
}

export async function deleteCabin(id: number | string) {
  const { data, error } = await supabase.from('cabins').delete().eq('id', id);

  if (error) {
    console.error(error);
    throw new Error('cabin could not be deleted');
  }
  return data;
}
