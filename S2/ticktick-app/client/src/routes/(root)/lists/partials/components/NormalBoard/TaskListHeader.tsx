// import { toast } from "sonner";
// import { List } from "@/types/response";
// import { useForm } from "react-hook-form";
// import { Input } from "@/components/ui/input";
// import { cn, getListEmoji } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { useLists } from "../../hook/useList";
// import { useState, useRef, useEffect, Suspense } from "react";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { SidebarTrigger } from "@/components/ui/sidebar";
// import { EditListDropdown } from '@/components/dropdowns/index'
// import { editListSchema, EditListValues } from "@/utils/schema";
// import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
// import { EllipsisVertical, List as Listt, Table } from "lucide-react";

// interface TaskListHeaderProps {
//   listData: List;
//   navigate?: any;
//   viewType?: "list" | "kanban";
//   onViewChange: (view: "list" | "kanban") => void;
// }

// const TaskListHeader = ({
//   listData,
//   viewType,
//   onViewChange,
// }: TaskListHeaderProps) => {
//   const inputRef = useRef<HTMLInputElement>(null);
//   const { updateList, refetch } = useLists(
//     localStorage.getItem("activeWorkspaceId") as string
//   );
//   const [isEditingTitle, setIsEditingTitle] = useState(false);

//   const editTitleForm = useForm<EditListValues>({
//     resolver: zodResolver(editListSchema),
//     defaultValues: { title: listData.title },
//   });

//   const handleEditSubmit = async (data: EditListValues) => {
//     if (data.title !== listData.title) {
//       await updateList.mutateAsync(
//         { listId: listData._id, title: data.title },
//         {
//           onSuccess: async (data) => {
//             toast.success(data.message);
//             await refetch();
//           },
//         }
//       );
//     }
//     setIsEditingTitle(false);
//   };

//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter") {
//       editTitleForm.handleSubmit(handleEditSubmit)();
//     }
//     if (e.key === "Escape") {
//       editTitleForm.reset();
//       setIsEditingTitle(false);
//     }
//   };

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         inputRef.current &&
//         !inputRef.current.contains(event.target as Node)
//       ) {
//         editTitleForm.handleSubmit(handleEditSubmit)();
//       }
//     };

//     if (isEditingTitle) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isEditingTitle]);

//   return (
//     <div className="flex flex-col px-5 pt-[14px] border-b border-accent">
//       <div className="flex-row-2">
//         <div className="flex items-center gap-2">
//           <SidebarTrigger className="flex md:hidden" />
//           {isEditingTitle ? (
//             <Form {...editTitleForm}>
//               <form onSubmit={editTitleForm.handleSubmit(handleEditSubmit)}>
//                 <FormField
//                   control={editTitleForm.control}
//                   name="title"
//                   render={({ field: { ref, ...rest } }) => (
//                     <FormItem>
//                       <FormControl>
//                         <Input
//                           {...rest}
//                           ref={(el) => {
//                             ref(el);
//                             inputRef.current = el;
//                           }}
//                           autoFocus
//                           onKeyDown={handleKeyDown}
//                           style={{ fontSize: "1.875rem" }}
//                           onBlur={editTitleForm.handleSubmit(handleEditSubmit)}
//                           className="text-3xl input-register no-ring w-full font-bold py-5"
//                         />
//                       </FormControl>
//                     </FormItem>
//                   )}
//                 />
//               </form>
//             </Form>
//           ) : (
//             <>
//               <h1 className="text-3xl font-corm font-bold">{listData.title}</h1>
//               <span>{getListEmoji(listData.title)}</span>
//             </>
//           )}
//         </div>
//         <div>
//           <Suspense fallback={null}>
//             <EditListDropdown
//               redirect={true}
//               listId={listData._id}
//               onEditClick={() => setIsEditingTitle(true)}
//             >
//               <Button variant={"ghost"}>
//                 <EllipsisVertical />
//               </Button>
//             </EditListDropdown>
//           </Suspense>
//         </div>
//       </div>
//       <div className="flex-row-2 mt-3">
//         <Button
//           className={cn(
//             "h-7 px-3 gap-2 border-b-2 rounded-none rounded-t-md",
//             viewType === "list"
//               ? "border-accent-foreground"
//               : "border-transparent"
//           )}
//           size="sm"
//           variant="ghost"
//           onClick={() => onViewChange("list")}
//         >
//           <Listt className="text-indigo-500" />
//           <span className="text-sm font-medium">List</span>
//         </Button>
//         <Button
//           className={cn(
//             "h-7 px-3 gap-2 border-b-2 rounded-none rounded-t-md",
//             viewType === "kanban"
//               ? "border-accent-foreground"
//               : "border-transparent"
//           )}
//           size="sm"
//           variant="ghost"
//           onClick={() => onViewChange("kanban")}
//         >
//           <Table className="text-amber-500" />
//           <span className="text-sm font-medium">Board</span>
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default TaskListHeader;

import { List } from "@/types/response";
import { cn, getListEmoji } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { EditListDropdown } from "@/components/dropdowns/index";
import { EllipsisVertical, List as Listt, Table } from "lucide-react";
import { Suspense } from "react";

interface TaskListHeaderProps {
  listData: List;
  navigate?: any;
  viewType?: "list" | "kanban";
  onViewChange: (view: "list" | "kanban") => void;
}

const TaskListHeader = ({
  listData,
  viewType,
  onViewChange,
}: TaskListHeaderProps) => {
  return (
    <div className="flex flex-col px-5 pt-[14px] border-b border-accent">
      <div className="flex-row-2">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="flex md:hidden" />

          <h1 className="text-3xl font-corm font-bold">{listData.title}</h1>
          <span>{getListEmoji(listData.title)}</span>
        </div>
        <div>
          <Suspense  fallback={null}>
            <EditListDropdown listId={listData._id}>
              <Button variant={"ghost"}>
                <EllipsisVertical />
              </Button>
            </EditListDropdown>
          </Suspense>
        </div>
      </div>
      <div className="flex-row-2 mt-3">
        <Button
          className={cn(
            "h-7 px-3 gap-2 border-b-2 rounded-none rounded-t-md",
            viewType === "list"
              ? "border-accent-foreground"
              : "border-transparent"
          )}
          size="sm"
          variant="ghost"
          onClick={() => onViewChange("list")}
        >
          <Listt className="text-indigo-500" />
          <span className="text-sm font-medium">List</span>
        </Button>
        <Button
          className={cn(
            "h-7 px-3 gap-2 border-b-2 rounded-none rounded-t-md",
            viewType === "kanban"
              ? "border-accent-foreground"
              : "border-transparent"
          )}
          size="sm"
          variant="ghost"
          onClick={() => onViewChange("kanban")}
        >
          <Table className="text-amber-500" />
          <span className="text-sm font-medium">Board</span>
        </Button>
      </div>
    </div>
  );
};

export default TaskListHeader;
