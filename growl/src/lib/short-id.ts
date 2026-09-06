import { customAlphabet } from "nanoid";

const BASE62_ALPHABET =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

const generateShortId = customAlphabet(BASE62_ALPHABET);

export const generateUserId = () => generateShortId(12);
export const generateDeckId = () => generateShortId(12);
export const generateCardId = () => generateShortId(16);
