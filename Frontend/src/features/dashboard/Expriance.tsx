"use client";
import { useState } from 'react';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Pencil, Trash2, Plus } from 'lucide-react';
import {
    useCreateexprianceMutation, useDeleteexprianceMutation,
    useGetexprianceQuery, useUpdateexprianceMutation,
} from '@/services/exprianceService';

type Experience = {
    id: number;
    companyName: string;
    position: string;
    responsibilities: string;
    area: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
};

const Experience = () => {
    const { data: responseData, refetch } = useGetexprianceQuery("");
    const experiences = Array.isArray(responseData?.data) ? responseData.data : [];
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [currentExperience, setCurrentExperience] = useState<Experience | null>(null);
    const [newExperience, setNewExperience] = useState<Omit<Experience, 'id'>>({
        companyName: "",
        position: "",
        responsibilities: "",
        area: "",
        startDate: "",
        endDate: "",
        isCurrent: false,
    });

    const [createExperience] = useCreateexprianceMutation();
    const [updateExperience] = useUpdateexprianceMutation();
    const [deleteExperience] = useDeleteexprianceMutation();

    const handleAdd = async () => {
        try {
            await createExperience(newExperience).unwrap();
            setIsAddDialogOpen(false);
            setNewExperience({
                companyName: "",
                position: "",
                responsibilities: "",
                area: "",
                startDate: "",
                endDate: "",
                isCurrent: false,
            });
            refetch();
        } catch (error) {
            console.error("Error adding experience:", error);
        }
    };

    const handleEdit = (experience: Experience) => {
        setCurrentExperience(experience);
        setIsEditDialogOpen(true);
    };

    const handleUpdate = async () => {
        if (!currentExperience) return;
        try {
            await updateExperience(currentExperience).unwrap();
            setIsEditDialogOpen(false);
            refetch();
        } catch (error) {
            console.error("Error updating experience:", error);
        }
    };

    const handleDeleteClick = (experience: Experience) => {
        setCurrentExperience(experience);
        setIsDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!currentExperience) return;
        try {
            await deleteExperience(currentExperience.id).unwrap();
            setIsDeleteDialogOpen(false);
            refetch();
        } catch (error) {
            console.error("Error deleting experience:", error);
        }
    };

    return (
        <div className="space-y-4 mx-4">
            <h2 className="text-xl font-bold text-[hsl(var(--accent))]">Experience</h2>
            <div className="flex justify-end mb-2">
                <Button className="bg-[hsl(var(--accent))]" onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Experience
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Company</TableHead>
                            <TableHead>Position</TableHead>
                            <TableHead>Responsibilities</TableHead>
                            <TableHead>Area</TableHead>
                            <TableHead>Start</TableHead>
                            <TableHead>End</TableHead>
                            <TableHead>Current</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {experiences.map((exp: Experience) => (
                            <TableRow key={exp.id}>
                                <TableCell>{exp.companyName}</TableCell>
                                <TableCell>{exp.position}</TableCell>
                                <TableCell>{exp.responsibilities}</TableCell>
                                <TableCell>{exp.area}</TableCell>
                                <TableCell>{exp.startDate}</TableCell>
                                <TableCell>{exp.isCurrent ? "Present" : exp.endDate}</TableCell>
                                <TableCell>{exp.isCurrent ? "Yes" : "No"}</TableCell>
                                <TableCell>
                                    <div className="flex space-x-2">
                                        <Button size="sm" variant="ghost" onClick={() => handleEdit(exp)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button size="sm" variant="ghost" onClick={() => handleDeleteClick(exp)}>
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Add Experience Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className='bg-black overflow-auto max-h-[90vh]'>
                    <DialogHeader>
                        <DialogTitle>Add Experience</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <label>Company</label>
                        <Input value={newExperience.companyName} onChange={(e) => setNewExperience({ ...newExperience, companyName: e.target.value })} />
                        <label>Position</label>
                        <Input value={newExperience.position} onChange={(e) => setNewExperience({ ...newExperience, position: e.target.value })} />
                        <label>Responsibilities</label>
                        <Textarea value={newExperience.responsibilities} onChange={(e) => setNewExperience({ ...newExperience, responsibilities: e.target.value })} />
                        <label>Area</label>
                        <Input value={newExperience.area} onChange={(e) => setNewExperience({ ...newExperience, area: e.target.value })} />
                        <label>Start Date</label>
                        <Input type="date" value={newExperience.startDate} onChange={(e) => setNewExperience({ ...newExperience, startDate: e.target.value })} />
                        <label>End Date</label>
                        <Input type="date" value={newExperience.endDate} onChange={(e) => setNewExperience({ ...newExperience, endDate: e.target.value })} disabled={newExperience.isCurrent} />
                        <div className="flex items-center space-x-2">
                            <input type="checkbox" id="isCurrent" checked={newExperience.isCurrent} onChange={(e) => setNewExperience({ ...newExperience, isCurrent: e.target.checked, endDate: e.target.checked ? "" : newExperience.endDate })} />
                            <label htmlFor="isCurrent">I currently work here</label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleAdd} className='bg-[hsl(var(--accent))]'>Add</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className='bg-black overflow-auto max-h-[90vh]'>
                    <DialogHeader>
                        <DialogTitle>Update Experience</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <label>Company</label>
                        <Input value={currentExperience?.companyName || ''} onChange={(e) => currentExperience && setCurrentExperience({ ...currentExperience, companyName: e.target.value })} />
                        <label>Position</label>
                        <Input value={currentExperience?.position || ''} onChange={(e) => currentExperience && setCurrentExperience({ ...currentExperience, position: e.target.value })} />
                        <label>Responsibilities</label>
                        <Textarea value={currentExperience?.responsibilities || ''} onChange={(e) => currentExperience && setCurrentExperience({ ...currentExperience, responsibilities: e.target.value })} />
                        <label>Area</label>
                        <Input value={currentExperience?.area || ''} onChange={(e) => currentExperience && setCurrentExperience({ ...currentExperience, area: e.target.value })} />
                        <label>Start Date</label>
                        <Input type="date" value={currentExperience?.startDate || ''} onChange={(e) => currentExperience && setCurrentExperience({ ...currentExperience, startDate: e.target.value })} />
                        <label>End Date</label>
                        <Input type="date" value={currentExperience?.endDate || ''} onChange={(e) => currentExperience && setCurrentExperience({ ...currentExperience, endDate: e.target.value })} disabled={currentExperience?.isCurrent} />
                        <div className="flex items-center space-x-2">
                            <input type="checkbox" id="editIsCurrent" checked={currentExperience?.isCurrent || false} onChange={(e) => currentExperience && setCurrentExperience({ ...currentExperience, isCurrent: e.target.checked, endDate: e.target.checked ? "" : currentExperience.endDate })} />
                            <label htmlFor="editIsCurrent">I currently work here</label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleUpdate} className='bg-[hsl(var(--accent))]'>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent className='bg-black'>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>This will permanently delete this experience record.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className='bg-[hsl(var(--accent))]'>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default Experience;
