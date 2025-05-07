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
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { flexRender } from '@tanstack/react-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    useGetskillQuery,
    useCreateskillMutation,
    useDeleteskillMutation,
    useUpdateSkillMutation,
} from '@/services/skillService';
import {
    useCreateskillCategoryMutation,
    useDeleteskillCategoryMutation,
    useUpdateskillCategoryMutation,
    useGetskillCategoryQuery,
} from '@/services/skillCategoryService';

type SkillItem = {
    id: number;
    name: string;
    proficiency: string;
    icon: string;
    skillCategoryId: number;
};

type SkillCategory = {
    id: number;
    name: string;
    skillItems: SkillItem[];
};

const SkillsPage = () => {
    // Skills and form state
    const [skillOpen, setSkillOpen] = useState(false);
    const [skillDeleteOpen, setSkillDeleteOpen] = useState(false);
    const [skillUpdateOpen, setSkillUpdateOpen] = useState(false);
    const [selectedSkill, setSelectedSkill] = useState<SkillItem | null>(null);
    const [skillFilter, setSkillFilter] = useState('');
    const [skillName, setSkillName] = useState("");
    const [skillProficiency, setSkillProficiency] = useState("");
    const [skillCategoryId, setSkillCategoryId] = useState<number | null>(null);
    const [skillIcon, setSkillIcon] = useState("");


    console.log(skillName, skillProficiency, skillCategoryId, skillIcon)
    // Categories state
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [categoryDeleteOpen, setCategoryDeleteOpen] = useState(false);
    const [categoryUpdateOpen, setCategoryUpdateOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<SkillCategory | null>(null);
    const [categoryFilter, setCategoryFilter] = useState('');

    // RTK Query hooks for skills
    const { data: skillsData, isLoading: skillsLoading, refetch: refetchSkills } = useGetskillQuery("");
    const skills = skillsData?.data || []; // Adjust according to your API response structure
    console.log(skills)
    const [createSkill] = useCreateskillMutation();
    const [deleteSkill] = useDeleteskillMutation();
    const [updateSkill] = useUpdateSkillMutation();

    // RTK Query hooks for categories
    const { data: categoriesData, isLoading: categoriesLoading, refetch: refetchCategories } = useGetskillCategoryQuery("");
    const category = categoriesData?.data || []; // Adjust according to your API response structure

    const [createSkillCategory] = useCreateskillCategoryMutation();
    const [deleteSkillCategory] = useDeleteskillCategoryMutation();
    const [updateSkillCategory] = useUpdateskillCategoryMutation();
    const resetSkillForm = () => {
        setSkillName("");
        setSkillProficiency("");
        setSkillCategoryId(null);
        setSkillIcon("");
        setSelectedSkill(null);
    };

    const [newSkill, setnewSkill] = useState<Omit<SkillItem, 'id'>>({
        name: "",
        proficiency: "",
        icon: "",
        skillCategoryId: 0

    });

    const skillColumns = useMemo<ColumnDef<SkillItem & { categoryName: string }>[]>(() => [
        {
            accessorKey: 'id',
            header: 'ID',
            size: 20,
        },
        {
            accessorKey: 'name',
            header: 'Skill Name',
            size: 80,
        },
        {
            accessorKey: 'proficiency',
            header: 'Proficiency',
            size: 100,
        },
        {
            accessorKey: 'skillCategory.name',
            header: 'Category',
            size: 80,
        },
        {
            accessorKey: 'icon',
            header: 'Icon',
            size: 60,
            cell: ({ row }) => (
                <div>
                    <img className='text-lg w-[26px] h-[26px]' src={row.original.icon} alt={row.original.icon} />
                </div>
            ),
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSkillUpdateOpen(row.original)}
                    >
                        <Pencil className="h-4 w-4 text-orange-500" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSkillDeleteOpen(row.original)}
                    >
                        <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                </div>
            ),
        },
    ], []);

    const categoryColumns = useMemo<ColumnDef<SkillCategory>[]>(() => [
        {
            accessorKey: 'id',
            header: 'ID',
            size: 20,
        },
        {
            accessorKey: 'name',
            header: 'Category Name',
            size: 80,
        },

        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex">
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

    const skillTable = useReactTable({
        data: skills || [],
        columns: skillColumns,
        state: {
            globalFilter: skillFilter,
        },
        onGlobalFilterChange: setSkillFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    const categoryTable = useReactTable({
        data: category || [],

        columns: categoryColumns,
        state: {
            globalFilter: categoryFilter,
        },
        onGlobalFilterChange: setCategoryFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    // Skill handlers
    const handleSkillAddOpen = () => {
        resetSkillForm();
        setSkillOpen(true);
    };

    const handleSkillAddClose = () => {
        setSkillOpen(false);
        resetSkillForm();
    };

    const handleSkillDeleteOpen = (skill: SkillItem) => {
        setSelectedSkill(skill);
        setSkillDeleteOpen(true);
    };

    const handleSkillDeleteClose = () => {
        setSkillDeleteOpen(false);
        setSelectedSkill(null);
    };

    const handleSkillUpdateOpen = (skill: SkillItem) => {
        setSelectedSkill(skill);
        setSkillUpdateOpen(true);
    };

    const handleSkillUpdateClose = () => {
        setSkillUpdateOpen(false);
        setSelectedSkill(null);
        resetSkillForm();
    };

    const handleAddSkill = async () => {
        try {
            await createSkill(newSkill).unwrap();
            resetSkillForm(); // Reset form after adding
            refetchSkills();
        } catch (error) {
            console.error("Error creating skill:", error);
        }
    };

    const handleUpdateSkill = async () => {
        if (!selectedSkill) return; // Check if selectedSkill is null
        try {
            await updateSkill({ ...selectedSkill, id: selectedSkill.id }).unwrap();
            refetchSkills();
            handleSkillUpdateClose(); // Close dialog after update
        } catch (error) {
            console.error("Error updating skill:", error);
        }
    };
    const handleDeleteSkill = async () => {
        if (!selectedSkill) return;
        try {
            await deleteSkill(selectedSkill.id).unwrap();
            refetchSkills();
            handleSkillDeleteClose();
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    // Category handlers
    const handleCategoryAddOpen = () => setCategoryOpen(true);
    const handleCategoryAddClose = () => setCategoryOpen(false);
    const handleCategoryDeleteOpen = (category: SkillCategory) => {
        setSelectedCategory(category);
        setCategoryDeleteOpen(true);
    };
    const handleCategoryDeleteClose = () => {
        setCategoryDeleteOpen(false);
        setSelectedCategory(null);
    };
    const handleCategoryUpdateOpen = (category: SkillCategory) => {
        setSelectedCategory(category);
        setCategoryUpdateOpen(true);
    };
    const handleCategoryUpdateClose = () => {
        setCategoryUpdateOpen(false);
        setSelectedCategory(null);
    };

    const handleAddCategory = async (newCategory: Omit<SkillCategory, 'id' | 'userId' | 'skillItems'>) => {
        try {
            await createSkillCategory(newCategory).unwrap();
            refetchCategories();
            handleCategoryAddClose();
        } catch (error) {
            console.error('Failed to create category:', error);
        }
    };

    const handleUpdateCategory = async (updatedCategory: SkillCategory) => {
        try {
            await updateSkillCategory({
                id: updatedCategory.id,
                name: updatedCategory.name
            }).unwrap();
            refetchCategories();
            handleCategoryUpdateClose();
        } catch (error) {
            console.error('Failed to update category:', error);
        }
    };

    const handleDeleteCategory = async () => {
        if (selectedCategory) {
            try {
                await deleteSkillCategory(selectedCategory.id).unwrap();
                refetchCategories();
                refetchSkills();
                handleCategoryDeleteClose();
            } catch (error) {
                console.error('Failed to delete category:', error);
            }
        }
    };

    if (skillsLoading || categoriesLoading) return <div>Loading...</div>;

    return (
        <div className="space-y-4 px-5">
            <div className="flex justify-between items-center">
                <h2 className="text-lg text-[hsl(var(--accent))] font-semibold">Skills</h2>
            </div>

            <Tabs defaultValue="skills" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="skills" className='transition-all duration-300 data-[state=active]:border-[hsl(var(--accent))] data-[state=active]:text-white'>Skills</TabsTrigger>
                    <TabsTrigger value="categories" className='transition-all duration-300 data-[state=active]:border-[hsl(var(--accent))] data-[state=active]:text-white'>Categories</TabsTrigger>
                </TabsList>

                <TabsContent value="skills">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center space-x-4">
                            <Input
                                placeholder="Search skills..."
                                value={skillFilter}
                                onChange={(e) => setSkillFilter(e.target.value)}
                                className="max-w-md"
                            />
                            <Button
                                onClick={handleSkillAddOpen}
                                className="bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-white"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Skill
                            </Button>
                        </div>

                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    {skillTable.getHeaderGroups().map((headerGroup) => (
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
                                    {skillTable.getRowModel().rows?.length ? (
                                        skillTable.getRowModel().rows.map((row) => (
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
                                            <TableCell colSpan={skillColumns.length} className="h-24 text-center">
                                                No skills found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Add Skill Dialog */}
                        <Dialog open={skillOpen} onOpenChange={setSkillOpen}>
                            <DialogContent className="bg-black">
                                <DialogHeader>
                                    <DialogTitle>Add New Skill</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium">Skill Name</label>
                                        <Input
                                            value={newSkill.name}
                                            onChange={(e) => setnewSkill({ ...newSkill, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium">Proficiency Level (1-100)</label>
                                        <Input
                                            type="number"
                                            min={1}
                                            max={100}
                                            value={newSkill.proficiency}
                                            onChange={(e) => setnewSkill({ ...newSkill, proficiency: e.target.value })}
                                            placeholder="e.g. 85" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium">Category</label>
                                        <select
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm bg-black border-gray-700"
                                            value={newSkill.skillCategoryId}
                                            onChange={(e) => setnewSkill({ ...newSkill, skillCategoryId: Number(e.target.value) })}

                                        >
                                            <option value="">Select a category</option>
                                            {Array.isArray(category) &&
                                                category.map((category) => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium">Icon (URL)</label>
                                        <Input
                                            type="url"
                                            value={newSkill.icon}
                                            onChange={(e) => setnewSkill({ ...newSkill, icon: e.target.value })}

                                            placeholder="https://example.com/icon.png"
                                        />
                                    </div>
                                    <div className="flex justify-end space-x-2 pt-4">
                                        <Button variant="outline" onClick={handleSkillAddClose}>
                                            Cancel
                                        </Button>
                                        <Button
                                            className="bg-[hsl(var(--accent))]"
                                            onClick={handleAddSkill}
                                        >
                                            Add Skill
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>

                        {/* Update Skill Dialog */}
                        <Dialog open={skillUpdateOpen} onOpenChange={setSkillUpdateOpen}>
                            <DialogContent className="bg-black">
                                <DialogHeader>
                                    <DialogTitle>Update Skill</DialogTitle>
                                </DialogHeader>
                                {selectedSkill ? (
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium">Skill Name</label>
                                            <Input
                                                value={selectedSkill.name}
                                                onChange={(e) =>
                                                    setSelectedSkill({ ...selectedSkill, name: e.target.value })
                                                } />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium">Proficiency (0-100)</label>
                                            <Input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={selectedSkill.proficiency}
                                                onChange={(e) =>
                                                    setSelectedSkill({ ...selectedSkill, proficiency: e.target.value })
                                                }
                                                placeholder="e.g. 80"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium">Category</label>
                                            <select
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm bg-black border-gray-700"
                                                value={selectedSkill.skillCategoryId}
                                                onChange={(e) =>
                                                    setSelectedSkill({ ...selectedSkill, skillCategoryId: Number(e.target.value) })
                                                }                                            >
                                                <option value="">Select a category</option>
                                                {Array.isArray(category) &&
                                                    category.map((category) => (
                                                        <option key={category.id} value={category.id}>
                                                            {category.name}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium">Icon URL</label>
                                            <Input
                                                value={selectedSkill.icon}
                                                onChange={(e) =>
                                                    setSelectedSkill({ ...selectedSkill, icon: e.target.value })
                                                } />
                                        </div>
                                        <div className="flex justify-end space-x-2 pt-4">
                                            <Button variant="outline" onClick={handleSkillUpdateClose}>Cancel
                                            </Button>
                                            <Button
                                                className="bg-[hsl(var(--accent))]"
                                                onClick={handleUpdateSkill}
                                            >
                                                Update Skill
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <p>No skill selected.</p>
                                )}
                            </DialogContent>
                        </Dialog>

                        {/* Delete Skill Dialog */}
                        <AlertDialog open={skillDeleteOpen} onOpenChange={setSkillDeleteOpen}>
                            <AlertDialogContent className="bg-black">
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will permanently delete the skill "{selectedSkill?.name || 'N/A'}".
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDeleteSkill}
                                        className="bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90"
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </TabsContent>

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
                                            placeholder="e.g. Programming"
                                            id="categoryName"
                                        />
                                    </div>
                                    <div className="flex justify-end space-x-2 pt-4">
                                        <Button variant="outline" onClick={handleCategoryAddClose}>
                                            Cancel
                                        </Button>
                                        <Button
                                            className="bg-[hsl(var(--accent))]"
                                            onClick={async () => {
                                                const input = document.getElementById('categoryName') as HTMLInputElement;
                                                if (input && input.value) {
                                                    await handleAddCategory({
                                                        name: input.value,
                                                    });
                                                }
                                            }}
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
                                                defaultValue={selectedCategory.name}
                                                id="updatedCategoryName"
                                            />
                                        </div>

                                        <div className="flex justify-end space-x-2 pt-4">
                                            <Button variant="outline" onClick={handleCategoryUpdateClose}>
                                                Cancel
                                            </Button>
                                            <Button
                                                className="bg-[hsl(var(--accent))]"
                                                onClick={() => {
                                                    const input = document.getElementById('updatedCategoryName') as HTMLInputElement;
                                                    if (input && input.value) {
                                                        handleUpdateCategory({
                                                            ...selectedCategory,
                                                            name: input.value,
                                                        });
                                                    }
                                                }}
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
                                        This will permanently delete the category "{selectedCategory?.name}" and all skills associated with it.
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
        </div>
    );
};

export default SkillsPage;