import AuthenticationForm from "@/components/AuthenticationForm";

function AuthenticationPage() {
  return (
    <div className="h-full w-full bg-background flex items-center justify-center flex-col">
      <div className="w-full max-w-sm p-3 bg-red-300">
        <AuthenticationForm />
      </div>
    </div>
  );
}
export default AuthenticationPage;
