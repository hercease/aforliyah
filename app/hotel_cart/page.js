'use client'
import React, {  useEffect, useState, useRef, useMemo, Suspense, useCallback } from 'react';
import { useTheme } from '@mui/material/styles';
import Image from "next/image";
import Footer from '../../components/footer';
import DatePicker from "../../components/Flatpickr.js"
import HotelCustomTypeahead from '../../components/HotelCustomTypehead';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import Typography from '@mui/material/Typography';
import { useRouter,usePathname,useSearchParams  } from 'next/navigation'
import 'bootstrap-icons/font/bootstrap-icons.css';
import Button from '@mui/material/Button';
import { Controller,useForm } from "react-hook-form";
import Layout from '../../components/layout';
import HotelIcon from '@mui/icons-material/Hotel';
import { AnimatePresence } from 'framer-motion';
import { Offcanvas } from 'react-bootstrap';
import Nouislider from 'nouislider-react';
import axios from 'axios';
import { Card, Form, Table, ButtonGroup, InputGroup,ListGroup, Input, Dropdown, Row, Col, Tab as BootstrapTab, Tabs as BootstrapTabs, FloatingLabel, Button as BootstrapButton, Collapse, OverlayTrigger, Tooltip  } from 'react-bootstrap';
import { AppBar,Accordion,AccordionSummary,AccordionDetails, Tabs, Tab, Tab as MaterialTab, Tabs as MaterialTabs } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import FormatNumberWithComma from '../../components/formatNumberWithComma';
import { ConstructionOutlined } from '@mui/icons-material';
import StarIcon from "@mui/icons-material/Star";
import Modal from "../../components/Modal";
import Slider from "react-slick";
import ReadMoreLess from "../../components/ReadMoreLess";
import formatTime from '../../components/formatTime';
import formatDate from '../../components/formatDate';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import AppsIcon from '@mui/icons-material/Apps';
import RefundIcon from '@mui/icons-material/CheckCircleOutline';
import NonRefundIcon from '@mui/icons-material/Warning';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import PhoneIcon from '@mui/icons-material/Phone';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import dynamic from 'next/dynamic'
const PaystackButton = dynamic(() => import('react-paystack').then(mod => mod.PaystackButton));

