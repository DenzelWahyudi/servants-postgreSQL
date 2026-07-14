import logo from '../assets/logo.png'

export function Footer(){
    return (
        <div className="flex flex-col gap-10 pt-7">
            <div className="flex justify-between">
                <div className="flex flex-col gap-2">
                    <h3 className="text-zinc-300 font-semibold">Location</h3>
                    <h4 className="hidden sm:block text-sm text-zinc-400">Indonesia, Jakarta Utara</h4>
                    <h4 className="sm:hidden text-sm text-zinc-400">Indonesia, </h4>
                    <h4 className="sm:hidden text-sm text-zinc-400">Jakarta Utara</h4>
                </div>
                <div className="flex flex-col gap-2">
                    <h3 className="text-zinc-300 font-semibold">Contact us</h3>
                    <div className="flex flex-col gap-1.5">
                        <h4 className="hidden sm:block text-sm text-zinc-400">📞 089682115180</h4>
                        <h4 className="hidden sm:block text-sm text-zinc-400">✉️ denzel.wahyudi@outlook.com</h4>
                        <h4 className="sm:hidden text-sm text-zinc-400">089682115180</h4>
                        <h4 className="sm:hidden text-sm text-zinc-400">denzel.wahyudi@outlook.com</h4>
                    </div>
                </div>
            </div>

            <div className="flex gap-3 items-center">
                <img src={logo} alt="Servants Logo" className="w-7.5 h-10" />
                <h1 className="text-2xl font-bold">Servants</h1>
            </div>

            <span className='text-sm text-zinc-400'>© 2026 Sevants. All rights reserved.</span>
        </div>
    )
}