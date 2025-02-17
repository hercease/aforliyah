'use client'
import React, { useEffect, useState, useRef, useMemo, Suspense, useCallback } from 'react';
import Image from "next/image";
import Head from 'next/head';
import BackToTop from '../../components/BackToTop.js'
import Footer from '../../components/footer';
import { Controller,useForm } from "react-hook-form";
import Layout from '../../components/layout';
import { AnimatePresence } from 'framer-motion';
import { useRouter,usePathname,useSearchParams } from 'next/navigation'
import axios from 'axios';
import { ClipLoader, BounceLoader, BarLoader  } from 'react-spinners';
import convertTimeToDuration from '../../components/convertTimeToDuration';
import formatTime from '../../components/formatTime';
import formatDate from '../../components/formatDate';
import extractWord from '../../components/Extractword';
import FormatNumberWithComma from '../../components/formatNumberWithComma';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import toast, { Toaster } from 'react-hot-toast';
import { getData } from 'country-list';
//import { PaystackButton } from 'react-paystack';
//import { usePaystackPayment } from 'react-paystack';
//import Paystack from '@paystack/inline-js';
import dynamic from 'next/dynamic'
const PaystackButton = dynamic(() => import('react-paystack').then(mod => mod.PaystackButton));
import { parseCookies } from 'nookies';

