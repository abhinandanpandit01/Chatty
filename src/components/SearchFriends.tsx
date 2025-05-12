import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { User } from "@/types/UserTypes";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { AiOutlineUserAdd } from "react-icons/ai";
import { FaUserCheck } from "react-icons/fa";

import { toast } from "sonner";
type SearchFriendsProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};
type UnknowUsers = User & { isRequested: boolean };
function SearchFriends({ open, setOpen }: SearchFriendsProps) {
  const [users, setUsers] = useState<Array<UnknowUsers>>([]);
  const { user: currentUser } = useUser();
  const sendFriendRequest = async (requestedUser: User) => {
    try {
      const request = await axios.post(
        `http://localhost:8000/users/sendFriendRequest/${currentUser?.id}/${requestedUser._id}`
      );
      toast.success(request.data.message);
      setOpen(false);
      setTimeout(() => {
        location.reload();
      }, 700);
    } catch (err) {
      console.log("Failed to send friend request", err);
    }
  };
  useEffect(() => {
    if (currentUser?.id) {
      axios
        .get(`http://localhost:8000/users/allUsers?userId=${currentUser?.id}`)
        .then((res) => {
          setUsers(res.data.data.usersList);
        })
        .catch((err) => {
          console.log("Failed to fetch all the users", err);
        });
    }
  }, [currentUser]);
  console.log(users);
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandGroup heading="New People">
          {users.length !== 0 &&
            users.map(
              (user) =>
                user.fullname !== currentUser?.fullName && (
                  <CommandItem key={user._id}>
                    <div className="w-full flex items-center">
                      <Avatar>
                        <AvatarImage src={user.avatarUrl} />
                      </Avatar>
                      <span className="font-semibold ml-3">
                        {user.fullname}
                      </span>
                    </div>
                    <div
                      className={`w-8 h-8 flex items-center justify-center ${
                        user.isRequested ? "bg-green-500" : "bg-neutral-300"
                      } rounded-full px-3`}
                      onClick={() => sendFriendRequest(user)}
                    >
                      {user.isRequested ? (
                        <FaUserCheck className="w-full h-full" color="#fff" />
                      ) : (
                        <AiOutlineUserAdd className="w-full h-full" />
                      )}
                    </div>
                  </CommandItem>
                )
            )}
        </CommandGroup>
        <CommandEmpty>No More People found</CommandEmpty>
      </CommandList>
    </CommandDialog>
  );
}
export default SearchFriends;
