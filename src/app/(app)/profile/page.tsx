"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth.tsx";
import { updateProfile, User } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, storage, db } from "@/lib/firebase-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Camera, Upload, Search } from "lucide-react";
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
import { collection, onSnapshot } from "firebase/firestore";

const DOSHA_TYPES = [
  //"Vata", "Pitta", "Kapha", "Vata-Pitta", "Vata-Kapha", "Pitta-Kapha", "Tridoshic"  \\ hadn't upload since not created in firestore databse
];

export default function ProfilePage() {
  const { user: authUser } = useAuth();
  const { toast } = useToast();

  const [user, setUser] = useState<User | null>(authUser);
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [title, setTitle] = useState("Ayurveda Enthusiast");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [hasCameraPermission, setHasCameraPermission] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const [patients, setPatients] = useState<any[]>([]);
  const [doshaCounts, setDoshaCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    setUser(authUser);
    setDisplayName(authUser?.displayName || "");
  }, [authUser]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "patients"), (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data());
      setPatients(data);

      // Count dosha types dynamically
      /*const counts: Record<string, number> = {};
      DOSHA_TYPES.forEach(type => counts[type] = 0);
      data.forEach(patient => {
        if (patient.doshaType && counts.hasOwnProperty(patient.doshaType)) {
          counts[patient.doshaType]++;
        }
      });
      setDoshaCounts(counts);*/
    });
    return () => unsub();
  }, []);
  const handleProfileUpdate = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    try {
      await updateProfile(auth.currentUser, { displayName });
      setUser({ ...auth.currentUser });
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
          if (blob) {
            uploadProfilePicture(blob);
            setIsCapturing(false);
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
      setUser({ ...auth.currentUser });
      toast({ title: "Profile Picture Updated", description: "Your new picture is now live." });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Upload Failed", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  function RecommendedBooksSearch() {
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSearch(e: React.FormEvent) {
      e.preventDefault();
      if (!search.trim()) return;
      setLoading(true);

      let corrected = search.trim();
      try {
        // Call Gemini API directly from client
        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        const res = await fetch(
          "https://generativelanguage.googleapis.com/v1beta1/models/gemini-pro:generateContent?key=" + apiKey,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    { text: `Correct this book name for search: "${search}"` }
                  ]
                }
              ]
            }),
          }
        );
        const data = await res.json();
        // Gemini returns corrected text in data.candidates[0].content.parts[0].text
        if (
          data.candidates &&
          data.candidates[0] &&
          data.candidates[0].content &&
          data.candidates[0].content.parts &&
          data.candidates[0].content.parts[0].text
        ) {
          corrected = data.candidates[0].content.parts[0].text.trim();
        }
      } catch {
        // fallback: use original
      }

      // Format for libtoon.com
      const formatted = corrected.toLowerCase().replace(/\s+/g, "-");
      window.open(`https://libtoon.com/p/${formatted}`, "_blank");
      setLoading(false);
    }

    return (
      <div className="card bg-[#cdc1aa] p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-[#613f3c] mb-4">Search Ayurvedic Books</h2>
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <Input
            type="text"
            placeholder="Type book name (e.g. Charaka Samhita)"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : <Search />}
            Search & Download
          </Button>
        </form>
        <ul>
          <li><a href="https://archive.org/details/CharakaSamhita" target="_blank" rel="noopener" className="underline"></a></li>
          <li><a href="https://archive.org/details/AshtangaHridayam" target="_blank" rel="noopener" className="underline"> </a></li>
          <li><a href="https://archive.org/details/SushrutaSamhita" target="_blank" rel="noopener" className="underline"> </a></li>
        </ul>
      </div>
    );
  }

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
                    <Button variant="outline"><Camera className="mr-2" /> Take Photo</Button>
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
                <Button onClick={() => fileInputRef.current?.click()}><Upload className="mr-2" /> Upload</Button>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Patient Overview */}
            <div className="card bg-[#f1ebe1] p-6 rounded-lg shadow">
              <h1 className="text-3xl font-bold text-[#613f3c] mb-4">Patients Directory</h1>
              <h2 className="text-2xl mb-4">Total Patients you are working till now: <b>{patients.length}</b></h2>
              <ul>
                {DOSHA_TYPES.map(type => (
                  <li key={type} className="mb-2 text-lg">
                    <span className="font-semibold">{type}:</span> {doshaCounts[type] || 0} patient{(doshaCounts[type] || 0) !== 1 ? "s" : ""}
                  </li>
                ))}
              </ul>
            </div>
            {/* Recommended Books */}
            <RecommendedBooksSearch />
            {/* Ayurveda News */}
            <div className="card bg-[#f1ebe1] p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold text-[#613f3c] mb-2">Ayurveda News</h2>
              <ul>
                <li><a href="https://www.ayurvedanews.in/" target="_blank" rel="noopener" className="underline">Ayurveda News Portal</a></li>
                <li><a href="https://www.ayurvedanews.in/category/latest-news/" target="_blank" rel="noopener" className="underline">Latest Research</a></li>
                <li><a href="https://www.ayurvedanews.in/category/events/" target="_blank" rel="noopener" className="underline">Events & Conferences</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
