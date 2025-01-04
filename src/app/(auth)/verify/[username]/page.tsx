'use client'
import { useToast } from '@/hooks/use-toast'
import { verifySchema } from '@/schemas/verifySchema'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"

const VerifyAccount = () => {
    const router = useRouter()
    const params = useParams<{ username: string }>()
    const { toast } = useToast()

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post(`/api/verify-code`, { username: params.username, code: data.code })
            toast({ title: 'Account verified', description: 'You can now sign in' })
            router.replace('/sign-in')
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: 'Signup Failed',
                description: axiosError.response?.data.message ?? 'Error verifying account',
                variant: 'destructive'
            })
        }
    }
    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-300'>
            <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
                <div className='text-center'>
                    <h1 className='text-3xl font-semibold text-gray-800'>
                        Verify your Account
                    </h1>
                    <p className='text-sm text-gray-600 mt-2'>
                        Please enter the verification code sent to your email
                    </p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                        <FormField
                            name='code'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className='flex flex-col items-center justify-center'>
                                    <FormLabel>Verification Code</FormLabel>
                                    <FormControl >
                                        <InputOTP maxLength={6} {...field}>
                                            <InputOTPGroup className='space-x-1'>
                                                <InputOTPSlot index={0} className='h-12 text-lg' />
                                                <InputOTPSlot index={1} className='h-12 text-lg' />
                                                <InputOTPSlot index={2} className='h-12 text-lg' />
                                                <InputOTPSlot index={3} className='h-12 text-lg' />
                                                <InputOTPSlot index={4} className='h-12 text-lg' />
                                                <InputOTPSlot index={5} className='h-12 text-lg' />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='flex justify-center'>
                            <Button type='submit' className='w-full py-3'>
                                Submit
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}
export default VerifyAccount
