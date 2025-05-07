"use client";
import { useMemo, useState } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    ColumnDef,
} from '@tanstack/react-table';
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
import { Plus, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { flexRender } from '@tanstack/react-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useCreateprojectMutation, useDeleteprojectMutation, useGetprojectQuery, useUpdateprojectMutation } from '@/services/projectService';
import { useCreateprojectCategoryMutation, useDeleteprojectCategoryMutation, useGetprojectCategoryQuery, useUpdateprojectCategoryMutation } from '@/services/projectCategoryService';

type Project = {
    id: number;
    name: string;
    technology: string;
    demoLink: string;
    description: string;
    projectCategory: ProjectCategory;
    projectImage: ProjectImage[];
    projectCategoryId?: number;

};

type ProjectCategory = {
    id: number;
    name: string;
};
type ProjectImage = {
    image: string;
};



const Project = () => {
    // Projects state
    const [projectOpen, setProjectOpen] = useState(false);
    const [projectDeleteOpen, setProjectDeleteOpen] = useState(false);
    const [projectUpdateOpen, setProjectUpdateOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [projectFilter, setProjectFilter] = useState('');
    const { data: projectsdata } = useGetprojectQuery("");
    const projects = Array.isArray(projectsdata?.data) ? projectsdata.data : [];
    const [newProjectCateogry, setnewProjectCateogry] = useState<Omit<ProjectCategory, 'id'>>({
        name: ""
    });
    const [newProject, setnewProject] = useState<Omit<Project, 'id'>>({
        name: "",
        technology: "",
        demoLink: "",
        description: "",
        projectCategory: { id: 0, name: "" },
        projectImage: []

    });
    const [createproject] = useCreateprojectMutation()
    const [updateproject] = useUpdateprojectMutation()
    const [deleteproject] = useDeleteprojectMutation()


    const { data: responseData, refetch } = useGetprojectCategoryQuery("");
    const categories = Array.isArray(responseData?.data) ? responseData.data : [];

    const [createprojectCategory] = useCreateprojectCategoryMutation()
    const [updateprojectCategory] = useUpdateprojectCategoryMutation()
    const [deleteprojectCategory] = useDeleteprojectCategoryMutation()


    const [categoryOpen, setCategoryOpen] = useState(false);
    const [categoryDeleteOpen, setCategoryDeleteOpen] = useState(false);
    const [categoryUpdateOpen, setCategoryUpdateOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | null>(null);
    const [categoryFilter, setCategoryFilter] = useState('');


    // Project table columns
    const projectColumns = useMemo<ColumnDef<Project>[]>(() => [
        {
            accessorKey: 'id',
            header: 'ID',
            size: 20,
        },
        {
            accessorKey: 'name',
            header: 'Title',
            size: 120,
        },

        {
            accessorKey: 'technology',
            header: 'Technology',
            size: 120,
        },
        {
            accessorKey: 'demoLink',
            header: 'Demo Link',
            size: 120,
            cell: ({ row }) => (
                <div className="line-clamp-2 text-sm">
                    {row.original.demoLink}
                </div>
            ),
        },
        {
            accessorKey: 'description',
            header: 'Description',
            size: 200,
            cell: ({ row }) => (
                <div className="line-clamp-2 text-sm">
                    {row.original.description}
                </div>
            ),
        },
        {
            accessorKey: 'projectCategory.name', // Accessing the name of the project category
            header: 'Category',
            size: 80,
            cell: ({ row }) => (
                <Badge variant="outline">
                    {row.original.projectCategory?.name} {/* Safely access the category name */}
                </Badge>
            ),
        },
        {
            accessorKey: 'projectImage',
            header: 'Image',
            size: 80,
            cell: ({ row }) => (
                <div className="flex flex-wrap gap-2">
                    {Array.isArray(row.original.projectImage) && row.original.projectImage.length > 0 ? (
                        row.original.projectImage.map((imgObj, index) => (

                            <img key={index} src={imgObj.image} alt="" />

                        ))
                    ) : (
                        <span>No Image</span>
                    )}
                </div>
            ),
        },


        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex space-x-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleProjectUpdateOpen(row.original)}
                    >
                        <Pencil className="h-4 w-4 text-orange-500" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleProjectDeleteOpen(row.original)}
                    >
                        <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        asChild
                    >
                        <a href={row.original.demoLink} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 text-blue-500" />
                        </a>
                    </Button>
                </div>
            ),
        },
    ], []);

    const categoryColumns = useMemo<ColumnDef<ProjectCategory>[]>(() => [
        {
            accessorKey: 'id',
            header: 'ID',
            size: 20,
        },
        {
            accessorKey: 'name',
            header: 'Category Name',
            size: 120,
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex space-x-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCategoryUpdateOpen(row.original)}
                    >
                        <Pencil className="h-4 w-4 text-orange-500" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCategoryDeleteOpen(row.original)}
                    >
                        <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                </div>
            ),
        },
    ], []);

    // Project table instance
    const projectTable = useReactTable({
        data: projects,
        columns: projectColumns,
        state: {
            globalFilter: projectFilter,
        },
        onGlobalFilterChange: setProjectFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    // Category table instance
    const categoryTable = useReactTable({
        data: categories,
        columns: categoryColumns,
        state: {
            globalFilter: categoryFilter,
        },
        onGlobalFilterChange: setCategoryFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    // Project handlers
    const handleProjectAddOpen = () => setProjectOpen(true);
    const handleProjectAddClose = () => setProjectOpen(false);


    const handleProjectUpdateOpen = (project: Project) => {
        // console.log("Update dialog opening");
        setSelectedProject(project);
        setProjectUpdateOpen(true);
    };

    const handleProjectDeleteOpen = (project: Project) => {
        // console.log("Delete dialog opening");
        setSelectedProject(project);
        setProjectDeleteOpen(true);
    };

    const handleProjectUpdateClose = () => {
        setProjectUpdateOpen(false);
        setSelectedProject(null);
    };


    const handleAddProject = async () => {
        try {
            await createproject({
                ...newProject,
                projectImage: newProject.projectImage.map((img) => img.image.trim()),
            }).unwrap();

            setProjectOpen(false);
            setnewProject({
                name: "",
                technology: "",
                demoLink: "",
                description: "",
                projectCategory: { id: 0, name: "" },
                projectImage: []
            });
            refetch();
        } catch (error) {
            console.error("Error creating project:", error);
        }
    };


    const handleUpdateProject = async () => {
        if (!selectedProject) return;

        const payload = {
            ...selectedProject,
            projectImage: selectedProject.projectImage.map(img => img.image)
        };

        await updateproject({
            ...payload, id: selectedProject.id

        }).unwrap();
        refetch();
        handleProjectUpdateClose();
    };


    const handleDeleteProject = async () => {
        if (!selectedProject) return;
        await deleteproject(selectedProject.id).unwrap();
        refetch();
    };

    // Category handlers
    const handleCategoryAddOpen = () => setCategoryOpen(true);
    const handleCategoryAddClose = () => setCategoryOpen(false);
    const handleCategoryDeleteOpen = (category: ProjectCategory) => {
        setSelectedCategory(category);
        setCategoryDeleteOpen(true);
    };

    const handleCategoryUpdateOpen = (category: ProjectCategory) => {
        setSelectedCategory(category);
        setCategoryUpdateOpen(true);
    };
    const handleCategoryUpdateClose = () => {
        setCategoryUpdateOpen(false);
        setSelectedCategory(null);
    };

    const handleAddCategory = async () => {
        try {
            await createprojectCategory(newProjectCateogry).unwrap();
            setCategoryOpen(false);
            setnewProjectCateogry({
                name: ""
            });
            refetch();
        } catch (error) {
            console.error("Error creating education:", error);
        }
    };

    const handleUpdateCategory = async () => {
        if (!selectedCategory) return;
        await updateprojectCategory({ ...selectedCategory, id: selectedCategory.id }).unwrap();
        refetch();
        handleCategoryUpdateClose()
    };

    const handleDeleteCategory = async () => {
        if (!selectedCategory) return;
        await deleteprojectCategory(selectedCategory.id).unwrap();
        refetch();
    };

    return (
        <div className="space-y-4 px-5">
            <div className="flex justify-between items-center">
                <h2 className="text-lg text-[hsl(var(--accent))] font-semibold">Projects</h2>
            </div>

            <Tabs defaultValue="projects" className="w-full ">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="projects" className='transition-all duration-300 data-[state=active]:border-[hsl(var(--accent))] data-[state=active]:text-white'>Projects</TabsTrigger>
                    <TabsTrigger value="categories" className='transition-all duration-300 data-[state=active]:border-[hsl(var(--accent))] data-[state=active]:text-white'>Categories</TabsTrigger>
                </TabsList>

                <TabsContent value="projects" >
                    <div className="space-y-4 w-[100%]">
                        <div className="flex justify-between items-center space-x-4">
                            <Input
                                placeholder="Search projects..."
                                value={projectFilter}
                                onChange={(e) => setProjectFilter(e.target.value)}
                                className="max-w-md"
                            />
                            <Button
                                onClick={handleProjectAddOpen}
                                className="bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-white"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Project
                            </Button>
                        </div>



                        <div className="w-full overflow-auto ">
                            <Table >
                                <TableHeader>
                                    {projectTable.getHeaderGroups().map((headerGroup) => (
                                        <TableRow key={headerGroup.id}>
                                            {headerGroup.headers.map((header) => (
                                                <TableHead key={header.id}>
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                </TableHead>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableHeader>
                                <TableBody>
                                    {projectTable.getRowModel().rows?.length ? (
                                        projectTable.getRowModel().rows.map((row) => (
                                            <TableRow key={row.id}>
                                                {row.getVisibleCells().map((cell) => (
                                                    <TableCell
                                                        className="max-w-[300px] whitespace-normal "
                                                        key={cell.id}
                                                    >
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </TableCell>

                                                ))}
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={projectColumns.length} className="h-24 text-center">
                                                No projects found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Add Project Dialog */}
                        <Dialog open={projectOpen} onOpenChange={setProjectOpen}>
                            <DialogContent className="bg-black overflow-auto max-h-[90vh]">
                                <DialogHeader>
                                    <DialogTitle>Add New Project</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium">Title</label>
                                        <Input
                                            value={newProject.name}
                                            onChange={(e) => setnewProject({ ...newProject, name: e.target.value })}
                                        />                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium">Description</label>
                                        <Textarea
                                            value={newProject.description}
                                            onChange={(e) => setnewProject({ ...newProject, description: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium">Demo link</label>
                                            <Input
                                                value={newProject.demoLink}
                                                onChange={(e) =>
                                                    setnewProject({ ...newProject, demoLink: e.target.value })
                                                }
                                            />

                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium">Category</label>
                                            <select
                                                className='bg-black text-sm'
                                                value={newProject.projectCategoryId}
                                                onChange={(e) =>
                                                    setnewProject({
                                                        ...newProject,
                                                        projectCategoryId: Number(e.target.value),
                                                    })
                                                }
                                            >
                                                <option value="">Select a category</option>
                                                {categories.map((category: ProjectCategory) => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>

                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium">Tools (comma separated)</label>
                                        <Input value={newProject.technology}
                                            onChange={(e) => setnewProject({ ...newProject, technology: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium">Image URL</label>
                                        <Input
                                            value={newProject.projectImage.map(img => img.image).join(", ")} // Convert array to string
                                            onChange={(e) => {
                                                const urls = e.target.value.split(',')
                                                    .map(url => url.trim())
                                                    .filter(url => url) // Filter out empty strings
                                                    .map(url => ({ image: url })); // Convert back to ProjectImage format

                                                setnewProject({ ...newProject, projectImage: urls });
                                            }}
                                        />

                                    </div>

                                    <div className="flex justify-end space-x-2 pt-4">
                                        <Button variant="outline" onClick={handleProjectAddClose}>
                                            Cancel
                                        </Button>
                                        <Button
                                            className="bg-[hsl(var(--accent))]"
                                            onClick={handleAddProject}
                                        >
                                            Add Project
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>

                        {/* //  Update Project Dialog */}
                        <Dialog open={projectUpdateOpen} onOpenChange={setProjectUpdateOpen}>
                            <DialogContent className="bg-black overflow-auto max-h-[90vh]">
                                <DialogHeader>
                                    <DialogTitle>Update Project</DialogTitle>
                                </DialogHeader>
                                {selectedProject && (
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium">Title</label>
                                            <Input
                                                value={selectedProject.name}
                                                onChange={(e) => setSelectedProject({
                                                    ...selectedProject,
                                                    name: e.target.value
                                                })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium">Description</label>
                                            <Textarea
                                                value={selectedProject.description}
                                                onChange={(e) => setSelectedProject({
                                                    ...selectedProject,
                                                    description: e.target.value
                                                })}
                                                className="min-h-[100px]"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium">Demo link</label>
                                                <Input
                                                    value={selectedProject.demoLink}
                                                    onChange={(e) => setSelectedProject({
                                                        ...selectedProject,
                                                        demoLink: e.target.value
                                                    })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium">Category</label>
                                                <select
                                                    value={selectedProject.projectCategory?.id || ""}
                                                    onChange={(e) => {
                                                        const selectedId = Number(e.target.value);
                                                        const selectedCategory = categories.find((category: ProjectCategory) => category.id === selectedId);

                                                        setSelectedProject({
                                                            ...selectedProject,
                                                            projectCategory: selectedCategory || { id: 0, name: "" } // Default to an empty object if not found
                                                        });
                                                    }}
                                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    <option value="">Select a category</option>
                                                    {categories.map((category: ProjectCategory) => (
                                                        <option key={category.id} value={category.id}>
                                                            {category.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium">Technology</label>
                                            <Input
                                                value={selectedProject.technology}
                                                onChange={(e) => setSelectedProject({
                                                    ...selectedProject,
                                                    technology: e.target.value
                                                })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium">Image URLs (comma separated)</label>
                                            <Input
                                                value={selectedProject.projectImage.map(img => img.image).join(", ")}
                                                onChange={(e) => setSelectedProject({
                                                    ...selectedProject,
                                                    projectImage: e.target.value.split(",")
                                                        .map(url => url.trim())
                                                        .filter(url => url)
                                                        .map(url => ({ image: url }))
                                                })}
                                            />
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {selectedProject.projectImage.map((imgObj, index) => (
                                                    imgObj.image.trim() && (
                                                        <div key={index} className="relative group">
                                                            <img
                                                                src={imgObj.image.trim()}
                                                                alt={`Project preview ${index}`}
                                                                className="h-20 w-20 object-cover rounded border"
                                                                onError={(e) => {
                                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                                }}
                                                            />
                                                            <button
                                                                type="button"
                                                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                                                onClick={() => {
                                                                    const updatedImages = [...selectedProject.projectImage];
                                                                    updatedImages.splice(index, 1);
                                                                    setSelectedProject({
                                                                        ...selectedProject,
                                                                        projectImage: updatedImages
                                                                    });
                                                                }}
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    )
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex justify-end space-x-2 pt-4">
                                            <Button variant="outline" onClick={handleProjectUpdateClose}>
                                                Cancel
                                            </Button>
                                            <Button
                                                className="bg-[hsl(var(--accent))]"
                                                onClick={handleUpdateProject}
                                            >
                                                Update Project
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </DialogContent>
                        </Dialog>

                        {/* Delete Project Dialog */}
                        <AlertDialog open={projectDeleteOpen} onOpenChange={setProjectDeleteOpen}>
                            <AlertDialogContent className="bg-black">
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will permanently delete the project "{selectedProject?.name}".
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDeleteProject}
                                        className="bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90"
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </TabsContent>

                {/* Categories Tab */}
                <TabsContent value="categories">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center space-x-4">
                            <Input
                                placeholder="Search categories..."
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="max-w-md"
                            />
                            <Button
                                onClick={handleCategoryAddOpen}
                                className="bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-white"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Category
                            </Button>
                        </div>

                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    {categoryTable.getHeaderGroups().map((headerGroup) => (
                                        <TableRow key={headerGroup.id}>
                                            {headerGroup.headers.map((header) => (
                                                <TableHead key={header.id}>
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                </TableHead>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableHeader>
                                <TableBody>
                                    {categoryTable.getRowModel().rows?.length ? (
                                        categoryTable.getRowModel().rows.map((row) => (
                                            <TableRow key={row.id}>
                                                {row.getVisibleCells().map((cell) => (
                                                    <TableCell key={cell.id}>
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={categoryColumns.length} className="h-24 text-center">
                                                No categories found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Add Category Dialog */}
                        <Dialog open={categoryOpen} onOpenChange={setCategoryOpen}>
                            <DialogContent className="bg-black">
                                <DialogHeader>
                                    <DialogTitle>Add New Category</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium">Category Name</label>

                                        <Input
                                            value={newProjectCateogry.name}
                                            onChange={(e) => setnewProjectCateogry({ ...newProjectCateogry, name: e.target.value })}
                                        />


                                    </div>
                                    <div className="flex justify-end space-x-2 pt-4">
                                        <Button variant="outline" onClick={handleCategoryAddClose}>
                                            Cancel
                                        </Button>
                                        <Button
                                            className="bg-[hsl(var(--accent))]"
                                            onClick={() => handleAddCategory()}
                                        >
                                            Add Category
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>

                        {/* Update Category Dialog */}
                        <Dialog open={categoryUpdateOpen} onOpenChange={setCategoryUpdateOpen}>
                            <DialogContent className="bg-black">
                                <DialogHeader>
                                    <DialogTitle>Update Category</DialogTitle>
                                </DialogHeader>
                                {selectedCategory && (
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium">Category Name</label>
                                            <Input
                                                value={selectedCategory.name}
                                                onChange={(e) =>
                                                    setSelectedCategory({ ...selectedCategory, name: e.target.value })
                                                }
                                            />
                                        </div>
                                        <div className="flex justify-end space-x-2 pt-4">
                                            <Button variant="outline" onClick={handleCategoryUpdateClose}>
                                                Cancel
                                            </Button>
                                            <Button
                                                className="bg-[hsl(var(--accent))]"
                                                onClick={handleUpdateCategory}
                                            >
                                                Update Category
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </DialogContent>
                        </Dialog>

                        {/* Delete Category Dialog */}
                        <AlertDialog open={categoryDeleteOpen} onOpenChange={setCategoryDeleteOpen}>
                            <AlertDialogContent className="bg-black">
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will permanently delete the category "{selectedCategory?.name}" and update all projects in this category to "Uncategorized".
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDeleteCategory}
                                        className="bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90"
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </TabsContent>
            </Tabs>
        </div >
    );
};

export default Project;