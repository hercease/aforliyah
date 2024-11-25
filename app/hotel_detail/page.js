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


const HotelDetails = () => {

    const pathname = usePathname(); // Get the current pathname
    const searchParams = useSearchParams();
    const [collapseshow, setCollapseshow] = useState(false);
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
    const [currentSlide, setCurrentSlide] = useState(0);

    const slider1 = useRef(null);
    const slider2 = useRef(null);

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
           setHotelDetail(response.data);
         } catch (error) {
           console.error('Error sending request:', error);
         } finally {
           //console.info("It worked");
           setIsLoading(false);
         }
       };

       fetchData();
   }, [payload,router]);

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
                                <Slider {...settingsMain} asNavFor={nav2} ref={(slider) => setNav1(slider)}>
                                    {hoteldetails?.Hotels?.[0]?.HotelImages?.length > 0 && hoteldetails?.Hotels[0]?.HotelImages.map((src, index) => (
                                    <div key={index}>
                                        <Image src={src || "/assets/imgs/hotelimage.gif"} width={300} height={300} quality={100} priority alt={`Slide ${index}`} style={{ width: "100%" }} />
                                    </div>
                                    ))}
                                </Slider>

                                {/* Thumbnail Carousel */}
                                <Slider {...settingsThumbs} asNavFor={nav1}>
                                    {hoteldetails?.Hotels?.[0]?.HotelImages?.length > 0 && hoteldetails?.Hotels[0]?.HotelImages.map((src, index) => (
                                    <div onClick={() => { nav1?.slickGoTo(index) }} key={index}>
                                        <Image src={src || "/assets/imgs/hotelimage.gif"} width={100} height={100} quality={100} priority  alt={`Thumbnail ${index}`} style={{ width: "80px", height: "80px", objectFit: "cover" }} />
                                    </div>
                                    ))}
                                </Slider>
                            </div>
                            <div className='col-md-6'>

                                <div className="card border-0 p-1">
                                        <div className="card-header fw-bold mb-3">Hotel Info</div>
                                        <h6 className='h6'>{hoteldetails?.Hotels?.[0]?.HotelName && hoteldetails?.Hotels?.[0]?.HotelName}</h6>
                                        {hoteldetails?.Hotels?.[0]?.HotelDescription?.length > 0 &&
                                            <ReadMoreLess text={hoteldetails?.Hotels[0]?.HotelDescription[0]} limit={250} />
                                        } 
                                    </div>
                                

                            </div>
                            
                        </div>
                        <div className="row">
                            <div className="col-md-6 py-2">
                                <div className="card border-0 p-1">
                                    <div className="card-header fw-bold mb-3">Contact details</div>
                                    <ul className="list-group list-group-flush">
                                        <li className='list-group-item'><b className="fw-bold">Address</b> : {hoteldetails?.Hotels?.[0]?.HotelAddress && (
                                                        `${hoteldetails.Hotels[0].HotelAddress.StreetAddress}, ${hoteldetails.Hotels[0].HotelAddress.CityName}, ${hoteldetails.Hotels[0].HotelAddress.RegionName}, ${hoteldetails.Hotels[0].HotelAddress.ZIP}, ${hoteldetails.Hotels[0].HotelAddress.CountryCode }`
                                                    )}</li>
                                        <li className='list-group-item'><b className="fw-bold">Phone</b> : {hoteldetails?.Hotels?.[0]?.HotelAddress && hoteldetails?.Hotels?.[0]?.HotelPhone} </li>
                                    </ul>
                                    </div>
                            </div>
                            <div className='col-md-6'>

                                <div className="card border-0">
                                    <div className="card-header fw-bold">Hotel Amenities</div>
                                        <ul className="list-group list-group-flush">
                                        {hoteldetails?.Hotels?.[0]?.HotelAmenitiesCollection?.length > 0 && hoteldetails?.Hotels[0]?.HotelAmenitiesCollection.map((p, key) => (
                                            <React.Fragment key={key}>
                                                <li className='list-group-item'>{p.Name}</li> 
                                            </React.Fragment>
                                        ))}
                                        </ul>
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
                                                <h6 className="card-subtitle mb-2 text-muted">{p.CancelPenalty.AmountPercent.CurrencyCode}{FormatNumberWithComma(p.RoomRate)}</h6>
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
                                                <li className="list-group-item">Cancellation Policy: Cancellation fee of {p.CancellationPenalties[0].CurrencyCode}{FormatNumberWithComma(p.CancellationPenalties[0].Amount)} if cancelled after {formatDate(p.CancellationPenalties[0].DeadlineDate)}, {formatTime(p.CancellationPenalties[0].DeadlineDate)}(Local Time)</li>
                                                </ul>
                                                <a href="#" className="btn btn-gray mt-3 btn-sm">Book Now</a>
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