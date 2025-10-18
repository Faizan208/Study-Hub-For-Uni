
"use client";
import * as React from "react";
import {
  collection,
  serverTimestamp,
  doc,
  query,
} from "firebase/firestore";
import { useFirebase, useUser, useCollection, useMemoFirebase, addDocumentNonBlocking, updateDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import placeholderImages from "@/app/lib/placeholder-images.json";
import { practicalFilters } from "@/lib/placeholder-data";


type Practical = {
    id: string;
    title: string;
    description: string;
    semester: string;
    price: number;
    image: string;
    category: string;
};

const imageOptions = Object.keys(placeholderImages).map(key => ({
    value: placeholderImages[key as keyof typeof placeholderImages].src,
    label: key
}));

const categoryOptions = practicalFilters.filter(f => f !== "All");

export default function PracticalsPage() {
    const { firestore, user } = useFirebase();
    const { toast } = useToast();
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const [selectedPractical, setSelectedPractical] = React.useState<Practical | null>(null);
    const [formState, setFormState] = React.useState<Partial<Practical>>({});

    const practicalsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, "practicals"));
    }, [firestore]);

    const { data: practicals, isLoading } = useCollection<Practical>(practicalsQuery);

    const handleOpenForm = (practical?: Practical) => {
        if (practical) {
            setSelectedPractical(practical);
            setFormState(practical);
        } else {
            setSelectedPractical(null);
            setFormState({ price: 200 });
        }
        setIsFormOpen(true);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: name === 'price' ? Number(value) : value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormState(prev => ({ ...prev, [name]: value }));
    }

    const handleSubmit = () => {
        if (!firestore || !user) return;
        if (!formState.title || !formState.description || !formState.semester || !formState.price || !formState.image || !formState.category) {
            toast({ variant: "destructive", title: "Missing fields" });
            return;
        }

        const dataToSave = {
            ...formState,
            adminId: user.uid,
            uploadDate: serverTimestamp(),
        };

        if (selectedPractical) {
            updateDocumentNonBlocking(doc(firestore, "practicals", selectedPractical.id), dataToSave);
            toast({ title: "Practical updated" });
        } else {
            addDocumentNonBlocking(collection(firestore, "practicals"), dataToSave);
            toast({ title: "Practical added" });
        }
        setIsFormOpen(false);
        setFormState({});
    };

    const handleDelete = () => {
        if (!firestore || !selectedPractical) return;
        deleteDocumentNonBlocking(doc(firestore, "practicals", selectedPractical.id));
        toast({ title: "Practical deleted" });
        setIsDeleteDialogOpen(false);
        setSelectedPractical(null);
    }
    
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">Lab Practicals</h1>
                <div className="ml-auto flex items-center gap-2">
                    <Button size="sm" className="h-8 gap-1" onClick={() => handleOpenForm()}>
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Add Practical
                        </span>
                    </Button>
                </div>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Manage Practicals</CardTitle>
                    <CardDescription>A list of all lab practicals in your database.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Semester</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center">Loading...</TableCell>
                                </TableRow>
                            ) : practicals?.length ? (
                                practicals.map((practical) => (
                                    <TableRow key={practical.id}>
                                        <TableCell className="font-medium">{practical.title}</TableCell>
                                        <TableCell>{practical.semester}</TableCell>
                                        <TableCell>{practical.category}</TableCell>
                                        <TableCell>{practical.price} Rs</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button aria-haspopup="true" size="icon" variant="ghost">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        <span className="sr-only">Toggle menu</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => handleOpenForm(practical)}>Edit</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => { setSelectedPractical(practical); setIsDeleteDialogOpen(true); }} className="text-destructive">Delete</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center">No practicals found.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{selectedPractical ? "Edit" : "Add"} Practical</DialogTitle>
                        <DialogDescription>
                           Fill out the form to {selectedPractical ? "update the" : "add a new"} practical.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">Title</Label>
                            <Input id="title" name="title" value={formState.title || ""} onChange={handleFormChange} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">Description</Label>
                            <Textarea id="description" name="description" value={formState.description || ""} onChange={handleFormChange} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="semester" className="text-right">Semester</Label>
                             <Select onValueChange={(value) => handleSelectChange("semester", value)} value={formState.semester}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select semester" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.from({ length: 8 }, (_, i) => (i + 1).toString()).map(sem => <SelectItem key={sem} value={sem}>{sem}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="category" className="text-right">Category</Label>
                             <Select onValueChange={(value) => handleSelectChange("category", value)} value={formState.category}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categoryOptions.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="image" className="text-right">Image</Label>
                             <Select onValueChange={(value) => handleSelectChange("image", value)} value={formState.image}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select an image" />
                                </SelectTrigger>
                                <SelectContent>
                                    {imageOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="price" className="text-right">Price (Rs)</Label>
                            <Input id="price" name="price" type="number" value={formState.price || ""} onChange={handleFormChange} className="col-span-3" />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" onClick={handleSubmit}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>This action cannot be undone. This will permanently delete the practical.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                        <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </main>
    );
}
