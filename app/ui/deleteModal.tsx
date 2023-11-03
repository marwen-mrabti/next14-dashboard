import { Button } from "@/app/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogPortal,
	DialogTitle,
	DialogTrigger
} from "@/app/components/ui/dialog";
import { TrashIcon } from "lucide-react";
import { DeleteInvoice } from "./invoices/buttons";

export function DeleteModal({ title, id }: { title: string; id: string }) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<button className="rounded-md border p-2 hover:bg-gray-100">
					<span className="sr-only">Delete</span>
					<TrashIcon className="w-5" />
				</button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle className="text-xl text-blue-500">{title}</DialogTitle>
					<DialogDescription className="mt-5 text-red-500">
						are you sure you want to delete this invoice?
					</DialogDescription>
				</DialogHeader>

				<DialogFooter className="flex w-full items-center ">
					<DialogClose asChild className="mr-auto">
						<Button
							type="button"
							className="bg-slate-400 font-semibold text-black hover:bg-slate-300"
						>
							Cancel
						</Button>
					</DialogClose>
					<DialogClose asChild className="">
						<DeleteInvoice id={id} />
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
