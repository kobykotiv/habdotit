"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const Settings = () => {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="paypal">PayPal Donation Link</Label>
            <Input id="paypal" name="paypal" value="https://paypal.me/XXXXXXXX" readOnly />
          </div>
          <div>
            <Label htmlFor="bitcoin">Bitcoin Wallet Address</Label>
            <Input id="bitcoin" name="bitcoin" value="XXXXXXXX" readOnly />
          </div>
          <div>
            <Label htmlFor="litecoin">Litecoin Wallet Address</Label>
            <Input id="litecoin" name="litecoin" value="XXXXXXXX" readOnly />
          </div>
          <div>
            <Label htmlFor="dogecoin">Dogecoin Wallet Address</Label>
            <Input id="dogecoin" name="dogecoin" value="XXXXXXXX" readOnly />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Settings
