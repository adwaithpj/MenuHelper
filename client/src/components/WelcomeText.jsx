import React from 'react'

import { Utensils, ChefHat, Menu } from "lucide-react";

export default function WelcomeText({ chatStarted }) {
  return (
    <div>
        {!chatStarted ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6 mt-20 animate-fade-in">
            <div className="flex items-center justify-center space-x-2 animate-bounce-slow">
                <Utensils className="h-8 w-8 text-blue-500" />
                <ChefHat className="h-8 w-8 text-green-500" />
                <Menu className="h-8 w-8 text-purple-500" />
            </div>

            <div className="max-w-2xl space-y-4">
                <h1 className="text-4xl font-bold text-black dark:text-white animate-slide-up">
                    Welcome to Menu Helper 🍽️
                </h1>

                <p className="text-xl text-gray-600 dark:text-gray-300 animate-slide-up delay-100">
                    Your AI-powered restaurant menu assistant 🤖
                </p>

                <div className="flex flex-col items-center space-y-2 text-gray-500 dark:text-gray-400 animate-slide-up delay-200">
                    <p className="flex items-center hover:scale-105 transition-transform duration-300">
                        <span className="mr-2">📸</span> Upload menu
                        images
                    </p>
                    <p className="flex items-center hover:scale-105 transition-transform duration-300">
                        <span className="mr-2">📝</span> Get instant
                        menu analysis
                    </p>
                    <p className="flex items-center hover:scale-105 transition-transform duration-300">
                        <span className="mr-2">💡</span> Receive smart
                        suggestions
                    </p>
                </div>
            </div>
        </div>
    ) : null}
    </div>
  )
}
