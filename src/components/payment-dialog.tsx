"use client";

import * as React from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Label } from "./ui/label";

type PurchasableItem = {
  id: string;
  title: string;
  price: number;
};

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: PurchasableItem;
  onConfirm: () => void;
}

const JAZZCASH_NUMBER = "03004760518";

export default function PaymentDialog({ open, onOpenChange, item, onConfirm }: PaymentDialogProps) {
  const { toast } = useToast();
  const [trxId, setTrxId] = React.useState("");

  const handleCopy = () => {
    navigator.clipboard.writeText(JAZZCASH_NUMBER);
    toast({
      title: "Copied!",
      description: "JazzCash number copied to clipboard.",
    });
  };
  
  const handleConfirm = () => {
      if (!trxId) {
          toast({
              variant: "destructive",
              title: "Transaction ID Required",
              description: "Please enter the transaction ID from JazzCash.",
          });
          return;
      }
      onConfirm();
      setTrxId("");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Your Purchase</DialogTitle>
          <DialogDescription>
            To get access to "{item.title}", please complete the payment via JazzCash.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-1">
             <p className="text-sm font-medium text-muted-foreground">Amount to Pay</p>
             <p className="text-2xl font-bold text-primary">{item.price} Rs</p>
          </div>
           <div className="space-y-2">
            <Label>1. Send payment to this JazzCash Account Number:</Label>
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                readOnly
                value={JAZZCASH_NUMBER}
                className="font-mono"
              />
              <Button type="button" size="icon" variant="outline" onClick={handleCopy}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="trxId">2. Enter your Transaction ID (TrxID) below:</Label>
            <Input 
                id="trxId" 
                placeholder="Enter TrxID from JazzCash message" 
                value={trxId}
                onChange={(e) => setTrxId(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <Button type="button" onClick={handleConfirm} className="w-full">
            Confirm Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
