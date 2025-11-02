import axios from "axios";

export const uploadToCloudinary = async (imageDataUrl) => {
  const cloudName = process.env.REACT_APP_CLOUD_NAME;
  const preset = process.env.REACT_APP_UPLOAD_PRESET;

  const formData = new FormData();
  formData.append("file", imageDataUrl);
  formData.append("upload_preset", preset);

  const response = await axios.post(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    formData
  );

  return response.data.secure_url;
};
