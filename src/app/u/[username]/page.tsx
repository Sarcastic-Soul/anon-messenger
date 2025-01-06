'use client';

import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CardHeader, CardContent, Card } from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { allQuestions } from './questions';
import * as z from 'zod';
import { ApiResponse } from '@/types/ApiResponse';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';
import Navbar from '@/components/navbar';

const getRandomQuestions = () => {
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
};

export default function SendMessage() {
    const params = useParams<{ username: string }>();
    const username = params.username;

    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
    });

    const messageContent = form.watch('content');
    const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);

    useEffect(() => {
        // Set suggested messages once on component mount
        setSuggestedMessages(getRandomQuestions());
    }, []);

    const handleMessageClick = (message: string) => {
        form.setValue('content', message);
    };

    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data: z.infer<typeof messageSchema>) => {
        setIsLoading(true);
        try {
            const response = await axios.post<ApiResponse>('/api/send-message', {
                ...data,
                username,
            });

            toast({
                title: response.data.message,
                variant: 'default',
            });
            form.reset({ ...form.getValues(), content: '' });
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: 'Error',
                description:
                    axiosError.response?.data.message ?? 'Failed to send message',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Function to refresh the suggested messages
    const handleRefresh = () => {
        setSuggestedMessages(getRandomQuestions());
    };

    return (
        <>
            <Navbar />
            <div className="container mx-auto my-8 p-6 bg-white rounded-xl shadow-lg max-w-4xl dark:bg-gray-700">
                <h1 className="text-4xl font-bold mb-6 text-center text-black dark:text-gray-200">
                    Public Profile Link
                </h1>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-lg text-black dark:text-gray-300">
                                        Send Anonymous Message to{' '}
                                        <span className="font-bold">{username}</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Write your anonymous message here"
                                            className="resize-none border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black p-4"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-center">
                            {isLoading ? (
                                <Button
                                    disabled
                                    className="flex items-center gap-2"
                                >
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    disabled={isLoading || !messageContent}
                                    className="w-full bg-black text-white hover:bg-gray-800 transition-transform duration-200 active:scale-95"
                                >
                                    Send It
                                </Button>

                            )}
                        </div>
                    </form>
                </Form>

                <div className="space-y-4 my-8">
                    <Card className="border-t-2 border-black">
                        <CardHeader className="relative">
                            <h3 className="text-xl font-semibold text-black text-center dark:text-gray-200">
                                Suggested Messages
                            </h3>
                            {/* Refresh Button */}
                            <Button
                                variant="ghost"
                                className="absolute top-2 right-2 p-2 text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white"
                                onClick={handleRefresh}
                            >
                                <RefreshCw className="w-5 h-5" />
                            </Button>
                        </CardHeader>
                        <CardContent className="flex flex-col space-y-4">
                            {suggestedMessages.map((message, index) => (
                                <Button
                                    key={index}
                                    variant="outline"
                                    className="mb-2 p-3 text-black hover:bg-gray-200 transition-transform duration-200 active:scale-95 dark:text-gray-300 dark:hover:bg-gray-700"
                                    onClick={() => handleMessageClick(message)}
                                >
                                    {message}
                                </Button>

                            ))}
                        </CardContent>
                    </Card>
                </div>
                <Separator className="my-6" />
                <div className="text-center">
                    <div className="mb-4 text-black dark:text-gray-300">
                        Don't have an account yet?
                    </div>
                    <Link href={'/sign-up'}>
                        <Button className="bg-black text-white transition-transform duration-200 active:scale-95 hover:bg-gray-800 dark:bg-gray-200 dark:text-black">
                            Create Your Account
                        </Button>
                    </Link>
                </div>
            </div>
        </>
    );
}
