"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function Search({ placeholder }: { placeholder: string }) {
	const { replace } = useRouter(); //replace is used to replace the current url with the new one
	const pathname = usePathname(); //usePathname is used to get the current url
	const searchParams = useSearchParams(); //useSearchParams is used to get the query params from the url

	//useDebouncedCallback is used to avoid making a request on every key stroke and instead wait for 500ms after the user has stopped typing
	const handleOnSearch = useDebouncedCallback((term: string) => {
		const params = new URLSearchParams(searchParams);
		params.set("page", "1");

		if (term.trim()) {
			params.set("query", term);
		} else {
			params.delete("query");
		}
		replace(`${pathname}?${params.toString()}`);
	}, 300);

	const handleOnStatusChange = (status: string) => {
		const params = new URLSearchParams(searchParams);
		params.set("page", "1");
		if (status.trim()) {
			params.set("status", status);
		} else {
			params.delete("status");
		}
		replace(`${pathname}?${params.toString()}`);
	};

	return (
		<div className="relative flex flex-1 flex-shrink-0 items-center gap-3">
			<div className="w-full ">
				<label htmlFor="search" className="sr-only">
					Search
				</label>
				<input
					className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
					placeholder={placeholder}
					defaultValue={searchParams.get("query")?.toString() || ""}
					onChange={(e) => handleOnSearch(e.target.value)}
				/>
				<MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
			</div>
			{!pathname.includes("invoices") ? null : (
				<div className="w-[40%] ">
					<label htmlFor="status" className="sr-only">
						Status
					</label>
					<select
						id="countries"
						className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
						defaultValue={searchParams.get("status")?.toString()}
						onChange={(e) => handleOnStatusChange(e.target.value)}
					>
						<option value="">Choose a status</option>
						<option value="paid">Paid</option>
						<option value="pending">pending</option>
					</select>
				</div>
			)}
		</div>
	);
}
