import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function DialogTest() {
  const [isOpen, setIsOpen] = useState(false);
  const [testValue, setTestValue] = useState("");

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-semibold">Dialog Functionality Test</h3>
      
      {/* Test 1: Trigger-based Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Open Trigger Dialog</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Trigger Dialog Test</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="trigger-input">Test Input</Label>
              <Input id="trigger-input" placeholder="Type something..." />
            </div>
            <Button className="w-full">Save</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Test 2: State-controlled Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <Button onClick={() => setIsOpen(true)}>Open State Dialog</Button>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>State Dialog Test</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="state-input">Test Input</Label>
              <Input 
                id="state-input" 
                value={testValue}
                onChange={(e) => setTestValue(e.target.value)}
                placeholder="Type something..." 
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                console.log('Dialog value:', testValue);
                setIsOpen(false);
              }}>
                Save & Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="text-sm text-gray-600">
        Current test value: {testValue || "None"}
      </div>
    </div>
  );
}