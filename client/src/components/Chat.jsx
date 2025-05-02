import React, { useRef } from "react";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import TypingAnimation from "./TypingAnimation";

export default function Chat({
    messages,
    setMessages,
    handleConfirmation,
    processingImage,
}) {
    const messagesEndRef = useRef(null);
    return (
        <div>
            <div className="flex-1 overflow-y-auto mt-20 p-4 space-y-4 mb-24">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex ${
                            message.type === "user"
                                ? "justify-end"
                                : "justify-start"
                        } animate-message-in`}
                    >
                        <div
                            className={`max-w-[80%] rounded-lg p-3 transition-all duration-300 transform hover:scale-101 ${
                                message.type === "user"
                                    ? "bg-blue-500 text-white"
                                    : message.type === "system"
                                    ? "bg-yellow-100 dark:bg-yellow-900 text-black dark:text-white"
                                    : "bg-gray-200 dark:bg-gray-800"
                            }`}
                        >
                            {message.isImage ? (
                                <div className="relative w-[200px] h-[150px] transition-transform duration-300 hover:scale-105">
                                    <img
                                        src={message.content}
                                        alt="User upload"
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                    <Button
                                        onClick={() => {
                                            setMessages((prev) =>
                                                prev.filter(
                                                    (_, i) => i !== index
                                                )
                                            );
                                        }}
                                        className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 hover:bg-red-600 text-white transition-transform duration-300 hover:scale-110"
                                        size="icon"
                                    >
                                        <X className="h-5 w-5" />
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <p className="whitespace-pre-wrap">
                                        {message.content}
                                    </p>
                                    {message.requiresConfirmation && (
                                        <div className="flex gap-2 mt-2 justify-end">
                                            <Button
                                                onClick={() =>
                                                    handleConfirmation(
                                                        index,
                                                        true
                                                    )
                                                }
                                                className="bg-green-500 hover:bg-green-600 text-white"
                                                size="sm"
                                            >
                                                Yes
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    handleConfirmation(
                                                        index,
                                                        false
                                                    )
                                                }
                                                className="bg-red-500 hover:bg-red-600 text-white"
                                                size="sm"
                                            >
                                                No
                                            </Button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                ))}
                {processingImage && (
                    <div className="flex justify-start animate-message-in">
                        <div className="max-w-[80%] rounded-lg p-3 bg-gray-200 dark:bg-gray-800">
                            <TypingAnimation />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
}
