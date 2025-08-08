import { fetchProfileImage } from "@/app/actions";
import { useEffect, useState } from "react";

export const useCurrentUserImage = () => {
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    const getUserImage = async () => setImage(await fetchProfileImage());
    getUserImage();
  }, []);

  return image;
};
