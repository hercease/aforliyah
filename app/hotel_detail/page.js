'use client'
import React, {  useEffect, useState, useRef, useMemo, Suspense, useCallback } from 'react';
import { useTheme } from '@mui/material/styles';
import Image from "next/image";
import Footer from '../../components/footer';
import PhoneIcon from '@mui/icons-material/Phone';
import HotelIcon from '@mui/icons-material/Hotel';
import AppsIcon from '@mui/icons-material/Apps';
import Typography from '@mui/material/Typography';
import { useRouter,usePathname,useSearchParams  } from 'next/navigation'
import 'bootstrap-icons/font/bootstrap-icons.css';
import Button from '@mui/material/Button';
import { Controller,useForm } from "react-hook-form";
import Layout from '../../components/layout';
import { AnimatePresence } from 'framer-motion';
import { Offcanvas } from 'react-bootstrap';
import Nouislider from 'nouislider-react';
import axios from 'axios';
import { Card, Form, Table, ButtonGroup, InputGroup,ListGroup, Input, Dropdown, Row, Col, Tab as BootstrapTab, Tabs as BootstrapTabs, FloatingLabel, Button as BootstrapButton, Collapse, OverlayTrigger, Tooltip  } from 'react-bootstrap';
import { AppBar,Accordion,AccordionSummary,AccordionDetails, Tabs, Tab, Tab as MaterialTab, Tabs as MaterialTabs } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import FormatNumberWithComma from '../../components/formatNumberWithComma';
import { ConstructionOutlined, RoundaboutLeftRounded } from '@mui/icons-material';
import StarIcon from "@mui/icons-material/Star";
import Modal from "../../components/Modal";
import Slider from "react-slick";
import ReadMoreLess from "../../components/ReadMoreLess";
import formatTime from '../../components/formatTime';
import formatDate from '../../components/formatDate';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import RefundIcon from '@mui/icons-material/CheckCircleOutline';
import NonRefundIcon from '@mui/icons-material/Warning';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import HotelImageSlider from "../../components/hotelImageSlider";


