'use client'

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, FreeMode, Navigation, Pagination } from 'swiper/modules'

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './slideshow.css';



interface Props {
    images: string[],
    title: string,
    className?: string
}

export const ProductMobileSlideshow = ({ images, title, className }: Props) => {

    return (
        <div className={className}>

            <Swiper
                style={{
                    width: '100vw',
                    height: '500px'
                }}
                pagination
                navigation={true}
                autoplay={{
                    delay: 2500
                }}
                modules={[FreeMode, Pagination, Autoplay, Navigation]}
                className="mySwiper2"
            >
                {
                    images.map(image => (
                        <SwiperSlide key={image}>
                            <Image
                                className='object-fill'
                                width={600}
                                height={500}
                                alt={title}
                                src={`/products/${image}`}
                            />
                        </SwiperSlide>
                    ))
                }
            </Swiper>

        </div>
    )
}
