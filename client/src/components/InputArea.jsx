import React, { useRef } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Camera, Send, Upload } from "lucide-react";

export default function InputArea({
    handleSubmit,
    handleFileChange,
    handleCapture,
    handleDeleteImage,
    previewUrl,
    processingImage,
    submitted,
    fileInputRef,
    inputValue,
    setInputValue,
    cameraInputRef,
    handleCameraCapture,
    setPreviewUrl,
    setSelectedFile,
    setSubmitted,
    setProcessingImage,
}) {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-black border-t dark:border-gray-900 p-4 transition-all duration-300  ">
            <form
                onSubmit={handleSubmit}
                className="space-y-4 max-w-7xl mx-auto"
            >
                {/* Image Preview */}
                {previewUrl && !submitted && (
                    <div className="relative w-[200px] h-[150px] mx-auto animate-fade-in">
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-full object-cover rounded-lg transition-transform duration-300 hover:scale-105"
                        />
                        <Button
                            onClick={handleDeleteImage}
                            className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 hover:bg-red-600 text-white transition-transform duration-300 hover:scale-110"
                            size="icon"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                )}

                {/* Hidden Inputs */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                />
                <input
                    type="file"
                    ref={cameraInputRef}
                    onChange={handleCameraCapture}
                    className="hidden"
                    accept="image/*"
                    capture="environment"
                />

                {/* Input and Buttons */}
                <div className="flex gap-2">
                    <Button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                        size="icon"
                        className="flex-shrink-0 cursor-pointer h-12 w-12 transition-transform duration-300 hover:scale-110"
                        disabled={processingImage}
                    >
                        <Upload className="h-6 w-6" />
                    </Button>
                    <Button
                        type="button"
                        onClick={handleCapture}
                        variant="outline"
                        size="icon"
                        className="flex-shrink-0 cursor-pointer h-12 w-12 transition-transform duration-300 hover:scale-110"
                        disabled={processingImage}
                    >
                        <Camera className="h-6 w-6" />
                    </Button>
                    <Input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 h-12 transition-all duration-300 focus:scale-[1.001]"
                        disabled={processingImage}
                    />
                    <Button
                        type="submit"
                        size="icon"
                        className="flex-shrink-0 cursor-pointer h-12 w-12 transition-transform duration-300 hover:scale-110"
                        disabled={processingImage}
                    >
                        {processingImage ? (
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        ) : (
                            <Send className="h-6 w-6" />
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
