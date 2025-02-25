"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { ChangeEvent } from "react"
import { Label } from "@/components/ui/label"
import { Save } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Cookies from "js-cookie"

const Profile = () => {
  const [profile, setProfile] = useState({
    nickname: "",
    color1: "#ff0000",
    color2: "#00ff00",
    color3: "#0000ff",
  })
  const { toast } = useToast()

  useEffect(() => {
    const savedProfile = Cookies.get("profile")
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile))
    }
  }, [])

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  const saveProfile = () => {
    Cookies.set("profile", JSON.stringify(profile), { expires: 365 })
    toast({
      title: "Profile saved! 🎉",
      description: "Your profile has been updated.",
    })
  }

  const exportData = () => {
    const habits = Cookies.get("habits")
    const dataToExport = {
      profile,
      habits: habits ? JSON.parse(habits) : [],
    }
    const dataStr = JSON.stringify(dataToExport, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const exportFileDefaultName = "habit-tracker-data.json"

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()

    toast({
      title: "Data exported! 📤",
      description: "Your profile and habits data has been saved as a JSON file.",
    })
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Customize your profile and export your data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="nickname">Nickname</Label>
            <Input
              id="nickname"
              name="nickname"
              value={profile.nickname}
              onChange={handleChange}
              placeholder="Enter your nickname"
            />
          </div>
          <div>
            <Label htmlFor="color1">Favorite Color 1</Label>
            <Input id="color1" name="color1" type="color" value={profile.color1} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="color2">Favorite Color 2</Label>
            <Input id="color2" name="color2" type="color" value={profile.color2} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="color3">Favorite Color 3</Label>
            <Input id="color3" name="color3" type="color" value={profile.color3} onChange={handleChange} />
          </div>
          <Button onClick={saveProfile}>Save Profile</Button>
          <Button onClick={exportData} variant="outline" className="w-full mt-4">
            <Save className="w-4 h-4 mr-2" />
            Export All Data
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default Profile

