import storage from "./index";
import { toast } from "react-toastify";
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export async function uploadImageToFirebase(file: File, imagePath: string) {
  if (!file) {
    toast.error("Please choose a file first!");
  }
  const storageRef = ref(storage, imagePath);
  
  try {
    await uploadBytesResumable(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    console.log('Image URL:', downloadURL);
    return downloadURL;
  } catch (error) {
    toast.dismiss("LOADING");
    await new Promise((res) => setTimeout(res, 500));
    toast.error("Something went wrong uploading the image.");
  }
}

// https://firebasestorage.googleapis.com/v0/b/vibe-f0bb8.appspot.com/o/k.jpg-%3Ar1%3A-1687196444220-96?alt=media&token=50ded733-9ee4-4628-9b68-26296b6982cb