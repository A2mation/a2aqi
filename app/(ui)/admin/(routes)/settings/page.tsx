"use client";

import React, { useState } from 'react';
import {
    User, Bell, Shield, Database, Save, Lock,
    Key, Cloud, Eye, Languages, HardDrive,
    History, Share2, Palette,
    Mail
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/Heading";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminSettingsPage = () => {
    const [activeTab, setActiveTab] = useState('general');

    const tabs = [
        { id: 'general', label: 'General', icon: User, desc: "Profile and basic info" },
        { id: 'appearance', label: 'Appearance', icon: Palette, desc: "Themes and branding" },
        { id: 'security', label: 'Security', icon: Shield, desc: "Auth and privacy" },
        { id: 'api', label: 'API & Integration', icon: Key, desc: "External keys and webhooks" },
        { id: 'notifications', label: 'Notifications', icon: Bell, desc: "Alerts and emails" },
        { id: 'localization', label: 'Localization', icon: Languages, desc: "Region and language" },
        { id: 'backup', label: 'Backups', icon: HardDrive, desc: "Data exports and snapshots" },
        { id: 'audit', label: 'Audit Logs', icon: History, desc: "Activity tracking" },
    ];

    return (
        <div className="flex-col h-screen ">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <Heading title="System Settings" description="Configure global system parameters and administrative preferences." />
                <Separator />

                <div className="flex flex-col lg:flex-row gap-x-12">
                    {/* Sidebar Navigation */}
                    <aside className="lg:w-64 flex-shrink-0">
                        <nav className="flex lg:flex-col overflow-x-auto pb-4 lg:pb-0 gap-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-x-3 px-3 py-2.5 text-base font-medium rounded-lg transition-all whitespace-nowrap ${activeTab === tab.id
                                        ? "bg-primary text-primary-foreground shadow-sm"
                                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                        }`}
                                >
                                    <tab.icon className="h-4 w-4" />
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </aside>

                    {/* Content Area */}
                    <div className="flex-1 lg:max-w-3xl py-1">

                        {/* General Tab */}
                        {activeTab === 'general' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-1">
                                <div>
                                    <h3 className="text-xl font-medium">General Settings</h3>
                                    <p className="text-sm text-muted-foreground">Global identity of the administration panel.</p>
                                </div>
                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label>Organization Name</Label>
                                        <Input defaultValue="Acme Device Corp" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Admin Support Contact</Label>
                                        <Input defaultValue="support@acme.com" />
                                    </div>
                                </div>
                                <Button className="gap-2"><Save className="h-4 w-4" /> Save General Info</Button>
                            </div>
                        )}

                        {/* Appearance Tab */}
                        {activeTab === 'appearance' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-1">
                                <div>
                                    <h3 className="text-xl font-medium">Appearance</h3>
                                    <p className="text-sm text-muted-foreground">Customize how the dashboard looks for admins.</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 border rounded-lg">
                                        <Label>Dark Mode (System Default)</Label>
                                        <Switch defaultChecked />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Primary Brand Color</Label>
                                        <div className="flex gap-2">
                                            <div className="h-8 w-8 rounded-full bg-blue-600 border-2 border-white ring-1 ring-gray-200 cursor-pointer" />
                                            <div className="h-8 w-8 rounded-full bg-indigo-600 cursor-pointer" />
                                            <div className="h-8 w-8 rounded-full bg-slate-800 cursor-pointer" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Security Tab */}
                        {activeTab === 'security' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-1">
                                <div>
                                    <h3 className="text-xl font-medium">Security & Access Control</h3>
                                    <p className="text-sm text-muted-foreground">Manage authentication protocols and system-wide security policies.</p>
                                </div>

                                {/* Section: Authentication */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Authentication</h4>

                                    <div className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="space-y-0.5">
                                            <Label>Two-Factor Authentication (2FA)</Label>
                                            <p className="text-xs text-muted-foreground">Force all admin accounts to use TOTP apps for login.</p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>

                                    <div className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="space-y-0.5">
                                            <Label>Password Complexity</Label>
                                            <p className="text-xs text-muted-foreground">Require symbols and numbers in admin passwords.</p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                </div>

                                {/* Section: Session Management */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Session Management</h4>

                                    <div className="grid gap-2">
                                        <Label>Inactivity Timeout (Minutes)</Label>
                                        <Select defaultValue="30">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select timeout" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="15">15 Minutes</SelectItem>
                                                <SelectItem value="30">30 Minutes</SelectItem>
                                                <SelectItem value="60">1 Hour</SelectItem>
                                                <SelectItem value="120">2 Hours</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex items-center justify-between p-4 border rounded-lg bg-red-50/50 dark:bg-red-900/10 border-red-200 dark:border-red-900">
                                        <div className="space-y-0.5">
                                            <Label className="text-red-800 dark:text-red-400">Global Logout</Label>
                                            <p className="text-xs text-muted-foreground text-red-600/80">Immediately invalidate all active admin sessions.</p>
                                        </div>
                                        <Button variant="destructive" size="sm">Force Logout All</Button>
                                    </div>
                                </div>

                                {/* Section: Restricted Access */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Network Security</h4>

                                    <div className="grid gap-2">
                                        <Label htmlFor="ip-whitelist">IP Whitelist (CIDR notation)</Label>
                                        <div className="flex gap-2">
                                            <Input id="ip-whitelist" placeholder="192.168.1.1/24" />
                                            <Button variant="outline">Add IP</Button>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground italic">Leave empty to allow access from any IP address.</p>
                                    </div>
                                </div>

                                <Separator />

                                <div className="flex justify-end gap-2">
                                    <Button variant="ghost">Discard</Button>
                                    <Button className="gap-2">
                                        <Shield className="h-4 w-4" /> Update Security Policy
                                    </Button>
                                </div>
                            </div>
                        )}
                        {/* API Tab */}
                        {activeTab === 'api' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-1">
                                <div>
                                    <h3 className="text-xl font-medium">API Configuration</h3>
                                    <p className="text-sm text-muted-foreground">Manage your secret keys and integration endpoints.</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label>Master API Endpoint</Label>
                                        <div className="flex gap-2">
                                            <Input readOnly value="https://api.acme-system.com/v1" className="bg-muted" />
                                            <Button variant="outline">Copy</Button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 border border-dashed rounded-lg bg-yellow-50/50 dark:bg-yellow-900/10">
                                        <div className="space-y-0.5">
                                            <Label className="text-yellow-700 dark:text-yellow-500">Rotate Master Key</Label>
                                            <p className="text-xs text-muted-foreground">This will invalidate all current device connections.</p>
                                        </div>
                                        <Button variant="destructive" size="sm">Rotate Key</Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Notifications Tab */}
                        {activeTab === 'notifications' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-1">
                                <div>
                                    <h3 className="text-xl font-medium">Notification Settings</h3>
                                    <p className="text-sm text-muted-foreground">Manage how the system communicates with admins and end-users.</p>
                                </div>

                                {/* Administrative Alerts */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Admin System Alerts</h4>
                                    <div className="grid gap-4">
                                        <div className="flex items-center justify-between p-4 border rounded-lg">
                                            <div className="space-y-0.5">
                                                <Label>Critical Device Failure</Label>
                                                <p className="text-xs text-muted-foreground">{`Immediate alert when a device goes offline for > 10 mins.`}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <div className="flex items-center gap-1 mr-4">
                                                    <Mail className="h-3 w-3 text-muted-foreground" />
                                                    <Switch defaultChecked />
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Bell className="h-3 w-3 text-muted-foreground" />
                                                    <Switch defaultChecked />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between p-4 border rounded-lg">
                                            <div className="space-y-0.5">
                                                <Label>New User Registration</Label>
                                                <p className="text-xs text-muted-foreground">Receive a summary of new sign-ups every 24 hours.</p>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>
                                    </div>
                                </div>

                                {/* Notification Channels */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Communication Channels</h4>

                                    <div className="grid gap-4">
                                        <div className="grid gap-2">
                                            <Label>SMTP Provider (Email)</Label>
                                            <div className="flex gap-2">
                                                <Select defaultValue="sendgrid">
                                                    <SelectTrigger className="w-[200px]">
                                                        <SelectValue placeholder="Select Provider" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="sendgrid">SendGrid</SelectItem>
                                                        <SelectItem value="aws">AWS SES</SelectItem>
                                                        <SelectItem value="mailgun">Mailgun</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <Input placeholder="API Key / Secret" type="password" />
                                                <Button variant="outline">Test</Button>
                                            </div>
                                        </div>

                                        <div className="grid gap-2">
                                            <Label>Webhook URL (Slack/Teams)</Label>
                                            <div className="flex gap-2">
                                                <Input placeholder="https://hooks.slack.com/services/..." />
                                                <Button variant="outline">Connect</Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* User-Facing Notifications */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">User-Facing Defaults</h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label className="text-sm">Welcome Emails</Label>
                                                <p className="text-xs text-muted-foreground">Automatically send a tutorial to new users.</p>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>
                                        <Separator />
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label className="text-sm">Maintenance Banners</Label>
                                                <p className="text-xs text-muted-foreground">Show a top-bar banner to users during system updates.</p>
                                            </div>
                                            <Switch />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button className="gap-2">
                                        <Save className="h-4 w-4" /> Save Preferences
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Localization Tab */}
                        {activeTab === 'localization' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-1">
                                <div>
                                    <h3 className="text-xl font-medium">Localization</h3>
                                    <p className="text-sm text-muted-foreground">Set your preferred language and time formats.</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label>System Language</Label>
                                        <Select defaultValue="en">
                                            <SelectTrigger><SelectValue placeholder="Select Language" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="en">English (US)</SelectItem>
                                                <SelectItem value="es">Spanish</SelectItem>
                                                <SelectItem value="fr">French</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Time Zone</Label>
                                        <Select defaultValue="utc">
                                            <SelectTrigger><SelectValue placeholder="Select Timezone" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="utc">UTC (+00:00)</SelectItem>
                                                <SelectItem value="ist">IST (+05:30)</SelectItem>
                                                <SelectItem value="pst">PST (-08:00)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Backups Tab */}
                        {activeTab === 'backup' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-1">
                                <div>
                                    <h3 className="text-xl font-medium">Data Backups</h3>
                                    <p className="text-sm text-muted-foreground">Export your database or schedule automated snapshots.</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex gap-4 items-center">
                                            <Cloud className="h-8 w-8 text-blue-500" />
                                            <div>
                                                <p className="text-sm font-medium">Auto-backup to Cloud</p>
                                                <p className="text-xs text-muted-foreground">Every 24 hours at 03:00 AM</p>
                                            </div>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                    <Button variant="outline" className="w-full gap-2 text-primary border-primary">
                                        <Share2 className="h-4 w-4" /> Download Full CSV Export
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Audit Logs Tab */}
                        {activeTab === 'audit' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-1">
                                <div>
                                    <h3 className="text-xl font-medium">Audit Logs</h3>
                                    <p className="text-sm text-muted-foreground">Recent administrative actions across the system.</p>
                                </div>
                                <div className="border rounded-md divide-y overflow-hidden">
                                    {[
                                        { action: "Device Added", user: "Admin", date: "2 mins ago" },
                                        { action: "API Key Rotated", user: "System", date: "1 hour ago" },
                                        { action: "User Deleted", user: "Admin", date: "Yesterday" },
                                    ].map((log, i) => (
                                        <div key={i} className="px-4 py-3 flex justify-between items-center text-sm">
                                            <span className="font-medium">{log.action}</span>
                                            <div className="text-right">
                                                <p className="text-xs text-muted-foreground">By {log.user}</p>
                                                <p className="text-[10px] text-muted-foreground/60">{log.date}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettingsPage;