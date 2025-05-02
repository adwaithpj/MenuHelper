"use client";

import { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import toast from "react-hot-toast";

//components
import Header from "@/components/Header";
import WelcomeText from "@/components/WelcomeText";
import Chat from "@/components/Chat";
import InputArea from "@/components/InputArea";

//Shadcn UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { X, Camera, Send, Upload, Image as ImageIcon } from "lucide-react";

import convertor from "@/utils/ocr";
import { fixMenuItems, textToFoodItems } from "@/utils/genAI";

export default function Home() {
    const [mounted, setMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [chatStarted, setChatStarted] = useState(false);

    const [processingImage, setProcessingImage] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);

    const [ocrResults, setOcrResults] = useState(null);

    const [inputValue, setInputValue] = useState("");
    const [previewUrl, setPreviewUrl] = useState("");

    const [messages, setMessages] = useState([]);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
        setIsMobile(
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
            )
        );
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            toast.success("File selected successfully!");
        }
    };

    const handleCapture = async () => {
        try {
            if (!navigator.mediaDevices?.getUserMedia) {
                toast.error("Camera not supported or HTTPS required");
                return;
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "environment",
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                },
            });

            const video = document.createElement("video");
            video.srcObject = stream;
            video.setAttribute("autoplay", "");
            video.setAttribute("playsinline", "");
            video.style.width = "100%";
            video.style.maxHeight = "300px";
            video.classList.add("rounded-lg", "mt-2");

            const overlay = document.createElement("div");
            overlay.className =
                "fixed inset-0 bg-black/70 z-50 flex items-center justify-center flex-col";
            overlay.appendChild(video);

            const captureBtn = document.createElement("button");
            const captureCloseBtn = document.createElement("button");
            captureCloseBtn.textContent = "x";
            captureCloseBtn.className =
                "absolute top-60 right-5 px-5 py-3 bg-red-500 text-white rounded";
            captureBtn.textContent = "Capture";
            captureBtn.className =
                "mt-4 px-6 py-2 bg-white text-black dark:bg-white dark:text-white  rounded ";
            overlay.appendChild(captureBtn);
            overlay.appendChild(captureCloseBtn);
            document.body.appendChild(overlay);

            captureCloseBtn.onclick = () => {
                stream.getTracks().forEach((track) => track.stop());
                overlay.remove();
            };

            captureBtn.onclick = () => {
                const canvas = document.createElement("canvas");
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageUrl = canvas.toDataURL("image/jpeg");

                // Cleanup
                stream.getTracks().forEach((track) => track.stop());
                overlay.remove();

                // Convert canvas to blob and create file
                canvas.toBlob((blob) => {
                    const file = new File([blob], "captured-image.jpg", {
                        type: "image/jpeg",
                    });
                    setSelectedFile(file);
                    setPreviewUrl(imageUrl);
                    toast.success("Image captured!");
                }, "image/jpeg");
            };
        } catch (err) {
            console.error("Camera error:", err);
            toast.error("Unable to access camera");
        }
    };

    const handleDeleteImage = () => {
        setPreviewUrl("");
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        toast.success("Image removed successfully!");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);
        setChatStarted(true);

        if (!inputValue && !selectedFile && !previewUrl) {
            toast.error("Please enter text or upload an image");
            setSubmitted(false);
            return;
        }

        if (inputValue) {
            /**set user message to the conversation */
            setMessages((prev) => [
                ...prev,
                { type: "user", content: inputValue, timestamp: new Date() },
            ]);

            setInputValue("");
            setProcessingImage(true);

            try {
                const response = await textToFoodItems(inputValue);

                if (!response.success) {
                    setMessages((prev) => [
                        ...prev,
                        {
                            type: "ai",
                            content: `I'm sorry 🥺, my developers are lazy and is still working on it why this happened.😪.Wait for some time.`,
                            timestamp: new Date(),
                        },
                    ]);
                    return;
                }

                // Check if response is a message (greeting or non-food query)
                if (response.menuItems.message) {
                    setMessages((prev) => [
                        ...prev,
                        {
                            type: "ai",
                            content: response.menuItems.message,
                            timestamp: new Date(),
                        },
                    ]);
                    return;
                }

                const menuItems = response.menuItems || [];

                if (menuItems.length === 0) {
                    setMessages((prev) => [
                        ...prev,
                        {
                            type: "ai",
                            content: `I'm sorry 🥺, I couldn't find any menu items for "${inputValue}" ❌. Please try again with a different query.🥹`,
                            timestamp: new Date(),
                        },
                    ]);
                    return;
                }
                if (menuItems.length > 0) {
                    setMessages((prev) => [
                        ...prev,
                        {
                            type: "ai",
                            content: `😋🧑‍🍳 Yummy, here are the details of the dishes you asked for:\n\n${menuItems
                                .map(
                                    (item) =>
                                        `🍽️ ${item.dishName}\n\n${item.description}\n`
                                )
                                .join("\n")}`,
                            timestamp: new Date(),
                        },
                    ]);
                }
            } catch (error) {
                toast.error("Failed to process message");
                console.error("Message processing error:", error);
                console.error("Error details:", {
                    message: error.message,
                    stack: error.stack,
                    response: error.response,
                });
            } finally {
                setProcessingImage(false);
                setSubmitted(false);
            }
        }
        // console.log("previewUrl", previewUrl);
        if (previewUrl) {
            setMessages((prev) => [
                ...prev,
                {
                    type: "user",
                    content: previewUrl,
                    isImage: true,
                    timestamp: new Date(),
                },
            ]);

            // Process the image with OCR
            if (selectedFile || previewUrl.startsWith("data:image")) {
                setProcessingImage(true);
                try {
                    // Create a new Image object to ensure proper loading
                    const img = new Image();
                    img.src = previewUrl;

                    // Wait for the image to load
                    await new Promise((resolve, reject) => {
                        img.onload = resolve;
                        img.onerror = reject;
                    });

                    // Process the image with OCR
                    const result = await convertor(img);

                    // Format the OCR result
                    const newResult = JSON.stringify({
                        menuItems: result,
                    });

                    // Process the menu items with genAI
                    const response = await fixMenuItems(newResult);
                    if (!response.data.success) {
                        setMessages((prev) => [
                            ...prev,
                            {
                                type: "ai",
                                content: `This image doesn't have any dishes 🙅‍♂️. Can you please check again 🥹✨`,
                                timestamp: new Date(),
                                requiresConfirmation: false,
                            },
                        ]);
                        return;
                    }

                    setOcrResults({ text: response.data.data });

                    // Add OCR result as a system message
                    setMessages((prev) => [
                        ...prev,
                        {
                            type: "system",
                            content: `I found the following items in your menu image:\n\n${response.data.data
                                .map((item) => `• ${item}`)
                                .join(
                                    "\n"
                                )}\n\nIs this correct? Don't worry if there are any unwanted characters.`,
                            timestamp: new Date(),
                            requiresConfirmation: true,
                        },
                    ]);
                } catch (error) {
                    toast.error("Failed to process image. Please try again.");
                    console.error("OCR Error:", error);
                } finally {
                    setProcessingImage(false);
                    setSubmitted(false);
                    setPreviewUrl("");
                    setSelectedFile(null);
                    if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                    }
                }
            }
        }
    };

    const handleConfirmation = async (index, isConfirmed) => {
        setMessages((prev) => {
            const newMessages = [...prev];
            const message = newMessages[index];

            if (isConfirmed) {
                // Replace the system message with the confirmed text
                newMessages[index] = {
                    ...message,
                    type: "ai",
                    content: `Great! I'll analyze these menu items for you.`,
                    requiresConfirmation: false,
                };
            } else {
                // Remove the system message and OCR results
                newMessages.splice(index, 1);
                setOcrResults(null);
            }

            return newMessages;
        });

        if (isConfirmed && ocrResults?.text) {
            setProcessingImage(true);
            try {
                // Convert array to comma-separated string
                const menuItemsString = ocrResults.text.join(", ");

                // Get food details using textToFoodItems
                const response = await textToFoodItems(menuItemsString);

                if (!response.success) {
                    setMessages((prev) => [
                        ...prev,
                        {
                            type: "ai",
                            content: `I'm sorry 🥺, I couldn't process these menu items. Please try again.`,
                            timestamp: new Date(),
                        },
                    ]);
                    return;
                }

                const menuItems = response.menuItems;

                if (menuItems.length === 0) {
                    setMessages((prev) => [
                        ...prev,
                        {
                            type: "ai",
                            content: `I'm sorry 🥺, I couldn't find any details for these menu items. Please try again.`,
                            timestamp: new Date(),
                        },
                    ]);
                    return;
                }

                if (menuItems.length > 0) {
                    setMessages((prev) => [
                        ...prev,
                        {
                            type: "ai",
                            content: `😋🧑‍🍳 These items look yummy":\n\n${menuItems
                                .map(
                                    (item) =>
                                        `🍽️ ${item.dishName}\n\n${item.description}\n`
                                )
                                .join("\n")}`,
                            timestamp: new Date(),
                        },
                    ]);
                }
            } catch (error) {
                console.error("Error processing menu items:", error);
                setMessages((prev) => [
                    ...prev,
                    {
                        type: "ai",
                        content: `I'm sorry 🥺, something went wrong while processing the menu items. Please try again.`,
                        timestamp: new Date(),
                    },
                ]);
            } finally {
                setProcessingImage(false);
                setOcrResults(null);
            }
        }
    };

    if (!mounted) {
        return null;
    }

    return (
        <main className="flex flex-col min-h-screen  transition-colors duration-200">
            {/* Header */}
            <Header theme={theme} setTheme={setTheme} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col pt-16 max-w-7xl mx-auto w-full ">
                {/* Welcome Content */}
                <WelcomeText chatStarted={chatStarted} />

                {/* Chat Messages */}
                <Chat
                    messages={messages}
                    setMessages={setMessages}
                    messagesEndRef={messagesEndRef}
                    handleConfirmation={handleConfirmation}
                    processingImage={processingImage}
                />

                {/* Input Area */}
                <InputArea
                    handleSubmit={handleSubmit}
                    handleFileChange={handleFileChange}
                    handleCapture={handleCapture}
                    handleDeleteImage={handleDeleteImage}
                    previewUrl={previewUrl}
                    processingImage={processingImage}
                    submitted={submitted}
                    fileInputRef={fileInputRef}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    setPreviewUrl={setPreviewUrl}
                    setSelectedFile={setSelectedFile}
                    setSubmitted={setSubmitted}
                    setProcessingImage={setProcessingImage}
                />
            </div>
        </main>
    );
}
