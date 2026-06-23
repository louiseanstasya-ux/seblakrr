import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  nama: string;
  poin: number;
  voucher: string | null; // kode voucher yang sedang aktif
}

const initialState: UserState = {
  nama: "",
  poin: 0,
  voucher: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setNama: (state, action: PayloadAction<string>) => {
      state.nama = action.payload;
    },

    tambahPoin: (state, action: PayloadAction<number>) => {
      state.poin += action.payload;
    },

    kurangiPoin: (state, action: PayloadAction<number>) => {
      state.poin = Math.max(0, state.poin - action.payload);
    },

    pakaiVoucher: (state, action: PayloadAction<string>) => {
      state.voucher = action.payload;
    },

    hapusVoucher: (state) => {
      state.voucher = null;
    },

    resetUser: () => {
      return initialState;
    },

    // Untuk hydrate dari localStorage saat app pertama kali load
    hydrateUser: (_state, action: PayloadAction<UserState>) => {
      return action.payload;
    },
  },
});

export const {
  setNama,
  tambahPoin,
  kurangiPoin,
  pakaiVoucher,
  hapusVoucher,
  resetUser,
  hydrateUser,
} = userSlice.actions;

export default userSlice.reducer;
