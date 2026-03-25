import { ChangePasswordForm } from "@/components/modules/Auth/changePasswordForm";

export const metadata = {
  title: "Change Password",
  description: "Change your account password",
};

export default function ChangePasswordPage() {
  return (
    <section className="mx-auto max-w-3xl p-6">
      <ChangePasswordForm />
    </section>
  );
}
