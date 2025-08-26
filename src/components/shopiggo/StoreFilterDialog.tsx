
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
import { retailers } from '@/lib/data';

export interface StoreFilterDialogProps {
  children?: React.ReactNode;
  selectedStores: string[];
  onStoreChange: (store: string) => void;
  onSelectAllStores: () => void;
  onClearAllStores: () => void;
}

export function StoreFilterDialog({
  children,
  selectedStores,
  onStoreChange,
  onSelectAllStores,
  onClearAllStores,
}: StoreFilterDialogProps) {
  const [storeSearch, setStoreSearch] = React.useState('');
  const [showOnlySelected, setShowOnlySelected] = React.useState(false);

  const filteredStores = retailers
    .filter((store) => store.toLowerCase().includes(storeSearch.toLowerCase()))
    .filter((store) => !showOnlySelected || selectedStores.includes(store));

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Filter by Store</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 flex-grow min-h-0">
          <Input
            placeholder="Search stores..."
            value={storeSearch}
            onChange={(e) => setStoreSearch(e.target.value)}
          />
          <div className="flex justify-between items-center text-sm">
            <div className="flex gap-2">
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={onSelectAllStores}
              >
                Select All
              </Button>
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={onClearAllStores}
              >
                Deselect All
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="show-selected-stores"
                checked={showOnlySelected}
                onCheckedChange={(checked) => setShowOnlySelected(Boolean(checked))}
              />
              <Label htmlFor="show-selected-stores" className="font-normal">
                Show selected only ({selectedStores.length})
              </Label>
            </div>
          </div>
          <ScrollArea className="flex-grow border rounded-md p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredStores.map((store) => (
                <div key={store} className="flex items-center space-x-2">
                  <Checkbox
                    id={`store-${store}`}
                    checked={selectedStores.includes(store)}
                    onCheckedChange={() => onStoreChange(store)}
                  />
                  <Label
                    htmlFor={`store-${store}`}
                    className="font-normal cursor-pointer"
                  >
                    {store}
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
