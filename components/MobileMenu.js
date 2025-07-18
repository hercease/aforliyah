'use client'
import React, { useState, useEffect, ReactDOM } from "react";
import Link from 'next/link'
import PerfectScrollbar from 'react-perfect-scrollbar'
import Image from "next/image";
import { useRouter, usePathname } from 'next/navigation'
import { parseCookies, setCookie, destroyCookie } from 'nookies';

export default function MobileMenu({ isMobileMenu, handleMobileMenu, userdetails }) {
	const [isAccordion, setIsAccordion] = useState(0);
	const pathname = usePathname();
	const router = useRouter();
	const handleAccordion = (key) => {
		setIsAccordion(prevState => prevState === key ? null : key)
	}
	
	function Logout(){
		destroyCookie(null, 'afotravelstoken'); router.push('/login');
	}

	//console.log(userdetails);

	return (
		<>
			<div className={`mobile-header-active mobile-header-wrapper-style perfect-scrollbar button-bg-2 ${isMobileMenu ? "sidebar-visible" : ""}`}>
				<PerfectScrollbar className="mobile-header-wrapper-inner">
					<div className="mobile-header-logo"> 
						<Link className="d-flex" href="/">
							<Image 
								width={180}           // Width of the image
								height={60}          // Height of the image
								layout="intrinsic"   // Maintains the image's aspect ratio
								alt="Afotravels"    // Bootstrap class for right margin
								quality={100}        // Image quality (0-100)
								priority
								className="light-mode"
								src="/assets/imgs/logo.png" 
							/>
							<Image 
								width={180}           // Width of the image
								height={60}          // Height of the image
								layout="intrinsic"   // Maintains the image's aspect ratio
								alt="Afotravels"    // Bootstrap class for right margin
								quality={100}        // Image quality (0-100)
								priority
								className="dark-mode"
								src="/assets/imgs/logo.png" 
							/>
						</Link>
						<div className="burger-icon burger-icon-white" onClick={handleMobileMenu} />
					</div>
					{Array.isArray(userdetails) && userdetails.length > 0 ? (
						<div className="mobile-header-top">
							<div className="box-author-profile">
							<div className="card-author d-flex align-items-center">
								{/* Profile Circle with Initials */}
								<div
								className="rounded-circle text-white d-flex justify-content-center align-items-center"
								style={{
									width: "53px",
									height: "53px",
									backgroundColor: "#007bff",
									fontSize: "20px",
									fontWeight: "bold",
								}}
								>
								{userdetails[0]?.firstname?.charAt(0)}
								{userdetails[0]?.lastname?.charAt(0)}
								</div>

								{/* User Information */}
								<div className="card-info ms-3">
								<p className="text-md-bold neutral-1000 mb-1">
									{userdetails[0]?.firstname} {userdetails[0]?.lastname}
								</p>
								<p className="text-xs neutral-1000">{userdetails[0]?.email}</p>
								</div>
							</div>

							{/* Logout Button */}
							<button className="btn btn-black mt-3" onClick={Logout}>
								Logout
							</button>
							</div>
						</div>
						) : (
						<div className="alert alert-light">
							<strong>Unlock exclusive benefits!</strong> Create an account to manage your bookings, receive special offers, and make future bookings faster.
							<br />
							<Link className="btn btn-black mt-2" href="/login">
							Get started
							</Link>
						</div>
					)}

					<div className="mobile-header-content-area">
						<div className="perfect-scroll">
							<div className="mobile-menu-wrap mobile-header-border">
								<nav>
									<ul className="mobile-menu font-heading">
										<li><Link className={pathname == "/" ? "active" : ""} href="/"><i className="bi bi-house"></i> Home</Link></li>
										<li><Link className={pathname == "/affiliate" ? "active" : ""} href="/affiliate"><i className="bi bi-link"></i> Become an Affiliate</Link></li>
										<li><Link className={pathname == "/contact" ? "active" : ""} href="/contact"><i className="bi bi-envelope"></i> Contact</Link></li>
										<li><Link className={pathname == "/profile" ? "active" : ""} href="/profile"><i className="bi bi-person"></i> Profile</Link></li>
										<li><Link className={pathname == "/mybookings" ? "active" : ""} href="/mybookings"><i className="bi bi-clock-history"></i> Booking history</Link></li>
									</ul>
								</nav>
							</div>
						</div>
					</div>
				</PerfectScrollbar>
			</div>

		</>
	)
}
