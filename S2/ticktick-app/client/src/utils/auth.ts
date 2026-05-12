import { jwtDecode } from "jwt-decode";
import { config } from "@/config/config";

interface DecodedToken {
  id: string;
  exp: number;
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = [];
  for (let c = 0; c < hex.length; c += 2) {
    const byte = parseInt(hex.substr(c, 2), 16);
    bytes.push(byte);
  }
  return new Uint8Array(bytes);
}

export const decryptToken = async (encryptedToken: string): Promise<string | null> => {
  try {
    const [ivHex, authTagHex, cipherHex] = encryptedToken.split(":");

    const iv = hexToBytes(ivHex);
    const authTag = hexToBytes(authTagHex);
    const ciphertext = hexToBytes(cipherHex);
    const encrypted = new Uint8Array([...ciphertext, ...authTag]);

    const secret = config.ENCRYPTION_SECRET;
  

    const keyBuffer = hexToBytes(secret);
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyBuffer,
      { name: "AES-GCM" },
      false,
      ["decrypt"]
    );

    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv,
        tagLength: 128,
      },
      cryptoKey,
      encrypted
    );

    const result = new TextDecoder().decode(decryptedBuffer);
    return result;

  } catch (err: any) {
    return null;
  }
};

export const getUserIdFromToken = async (encryptedToken: string): Promise<string | null> => {
  const decryptedToken = await decryptToken(encryptedToken);
  if (!decryptedToken) return null;

  try {
    const decoded: DecodedToken = jwtDecode(decryptedToken);
    return decoded.id;
  } catch (err) {
    return null;
  }
};




