import { parsePhoneNumberFromString } from "libphonenumber-js";

export const validateAndFormatPhoneNumber = (number) => {
  const phoneNumber = parsePhoneNumberFromString(number);
  if (!phoneNumber || !phoneNumber.isValid()) {
    throw new Error("Invalid phone number format");
  }
  return phoneNumber.number; // E.164 format
};
    	