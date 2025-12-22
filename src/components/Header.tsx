
'use client';

import Link from 'next/link';
import { Menu, Heart, ChevronDown, Plus, Minus } from 'lucide-react';
import { useState } from 'react';

import { categories } from '@/lib/data';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TranslatedText } from './TranslatedText';
import { SearchDialog } from './search/SearchDialog';
import { Separator } from './ui/separator';
import { LanguageSwitcher } from './LanguageSwitcher';
import { CartButton } from './cart/CartButton';
import { UserButton } from './auth/UserButton';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set());

  const handleLinkClick = () => {
    setIsSheetOpen(false);
  };

  const toggleCategory = (categoryId: string) => {
    setOpenCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handleFooterActionClick = () => {
    // We want the dropdowns inside to open, but not immediately close the sheet.
    // The sheet should close when an item *inside* the dropdown is selected.
    // For now, let's assume clicking the trigger should close it.
    // A better UX might be to pass the `setIsSheetOpen` to the components themselves.
  };


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center">
        <div className="flex flex-1 items-center justify-start">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">
                  <TranslatedText fr="Ouvrir le menu" en="Toggle menu">
                    Menü umschalten
                  </TranslatedText>
                </span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="flex w-[300px] flex-col bg-background p-0 sm:w-[350px]"
            >
              {/* Visually hidden title for accessibility */}
              <SheetTitle className="sr-only">
                <TranslatedText fr="Menu de navigation" en="Navigation menu">Navigationsmenü</TranslatedText>
              </SheetTitle>
              <header className="border-b p-6">
                <Link
                  href="/"
                  className="flex items-center space-x-2"
                  onClick={handleLinkClick}
                >
                  <span className="font-bold font-headline text-2xl">
                    EZCENTIALS
                  </span>
                </Link>
              </header>
              <main className="flex-grow overflow-y-auto p-6">
                <nav>
                  <ul className="flex flex-col space-y-3">
                    {[...categories].sort((a, b) => {
                      const aHasSub = a.subcategories && a.subcategories.length > 0;
                      const bHasSub = b.subcategories && b.subcategories.length > 0;
                      if (aHasSub && !bHasSub) return -1;
                      if (!aHasSub && bHasSub) return 1;
                      return 0;
                    }).map((category) => {
                      const hasSubcategories = category.subcategories && category.subcategories.length > 0;
                      const isOpen = openCategories.has(category.id);
                      
                      return (
                        <li key={category.id} className="space-y-0">
                          <div className="flex items-center justify-between group">
                            <Link
                              href={`/products/${category.slug}`}
                              className="text-lg font-semibold text-foreground/90 transition-all hover:text-foreground hover:translate-x-1 flex-1 py-2"
                              onClick={handleLinkClick}
                              prefetch={true}
                            >
                              <TranslatedText
                                fr={category.name_fr}
                                en={category.name_en}
                              >
                                {category.name}
                              </TranslatedText>
                            </Link>
                            {hasSubcategories && (
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  toggleCategory(category.id);
                                }}
                                className="ml-2 p-1.5 rounded-md transition-all duration-200 hover:bg-accent/50 active:scale-95 flex items-center justify-center group/btn"
                                aria-label={isOpen ? "Fermer" : "Ouvrir"}
                                aria-expanded={isOpen}
                              >
                                {isOpen ? (
                                  <Minus className="h-4 w-4 text-foreground/70 group-hover/btn:text-foreground transition-colors" />
                                ) : (
                                  <Plus className="h-4 w-4 text-foreground/70 group-hover/btn:text-foreground transition-colors" />
                                )}
                              </button>
                            )}
                          </div>
                          {hasSubcategories && isOpen && (
                            <ul className="ml-2 mt-1 mb-2 flex flex-col space-y-0.5 border-l-2 border-primary/30 pl-4 animate-in slide-in-from-top-1 duration-200">
                              {category.subcategories.map((subcategory) => (
                                <li key={subcategory.id}>
                                  <Link
                                    href={`/products/${category.slug}/${subcategory.slug}`}
                                    className="text-sm text-foreground/70 transition-all hover:text-foreground hover:translate-x-1 hover:font-medium block py-2 px-2 rounded-md hover:bg-accent/30"
                                    onClick={handleLinkClick}
                                    prefetch={true}
                                  >
                                    <TranslatedText
                                      fr={subcategory.name_fr}
                                      en={subcategory.name_en}
                                    >
                                      {subcategory.name}
                                    </TranslatedText>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </main>
              <footer className="border-t p-6">
                <div className="flex items-center justify-between gap-4" onClick={() => setIsSheetOpen(false)}>
                   <UserButton />
                   <LanguageSwitcher />
                   <ThemeToggle />
                </div>
              </footer>
            </SheetContent>
          </Sheet>

          <div className="hidden lg:flex lg:items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold font-headline text-2xl tracking-wider">
                EZCENTIALS
              </span>
            </Link>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center lg:hidden">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold font-headline text-2xl tracking-wider">
              EZCENTIALS
            </span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-1 md:space-x-2 shrink-0 flex-nowrap">
          <nav className="hidden lg:flex lg:items-center lg:space-x-1 text-sm font-medium">
            {[...categories].sort((a, b) => {
              const aHasSub = a.subcategories && a.subcategories.length > 0;
              const bHasSub = b.subcategories && b.subcategories.length > 0;
              if (aHasSub && !bHasSub) return -1;
              if (!aHasSub && bHasSub) return 1;
              return 0;
            }).map((category) => {
              const hasSubcategories = category.subcategories && category.subcategories.length > 0;
              
              if (hasSubcategories) {
                return (
                  <DropdownMenu key={category.id}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-auto px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-accent/50 data-[state=open]:text-foreground data-[state=open]:bg-accent group"
                      >
                        <TranslatedText fr={category.name_fr} en={category.name_en}>
                          {category.name}
                        </TranslatedText>
                        <ChevronDown className="ml-1 h-3.5 w-3.5 opacity-70 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      className="w-56 rounded-lg border bg-popover/95 backdrop-blur-sm shadow-lg"
                    >
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/products/${category.slug}`}
                          className="font-semibold text-foreground cursor-pointer"
                          prefetch={true}
                        >
                          <TranslatedText fr="Tout voir" en="View All">
                            Alle anzeigen
                          </TranslatedText>
                        </Link>
                      </DropdownMenuItem>
                      <Separator className="my-1" />
                      {category.subcategories.map((subcategory) => (
                        <DropdownMenuItem key={subcategory.id} asChild>
                          <Link
                            href={`/products/${category.slug}/${subcategory.slug}`}
                            className="cursor-pointer text-foreground/80 hover:text-foreground"
                            prefetch={true}
                          >
                            <TranslatedText
                              fr={subcategory.name_fr}
                              en={subcategory.name_en}
                            >
                              {subcategory.name}
                            </TranslatedText>
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }
              
              return (
                <Link
                  key={category.id}
                  href={`/products/${category.slug}`}
                  className="px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground hover:bg-accent/50 rounded-md"
                  prefetch={true}
                >
                  <TranslatedText fr={category.name_fr} en={category.name_en}>
                    {category.name}
                  </TranslatedText>
                </Link>
              );
            })}
          </nav>
          <div className="hidden lg:flex items-center">
            <Separator orientation="vertical" className="h-6 mx-2" />
            <LanguageSwitcher />
            <Separator orientation="vertical" className="h-6 mx-2" />
            <ThemeToggle />
          </div>
          
          <SearchDialog />
           <Button variant="ghost" size="icon" asChild>
            <Link href="/favorites">
                <Heart className="h-5 w-5" />
                <span className="sr-only">
                    <TranslatedText fr="Favoris" en="Favorites">
                        Favoriten
                    </TranslatedText>
                </span>
            </Link>
          </Button>
          <div className="hidden md:flex">
             <UserButton />
          </div>
          <CartButton />
        </div>
      </div>
    </header>
  );
}
