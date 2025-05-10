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

type SearchFriendsProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};
function SearchFriends({ open, setOpen }: SearchFriendsProps) {
  const [users, setUsers] = useState<User[]>([]);
  const { user: currentUser } = useUser();
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
                    <div className="w-6 h-6 flex items-center justify-center bg-neutral-600 rounded-full px-3">
                      <AiOutlineUserAdd className="w-full h-full" />
                    </div>
                  </CommandItem>
                )
            )}
        </CommandGroup>
        <CommandEmpty>No results found.</CommandEmpty>
      </CommandList>
    </CommandDialog>
  );
}
export default SearchFriends;
