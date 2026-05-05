export type SavedAddress = {
  id: string;
  label: string;
  city: string;
  details: string;
  phone: string;
};

const KEY = 'freshcart_saved_addresses';

export function loadSavedAddresses(): SavedAddress[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedAddress[];
  } catch {
    return [];
  }
}

export function saveSavedAddresses(addresses: SavedAddress[]): void {
  localStorage.setItem(KEY, JSON.stringify(addresses));
}

export function addSavedAddress(
  addr: Omit<SavedAddress, 'id'>
): SavedAddress[] {
  const list = loadSavedAddresses();
  const next: SavedAddress = {
    ...addr,
    id: `addr_${Date.now()}`,
  };
  list.push(next);
  saveSavedAddresses(list);
  return list;
}
