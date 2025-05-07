"use client";
import { useState } from 'react';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Pencil, Trash2, Plus } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import {
    useCreateblogMutation,
    useDeleteblogMutation,
    useGetblogQuery,
    useUpdateblogMutation,
} from '@/services/blogService';

type BlogImage = {
    id: number;
    imageUrl: string;
    blogId: number;
};

type BlogPost = {
    id: number;
    title: string;
    content: string;
    categoryName: string;
    blogImages: BlogImage[];
};

const Blog = () => {
    const { data, isLoading, isError } = useGetblogQuery("");
    const [createBlog] = useCreateblogMutation();
    const [updateBlog] = useUpdateblogMutation();
    const [deleteBlog] = useDeleteblogMutation();

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
    const [newPost, setNewPost] = useState<Omit<BlogPost, 'id' | 'blogImages'>>({
        title: "",
        content: "",
        categoryName: "",
    });
    const [newImages, setNewImages] = useState<string[]>([]);

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading blogs.</div>;

    const handleAdd = async () => {
        const postData = {
            ...newPost,
            images: newImages,
        };

        try {
            await createBlog(postData).unwrap();
            setIsAddDialogOpen(false);
            setNewPost({ title: "", content: "", categoryName: "" });
            setNewImages([]);
        } catch (error) {
            console.error("Error creating blog:", error);
        }
    };


    const handleEdit = (post: BlogPost) => {
        setCurrentPost(post);
        setNewImages(post.blogImages.map(img => img.imageUrl));
        setIsEditDialogOpen(true);
    };

    const handleUpdate = async () => {
        if (!currentPost) return;

        const updatedData = {
            ...currentPost,
            images: newImages,
        };

        try {
            await updateBlog(updatedData).unwrap();
            setIsEditDialogOpen(false);
        } catch (error) {
            console.error("Error updating blog:", error);
        }
    };


    const handleDelete = async () => {
        if (!currentPost) return;
        try {
            await deleteBlog(currentPost.id).unwrap();
            setIsDeleteDialogOpen(false);
        } catch (error) {
            console.error("Error deleting blog:", error);
        }
    };

    const handleDeleteClick = (post: BlogPost) => {
        setCurrentPost(post);
        setIsDeleteDialogOpen(true);
    };

    return (
        <div className="space-y-4 mx-4">
            <div>
                <h2 className="text-xl font-bold text-[hsl(var(--accent))]">Blog Posts</h2>
                <div className="flex justify-end mt-5">
                    <Button className="bg-[hsl(var(--accent))] flex items-center" onClick={() => setIsAddDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Blog Post
                    </Button>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Content</TableHead>
                            <TableHead>Images</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data?.data.map((post: BlogPost) => (
                            <TableRow key={post.id}>
                                <TableCell style={{ whiteSpace: 'pre-line' }}>{post.title}</TableCell>
                                <TableCell >
                                    <span className='border border-white p-2 rounded-lg'>
                                        {post.categoryName}
                                    </span>
                                </TableCell>
                                <TableCell style={{ whiteSpace: 'pre-line' }}>
                                    {post.content}
                                </TableCell>
                                <TableCell>
                                    {post.blogImages.map(image => (
                                        <img key={image.id} src={image.imageUrl} />
                                    ))}
                                </TableCell>
                                <TableCell>
                                    <div className="flex space-x-2">
                                        <Button size="sm" variant="ghost" onClick={() => handleEdit(post)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button size="sm" variant="ghost" onClick={() => handleDeleteClick(post)}>
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Add Blog Post Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="bg-black overflow-auto max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle>Add Blog Post</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <label>Title</label>
                            <Input value={newPost.title} onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <label>Content</label>
                            <Textarea
                                value={newPost.content}
                                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                                className="min-h-[150px]"
                            />
                        </div>
                        <div className="space-y-2">
                            <label>Category</label>
                            <Input
                                value={newPost.categoryName}
                                onChange={(e) => setNewPost({ ...newPost, categoryName: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label>Image URLs (comma-separated)</label>
                            <Input
                                value={newImages.join(', ')}
                                onChange={(e) => setNewImages(e.target.value.split(',').map(url => url.trim()))}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleAdd} className='bg-[hsl(var(--accent))]'>Add Post</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Blog Post Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="bg-black overflow-auto max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle>Edit Blog Post</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <label>Title</label>
                            <Input
                                value={currentPost?.title || ''}
                                onChange={(e) => currentPost && setCurrentPost({ ...currentPost, title: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label>Content</label>
                            <Textarea
                                value={currentPost?.content || ''}
                                onChange={(e) => currentPost && setCurrentPost({ ...currentPost, content: e.target.value })}
                                className="min-h-[150px]"
                            />
                        </div>
                        <div className="space-y-2">
                            <label>Category</label>
                            <Input
                                value={currentPost?.categoryName || ''}
                                onChange={(e) => currentPost && setCurrentPost({ ...currentPost, categoryName: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label>Image URLs (comma-separated)</label>
                            <Input
                                value={newImages.join(', ')}
                                onChange={(e) => setNewImages(e.target.value.split(',').map(url => url.trim()))}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleUpdate} className='bg-[hsl(var(--accent))]'>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent className='bg-black'>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete this blog post.
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

export default Blog;
