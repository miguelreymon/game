'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { getImage } from '@/lib/images';
import { Minus, Plus, Trash2, Gift, ShoppingBag, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

export function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
  } = useCart();
  const [isClient, setIsClient] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        setIsCartOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  
  const mainCartItems = cartItems.filter(item => !item.isUpsell);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setIsCartOpen(false);
    router.push('/checkout');
    setTimeout(() => setIsCheckingOut(false), 500);
  };

  if (!isClient) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/60 z-[9998] transition-opacity duration-300",
          isCartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />

      {/* Slide-out Drawer Panel */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-[9999] flex w-full max-w-lg flex-col bg-background shadow-2xl transition-transform duration-300 ease-in-out border-l",
          isCartOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Tu Carrito"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold font-headline text-foreground">Tu Carrito</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-sm opacity-70 hover:opacity-100"
            onClick={() => setIsCartOpen(false)}
            aria-label="Cerrar carrito"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        {cartItems.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-base">Tu carrito está vacío.</p>
            <Button
              className="bg-black text-white hover:bg-black/90 font-bold"
              onClick={() => setIsCartOpen(false)}
            >
              Continuar comprando
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-start space-x-4 border-b pb-4 last:border-b-0">
                  <div className="relative w-20 h-20 flex-shrink-0 bg-muted rounded-md overflow-hidden">
                    <Image
                      src={getImage(item.image)}
                      alt={item.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm line-clamp-2 text-foreground">{item.name}</p>
                    {item.color && (
                      <Badge variant={item.isUpsell ? 'default' : 'secondary'} className={cn('mt-1', item.isUpsell ? 'bg-green-600 text-white' : '')}>
                        {item.isUpsell && <Gift className="mr-1 h-3 w-3" />}
                        {item.color}
                      </Badge>
                    )}
                    <p className="text-base font-bold text-accent mt-1">
                      {item.price > 0 ? `${item.price.toFixed(0)}€` : 'GRATIS'}
                    </p>
                    {!item.isUpsell && (
                      <div className="flex items-center space-x-3 mt-2">
                        <div className="flex items-center border rounded-md">
                          <button
                            type="button"
                            className="h-7 w-7 flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-50"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            aria-label="Disminuir cantidad"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                          <button
                            type="button"
                            className="h-7 w-7 flex items-center justify-center hover:bg-muted transition-colors"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label="Aumentar cantidad"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <button
                          type="button"
                          className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Eliminar</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-6 bg-muted/40 border-t space-y-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Subtotal</span>
                <span className="text-accent text-xl">{subtotal.toFixed(0)}€</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Envío gratuito e impuestos incluidos calculados en el checkout.
              </p>
              <Button
                className="w-full h-12 text-base font-bold bg-black text-white hover:bg-black/90 uppercase tracking-wide shadow-md"
                onClick={handleCheckout}
                disabled={isCheckingOut || mainCartItems.length === 0}
              >
                {isCheckingOut ? 'Cargando checkout...' : 'Finalizar Compra'}
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
