import React, { useState, useEffect } from "react";

const loadingMessages = [
    { text: "Working on it... 🧠", emoji: "🧠" },
    { text: "Hold tight! 🚀", emoji: "🚀" },
    { text: "Processing your request... ⚡", emoji: "⚡" },
    { text: "Almost there... 🎯", emoji: "🎯" },
    { text: "Cooking up something special... 🍳", emoji: "🍳" },
    { text: "Analyzing the menu... 📋", emoji: "📋" },
    { text: "Getting things ready... 🎨", emoji: "🎨" },
    { text: "Just a moment... ⏳", emoji: "⏳" },
];

export default function TypingAnimation() {
    const [currentMessage, setCurrentMessage] = useState(0);
    const [displayText, setDisplayText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const message = loadingMessages[currentMessage];
        const targetText = message.text;

        let timeout;

        if (!isDeleting && displayText === targetText) {
            // Pause at full text
            timeout = setTimeout(() => setIsDeleting(true), 2000);
        } else if (isDeleting && displayText === "") {
            // Move to next message
            setIsDeleting(false);
            setCurrentMessage((prev) => (prev + 1) % loadingMessages.length);
        } else {
            // Typing or deleting
            const delta = isDeleting ? -1 : 1;
            timeout = setTimeout(
                () => {
                    setDisplayText(
                        targetText.substring(0, displayText.length + delta)
                    );
                },
                isDeleting ? 50 : 100
            );
        }

        return () => clearTimeout(timeout);
    }, [displayText, isDeleting, currentMessage]);

    return (
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex space-x-1">
                <div
                    className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                ></div>
                <div
                    className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                ></div>
                <div
                    className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                ></div>
            </div>
            <span>{displayText}</span>
        </div>
    );
}
