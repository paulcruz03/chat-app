import { LoginForm } from "@/components/widgets/login-form";
import { setupServerFirebase } from "@/lib/firebase-server";

export default async function Login() {
  await setupServerFirebase();

  return (
    <div className="container mx-auto flex h-screen items-center justify-center">
      <LoginForm />
    </div>
  );
}

