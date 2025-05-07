"use client";
import { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Save } from 'lucide-react';
import { useCreateUserMutation, useGetUsersQuery } from '@/services/userProfileService';

type SocialLink = {
    name: string;
    link: string;
};

type FormData = {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    country: string;
    city: string;
    title: string;
    yearsOfExperience: string;
    aboutMe: string;
    cv: string;  // now string, not File
    heroImage: string; // now string, not File
    socialLinks: SocialLink[];
};


function Profile() {
    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        country: '',
        city: '',
        title: '',
        yearsOfExperience: '',
        aboutMe: '',
        cv: '',  // string
        heroImage: '',  // string
        socialLinks: [{ name: '', link: '' }]
    });

    const { data } = useGetUsersQuery("")
    const [createProfileMutation] = useCreateUserMutation();

    useEffect(() => {
        if (data && data.data) {
            const user = data.data;
            setFormData(prev => ({
                ...prev,
                email: user.email || '',
                phoneNumber: user.phoneNumber || '',
                firstName: user.userInfo?.firstName || '',
                lastName: user.userInfo?.lastName || '',
                country: user.userInfo?.country || '',
                city: user.userInfo?.city || '',
                title: user.userDetails?.title || '',
                yearsOfExperience: user.userDetails?.yearsOfExperience?.toString() || '',
                aboutMe: user.userDetails?.aboutMe || '',
                cv: user.userDetails?.cv || '',
                heroImage: user.userDetails?.heroImage || '',
                socialLinks: user.socialLinks?.length ? user.socialLinks : [{ name: '', link: '' }]
            }));
        }
    }, [data]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSocialLinkChange = (index: number, field: keyof SocialLink, value: string) => {
        const newLinks = [...formData.socialLinks];
        if (newLinks[index]) {
            newLinks[index][field] = value;
            setFormData(prev => ({
                ...prev,
                socialLinks: newLinks
            }));
        }
    };

    const addSocialLink = () => {
        setFormData(prev => ({
            ...prev,
            socialLinks: [...prev.socialLinks, { name: '', link: '' }]
        }));
    };

    const removeSocialLink = (index: number) => {
        const newLinks = [...formData.socialLinks];
        newLinks.splice(index, 1);
        setFormData(prev => ({
            ...prev,
            socialLinks: newLinks.length ? newLinks : [{ name: '', link: '' }]
        }));
    };



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await createProfileMutation({
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                userInfo: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    country: formData.country,
                    city: formData.city,
                },
                userDetails: {
                    title: formData.title,
                    yearsOfExperience: parseInt(formData.yearsOfExperience),
                    aboutMe: formData.aboutMe,
                    cv: formData.cv || null,
                    heroImage: formData.heroImage || null,
                },
                socialMediaLink: formData.socialLinks.map(link => ({
                    name: link.name,
                    link: link.link,
                })),
            });


            console.log('Profile created/updated!');
        } catch (error) {
            console.error('Error creating profile:', error);
        }
    };


    return (
        <div className="h-fit w-full px-4">
            <form onSubmit={handleSubmit} className="w-full">
                <p className="text-lg font-medium mt-5 mb-6 text-[hsl(var(--accent))] ">User info</p>

                <div className="flex flex-col md:flex-row w-full gap-6 mb-6">
                    <div className="w-full md:w-1/2 space-y-2">
                        <label htmlFor="firstName" className="block text-xs text-white/60 font-medium">First Name</label>
                        <Input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            placeholder="First Name"
                            className="w-full"
                        />
                    </div>

                    <div className="w-full md:w-1/2 space-y-2">
                        <label htmlFor="lastName" className="block text-xs text-white/60 font-medium">Last Name</label>
                        <Input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            placeholder="Last Name"
                            className="w-full"
                        />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row w-full gap-6 mb-6">
                    <div className="w-full md:w-1/2 space-y-2">
                        <label htmlFor="phoneNumber" className="block text-xs text-white/60 font-medium">Phone number</label>
                        <Input
                            type="text"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            placeholder="Phone Number"
                            className="w-full"
                        />
                    </div>
                    <div className="w-full md:w-1/2 space-y-2">
                        <label htmlFor="email" className="block text-xs text-white/60 font-medium">Email</label>
                        <Input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Email"
                            className="w-full"
                        />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row w-full gap-6 mb-6">
                    <div className="w-full md:w-1/2 space-y-2">
                        <label htmlFor="country" className="block text-xs text-white/60 font-medium">Country</label>
                        <Input
                            type="text"
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            placeholder="Country"
                            className="w-full"
                        />
                    </div>
                    <div className="w-full md:w-1/2 space-y-2">
                        <label htmlFor="city" className="block text-xs text-white/60 font-medium">City</label>
                        <Input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="City"
                            className="w-full"
                        />
                    </div>
                </div>

                <p className="text-lg text-[hsl(var(--accent))]  font-medium mt-10 mb-6">User details</p>

                <div className="flex flex-col md:flex-row w-full gap-6 mb-6">
                    <div className="w-full md:w-1/2 space-y-2">
                        <label htmlFor="title" className="block text-xs text-white/60 font-medium">Title</label>
                        <Input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Title"
                            className="w-full"
                        />
                    </div>
                    <div className="w-full md:w-1/2 space-y-2">
                        <label htmlFor="yearsOfExperience" className="block text-xs text-white/60 font-medium">Years of Experience</label>
                        <Input
                            type="number"
                            id="yearsOfExperience"
                            name="yearsOfExperience"
                            value={formData.yearsOfExperience}
                            onChange={handleInputChange}
                            placeholder="Years of Experience"
                            className="w-full"
                        />
                    </div>
                </div>

                <div className="w-full mb-6">
                    <label htmlFor="aboutMe" className="block text-xs text-white/60 font-medium mb-2">About Me</label>
                    <Textarea
                        id="aboutMe"
                        name="aboutMe"
                        value={formData.aboutMe}
                        onChange={handleInputChange}
                        placeholder="About Me"
                        className="min-h-[150px] w-full"
                    />
                </div>

                <div className="flex flex-col w-full gap-6 mb-6">
                    <div className="w-full md:w-1/2 space-y-2">
                        <label htmlFor="cv" className="block text-xs text-white/60 font-medium">CV</label>
                        <Input
                            type="text"
                            id="cv"
                            name="cv"
                            value={formData.cv}
                            onChange={handleInputChange}
                            placeholder="Paste CV URL here"
                            className="w-full"
                        />

                    </div>
                    <div className="w-full md:w-1/2 space-y-2">
                        <label htmlFor="heroImage" className="block text-xs text-white/60 font-medium">Hero Image</label>
                        <Input
                            type="text"
                            id="heroImage"
                            name="heroImage"
                            value={formData.heroImage}
                            onChange={handleInputChange}
                            placeholder="Paste Hero Image URL here"
                            className="w-full"
                        />

                    </div>
                </div>

                <div className="w-full mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-medium">Social Links</h3>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addSocialLink}
                            className="gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Add Link
                        </Button>
                    </div>
                    <div className="space-y-4">
                        {formData.socialLinks.map((link, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <div className="flex-1">
                                    <Input
                                        type="text"
                                        placeholder="Image URL"
                                        value={link.name}
                                        onChange={(e) => handleSocialLinkChange(index, 'name', e.target.value)}
                                        className="w-full"
                                    />
                                </div>
                                <div className="flex-1">
                                    <Input
                                        type="text"
                                        placeholder="Link"
                                        value={link.link}
                                        onChange={(e) => handleSocialLinkChange(index, 'link', e.target.value)}
                                        className="w-full"
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeSocialLink(index)}
                                    className="text-red-500 hover:text-red-600"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end w-full mt-8 mb-10">
                    <Button
                        type="submit"
                        className='bg-[hsl(var(--accent))] hover:bg-green-900 cursor-pointer text-white hover:bg-accent/90 w-full md:w-auto px-8 py-6 text-md'
                    >
                        <Save className="h-5 w-5 mr-2" />
                        Save

                    </Button>

                </div>
            </form>
        </div>
    );
}

export default Profile;