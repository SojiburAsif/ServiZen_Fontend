import LoginForm from "@/components/modules/Auth/loginForm";

export default function LoginPage() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center px-4 py-10 sm:px-6">
      <LoginForm />
    </section>
  );
}
