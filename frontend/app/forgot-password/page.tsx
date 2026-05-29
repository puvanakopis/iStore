import ForgotPasswordForm from './_components/ForgotPasswordForm';
import ForgotPasswordVisual from './_components/ForgotPasswordVisual';

export default function ForgotPasswordPage() {
  return (
    <main className="w-full bg-white">
      <div className="flex flex-col md:flex-row min-h-screen">
        <ForgotPasswordVisual />
        <ForgotPasswordForm />
      </div>
    </main>
  );
}
