'use client'

import { MessageCard } from "@/components/messageCard";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/model/user.model";
import { acceptMessagesSchema } from "@/schemas/acceptMessagesSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2, RefreshCcw, Copy } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const dashboardPage = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isSwitchLoading, setIsSwitchLoading] = useState<boolean>(false);

    const { toast } = useToast();
    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter((message) => message._id !== messageId));
    };

    const { data: session } = useSession();

    const form = useForm({
        resolver: zodResolver(acceptMessagesSchema),
    })

    const { register, watch, setValue } = form;

    const acceptMessages = watch('acceptMessages');

    const fetchAcceptMessages = useCallback(async () => {
        setIsSwitchLoading(true);
        try {
            const response = await axios.get<ApiResponse>('/api/accept-messages')
            setValue('acceptMessages', response.data.isAcceptingMessages)
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to fetch messages acceptance status',
                variant: 'destructive',
            })
        } finally {
            setIsSwitchLoading(false);
        }
    }, [setValue])

    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        setLoading(true);
        setIsSwitchLoading(true);
        try {
            const response = await axios.get<ApiResponse>('/api/get-messages');
            setMessages(response.data.messages || []);
            if (refresh) {
                toast({
                    title: 'Messages refreshed',
                    description: 'Messages have been refreshed successfully',
                })
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to fetch messages',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
            setIsSwitchLoading(false);
        }
    }, [setLoading, setMessages]);

    useEffect(() => {
        if (!session || !session.user) return;
        fetchMessages();
        fetchAcceptMessages();
    }, [session, fetchMessages, fetchAcceptMessages, setValue]);

    const handleSwitchChange = async () => {
        try {
            const response = await axios.post<ApiResponse>('/api/accept-messages', { acceptMessages: !acceptMessages });
            setValue('acceptMessages', !acceptMessages);
            toast({
                title: response.data.message,
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to update messages acceptance status',
                variant: 'destructive',
            });
        }
    }

    if (!session || !session.user) {
        return (<div className="text-center text-gray-600 dark:text-gray-300">Please Login</div>)
    }
    const { username } = session?.user as User;
    const baseUrl = `${window.location.protocol}//${window.location.host}`; // http://localhost:3000
    const profileUrl = `${baseUrl}/u/${username}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl);
        toast({
            title: 'Link copied',
            description: 'Your profile link has been copied to the clipboard',
        });
    }

    return (
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg w-full max-w-6xl">
            <h1 className="text-4xl font-semibold text-center text-black dark:text-white mb-6">User Dashboard</h1>

            {/* Copy Profile Link Section */}
            <h2 className="text-lg font-medium text-gray-700 dark:text-gray-100 mb-2">Copy Your Unique Link</h2>
            <div className="flex items-center border rounded-lg text-gray-700 border-gray-300 dark:border-gray-400 dark:bg-gray-800 dark:text-gray-300 ">
                <input
                    type="text"
                    value={profileUrl}
                    disabled
                    className="input w-full p-2 rounded-l-lg "
                />
                <Button
                    onClick={copyToClipboard}
                    className="dark:bg-gray-200 dark:hover:bg-gray-400"
                >
                    <Copy className="h-5 w-5" />
                </Button>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <Switch
                        {...register('acceptMessages')}
                        checked={acceptMessages}
                        onCheckedChange={handleSwitchChange}
                        disabled={isSwitchLoading}
                    />
                    <span className="ml-4 text-gray-700 dark:text-gray-300">Accept Messages</span>
                </div>

                <Button
                    variant="outline"
                    onClick={(e) => {
                        e.preventDefault();
                        fetchMessages(true);
                    }}
                    className="mt-4"
                >
                    {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <RefreshCcw className="h-4 w-4" />
                    )}
                    <span className="ml-2">Refresh Messages</span>
                </Button>
            </div>

            {/* Messages List */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {messages.length > 0 ? (
                    messages.map((message, index) => (
                        <MessageCard
                            key={message._id?.toString()}
                            message={message}
                            onMessageDelete={handleDeleteMessage}
                        />
                    ))
                ) : (
                    <p className="text-center text-gray-600 dark:text-gray-300">No messages to display.</p>
                )}
            </div>
        </div>
    );
}

export default dashboardPage;