const FlightDetail = () => {
	const params = useSearchParams();
	const pathname = usePathname(); // Get the current pathname
	const cookies = parseCookies();
	const router = useRouter();

	const goBack = () => {
		if (window.history.length > 1) {
			router.back();
		} else {
			router.push('/'); // Replace with your fallback route
		}
	};
	
	const [isLoading, setIsLoading] = useState(false);
	const [air, setAir] = useState();
	const [allresponse, setAllresponse] = useState();
	const [bank, setBank] = useState();
	const [alldata, setAlldata] = useState();
	const [isModalVisible, setModalVisible] = useState(true);
	const [userCookie, setUserCookie] = useState(cookies.afotravelstoken || null);
	const [userProfile, setuserProfile] = useState([]);
		
	const payload = useMemo(() => {
		const session = params.get('session');
		const flight_id = params.get('id');
		const adult = params.get('adult');
		const children = params.get('children');
		const infant = params.get('infant');
		const newPayload = {};
		newPayload.session = session;
		newPayload.flight_id = flight_id;
		newPayload.adult = adult;
		newPayload.children = children;
		newPayload.infant = infant;
		newPayload.request_type = "flight_detail";

    return newPayload;
	}, [
    	params
	]);
	
	useEffect(() => {
		 setIsLoading(true);
		const fetchData = async () => {
		  try {
			const response = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/`, payload);
			if(response.data.status==0){
				setAir(response.data.air);
				setAllresponse(response.data.allresponse);
				setBank(response.data.bankaccount);
				console.log(response.data);
			}else{
				toast.error("Session has expired",{duration: 4000});
				setTimeout(() => {
					router.back();
				}, 4000);
			}
			
			
		  } catch (error) {
			console.error('Error sending request:', error);
		  } finally {
			//console.info("It worked");
			setIsLoading(false);
		  }
		};

		fetchData();
	}, [payload,router]);

	useEffect(() => {

		const fetchProfile = async (value) => {
		  try {
			const resp = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/`, { email : value, request_type : 'fetch_profile' });
			
			setuserProfile(resp.data);
			console.log(resp);
			
		  } catch (error) {
			console.log("Error sending request");
		  } finally {
			//console.info("It worked");
			//setIsLoading(false);
		  }
		};

		if(userCookie){
			fetchProfile(userCookie);
		}
		
	}, [userCookie]);
	
	const countair = air && air.length - 1;
	const count_segment = air && air[countair]?.FlightSegments.length;
	const baggage = allresponse && allresponse.ShoppingCart?.Air.AirItineraryPricingInfo.PTC_FareBreakdowns[0].Baggages || [];
	//console.log(air && air[countair]?.FlightSegments[count_segment - 1].ArrivalAirportName);
	
	const [adults, setAdults] =  useState(() => parseInt(params.get('adult'), 10) || 1);
	const [child, setChild] =  useState(() => parseInt(params.get('children'), 10) || 0);
	const [infants, setInfants] =  useState(() => parseInt(params.get('infant'), 10) || 0);
	
	const [adultfields, setAdultFields] = useState([{ id: 0 }]);
	const [childfields, setChildFields] = useState([{ id: 0 }]);
	const [infantfields, setInfantFields] = useState([{ id: 0 }]);
	const [check, setCheck] = useState('');
	const [bankcheck, setBankCheck] = useState('');
	
	const { register, watch, formState: { errors, isValid }, handleSubmit, reset, setValue, getValues } = useForm({mode: "onChange"});
	
	useEffect(() => {
        if (infants > 0 && infantfields.length < infants){
            const newFields = [...infantfields];
            for (let i = infantfields.length; i < infants; i++){
                newFields.push({ id: i });
            }
            setInfantFields(newFields);
        }
    }, [infants, infantfields]);
	
	
	useEffect(() => {
        if (child > 0 && childfields.length < child){
            const newFields = [...childfields];
            for (let i = childfields.length; i < child; i++) {
                newFields.push({ id: i });
            }
            setChildFields(newFields);
        }
    }, [child, childfields]);
	
	useEffect(() => {
        if (adults > 0 && adultfields.length < adults) {
            const newFields = [...adultfields];
            for (let i = adultfields.length; i < adults; i++) {
                newFields.push({ id: i });
            }
            setAdultFields(newFields);
        }
    }, [adults, adultfields]);
	
	//console.log(air);
	
	//const popup = new Paystack();
	
	const config = {
		reference: new Date().getTime().toString(),
		email: watch('adult_email_0'), // Placeholder, will be dynamically set
		amount: watch('amount') * 100, // Placeholder, will be dynamically set
		publicKey: process.env.NEXT_PUBLIC_PAYSTACK_KEY
	};
	
	const handlePaystackSuccessAction = (reference) => {
      console.log("Payment successful:", reference);
		axios.post(`${process.env.NEXT_PUBLIC_HOST}/`,{reference : reference['reference'], request_type:'check_payment' }).then(function(response){
			//console.log(response);
			if(response.data.status==1){
				//toast.success(response.data.message,{duration: 5000});
				//setState({ ...state, sub_status: 'Update', disable_status: ''});
				handleConfirmedSubmit(watch());
				//console.log(response.data);
			}else{
				toast.error(response.data.message,{duration: 30000});
				//setState({ ...state, sub_status: 'Update', disable_status: ''});
			}
		});
    };
	
	  // you can call this function anything
	/*const onSuccess = (reference) => {
		// Implementation for whatever you want to do with reference and after success call.
		console.log(reference);
	};

	  // you can call this function anything
	const onClose = () => {
		// implementation for  whatever you want to do when the Paystack dialog closed.
		console.log('closed')
	}

	const PaystackHookExample = () => {
		const initializePayment = usePaystackPayment(config);
		return (
			<div>
				<button onClick={() => {
					initializePayment(onSuccess, onClose)
				}}>Paystack Hooks Implementation</button>
			</div>
		);
	};*/
	  

    // you can call this function anything
    const handlePaystackCloseAction = () => {
      // implementation for  whatever you want to do when the Paystack dialog closed.
      console.log('closed')
    }
	

	const onSubmit = (data) => {
		//console.log("Form data:", data);
		//data.flight = air;
		if(check=="bank transfer"){
			handleConfirmedSubmit(watch());
		}
		
	};
	
	  const handleConfirmedSubmit = (data) => {
		// If the user confirms, proceed with form submission
			//setModalVisible(false);
			//const data = getValues('formData');
			data.flight = air;
			data.email =  userCookie;
			console.log(data);
		try {
			setIsLoading(true);
			axios.post(`${process.env.NEXT_PUBLIC_HOST}/`, data).then((response)=>{
			//console.log(response.data);
			if(response.data.status==1){
				//toast.error(response.data.message,{duration: 8000});
				//setIsLoading(false);
				console.log(response.data);
				router.push('/flight_book/' + response.data.id );
			}else{
				console.log(response.data);
				toast.error(response.data.data,{duration: 8000});
				setIsLoading(false);
			}
        }) .catch((error) => { if(error.code === 'ERR_NETWORK'){
			//alert('no internet connection');
				toast.error("Ooops, Network Error");
				setIsLoading(false);
				//dispatch({type: RELOAD});
			} 
		})
		} catch (error) {
		  toast.error('Form submission failed:', error);
		}
	  };
	

	const componentProps = {
        ...config,
        text: 'Continue',
        onSuccess: (reference) => handlePaystackSuccessAction(reference),
        onClose: handlePaystackCloseAction,
    };

 
	function checkBaggage(typeCode, arrayBag) {
		// Iterate over each item in the arrayBag array
		for (let i = 0; i < arrayBag.length; i++) {
			const bag = arrayBag[i];

			// Check if the PassengerCode matches the provided typeCode
			if (bag.PassengerCode === typeCode) {
				// Return the FreeQuantity if there's a match
				return bag.FreeQuantity;
			}
		}

		// Return 0 if no match was found
		return 0;
	}
	
	const handleChange = (e) => {
	  setCheck(e.target.value);
	}
	const handlebankChange = (e) => {
		let isChecked = e.target.checked;
		const checkboxes = document.querySelectorAll('input[type="checkbox"]');
	  
		checkboxes.forEach(item => {
			if (item != e.target) {
				item.checked = false;
			}
		});
		if(isChecked==true){
			setBankCheck(e.target.value)
		}
	}
	
	console.log(bankcheck);
	const countries = getData();


	return (
		<>
		<AnimatePresence mode="wait">
		<Layout key={pathname}>
		<main className="main">
			<section className="box-section box-breadcrumb background-body">
				<div className="container"> 
				  <ul className="breadcrumbs"> 
					<li> <i className="bi bi-arrow-return-left"></i> <a style={{ cursor : "pointer" }} onClick={goBack}>Back to Listing</a><span className="arrow-left"> 
						<svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
						  <path d="M1 11L6 6L1 1" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
						</svg></span></li>
				  </ul>
				</div>
			</section>
			{isLoading ? (
				<div className="d-flex justify-content-center align-items-center" style={{  height: "50vh" }}>
					<Image alt="Aforliyah preloader" width={100} height={100} src="/assets/imgs/aforliyah_preloader.gif" />
				</div>
			) : (
			<div>
			
			
			<section className="section-box block-content-book-tickets background-card">
				<div className="container"> 
		
					<div className="d-flex align-items-center">
						<h1 className="display-4 mb-0"><i className="fa-solid fa-plane rtl-flip"></i></h1>

						<div className="ms-3">
						{air && (
							<ul className="list-inline mb-2">
								<li className="list-inline-item me-2">
									<h5 className="mb-0 fw-bold">{air && extractWord(air[0]?.FlightSegments[0]?.DepartureAirportName || "",0)}({air && air[0]?.FlightSegments[0]?.DepartureAirport})</h5>
								</li>
								<li className="list-inline-item me-2">
									<h3 className="mb-0"><i className="bi bi-arrow-right"></i></h3>
								</li>
								<li className="list-inline-item me-0">
									<h5 className="mb-0 fw-bold">{air && extractWord(air[countair]?.FlightSegments[count_segment - 1]?.ArrivalAirportName || "",0)}({air && air[countair]?.FlightSegments[count_segment - 1]?.ArrivalAirport}) </h5>
								</li>
							</ul>
						)}
						</div>
					</div>
					
		  
			<div className="row mt-50 mb-4">  
				<div className="col-lg-8"> 
					<div className="box-content-tickets-detail mb-3">
			  
					{air && air.map((data, key) => {
						const totaldestination = air.length - 1;
						const segment_count = data.FlightSegments.length - 1;

						return (
						<React.Fragment key={key+10}>
					  {/* Beginning of box timeline */}
					  
						{data.FlightSegments.map((segment, index) => {
						  const currentArrivalDate = new Date(segment.ArrivalDate);
						  const nextDepartureDate =
							index + 1 < data.FlightSegments.length
							  ? new Date(data.FlightSegments[index + 1].DepartureDate)
							  : null;

						  let intervalHours = 0;
						  if (nextDepartureDate) {
							const diffMilliseconds = nextDepartureDate.getTime() - currentArrivalDate.getTime();
							intervalHours = Math.floor(diffMilliseconds / (1000 * 60 * 60)); // Convert to hours
						  }

						  return (
							<React.Fragment key={index}>
							<div className="box-timeline">
							  {/* Beginning of item timeline */}
							  <div className="item-timeline">
								<span className="text-xl-bold text-ads-middle">{convertTimeToDuration(segment.Duration)}</span>
								<div className="item-line-timeline">
								  <div className="time-flight">
									<p className="text-sm-bold neutral-1000 icon-time mb-0">{formatTime(segment.DepartureDate)}</p>
									<p className="text-sm-medium neutral-500">{formatDate(segment.DepartureDate)}</p>
								  </div>
								  <div className="location-flight">
									<p className="text-xl-bold neutral-1000 mb-0">{extractWord(segment.DepartureAirportName,0)} ({segment.DepartureAirport})</p>
									<p className="text-sm-medium neutral-500">{extractWord(segment.DepartureAirportName,1)} ,Terminal {segment.DepartureTerminal}</p>
								  </div>
								</div>
								<div className="item-info-flight">
								  <div className="logo-flight">
									<Image src={`${process.env.NEXT_PUBLIC_AIRLINEIMAGE}/${segment.MarketingAirlineCode}.png`} 
											width={25}
											height={25}
											layout="intrinsic"
											alt="Airline Logo"
											className=""
											quality={100} // Controls the quality of the image (0-100)
											priority 
										/>
								  </div>
								  <div className="flight-code">
									<p className="text-sm-medium neutral-500">{segment.MarketingAirlineCode}-{segment.FlightNumber} • {data.Cabin}</p>
								  </div>
								  <ul className="list-flight-facilities">
								  {segment.FreeBaggages && segment.FreeBaggages.map((d, k) => {
									return (
									<li key={`baggage${k}`} className="baggage">
									  <svg
										width="16"
										height="16"
										viewBox="0 0 16 16"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									  >
										<path
										  d="M14.122 7.23384H12.3453V5.80934C12.3453 5.55009 12.135 5.33991 11.8757 5.33991H9.33781C9.1025 4.62166 8.42469 4.10641 7.63672 4.10641H6.82216V0.469438C6.82216 0.210188 6.61194 0 6.35262 0H3.07384C2.81453 0 2.60428 0.210188 2.60428 0.469438V4.10644H1.78972C0.802875 4.10644 0 4.90906 0 5.89566V14.2107C0 15.1973 0.802875 16 1.78972 16H14.122C15.1575 16 16 15.1578 16 14.1225V9.11134C16 8.07609 15.1575 7.23384 14.122 7.23384ZM15.0609 9.11134V12.0802H5.77616V9.11134C5.77616 8.59378 6.19734 8.17269 6.71506 8.17269H14.122C14.6397 8.17269 15.0609 8.59375 15.0609 9.11134ZM11.4062 7.23384H9.43094V6.27878H11.4062V7.23384ZM3.54338 0.938844H5.88306V4.10641H3.54338V0.938844ZM0.939094 14.2107V5.89566C0.939094 5.42675 1.32069 5.04528 1.78972 5.04528H7.63672C8.08409 5.04528 8.45697 5.39431 8.48556 5.83991C8.48669 5.85728 8.48887 5.87431 8.49178 5.89106V7.23384H6.71503C5.6795 7.23384 4.83703 8.07609 4.83703 9.11134V14.1225C4.83703 14.4643 4.92931 14.7848 5.08962 15.0612H1.78972C1.32069 15.0612 0.939094 14.6797 0.939094 14.2107ZM14.122 15.0612H7.63672H6.71506C6.19734 15.0612 5.77616 14.6401 5.77616 14.1225V13.0191H15.0609V14.1225C15.0609 14.6401 14.6397 15.0612 14.122 15.0612Z"
										  fill=""
										/>
									  </svg>
									  {`Baggage ${d.FreeQuantity} x 23 kg`}
									</li>
									);
								})}
									
								  </ul>
								</div>
							  </div>
							  {/* End of item timeline */}

							  {/* Example of additional timeline item */}
							  <div className="item-timeline"> 
								<div className="item-line-timeline">
								  <div className="time-flight">
									<p className="text-sm-bold neutral-1000 icon-time mb-0">{formatTime(segment.ArrivalDate)}</p>
									<p className="text-sm-medium neutral-500">{formatDate(segment.DepartureDate)}</p>
								  </div>
								  <div className="location-flight">
									<p className="text-xl-bold neutral-1000 mb-0">{extractWord(segment.ArrivalAirportName,0)} ({segment.ArrivalAirport})</p>
									<p className="text-sm-medium neutral-500">{extractWord(segment.ArrivalAirportName,1)} ,Terminal {segment.ArrivalTerminal}</p>
								  </div>
								</div>
								</div>
								
							</div>
							
							{index + 1 < data.FlightSegments.length && (
							    <div className="box-stop">
								
									<div className="box-stop-right">
									
										<p className="text-sm-bold neutral-1000">Stop to change planes in {segment.ArrivalAirportName} ({intervalHours}) hours </p>
										<p className="text-sm-medium neutral-1000">At this stop, you need to: Prepare transit visa if required</p>
									
									</div>
									
							  </div>)}
							</React.Fragment>
						  );
						})}
					  
					  {/* Ending of box timeline */}

					 
					</React.Fragment>
				  );
				})}
				
              </div>
			{air && (
			<form onSubmit={handleSubmit(onSubmit)}>
		
			{adultfields.map((formfield, index) => (  
			  <div key={20 + index} className="card mb-3">
				<div className="card-body">
					<div className="card-header mb-2">Adult {formfield.id + 1}</div>
					<p className="h6 fw-light small mb-0 alert alert-info"><span className="badge bg-danger me-2">New</span>Please make sure you enter the Name as per your passport</p>
					
					<div className="mb-3">
						<label>Title</label>
						<select {...register(`adult_title_${formfield.id}`, { required: "Select title"  })} className="form-select">
							<option value="">Select title</option>
							<option value="Mr">Mr</option>
							<option value="Mrs">Mrs</option>
							<option value="Miss">Miss</option>
						</select>
						{errors[`adult_title_${formfield.id}`] && (
						  <div className='text-danger mt-1'>
							<ErrorOutlineRoundedIcon fontSize="small" />
							{errors[`adult_title_${formfield.id}`]?.message}
						  </div>
						)}
					</div>
					<div className="mb-3">
						<label>First Name</label>
						<input type="text"  {...register(`adult_firstname_${formfield.id}`, { required: "Enter firstname"  })} defaultValue={userProfile[0]?.firstname} className="form-control" placeholder="First Name" />
						{errors[`adult_firstname_${formfield.id}`] && (
						  <div className='text-danger mt-1'>
							<ErrorOutlineRoundedIcon fontSize="small" />
							{errors[`adult_firstname_${formfield.id}`]?.message}
						  </div>
						)}
					</div>
					<div className="mb-3">
						<label>Last Name</label>
						<input type="text" {...register(`adult_lastname_${formfield.id}`, { required: "Enter lastname"  })} defaultValue={userProfile[0]?.lastname} className="form-control" placeholder="Last Name" />
						{errors[`adult_lastname_${formfield.id}`] && (
						  <div className='text-danger mt-1'>
							<ErrorOutlineRoundedIcon fontSize="small" />
							{errors[`adult_lastname_${formfield.id}`]?.message}
						  </div>
						)}
					</div>
					 <div className="mb-3">
						<label>Date of Birth</label>
						<input
							type="date"
							{...register(`adult_dob_${formfield.id}`, {
								required: "Enter date of birth",
								validate: (value) => {
									const selectedDate = new Date(value);
									const currentDate = new Date();
									const minDate = new Date(currentDate.setFullYear(currentDate.getFullYear() - 12));
									return selectedDate <= minDate || "Must be at least 12 years old";
								}
							})}
							className="form-control"
						/>
						{errors[`adult_dob_${formfield.id}`] && (
							<div className='text-danger mt-1'>
								<ErrorOutlineRoundedIcon fontSize="small" />
								{errors[`adult_dob_${formfield.id}`]?.message}
							</div>
						)}
					</div>

					<div className="mb-3">
						<label>Gender</label>
						<select className="form-select" {...register(`adult_gender_${formfield.id}`, { required: "Enter date of birth"  })} >
							<option value="">Select Gender</option>
							<option value="Male">Male</option>
							<option value="Female">Female</option>
						</select>
						{errors[`adult_gender_${formfield.id}`] && (
						  <div className='text-danger mt-1'>
							<ErrorOutlineRoundedIcon fontSize="small" />
							{errors[`adult_gender_${formfield.id}`]?.message}
						  </div>
						)}
					</div>
					<div className="mb-3">
						<label>Phone</label>
						<input type="number" {...register(`adult_phone_${formfield.id}`, { required: "Enter phone no"  })} className="form-control" placeholder="Mobile number without country code" />
						{errors[`adult_phone_${formfield.id}`] && (
						  <div className='text-danger mt-1'>
							<ErrorOutlineRoundedIcon fontSize="small" />
							{errors[`adult_phone_${formfield.id}`]?.message}
						  </div>
						)}
					</div>
					<div className="mb-3">
						<label>Email Address</label>
						<input
							type="text"
							{...register(`adult_email_${formfield.id}`, {
								required: "Enter email address"
							})}
							className="form-control"
							placeholder="Email address"
						/>
						{errors[`adult_email_${formfield.id}`] && (
						  <div className='text-danger mt-1'>
							<ErrorOutlineRoundedIcon fontSize="small" />
							{errors[`adult_email_${formfield.id}`]?.message}
						  </div>
						)}
					</div>

					<div className="mb-3">
						<label>Confirm Email Address</label>
						<input
							type="text"
							{...register(`adult_confirm_email_${formfield.id}`, {
								required: "Please confirm email address!",
								validate: (value) => {
									const email = getValues(`adult_confirm_email_${formfield.id}`);
									return email === value || "Email addresses do not match";
								}
							})}
							className="form-control"
							placeholder="Confirm Email address"
						/>
						{errors[`adult_confirm_email${formfield.id}`] && (
						  <div className='text-danger mt-1'>
							<ErrorOutlineRoundedIcon fontSize="small" />
							{errors[`adult_confirm_email${formfield.id}`]?.message}
						  </div>
						)}
					</div>
					
					<div className="mb-3">
						<label>Passport No</label>
						<input
							type="text"
							{...register(`adult_passport_${formfield.id}`, {
								required: "Enter passport no"
							})}
							className="form-control"
							placeholder="Passport Number"
						/>
						{errors[`adult_passport_${formfield.id}`] && (
						  <div className='text-danger mt-1'>
							<ErrorOutlineRoundedIcon fontSize="small" />
							{errors[`adult_passport_${formfield.id}`]?.message}
						  </div>
						)}
					</div>

					<div className="mb-3">
						<label>Passport Issuing Date</label>
						<input
							type="date"
							{...register(`adult_passport_issuing_date_${formfield.id}`, {
								required: "Enter passport issuing date"
							})}
							className="form-control"
							placeholder="Passport Issuing date"
						/>
						{errors[`adult_passport_issuing_date_${formfield.id}`] && (
						  <div className='text-danger mt-1'>
							<ErrorOutlineRoundedIcon fontSize="small" />
							{errors[`adult_passport_issuing_date_${formfield.id}`]?.message}
						  </div>
						)}
						
					</div>

					<div className="mb-3">
						<label>Passport Expiry Date</label>
						<input
							type="date"
							{...register(`adult_passport_expiry_date_${formfield.id}`, {
								required: "Enter passport expiry date"
							})}
							className="form-control"
							placeholder="Passport expiry date"
						/>
						{errors[`adult_passport_expiry_date_${formfield.id}`] && (
						  <div className='text-danger mt-1'>
							<ErrorOutlineRoundedIcon fontSize="small" />
							{errors[`adult_passport_expiry_date_${formfield.id}`]?.message}
						  </div>
						)}
					</div>

					<div className="mb-3">
						<label htmlFor="countrySelect" className="form-label">
							Passport Issuing Country
						</label>
						<select
							id="countrySelect"
							className="form-select"
							{...register(`adult_passport_issuing_country_${formfield.id}`,{
								required: "Select Issuing country"
							})}
						>
							<option value="">-- Select a country --</option>
							{countries.map((country) => (
							<option key={country.code} value={country.code}>
								{country.name}
							</option>
							))}
						</select>
						{errors[`adult_passport_issuing_country_${formfield.id}`] && (
						  <div className='text-danger mt-1'>
							<ErrorOutlineRoundedIcon fontSize="small" />
							{errors[`adult_passport_issuing_country_${formfield.id}`]?.message}
						  </div>
						)}
					</div>

					<div className="mb-3">
						<label htmlFor="countrySelect" className="form-label">
							Nationality
						</label>
						<select
							id="countrySelect"
							className="form-select"
							{...register(`adult_nationality_${formfield.id}`,{
								required: "Select nationality"
							})}
						>
							<option value="">-- Select a country --</option>
							{countries.map((country) => (
							<option key={country.code} value={country.code}>
								{country.name}
							</option>
							))}
						</select>
						{errors[`adult_nationality_${formfield.id}`] && (
						  <div className='text-danger mt-1'>
							<ErrorOutlineRoundedIcon fontSize="small" />
							{errors[`adult_nationality_${formfield.id}`]?.message}
						  </div>
						)}
					</div>
					<input type="hidden" {...register(`adult_typecode_${formfield.id}`)} defaultValue="ADT" />
					<input type="hidden" {...register(`adult_baggageqty_${formfield.id}`)} defaultValue={checkBaggage("ADT", baggage)} />

				</div>
			  </div>
			))}
			
			{child > 0 && childfields.map((formfield, index) => (
			
			  <div key={30 + index} className="card mb-3">
				<div className="card-body">
					<div className="card-header mb-2">Child {formfield.id + 1}</div>
					<p className="h6 fw-light small mb-0 alert alert-info"><span className="badge bg-danger me-2">New</span>Please make sure you enter the Name as per your passport</p>
					
					<div className="mb-3">
						<label>First Name</label>
						<input type="text"  {...register(`child_firstname_${formfield.id}`, { required: "Enter First name"  })} className="form-control" placeholder="First Name" />
						{errors[`child_firstname_${formfield.id}`] && (
						  <div className='text-danger mt-1'>
							<ErrorOutlineRoundedIcon fontSize="small" />
							{errors[`child_firstname_${formfield.id}`]?.message}
						  </div>
						)}
					</div>
					<div className="mb-3">
						<label>Last Name</label>
						<input type="text" {...register(`child_lastname_${formfield.id}`, { required: "Enter First name"  })} className="form-control" placeholder="Last Name" />
						{errors[`child_lastname_${formfield.id}`] && (
						  <div className='text-danger mt-1'>
							<ErrorOutlineRoundedIcon fontSize="small" />
							{errors[`child_lastname_${formfield.id}`]?.message}
						  </div>
						)}
					</div>
					<div className="mb-3">
						<label>Date of Birth</label>
						<input type="date" {...register(`child_dob_${formfield.id}`, { 
							required: "Enter date of birth",
							validate: (value) => {

								const selectedDate = new Date(value);
								const currentDate = new Date();

								console.log(selectedDate);
							
								// Check if the selectedDate is a valid date
								if (isNaN(selectedDate.getTime())) {
									return "Invalid date.";
								}
							
								// Calculate the minimum and maximum valid dates
								const maxDate = new Date(currentDate);
								maxDate.setFullYear(currentDate.getFullYear() - 11); // Maximum 11 years old
							
								const minDate = new Date(currentDate);
								minDate.setFullYear(currentDate.getFullYear() - 3); // Minimum 3 years old

								   // For debugging: Log the dates in a human-readable format
									console.log("Selected Date:", selectedDate.toString());
									console.log("Max Date (11 years ago):", maxDate.toString());
									console.log("Min Date (3 years ago):", minDate.toString());
								
							
								if (selectedDate < maxDate || selectedDate > minDate) {
									return "Age must be between 3 and 11 years.";
								}
							
							  	return null;
							  
							} 
						  })}  			
						className="form-control" />
						{errors[`child_dob_${formfield.id}`] && (
						  <div className='text-danger mt-1'>
							<ErrorOutlineRoundedIcon fontSize="small" />
							{errors[`child_dob_${formfield.id}`]?.message}
						  </div>
						)}
					</div>
					<div className="mb-3">
						<label>Gender</label>
						<select className="form-select" {...register(`child_gender_${formfield.id}`, { required: "Select gender type"  })}>
							<option value="">Select Gender</option>
							<option value="Male">Male</option>
							<option value="Female">Female</option>
						</select>
						{errors[`child_gender_${formfield.id}`] && (
						  <div className='text-danger mt-1'>
							<ErrorOutlineRoundedIcon fontSize="small" />
							{errors[`child_gender_${formfield.id}`]?.message}
						  </div>
						)}
					</div>
					<div className="mb-3">
						<label>Passport No</label>
						<input
							type="text"
							{...register(`child_passport_${formfield.id}`, {
								required: "Enter passport no"
							})}
							className="form-control"
							placeholder="Passport Number"
						/>
						{errors[`child_passport_${formfield.id}`] && (
						  <div className='text-danger mt-1'>
							<ErrorOutlineRoundedIcon fontSize="small" />
							{errors[`child_passport_${formfield.id}`]?.message}
						  </div>
						)}
					</div>

					<div className="mb-3">
						<label>Passport Issuing Date</label>
						<input
							type="date"
							{...register(`child_passport_issuing_date_${formfield.id}`, {
								required: "Enter passport issuing date"
							})}
							className="form-control"
							placeholder="Passport Number"
						/>
						{errors[`child_passport_issuing_date_${formfield.id}`] && (
						  <div className='text-danger mt-1'>
							<ErrorOutlineRoundedIcon fontSize="small" />
							{errors[`child_passport_issuing_date_${formfield.id}`]?.message}
						  </div>
						)}
						
					</div>

					<div className="mb-3">
						<label>Passport Expiry Date</label>
						<input
							type="date"
							{...register(`child_passport_expiry_date_${formfield.id}`, {
								required: "Enter passport expiry date"
							})}
							className="form-control"
							placeholder="Passport Expiry Date"
						/>

						{errors[`child_passport_expiry_date_${formfield.id}`] && (
						  <div className='text-danger mt-1'>
							<ErrorOutlineRoundedIcon fontSize="small" />
							{errors[`child_passport_expiry_date_${formfield.id}`]?.message}
						  </div>
						)}
					</div>

					<div className="mb-3">
						<label htmlFor="countrySelect" className="form-label">
							Passport Issuing Country
						</label>
						<select
							id="countrySelect"
							className="form-select"
							{...register(`child_passport_issuing_country_${formfield.id}`,{
								required: "Select issuing country"
							})}
						>
							<option value="">-- Select a country --</option>
							{countries.map((country) => (
							<option key={country.code} value={country.code}>
								{country.name}
							</option>
							))}
						</select>
						{errors[`child_passport_issuing_country_${formfield.id}`] && (
						  <div className='text-danger mt-1'>
							<ErrorOutlineRoundedIcon fontSize="small" />
							{errors[`child_passport_issuing_country_${formfield.id}`]?.message}
						  </div>
						)}
					</div>

					<div className="mb-3">
						<label htmlFor="countrySelect" className="form-label">
							Nationality
						</label>
						<select
							id="countrySelect"
							className="form-select"
							{...register(`child_nationality_${formfield.id}`,{
								required: "Select nationality"
							})}
						>
							<option value="">-- Select a country --</option>
							{countries.map((country) => (
							<option key={country.code} value={country.code}>
								{country.name}
							</option>
							))}
						</select>
						{errors[`child_nationality_${formfield.id}`] && (
						  <div className='text-danger mt-1'>
							<ErrorOutlineRoundedIcon fontSize="small" />
							{errors[`child_nationality_${formfield.id}`]?.message}
						  </div>
						)}
					</div>

					<input type="hidden" {...register(`child_typecode_${formfield.id}`)} defaultValue="CNN" />
					<input type="hidden" {...register(`child_baggageqty_${formfield.id}`)} defaultValue={checkBaggage("CNN", baggage)} />
				</div>
			  </div>
			))}
			
			{infants > 0 && infantfields.map((formfield, index) => (
			
			   <div key={40 + index} className="card mb-3">
				<div className="card-body">
					<div className="card-header mb-2">Infant {formfield.id + 1}</div>
					<p className="h6 fw-light small mb-0 alert alert-info"><span className="badge bg-danger me-2">New</span>Please make sure you enter the Name as per your passport</p>
					
					<div className="mb-3">
						<label>First Name</label>
						<input type="text" {...register(`infant_firstname_${formfield.id}`, { required: "Enter First name"  })} className="form-control" placeholder="First Name" />
						{errors[`infant_firstname_${formfield.id}`] && (
						  <div className='text-danger mt-1'>
							<ErrorOutlineRoundedIcon fontSize="small" />
							{errors[`infant_firstname_${formfield.id}`]?.message}
						  </div>
						)}
					</div>
					<div className="mb-3">
						<label>Last Name</label>
						<input type="text" {...register(`infant_lastname_${formfield.id}`, { required: "Enter Last name"  })} className="form-control" placeholder="Last Name" />
						{errors[`infant_lastname_${formfield.id}`] && (
						  <div className='text-danger mt-1'>
							<ErrorOutlineRoundedIcon fontSize="small" />
							{errors[`infant_lastname_${formfield.id}`]?.message}
						  </div>
						)}
					</div>
					<div className="mb-3">
						<label>Date of Birth</label>
						<input type="date" {...register(`infant_dob_${formfield.id}`, {
								required: "Enter date of birth",
								validate: (value) => {
									const selectedDate = new Date(value);
									const currentDate = new Date();
									const maxDate = new Date(currentDate.setFullYear(currentDate.getFullYear() - 2));
									return selectedDate > maxDate || "Must not be more than 2 years old";
								}
							})}  className="form-control" />
							{errors[`infant_dob_${formfield.id}`] && (
								<div className='text-danger mt-1'>
									<ErrorOutlineRoundedIcon fontSize="small" />
									{errors[`infant_dob_${formfield.id}`]?.message}
								</div>
							)}
					</div>
					<div className="mb-3">
						<label>Gender</label>
						<select {...register(`infant_gender_${formfield.id}`, { required: "Select gender type"  })} className="form-select">
							<option value="">Select Gender</option>
							<option value="Male">Male</option>
							<option value="Female">Female</option>
						</select>
						{errors[`infant_dob_${formfield.id}`] && (
							<div className='text-danger mt-1'>
								<ErrorOutlineRoundedIcon fontSize="small" />
								{errors[`infant_gender_${formfield.id}`]?.message}
							</div>
						)}
					</div>
					
					<div className="mb-3">
						<label>Passport No</label>
						<input
							type="text"
							{...register(`infant_passport_${formfield.id}`, {
								required: "Enter passport no"
							})}
							className="form-control"
							placeholder="Passport Number"
						/>
						{errors[`infant_passport_${formfield.id}`] && (
						  <div className='text-danger mt-1'>
							<ErrorOutlineRoundedIcon fontSize="small" />
							{errors[`infant_passport_${formfield.id}`]?.message}
						  </div>
						)}
					</div>

					<div className="mb-3">
						<label>Passport Issuing Date</label>
						<input
							type="date"
							{...register(`infant_passport_issuing_date_${formfield.id}`, {
								required: "Enter passport issuing date"
							})}
							className="form-control"
							placeholder="Passport Issuing date"
						/>
						{errors[`infant_passport_issuing_date_${formfield.id}`] && (
						  <div className='text-danger mt-1'>
							<ErrorOutlineRoundedIcon fontSize="small" />
							{errors[`infant_passport_issuing_date_${formfield.id}`]?.message}
						  </div>
						)}
						
					</div>

					<div className="mb-3">
						<label>Passport Expiry Date</label>
						<input
							type="date"
							{...register(`infant_passport_expiry_date_${formfield.id}`, {
								required: "Enter passport expiry date"
							})}
							className="form-control"
							placeholder="Passport expiry date"
						/>
						{errors[`infant_passport_expiry_date_${formfield.id}`] && (
						  <div className='text-danger mt-1'>
							<ErrorOutlineRoundedIcon fontSize="small" />
							{errors[`infant_passport_expiry_date_${formfield.id}`]?.message}
						  </div>
						)}
					</div>

					<div className="mb-3">
						<label htmlFor="countrySelect" className="form-label">
							Passport Issuing Country
						</label>
						<select
							id="countrySelect"
							className="form-select"
							{...register(`infant_passport_issuing_country_${formfield.id}`,{
								required: "Select passport issuing country"
							})}
						>
							<option value="">-- Select a country --</option>
							{countries.map((country) => (
							<option key={country.code} value={country.code}>
								{country.name}
							</option>
							))}
						</select>
						{errors[`infant_passport_issuing_country_${formfield.id}`] && (
						  <div className='text-danger mt-1'>
							<ErrorOutlineRoundedIcon fontSize="small" />
							{errors[`infant_passport_issuing_country_${formfield.id}`]?.message}
						  </div>
						)}
					</div>

					<div className="mb-3">
						<label htmlFor="countrySelect" className="form-label">
							Nationality
						</label>
						<select
							id="countrySelect"
							className="form-select"
							{...register(`infant_nationality_${formfield.id}`,{
								required: "Select nationality"
							})}
						>
							<option value="">-- Select a country --</option>
							{countries.map((country) => (
							<option key={country.code} value={country.code}>
								{country.name}
							</option>
							))}
						</select>
						{errors[`infant_nationality_${formfield.id}`] && (
						  <div className='text-danger mt-1'>
							<ErrorOutlineRoundedIcon fontSize="small" />
							{errors[`infant_nationality_${formfield.id}`]?.message}
						  </div>
						)}
					</div>

					<input type="hidden" {...register(`infant_typecode_${formfield.id}`)} defaultValue="INF" />
					<input type="hidden" {...register(`infant_baggageqty_${formfield.id}`)} defaultValue={checkBaggage("INF", baggage)} />
				</div>
			  </div>
			  
			))}
			
			<div className="card mb-2">
				<div className="card-body">
					<div className="card-header"><i className="bi bi-credit-card-2-front"></i> Payment Method</div>
					<div className="d-flex align-items-center p-3 my-3 bg-light rounded shadow-sm">
						<div className="align-items-center mb-3">
							
							<div className="form-check">
								<input className="form-check-input" type="radio" value="paystack"  {...register("payment_method", { required: "Select payment method"  })} id="flexCheckDefault" onChange={ e => handleChange(e) } defaultChecked={false} />
								<label className="form-check-label" htmlFor="flexCheckDefault">
									Paystack
								</label>
							</div>
							
							<div className="form-check">
								<input className="form-check-input" type="radio" value="bank transfer" {...register("payment_method", { required: "Select payment method"  })} id="flexCheckChecked" onChange={ e => handleChange(e) } defaultChecked={false} />
								<label className="form-check-label" htmlFor="flexCheckChecked">
									Bank Transfer
								</label>
							</div>
							
						</div>
						
					</div>
				</div>
			</div>
			
			{check =='bank transfer' && (
			<div className="card">
				<div className="card-body">
					<div className="card-header"><i className="bi bi-bank"></i>  Chose Bank</div>
					<div className="d-flex align-items-center p-3 my-3 bg-light rounded shadow-sm">
						<div className="align-items-center">
							
								
						{bank && bank.map((d, k) => (
						<div className="form-check" key={k}>
						  <input 
							className="form-check-input" 
							type="radio" 
							value={d.id} // Use dynamic value
							{...register("bank", { required: "Select bank" })} 
							id={`flexbank${k}`} // Use unique ID for each bank
							onChange={e => handlebankChange(e)} 
							defaultChecked={false} 
						  />
						  <label className="form-check-label text-dark fw-bold" htmlFor={`flexbank${k}`}>
							{d.bank_name} <i className="bi bi-arrow-right"></i> ({d.account_number}, {d.account_name})  {/* Dynamically display bank name */}
						  </label>
						</div>
						))}
							
						</div>
						
					</div>
				</div>
			</div>)}
			
			
			{check =='paystack' && ( <div className="box-button-book">
					   <PaystackButton type="submit" className="btn btn-book" {...componentProps} />
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 15L15 8L8 1M15 8L1 8" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                      </svg>
			</div>)}
			
			{check =='bank transfer' && ( <div className="box-button-book">
					  <button type="submit" className="btn btn-book">
							Continue <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M8 15L15 8L8 1M15 8L1 8" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                      </svg>
					  </button>
			</div>)}
				<input type="hidden" {...register("request_type")} value="book_flight" />
				<input type="hidden" {...register("sessionid")} value={params.get('session') || ""} />
				<input type="hidden" {...register("itenary_id")} value={params.get('id') || ""} />
				<input type="hidden" {...register("adult")} value={adults} />
				<input type="hidden" {...register("children")} value={child} />
				<input type="hidden" {...register("infant")} value={infants} />
				<input type="hidden" {...register("countinfant")} value={infants > 0 ? infants : 0} />
				<input type="hidden" {...register("countadult")} value={adults > 0 ? adults : 0} />
				<input type="hidden" {...register("countchild")} value={child > 0 ? child : 0} />
				<input type="hidden" {...register("amount")} value={allresponse && allresponse.ShoppingCart && allresponse.ShoppingCart.Flights[0].AirItineraryPricingInfo.TotalPrice || 0} />
			</form>
			
			
			
			)}
			</div>
			{air && (
            <div className="col-lg-4 py-3">
				<div className="card p-4 rounded shadow-sm" style={{ backgroundColor:"#f0f8ff" }}>
					<p className="mb-3">Summary of Charges</p>
					<div className="d-flex justify-content-between">
						<span>Base Fare:</span>
						<span><strong>{allresponse && allresponse.ShoppingCart.Flights[0].AirItineraryPricingInfo.CurrencyCode}{FormatNumberWithComma(allresponse && allresponse.ShoppingCart && allresponse.ShoppingCart.Flights[0]?.AirItineraryPricingInfo.BasePrice || 0)}</strong></span>
					</div>
				  
					<div className="d-flex justify-content-between">
						<span>Tax:</span>
						<span><strong>{allresponse && allresponse.ShoppingCart.Flights[0].AirItineraryPricingInfo.CurrencyCode}{FormatNumberWithComma(allresponse && allresponse.ShoppingCart && allresponse.ShoppingCart.Flights[0].AirItineraryPricingInfo.Tax || 0)}</strong></span>
					</div>
				  
					<div className="d-flex justify-content-between">
						<span>Total Price:</span>
						<span><strong>{allresponse && allresponse.ShoppingCart.Flights[0].AirItineraryPricingInfo.CurrencyCode}{FormatNumberWithComma(allresponse && allresponse.ShoppingCart && allresponse.ShoppingCart.Flights[0].AirItineraryPricingInfo.TotalPrice || 0)}</strong></span>
					</div>
				  
					<div className="d-flex justify-content-between">
						<span>Number of travelers:</span>
						<span><strong>{adults + child + infants}</strong></span>
					</div>
				</div>
				 
            </div>
			)}
			
          </div>
        </div>
      </section>
	 
	  
		
	  
	  </div>
	)}
    </main>
	<div className="bg-footer"></div>
			 <Footer />
			
	</Layout>
	</AnimatePresence>
		</>
	)
}

const MyFlightDetailComponentWithSuspense = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <FlightDetail />
  </Suspense>
);

export default MyFlightDetailComponentWithSuspense;