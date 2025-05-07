"use client";
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Pencil, Trash2, Plus } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useCreatetestimonyialMutation, useDeletetestimonyialMutation, useGettestimonyialQuery, useUpdatetestimonyialMutation } from '@/services/testimonyService';

type Testimonial = {
    id: number;
    feedback: string; // This corresponds to the quote
    reviewerFullName: string; // This should match your API response
    reviewerTitle: string; // This should match your API response
    rate: number; // This corresponds to the rating
};

const Testimonial = () => {
    const { data, isLoading, isError } = useGettestimonyialQuery("");
    const [createTestimonial] = useCreatetestimonyialMutation();
    const [updateTestimonial] = useUpdatetestimonyialMutation();
    const [deleteTestimonial] = useDeletetestimonyialMutation();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [currentTestimonial, setCurrentTestimonial] = useState<Testimonial | null>(null);
    const testimonials = data?.data || [];
    const [testimonialList, setTestimonials] = useState<Testimonial[]>(testimonials);
    const [newTestimonial, setNewTestimonial] = useState<Omit<Testimonial, 'id'>>({
        reviewerFullName: "",
        feedback: "",
        reviewerTitle: "",
        rate: 5,
    });

    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error loading testimonials</p>;



    const handleAdd = async () => {
        try {
            const createdTestimonial = await createTestimonial({
                reviewerFullName: newTestimonial.reviewerFullName,
                reviewerTitle: newTestimonial.reviewerTitle,
                rate: newTestimonial.rate,
                feedback: newTestimonial.feedback,
            }).unwrap();

            setTestimonials([...testimonialList, { ...createdTestimonial, id: testimonialList.length + 1 }]);
            setIsAddDialogOpen(false);
            setNewTestimonial({
                feedback: "",
                reviewerFullName: "",
                reviewerTitle: "",
                rate: 5,
            });
        } catch (error) {
            console.error("Failed to create testimonial: ", error);
        }
    };


    const handleEdit = (testimonial: Testimonial) => {
        setCurrentTestimonial({
            id: testimonial.id,
            reviewerFullName: testimonial.reviewerFullName,
            reviewerTitle: testimonial.reviewerTitle,
            feedback: testimonial.feedback,
            rate: testimonial.rate,
        });
        setIsEditDialogOpen(true);
    };

    const handleUpdate = async () => {
        if (!currentTestimonial) return; // Ensure there's a current testimonial to update
        try {
            const updatedTestimonial = await updateTestimonial({
                id: currentTestimonial.id,
                reviewerFullName: currentTestimonial.reviewerFullName,
                reviewerTitle: currentTestimonial.reviewerTitle,
                rate: currentTestimonial.rate,
                feedback: currentTestimonial.feedback,
            }).unwrap();

            // Update the testimonials list
            setTestimonials(testimonials.map((test: Testimonial) =>
                test.id === updatedTestimonial.id ? updatedTestimonial : test
            ));

            // Close the edit dialog
            setIsEditDialogOpen(false);
        } catch (error) {
            console.error("Failed to update testimonial: ", error);
        }
    };

    const handleDelete = async () => {
        if (!currentTestimonial) return;
        try {
            await deleteTestimonial(currentTestimonial.id).unwrap();
            setTestimonials(testimonials.filter((test: { id: number; }) => test.id !== currentTestimonial.id));
            setIsDeleteDialogOpen(false);
        } catch (error) {
            console.error("Failed to delete testimonial: ", error);
        }
    };

    const handleDeleteClick = (testimonial: Testimonial) => {
        setCurrentTestimonial(testimonial);
        setIsDeleteDialogOpen(true);
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex">
                {[...Array(5)].map((_, i) => (
                    <svg
                        key={i}
                        className={`w-3 h-3 ${i < rating ? 'text-yellow-400' : 'text-gray-600'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-4 mx-4">
            <div>
                <h2 className="text-xl font-bold text-[hsl(var(--accent))]">Testimonials</h2>
                <div className="flex justify-end mt-5">
                    <Button className="bg-[hsl(var(--accent))] flex items-center" onClick={() => setIsAddDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Testimonial
                    </Button>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Author</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Testimonial</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {testimonials.map((testimonial: Testimonial) => (
                            <TableRow key={testimonial.id}>
                                <TableCell className="font-medium">{testimonial.reviewerFullName}</TableCell>
                                <TableCell>{testimonial.reviewerTitle}</TableCell>
                                <TableCell className="max-w-[200px] truncate">{testimonial.feedback}</TableCell>
                                <TableCell>{renderStars(testimonial.rate)}</TableCell>
                                <TableCell>
                                    <div className="flex space-x-2">
                                        <Button size="sm" variant="ghost" onClick={() => handleEdit(testimonial)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button size="sm" variant="ghost" onClick={() => handleDeleteClick(testimonial)}>
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Add Testimonial Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="bg-black overflow-auto max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle>Add Testimonial</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <label>Author</label>
                            <Input
                                value={newTestimonial.reviewerFullName}
                                onChange={(e) => setNewTestimonial({ ...newTestimonial, reviewerFullName: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label>Role</label>
                            <Input
                                value={newTestimonial.reviewerTitle}
                                onChange={(e) => setNewTestimonial({ ...newTestimonial, reviewerTitle: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label>Testimonial</label>
                            <Textarea
                                value={newTestimonial.feedback}
                                onChange={(e) => setNewTestimonial({ ...newTestimonial, feedback: e.target.value })}
                                className="min-h-[100px]"
                            />
                        </div>
                        <div className="space-y-2">
                            <label>Rating</label>
                            <select
                                value={newTestimonial.rate}
                                onChange={(e) => setNewTestimonial({ ...newTestimonial, rate: parseInt(e.target.value) })}
                                className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2"
                            >
                                {[1, 2, 3, 4, 5].map(num => (
                                    <option key={num} value={num}>{num} Star{num !== 1 ? 's' : ''}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAdd} className='bg-[hsl(var(--accent))]'>Add</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Testimonial Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="bg-black overflow-auto max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle>Edit Testimonial</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <label>Author</label>
                            <Input
                                value={currentTestimonial?.reviewerFullName || ''}
                                onChange={(e) => currentTestimonial && setCurrentTestimonial({
                                    ...currentTestimonial,
                                    reviewerFullName: e.target.value
                                })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label>Role</label>
                            <Input
                                value={currentTestimonial?.reviewerTitle || ''}
                                onChange={(e) => currentTestimonial && setCurrentTestimonial({
                                    ...currentTestimonial,
                                    reviewerTitle: e.target.value
                                })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label>Testimonial</label>
                            <Textarea
                                value={currentTestimonial?.feedback || ''}
                                onChange={(e) => currentTestimonial && setCurrentTestimonial({
                                    ...currentTestimonial,
                                    feedback: e.target.value
                                })}
                                className="min-h-[100px]"
                            />
                        </div>
                        <div className="space-y-2">
                            <label>Rating</label>
                            <select
                                value={currentTestimonial?.rate || 5}
                                onChange={(e) => currentTestimonial && setCurrentTestimonial({
                                    ...currentTestimonial,
                                    rate: parseInt(e.target.value)
                                })}
                                className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2"
                            >
                                {[1, 2, 3, 4, 5].map(num => (
                                    <option key={num} value={num}>{num} Star{num !== 1 ? 's' : ''}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                        </Button>
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
                            This will permanently delete this testimonial.
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

export default Testimonial;