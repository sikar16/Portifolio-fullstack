import { useMemo, useState, useEffect } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    ColumnDef,
} from "@tanstack/react-table";
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
import { Plus, Pencil, Trash2, Check } from "lucide-react";
import { flexRender } from "@tanstack/react-table";
import { Textarea } from "@/components/ui/textarea";
import {
    useCreateServiceMutation,
    useGetServiceQuery,
    useCreateGeneralDescribtionMutation,
    useGetgeneralDesQuery,
    useUpdateServiceMutation,
    useDeleteServiceMutation

} from "@/services/ServicessService";

type Feature = {
    id: number;
    name: string;
    serviceId: number;
    serviceItemId: number | null;
};
type ServiceItem = {
    id: number;
    name: string;
    description: string;
    icon?: string;
};

type Service = {
    id: number;
    name: string;
    description: string;
    Feature: Feature[];
    icon?: string;
    ServiceItem?: ServiceItem[];
};

type ServiceTableItem = {
    id: number;
    name: string;
    description: string;
    features: (string | Feature)[];
    icon?: string;
};

const Service = () => {
    const [open, setOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState<Service | null>(null);
    const [globalFilter, setGlobalFilter] = useState("");
    const [isEditingDesc, setIsEditingDesc] = useState(false);
    const [description, setDescription] = useState("");
    const [updateService] = useUpdateServiceMutation();
    const [deleteService] = useDeleteServiceMutation();

    // General Description queries
    const { data: generalDescData, isLoading: isGeneralDescLoading, error: generalDescError } = useGetgeneralDesQuery("");
    const [updateGeneralDescription] = useCreateGeneralDescribtionMutation();
    // console.log(generalDescData?.data[0].content)

    // Service queries
    const { data, isLoading } = useGetServiceQuery("");
    const [createService] = useCreateServiceMutation();

    const [services, setServices] = useState<ServiceTableItem[]>([]);

    // Form states
    const [newServiceData, setNewServiceData] = useState<Omit<ServiceTableItem, "id">>({
        name: "",
        description: "",
        icon: "",
        features: [],

    });
    const [newFeature, setNewFeature] = useState("");

    useEffect(() => {
        console.log("General Description Data:", generalDescData);
        setDescription(generalDescData?.data.content);

    }, [generalDescData]);

    useEffect(() => {
        console.log(data?.data?.services)
        if (data?.data?.services) {
            const tableItems = data.data.services.flatMap((service: Service) => {
                return service.ServiceItem?.map((item: ServiceItem) => ({
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    icon: item.icon,
                    features: service.Feature
                        ?.filter(f => f.serviceItemId === item.id)
                        ?.map(f => f.name) || [],
                })) || [];
            }) || [];

            setServices(tableItems);
        }
    }, [data]);

    const handleSaveDescription = async () => {
        try {

            await updateGeneralDescription({ content: description }).unwrap();
            setIsEditingDesc(false);
        } catch (error) {
            console.error('Failed to save description:', error);
        }
    };

    const handleAddService = async () => {
        try {
            const serviceData = {
                name: newServiceData.name,
                description: newServiceData.description,
                icon: newServiceData.icon,
                features: newServiceData.features
            };

            const response = await createService(serviceData).unwrap();

            if (response.success) {
                const newServiceItem = {
                    id: response.data.serviceItem.id,
                    name: response.data.serviceItem.name,
                    description: response.data.serviceItem.description,
                    icon: response.data.serviceItem.icon,
                    features: response.data.serviceItem.features.map((f: Feature) => f.name),
                };

                setServices(prev => [...prev, newServiceItem]);
                setNewServiceData({
                    name: "",
                    description: "",
                    icon: "",
                    features: []
                });
                setNewFeature("");
                setOpen(false);
            }
        } catch (error) {
            console.error("Failed to create service:", error);
        }
    };

    const handleAddFeatureToNewService = () => {
        if (newFeature) {
            setNewServiceData(prev => ({
                ...prev,
                features: [...prev.features, newFeature]
            }));
            setNewFeature("");
        }
    };

    const handleUpdateService = async (updatedService: Service) => {
        try {
            // Convert features to strings if they're objects
            const features = updatedService.Feature.map(f =>
                typeof f === 'string' ? f : f.name
            );

            const response = await updateService({
                id: updatedService.id,
                name: updatedService.name,
                description: updatedService.description,
                icon: updatedService.icon,
                features: features
            }).unwrap();

            console.log(response)

            setServices(prev =>
                prev.map(service =>
                    service.id === updatedService.id ? {
                        ...service,
                        name: updatedService.name,
                        description: updatedService.description,
                        icon: updatedService.icon,
                        features: features
                    } : service
                )
            );
            setOpenUpdate(false);
        } catch (error) {
            console.error('Failed to update service:', error);
        }
    };

    const handleDeleteService = async (serviceItemId: number) => {
        try {
            await deleteService(serviceItemId).unwrap();
            setServices(prev => prev.filter(service => service.id !== serviceItemId));
            setOpenDelete(false);
        } catch (error) {
            console.error('Failed to delete service:', error);
        }
    };


    const columns = useMemo<ColumnDef<ServiceTableItem>[]>(() => [
        {
            accessorKey: 'id',
            header: 'ID',
            size: 20,
        },
        {
            accessorKey: 'name',
            header: 'Service Name',
            size: 80,
        },
        {
            accessorKey: 'description',
            header: 'Description',
            size: 120,
            cell: ({ row }) => (
                <div className="max-w-[300px] truncate" title={row.original.description}>
                    {row.original.description}
                </div>
            ),
        },
        {
            accessorKey: 'features',
            header: 'Features',
            size: 80,
            cell: ({ row }) => (
                <div className="space-y-1">
                    {row.original.features?.map((feature, index) => {
                        const featureName = typeof feature === 'string' ? feature : feature.name;
                        return (
                            <div key={index} className="text-[12px]">
                                • {featureName}
                            </div>
                        );
                    })}
                </div>
            ),
        },
        {
            accessorKey: 'icon',
            header: 'Icon',
            size: 80,
            cell: ({ row }) => (
                row.original.icon ? (
                    <img
                        src={row.original.icon}
                        alt={row.original.name}
                        className="w-12 h-12 object-cover rounded"
                    />
                ) : (
                    <div className="text-gray-400">No image</div>
                )
            ),
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                            setSelectedRowData({
                                id: row.original.id,
                                name: row.original.name,
                                description: row.original.description,
                                icon: row.original.icon,
                                Feature: row.original.features.map(f =>
                                    typeof f === 'string'
                                        ? { id: 0, name: f, serviceId: 0, serviceItemId: null }
                                        : f
                                ),
                                ServiceItem: []
                            });
                            setOpenUpdate(true);
                        }}
                    >
                        <Pencil className="h-4 w-4 text-orange-500" />
                    </Button>
                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                            setSelectedRowData({
                                id: row.original.id,
                                name: row.original.name,
                                description: row.original.description,
                                icon: row.original.icon,
                                Feature: row.original.features.map(f =>
                                    typeof f === 'string'
                                        ? { id: 0, name: f, serviceId: 0, serviceItemId: null }
                                        : f
                                ),
                                ServiceItem: []
                            });
                            setOpenDelete(true);
                        }}
                    >
                        <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                </div>
            ),
        },
    ], []);

    const table = useReactTable({
        data: services,
        columns,
        state: {
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="space-y-4 px-5">
            <div className="flex justify-between items-center">
                <h2 className="text-lg text-[hsl(var(--accent))] font-semibold">Services</h2>
            </div>
            <div className="flex justify-between items-center space-x-4">
                <Input
                    placeholder="Search..."
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="max-w-md"
                />
                <Button
                    onClick={() => setOpen(true)}
                    className="bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-white"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Service
                </Button>
            </div>

            {/* General Description Section */}
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-sm">Service General Description</h3>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingDesc(!isEditingDesc)}
                >
                    {isEditingDesc ? (
                        <>
                            <Check className="mr-2 h-4 w-4" />
                            Save
                        </>
                    ) : (
                        <>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </>
                    )}
                </Button>
            </div>

            {isEditingDesc ? (
                <div className="space-y-2">
                    <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="min-h-[100px]"
                    />
                    <div className="flex space-x-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsEditingDesc(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSaveDescription}
                            className="bg-[hsl(var(--accent))]"
                        >
                            Save Description
                        </Button>
                    </div>
                </div>
            ) : (
                <p className="text-xs mb-10 whitespace-pre-line">
                    {generalDescError ? "Error loading description" :
                        isGeneralDescLoading ? "Loading..." :
                            description ? description : "No description available"}
                </p>
            )}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
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
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            <p className="text-[12px]">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </p>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    {isLoading ? "Loading..." : "No results."}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Add Service Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="bg-black">
                    <DialogHeader>
                        <DialogTitle>Add Service</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium">Service Name</label>
                            <Input
                                placeholder="Service name"
                                value={newServiceData.name}
                                onChange={(e) => setNewServiceData({ ...newServiceData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium">Service Description</label>
                            <Input
                                placeholder="Service description"
                                value={newServiceData.description}
                                onChange={(e) => setNewServiceData({ ...newServiceData, description: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium">Image URL</label>
                            <Input
                                placeholder="Image URL (optional)"
                                value={newServiceData.icon}
                                onChange={(e) => setNewServiceData({ ...newServiceData, icon: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium">Features</label>
                            <div className="space-y-2">
                                {newServiceData.features.map((feature, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <Input
                                            value={typeof feature === 'string' ? feature : feature.name}
                                            readOnly
                                        />                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setNewServiceData({
                                                    ...newServiceData,
                                                    features: newServiceData.features.filter((_, i) => i !== index)
                                                });
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                ))}
                                <div className="flex gap-2">
                                    <Input
                                        value={newFeature}
                                        onChange={(e) => setNewFeature(e.target.value)}
                                        placeholder="Add new feature"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleAddFeatureToNewService();
                                            }
                                        }}
                                    />
                                    <Button onClick={handleAddFeatureToNewService}>Add</Button>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2 pt-4">
                            <Button variant="outline" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button
                                className="bg-[hsl(var(--accent))]"
                                onClick={handleAddService}
                                disabled={!newServiceData.name || !newServiceData.description}
                            >
                                Add Service
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Update Dialog */}
            {selectedRowData && (
                <Dialog open={openUpdate} onOpenChange={setOpenUpdate}>
                    <DialogContent className="bg-black">
                        <DialogHeader>
                            <DialogTitle>Update Service</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium">Name</label>
                                <Input
                                    value={selectedRowData.name}
                                    onChange={(e) =>
                                        setSelectedRowData({ ...selectedRowData, name: e.target.value })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium">Description</label>
                                <Textarea
                                    value={selectedRowData.description}
                                    onChange={(e) =>
                                        setSelectedRowData({
                                            ...selectedRowData,
                                            description: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium">Image URL</label>
                                <Input
                                    value={selectedRowData.icon || ""}
                                    onChange={(e) =>
                                        setSelectedRowData({
                                            ...selectedRowData,
                                            icon: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium">Features</label>
                                {selectedRowData.Feature.map((feature, idx) => {
                                    const featureValue = typeof feature === 'string' ? feature : feature.name;
                                    return (
                                        <div key={idx}>
                                            <Input
                                                value={featureValue}
                                                onChange={(e) => {
                                                    const newFeatures = [...selectedRowData.Feature];
                                                    newFeatures[idx] = typeof feature === 'string' ?
                                                        { id: 0, name: e.target.value, serviceId: 0, serviceItemId: null } :
                                                        { ...feature, name: e.target.value };
                                                    setSelectedRowData({
                                                        ...selectedRowData,
                                                        Feature: newFeatures
                                                    });
                                                }}
                                            />
                                        </div>
                                    );
                                })}

                                <div className="flex space-x-2">
                                    <Input
                                        value={newFeature}
                                        onChange={(e) => setNewFeature(e.target.value)}
                                        placeholder="Add feature"
                                    />
                                    <Button
                                        variant="ghost"
                                        onClick={() => {
                                            if (newFeature) {
                                                setSelectedRowData({
                                                    ...selectedRowData,
                                                    Feature: [
                                                        ...selectedRowData.Feature,
                                                        { id: 0, name: newFeature, serviceId: 0, serviceItemId: null }
                                                    ]
                                                });
                                                setNewFeature("");
                                            }
                                        }}
                                    >
                                        Add Feature
                                    </Button>
                                </div>
                            </div>
                            <div className="flex justify-end space-x-2 pt-4">
                                <Button variant="outline" onClick={() => setOpenUpdate(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    className="bg-[hsl(var(--accent))]"
                                    onClick={() => handleUpdateService(selectedRowData)}
                                >
                                    Save
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}

            {/* Delete Dialog */}
            <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
                <AlertDialogContent className="bg-black">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action will permanently delete this service.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setOpenDelete(false)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => selectedRowData && handleDeleteService(selectedRowData.id)}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default Service;