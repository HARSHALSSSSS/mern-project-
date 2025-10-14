const ForgotPassword = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-neutral-100 to-accent-50">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-card">
        <h2 className="text-2xl font-bold mb-6 text-center text-primary-800">Forgot Password</h2>
        <p className="text-neutral-600 text-center mb-6">
          Enter your email address and we'll send you a link to reset your password.
        </p>
        {/* Add forgot password form */}
      </div>
    </div>
  );
};

export default ForgotPassword;
