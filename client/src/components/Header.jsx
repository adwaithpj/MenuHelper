import React from 'react'

import { Button } from "@/components/ui/button"

export default function Header({ theme, setTheme }) {
  return (
    <div>
        <div className="fixed top-0 left-0 right-0 z-10 bg-white dark:bg-black border-b dark:border-gray-800 p-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Menu Helper</h1>
                <Button
                    onClick={() =>
                        setTheme(theme === "dark" ? "light" : "dark")
                    }
                    variant="ghost"
                    size="icon"
                >
                    {theme === "dark" ? "🌞" : "🌙"}
                </Button>
            </div>
    </div>
  )
}
