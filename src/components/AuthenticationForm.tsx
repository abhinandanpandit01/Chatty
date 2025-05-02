import { Link } from "react-router-dom";
import GoogleAuthProviderButton from "./GoogleAuthProviderButton";
import PhoneNumberInput from "./PhoneNumberInput";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";

function AuthenticationForm() {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Welcome</CardTitle>
        <CardDescription>
          Login with your Google account or Phone number
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <div className="auth-providers">
            <GoogleAuthProviderButton />
          </div>
          <div className="w-full after:relative after:bg-red-500 border-border after:inset-0 after:top-1/2 after:border-t after:z-0 text-center text-sm after:flex after:items-center mt-5">
            <span className="relative z-10 bg-neutral-900 top-2.5 px-3">
              Or continue with
            </span>
          </div>
          <div className="">
            <div className="mt-10 flex flex-col gap-5">
              <Label>Phone Number</Label>
              <PhoneNumberInput />
            </div>
          </div>
          <Button variant="default" className="w-full py-5">
            Send OTP
          </Button>
          <span className="text-xs ml-8 flex flex-col gap-1 items-center mt-8 font-semibold">
            Already Have An Account using Phone Number?
            <Link to={"/sign-in"} className="underline underline-offset-2">
              Sign In
            </Link>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
export default AuthenticationForm;
