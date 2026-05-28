import SignUpForm from './_components/SignUpForm';
import SignUpVisual from './_components/SignUpVisual';

export default function SignUpPage() {
  return (
    <main className="w-full bg-white">
      <div className="flex flex-col md:flex-row min-h-screen">
        <SignUpVisual />
        <SignUpForm />
      </div>
    </main>
  );
}