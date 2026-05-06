import { getListEmoji } from "@/lib/utils";
import { List } from "@/types/response";

const ListHeader = ({ list }: { list: List }) => {
  return (
    <div className="flex-col-1 mt-5">
      <h1 className="font-bold text-4xl">
        <span className="mr-2">{getListEmoji(list.title)}</span>
        <span>{list.title}</span>
      </h1>
      <p className="text-stone-400 ml-15">
        Manage your list information, permissions, and overview
      </p>
    </div>
  );
};

export default ListHeader;
