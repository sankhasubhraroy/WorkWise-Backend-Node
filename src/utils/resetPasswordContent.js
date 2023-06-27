const getResetPasswordContent = (user, otp) => {
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

module.exports = getResetPasswordContent;