'use client';

import Link from 'next/link';
import { Button } from './ui/button';
import { X } from 'lucide-react';
import { Separator } from './ui/separator';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  navLinks: { href: string; text: string }[];
}

export function MobileMenu({ isOpen, setIsOpen, navLinks }: MobileMenuProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setIsOpen]);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 bg-black/60 z-[9998] transition-opacity duration-300 md:hidden",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-[9999] flex w-full max-w-xs flex-col bg-background shadow-2xl transition-transform duration-300 ease-in-out border-r md:hidden p-6",
          isOpen ? "translate-x-0" : "-translate-x-full pointer-events-none"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Menú principal"
      >
        <div className="flex flex-row justify-between items-center mb-4">
          <h2 className="text-2xl font-bold font-headline">Menú</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            aria-label="Cerrar"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        <Separator />
        <div className="flex-1 flex flex-col justify-between mt-4">
          <nav className="flex flex-col space-y-2 text-lg font-medium">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="p-2 rounded-md hover:bg-secondary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.text}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
