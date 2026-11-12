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
  id: number;
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  description: string;
  image: FileList | string; // FileInput outputs a FileList
};

export async function createEditCabin(newCabin: CabinFormData, id?: number) {
  // 1. Check if image is already a URL string (meaning it hasn't changed during edit)
  const hasImagePath =
    typeof newCabin.image === 'string' &&
    newCabin.image.startsWith(supabaseUrl);

  // 2. Determine image name and path based on whether it's a new file or existing URL
  const imageName = hasImagePath
    ? null
    : `${Math.random()}-${(newCabin.image as FileList)[0]?.name}`.replaceAll(
        '/',
        ''
      );

  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  // 3. Insert or Update database record
  let query: any = supabase.from('cabins');

  if (!id) {
    query = query.insert([{ ...newCabin, image: imagePath }]);
  }

  if (id) {
    query = query.update({ ...newCabin, image: imagePath }).eq('id', id);
  }

  const { data, error } = await query.select().single();
  // console.log(data);
  if (error) throw new Error('Cabin could not be created or updated');

  // 4. Upload to storage ONLY if it's a brand new file upload
  if (hasImagePath) return data;

  const { error: storageError } = await supabase.storage
    .from('cabin-images')
    .upload(imageName!, newCabin.image[0]);

  if (storageError) {
    await supabase.from('cabins').delete().eq('id', data.id);
    throw new Error(
      'Cabin image could not be uploaded and the cabin was not created'
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
