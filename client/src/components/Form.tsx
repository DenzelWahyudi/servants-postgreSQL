import type { ComponentProps } from "react"
import { twMerge } from "tailwind-merge"

type FormProps = {
    label: string
} & ComponentProps<"input">

export function Form({ label, className, id, ...props }: FormProps){

    return (
        <div className="flex flex-col gap-1 w-full">
            <label htmlFor={id} className="text-sm text-zinc-300">{label}</label>
            <input
                id={id}
                {...props}
                className={twMerge(
                    "bg-slate-700 border border-slate-600 focus:border-amber-400 outline-none",
                    "text-zinc-100 text-sm rounded-lg px-3 py-1 sm:py-2 transition-colors",
                    className
                )}
            />
        </div>
    )
}