interface OTPFunctionAttributes {
    expiry:Date,
    otp:string
}

//Duration is in minutes
export function getOtpAndExpiry(duration:number): OTPFunctionAttributes {
    const otp = Math.floor(100000 + Math.random() * 90000).toString()
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 10);
    return {expiry,otp};
}