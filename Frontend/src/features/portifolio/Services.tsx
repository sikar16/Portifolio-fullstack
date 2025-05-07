import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { useGetUserPortifolioQuery } from '@/services/portifolioService';
import { useParams } from 'react-router-dom';
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, Key } from 'react';

export default function Services() {

    const { firstName } = useParams();
    const { data } = useGetUserPortifolioQuery(firstName);
    const userData = data?.data;

    console.log(userData)

    const services = userData?.services?.map((service: { ServiceItem: any[]; Feature: { name: any; }[]; }) => {
        const item = service.ServiceItem?.[0];
        return {
            icon: (
                <img
                    src={item?.icon}
                    alt={item?.name}
                    className="w-10 h-10 object-contain"
                />
            ),
            title: item?.name,
            description: item?.description,
            features: service.Feature?.map((f: { name: any; }) => f.name)
        };
    }) || [];


    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2,
                }
            },

        ]
    };

    return (
        <section id="service" className="py-8 px-4 sm:px-6 lg:px-8 text-white">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <span className="text-[hsl(var(--accent))] font-mono tracking-wider block text-sm sm:text-base">
                        MY SERVICES
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold mt-4 mb-4">
                        Transforming Your <span className="text-accent">Vision</span> Into Reality
                    </h2>
                    <p className="mx-auto text-sm  text-gray-300">
                        Professional production services tailored to bring your creative concepts to life with technical precision and artistic flair.
                    </p>
                </div>

                <div className="block lg:hidden mx-[3%]">
                    <Slider {...sliderSettings}>
                        {services.map((service: { icon: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; title: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; description: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; features: (string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined)[]; }, index: Key | null | undefined) => (
                            <div key={index} className="px-2">
                                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                                    <div className="mb-4">{service.icon}</div>
                                    <h3 className="text-base font-bold mb-2">{service.title}</h3>
                                    <p className="text-gray-300 text-sm mb-3">{service.description}</p>
                                    <ul className="space-y-2">
                                        {service.features.map((feature: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined, i: Key | null | undefined) => (
                                            <li key={i} className="flex text-sm">
                                                <span className="text-[hsl(var(--accent))] mr-2">✓</span>
                                                <span className="text-gray-300">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>

                <div className="hidden lg:grid lg:grid-cols-3  gap-6">
                    {services.map((service: { icon: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; title: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; description: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; features: (string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined)[]; }, index: Key | null | undefined) => (
                        <div
                            key={index}
                            className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-accent transition-all duration-300 hover:-translate-y-2"
                        >
                            <div className="mb-4">{service.icon}</div>
                            <h3 className="text-lg font-bold mb-2">{service.title}</h3>
                            <p className="text-gray-300 text-sm mb-3">{service.description}</p>
                            <ul className="space-y-2">
                                {service.features.map((feature: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined, i: Key | null | undefined) => (
                                    <li key={i} className="flex text-sm">
                                        <span className="text-[hsl(var(--accent))] mr-2">✓</span>
                                        <span className="text-gray-300">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
