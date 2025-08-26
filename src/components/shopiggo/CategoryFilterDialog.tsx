
'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { categories } from '@/lib/data';

export interface CategoryFilterDialogProps {
  children?: React.ReactNode;
  selectedCategories: string[];
  onCategoryChange: (category: string) => void;
  onSelectAllCategories: () => void;
  onClearAllCategories: () => void;
}

export function CategoryFilterDialog({
  children,
  selectedCategories,
  onCategoryChange,
  onSelectAllCategories,
  onClearAllCategories,
}: CategoryFilterDialogProps) {
  const [categorySearch, setCategorySearch] = React.useState('');
  const [showOnlySelected, setShowOnlySelected] = React.useState(false);

  const filteredCategories = categories
    .filter((category) => category.toLowerCase().includes(categorySearch.toLowerCase()))
    .filter((category) => !showOnlySelected || selectedCategories.includes(category));

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Filter by Category</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 flex-grow min-h-0">
          <Input
            placeholder="Search categories..."
            value={categorySearch}
            onChange={(e) => setCategorySearch(e.target.value)}
          />
          <div className="flex justify-between items-center text-sm">
            <div className="flex gap-2">
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={onSelectAllCategories}
              >
                Select All
              </Button>
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={onClearAllCategories}
              >
                Deselect All
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="show-selected-categories"
                checked={showOnlySelected}
                onCheckedChange={(checked) => setShowOnlySelected(Boolean(checked))}
              />
              <Label htmlFor="show-selected-categories" className="font-normal">
                Show selected only ({selectedCategories.length})
              </Label>
            </div>
          </div>
          <ScrollArea className="flex-grow border rounded-md p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredCategories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => onCategoryChange(category)}
                  />
                  <Label
                    htmlFor={`category-${category}`}
                    className="font-normal cursor-pointer"
                  >
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
