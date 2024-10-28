'use client'
import React, { useState, useEffect, ReactDOM } from "react";
import Link from 'next/link'
import PerfectScrollbar from 'react-perfect-scrollbar'
import Image from "next/image";
import { useRouter } from 'next/navigation'

export default function MobileMenu({ isMobileMenu, handleMobileMenu }) {
	const [isAccordion, setIsAccordion] = useState(0)
	const router = useRouter();
	const handleAccordion = (key) => {
		setIsAccordion(prevState => prevState === key ? null : key)
	}
	
	
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
					<div className="mobile-header-top">
						<div className="box-author-profile">
							<div className="card-author">
								<div className="card-image"> 
								  <div style={{ position: 'relative', width: '100%', height: '50px' }}>
									<Image layout="fill" objectFit="cover" src="/assets/imgs/page/homepage1/author2.png" alt="Travila" />
									</div>
								</div>
								<div className="card-info">
									<p className="text-md-bold neutral-1000">Alice Roses</p>
									<p className="text-xs neutral-1000">London, England</p>
								</div>
							</div><Link className="btn btn-black" href="#">Logout</Link>
						</div>
					</div>
					<div className="mobile-header-content-area">
						<div className="perfect-scroll">
							<div className="mobile-menu-wrap mobile-header-border">
								<nav>
									<ul className="mobile-menu font-heading">
										<li><Link className="active" href="/">Home</Link></li>
										<li><Link href="/affiliate">Become an Affiliate</Link></li>
										<li><Link href="/contact">Contact</Link></li>
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
