import { Pen, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { useAuth } from "@/contexts/AuthProvider";

const ChangePfp = () => {

  const { user } = useAuth();

  return (
    <div className="grid-3 gap-5 lg:gap-0">
      <div className="flex-col-1">
        <h1 className="font-bold text-xl">Avatar</h1>
        <p className="text-stone-400 text-sm">Edit your profile picture</p>
      </div>
      <div className="col-span-2 lg:w-3/5">
        <div className="relative w-max">
          <Avatar className="rounded-full size-14">
            <AvatarImage src={user?.imageUrl} alt="User Avatar" />
            <AvatarFallback>{user?.username[0]}</AvatarFallback>
          </Avatar>
          <Button
            className="rounded-full absolute top-0 -right-3 bg-white dark:bg-input h-6 w-6"
            variant={"ghost"}
          >
            <Pen />
          </Button>
          <Button
            className="rounded-full absolute bottom-0 -right-3 bg-white dark:bg-input h-6 w-6"
            variant={"ghost"}
          >
            <Trash className="text-red-600" size={15}/>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChangePfp;
