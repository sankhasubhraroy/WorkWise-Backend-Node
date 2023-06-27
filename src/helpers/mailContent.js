exports.getEmailVerificationContent = (user, otp) => {
    const content = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <h1 style="color: #0d6efd;">WorkWise</h1>
        <h2 style="color: #0d6efd;">OTP for Email Verification</h2>
        <p>Your OTP for email verification is <strong>${otp}</strong></p>
        <p>Please click <a href=${process.env.BASE_URL}/auth/${user}/verify-email/?id=${otp.userId}&type=${otp.userType}&key=${otp.key}>here</a> to verify your email.</p>
        <p>Thank you for using WorkWise</p>
    </div>
    `;

    return content;
}

exports.getResetPasswordContent = (user, otp) => {
    const content = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <h1 style="color: #0d6efd; text-align: center">WorkWise</h1>
        <h2 style="color: #0d6efd; text-align: center">Reset Your Password</h2>
        <p style="text-align: center;">Please click <a href=${process.env.BASE_URL}/auth/${user}/reset-password/?id=${otp.userId}&type=${otp.userType}&key=${otp.key}>here</a> to reset your password.</p>
        <p style="text-align: center;">Thank you for using WorkWise</p>
    </div>
    `;

    return content;
}
