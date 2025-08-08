import { fetchProfileName } from "@/app/actions";
import { useEffect, useState } from "react";

export const useCurrentUserName = () => {
  const [name, setName] = useState<string>("?");

  useEffect(() => {
    const getProfileName = async () => setName(await fetchProfileName());
    getProfileName();
  }, []);

  return name;
};
