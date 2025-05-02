import React from "react";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ModeToggle";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Github, Linkedin, Twitter, Instagram } from "lucide-react";

export default function Header({ theme, setTheme }) {
    return (
        <header className="fixed top-0 left-0 right-0 z-50  bg-white dark:bg-black border-b dark:border-gray-900">
            <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold">Menu Helper</h1>
                    <ModeToggle theme={theme} setTheme={setTheme} />
                </div>
                <div className="flex items-center gap-4">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="link" className="text-sm">
                                ©2025 adwaithpj
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>About Me</DialogTitle>
                                <DialogDescription>
                                    <div className="space-y-4">
                                        <div>
                                            Hi everyone, I'm Adwaith. I
                                            developed this application to solve
                                            a real world problem I faced. Try it
                                            out!
                                        </div>
                                        <section>
                                            <div className="text-sm text-muted-foreground mb-2">
                                                Connect with me:
                                            </div>
                                            <div className="flex gap-4 justify-center">
                                                <a
                                                    href="https://github.com/adwaithpj"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="hover:text-primary transition-colors"
                                                >
                                                    <Github className="h-5 w-5" />
                                                </a>
                                                <a
                                                    href="https://www.linkedin.com/in/adwaith-pj/"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="hover:text-primary transition-colors"
                                                >
                                                    <Linkedin className="h-5 w-5" />
                                                </a>
                                                <a
                                                    href="https://x.com/AdwaithPj"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="hover:text-primary transition-colors"
                                                >
                                                    <Twitter className="h-5 w-5" />
                                                </a>
                                                <a
                                                    href="https://www.instagram.com/_.adwaith_pj._/"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="hover:text-primary transition-colors"
                                                >
                                                    <Instagram className="h-5 w-5" />
                                                </a>
                                            </div>
                                        </section>
                                        <div className="text-xs text-muted-foreground">
                                            © 2025 Adwaith. All rights reserved.
                                        </div>
                                    </div>
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </header>
    );
}
