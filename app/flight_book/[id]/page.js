'use client'
import React, { useEffect, useState, useRef, useMemo, Suspense, useCallback } from 'react';
import Image from "next/image";
import Head from 'next/head';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import { Card, Form, ButtonGroup, InputGroup, Input, Dropdown, Row, Col, Tab as BootstrapTab, Tabs as BootstrapTabs, FloatingLabel  } from 'react-bootstrap';
import { AppBar,Accordion,AccordionSummary,AccordionDetails, Tabs, Tab, Tab as MaterialTab, Tabs as MaterialTabs } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import FlightIcon from '@mui/icons-material/Flight';
import { Swiper, SwiperSlide } from 'swiper/react';
import TextField from '@mui/material/TextField';
import FilledInput from '@mui/material/FilledInput';
import OutlinedInput from '@mui/material/OutlinedInput';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Button from '@mui/material/Button';
import { Controller,useForm } from "react-hook-form";
import { AnimatePresence } from 'framer-motion';
import { ClipLoader, BounceLoader } from 'react-spinners';
import Layout from '../../../components/layout';
import { useRouter,usePathname,useSearchParams,useParams } from 'next/navigation'
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import Footer from '../../../components/footer';

const BookingConfirmation = () => {
	const params = useSearchParams();
	const pathname = usePathname(); // Get the current pathname
	const [isLoading, setIsLoading] = useState(false);
	const [pnr, setPnr] = useState("");
	const router = useRouter();
	const { id } = useParams();

	const payload = useMemo(() => {
		
		const newPayload = {};
		newPayload.id = id;
		newPayload.request_type = "fetch_flight";

		return newPayload;
	}, [
    id
	]);
	console.log(payload);
	useEffect(() => {
		 setIsLoading(true);
		const fetchData = async () => {
		  try {
			  
				const response  = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/all_processes/`, payload);
				console.log(response.data);
				if(response.data.status==1){
					setPnr(response.data.pnr);
				}else{
					toast.error("There was an error fetching Pnr",{duration: 4000});
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
	
    return (
	<AnimatePresence mode="wait">
	<Layout key={pathname}>
	<main style={{ background: "var(--bs-gray-100)" }} className="main">
		{isLoading && pnr ? (
			<div className="d-flex justify-content-center align-items-center" style={{  height: "50vh" }}>
				<BounceLoader color="#0d6efd" size={200} aria-label="Loading" />
			</div>
		) : (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="container">
				<div className="col-md-12 col-lg-4 mx-auto">
                <div className="card border-0 shadow-lg rounded-start">
                    <div className="card-body">
                        <div className="card-header text-center fw-bold">
                            <h5>Booking Confirmation</h5>
                        </div>
                        <div className="row mt-4">
                            <div className="col-md-12 text-center">
                                <h5>Booking Reference</h5>
                                <p className="fw-bold h4">{pnr}</p>
                            </div>
                        </div>

                        <div className="alert alert-light mt-4" role="alert">
                            <i className="fas fa-info-circle"></i>
                            Please Note that the Booking Reference Number is not yet a ticket. E-ticket will be delivered to the email address that you specified after we issue it. Have a nice day!
                        </div>
                    </div>

                    <div className="card-footer text-light text-center bg-primary">
                        Safe Travels! For further assistance, call our customer support at +234 805 943 2724
                    </div>
                </div>
            </div>
            </div>
        </div>
		)}
		</main>
		<div className="bg-footer"></div>
			 <Footer />
		</Layout>
		</AnimatePresence>
    );
}

const MyFlightBookingComponentWithSuspense = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <BookingConfirmation />
  </Suspense>
);

export default MyFlightBookingComponentWithSuspense;