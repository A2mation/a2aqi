'use client'

import { useState } from 'react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sidebar } from '@/components/users-ui/dashboard/Sidebar'
import { cn } from '@/lib/utils'
import { Header } from '@/components/users-ui/dashboard/Header'

const ProfilePage = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  return (
    <>
      <section>
        <div className="flex min-h-screen bg-background">
          <div className="hidden lg:block">
            <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
          </div>
          <div
            className={cn(
              "flex-1 p-4 md:p-5 lg:p-6 transition-all duration-300 px-4",
              isCollapsed ? "lg:ml-16" : "lg:ml-60",
            )}
          >

            <Header
              title="Profile Settings"
              description="Update your profile information and manage your account settings."

            />
            <div className="mt-4 md:mt-5 space-y-4 px-2">

              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  {/* <AvatarImage src="/profile.jpg" alt="Jessin Sam" /> */}
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline">Change Photo</Button>
                  <p className="text-xs text-muted-foreground mt-2">JPEG and PNG. Max size 2MB</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue="Jessin Sam" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="jessin@gmail.com" />
                </div>
              </div>

              <Button className="bg-primary hover:bg-primary/90">Save Changes</Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default ProfilePage
