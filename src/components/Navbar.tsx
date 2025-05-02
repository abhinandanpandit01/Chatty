import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";

function Navbar() {
  return (
    <div className="w-full py-4 px-7 bg-neutral-900 flex justify-between">
      <h1 className="text-3xl font-bold text-slate-200">
        Chatt<span className="text-indigo-500">Y</span>
      </h1>
      <SignedIn>
        <Link to={"/chat/me"}>
          <Button className="bg-indigo-600 text-white">Let's Chat</Button>
        </Link>
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal">
          <Button className="bg-indigo-600 text-white">Log In</Button>
        </SignInButton>
      </SignedOut>
    </div>
  );
}
export default Navbar;
