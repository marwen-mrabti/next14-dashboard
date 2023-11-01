"use client";
import { TrashIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";

export const DeleteModal = () => {
	return (
		<>
			<button
				data-modal-target="delete-modal"
				data-modal-toggle="delete-modal"
				className="rounded-md border bg-red-700 p-2 hover:bg-gray-100"
				type="button"
			>
				<span className="sr-only">Delete</span>
				<TrashIcon className="w-5" />
			</button>
			<div
				id="delete-modal"
				aria-hidden="true"
				className="fixed left-0 right-0 top-0 z-50 hidden h-[calc(100%-1rem)] max-h-full w-full overflow-y-auto overflow-x-hidden p-4 md:inset-0"
			>
				<div className="relative max-h-full w-full max-w-2xl">
					<div className="relative rounded-lg bg-white shadow dark:bg-gray-700">
						<div className="flex items-start justify-between rounded-t border-b p-4 dark:border-gray-600">
							<h3 className="text-xl font-semibold text-gray-900 dark:text-white">
								Delete Invoice
							</h3>
							<button
								type="button"
								className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
								data-modal-hide="default-modal"
							>
								<svg
									className="h-3 w-3"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 14 14"
								>
									<path
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
									/>
								</svg>
								<span className="sr-only">Close modal</span>
							</button>
						</div>

						<div
							className="flex items-center space-x-2 rounded-b border-t
          border-gray-200 p-6 dark:border-gray-600"
						>
							<button
								data-modal-hide="delete-modal"
								type="button"
								className="rounded-lg bg-red-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
							>
								Delete
							</button>
							<button
								data-modal-hide="delete-modal"
								type="button"
								className="rounded-lg border border-gray-200 bg-white
              px-5 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:border-gray-500 dark:bg-gray-700
               dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-600"
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export const ModalButton = () => {
	return (
		<button
			data-modal-target="delete-modal"
			data-modal-toggle="delete-modal"
			className="rounded-md border p-2 hover:bg-gray-100"
			type="button"
		>
			<span className="sr-only">Delete</span>
			<TrashIcon className="w-5" />
		</button>
	);
};
