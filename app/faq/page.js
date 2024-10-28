'use client'
import React, { useEffect, useState, useRef  } from 'react';
import Router, { useRouter,usePathname } from 'next/navigation'
import Layout from '../../components/layout';
import { AnimatePresence } from 'framer-motion';
import { ClipLoader, BounceLoader } from 'react-spinners';
import Image from "next/image";
import styles from '../page.module.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import Link from 'next/link'
import Footer from '../../components/footer';

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Navigation, Pagination, Autoplay, Scrollbar, A11y } from 'swiper/modules';


export default function Faq(){
	const router = useRouter();
	const pathname = usePathname(); // Get the current pathname
	return (
		<>
		
		<AnimatePresence mode="wait">
		<Layout key={pathname}>
			<main style={{ background: "var(--bs-gray-100)" }} className="main">
				
					<section className="box-section box-breadcrumb background-100">
						<div className="container"> 
						  <ul className="breadcrumbs"> 
							<li> <a href="/">Home</a><span className="arrow-right"> 
								<svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
								  <path d="M1 11L6 6L1 1" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
								</svg></span></li>
							<li> <span className="text-breadcrumb">FAQS</span></li>
						  </ul>
						</div>
					</section>
					
					<section className="section-box box-faqs box-faqs-type-2 box-faqs-type-3 background-body">
						<div className="box-faqs-inner">
						  <div className="container"> 
							<div className="row align-items-center"> 
							  <div className="col-lg-6 mb-30">
								<h3 className="neutral-1000 mb-20">Frequently Asked Questions</h3>
								<p className="text-lg-medium neutral-500">Here are some frequently asked questions about Afoliyah Travels:</p>
								<div className="d-flex align-items-center mt-45"><Link className="btn btn-black-lg-square" href="/contact">Contact Us
									<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
									  <path d="M8 15L15 8L8 1M15 8L1 8" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
									</svg></Link><a className="btn btn-link" href="#">Help Center
									<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
									  <path d="M8 15L15 8L8 1M15 8L1 8" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
									</svg></a></div>
							  </div>
							  <div className="col-lg-6 mb-30">
								<div className="box-banner-faq">
								  <div className="row"> 
									<div className="col-lg-5">
									  <div className="banner-faq"> <Image quality={100} layout="intrinsic" width={200} height={200} src="/assets/imgs/page/pages/banner-faq.png" alt="Travilla" /></div>
									  <div className="banner-faq"> <Image quality={100} layout="intrinsic" width={200} height={200} src="/assets/imgs/page/pages/banner-faq2.png" alt="Travilla" /></div>
									</div>
									<div className="col-lg-7"> 
									  <div className="banner-faq"> <Image quality={100} layout="intrinsic" width={200} height={200} src="/assets/imgs/page/pages/banner-faq3.png" alt="Travilla" /></div>
									</div>
								  </div>
								</div>
							  </div>
							</div>
							<div className="block-faqs">
							  <div className="accordion" id="accordionFAQ">
								<div className="accordion-item wow fadeInUp">
								  <h5 className="accordion-header" id="headingOne">
									<button className="accordion-button text-heading-5" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne"> 
									  <h3>01</h3>
									  <p>How can I book a flight or hotel?</p>
									</button>
								  </h5>
								  <div className="accordion-collapse collapse show" id="collapseOne" aria-labelledby="headingOne" data-bs-parent="#accordionFAQ">
									<div className="accordion-body">You can book a flight or hotel directly through our website by entering your travel details, selecting options, and completing the payment process.</div>
								  </div>
								</div>
								<div className="accordion-item wow fadeInUp">
								  <h5 className="accordion-header" id="headingTwo">
									<button className="accordion-button text-heading-5 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo"> 
									  <h3>02</h3>
									  <p>What payment methods do you accept?</p>
									</button>
								  </h5>
								  <div className="accordion-collapse collapse" id="collapseTwo" aria-labelledby="headingTwo" data-bs-parent="#accordionFAQ">
									<div className="accordion-body">We accept major credit cards, debit cards, and mobile payment platforms. Payment must be completed to confirm your booking.</div>
								  </div>
								</div>
								<div className="accordion-item wow fadeInUp">
								  <h5 className="accordion-header" id="headingThree">
									<button className="accordion-button text-heading-5 collapsed text-heading-5 type=" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree"> 
									  <h3>03</h3>
									  <p>Can I change or cancel my booking?</p>
									</button>
								  </h5>
								  <div className="accordion-collapse collapse" id="collapseThree" aria-labelledby="headingThree" data-bs-parent="#accordionFAQ">
									<div className="accordion-body">Yes, you can modify or cancel your booking based on the terms provided at the time of purchase. Please refer to our Terms of Service for more details.</div>
								  </div>
								</div>
								<div className="accordion-item wow fadeInUp">
								  <h5 className="accordion-header" id="headingFour">
									<button className="accordion-button text-heading-5 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour"> 
									  <h3>04</h3>
									  <p>How do I contact customer support?</p>
									</button>
								  </h5>
								  <div className="accordion-collapse collapse" id="collapseFour" aria-labelledby="headingFour" data-bs-parent="#accordionFAQ">
									<div className="accordion-body">You can contact our support team via email at help@afotravels.com or by calling +234 904 595 2027</div>
								  </div>
								</div>
								<div className="accordion-item wow fadeInUp">
								  <h5 className="accordion-header" id="headingFive">
									<button className="accordion-button text-heading-5 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive"> 
									  <h3>05</h3>
									  <p> What is your refund policy?   </p>
									</button>
								  </h5>
								  <div className="accordion-collapse collapse" id="collapseFive" aria-labelledby="headingFive" data-bs-parent="#accordionFAQ">
									<div className="accordion-body">Our refund policy varies depending on the type of booking and the terms provided at the time of purchase. Please review our refund policy carefully before making a booking.</div>
								  </div>
								</div>
								<div className="accordion-item wow fadeInUp">
								  <h5 className="accordion-header" id="headingsix">
									<button className="accordion-button text-heading-6 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapsesix" aria-expanded="false" aria-controls="collapsesix"> 
									  <h3>06</h3>
									  <p> Can I book travel insurance through your website?   </p>
									</button>
								  </h5>
								  <div className="accordion-collapse collapse" id="collapsesix" aria-labelledby="headingsix" data-bs-parent="#accordionFAQ">
									<div className="accordion-body"> Yes, we offer travel insurance options through our website. Please contact us for more information on our travel insurance policies.</div>
								  </div>
								</div>
								 <div className="accordion-item wow fadeInUp">
								  <h5 className="accordion-header" id="headingSeven">
									<button className="accordion-button text-heading-7 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseseven" aria-expanded="false" aria-controls="collapseseven"> 
									  <h3>07</h3>
									  <p>  How do I know if my booking is confirmed?   </p>
									</button>
								  </h5>
								  <div className="accordion-collapse collapse" id="collapseseven" aria-labelledby="headingseven" data-bs-parent="#accordionFAQ">
									<div className="accordion-body">Once your booking is confirmed, you will receive a confirmation email with your booking details. You can also log in to your account to view your booking status.</div>
								  </div>
								</div>
								<div className="accordion-item wow fadeInUp">
								  <h5 className="accordion-header" id="headingEight">
									<button className="accordion-button text-heading-8 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseeight" aria-expanded="false" aria-controls="collapseeight"> 
									  <h3>08</h3>
									  <p>  Can I book a group trip through your website?   </p>
									</button>
								  </h5>
								  <div className="accordion-collapse collapse" id="collapseeight" aria-labelledby="headingeight" data-bs-parent="#accordionFAQ">
									<div className="accordion-body">Yes, we offer group booking services for travel parties of 10 or more. Please contact us for more information on our group booking policies and rates.</div>
								  </div>
								</div>
								 <div className="accordion-item wow fadeInUp">
								  <h5 className="accordion-header" id="headingNine">
									<button className="accordion-button text-heading-9 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapsenine" aria-expanded="false" aria-controls="collapsenine"> 
									  <h3>09</h3>
									  <p>   Do you offer any discounts or promotions?   </p>
									</button>
								  </h5>
								  <div className="accordion-collapse collapse" id="collapsenine" aria-labelledby="headingnine" data-bs-parent="#accordionFAQ">
									<div className="accordion-body">Yes, we occasionally offer discounts and promotions on our website and social media channels. Follow us to stay up-to-date on our latest deals!</div>
								  </div>
								</div>
								<div className="accordion-item wow fadeInUp">
								  <h5 className="accordion-header" id="headingTen">
									<button className="accordion-button text-heading-10 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseten" aria-expanded="false" aria-controls="collapseten"> 
									  <h3>10</h3>
									  <p>   How do I track my flight status?   </p>
									</button>
								  </h5>
								  <div className="accordion-collapse collapse" id="collapseten" aria-labelledby="headingten" data-bs-parent="#accordionFAQ">
									<div className="accordion-body">You can track your flight status through our website or by contacting our customer support team. We will also send you flight updates and notifications via email or SMS.</div>
								  </div>
								</div>
							  </div>
							</div>
						  </div>
						</div>
					  </section>
					  
					  <section className="section-box box-media background-body"> 
						<div className="container-media wow fadeInUp">
							<Image width={275} height={275} layout="intrinsic" src="/assets/imgs/page/homepage5/media.png" alt="Travila" />
							<Image width={275} height={275} layout="intrinsic" src="/assets/imgs/page/homepage5/media2.png" alt="Travila" />
							<Image width={275} height={275} layout="intrinsic" src="/assets/imgs/page/homepage5/media3.png" alt="Travila" />
							<Image width={275} height={275} layout="intrinsic" src="/assets/imgs/page/homepage5/media4.png" alt="Travila" />
							<Image width={275} height={275} layout="intrinsic" src="/assets/imgs/page/homepage5/media5.png" alt="Travila" />
							<Image width={275} height={275} layout="intrinsic" src="/assets/imgs/page/homepage5/media6.png" alt="Travila" />
							<Image width={275} height={275} layout="intrinsic" src="/assets/imgs/page/homepage5/media7.png" alt="Travila" />
						</div>
					</section>
				  
			
			</main>
			 <div className="bg-footer"></div>
			 <Footer />
			
		</Layout>
		</AnimatePresence>
		</>
	);
}