const HotelCart = () => {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname(); // Get the current pathname

  const [hoteldetails, setHotelDetail] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const slider1 = useRef(null);
  const slider2 = useRef(null);
  const [collapseshow, setCollapseShow] = useState(false);
  const [bank, setBank] = useState();
  const [check, setCheck] = useState('');
	const [bankcheck, setBankCheck] = useState('');
	
	const { register, watch, formState: { errors, isValid }, handleSubmit, reset, setValue, getValues } = useForm({mode: "onChange"});

  useEffect(() => {
    setNav2(nav1);
  }, [nav1]);

  const settingsMain = {
    asNavFor: nav2,
    //arrows: true,
    autoplay: true,
    onReInit: () => setCurrentSlide(nav1?.innerSlider.state.currentSlide),
  };

  const settingsThumbs = {
    asNavFor: nav1,
    slidesToShow: 6,
    swipeToSlide: true,
    focusOnSelect: true,
    swipeToSlide:true
  };

  const payload = useMemo(() => {

		const session = params.get('sessionId');
		const adults = params.get('adults');
		const roomId = params.get('roomId');
		const children = params.get('children');
		const newPayload = {};
		newPayload.sessionId = session;
		newPayload.adults = adults;
		newPayload.roomId = roomId;
		newPayload.children = children;
		newPayload.request_type = "add_hotel_to_cart";

    return newPayload;

	}, [
      params
	]);

  useEffect(() => {
    setIsLoading(true);
   const fetchData = async () => {
     try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/all_processes/`, payload);
        //console.log(response.data);
        if(response.data?.hotel?.ShoppingCart){
          setHotelDetail(response.data.hotel);
          setBank(response.data.bankaccount);
        }else{
          toast.error("Ooops, Session has expired",{duration: 4000});
          setTimeout(() => { router.back(); }, 4000);
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

// you can call this function anything
const handlePaystackCloseAction = () => {
  // implementation for  whatever you want to do when the Paystack dialog closed.
  console.log('closed')
}

const config = {
  reference: new Date().getTime().toString(),
  email: watch('email_0'), // Placeholder, will be dynamically set
  amount: watch('amount') * 100, // Placeholder, will be dynamically set
  publicKey: process.env.NEXT_PUBLIC_PAYSTACK_KEY
};

const componentProps = {
  ...config,
  text: 'Continue',
  onSuccess: (reference) => handlePaystackSuccessAction(reference),
  onClose: handlePaystackCloseAction,
};


//console.log(register);

  const handlePaystackSuccessAction = (reference) => {
      console.log("Payment successful:", reference);
    axios.post(`${process.env.NEXT_PUBLIC_HOST}/all_processes/`,{reference : reference['reference'], request_type:'check_payment' }).then(function(response){
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

    const onSubmit = (data) => {
      console.log("Form data:", data);
      //data.flight = air;
      if(check=="bank transfer"){
        handleConfirmedSubmit(watch());
      }
    };

    const handleConfirmedSubmit = (data) => {
      // If the user confirms, proceed with form submission
        //console.log(data);
      try {
        setIsLoading(true);
        axios.post(`${process.env.NEXT_PUBLIC_HOST}/all_processes/`, data).then((response)=>{
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

      // Update the hidden field value when hoteldetails changes
  useEffect(() => {

    if (hoteldetails?.ShoppingCart?.Hotels?.[0]?.Rooms[0]?.RoomRate) {
      setValue("amount", hoteldetails.ShoppingCart.Hotels[0].Rooms[0].RoomRate);
      setValue("total_guest", hoteldetails?.ShoppingCart.Travellers.length);
    }
    
  }, [hoteldetails, setValue]);
    

    return (
        <>

            <AnimatePresence mode="wait">
              <Layout key={pathname}>
                <main className="main">
                {isLoading ? (
                  <div className="d-flex justify-content-center align-items-center" style={{  height: "50vh" }}>
					            <Image alt="Aforliyah preloader" width={100} height={100} src="/assets/imgs/aforliyah_preloader.gif" />
                  </div>
                  ) : (
                  <div>
                    <section className="box-section box-breadcrumb background-body">
                    <div className="container"> 
                      <ul className="breadcrumbs"> 
                        <li> 
                            <a href="">Home</a>
                            <span className="arrow-right"> 
                                <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 11L6 6L1 1" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                </svg>
                            </span>
                        </li>
                        <li> 
                            <a href="#">Hotels</a>
                            <span className="arrow-right"> 
                                <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 11L6 6L1 1" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                </svg>
                            </span>
                        </li>
                        <li> <span className="text-breadcrumb">Cart</span></li>
                      </ul>
                    </div>
                  </section>

                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                {/* Main Carousel */}
                                <Image src={hoteldetails?.ShoppingCart?.Hotels?.[0]?.HotelMainImage || "/assets/imgs/hotelimage.gif" } layout="intrinsic" width={300} height={300} quality={100} priority alt="Hotel image" style={{ width: "100%" }} />
                            </div>
                            <div className='col-md-6'>

                                <div className="card border-0 p-1">
                                    <div className="card-header fw-bold mb-3"><HotelIcon sx={{  marginRight: '8px' }} /> Hotel Description</div>
                                    <h6 className='h6 fw-bold'>{hoteldetails?.ShoppingCart?.Hotels?.[0]?.HotelName && hoteldetails?.ShoppingCart?.Hotels?.[0]?.HotelName}</h6>
                                    {hoteldetails?.ShoppingCart?.Hotels?.[0]?.HotelDescription?.length > 0 &&
                                      <ReadMoreLess text={hoteldetails?.ShoppingCart?.Hotels[0]?.HotelDescription[0]} limit={250} />
                                    } 
                                </div>
                            
                            </div>

                            <div className="col-md-6 py-2">
                                <div className="card border-0 p-1">
                                    <div className="card-header fw-bold mb-3"><PhoneIcon sx={{  marginRight: '8px' }} /> Contact details</div>
                                    <ul className="list-group list-group-flush">
                                        <li className='list-group-item'>
                                          <b className="fw-bold">Address</b> : {hoteldetails?.ShoppingCart?.Hotels?.[0]?.HotelAddress && (`${hoteldetails?.ShoppingCart?.Hotels[0].HotelAddress.StreetAddress}, ${hoteldetails?.ShoppingCart.Hotels[0].HotelAddress.CityName}, ${hoteldetails?.ShoppingCart.Hotels[0].HotelAddress.RegionName}, ${hoteldetails?.ShoppingCart?.Hotels[0].HotelAddress.ZIP}, ${hoteldetails?.ShoppingCart.Hotels[0].HotelAddress.CountryCode }`
                                          )}
                                        </li>
                                        <li className='list-group-item'><b className="fw-bold">Phone</b> : {hoteldetails?.ShoppingCart?.Hotels?.[0]?.HotelAddress && hoteldetails?.ShoppingCart?.Hotels?.[0]?.HotelPhone} </li>
                                    </ul>
                                  </div>
                            </div>
                            <div className='col-md-6'>
                            <div className="box-collapse">
                                <div className="card border-0">
                                    <div className="card-header fw-bold"><AppsIcon sx={{  marginRight: '8px' }} /> Hotel Amenities</div>
                                        <ul className="list-group list-group-flush">
                                        {hoteldetails?.ShoppingCart?.Hotels?.[0]?.HotelAmenitiesCollection?.length > 0 && hoteldetails?.ShoppingCart?.Hotels[0]?.HotelAmenitiesCollection.map((p, key) => {
                                          if (key < 10) {
                                            return (
                                            <React.Fragment key={key}>
                                                {p.Name && <li className='list-group-item'>{p.Name}</li>}
                                            </React.Fragment>
                                          );
                                        }
                                        return null; // Return nothing if the item is not to be displayed
                                      })}
                                      
                                          <Collapse in={collapseshow}>
                                            <ul className="list-group list-group-flush">
                                              {hoteldetails?.ShoppingCart?.Hotels?.[0]?.HotelAmenitiesCollection?.length > 0 &&
                                                hoteldetails?.ShoppingCart?.Hotels[0]?.HotelAmenitiesCollection.map((p, key) => {
                                                  if (key >= 10) {
                                                    return (
                                                      <React.Fragment key={key}>
                                                        {p.Name && <li className="list-group-item">{p.Name}</li>}
                                                      </React.Fragment>
                                                    );
                                                  }
                                                  return null;
                                                })}
                                            </ul>
                                          </Collapse>
                                          <div className="mx-auto" onClick={() => setCollapseShow(!collapseshow)}>{collapseshow ? <ExpandLessIcon /> : <ExpandMoreIcon />}</div>
                                         
                                      </ul>
                                     
                                </div>
                                </div>

                            </div>
                            <div className='col-md-6'>
                                <div className="card border-0">
                                      <div className="card-header fw-bold"><AppsIcon sx={{  marginRight: '8px' }} /> Order Details</div>
                                          <ul className="list-group list-group-flush">
                                            <li className='list-group-item'>Checkin Date : {hoteldetails?.ShoppingCart?.Hotels?.[0]?.CheckInDate}</li>
                                            <li className='list-group-item'>Checkout Date : {hoteldetails?.ShoppingCart?.Hotels?.[0]?.CheckOutDate}</li>
                                            <li className='list-group-item'>Room Type Code: {hoteldetails?.ShoppingCart?.Hotels?.[0]?.Rooms[0]?.RoomTypeCode}</li>
                                            <li className='list-group-item'>Bed Type : {hoteldetails?.ShoppingCart?.Hotels?.[0]?.Rooms[0]?.BedType}</li>
                                            <li className='list-group-item'>Guarantee Type : {hoteldetails?.ShoppingCart?.Hotels?.[0]?.Rooms[0]?.GuaranteeType}</li>
                                            
                                            {hoteldetails?.ShoppingCart?.Hotels?.[0]?.Rooms[0]?.CancelPenalty?.CancelPenaltyNotSpecified === false &&
                                                
                                                <li className="list-group-item">
                                                <p>
                                                    Cancellation Policy:{" "}
                                                    {hoteldetails?.ShoppingCart?.Hotels?.[0]?.Rooms[0]?.CancellationPenalties[0].Amount > 0 ? (
                                                        <>
                                                        Cancellation fee of {hoteldetails?.ShoppingCart?.Hotels?.[0]?.Rooms[0]?.CancellationPenalties[0].CurrencyCode}
                                                        {FormatNumberWithComma(hoteldetails?.ShoppingCart?.Hotels?.[0]?.Rooms[0]?.CancellationPenalties[0].Amount)} if cancelled after{" "}
                                                        {formatDate(hoteldetails?.ShoppingCart?.Hotels?.[0]?.Rooms[0]?.CancellationPenalties[0].DeadlineDate)}, {formatTime(hoteldetails?.ShoppingCart?.Hotels?.[0]?.Rooms[0]?.CancellationPenalties[0].DeadlineDate)} (Local Time)
                                                        </>
                                                    ) : (
                                                        <>
                                                        No Cancellation fee if cancelled before{" "}
                                                        {formatDate(hoteldetails?.ShoppingCart?.Hotels?.[0]?.Rooms[0]?.CancellationPenalties[0].DeadlineDate)}, {formatTime(hoteldetails?.ShoppingCart?.Hotels?.[0]?.Rooms[0]?.CancellationPenalties[0].DeadlineDate)} (Local Time)
                                                        </>
                                                    )}
                                                    </p>
                                                </li>
                                              }

                                              <li className="list-group-item">
                                                  {hoteldetails?.ShoppingCart?.Hotels?.[0]?.Rooms[0]?.CancelPenalty?.CancelPenaltyNotSpecified === true ? (
                                                    <>
                                                      <NonRefundIcon style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                                                      Non-Refundable
                                                    </>
                                                  ) : (
                                                    <>
                                                      Refundable
                                                      <RefundIcon style={{ verticalAlign: 'middle', marginLeft: '8px' }} />
                                                    </>
                                                  )}
                                              </li>
                                              <li className='list-group-item'>Base Room Rate : {hoteldetails?.ShoppingCart?.Hotels?.[0]?.CurrencyCode}{FormatNumberWithComma(hoteldetails?.ShoppingCart?.Hotels?.[0]?.Rooms[0]?.BaseRoomRate || 0)}</li>
                                              <li className='list-group-item'>Total Taxes : {hoteldetails?.ShoppingCart?.Hotels?.[0]?.CurrencyCode}{FormatNumberWithComma(hoteldetails?.ShoppingCart?.Hotels?.[0]?.Rooms[0]?.TotalTaxes || 0)}</li>
                                              <li className='list-group-item'>Total Payable : {hoteldetails?.ShoppingCart?.Hotels?.[0]?.CurrencyCode}{FormatNumberWithComma(hoteldetails?.ShoppingCart?.Hotels?.[0]?.Rooms[0]?.RoomRate || 0)}</li>
                                          </ul>
                                  </div>
                            </div>
                              <form onSubmit={handleSubmit(onSubmit)}>
                               <div className='col-md-12'>
                                <div className="card border-0">
                                      <div className="card-header fw-bold mb-2"><PeopleAltIcon sx={{  marginRight: '8px' }} /> Travellers</div>
                                     
                                      {hoteldetails?.ShoppingCart.Travellers.length > 0 && hoteldetails?.ShoppingCart?.Travellers.map((k,index) => (  
                                          <div key={index} className="card mb-3">
                                          <div className="card-body">
                                            <div className="card-header mb-2">Traveller {index + 1} ({k.TypeCode=='ADT' ? 'Adult' : 'Child'}) </div>
                                            <p className="h6 fw-light small mb-0 alert alert-info"><span className="badge bg-danger me-2">New</span>Please make sure you enter the Name as per your passport</p>
                                            
                                            <div className="mb-3">
                                              <label>Title</label>
                                              <select {...register(`title_${index}`, { required: "Select title"  })} className="form-select">
                                                <option value="">Select title</option>
                                                <option value="Mr">Mr</option>
                                                <option value="Mrs">Mrs</option>
                                                <option value="Miss">Miss</option>
                                              </select>
                                              {errors[`title_${index}`] && (
                                                <div className='text-danger mt-1'>
                                                <ErrorOutlineRoundedIcon fontSize="small" />
                                                {errors[`title_${index}`]?.message}
                                                </div>
                                              )}
                                            </div>
                                            <div className="mb-3">
                                              <label>First Name</label>
                                              <input type="text"  {...register(`firstname_${index}`, { required: "Enter firstname"  })} className="form-control" placeholder="First Name" />
                                              {errors[`firstname_${index}`] && (
                                                <div className='text-danger mt-1'>
                                                <ErrorOutlineRoundedIcon fontSize="small" />
                                                {errors[`firstname_${index}`]?.message}
                                                </div>
                                              )}
                                            </div>
                                            <div className="mb-3">
                                              <label>Last Name</label>
                                              <input type="text" {...register(`lastname_${index}`, { required: "Enter lastname"  })} className="form-control" placeholder="Last Name" />
                                              {errors[`lastname_${index}`] && (
                                                <div className='text-danger mt-1'>
                                                <ErrorOutlineRoundedIcon fontSize="small" />
                                                {errors[`lastname_${index}`]?.message}
                                                </div>
                                              )}
                                            </div>

                                            {k.TypeCode=="ADT" ? (

                                            <div className="mb-3">
                                              <label>Date of Birth</label>
                                              <input
                                                type="date"
                                                {...register(`dob_${index}`, {
                                                  required: "Enter date of birth",
                                                  validate: (value) => {
                                                    const selectedDate = new Date(value);
                                                    const currentDate = new Date();
                                                    const minDate = new Date(currentDate.setFullYear(currentDate.getFullYear() - 18));
                                                    return selectedDate < minDate || "Must be at least 18 years old";
                                                  }
                                                })}
                                                className="form-control"
                                              />
                                              {errors[`dob_${index}`] && (
                                                <div className='text-danger mt-1'>
                                                  <ErrorOutlineRoundedIcon fontSize="small" />
                                                  {errors[`dob_${index}`]?.message}
                                                </div>
                                              )}
                                            </div>

                                            ) : (

                                            <div className="mb-3">
                                                <label>Date of Birth</label>
                                                <input type="date" {...register(`dob_${index}`, { 
                                                  required: "Enter date of birth",
                                                  validate: (value) => {
                                                    const selectedDate = new Date(value);
                                                    const currentDate = new Date();
                                                    const minDate = new Date(currentDate.setFullYear(currentDate.getFullYear() - 17));
                                                    return selectedDate > minDate || "Must be between 0 - 17 years old";
                                                    
                                                  } 
                                                })}  		

                                                className="form-control" />

                                                {errors[`dob_${index}`] && (
                                                  <div className='text-danger mt-1'>
                                                  <ErrorOutlineRoundedIcon fontSize="small" />
                                                    {errors[`dob_${index}`]?.message}
                                                  </div>
                                                )}
                                              </div>

                                            )
                                          }

                                            <div className="mb-3">
                                              <label>Gender</label>
                                              <select className="form-select" {...register(`gender_${index}`, { required: "Select gender"  })} >
                                                <option value="">Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                              </select>
                                              {errors[`gender_${index}`] && (
                                                <div className='text-danger mt-1'>
                                                <ErrorOutlineRoundedIcon fontSize="small" />
                                                {errors[`gender_${index}`]?.message}
                                                </div>
                                              )}
                                            </div>

                                          {k.TypeCode=="ADT" && (
                                            <>
                                            <div className="mb-3">
                                              <label>Phone</label>
                                              <input type="number" {...register(`phone_${index}`, { required: "Enter phone no"  })} className="form-control" placeholder="Mobile number" />
                                              {errors[`phone_${index}`] && (
                                                <div className='text-danger mt-1'>
                                                <ErrorOutlineRoundedIcon fontSize="small" />
                                                {errors[`phone_${index}`]?.message}
                                                </div>
                                              )}
                                            </div>
                                            <div className="mb-3">
                                              <label>Email Address</label>
                                              <input
                                                type="email"
                                                {...register(`email_${index}`, {
                                                  required: "Enter email address"
                                                })}
                                                className="form-control"
                                                placeholder="Email address"
                                              />
                                              {errors[`email_${index}`] && (
                                                <div className='text-danger mt-1'>
                                                <ErrorOutlineRoundedIcon fontSize="small" />
                                                {errors[`email_${index}`]?.message}
                                                </div>
                                              )}
                                            </div>

                                            <div className="mb-3">
                                              <label>Confirm Email Address</label>
                                              <input
                                                type="email"
                                                {...register(`confirm_email_${index}`, {
                                                  required: "Please confirm email address!",
                                                  validate: (value) => {
                                                    const email = getValues(`email_${index}`);
                                                    return email === value || "Email addresses do not match";
                                                  }
                                                })}
                                                className="form-control"
                                                placeholder="Confirm Email address"
                                              />
                                              {errors[`confirm_email_${index}`] && (
                                                <div className='text-danger mt-1'>
                                                <ErrorOutlineRoundedIcon fontSize="small" />
                                                {errors[`confirm_email_${index}`]?.message}
                                                </div>
                                              )}
                                            </div>

                                            </>
                                          )}
                                            
                                            <div className="mb-3">
                                              <label>Passport No</label>
                                              <input
                                                type="text"
                                                {...register(`passport_${index}`, {
                                                  required: "Enter passport no"
                                                })}
                                                className="form-control"
                                                placeholder="Passport Number"
                                              />
                                              {errors[`passport_${index}`] && (
                                                <div className='text-danger mt-1'>
                                                <ErrorOutlineRoundedIcon fontSize="small" />
                                                {errors[`passport_${index}`]?.message}
                                                </div>
                                              )}
                                            </div>
                                            <input type="hidden" {...register(`typecode_${index}`)} defaultValue={k.TypeCode} />

                                          </div>
                                          </div>
                                        ))}
                                </div>
                            </div>
                            
                            <div className='col-md-12'>
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
                                      
                                      {/*<div className="form-check">
                                        <input className="form-check-input" type="radio" value="bank transfer" {...register("payment_method", { required: "Select payment method"  })} id="flexCheckChecked" onChange={ e => handleChange(e) } defaultChecked={false} />
                                        <label className="form-check-label" htmlFor="flexCheckChecked">
                                          Bank Transfer
                                        </label>
                                      </div>*/}
                                      
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
                                      value={d.bank_name} // Use dynamic value
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

                                      {errors[`bank`] && (
                                          <div className='text-danger mt-1'>
                                            <ErrorOutlineRoundedIcon fontSize="small" />
                                          {errors[`bank`]?.message}
                                          </div>
                                      )}

                                      
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

				                    <input type="hidden" {...register("amount")} />
                            <input type="hidden" {...register("sessionid")} value={params.get('sessionId') || ""} />
                            <input type="hidden" {...register("total_guest")} />
                            <input type="hidden" {...register("request_type")} value="book_hotel" />

                            </form>
                            
                        </div>
                      </div>

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

const MyComponentWithSuspense = () => (
    <Suspense fallback={<div>Loading...</div>}>
      <HotelCart />
    </Suspense>
  );
  
  export default MyComponentWithSuspense;