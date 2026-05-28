import SignInForm from './_components/SignInForm';
import SignInVisual from './_components/SignInVisual';

export default function SignIn() {
  return (
    <main className="w-full bg-white">
      <div className="flex flex-col md:flex-row min-h-screen">
        <SignInVisual />
        <SignInForm />
      </div>
    </main>
  );
}
