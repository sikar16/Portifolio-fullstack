import { useGetUserPortifolioQuery } from '@/services/portifolioService';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { useParams } from 'react-router-dom';

function Contact() {
    const { firstName } = useParams(); // URL param
    const { data } = useGetUserPortifolioQuery(firstName);
    const userData = data?.data;

    const phone = userData?.phoneNumber;
    const email = userData?.email;
    const city = userData?.userInfo?.city;
    const country = userData?.userInfo?.country;

    return (
        <section id='contact' className="pt-10 pb-20 text-white">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-12">
                    <h2 className="text-sm text-[hsl(var(--accent))] font-bold mb-4">Get In Touch</h2>
                    <p className="text-gray-400 max-w-xl mx-auto text-[12px]">
                        Have a question, a project in mind, or just want to say hi? Fill out the form below and I’ll get back to you soon.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                    <div className="bg-gray-800/50 p-8 rounded-2xl shadow-lg">
                        <form className="space-y-6">
                            <div>
                                <label className="block mb-2 text-sm font-medium">Full Name</label>
                                <input type="text" placeholder="Your Name" className="w-full p-3 rounded-lg bg-gray-900/30 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-accent" />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium">Email</label>
                                <input type="email" placeholder="you@example.com" className="w-full p-3 rounded-lg bg-gray-900/30 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-accent" />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium">Message</label>
                                <textarea rows={5} placeholder="Type your message..." className="w-full p-3 rounded-lg bg-gray-900/30 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-accent"></textarea>
                            </div>
                            <button type="submit" className="w-full py-3 px-6 bg-[hsl(var(--accent))] font-semibold rounded-lg hover:bg-accent/90 transition">
                                Send Message
                            </button>
                        </form>
                    </div>

                    {/* Dynamic Contact Info */}
                    <div className="flex flex-col justify-center space-y-6">
                        <div className="flex items-start space-x-4">
                            <FaPhoneAlt className="text-accent text-2xl mt-1" />
                            <div>
                                <h4 className="text-sm font-semibold">Phone</h4>
                                <p className="text-gray-400">{phone}</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <FaEnvelope className="text-accent text-2xl mt-1" />
                            <div>
                                <h4 className="text-sm font-semibold">Email</h4>
                                <p className="text-gray-400">{email}</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <FaMapMarkerAlt className="text-accent text-2xl mt-1" />
                            <div>
                                <h4 className="text-sm font-semibold">Location</h4>
                                <p className="text-gray-400">{`${city}, ${country}`}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Contact;
