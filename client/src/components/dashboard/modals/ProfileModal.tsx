import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  User,
  Mail,
  Calendar,
  MapPin,
  Phone,
  Globe,
  Edit3,
  Save,
  X,
  Crown,
  Trophy,
  Target,
  Zap,
  Star,
  Camera
} from 'lucide-react';
import { useProjectStorage } from '@/hooks/useProjectStorage';
import { toast } from '@/hooks/useToast';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Commander',
    email: 'commander@lifepilot.ai',
    bio: 'Passionate about personal growth and achieving life goals through AI-powered insights.',
    location: 'San Francisco, CA',
    phone: '+1 (555) 123-4567',
    website: 'https://myportfolio.com',
    joinDate: '2024-01-15',
    timezone: 'PST (UTC-8)'
  });
  const [editData, setEditData] = useState(profileData);
  const { activeProject } = useProjectStorage();

  const stats = {
    totalProjects: 5,
    completedGoals: 23,
    currentStreak: 12,
    totalXP: activeProject?.character.xp || 2450,
    level: activeProject?.character.level || 5,
    achievements: 8
  };

  const recentAchievements = [
    { id: 1, title: 'Goal Crusher', description: 'Completed 20 goals', icon: '🏆', date: '2024-01-10' },
    { id: 2, title: 'Streak Master', description: '10-day habit streak', icon: '🔥', date: '2024-01-08' },
    { id: 3, title: 'Level Up', description: 'Reached Level 5', icon: '⭐', date: '2024-01-05' }
  ];

  const handleSave = () => {
    setProfileData(editData);
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated."
    });
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent flex items-center space-x-2">
            <User className="w-6 h-6 text-purple-500" />
            <span>Profile</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            {/* Profile Header */}
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
              <CardContent className="p-6">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src="" alt="Profile" />
                      <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-2xl">
                        {profileData.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-purple-600 hover:bg-purple-700"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {profileData.name}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">{profileData.email}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                            <Crown className="w-3 h-3 mr-1" />
                            Level {stats.level}
                          </Badge>
                          <Badge variant="outline">
                            {stats.totalXP} XP
                          </Badge>
                        </div>
                      </div>
                      <Button
                        onClick={() => setIsEditing(!isEditing)}
                        variant={isEditing ? "outline" : "default"}
                        className={isEditing ? "" : "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"}
                      >
                        {isEditing ? <X className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />}
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Details */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={editData.name}
                        onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    ) : (
                      <div className="flex items-center space-x-2 mt-1">
                        <User className="w-4 h-4 text-gray-500" />
                        <span>{profileData.name}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                      />
                    ) : (
                      <div className="flex items-center space-x-2 mt-1">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span>{profileData.email}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    {isEditing ? (
                      <Input
                        id="location"
                        value={editData.location}
                        onChange={(e) => setEditData(prev => ({ ...prev, location: e.target.value }))}
                      />
                    ) : (
                      <div className="flex items-center space-x-2 mt-1">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span>{profileData.location}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={editData.phone}
                        onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    ) : (
                      <div className="flex items-center space-x-2 mt-1">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span>{profileData.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="website">Website</Label>
                    {isEditing ? (
                      <Input
                        id="website"
                        value={editData.website}
                        onChange={(e) => setEditData(prev => ({ ...prev, website: e.target.value }))}
                      />
                    ) : (
                      <div className="flex items-center space-x-2 mt-1">
                        <Globe className="w-4 h-4 text-gray-500" />
                        <a href={profileData.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {profileData.website}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="bio">Bio</Label>
                    {isEditing ? (
                      <Textarea
                        id="bio"
                        value={editData.bio}
                        onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                        rows={3}
                      />
                    ) : (
                      <p className="mt-1 text-gray-600 dark:text-gray-400">{profileData.bio}</p>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave} className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Account Details */}
            <Card>
              <CardHeader>
                <CardTitle>Account Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">Joined: {new Date(profileData.joinDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">Timezone: {profileData.timezone}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Target className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                  <div className="text-2xl font-bold">{stats.totalProjects}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Projects</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Trophy className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <div className="text-2xl font-bold">{stats.completedGoals}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Goals Completed</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Zap className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                  <div className="text-2xl font-bold">{stats.totalXP}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total XP</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Progress Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Current Level Progress</span>
                    <span>{stats.level}/10</span>
                  </div>
                  <Progress value={(stats.level / 10) * 100} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Goal Completion Rate</span>
                    <span>78%</span>
                  </div>
                  <Progress value={78} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Current Streak</span>
                    <span>{stats.currentStreak} days</span>
                  </div>
                  <Progress value={(stats.currentStreak / 30) * 100} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentAchievements.map((achievement) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20"
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{achievement.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {new Date(achievement.date).toLocaleDateString()}
                      </p>
                    </div>
                    <Star className="w-5 h-5 text-yellow-500" />
                  </div>
                </motion.div>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Achievement Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {stats.achievements}/15
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Achievements Unlocked</p>
                  <Progress value={(stats.achievements / 15) * 100} className="mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {15 - stats.achievements} more to unlock all achievements
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}