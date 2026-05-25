/**
 * Uploads a file directly to Cloudinary using an Unsigned Upload Preset.
 *
 * @param file The file to upload (Image, Icon, etc.)
 * @param cloudName The Cloudinary cloud name (supplied: ddtf1d2yk)
 * @param uploadPreset The unsigned upload preset name
 * @returns The secure URL string of the uploaded asset
 */
export async function uploadToCloudinary(
  file: File,
  cloudName: string = "ddtf1d2yk",
  uploadPreset: string = "portfolio_preset"
): Promise<string> {
  if (!file) {
    throw new Error("No file selected for upload");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData?.error?.message || `Cloudinary upload failed: ${response.statusText}`
      );
    }

    const data = await response.json();
    if (!data.secure_url) {
      throw new Error("Cloudinary did not return a secure URL");
    }

    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw error;
  }
}
