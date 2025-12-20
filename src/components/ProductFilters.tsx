'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { X, Filter } from 'lucide-react';
import { TranslatedText } from './TranslatedText';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import type { Product } from '@/lib/types';

type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'newest';

interface ProductFiltersProps {
  products: Product[];
  filteredProducts: Product[];
  onFilterChange: (filters: FilterState) => void;
  onSortChange: (sort: SortOption) => void;
  currentSort: SortOption;
  language: string;
}

interface FilterState {
  priceRange: [number, number];
  selectedSizes: string[];
  selectedColors: string[];
}

export function ProductFilters({
  products,
  filteredProducts,
  onFilterChange,
  onSortChange,
  currentSort,
  language,
}: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 1000],
    selectedSizes: [],
    selectedColors: [],
  });

  // Get unique sizes and colors from products
  const allSizes = useMemo(() => {
    const sizes = new Set<string>();
    products.forEach(p => p.sizes?.forEach(s => sizes.add(s)));
    return Array.from(sizes).sort();
  }, [products]);

  const allColors = useMemo(() => {
    const colors = new Set<string>();
    products.forEach(p => {
      p.colors?.forEach(c => {
        const colorName = language === 'fr' ? c.name_fr : language === 'en' ? c.name_en : c.name_de;
        colors.add(colorName);
      });
    });
    return Array.from(colors).sort();
  }, [products, language]);

  const minPrice = 0;
  const maxPrice = Math.max(...products.map(p => p.price), 1000);

  const handlePriceChange = (values: number[]) => {
    const newFilters = { ...filters, priceRange: [values[0], values[1]] as [number, number] };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSizeToggle = (size: string) => {
    const newSizes = filters.selectedSizes.includes(size)
      ? filters.selectedSizes.filter(s => s !== size)
      : [...filters.selectedSizes, size];
    const newFilters = { ...filters, selectedSizes: newSizes };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleColorToggle = (color: string) => {
    const newColors = filters.selectedColors.includes(color)
      ? filters.selectedColors.filter(c => c !== color)
      : [...filters.selectedColors, color];
    const newFilters = { ...filters, selectedColors: newColors };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const newFilters: FilterState = {
      priceRange: [minPrice, maxPrice],
      selectedSizes: [],
      selectedColors: [],
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const hasActiveFilters = filters.selectedSizes.length > 0 || 
                           filters.selectedColors.length > 0 || 
                           filters.priceRange[0] > minPrice || 
                           filters.priceRange[1] < maxPrice;

  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              <TranslatedText fr="Filtres" en="Filters">Filter</TranslatedText>
              {hasActiveFilters && (
                <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  {filters.selectedSizes.length + filters.selectedColors.length + 
                   (filters.priceRange[0] > minPrice || filters.priceRange[1] < maxPrice ? 1 : 0)}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>
                <TranslatedText fr="Filtres" en="Filters">Filter</TranslatedText>
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              {/* Price Range */}
              <div>
                <Label className="mb-4 block">
                  <TranslatedText fr="Prix" en="Price">Preis</TranslatedText>
                </Label>
                <Slider
                  value={filters.priceRange}
                  onValueChange={handlePriceChange}
                  min={minPrice}
                  max={maxPrice}
                  step={10}
                  className="w-full"
                />
                <div className="mt-2 flex justify-between text-sm text-muted-foreground">
                  <span>€{filters.priceRange[0]}</span>
                  <span>€{filters.priceRange[1]}</span>
                </div>
              </div>

              {/* Sizes */}
              {allSizes.length > 0 && (
                <div>
                  <Label className="mb-3 block">
                    <TranslatedText fr="Tailles" en="Sizes">Größen</TranslatedText>
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {allSizes.map(size => (
                      <div key={size} className="flex items-center space-x-2">
                        <Checkbox
                          id={`size-${size}`}
                          checked={filters.selectedSizes.includes(size)}
                          onCheckedChange={() => handleSizeToggle(size)}
                        />
                        <Label
                          htmlFor={`size-${size}`}
                          className="cursor-pointer text-sm font-normal"
                        >
                          {size}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors */}
              {allColors.length > 0 && (
                <div>
                  <Label className="mb-3 block">
                    <TranslatedText fr="Couleurs" en="Colors">Farben</TranslatedText>
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {allColors.map(color => (
                      <div key={color} className="flex items-center space-x-2">
                        <Checkbox
                          id={`color-${color}`}
                          checked={filters.selectedColors.includes(color)}
                          onCheckedChange={() => handleColorToggle(color)}
                        />
                        <Label
                          htmlFor={`color-${color}`}
                          className="cursor-pointer text-sm font-normal"
                        >
                          {color}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters} className="w-full">
                  <X className="mr-2 h-4 w-4" />
                  <TranslatedText fr="Effacer les filtres" en="Clear filters">Filter zurücksetzen</TranslatedText>
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>

        <p className="text-sm text-muted-foreground">
          <TranslatedText 
            fr={`${filteredProducts.length} produit${filteredProducts.length > 1 ? 's' : ''}`}
            en={`${filteredProducts.length} product${filteredProducts.length > 1 ? 's' : ''}`}
          >
            {`${filteredProducts.length} Produkt${filteredProducts.length > 1 ? 'e' : ''}`}
          </TranslatedText>
        </p>
      </div>

      {/* Sort */}
      <Select value={currentSort} onValueChange={(value) => onSortChange(value as SortOption)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={
            language === 'fr' ? 'Trier par' : language === 'en' ? 'Sort by' : 'Sortieren nach'
          } />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name-asc">
            <TranslatedText fr="Nom (A-Z)" en="Name (A-Z)">Name (A-Z)</TranslatedText>
          </SelectItem>
          <SelectItem value="name-desc">
            <TranslatedText fr="Nom (Z-A)" en="Name (Z-A)">Name (Z-A)</TranslatedText>
          </SelectItem>
          <SelectItem value="price-asc">
            <TranslatedText fr="Prix (croissant)" en="Price (low to high)">Preis (aufsteigend)</TranslatedText>
          </SelectItem>
          <SelectItem value="price-desc">
            <TranslatedText fr="Prix (décroissant)" en="Price (high to low)">Preis (absteigend)</TranslatedText>
          </SelectItem>
          <SelectItem value="newest">
            <TranslatedText fr="Plus récent" en="Newest">Neueste</TranslatedText>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}


