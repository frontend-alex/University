import { usePostData } from "./useFetch";

interface EnhancePayload {
  text: string | undefined;
  instruction: string;
}

interface EnhanceResponse {
  description: string;
  success: boolean;
  message: string;
}

export const useEnhanceAI = () => {
  const enahceDescription =  usePostData<EnhanceResponse, EnhancePayload>("/ai/enhance-task", {
    invalidateKey: ["auth", "user"]
  });

  return {
    enahceDescription
  }
};
