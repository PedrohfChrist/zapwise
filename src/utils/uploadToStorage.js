import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/config";

const uploadToStorage = async (file, path, fileName) => {
  const storageRef = ref(storage, `${path}/${fileName}`);
  try {
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Erro ao fazer upload do arquivo: ", error);
    throw error;
  }
};

export default uploadToStorage;
