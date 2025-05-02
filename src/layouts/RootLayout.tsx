import Loader from "@/components/Loader";
import { Outlet, useNavigation } from "react-router-dom";

function RootLayout() {
  const navigation = useNavigation();
  const isNavigating = navigation.state === "loading";
  return (
    <div className="h-screen w-full relative">
      {isNavigating && <Loader />}
      <Outlet />
    </div>
  );
}
export default RootLayout;
