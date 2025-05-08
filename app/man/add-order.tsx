"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {redirect} from "next/navigation";

const FormSchema = z.object({
	phone: z.string().min(10, {
		message: "Số điện thoại ít nhất 10 ký tự.",
	}).max(10, {message: "Số điện thoại chỉ chấp nhận 10 ký tự."}),
})

export function AddOrderForm() {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			phone: "",
		},
	})

	function onSubmit(data: z.infer<typeof FormSchema>) {
		redirect(`/man/orders/new/${data.phone}`)
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
				<FormField
					control={form.control}
					name="phone"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Phone</FormLabel>
							<FormControl>
								<Input placeholder="0989888999" {...field} />
							</FormControl>
							<FormDescription>
								Số điện thoại khách hàng.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit">Tạo đơn</Button>
			</form>
		</Form>
	)
}
