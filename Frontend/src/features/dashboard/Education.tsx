"use client";
import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Pencil, Trash2, Plus } from 'lucide-react';
import { useCreateeducationMutation, useDeleteeducationMutation, useGeteducationQuery, useUpdateeducationMutation } from '@/services/educationService';
type EducationType = {
    id: string;
    institutionName: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
};

const Education = () => {
    const { data: educationsData, refetch } = useGeteducationQuery("");
    const educations = educationsData?.data || []; // Adjust according to your API response structure

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [currentEducation, setCurrentEducation] = useState<EducationType | null>(null);
    const [newEducation, setNewEducation] = useState<Omit<EducationType, 'id'>>({
        institutionName: "",
        degree: "",
        fieldOfStudy: "",
        startDate: "",
        endDate: "",
    });

    const [createEducation] = useCreateeducationMutation();
    const [updateEducation] = useUpdateeducationMutation();
    const [deleteEducation] = useDeleteeducationMutation();

    const handleAdd = async () => {
        try {
            await createEducation(newEducation).unwrap();
            setIsAddDialogOpen(false);
            setNewEducation({
                institutionName: "",
                degree: "",
                fieldOfStudy: "",
                startDate: "",
                endDate: "",
            });
            refetch();
        } catch (error) {
            console.error("Error creating education:", error);
        }
    };

    const handleEdit = (education: EducationType) => {
        setCurrentEducation(education);
        setIsEditDialogOpen(true);
    };

    const handleUpdate = async () => {
        if (!currentEducation) return;
        await updateEducation({ ...currentEducation, id: currentEducation.id }).unwrap();
        setIsEditDialogOpen(false);
        refetch();
    };

    const handleDeleteClick = (education: EducationType) => {
        setCurrentEducation(education);
        setIsDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!currentEducation) return;
        await deleteEducation(currentEducation.id).unwrap();
        setIsDeleteDialogOpen(false);
        refetch();
    };

    return (
        <div className="space-y-4 mx-4">
            <div>
                <h2 className="text-xl font-bold text-[hsl(var(--accent))]">Education</h2>
                <div className="flex justify-end">
                    <Button className="bg-[hsl(var(--accent))] flex items-center" onClick={() => setIsAddDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Education
                    </Button>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>institutionName</TableHead>
                            <TableHead>Degree</TableHead>
                            <TableHead>Field of Study</TableHead>
                            <TableHead>Start Date</TableHead>
                            <TableHead>End Date</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.isArray(educations) ? (
                            educations.map((education) => (
                                <TableRow key={education.id}>
                                    <TableCell>{education.institutionName}</TableCell>
                                    <TableCell>{education.degree}</TableCell>
                                    <TableCell>{education.fieldOfStudy}</TableCell>
                                    <TableCell>{education.startDate}</TableCell>
                                    <TableCell>{education.endDate}</TableCell>
                                    <TableCell>
                                        <div className="flex space-x-2">
                                            <Button size="sm" variant="ghost" onClick={() => handleEdit(education)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button size="sm" variant="ghost" onClick={() => handleDeleteClick(education)}>
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6}>No education records found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Add Education Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className='bg-black overflow-auto max-h-[90vh]'>
                    <DialogHeader>
                        <DialogTitle>Add Education</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <label>institutionName</label>
                        <Input
                            value={newEducation.institutionName}
                            onChange={(e) => setNewEducation({ ...newEducation, institutionName: e.target.value })}
                        />
                        <label>Degree</label>

                        <Input
                            value={newEducation.degree}
                            onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                        />
                        <label>Field of Study</label>

                        <Input
                            value={newEducation.fieldOfStudy}
                            onChange={(e) => setNewEducation({ ...newEducation, fieldOfStudy: e.target.value })}
                        />
                        <label>Start Date</label>

                        <Input
                            type="date"
                            value={newEducation.startDate}
                            onChange={(e) => setNewEducation({ ...newEducation, startDate: e.target.value })}
                        />
                        <label>End Date</label>

                        <Input
                            type="date"
                            value={newEducation.endDate}
                            onChange={(e) => setNewEducation({ ...newEducation, endDate: e.target.value })}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleAdd} className='bg-[hsl(var(--accent))]'>Add</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Education Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className='bg-black overflow-auto max-h-[90vh]'>
                    <DialogHeader>
                        <DialogTitle>Edit Education</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <label>institutionName</label>
                        <Input
                            value={currentEducation?.institutionName || ''}
                            onChange={(e) => currentEducation && setCurrentEducation({ ...currentEducation, institutionName: e.target.value })}
                        />
                        <label>Degree</label>

                        <Input
                            value={currentEducation?.degree || ''}
                            onChange={(e) => currentEducation && setCurrentEducation({ ...currentEducation, degree: e.target.value })}
                        />
                        <label>Field of Study</label>

                        <Input
                            value={currentEducation?.fieldOfStudy || ''}
                            onChange={(e) => currentEducation && setCurrentEducation({ ...currentEducation, fieldOfStudy: e.target.value })}
                        />
                        <label>Start Date</label>

                        <Input
                            type="date"
                            value={currentEducation?.startDate || ''}
                            onChange={(e) => currentEducation && setCurrentEducation({ ...currentEducation, startDate: e.target.value })}
                        />
                        <label>End Date</label>

                        <Input
                            type="month"
                            value={currentEducation?.endDate || ''}
                            onChange={(e) => currentEducation && setCurrentEducation({ ...currentEducation, endDate: e.target.value })}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleUpdate} className='bg-[hsl(var(--accent))]'>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent className='bg-black'>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete this education record.
                        </AlertDialogDescription>
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

export default Education;