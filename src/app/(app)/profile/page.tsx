"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, storage } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Camera, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";

const mockProgressData = [
  { date: "Day 1", wellnessScore: 65, pitta: 40, vata: 30, kapha: 25 },
  { date: "Day 2", wellnessScore: 68, pitta: 38, vata: 32, kapha: 26 },
  { date: "Day 3", wellnessScore: 72, pitta: 35, vata: 35, kapha: 25 },
  { date: "Day 4", wellnessScore: 71, pitta: 36, vata: 34, kapha: 27 },
  { date: "Day 5", wellnessScore: 75, pitta: 32, vata: 38, kapha: 25 },
  { date: "Day 6", wellnessScore: 78, pitta: 30, vata: 40, kapha: 24 },
  { date: "Day 7", wellnessScore: 80, pitta: 28, vata: 42, kapha: 23 },
];

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [title, setTitle] = useState("Ayurveda Enthusiast"); // Mock title
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [hasCameraPermission, setHasCameraPermission] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);


  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCameraPermission(false);
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasCameraPermission(true);
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
      }
    };
    if(isCapturing){
      getCameraPermission();
    }
  }, [isCapturing]);


  const handleProfileUpdate = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    try {
      await updateProfile(auth.currentUser, { displayName });
      // Here you would also save the 'title' to your database
      toast({ title: "Profile Updated", description: "Your changes have been saved." });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Update Failed", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadProfilePicture(file);
    }
  };

  const captureAndUpload = () => {
    if (videoRef.current && canvasRef.current && auth.currentUser) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        if (context) {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            canvas.toBlob((blob) => {
                if(blob) {
                    uploadProfilePicture(blob);
                    setIsCapturing(false); // Close dialog on capture
                }
            }, 'image/jpeg');
        }
    }
  };

  const uploadProfilePicture = async (file: Blob) => {
    if (!auth.currentUser) return;
    setLoading(true);
    const storageRef = ref(storage, `profile-pictures/${auth.currentUser.uid}`);
    try {
      await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(storageRef);
      await updateProfile(auth.currentUser, { photoURL });
      toast({ title: "Profile Picture Updated", description: "Your new picture is now live." });
      // Force a re-render or state update to show new image
      window.location.reload(); 
    } catch (error: any) {
      toast({ variant: "destructive", title: "Upload Failed", description: error.message });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="space-y-8">
      <PageHeader title="My Profile" description="View and manage your personal details and progress." />
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <Avatar className="h-32 w-32">
                <AvatarImage src={user?.photoURL || `https://picsum.photos/seed/${user?.uid}/128/128`} alt={user?.displayName || ""} />
                <AvatarFallback>{user?.displayName?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex gap-2">
                 <Dialog onOpenChange={setIsCapturing}>
                  <DialogTrigger asChild>
                    <Button variant="outline"><Camera className="mr-2"/> Take Photo</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Take a new photo</DialogTitle>
                    </DialogHeader>
                     <video ref={videoRef} className="w-full aspect-video rounded-md bg-muted" autoPlay muted playsInline />
                     <canvas ref={canvasRef} className="hidden" />
                      {!hasCameraPermission && (
                        <Alert variant="destructive">
                          <AlertTitle>Camera Access Denied</AlertTitle>
                          <AlertDescription>
                            Please enable camera permissions in your browser settings.
                          </AlertDescription>
                        </Alert>
                      )}
                    <DialogFooter>
                      <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                      <Button onClick={captureAndUpload} disabled={!hasCameraPermission || loading}>
                        {loading ? <Loader2 className="animate-spin" /> : "Capture & Save"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button onClick={() => fileInputRef.current?.click()}><Upload className="mr-2"/> Upload</Button>
                <Input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
              <CardDescription>Update your personal information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Name</Label>
                <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user?.email || ""} disabled />
              </div>
              <Button onClick={handleProfileUpdate} disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Wellness Journey</CardTitle>
              <CardDescription>Your overall progress since starting.</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] w-full pr-6">
              <ResponsiveContainer>
                <LineChart data={mockProgressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      borderColor: "hsl(var(--border))",
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="wellnessScore" stroke="hsl(var(--primary))" strokeWidth={2} name="Wellness Score" />
                  <Line type="monotone" dataKey="pitta" stroke="hsl(var(--chart-2))" name="Pitta" />
                  <Line type="monotone" dataKey="vata" stroke="hsl(var(--chart-3))" name="Vata" />
                  <Line type="monotone" dataKey="kapha" stroke="hsl(var(--chart-4))" name="Kapha" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
