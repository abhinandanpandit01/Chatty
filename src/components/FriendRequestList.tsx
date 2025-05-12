import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "./ui/command";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { User } from "@/types/UserTypes";
import { Avatar } from "./ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { TiTick } from "react-icons/ti";
import { GiCancel } from "react-icons/gi";
import { toast } from "sonner";
import { Request } from "@/types/RequestType";

type FriendRequestList = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setIndicator: Dispatch<SetStateAction<boolean>>;
};
function FriendRequestList({ open, setOpen, setIndicator }: FriendRequestList) {
  const { user: currentUser } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    if (currentUser?.id) {
      axios
        .get(`http://localhost:8000/users/friendRequests/${currentUser?.id}`)
        .then((res) => {
          setUsers(res.data.data.friendRequestList);
          if (res.data.data.friendRequestList.length > 0) {
            setIndicator(true);
          }
        })
        .catch((err) => {
          console.log("Failed to fetch all the users", err);
        });
    }
  }, [currentUser, setIndicator]);
  const acceptRejectRequest = async (
    requesterDetails: User,
    type: "accept" | "reject"
  ) => {
    const requestDetails: Request = {
      accepter: currentUser?.fullName as string,
      requester: requesterDetails.fullname,
      accepterId: currentUser?.id as string,
      requesterId: requesterDetails._id,
    };
    try {
      const response = await axios.post(
        `http://localhost:8000/users/respondFriendRequest/${type}`,
        { requestDetails }
      );
      toast.success(response.data.message);
      setOpen(false);
      setTimeout(() => {
        location.reload();
      }, 700);
    } catch (err) {
      console.log("Failed to accept Request", err);
      toast.error("Failed to accpet request");
    }
  };
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandList>
        <CommandGroup heading="New People">
          {users.length !== 0 &&
            users.map(
              (user) =>
                user.fullname !== currentUser?.fullName && (
                  <CommandItem key={user._id} className="mt-2">
                    <div className="w-full flex items-center">
                      <Avatar>
                        <AvatarImage src={user.avatarUrl} />
                      </Avatar>
                      <span className="font-semibold ml-3">
                        {user.fullname}
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <span
                        className="flex flex-col items-center"
                        onClick={() => acceptRejectRequest(user, "accept")}
                      >
                        <TiTick className="text-green-400" />
                        <span className="text-[.6rem]">Accept</span>
                      </span>
                      <span
                        className="flex flex-col items-center"
                        onClick={() => acceptRejectRequest(user, "reject")}
                      >
                        <GiCancel className="text-red-400" />
                        <span className="text-[.6rem]">Reject</span>
                      </span>
                    </div>
                  </CommandItem>
                )
            )}
        </CommandGroup>
        <CommandEmpty>No More requests.</CommandEmpty>
      </CommandList>
    </CommandDialog>
  );
}
export default FriendRequestList;
