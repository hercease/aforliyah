"use client"
import React, { useState, useEffect, ReactDOM } from "react";
import Link from 'next/link'
import { usePathname, useRouter  } from 'next/navigation'
import Image from "next/image";
import CurrencyDropdown from "../components/CurrencyDropdown.js"
import MobileMenu from "../components/MobileMenu.js"
import ThemeSwitch from "../components/ThemeSwitch.js"
import Dropdown from 'react-bootstrap/Dropdown'
import axios from "axios";
import { parseCookies, setCookie, destroyCookie } from 'nookies';

export default function Header(){ 
	const router = useRouter();
	const [isMobileMenu, setMobileMenu] = useState(false);
	const cookies = parseCookies();
	const [userCookie, setUserCookie] = useState(null);
	const [userProfile, setuserProfile] = useState([]);


	const handleMobileMenu = () => {
	  setMobileMenu(!isMobileMenu);
	  if (!isMobileMenu) {
		document.body.classList.add("mobile-menu-active");
	  } else {
		document.body.classList.remove("mobile-menu-active");
	  }
	};

	const [scroll, setScroll] = useState(false);

	useEffect(() => {
	  const WOW = require('wowjs');
	  window.wow = new WOW.WOW({
		live: false
	  });

	  // Initialize WOW.js
	  window.wow.init();

	  const handleScroll = () => {
		const scrollCheck = window.scrollY > 100;
		if (scrollCheck !== scroll) {
		  setScroll(scrollCheck);
		}
	  };

	  document.addEventListener("scroll", handleScroll);

	  return () => {
		document.removeEventListener("scroll", handleScroll);
	  };
	}, [scroll]);
	
	const pathname = usePathname();
	
	useEffect(() => {
		//console.log("Page has changed");
		document.body.classList.remove("mobile-menu-active");
		 setMobileMenu(false);
	}, [pathname]);

	useEffect(() => {
		// Example: Retrieve the cookie value client-side
		const cookieValue = cookies.afotravelstoken;
		setUserCookie(cookieValue);
	  }, [cookies]);
	

	useEffect(() => {
		const fetchData = async (value) => {
		  try {
			const response = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/`, { email : value, request_type : 'fetch_profile' });
			
			setuserProfile(response.data);
			console.log(response.data);
			
		  } catch (error) {
			console.log("Error sending request");
		  } finally {
			//console.info("It worked");
			//setIsLoading(false);
		  }
		};

		if(userCookie){
			fetchData(userCookie);
		}
		
	}, [userCookie]);

	function Logout(){
		destroyCookie(null, 'afotravelstoken'); router.push('/login');
	}

	return (
	<>	
			{isMobileMenu &&
				<div className="body-overlay-1" onClick={handleMobileMenu} />
			}
			
			<header className="header sticky-bar background-body">
				<div className="container mx-auto background-body">
					<div className="main-header">
					  <div className="header-left">
						<div className="header-logo">
							 <Link className="d-flex" href="/">
								<Image 
									width={210}           // Width of the image
									height={45}          // Height of the image
									layout="intrinsic"   // Maintains the image's aspect ratio
									alt="Afotravels"    // Bootstrap class for right margin
									quality={100}        // Image quality (0-100)
									priority
									className="light-mode"
									src="/assets/imgs/logo.png" 
								/>
								<Image 
									width={210}           // Width of the image
									height={45}          // Height of the image
									layout="intrinsic"   // Maintains the image's aspect ratio
									alt="Afotravels"    // Bootstrap class for right margin
									quality={100}        // Image quality (0-100)
									priority
									className="dark-mode"
									src="/assets/imgs/logo.png" 
								/>
							</Link>
						</div>
						<div className="header-nav">
						  <nav className="nav-main-menu">
							<ul style={{ marginBottom : "0em" }} className="main-menu">
							  <li><Link className={pathname == "/" ? "active" : ""} href="/">Home</Link></li>
							  <li><Link className={pathname == "/affiliate" ? "active" : ""} href="/affiliate">Become an Affiliate</Link></li>
							  <li><Link className={pathname == "/contact" ? "active" : ""}  href="/contact">Contact us</Link></li>
							</ul>
						  </nav>
						</div>
					  </div>
					  <div className="header-right">
						<Dropdown className="d-none d-lg-block box-dropdown-cart align-middle mr-15">
							<Dropdown.Toggle as="span" className="text-14-medium">
								<span className="text-14-medium arrow-down">EN</span>
							</Dropdown.Toggle>
							<Dropdown.Menu className="dropdown-account" style={{visibility: 'visible'}}>
								<ul>
									<li><Link className="text-sm-medium" href="#">English</Link></li>
								</ul>
							</Dropdown.Menu>
						</Dropdown>
							<CurrencyDropdown />
							<div className="d-none d-lg-block align-middle mr-15">
								<ThemeSwitch />
								{!userCookie && (
									<Link className="btn btn-secondary btn-signin" href="/login">
									Sign In
									</Link>
								)}
							</div>
							
							{userCookie && (
								<div className="d-none d-lg-block align-middle mr-15">
									<div className="dropdown">
										<div
											className="rounded-circle text-white d-flex justify-content-center align-items-center dropdown-toggle"
											style={{
												width: "50px",
												height: "50px",
												backgroundColor: "#007bff",
												fontSize: "15px",
												fontWeight: "bold",
											}}
											
											data-bs-toggle="dropdown"
											aria-expanded="false"
											id="dropdownMenuButton"
										>
											{userProfile[0]?.firstname?.charAt(0)}{userProfile[0]?.lastname?.charAt(0)}
										</div>
										<ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
											<li><a className="dropdown-item" onClick={() => router.push('/profile')}>Profile</a></li>
											<li><a className="dropdown-item" onClick={() => router.push('/mybookings')}>Bookings</a></li>
											<li><hr className="dropdown-divider" /></li>
											<li><a className="dropdown-item" onClick={Logout}>Logout</a></li>
										</ul>
									</div>
								</div>
								)
							}

						<div onClick={handleMobileMenu} className="burger-icon burger-icon-white">
							<span className="burger-icon-top"></span>
							<span className="burger-icon-mid"></span>
							<span className="burger-icon-bottom"></span>
						</div>
					  </div>
					</div>
				</div>
			</header>
			<MobileMenu isMobileMenu={isMobileMenu} handleMobileMenu={handleMobileMenu} userdetails={userProfile} />
			

<style>{`
				.header .main-menu li a.active {
					border-bottom: solid;
				  }

				  .mobile-menu li a.active {
					border-bottom: solid;
				  }
				  
					.custom-span {
					  border-radius: 5px !important;
					  border-right: 0 !important;
					  background : white
					}
					
					
					.responsive-section {
					  width: 100%; /* Adjust as needed */
					}
					

					/* Styles for larger screens */
					
					
					.fading-hr {
						  opacity: 0.1;
						  transition: opacity 2s ease-in-out;
						}
					.btn-custom-sm {
					  font-size: 0.875rem;
					  padding: 0.56rem;
					}
					
					.pb-9 {
						padding-bottom: 15rem !important;
					}

					.pt-7 {
						padding-top: 4rem !important;
					}
					
					.mt-n8 {
						margin-top: -12rem !important;
					}
					
					@media (max-width: 1399.98px) {
						.header .main-menu li {
							padding: 0px 0px !important;
						}
					}
						.footer {
						background-color: #002366;
						padding: 40px 0px 0px 0px;
					}
					
					.guest-selector-dropdown {
    border: 1px solid rgba(var(--bs-primary-rgb), 0.7) !important;
    border-radius: 0;
    border-bottom-left-radius: 0.5rem !important;
    border-bottom-right-radius: 0.5rem !important;
    margin-top: -4px !important;
}


.rbt-input-main {
	height: 43px;
    border: 1px;
	border-left: 0 !important;
}


.rbt-input:focus {
	border-color: initial !important;
	border: 0px;
}
h6.heading-6.neutral-1000 {
    font-size: 15px;
}
p.text-white {
    font-size: 12px;
    text-align: justify;
}

.form-control:focus {
						outline: 0 !important;
						border-color: rgb(0 0 0 / 7%) !important
						box-shadow: none;
					}


					.custom-input {
					  height: 45px;
					  border-left: 0 !important;
					}



.hstack {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-direction: row;
    flex-direction: row;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -ms-flex-item-align: stretch;
    align-self: stretch;
}

.swiper-button-next-style-1 {
    height: 40px;
    width: 40px;
    line-height: 38px;
    text-align: center;
    border-radius: 50%;
    background-color: var(--bs-neutral-200);
}
.box-popular-destinations {
    position: relative;
    padding-top: 98px;
    padding-bottom: 2px;
}

.swiper-button-prev-style-1 {
    height: 40px;
    width: 40px;
    line-height: 38px;
    text-align: center;
    border-radius: 50%;
    background-color: var(--bs-neutral-200);
}

.css-19kzrtu {
    padding: 8px;
	overflow:hidden;
}

					
			`}
		
			</style>
		</>
)
}