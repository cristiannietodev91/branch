import { launchImageLibrary } from "react-native-image-picker";
import { URL_SERVICES } from "@env";
import { fetchData } from "./apiUtil";

type UploadImageToS3Props = {
  data?: {
    url: string;
    fileName: string;
    fileSize: number;
    type: string;
  };
  error?: string;
};

const UploadImageToS3 = async (): Promise<UploadImageToS3Props> => {
  try {
    const options = {
      mediaType: "photo" as const,
      quality: 1 as const,
      maxWidth: 500,
      maxHeight: 500,
    };

    const responsePickImage = await launchImageLibrary(options);

    if (responsePickImage.assets) {
      const getFirstAsset = responsePickImage.assets[0];

      const { uri, fileName, fileSize, type } = getFirstAsset;

      const url = await fetchData<string>(`${URL_SERVICES}/file/signedURL`, {
        method: "POST",
        body: {
          fileName,
          fileType: type,
        },
      });

      if (fileName && fileSize && url && type && uri) {
        await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": type,
            ...(fileSize && { "Content-Length": fileSize.toString() }),
          },
          body: {
            uri: uri,
            type: type,
            name: fileName,
          },
        });

        return {
          data: { url, fileName, fileSize, type },
        };
      }
      throw new Error("Was not possible to upload the file.");
    }

    return { error: "must select a file to upload" };
  } catch (error) {
    throw error;
  }
};

export default UploadImageToS3;
