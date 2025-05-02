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
import { fixMenuItems } from "@/utils/genAI";

export default function Home() {
    const [mounted, setMounted] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [isMobile, setIsMobile] = useState(false);
    const [messages, setMessages] = useState([]);
    const [chatStarted, setChatStarted] = useState(false);
    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);
    const { theme, setTheme } = useTheme();
    const [processingImage, setProcessingImage] = useState(false);
    const [ocrResults, setOcrResults] = useState(null);
    const [submitted, setSubmitted] = useState(false);

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
            if (
                !navigator.mediaDevices ||
                !navigator.mediaDevices.getUserMedia
            ) {
                toast.error(
                    "Camera access is not supported in this browser or requires a secure context (HTTPS)"
                );
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
            video.play();

            video.onloadedmetadata = () => {
                const canvas = document.createElement("canvas");
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                canvas.getContext("2d").drawImage(video, 0, 0);
                const imageUrl = canvas.toDataURL("image/jpeg");
                setPreviewUrl(imageUrl);
                stream.getTracks().forEach((track) => track.stop());
                toast.success("Image captured successfully!");
            };
        } catch (err) {
            console.error("Camera error:", err);
            if (isMobile) {
                toast.error(
                    "Camera access is not available. Please use the file upload option instead."
                );
            } else {
                toast.error(
                    "Error accessing camera. Please check your browser permissions."
                );
            }
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
            setMessages((prev) => [
                ...prev,
                { type: "user", content: inputValue, timestamp: new Date() },
            ]);
            setInputValue("");
            setSubmitted(false);
        }

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
            if (selectedFile) {
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

                    console.log("this is the result of the ocr", result);

                    // Format the OCR result
                    const newResult = JSON.stringify({
                        menuItems: result,
                    });

                    console.log("this is the new result", newResult);

                    // Process the menu items with genAI
                    const response = await fixMenuItems(newResult);
                    setOcrResults({ text: response });

                    // Add OCR result as a system message
                    setMessages((prev) => [
                        ...prev,
                        {
                            type: "system",
                            content: `I found the following text in your menu image:\n\n${response}\n\nIs this correct? Don't worry if there is unwanted characters.`,
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

    const handleConfirmation = (index, isConfirmed) => {
        setMessages((prev) => {
            const newMessages = [...prev];
            const message = newMessages[index];

            if (isConfirmed) {
                // Replace the system message with the confirmed text
                newMessages[index] = {
                    ...message,
                    type: "ai",
                    content: `Based on the menu image, here are the items:\n\n${ocrResults.text}`,
                    requiresConfirmation: false,
                };
            } else {
                // Remove the system message and OCR results
                newMessages.splice(index, 1);
                setOcrResults(null);
            }

            return newMessages;
        });
    };

    if (!mounted) {
        return null;
    }

    return (
        <main className="flex flex-col h-screen dark:bg-black transition-colors duration-200">
            {/* Header */}
            <Header theme={theme} setTheme={setTheme} />
            {/* Welcome Content */}
            <WelcomeText chatStarted={chatStarted} />

            {/* Chat Messages */}
            <Chat
                messages={messages}
                setMessages={setMessages}
                messagesEndRef={messagesEndRef}
                handleConfirmation={handleConfirmation}
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
        </main>
    );
}
