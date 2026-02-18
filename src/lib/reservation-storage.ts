const STORAGE_KEY = "reservation-ids";

type ReservationMap = Record<string, string>;

function readMap(): ReservationMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as ReservationMap;
    if (parsed && typeof parsed === "object") {
      return parsed;
    }
  } catch {
    // ignore parse errors
  }
  return {};
}

function writeMap(map: ReservationMap) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function storeReservationId(itemId: string, reservationId: string) {
  const map = readMap();
  map[itemId] = reservationId;
  writeMap(map);
}

export function getStoredReservationId(itemId: string): string | null {
  const map = readMap();
  return map[itemId] ?? null;
}

export function clearStoredReservationId(itemId: string) {
  const map = readMap();
  if (itemId in map) {
    delete map[itemId];
    writeMap(map);
  }
}
