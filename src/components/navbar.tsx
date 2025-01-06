'use client'
import React from 'react'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'
import { ModeToggle } from './modeToggle'
import { Separator } from './ui/separator'

const Navbar = () => {
    const { data: session } = useSession()
    const user: User = session?.user as User

    return (
        <>
            <nav className="bg-gray-50 dark:bg-gray-900 shadow-md py-4 px-6">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" passHref>
                        <span className="text-2xl font-bold text-black dark:text-white cursor-pointer">
                            AnonMessenger
                        </span>
                    </Link>

                    {/* Navbar Items */}
                    <div className="flex items-center space-x-4">
                        <ModeToggle />
                        {
                            session ? (
                                <>
                                    <Link href={`/dashboard`} passHref>
                                        <span className="text-lg text-gray-700 dark:text-gray-100 cursor-pointer">
                                            Welcome, <span className='font-bold'>{user?.username || user?.email}</span>
                                        </span>
                                    </Link>
                                    <Button
                                        onClick={() => signOut()}
                                        className="px-4 py-2"
                                    >
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <Link href="/sign-in">
                                    <Button className="px-4 py-2">
                                        Login
                                    </Button>
                                </Link>
                            )
                        }
                    </div>
                </div>
            </nav>
            <Separator />
        </>
    )
}

export default Navbar
