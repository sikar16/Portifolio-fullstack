import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaQuoteLeft } from 'react-icons/fa';
import { useGetUserPortifolioQuery } from '@/services/portifolioService';
import { useParams } from 'react-router-dom';
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from 'react';

function Testimony() {
    const { firstName } = useParams();
    const { data, isLoading } = useGetUserPortifolioQuery(firstName);
    const userData = data?.data;

    const testimonialCount = userData?.testimonials?.length || 0;

    const settings = {
        dots: true,
        infinite: testimonialCount > 1,
        speed: 500,
        slidesToShow: Math.min(testimonialCount, 3),
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: Math.min(testimonialCount, 2),
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }
        ]
    };


    if (isLoading) return <div>Loading testimonials...</div>;
    if (!userData) return <div>No user data found</div>;
    if (!userData.testimonials || userData.testimonials.length === 0) {
        return (
            <section id='testimony' className="py-16">
                <div className="px-10 text-center">
                    <h2 className="text-lg font-bold text-[hsl(var(--accent))] mb-4">
                        Client Testimonials
                    </h2>
                    <p className="text-gray-300">No testimonials available yet.</p>
                </div>
            </section>
        );
    }

    return (
        <section id='testimony' className="py-16">
            <div className="px-10">
                <div className="text-center mb-12">
                    <h2 className="text-lg font-bold text-[hsl(var(--accent))] mb-4">
                        Client Testimonials
                    </h2>
                    <p className="text-gray-300 max-w-2xl mx-auto text-sm">
                        Here's what clients and collaborators say about working with me
                    </p>
                </div>

                <Slider {...settings} className="testimonial-slider">
                    {userData.testimonials.map((testimonial: { id: Key | null | undefined; rate: number; feedback: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; reviewerFullName: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; reviewerTitle: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; dateOfReview: string | number | Date; }) => (
                        <div key={testimonial.id} className="px-3 focus:outline-none">
                            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 h-full transition-all hover:border-accent">
                                <div className="flex mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <svg
                                            key={i}
                                            className={`w-3 h-3 ${i < testimonial.rate ? 'text-yellow-400' : 'text-gray-600'}`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>

                                <FaQuoteLeft className="text-accent/30 mb-4 text-sm" />

                                <blockquote className="text-gray-300 mb-6 italic text-sm">
                                    {testimonial.feedback}
                                </blockquote>

                                <div className="mt-6 pt-4 border-t border-gray-700">
                                    <div className="font-bold text-white">{testimonial.reviewerFullName}</div>
                                    <div className="text-gray-400 text-sm">{testimonial.reviewerTitle}</div>
                                    <div className="text-accent text-xs mt-1">
                                        {new Date(testimonial.dateOfReview).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </section>
    );
}

export default Testimony;