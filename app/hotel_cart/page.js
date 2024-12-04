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
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';

const HotelCart = () => {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname(); // Get the current pathname

  const [hoteldetails, setHotelDetail] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const payload = useMemo(() => {
		const session = params.get('session');
		const id = params.get('id');
		const newPayload = {};
		newPayload.session = session;
		newPayload.hotel_id = id;
		newPayload.request_type = "hotel_cart";

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

console.log(hoteldetails);

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
                    <div className="row">
                      <div className="card">
                        <div className="card-header">Hotel Details</div>
                        <div className='card-body'>
                          <ul className="list-group list-group-flush">

                          </ul>
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
    </>
    )
}

const MyComponentWithSuspense = () => (
    <Suspense fallback={<div>Loading...</div>}>
      <HotelCart />
    </Suspense>
  );
  
  export default MyComponentWithSuspense;