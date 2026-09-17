/**
 * A display name and picture for the signed-in account.
 *
 * There is no backend here and the contract stores no profile, so both live in
 * this browser and nowhere else: they do not follow the account to another
 * device, and nobody else can ever see them. The profile page says so rather
 * than implying an account profile that does not exist.
 */

export type Profile = { name: string; avatar: string };

const KEY = "peril:profile";
const EMPTY: Profile = { name: "", avatar: "" };
const listeners = new Set<(p: Profile) => void>();

export function readProfile(): Profile {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<Profile>;
    return {
      name: typeof parsed.name === "string" ? parsed.name : "",
      avatar: typeof parsed.avatar === "string" ? parsed.avatar : "",
    };
  } catch {
    // Storage can be blocked or hold something else entirely.
    return EMPTY;
  }
}

export function writeProfile(next: Profile) {
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Nothing to do: the name simply will not survive a reload.
  }
  listeners.forEach((l) => l(next));
}

export function clearProfile() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // As above.
  }
  listeners.forEach((l) => l(EMPTY));
}

export function onProfile(handler: (p: Profile) => void): () => void {
  listeners.add(handler);
  return () => {
    listeners.delete(handler);
  };
}

/**
 * Shrink a chosen image to a small square data URL.
 *
 * A phone photo is several megabytes and localStorage holds about five in
 * total, so the file is drawn onto a 128px canvas and re-encoded before it is
 * stored. Rejects anything that is not an image, or that will not decode.
 */
export function toAvatar(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("That file is not an image."));
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const size = 128;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("This browser would not draw the image."));
        return;
      }
      // Cover the square: crop the long side rather than squashing the face.
      const side = Math.min(img.width, img.height);
      ctx.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("That image could not be read."));
    };
    img.src = url;
  });
}

/**
 * A mark drawn from the address itself, shown until a picture is chosen. The
 * same address always gives the same pattern, so an account is recognisable
 * without anybody uploading anything.
 */
export function addressMark(address: string): { cells: boolean[]; hue: number } {
  const hex = address.replace(/^0x/, "").toLowerCase();
  let hash = 0;
  for (let i = 0; i < hex.length; i++) hash = (hash * 31 + hex.charCodeAt(i)) >>> 0;

  // Five by five, mirrored down the middle, so it reads as a mark not noise.
  const cells: boolean[] = [];
  for (let y = 0; y < 5; y++) {
    const row: boolean[] = [];
    for (let x = 0; x < 3; x++) {
      const bit = (hash >>> ((y * 3 + x) % 30)) & 1;
      row.push(bit === 1);
    }
    cells.push(...row, row[1], row[0]);
  }
  return { cells, hue: hash % 360 };
}
