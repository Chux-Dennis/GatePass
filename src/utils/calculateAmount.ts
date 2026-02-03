import { PAYSTACK_CHARGE_RATE } from "../constants/charge";

export const calculateAmountAfterPaystackCharge = (amount: number): number => {
  if (amount <= 0) return 0;

  // Paystack charge rate is in percent (e.g. 1.5)
  const charge = (Number(PAYSTACK_CHARGE_RATE) / 100) * amount;

  // Paystack rounds up to the nearest kobo
  const total = amount + charge;

  return Math.ceil(total);
};
