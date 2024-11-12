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


const HotelList = () => {

    const pathname = usePathname(); // Get the current pathname
    const [collapseshow, setCollapseshow] = useState(false);
    const router = useRouter();
    const params = useSearchParams();
    const [searchshow, setSearchshow] = useState(false);
    const [detailshow, setDetailshow] = useState(false);
    const [filtershow, setFiltershow] = useState(false);

    const [adults, setAdults] = useState(parseInt(params.get('adult') || 1));
	  const [children, setChildren] = useState(parseInt(params.get('children') || 0));
	  const [rooms, setRooms] = useState(parseInt(params.get('room') || 1));

    const [hotelInputValue, setHotelInputValue] = useState(`${adults} Adult ${children} Child ${rooms} Room`);

    const updateHotelInputValue = () => {
        setHotelInputValue(`${adults} Adult ${children} Child ${rooms} Room`);
      };
    
      const handleAdultsChange = (operation) => {
        setAdults(adults + operation > 0 ? adults + operation : 1);
        setHotelInputValue(`${adults} Adult ${children} Child ${rooms} Room`);
      };
    
      const handleRoomsChange = (operation) => {
        setRooms(rooms + operation > 0 ? rooms + operation : 1);
        setHotelInputValue(`${adults} Adult ${children} Child ${rooms} Room`);
      };
    
      const handleChildrenChange = (operation) => {
        setChildren(children + operation >= 0 ? children + operation : 0);
        setHotelInputValue(`${adults} Adult ${children} Child ${rooms} Room`);
      };

      const { register: registerForm4, watch: watchForm4, handleSubmit: handleSubmitForm4, formState: { errors: errorsForm4 }, setValue: setValueForm4, control: controlForm4 } = useForm();

      const handleClose = () => setSearchshow(false);
      const handleShow = () => setSearchshow(true);
      
      const handleFilterClose = () => setFiltershow(false);
      const handleFilterShow = () => setFiltershow(true);

      const handleDetailClose = () => setDetailshow(false);
	    const handleDetailShow = () => setDetailshow(true);

      const checkin_date = watchForm4("checkin_date");
      const checkout_date = watchForm4("checkout_date");
    
      const hoteltoday = checkin_date ? new Date(checkin_date) : new Date();

      const hoteltwoDaysFromToday = new Date(hoteltoday);
      hoteltwoDaysFromToday.setDate(hoteltoday.getDate() + 1);

      return (
        <>
          	<AnimatePresence mode="wait">
              <Layout key={pathname}>
                <main className="main">
                  <div className="container-fluid">
                      <div className="container">
                      
                        <div className="d-flex justify-content-between gap-2 py-4">
                        
                            <BootstrapButton style={{fontSize : 15}} onClick={handleShow} variant="secondary" size="sm" className="d-xl-none mb-0 rounded-4">
                              Modify search
                            </BootstrapButton>
                            
                          
                            <BootstrapButton style={{fontSize : 15}} onClick={handleFilterShow} variant="secondary" size="sm" className="d-xl-none mb-0 rounded-4">
                              Show filters
                            </BootstrapButton>
                          
                        </div>

                        <div className="row d-none d-lg-block">
                        <div className="col-12 col-lg-12 col-xl-12 py-2 mb-3">
                        <div className="card">
                        <form onSubmit={handleSubmitForm4(data => onSubmit(data, 'form4'))} name="hotel_search" id="hotel_search">
                          <div className="row g-3">
                            <div className="col-lg-6 col-md-12">
                              <Controller
                                name="destination"
                                control={controlForm4}
                                rules={{ required: 'Enter your destination' }}
                                render={({ field }) => (
                                <HotelCustomTypeahead
                                  id="hotel-destination"
                                  placeholder="Destination"
                                  name="destination"
                                  icon="bx bxs-location-plus bx-sm"
                                  fetchUrl="all_processes/"
                                  onCodeSelect={(code) => field.onChange(code)}
                                  error={errorsForm4.destination}
                                  initialQuery={params.get('destination') || ""}
                                  
                                  />
                                )}
                              />
                            </div>
                            <div className="col-lg-6 col-md-12">
                              <Controller
                                name='checkin_date'
                                control={controlForm4}
                                rules={{ required: 'Select CheckIn Date' }}
                                render={({ field }) => (
                                <DatePicker
                                  placeholder="CheckIn date"
                                  minDate={new Date()}
                                  value={field.value}
                                  onChange={field.onChange}
                                />
                                )}
                              />
                              {errorsForm4.checkin_date  && <div className='text-danger mt-1'><ErrorOutlineRoundedIcon fontSize="small" /> {errorsForm4.checkin_date.message} </div>}
                            
                            </div>
                            <div className="col-lg-6 col-md-12">
                              <Controller
                                name='checkout_date'
                                control={controlForm4}
                                rules={{ required: 'Select CheckOut Date' }}
                                render={({ field }) => (
                                <DatePicker
                                  placeholder="Checkout date"
                                  minDate={checkin_date ? hoteltwoDaysFromToday : new Date()}
                                  value={checkout_date <= hoteltwoDaysFromToday ? null :  field.value}
                                  onChange={field.onChange}
                                />
                                )}
                              />
                              {errorsForm4.checkout_date  && <div className='text-danger mt-1'><ErrorOutlineRoundedIcon fontSize="small" /> {errorsForm4.checkout_date.message} </div>}
                            </div>

                            <div className="col-lg-6 col-md-12">
                                    
                              <Accordion>
                                <AccordionSummary
                                  expandIcon={<ArrowDownwardIcon />}
                                  aria-controls="panel1-content"
                                  id="panel1-header"
                                >
                                  <Typography>Lodgers ({`${adults} Adult${adults > 1 ? 's' : ''} ${children} Child${children > 1 ? 'ren' : ''} ${rooms} Room${rooms > 1 ? 's' : ''}`})</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                  <div className="d-flex justify-content-between align-items-center">
                                  <div>
                                    <Typography>Adults</Typography>
                                  </div>
                                  <div className="hstack gap-1 align-items-center">
                                  <Button disabled={adults <= 1} variant="link" className="p-0 mb-0" onClick={() => handleAdultsChange(-1)}>
                                    <i className="bi bi-dash-circle fs-5 fa-fw"></i>
                                  </Button>
                                  <Typography>{adults}</Typography>
                                  <Button disabled={adults > 7} variant="link" className="p-0 mb-0" onClick={() => handleAdultsChange(1)}>
                                    <i className="bi bi-plus-circle fs-5 fa-fw"></i>
                                  </Button>
                                  </div>
                                </div>

                                <div className="d-flex justify-content-between align-items-center">
                                  <div>
                                  <Typography>Rooms</Typography>
                                  </div>
                                  <div className="hstack gap-1 align-items-center">
                                  <Button variant="link" className="p-0 mb-0" onClick={() => handleRoomsChange(-1)}>
                                    <i className="bi bi-dash-circle fs-5 fa-fw"></i>
                                  </Button>
                                  <Typography>{rooms}</Typography>
                                  <Button variant="link" className="p-0 mb-0" onClick={() => handleRoomsChange(1)}>
                                    <i className="bi bi-plus-circle fs-5 fa-fw"></i>
                                  </Button>
                                  </div>
                                </div>
                                
                                <div className="d-flex justify-content-between align-items-center">
                                  <div>
                                  <Typography>Children</Typography>
                                  </div>
                                  <div className="hstack gap-1 align-items-center">
                                  <Button variant="link" className="p-0 mb-0" onClick={() => handleChildrenChange(-1)}>
                                    <i className="bi bi-dash-circle fs-5 fa-fw"></i>
                                  </Button>
                                  <Typography>{children}</Typography>
                                  <Button disabled={children > 7} variant="link" className="p-0 mb-0" onClick={() => handleChildrenChange(1)}>
                                    <i className="bi bi-plus-circle fs-5 fa-fw"></i>
                                  </Button>
                                  </div>
                                </div>

                                <div className="row">
                                  {children <= 8 && [...Array(children)].map((_, ch) => (
                                    <div className="col-lg-6 col-md-6" key={ch}>
                                      <label>Child {ch + 1} Age</label>
                                      <select name={`age${ch}`} className="form-select select-sm">
                                      {[...Array(10)].map((_, age) => (
                                        <option key={age} value={age + 1}>{age + 1}</option>
                                      ))}
                                      </select>
                                    </div>
                                  ))}
                                </div>

                                
                                
                                </AccordionDetails>
                                </Accordion>
                            
                            </div>

                              <input id="adult4" type="hidden" {...registerForm4 ("adult")} value={adults} />
                              <input id="child4" type="hidden" {...registerForm4 ("child")} value={children} />
                              <input id="room" type="hidden" {...registerForm4 ("room")} value={rooms} />
                              <input type="hidden" {...registerForm4 ("request_type")} value="hotel_search" />

                              <div className="col-lg-12">
                                <Button type="submit" className="rounded-4" variant="contained" fullWidth size="small">Search Hotel</Button>
                              </div>
                            </div>
                          </form>
                          </div>
                        </div>
                        </div>


                          <Offcanvas show={detailshow} onHide={handleDetailClose}>
                            <Offcanvas.Header closeButton>
                              <Offcanvas.Title><i className='bx bxs-plane-alt'></i> Flight Detail</Offcanvas.Title>
                            </Offcanvas.Header>
                            <Offcanvas.Body className="">
                            
                              {/* Add your offcanvas content here */}
                            </Offcanvas.Body>
                          </Offcanvas>
			
                        <Offcanvas show={filtershow} onHide={handleFilterClose}>
                          <Offcanvas.Header closeButton>
                            <Offcanvas.Title><i className="bx bx-edit"></i> Filters</Offcanvas.Title>
                          </Offcanvas.Header>
                          <Offcanvas.Body className="bg-light">
                            {/* Add your offcanvas content here */}
                           
                          </Offcanvas.Body>
                        </Offcanvas>
			
                        <Offcanvas show={searchshow} onHide={handleClose}>
                          <Offcanvas.Header closeButton>
                            <Offcanvas.Title><i className="bx bx-edit"></i> Modify Search</Offcanvas.Title>
                          </Offcanvas.Header>
                          <Offcanvas.Body className="bg-light">
                            {/* Add your offcanvas content here */}
                            <form onSubmit={handleSubmitForm4(data => onSubmit(data, 'form4'))} name="hotel_search" id="hotel_search">
                          <div className="row g-3">
                            <div className="col-lg-6 col-md-12">
                              <Controller
                                name="destination"
                                control={controlForm4}
                                rules={{ required: 'Enter your destination' }}
                                render={({ field }) => (
                                <HotelCustomTypeahead
                                  id="hotel-destination"
                                  placeholder="Destination"
                                  name="destination"
                                  icon="bx bxs-location-plus bx-sm"
                                  fetchUrl='process.env.NEXT_PUBLIC_HOST}/all_processes/'
                                  onCodeSelect={(code) => field.onChange(code)}
                                  error={errorsForm4.destination}
                                  initialQuery=""
                                  
                                  />
                                )}
                              />
                            </div>
                            <div className="col-lg-6 col-md-12">
                              <Controller
                                name='checkin_date'
                                control={controlForm4}
                                rules={{ required: 'Select CheckIn Date' }}
                                render={({ field }) => (
                                <DatePicker
                                  placeholder="CheckIn date"
                                  minDate={new Date()}
                                  value={field.value}
                                  onChange={field.onChange}
                                />
                                )}
                              />
                              {errorsForm4.checkin_date  && <div className='text-danger mt-1'><ErrorOutlineRoundedIcon fontSize="small" /> {errorsForm4.checkin_date.message} </div>}
                            
                            </div>
                            <div className="col-lg-6 col-md-12">
                              <Controller
                                name='checkout_date'
                                control={controlForm4}
                                rules={{ required: 'Select CheckOut Date' }}
                                render={({ field }) => (
                                <DatePicker
                                  placeholder="Checkout date"
                                  minDate={checkin_date ? hoteltwoDaysFromToday : new Date()}
                                  value={checkout_date <= hoteltwoDaysFromToday ? null :  field.value}
                                  onChange={field.onChange}
                                />
                                )}
                              />
                              {errorsForm4.checkout_date  && <div className='text-danger mt-1'><ErrorOutlineRoundedIcon fontSize="small" /> {errorsForm4.checkout_date.message} </div>}
                            </div>

                            <div className="col-lg-6 col-md-12">
                                    
                              <Accordion>
                                <AccordionSummary
                                  expandIcon={<ArrowDownwardIcon />}
                                  aria-controls="panel1-content"
                                  id="panel1-header"
                                >
                                  <Typography>Lodgers ({`${adults} Adult${adults > 1 ? 's' : ''} ${children} Child${children > 1 ? 'ren' : ''} ${rooms} Room${rooms > 1 ? 's' : ''}`})</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                  <div className="d-flex justify-content-between align-items-center">
                                  <div>
                                    <Typography>Adults</Typography>
                                  </div>
                                  <div className="hstack gap-1 align-items-center">
                                  <Button disabled={adults <= 1} variant="link" className="p-0 mb-0" onClick={() => handleAdultsChange(-1)}>
                                    <i className="bi bi-dash-circle fs-5 fa-fw"></i>
                                  </Button>
                                  <Typography>{adults}</Typography>
                                  <Button disabled={adults > 7} variant="link" className="p-0 mb-0" onClick={() => handleAdultsChange(1)}>
                                    <i className="bi bi-plus-circle fs-5 fa-fw"></i>
                                  </Button>
                                  </div>
                                </div>

                                <div className="d-flex justify-content-between align-items-center">
                                  <div>
                                  <Typography>Rooms</Typography>
                                  </div>
                                  <div className="hstack gap-1 align-items-center">
                                  <Button variant="link" className="p-0 mb-0" onClick={() => handleRoomsChange(-1)}>
                                    <i className="bi bi-dash-circle fs-5 fa-fw"></i>
                                  </Button>
                                  <Typography>{rooms}</Typography>
                                  <Button variant="link" className="p-0 mb-0" onClick={() => handleRoomsChange(1)}>
                                    <i className="bi bi-plus-circle fs-5 fa-fw"></i>
                                  </Button>
                                  </div>
                                </div>
                                
                                <div className="d-flex justify-content-between align-items-center">
                                  <div>
                                  <Typography>Children</Typography>
                                  </div>
                                  <div className="hstack gap-1 align-items-center">
                                  <Button variant="link" className="p-0 mb-0" onClick={() => handleChildrenChange(-1)}>
                                    <i className="bi bi-dash-circle fs-5 fa-fw"></i>
                                  </Button>
                                  <Typography>{children}</Typography>
                                  <Button disabled={children > 7} variant="link" className="p-0 mb-0" onClick={() => handleChildrenChange(1)}>
                                    <i className="bi bi-plus-circle fs-5 fa-fw"></i>
                                  </Button>
                                  </div>
                                </div>

                                <div className="row">
                                  {children <= 8 && [...Array(children)].map((_, ch) => (
                                    <div className="col-lg-6 col-md-6" key={ch}>
                                      <label>Child {ch + 1} Age</label>
                                      <select name={`age${ch}`} className="form-select select-sm">
                                      {[...Array(10)].map((_, age) => (
                                        <option key={age} value={age + 1}>{age + 1}</option>
                                      ))}
                                      </select>
                                    </div>
                                  ))}
                                </div>

                                </AccordionDetails>
                                </Accordion>
                            
                            </div>

                              <input id="adult4" type="hidden" {...registerForm4 ("adult")} value={adults} />
                              <input id="child4" type="hidden" {...registerForm4 ("child")} value={children} />
                              <input id="room" type="hidden" {...registerForm4 ("room")} value={rooms} />
                              <input type="hidden" {...registerForm4 ("request_type")} value="hotel_search" />

                              <div className="col-lg-12">
                                <Button type="submit" className="rounded-4" variant="contained" fullWidth size="small">Search Hotel</Button>
                              </div>
                            </div>
                          </form>
                          </Offcanvas.Body>
                        </Offcanvas>
			 

                      </div>
                  </div>
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
    <HotelList />
  </Suspense>
);

export default MyComponentWithSuspense;