const HotelDetails = () => {

    const pathname = usePathname(); // Get the current pathname
    const searchParams = useSearchParams();
    const [collapseshow, setCollapseShow] = useState(false);
    const router = useRouter();
    const params = useSearchParams();
    const [searchshow, setSearchshow] = useState(false);
    const [detailshow, setDetailshow] = useState(false);
    const [filtershow, setFiltershow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hoteldetails, setHotelDetail] = useState();
    const [minimumprice, setMinimumPrice] = useState(0);
    const [maximumprice, setMaximumPrice] = useState(0);
    const [sessionid, setSessionId] = useState();
    const [pagination, setPagination] = useState();
    const [nav1, setNav1] = useState(null);
    const [nav2, setNav2] = useState(null);
    const [adults, setAdults] = useState(params.get('adults') || 0);
    const [children, setChildren] = useState(params.get('children') || 0);
    
  

    const payload = useMemo(() => {
		const session = params.get('session');
		const id = params.get('id');
		const newPayload = {};
		newPayload.session = session;
		newPayload.hotel_id = id;
		newPayload.request_type = "hotel_detail";

    return newPayload;
	}, [
        params
	]);

    useEffect(() => {
        setIsLoading(true);
       const fetchData = async () => {
         try {
           const response = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/all_processes/`, payload);
           console.log(response.data);
           if(response.data.StatusCode){
              toast.error("Session has expired",{duration: 4000});
              setTimeout(() => { router.back(); }, 4000);
           }else{
                setHotelDetail(response.data);
                setSessionId(response.data.SessionId);
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


const addHotelToCart = async ({
  sessionId,
  roomId,
  adults,
  children,
  request_type
}) => {
  // Construct the payload object
  const payload = {
    sessionId,
    roomId,
    adults,
    children,
    request_type
  };

  try {
    setIsLoading(true);
    // Send the POST request
    //console.log(payload);
    const response = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/all_processes/`,payload);
    if(response.data?.ShoppingCart){
      router.push(`/hotel_cart?sessionid=${sessionId}&adults=${adults}&children=${children}`);
    }else{
      toast.error("Ooops, hotel could not be added to cart at the momemt",{duration: 4000});
    }
    // Handle the response
    console.log("Response Data:", response.data);

    // Example: Set state or perform actions with the response data
    // setHotelDetail(response.data); // Uncomment if you have a `setHotelDetail` function
  } catch (error) {
    console.error("Error sending request:", error);
  } finally {
    console.log("Request completed.");
    setIsLoading(false); // Uncomment if you manage loading state
  }
};

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
                        <li> <span className="text-breadcrumb">All Rooms</span></li>
                      </ul>
                    </div>
                  </section>

                  <section className="box-section block-content-tourlist background-body">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-6">
                                {/* Main Carousel */}
                                {hoteldetails && <HotelImageSlider hoteldetails={hoteldetails} />}
                            </div>
                            <div className='col-md-6'>

                                <div className="card border-0 p-1">
                                    <div className="card-header fw-bold mb-3"><HotelIcon sx={{  marginRight: '8px' }} /> Hotel Info</div>
                                    <h6 className='h6 fw-bold'>{hoteldetails?.Hotels?.[0]?.HotelName && hoteldetails?.Hotels?.[0]?.HotelName}</h6>
                                    {hoteldetails?.Hotels?.[0]?.HotelDescription?.length > 0 &&
                                        <ReadMoreLess text={hoteldetails?.Hotels[0]?.HotelDescription[0]} limit={250} />
                                    } 
                                </div>
                            
                            </div>
                            
                        </div>
                        <div className="row">
                            <div className="col-md-6 py-2">
                                <div className="card border-0 p-1">
                                    <div className="card-header fw-bold mb-3"><PhoneIcon sx={{  marginRight: '8px' }} /> Contact details</div>
                                    <ul className="list-group list-group-flush">
                                        <li className='list-group-item'><b className="fw-bold">Address</b> : {hoteldetails?.Hotels?.[0]?.HotelAddress && (
                                                        `${hoteldetails.Hotels[0].HotelAddress.StreetAddress}, ${hoteldetails.Hotels[0].HotelAddress.CityName}, ${hoteldetails.Hotels[0].HotelAddress.RegionName}, ${hoteldetails.Hotels[0].HotelAddress.ZIP}, ${hoteldetails.Hotels[0].HotelAddress.CountryCode }`
                                                    )}</li>
                                        <li className='list-group-item'><b className="fw-bold">Phone</b> : {hoteldetails?.Hotels?.[0]?.HotelAddress && hoteldetails?.Hotels?.[0]?.HotelPhone} </li>
                                    </ul>
                                    </div>
                            </div>
                            <div className='col-md-6'>
                            <div className="box-collapse">
                                <div className="card border-0">
                                    <div className="card-header fw-bold"><AppsIcon sx={{  marginRight: '8px' }} /> Hotel Amenities</div>
                                        <ul className="list-group list-group-flush">
                                        {hoteldetails?.Hotels?.[0]?.HotelAmenitiesCollection?.length > 0 && hoteldetails?.Hotels[0]?.HotelAmenitiesCollection.map((p, key) => {
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
                                                  {hoteldetails?.Hotels?.[0]?.HotelAmenitiesCollection?.length > 0 &&
                                                    hoteldetails?.Hotels[0]?.HotelAmenitiesCollection.map((p, key) => {
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
                        </div>
                        <div className="box-content-main-detail">
                            <div className="box-grid-hotels box-list-hotels-detail">
                                <div className="row">
                                {hoteldetails?.Hotels?.[0]?.Rooms?.length > 0 && hoteldetails?.Hotels[0]?.Rooms.map((p, key) => (
                                    <div key={key} className='col-md-6 mb-4'>

                                        <div className="card">
                                            <div className="card-body">
                                                <h6 className="card-title">{p.Category}</h6>
                                                <h6 className="card-subtitle mb-2 text-muted">{p.CurrencyCode}{FormatNumberWithComma(p.RoomRate)}</h6>
                                                <div className="card-text">
                                                <ul>
                                                    {p?.RoomText?.length > 0 && p?.RoomText.map((m, key) => (  
                                                        <React.Fragment key={key}>
                                                            <li>{m}</li> 
                                                        </React.Fragment>
                                                    ))}
                                                </ul>   
                                                </div>
                                                <ul className="list-group list-group-flush">
                                                <li className="list-group-item">Bed: {p.BedType}</li>
                                                <li className="list-group-item">Amenities: Free Wi-Fi, AC, TV, Mini-bar</li>
                                                <li className="list-group-item">Number of Beds: {p.NumberOfBeds}</li>
                                                <li className="list-group-item">Number of Rooms: {p.NumberOfRooms}</li>

                                                {p.CancelPenalty?.CancelPenaltyNotSpecified === false &&
                                                
                                                  <li className="list-group-item">
                                                  <p>
                                                      Cancellation Policy:{" "}
                                                      {p.CancellationPenalties[0].Amount > 0 ? (
                                                          <>
                                                          Cancellation fee of {p.CancellationPenalties[0].CurrencyCode}
                                                          {FormatNumberWithComma(p.CancellationPenalties[0].Amount)} if cancelled after{" "}
                                                          {formatDate(p.CancellationPenalties[0].DeadlineDate)}, {formatTime(p.CancellationPenalties[0].DeadlineDate)} (Local Time)
                                                          </>
                                                      ) : (
                                                          <>
                                                          No Cancellation fee if cancelled before{" "}
                                                          {formatDate(p.CancellationPenalties[0].DeadlineDate)}, {formatTime(p.CancellationPenalties[0].DeadlineDate)} (Local Time)
                                                          </>
                                                      )}
                                                      </p>
                                                  </li>
                                                }

                                                <li className="list-group-item">
                                                    {p.CancelPenalty?.CancelPenaltyNotSpecified === true ? (
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

                                                </ul>

                                                <a
                                                    className="btn btn-gray mt-3 btn-sm"
                                                    onClick={() =>

                                                        router.push(`/hotel_cart?sessionId=${sessionid}&roomId=${p.Id}&adults=${adults}&children=${children}`)
                                                    }
                                                    >
                                                    Book Now
                                                    </a> 
                                                </div>
                                        </div>
                                    </div>
                                ))}
                                </div>
                            </div>
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

const MyComponentWithSuspense = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <HotelDetails />
  </Suspense>
);

export default MyComponentWithSuspense;