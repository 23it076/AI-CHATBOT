import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { updateProfile } from '@/lib/firebase';

export default function Profile() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentUser?.displayName) {
      setDisplayName(currentUser.displayName);
    } else if (currentUser?.email) {
      // Use email username as fallback display name
      setDisplayName(currentUser.email.split('@')[0]);
    }
  }, [currentUser]);

  const handleUpdateProfile = async () => {
    if (!currentUser) return;

    setIsLoading(true);
    try {
      await updateProfile(currentUser, { displayName });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully."
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="container mx-auto py-8">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Please sign in to view your profile</CardDescription>
          </CardHeader>
        </Card>
      </div>);

  }

  return (
    <div className="container mx-auto py-8">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>Manage your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
              {displayName ? displayName[0].toUpperCase() : 'U'}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={currentUser.email || ''} disabled />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            {isEditing ?
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)} /> :


            <Input id="displayName" value={displayName} disabled />
            }
          </div>

          <div className="space-y-2">
            <Label htmlFor="userId">User ID</Label>
            <Input id="userId" value={currentUser.uid} disabled />
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-2">
            <Label>Account Created</Label>
            <div className="text-sm text-gray-500">
              {currentUser.metadata?.creationTime ? new Date(currentUser.metadata.creationTime).toLocaleString() : 'Not available'}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Last Sign In</Label>
            <div className="text-sm text-gray-500">
              {currentUser.metadata?.lastSignInTime ? new Date(currentUser.metadata.lastSignInTime).toLocaleString() : 'Not available'}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          {isEditing ?
          <>
              <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button onClick={handleUpdateProfile} disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </> :

          <Button onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          }
        </CardFooter>
      </Card>
    </div>);

}