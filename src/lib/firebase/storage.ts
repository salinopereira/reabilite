import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from './config'; // Sua configuração do Firebase

const storage = getStorage(app);

/**
 * Faz o upload de uma imagem para o Firebase Storage.
 * @param file O arquivo da imagem a ser enviado.
 * @param path O caminho no Storage onde o arquivo será salvo (ex: 'posts/user123/').
 * @returns A URL de download pública da imagem.
 */
export const uploadImage = async (file: File, path: string): Promise<string> => {
  if (!file) {
    throw new Error('Nenhum arquivo fornecido para upload.');
  }

  // Cria um nome de arquivo único para evitar conflitos
  const fileName = `${new Date().getTime()}_${file.name}`;
  const storageRef = ref(storage, `${path}/${fileName}`);

  // Faz o upload do arquivo
  const uploadResult = await uploadBytes(storageRef, file);

  // Pega a URL de download
  const downloadURL = await getDownloadURL(uploadResult.ref);

  return downloadURL;
};
