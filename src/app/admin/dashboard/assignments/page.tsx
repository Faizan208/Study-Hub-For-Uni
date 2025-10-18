
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

type Assignment = {
    id: string;
    title: string;
    description: string;
    semester: string;
    price: number;
    image: string;
    type: string;
};

const imageOptions = Object.keys(placeholderImages).map(key => ({
    value: placeholderImages[key as keyof typeof placeholderImages].src,
    label: key
}));

export default function AssignmentsPage() {
    const { firestore, user } = useFirebase();
    const { toast } = useToast();
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const [selectedAssignment, setSelectedAssignment] = React.useState<Assignment | null>(null);
    const [formState, setFormState] = React.useState<Partial<Assignment>>({});

    const assignmentsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, "assignments"));
    }, [firestore]);

    const { data: assignments, isLoading } = useCollection<Assignment>(assignmentsQuery);

    const handleOpenForm = (assignment?: Assignment) => {
        if (assignment) {
            setSelectedAssignment(assignment);
            setFormState(assignment);
        } else {
            setSelectedAssignment(null);
            setFormState({ type: "assignment", price: 150 });
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

    const handleSubmit = async () => {
        if (!firestore || !user) return;
        if (!formState.title || !formState.description || !formState.semester || !formState.price || !formState.image) {
            toast({ variant: "destructive", title: "Missing fields" });
            return;
        }

        const dataToSave = {
            ...formState,
            adminId: user.uid,
            uploadDate: serverTimestamp(),
        };

        if (selectedAssignment) {
            updateDocumentNonBlocking(doc(firestore, "assignments", selectedAssignment.id), dataToSave);
            toast({ title: "Assignment updated" });
        } else {
            addDocumentNonBlocking(collection(firestore, "assignments"), dataToSave);
            toast({ title: "Assignment added" });
        }
        setIsFormOpen(false);
        setFormState({});
    };

    const handleDelete = () => {
        if (!firestore || !selectedAssignment) return;
        deleteDocumentNonBlocking(doc(firestore, "assignments", selectedAssignment.id));
        toast({ title: "Assignment deleted" });
        setIsDeleteDialogOpen(false);
        setSelectedAssignment(null);
    }
    
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">Assignments</h1>
                <div className="ml-auto flex items-center gap-2">
                    <Button size="sm" className="h-8 gap-1" onClick={() => handleOpenForm()}>
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Add Assignment
                        </span>
                    </Button>
                </div>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Manage Assignments</CardTitle>
                    <CardDescription>A list of all assignments in your database.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Semester</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">Loading...</TableCell>
                                </TableRow>
                            ) : assignments?.length ? (
                                assignments.map((assignment) => (
                                    <TableRow key={assignment.id}>
                                        <TableCell className="font-medium">{assignment.title}</TableCell>
                                        <TableCell>{assignment.semester}</TableCell>
                                        <TableCell>{assignment.price} Rs</TableCell>
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
                                                    <DropdownMenuItem onClick={() => handleOpenForm(assignment)}>Edit</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => { setSelectedAssignment(assignment); setIsDeleteDialogOpen(true); }} className="text-destructive">Delete</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">No assignments found.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{selectedAssignment ? "Edit" : "Add"} Assignment</DialogTitle>
                        <DialogDescription>
                           Fill out the form to {selectedAssignment ? "update the" : "add a new"} assignment.
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
                        <DialogDescription>This action cannot be undone. This will permanently delete the assignment.</DialogDescription>
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
