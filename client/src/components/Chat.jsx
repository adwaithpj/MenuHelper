import React, { useRef, useState, useCallback } from "react";

import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import TypingAnimation from "./TypingAnimation";

// Add CSS for hiding scrollbar in Webkit browsers
const scrollbarHideStyles = {
    "::-webkit-scrollbar": {
        display: "none",
    },
};

export default function Chat({
    messages,
    setMessages,
    handleConfirmation,
    processingImage,
    messagesEndRef,
}) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const carouselRef = useRef(null);
    const scrollTimeout = useRef(null);
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedDish, setSelectedDish] = useState(null);

    const scrollToSlide = (index) => {
        if (carouselRef.current) {
            const container = carouselRef.current;
            const slides = container.children;
            if (slides.length > 0) {
                const slideWidth = slides[0].offsetWidth;
                const gapWidth = 16; // This corresponds to the gap-4 class (4 * 4px = 16px)
                const scrollPosition = index * (slideWidth + gapWidth);
                container.scrollTo({
                    left: scrollPosition,
                    behavior: "smooth",
                });
            }
        }
    };

    const handleScroll = useCallback(() => {
        if (scrollTimeout.current) {
            clearTimeout(scrollTimeout.current);
        }

        scrollTimeout.current = setTimeout(() => {
            if (carouselRef.current) {
                const container = carouselRef.current;
                const slideWidth = container.children[0]?.offsetWidth || 0;
                const gapWidth = 16;
                const scrollPosition = container.scrollLeft;
                const newIndex = Math.round(
                    scrollPosition / (slideWidth + gapWidth)
                );
                if (newIndex !== currentSlide) {
                    setCurrentSlide(newIndex);
                }
            }
        }, 50); // Small delay to prevent rapid updates
    }, [currentSlide]);

    // Cleanup timeout on unmount
    React.useEffect(() => {
        return () => {
            if (scrollTimeout.current) {
                clearTimeout(scrollTimeout.current);
            }
        };
    }, []);

    // Add scroll event listener
    React.useEffect(() => {
        const container = carouselRef.current;
        if (container) {
            container.addEventListener("scroll", handleScroll);
            return () => container.removeEventListener("scroll", handleScroll);
        }
    }, [handleScroll]);

    const parseDishes = (content) => {
        try {
            const lines = content.split("\n");
            const dishes = [];
            let currentDish = null;

            for (const line of lines) {
                if (line.startsWith("🍽️")) {
                    if (currentDish) {
                        dishes.push(currentDish);
                    }
                    currentDish = {
                        title: line.replace("🍽️", "").trim(),
                        description: "",
                        imageUrl: "",
                    };
                } else if (line.startsWith("📸")) {
                    if (currentDish) {
                        currentDish.imageUrl = line.replace("📸", "").trim();
                    }
                } else if (
                    currentDish &&
                    line.trim() &&
                    !line.startsWith("😋")
                ) {
                    currentDish.description += line.trim() + "\n";
                }
            }

            if (currentDish) {
                dishes.push(currentDish);
            }

            return dishes;
        } catch (error) {
            console.error("Error parsing dishes:", error);
            return [];
        }
    };

    return (
        <div className="flex-1 overflow-y-auto mt-20 p-4 space-y-4 pb-24">
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
                                ? "bg-gray-500 text-white"
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
                                            prev.filter((_, i) => i !== index)
                                        );
                                    }}
                                    className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 hover:bg-red-600 text-white transition-transform duration-300 hover:scale-110"
                                    size="icon"
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                        ) : message.type === "ai" ? (
                            (() => {
                                const dishes = parseDishes(message.content);

                                const handlePrevSlide = () => {
                                    const newIndex =
                                        currentSlide > 0
                                            ? currentSlide - 1
                                            : dishes.length - 1;
                                    setCurrentSlide(newIndex);
                                    scrollToSlide(newIndex);
                                };

                                const handleNextSlide = () => {
                                    const newIndex =
                                        currentSlide < dishes.length - 1
                                            ? currentSlide + 1
                                            : 0;
                                    setCurrentSlide(newIndex);
                                    scrollToSlide(newIndex);
                                };

                                if (dishes.length === 0) {
                                    return (
                                        <p className="whitespace-pre-wrap">
                                            {message.content}
                                        </p>
                                    );
                                }

                                return (
                                    <div className="space-y-4">
                                        {/* Horizontal scrollable carousel */}
                                        <div
                                            ref={carouselRef}
                                            className={`overflow-x-auto flex gap-4 scroll-smooth snap-x snap-mandatory scrollbar-hide ${
                                                dishes.length > 1
                                                    ? ""
                                                    : "justify-center"
                                            }`}
                                            style={{
                                                scrollbarWidth:
                                                    "none" /* Firefox */,
                                                msOverflowStyle:
                                                    "none" /* IE and Edge */,
                                                WebkitOverflowScrolling:
                                                    "touch",
                                                ...scrollbarHideStyles,
                                            }}
                                            onScroll={handleScroll}
                                        >
                                            {dishes.map((dish, i) => (
                                                <div
                                                    key={i}
                                                    className={`min-w-[300px] max-w-full flex-shrink-0 p-3 border rounded-lg snap-start transition-colors duration-300 ease-in-out flex flex-col ${
                                                        i === currentSlide
                                                            ? "bg-gray-200/80 dark:bg-gray-700/80"
                                                            : "bg-white/80 dark:bg-gray-900/80 hover:bg-gray-100 dark:hover:bg-gray-800"
                                                    }`}
                                                >
                                                    {/* Content section */}
                                                    <div className="space-y-3 flex-grow">
                                                        <h3 className="text-lg font-semibold">
                                                            {dish.title}
                                                        </h3>
                                                        {dish.imageUrl && (
                                                            <div className="relative w-full h-[200px] rounded-lg overflow-hidden">
                                                                <img
                                                                    src={
                                                                        dish.imageUrl
                                                                    }
                                                                    alt={
                                                                        dish.title
                                                                    }
                                                                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                                                    loading="lazy"
                                                                />
                                                            </div>
                                                        )}
                                                        <p className="whitespace-pre-wrap text-sm">
                                                            {dish.description}
                                                        </p>
                                                    </div>

                                                    {/* Button section - fixed at bottom */}
                                                    <div className="mt-auto pt-6">
                                                        <Button
                                                            onClick={() => {
                                                                setSelectedDish(
                                                                    dish.title
                                                                );
                                                                setShowImageModal(
                                                                    true
                                                                );
                                                            }}
                                                            className="w-full transition-colors duration-300 py-6"
                                                            size="sm"
                                                        >
                                                            View Image
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Navigation buttons - only show for multiple dishes */}
                                        {dishes.length > 1 && (
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    {currentSlide + 1} of{" "}
                                                    {dishes.length}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        onClick={
                                                            handlePrevSlide
                                                        }
                                                        className="p-2 rounded-full bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600"
                                                        size="icon"
                                                    >
                                                        <ChevronLeft className="h-5 w-5" />
                                                    </Button>
                                                    <Button
                                                        onClick={
                                                            handleNextSlide
                                                        }
                                                        className="p-2 rounded-full bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600"
                                                        size="icon"
                                                    >
                                                        <ChevronRight className="h-5 w-5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })()
                        ) : (
                            <>
                                <p className="whitespace-pre-wrap">
                                    {message.content}
                                </p>
                                {message.requiresConfirmation && (
                                    <div className="flex gap-2 mt-2 justify-end">
                                        <Button
                                            onClick={() =>
                                                handleConfirmation(index, true)
                                            }
                                            className="bg-green-500 hover:bg-green-600 text-white"
                                            size="sm"
                                        >
                                            Yes
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                handleConfirmation(index, false)
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
            {showImageModal && selectedDish && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl h-[80vh] flex flex-col relative">
                        <div className="p-4 border-b">
                            <h3 className="text-lg font-semibold">
                                {selectedDish} Images
                            </h3>
                        </div>
                        <div className="flex-1 p-3">
                            <iframe
                                src={`https://www.google.com/search?igu=1&q=${encodeURIComponent(
                                    selectedDish
                                )}&tbm=isch`}
                                className="w-full h-full rounded-lg"
                                title="Google Images"
                            />
                        </div>
                        <Button
                            onClick={() => setShowImageModal(false)}
                            className="absolute bottom-6 right-6 rounded-full w-12 h-12 bg-black hover:bg-black/90 text-white shadow-lg transition-all duration-300 hover:scale-110"
                            size="icon"
                        >
                            <X className="h-6 w-6" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
