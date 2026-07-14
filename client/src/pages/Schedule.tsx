import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import {
    add,
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    getDay,
    isEqual,
    isSameMonth,
    isToday,
    parse,
    startOfDay,
    startOfToday,
    startOfWeek,
} from "date-fns"
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { capitalizeFirstLetter } from "../utils/functions";
import React, { useEffect, useState } from "react"
import { useAuth } from "../hooks/useAuth";
import { Heading } from "../components/Heading";
import { API_URL } from "../api";

interface Schedule {
    roleName: string
    serviceName: string
    date: Date
    time: string
}

export function Schedule() {

    const { token } = useAuth()
    const [schedule, setSchedule] = useState<Schedule[] | null>(null)
    const [roleInfo, setRoleInfo] = useState<Schedule | null>(null)
    const [chosenSchedule, setChosenSchedule] = useState<Schedule[] | null>(null)

    useEffect(() => {
        async function fetchSchedule() {
            const response = await fetch(`${API_URL}/api/assignments/schedule`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })
            const data: Schedule[] = await response.json()
            setSchedule(Array.isArray(data) ? data : [])
        }
        if (token) {
            void fetchSchedule()
        }
    }, [token])

    const today = startOfToday()
    const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]
    const colStartClasses = [
        "",
        "col-start-2",
        "col-start-3",
        "col-start-4",
        "col-start-5",
        "col-start-6",
        "col-start-7",
    ]

    const [currMonth, setCurrMonth] = useState(() => format(today, "MMM-yyy"))
    const firstDayOfMonth = parse(currMonth, "MMM-yyyy", new Date())

    const daysInMonth = eachDayOfInterval({
        start: startOfWeek(firstDayOfMonth),
        end: endOfWeek(endOfMonth(firstDayOfMonth))
    })

    const getPrevMonth = (e: React.MouseEvent<SVGSVGElement>) => {
        e.preventDefault()
        const firstDayOfPrevMonth = add(firstDayOfMonth, { months: -1 })
        setCurrMonth(format(firstDayOfPrevMonth, "MMM-yyyy"))
    }

    const getNextMonth = (e: React.MouseEvent<SVGSVGElement>) => {
        e.preventDefault()
        const firstDayOfNextMonth = add(firstDayOfMonth, { months: 1 })
        setCurrMonth(format(firstDayOfNextMonth, "MMM-yyyy"))
    }

    return(
        <div className="mx-auto p-4 sm:px-12 py-5 flex flex-col gap-7 select-none">
            <Header variant="schedule" />
            <div className="h-192.5 lg:h-225">
                <div className="flex justify-center">
                    <div className="w-full h-150">
                        <div className="flex items-center justify-between">
                            <p className="font-semibold text-2xl pl-2.5">
                                {format(firstDayOfMonth, "MMMM yyyy")}
                            </p>
                            <div className="flex items-center justify-evenly gap-5">
                                <ChevronLeftIcon
                                className="w-6 h-6 cursor-pointer hover:text-slate-600 transition-colors"
                                onClick={getPrevMonth}
                                />
                                <button 
                                className={`cursor-pointer hover:text-zinc-400 select-none ${currMonth === format(today, "MMM-yyyy") ? "text-indigo-300" : ""}`}
                                onClick={() => setCurrMonth(format(today, "MMM-yyyy"))}
                                >
                                    Today
                                </button>
                                <ChevronRightIcon
                                className="w-6 h-6 cursor-pointer hover:text-slate-600 transition-colors"
                                onClick={getNextMonth}
                                />
                            </div>
                        </div>
                        <hr className="mt-5.5 mb-4"/>
                        <div className="grid grid-cols-7 place-items-center">
                            {days.map((day, idx) => {
                                return (
                                    <div key={idx}>
                                        {capitalizeFirstLetter(day)}
                                    </div>
                                )
                            })}
                        </div>
                        <div className="hidden lg:grid grid-cols-7 mt-3 items-center border border-slate-600">
                            {daysInMonth.map((day, idx) => {
                                return (
                                    <div key={idx} className={`${colStartClasses[getDay(day)]} border-r border-b border-slate-600 h-32.5 overflow-y-auto`}>
                                        <p
                                        className={`cursor-default flex items-center justify-center font-normal h-6 w-6 text-sm mt-1.5 ml-2 rounded-full ${
                                            isSameMonth(day, firstDayOfMonth) ? "text-zinc-100" : "text-zinc-500"
                                        } ${ isToday(day) && "bg-indigo-500 text-white" }`}
                                        >
                                            {format(day, "d")}
                                        </p>
                                        <p
                                        className="mx-3 mt-1 text-sm pb-2"
                                        >
                                            {schedule
                                            ?.filter((s) => isEqual(
                                                startOfDay(s.date),
                                                startOfDay(new Date(day))
                                            ))
                                            ?.map((s) => 
                                                <div key = {s.roleName} className="flex justify-between">
                                                    <button
                                                    onClick={() => setRoleInfo({
                                                        roleName: s.roleName,
                                                        serviceName: s.serviceName,
                                                        date: s.date,
                                                        time: s.time
                                                    })}
                                                    className="cursor-pointer hover:text-indigo-300"
                                                    >
                                                        {s.roleName.length > 14 ? s.roleName.slice(0, 12) + "..." : s.roleName}
                                                    </button>
                                                    <span className="text-zinc-400">
                                                        {s.time.length > 5 ? s.time.slice(0, 5) : s.time}
                                                    </span>
                                                </div>
                                                )
                                            }
                                        </p>
                                    </div>
                                )
                            })}
                        </div>

                        {/* For Mobile and Tablet */}
                        <div className="relative">
                            <div className="lg:hidden grid grid-cols-7 mt-3 border border-slate-600">
                                {daysInMonth.map((day, idx) => {
                                    return (
                                        <div key={idx} className={`${colStartClasses[getDay(day)]} border-r border-b border-slate-600 h-16.75 flex flex-col items-center`}>
                                            <button
                                            className={`cursor-pointer hover:text-indigo-300 flex items-center justify-center font-normal h-6 w-6 text-sm mt-1.5 rounded-full ${
                                                isSameMonth(day, firstDayOfMonth) ? "text-zinc-100" : "text-zinc-500"
                                            } ${ isToday(day) && "bg-indigo-500 text-white" }`}
                                            onClick={() => setChosenSchedule(schedule?.filter((s) => isEqual(
                                                    startOfDay(s.date),
                                                    startOfDay(new Date(day))
                                                )) ?? null
                                            )}
                                            disabled={!schedule?.some((s) => isEqual(startOfDay(s.date), startOfDay(new Date(day))))}
                                            >
                                                {format(day, "d")}
                                            </button>
                                            <div
                                            className="flex flex-wrap gap-0.5 text-[0.5rem] px-2 overflow-y-auto pb-1"
                                            >
                                                {schedule
                                                ?.filter((s) => isEqual(
                                                    startOfDay(s.date),
                                                    startOfDay(new Date(day))
                                                ))
                                                ?.map((s) => 
                                                    <div key = {s.roleName}>
                                                        <p
                                                        className="text-amber-400"
                                                        >
                                                            ●
                                                        </p>
                                                    </div>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            {chosenSchedule && (
                                <div
                                className="lg:hidden flex flex-col bg-slate-800 rounded-lg mt-4 absolute top-full right-0 left-0 h-60 overflow-y-auto"
                                >
                                    <h1 className="px-5 py-3 font-semibold text-lg text-start">{format(chosenSchedule[0].date.toString(), 'EEEE, dd MMMM yyyy')}</h1>
                                    <hr className="text-zinc-300"/>
                                    <div className="flex flex-col w-full px-5 py-3 gap-2.5">
                                        {chosenSchedule?.map((s) => (
                                            <div className="flex text-sm justify-between items-center">
                                                <div className="flex gap-4 items-center">
                                                    <span className="text-amber-400">●</span>
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="font-medium">{ s.roleName.length > 17 ? s.roleName.slice(0, 17) + "...": s.roleName}</span>
                                                        <span className="text-slate-300">{s.serviceName}</span>
                                                    </div>
                                                </div>
                                                <span>{s.time}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                    {roleInfo && (
                        <div 
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                        onClick={() => setRoleInfo(null)}
                        >
                            <div
                            onClick={(e) => e.stopPropagation()}
                            className="max-h-[90vh] overflow-y-auto"
                            >
                                <div className="flex flex-col bg-slate-800 rounded-lg w-110 p-4.5">
                                    <div className="pb-2.5">
                                        <Heading>Date: {format(roleInfo.date.toString(), 'dd MMMM yyyy')}</Heading>
                                    </div>
                                    <hr className="-mx-4.5 border-0 h-0.5 bg-amber-400"/>
                                    <div className="flex flex-col gap-1 mt-2.5 text-lg">
                                        <span>Service: {roleInfo.serviceName}</span>
                                        <span>Role: {roleInfo.roleName}</span>
                                        <span>Time: {roleInfo.time}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    )
}