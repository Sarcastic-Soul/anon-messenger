'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import axios, { AxiosError } from 'axios'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useDebounce } from "use-debounce"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation'
import { signUpSchema } from '@/schemas/signUpSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { Card } from '@/components/ui/card'

const signUpPage = () => {
    const [username, setUsername] = useState('')
    const [usernameMessage, setUsernameMessage] = useState('')
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [debouncedUsername] = useDebounce(username, 300)

    const { toast } = useToast()
    const router = useRouter()

    // zod implementation
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
        },
    })

    useEffect(() => {
        let lastCheckedUsername = '';
        const checkUsernameUnique = async () => {
            if (debouncedUsername && debouncedUsername !== lastCheckedUsername) {
                setIsCheckingUsername(true)
                setUsernameMessage('')
                try {
                    const response = await axios.get<ApiResponse>(`/api/unique-username?username=${debouncedUsername}`)
                    setUsernameMessage(response.data.message)
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>;
                    setUsernameMessage(axiosError.response?.data.message ?? 'Error checking username')
                } finally {
                    setIsCheckingUsername(false)
                }
            }
        }
        checkUsernameUnique()
    }, [debouncedUsername])

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true)
        try {
            await axios.post<ApiResponse>('/api/sign-up', data)
            toast({
                title: 'Account created',
                description: 'You can now sign in',
            })
            router.replace(`/verify/${username}`)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: 'Error',
                description: axiosError.response?.data.message ?? 'An error occurred',
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-300 dark:bg-gray-800'>
            <Card className='w-full max-w-md p-8 space-y-8'>
                <div className='text-center'>
                    <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>
                        Join us
                    </h1>
                    <p className='mb-4'> Sign up to start your anonymous adventure</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                        <FormField
                            control={form.control}
                            name='username'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            onChange={(e) => {
                                                setUsername(e.target.value.trim())
                                                field.onChange(e)
                                            }}
                                        />
                                    </FormControl>
                                    {isCheckingUsername && <Loader2 />}
                                    {!isCheckingUsername && usernameMessage && (
                                        <p
                                            className={`text-sm ${usernameMessage === 'Username is unique'
                                                ? 'text-green-500'
                                                : 'text-red-500'
                                                }`}
                                        >
                                            {usernameMessage}
                                        </p>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <Input {...field} name="email" />
                                    <p className='text-gray-600 text-sm dark:text-gray-100'>We will send you a verification code</p>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='password'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type='password'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type='submit' disabled={isSubmitting} className='w-full'>
                            {isSubmitting ?
                                <>
                                    <Loader2 className='w-6 h-6 mr-2 animate-spin' /> Please Wait
                                </>
                                : 'Sign up'}
                        </Button>
                    </form>
                </Form>
                <div className='text-center mt-4'>
                    <p>
                        Already a member?{' '}
                        <Link href='/sign-in' className='text-blue-500 hover:text-blue-700'>
                            Sign in
                        </Link>
                    </p>
                </div>
            </Card>
        </div>
    )
}

export default signUpPage
