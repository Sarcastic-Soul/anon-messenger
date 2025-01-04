'use client';
import { Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import messages from './messages.json';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function Home() {
    return (
        <>
            {/* Main content */}
            <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gray-100 dark:bg-gray-800 dark:text-gray-200">
                <section className="text-center mb-8 md:mb-12">
                    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                        Dive into the World of Anonymous Feedback
                    </h1>
                    <p className="mt-3 md:mt-4 text-lg md:text-xl dark:text-gray-300">
                        Welcome to Anon Messenger, where your thoughts and feelings can be shared
                        freely and anonymously, with complete privacy.
                    </p>
                </section>

                {/* Project Description */}
                <section className="mb-12 text-center">
                    <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 dark:text-gray-200">
                        What is Anon Messenger?
                    </h2>
                    <Separator />
                    <p className="mt-4 text-base md:text-lg max-w-2xl mx-auto dark:text-gray-400">
                        Anon Messenger is a platform designed to enable anonymous feedback. Whether you
                        want to express gratitude, share concerns, or simply connect without revealing
                        your identity, Anon Messenger provides a safe space for individuals to communicate
                        without fear of judgment or exposure.
                    </p>
                </section>

                {/* Carousel for Messages */}
                <section className="mb-12 w-full max-w-lg md:max-w-xl">
                    <h2 className="scroll-m-20 font-semibold tracking-tight first:mt-0 text-2xl text-center mb-2 dark:text-gray-200">
                        Hear from our users
                    </h2>
                    <Separator />
                    <Carousel
                        plugins={[Autoplay({ delay: 2000 })]}
                        className="w-full"
                    >
                        <CarouselContent>
                            {messages.map((message, index) => (
                                <CarouselItem key={index} className="p-4">
                                    <Card className="bg-white dark:bg-gray-900 shadow-lg">
                                        <CardHeader>
                                            <CardTitle className="text-black dark:text-gray-300">{message.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                                            <Mail className="flex-shrink-0 text-gray-600 dark:text-gray-300" />
                                            <div>
                                                <p className="text-gray-800 dark:text-gray-200">{message.content}</p>
                                                <p className="text-xs text-gray-400 mt-1 dark:text-gray-500">{message.received}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </CarouselItem>
                            ))}
                        </CarouselContent>

                        {/* Carousel Navigation */}
                        <CarouselPrevious className="absolute top-1/2 transform -translate-y-1/2">
                            Previous
                        </CarouselPrevious>
                        <CarouselNext className="absolute top-1/2 transform -translate-y-1/2">
                            Next
                        </CarouselNext>
                    </Carousel>
                </section>
            </main>

            {/* Footer */}
            <Separator />
            <footer className="text-center p-4 md:p-6 bg-gray-50 dark:bg-gray-900 flex flex-col items-center">
                <p className="text-sm  text-gray-700 dark:text-gray-400">
                    © 2023 Anon Messenger. All rights reserved.
                </p>
                <Separator className="my-4 w-1/5" />
                <div className="flex h-5 items-center space-x-4 text-sm">
                    <Button variant="link" className="text-gray-500 dark:text-gray-400">
                        Privacy Policy
                    </Button>
                    <Separator orientation="vertical" />
                    <Button variant="link" className="text-gray-500 dark:text-gray-400">
                        Terms of Service
                    </Button>
                </div>
            </footer>
        </>
    );
}
