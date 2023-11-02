import { ArrowPathIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Image from "next/image";
import { lusitana } from "@/app/ui/fonts";
import { fetchLatestInvoices } from "@/app/lib/data";
import Link from "next/link";

export type TLatestInvoice = {
	id: string;
	date: string;
	amount: string;
	customer: {
		name: string;
		email: string;
		image_url: string;
	};
};

export default async function LatestInvoices() {
	const latestInvoices: TLatestInvoice[] = await fetchLatestInvoices();

	return !latestInvoices.length ? null : (
		<div className="flex w-full flex-col md:col-span-4 lg:col-span-4">
			<h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>Latest Invoices</h2>
			<div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
				<ul className="bg-white px-6">
					{latestInvoices.map((invoice, i) => {
						return (
							<Link key={invoice.id} href={`/dashboard/invoices/${invoice.id}/edit`}>
								<li
									className={clsx("flex flex-row items-center justify-between py-4", {
										"border-t": i !== 0
									})}
								>
									<div className="flex items-center">
										<Image
											src={`/customers/${invoice.customer.image_url}`}
											alt={`${invoice.customer.name}'s profile picture`}
											className="mr-4 rounded-full"
											width={32}
											height={32}
										/>
										<div className="min-w-0">
											<p className="truncate text-sm font-semibold md:text-base">
												{invoice.customer.name}
											</p>
											<p className="hidden text-sm text-gray-500 sm:block">
												{invoice.customer.email}
											</p>
										</div>
									</div>
									<p className={`${lusitana.className} truncate text-sm font-medium md:text-base`}>
										{invoice.amount}
									</p>
								</li>
							</Link>
						);
					})}
				</ul>
				<div className="flex items-center pb-2 pt-6">
					<ArrowPathIcon className="h-5 w-5 text-gray-500" />
					<h3 className="ml-2 text-sm text-gray-500 ">Updated just now</h3>
				</div>
			</div>
		</div>
	);
}
