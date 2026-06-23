import { configureStore } from "@reduxjs/toolkit";
import merchantReducer from "@/store/reducer/merchant";
import CheckOutReducer from "@/store/reducer/checkout";
import userReducer, { UserState, hydrateUser } from "@/store/reducer/user";

const LOCAL_STORAGE_KEY = "seblakrr_user";

// Ambil data user dari localStorage (untuk hydration awal)
function loadUserFromStorage(): UserState | undefined {
  try {
    if (typeof window === "undefined") return undefined;
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return undefined;
    return JSON.parse(raw) as UserState;
  } catch {
    return undefined;
  }
}

// Simpan data user ke localStorage
function saveUserToStorage(state: UserState) {
  try {
    if (typeof window === "undefined") return;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export const store = configureStore({
  reducer: {
    merchant: merchantReducer,
    checkOut: CheckOutReducer,
    user: userReducer,
  },
});

// Hydrate user dari localStorage setelah store dibuat
const savedUser = loadUserFromStorage();
if (savedUser) {
  store.dispatch(hydrateUser(savedUser));
}

// Subscribe: setiap kali state user berubah, simpan otomatis ke localStorage
store.subscribe(() => {
  saveUserToStorage(store.getState().user);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;