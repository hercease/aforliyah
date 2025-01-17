'use client'
import React, { useEffect, useState, useRef  } from 'react';
import Image from "next/image";
import Head from 'next/head';
import BackToTop from '../components/BackToTop.js'
import DatePicker from "../components/Flatpickr.js"
import createMetadata from "../components/CreateMetaData.js"
import CustomTypeahead from '../components/CustomTypeHead';
import HotelCustomTypeahead from '../components/HotelCustomTypehead';
import Footer from '../components/footer';
import Loader from "../components/loader.js"
import styles from './page.module.css';
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
import Router, { useRouter,usePathname } from 'next/navigation'
import Layout from '../components/layout';
import { AnimatePresence } from 'framer-motion';
import { ClipLoader, BounceLoader } from 'react-spinners';

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Navigation, Pagination, Autoplay, Scrollbar, A11y } from 'swiper/modules';



function TabPanel(props){
  const { children, value, index, ...other } = props;
  
  const filteredOther = { ...other };
  delete filteredOther.role;
  delete filteredOther.hidden;
  delete filteredOther.id;
  delete filteredOther['aria-labelledby'];

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>{children}</Box>
      )}
    </div>
  );
}

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  
  const filteredOther = { ...other };
  delete filteredOther.role;
  delete filteredOther.hidden;
  delete filteredOther.id;
  delete filteredOther['aria-labelledby'];

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProp(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}



export default function Home(){

	const router = useRouter();
	const pathname = usePathname(); // Get the current pathname
	const theme = useTheme();
	const [value, setValue] = React.useState(0);
	const [val, setVal] = React.useState(1);
	const [tabIndex, setTabIndex] = useState(0);
	const [selected, setSelected] = useState('');

	  const handleChange = (event, newValue) => {
		setValue(newValue);
	  };
	  
	  const handleChang = (event, newValue) => {
		setVal(newValue);
	  };

	  const handleChangeIndex = (index) => {
		setValue(index);
	  };
	   const handleChangIndex = (index) => {
		setVal(index);
	  };
	
	const [isLoading, setIsLoading] = useState(false);
	  
	    const [nestedValue, setNestedValue] = useState(0);
	 
	    const [key, setKey] = useState('one-way');
	    const [bootstrapTabKey, setBootstrapTabKey] = useState('home');
	    const handleBootstrapTabChange = (key) => setBootstrapTabKey(key);
		const handleNestedChange = (event, newValue) => setNestedValue(newValue);

		/*const handleSlideChange = (swiper) => {
			setTabIndex(swiper.activeIndex);
		};*/
  
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [inputValue, setInputValue] = useState(`${adults} Adult ${children} Child ${infants} Infant`);
  const [hotelInputValue, setHotelInputValue] = useState(`${adults} Adult ${children} Child ${rooms} Room`);
  const [roomsState, setRoomsState] = useState(
	Array(rooms).fill({ adults: 1, children: 0 })
  );
  
//console.log(roomsState);

	const handleSelect = (eventKey, event) => {
		event.stopPropagation();
	};

	const updateInputValue = () => {
		setInputValue(`${adults} Adult ${children} Child ${infants} Infant`);
	};

	const updateHotelInputValue = () => {
		setHotelInputValue(`${adults} Adult ${children} Child ${rooms} Room`);
	};

	const handleAdultsChange = (operation) => {
		setAdults(adults + operation > 0 ? adults + operation : 1);
		setInputValue(`${adults} Adult ${children} Child ${infants} Infant`);
		setHotelInputValue(`${rooms} Room`);
	};

  /*const handleRoomsChange = (operation) => {
    setRooms(rooms + operation > 0 ? rooms + operation : 1);
	setHotelInputValue(`${adults} Adult ${children} Child ${rooms} Room`);
  };*/

  const handleChildrenChange = (operation) => {
    setChildren(children + operation >= 0 ? children + operation : 0);
	setInputValue(`${adults} Adult ${children} Child ${infants} Infant`);
	setHotelInputValue(`${adults} Adult ${children} Child ${rooms} Room`);
  };

  const handleInfantsChange = (operation) => {
    setInfants(infants + operation >= 0 ? infants + operation : 0);
	setInputValue(`${adults} Adult ${children} Child ${infants} Infant`);
  };
  
	const [fields, setFields] = useState([{ id: 1 }]);
	  const maxFields = 3;

	  const handleAddFields = () => {
		if (fields.length < maxFields) {
		  setFields([...fields, { id: fields.length + 1 }]);
		}
	  };

	  const handleRemoveField = (id) => {
		setFields(fields.filter((field) => field.id !== id));
	  };
	
	const handleCodeSelect = (code) => {
		// Handle the selected code
		console.log('Selected Code:', code);
	};
	
	const [state, setState] = useState({ sub_status: 'Sign in', disable_status: '', err_message: '' });
 
	const { err_message, disable_status, sub_status } = state;

	const { register, formState: { errors }, handleSubmit, reset, getValues, control } = useForm({
    mode: "onChange"});
	
	const { register: registerForm1, handleSubmit: handleSubmitForm1, formState: { errors: errorsForm1 }, setValue: setValueForm1, control: controlForm1 } = useForm();
	const { register: registerForm2, watch: watchForm2, handleSubmit: handleSubmitForm2, formState: { errors: errorsForm2 }, setValue: setValueForm2, control: controlForm2 } = useForm();
	const { register: registerForm3, handleSubmit: handleSubmitForm3, formState: { errors: errorsForm3 }, setValue: setValueForm3, control: controlForm3 } = useForm();
	const { register: registerForm4, watch: watchForm4, handleSubmit: handleSubmitForm4, formState: { errors: errorsForm4 }, setValue: setValueForm4, control: controlForm4, unregister: unregisterForm4 } = useForm();
	
	
	const handleRoomChange = (roomIndex, type, delta) => {
		setRoomsState((prev) =>
		  prev.map((room, index) =>
			index === roomIndex
			  ? { ...room, [type]: Math.max(0, room[type] + delta) }
			  : room
		  )
		);
	  
		// Update form values
		setValueForm4(`room${roomIndex}_${type}`, Math.max(0, roomsState[roomIndex][type] + delta));
	};

	const handleRoomsChange = (delta) => {
		const newRooms = Math.max(1, rooms + delta);
		 // Clear form data for removed rooms
		 if (newRooms < rooms) {
			for (let i = newRooms; i < rooms; i++) {
				unregisterForm4(`room${i}_adults`);
				unregisterForm4(`room${i}_children`);
				unregisterForm4(`room${i}_child${i}_age`);
			}
		  }
		setRooms(newRooms);
	  //console.log(newRooms);
		// Adjust roomsState array
		setRoomsState((prev) =>
		  newRooms > prev.length
			? [...prev, { adults: 1, children: 0 }]
				: prev.slice(0, newRooms)
			);
		
			setValueForm4('room', newRooms);
		
		};
	  

	  // Single submit function
	const onSubmit = (data, formName) => {
		if (formName === 'form1') {
		  // Handle Form 1 submission
			//data.adult = adults
			//console.log(data);
			const query = new URLSearchParams(data).toString();
			router.push(`/flight_list?${query}`);
		} else if (formName === 'form2') {
		  // Handle Form 2 submission
		  console.log('Form 2 data:', data);
		  const query = new URLSearchParams(data).toString();
		  router.push(`/flight_list?${query}`);
		}
		else if (formName === 'form3') {
		  // Handle Form 2 submission
		  console.log('Form 3 data:', data);
		  const query = new URLSearchParams(data).toString();
		  
		  router.push(`/flight_list?${query}`);
		}

		else if (formName === 'form4') {
			// Handle Form 2 submission
			console.log('Form 3 data:', data);
			const query = new URLSearchParams(data).toString();
			
			router.push(`/hotel_list?${query}`);
		  }
	};

	
	//console.log(val);
	//console.log(value);
	const departure_date = watchForm2("departure_date");
	const checkin_date = watchForm4("checkin_date");
	const checkout_date = watchForm4("checkout_date");

	// Convert `departure_date` to a `Date` object if it is a string
	const today = departure_date ? new Date(departure_date) : new Date();
	const hoteltoday = checkin_date ? new Date(checkin_date) : new Date();

	// Create a new `Date` object instead of modifying `today` directly
	const twoDaysFromToday = new Date(today);
	twoDaysFromToday.setDate(today.getDate() + 1);

	const hoteltwoDaysFromToday = new Date(hoteltoday);
	hoteltwoDaysFromToday.setDate(hoteltoday.getDate() + 1);
   useEffect(() => {
    setValueForm1('adult', adults); // Update form value when state changes
    setValueForm1('children', children);
    setValueForm1('infant', infants);
	
	setValueForm2('adult', adults); // Update form value when state changes
    setValueForm2('children', children);
    setValueForm2('infant', infants);
	
	setValueForm3('adult', adults); // Update form value when state changes
    setValueForm3('children', children);
    setValueForm3('infant', infants);
  }, [adults, children, infants, setValueForm1, setValueForm2, setValueForm3]);

	return (
		<>
		
		<AnimatePresence mode="wait">
		<Layout key={pathname}>
		   <main style={{ background: "var(--bs-gray-100)" }} className="main">
		   
				<section className={`section-box responsive-section ${styles.sectionBackground}`}>
					<div className="container-fluid">
						<div className="row">
							<div className="col-md-8 mx-auto text-center pt-7 pb-9">
								<h4 className="mb-2 text-light">
									Find The <strong style={{ color: "#ff7000" }}>Best Flight</strong> For Your Travels
								</h4>
							</div>
						</div>
					</div>
				</section>
			
				<div className="container mt-n8">
					<div className="row">
						<div className="col-12 col-lg-8 col-xl-8 mx-auto">
							<div className="card">
								<div className="card-body">
									<AppBar className="rounded-4" position="static">
									<MaterialTabs
									  value={value}
									  onChange={handleChange}
									  indicatorColor="secondary"
									  textColor="inherit"
									  variant="scrollable"
									  scrollcolor="primary"
									  scrollButtons
									  allowScrollButtonsMobile
									  aria-label="full width tabs example"
									>
									    <MaterialTab
										  label={
											<div style={{ display: 'flex', alignItems: 'center' }}>
											  <i className="bx bxs-plane-alt" style={{ fontSize: '1.5rem' }}></i>
											  <span>Flights</span>
											</div>
										  }
										  {...a11yProps(0)}
										/>
										<MaterialTab label={
											<div style={{ display: 'flex', alignItems: 'center' }}>
											  <i className="bx bxs-building-house" style={{ fontSize: '1.5rem' }}></i>
											  <span>Hotels</span>
											</div>
										  } {...a11yProps(1)} />
									  <MaterialTab label={<div style={{ display: 'flex', alignItems: 'center' }}>
											  <i className="bx bxs-car" style={{ fontSize: '1.5rem' }}></i>
											  <span>Vehicles</span>
											</div>} {...a11yProps(2)} />
									</MaterialTabs>
								  </AppBar>
								    <SwipeableViews
										axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
										index={value}
										//onChangeIndex={handleChangeIndex}
									  >
									<TabPanel value={value} index={0} dir={theme.direction}>
										<div className="d-lg-flex align-items-center">
											<Tabs  allowScrollButtonsMobile variant="scrollable" value={val} indicatorColor="secondary" onChange={handleChang} aria-label="basic tabs example">
											  <Tab label="One way" {...a11yProp(0)} />
											  <Tab label="Round Trip" {...a11yProp(1)} />
											  <Tab label="Multi destination" {...a11yProp(2)} />
											</Tabs>
											<div className="ms-auto d-none d-lg-block">
												<b className="text-muted mb-0">Need some help? <a href="#"><u>See how it works</u></a></b>
											</div>
										</div>
										
												<CustomTabPanel value={val} index={0} dir={theme.direction}>
												
													<form onSubmit={handleSubmitForm1(data => onSubmit(data, 'form1'))}>
														<div className="row g-3">
														
															<div className="col-lg-6 col-md-12">
															<Controller
																name="departure"
																control={controlForm1}
																rules={{ required: 'Please select a departure location.' }}
																render={({ field }) => (
																<CustomTypeahead
																	id="one-flight-from"
																	placeholder="Flying from"
																	name="departure"
																	icon="bx bxs-plane-take-off bx-sm"
																	fetchUrl="https://autocomplete.travelpayouts.com/jravia?locale=en&with_airport=false"
																	onCodeSelect={(code) => field.onChange(code)}
																	error={errorsForm1.departure}
																	initialQuery=""
																  
																	/> 
																)}
																  />
															</div>
															
															<div className="col-lg-6 col-md-12">
																<Controller
																	name="arrival"
																	control={controlForm1}
																	rules={{ required: 'Please select an arrival location.' }}
																	render={({ field }) => (
																	<CustomTypeahead
																		id="one-flight-to"
																		placeholder="Flying to"
																		name="arrival"
																		icon="bx bxs-plane-land bx-sm"
																		fetchUrl="https://autocomplete.travelpayouts.com/jravia?locale=en&with_airport=false"
																		   onCodeSelect={(code) => field.onChange(code)}
																		error={errorsForm1.arrival}
																		initialQuery=""
																	  />
																	)}
																/> 
															</div>
															<div className="col-lg-6 col-md-3">
																 <Controller
																	name="departure_date"
																	control={controlForm1}
																	rules={{ required: 'Select departure date' }}
																	render={({ field }) => (
																	  <DatePicker
																		placeholder="Departure date"
																		minDate={new Date()}
																		value={field.value}
																		onChange={field.onChange}
																	  />
																	)}
																  />
																{errorsForm1.departure_date  && <div className='text-danger mt-1'><ErrorOutlineRoundedIcon fontSize="small" /> {errorsForm1.departure_date.message} </div>}
																
															</div>
															<div className="col-lg-6 col-md-3">
																<Form.Group>
																  <InputGroup className="bg-white" style={{ border: 'none' }}>
																	<InputGroup.Text style={{  borderRight: 'none', background: 'white' }}>
																	  <i className="bx bx-cabinet bx-sm"></i>
																	</InputGroup.Text>
																	<Form.Select name="cabin" className="" style={{ height: "45px", borderLeft: 'none' }} {...registerForm1("cabin", { required: "Select cabin"  })} aria-label="Default select example">
																	  {/*<option value="">Select Cabin Class</option>*/}
																	  <option value="economy">Economy</option>
																	  <option value="business">Business</option>
																	  <option value="first class">First Class</option>
																	</Form.Select>
																  </InputGroup>
																</Form.Group>
																{errorsForm1.cabin  && <div className='text-danger mt-1'><ErrorOutlineRoundedIcon fontSize="small" /> {errorsForm1.cabin.message} </div>}
															</div>
															
															<div className="col-lg-12 col-md-3 mb-2">
																<Accordion>
																	<AccordionSummary
																	  expandIcon={<ArrowDownwardIcon />}
																	  aria-controls="panel1-content"
																	  id="panel1-header"
																	>
																	  <Typography>Passengers ({`${adults} Adult${adults > 1 ? 's' : ''} ${children} Child${children > 1 ? 'ren' : ''} ${infants} Infant${infants > 1 ? 's' : ''}`})</Typography>
																	</AccordionSummary>
																	<AccordionDetails>
																	   <div className="d-flex justify-content-between align-items-center">
																	  <div>
																			<Typography>Adults</Typography>
																	  </div>
																	  <div className="hstack gap-1 align-items-center">
																		<Button variant="link" className="p-0 mb-0" onClick={() => handleAdultsChange(-1)}>
																		  <i className="bi bi-dash-circle fs-5 fa-fw"></i>
																		</Button>
																		<Typography>{adults}</Typography>
																		<Button variant="link" className="p-0 mb-0" onClick={() => handleAdultsChange(1)}>
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
																		<Button variant="link" className="p-0 mb-0" onClick={() => handleChildrenChange(1)}>
																		  <i className="bi bi-plus-circle fs-5 fa-fw"></i>
																		</Button>
																	  </div>
																	</div>
																	
																	<div className="d-flex justify-content-between align-items-center">
																	  <div>
																		<Typography>Infants</Typography>
																	  </div>
																	  <div className="hstack gap-1 align-items-center">
																		<Button variant="link" className="p-0 mb-0" onClick={() => handleInfantsChange(-1)}>
																		  <i className="bi bi-dash-circle fs-5 fa-fw"></i>
																		</Button>
																	   <Typography>{infants}</Typography>
																		<Button variant="link" className="p-0 mb-0" onClick={() => handleInfantsChange(1)}>
																		  <i className="bi bi-plus-circle fs-5 fa-fw"></i>
																		</Button>
																	  </div>
																	</div>
																	</AccordionDetails>
																  </Accordion>
	  
															</div>
															
														<input id="adult1" type="hidden" {...registerForm1 ("adult")} defaultValue={adults} />
														<input id="child1" type="hidden" {...registerForm1 ("children")} value={children} />
														<input id="infant1" type="hidden" {...registerForm1 ("infant")} value={infants} />
														<input type="hidden" {...registerForm1 ("request_type")} value="one-way" />
														
														<div className="col-lg-12">
															<Button type="submit" className="rounded-4" variant="contained" fullWidth size="small">Find Your Flight</Button>
														</div>
													</div>
														
												</form>
												</CustomTabPanel>
													
												<CustomTabPanel value={val} index={1} dir={theme.direction}>
													<form onSubmit={handleSubmitForm2(data => onSubmit(data, 'form2'))} name="round_trip" id="round_trip">
														<div className="row g-3">
														
															<div className="col-lg-6 col-md-12">
															<Controller
																name="departure"
																control={controlForm2}
																rules={{ required: 'Please select a departure location.' }}
																render={({ field }) => (
																<CustomTypeahead
																	id="round-flight-from"
																	placeholder="Flying from"
																	name="departure"
																	icon="bx bxs-plane-take-off bx-sm"
																	fetchUrl="https://autocomplete.travelpayouts.com/jravia?locale=en&with_airport=false"
																	onCodeSelect={(code) => field.onChange(code)}
																	error={errorsForm2.departure}
																	initialQuery=""
																  
																	/> 
																)}
															/>

															</div>
															
															<div className="col-lg-6 col-md-12">
																<Controller
																	name="arrival"
																	control={controlForm2}
																	rules={{ required: 'Please select an arrival location.' }}
																	render={({ field }) => (
																	<CustomTypeahead
																		id="round-flight-to"
																		placeholder="Flying to"
																		name="arrival"
																		icon="bx bxs-plane-land bx-sm"
																		fetchUrl="https://autocomplete.travelpayouts.com/jravia?locale=en&with_airport=false"
																		   onCodeSelect={(code) => field.onChange(code)}
																		error={errorsForm2.arrival}
																		initialQuery=""
																		
																	  />
																   )}
																 /> 
															</div>
															<div className="col-lg-6 col-md-3">
																 <Controller
																	name="departure_date"
																	control={controlForm2}
																	rules={{ required: 'Select your departure date' }}
																	render={({ field }) => (
																	  <DatePicker
																		placeholder="Select departure date"
																		minDate={new Date()}
																		value={field.value}
																		onChange={field.onChange}
																	  />
																	)}
																  />
																{errorsForm2.departure_date  && <div className='text-danger mt-1'><ErrorOutlineRoundedIcon fontSize="small" /> {errorsForm2.departure_date.message} </div>}
																
															</div>
															<div className="col-lg-6 col-md-3">
																<Controller
																	name="arrival_date"
																	control={controlForm2}
																	rules={{ required: 'Select your arrival date' }}
																	render={({ field }) => (
																	  <DatePicker
																		placeholder="Select arrival date"
																		minDate={twoDaysFromToday}
																		value={field.value}
																		onChange={field.onChange}
																	  />
																	)}
																  />
																{errorsForm2.arrival_date  && <div className='text-danger mt-1'><ErrorOutlineRoundedIcon fontSize="small" /> {errorsForm2.arrival_date.message} </div>}
															</div>
															<div className="col-lg-6 col-md-3">
																<Form.Group>
																  <InputGroup className="bg-white" style={{ border: 'none' }}>
																	<InputGroup.Text style={{ borderRight: 'none', background: 'white' }}>
																	  <i className="bx bx-cabinet bx-sm"></i>
																	</InputGroup.Text>
																	<Form.Select name="cabin" className="" style={{ height: "45px", borderLeft: 'none' }} {...registerForm2("cabin", { required: "Select cabin"  })} aria-label="Default select example">
																		{/*<option value="">Select Cabin Class</option>*/}
																	  <option value="economy">Economy</option>
																	  <option value="business">Business</option>
																	  <option value="first class">First Class</option>
																	</Form.Select>
																  </InputGroup>
																</Form.Group>
																{errorsForm2.cabin  && <div className='text-danger mt-1'><ErrorOutlineRoundedIcon fontSize="small" /> {errorsForm2.cabin.message} </div>}
															</div>
															
															<div className="col-lg-6 col-md-3 mb-2">
																<Accordion>
																	<AccordionSummary
																	  expandIcon={<ArrowDownwardIcon />}
																	  aria-controls="panel1-content"
																	  id="panel1-header"
																	>
																	  <Typography>Passengers ({`${adults} Adult${adults > 1 ? 's' : ''} ${children} Child${children > 1 ? 'ren' : ''} ${infants} Infant${infants > 1 ? 's' : ''}`})</Typography>
																	</AccordionSummary>
																	<AccordionDetails>
																	   <div className="d-flex justify-content-between align-items-center">
																	  <div>
																			<Typography>Adults</Typography>
																	  </div>
																	  <div className="hstack gap-1 align-items-center">
																		<Button variant="link" className="p-0 mb-0" onClick={() => handleAdultsChange(-1)}>
																		  <i className="bi bi-dash-circle fs-5 fa-fw"></i>
																		</Button>
																		<Typography>{adults}</Typography>
																		<Button variant="link" className="p-0 mb-0" onClick={() => handleAdultsChange(1)}>
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
																		<Button variant="link" className="p-0 mb-0" onClick={() => handleChildrenChange(1)}>
																		  <i className="bi bi-plus-circle fs-5 fa-fw"></i>
																		</Button>
																	  </div>
																	</div>
																	
																	<div className="d-flex justify-content-between align-items-center">
																	  <div>
																		<Typography>Infants</Typography>
																	  </div>
																	  <div className="hstack gap-1 align-items-center">
																		<Button variant="link" className="p-0 mb-0" onClick={() => handleInfantsChange(-1)}>
																		  <i className="bi bi-dash-circle fs-5 fa-fw"></i>
																		</Button>
																	   <Typography>{infants}</Typography>
																		<Button variant="link" className="p-0 mb-0" onClick={() => handleInfantsChange(1)}>
																		  <i className="bi bi-plus-circle fs-5 fa-fw"></i>
																		</Button>
																	  </div>
																	</div>
																	</AccordionDetails>
																  </Accordion>
	  
															</div>
															
														<input id="adult2" type="hidden" {...registerForm2 ("adult")} value={adults} />
														<input id="child2" type="hidden" {...registerForm2 ("child")} value={children} />
														<input id="infant2" type="hidden" {...registerForm2 ("infant")} value={infants} />
														<input type="hidden" {...registerForm2 ("request_type")} value="round-trip" />
														
														<div className="col-lg-12">
															<Button type="submit" className="rounded-4" variant="contained" fullWidth size="small">Find Your Flight</Button>
														</div>
												</div>
														
											</form>
												</CustomTabPanel>
												<CustomTabPanel value={val} index={2} dir={theme.direction}>
													<form onSubmit={handleSubmitForm3(data => onSubmit(data, 'form3'))} name="multi_city" id="multi_city">
													
														<div className="g-4 flight-fields mb-2">
															{fields.map((formfield, index) => (
																<div key={formfield.id} className="card p-2 mb-3">
																	<div className="card-header mb-2 flight-label d-flex">{`Flight ${formfield.id}`} {formfield.id > 1 && <span onClick={() => handleRemoveField(formfield.id)} className="ms-auto"><i className="bx bxs-trash text-danger delete-button"></i></span>}</div>
																		<div className="row">
																			<div className="col-lg-6 col-md-3 mb-2">
																			<Controller
																				name={`departure${formfield.id}`}
																				control={controlForm3}
																				rules={{ required: 'Please select a departure location.' }}
																				render={({ field }) => (
																				<CustomTypeahead
																					id="multi-flight-from"
																					placeholder="Flying from"
																					name={`departure${formfield.id}`}
																					icon="bx bxs-plane-take-off bx-sm"
																					fetchUrl="https://autocomplete.travelpayouts.com/jravia?locale=en&with_airport=false"
																					onCodeSelect={(code) => field.onChange(code)}
																					error={errorsForm3[`departure${formfield.id}`]}
																					initialQuery=""
																					
																				/> 
																				)}
																			/>

																</div>
																		
																<div className="col-lg-6 col-md-3 mb-2">
																	<Controller
																	name={`arrival${formfield.id}`}
																	control={controlForm3}
																	rules={{ required: 'Please select an arrival location.' }}
																	render={({ field }) => (
																	<CustomTypeahead
																		id="multi-flight-to"
																		placeholder="Flying to"
																		name={`arrival${formfield.id}`}
																		icon="bx bxs-plane-land bx-sm"
																		fetchUrl="https://autocomplete.travelpayouts.com/jravia?locale=en&with_airport=false"
																		onCodeSelect={(code) => field.onChange(code)}
																		error={errorsForm3[`arrival${formfield.id}`]}
																		initialQuery=""
																		
																	  />
																   )}
																 /> 
																			
															</div>

															<div className="col-lg-6 col-md-3 mb-2">
																<Controller
																	name={`departure_date${formfield.id}`}
																	control={controlForm3}
																	rules={{ required: 'Select departure date' }}
																	render={({ field }) => (
																	<DatePicker
																		placeholder="Select departure date"
																		minDate={twoDaysFromToday}
																		value={field.value}
																		onChange={field.onChange}
															/>
																	)}
																/>
																		{errorsForm3[`departure_date${formfield.id}`] && (
																		  <div className='text-danger mt-1'>
																			<ErrorOutlineRoundedIcon fontSize="small" />
																			{errorsForm3[`departure_date${formfield.id}`]?.message}
																		  </div>
																		)}
																		</div>
																	
																	</div>
																
																</div>
																))}
															</div>
														
														<div className="row">
															
															<div className="col-lg-6 col-md-12 mb-2">
																<Form.Group>
																  <InputGroup className="bg-white" style={{ border: 'none' }}>
																	<InputGroup.Text style={{ borderRight: 'none', background: 'white' }}>
																	  <i className="bx bx-cabinet bx-sm"></i>
																	</InputGroup.Text>
																	<Form.Select name="cabin" className="" style={{ height: "45px", borderLeft: 'none' }} {...registerForm3("cabin", { required: "Select cabin"  })} aria-label="Default select example">
																		{/*<option value="">Select Cabin Class</option>*/}
																	  <option value="economy">Economy</option>
																	  <option value="business">Business</option>
																	  <option value="first class">First Class</option>
																	</Form.Select>
																  </InputGroup>
																</Form.Group>
																{errorsForm3.cabin  && <div className='text-danger mt-1'><ErrorOutlineRoundedIcon fontSize="small" /> {errorsForm3.cabin.message} </div>}
															</div>
															
															<div className="col-lg-6 col-md-12">
															
																<Accordion>
																	<AccordionSummary
																	  expandIcon={<ArrowDownwardIcon />}
																	  aria-controls="panel1-content"
																	  id="panel1-header"
																	>
																	  <Typography>Passengers ({`${adults} Adult${adults > 1 ? 's' : ''} ${children} Child${children > 1 ? 'ren' : ''} ${infants} Infant${infants > 1 ? 's' : ''}`})</Typography>
																	</AccordionSummary>
																	<AccordionDetails>
																	   <div className="d-flex justify-content-between align-items-center">
																	  <div>
																			<Typography>Adults</Typography>
																	  </div>
																	  <div className="hstack gap-1 align-items-center">
																		<Button variant="link" className="p-0 mb-0" onClick={() => handleAdultsChange(-1)}>
																		  <i className="bi bi-dash-circle fs-5 fa-fw"></i>
																		</Button>
																		<Typography>{adults}</Typography>
																		<Button variant="link" className="p-0 mb-0" onClick={() => handleAdultsChange(1)}>
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
																		<Button variant="link" className="p-0 mb-0" onClick={() => handleChildrenChange(1)}>
																		  <i className="bi bi-plus-circle fs-5 fa-fw"></i>
																		</Button>
																	  </div>
																	</div>
																	
																	<div className="d-flex justify-content-between align-items-center">
																	  <div>
																		<Typography>Infants</Typography>
																	  </div>
																	  <div className="hstack gap-1 align-items-center">
																		<Button variant="link" className="p-0 mb-0" onClick={() => handleInfantsChange(-1)}>
																		  <i className="bi bi-dash-circle fs-5 fa-fw"></i>
																		</Button>
																	   <Typography>{infants}</Typography>
																		<Button variant="link" className="p-0 mb-0" onClick={() => handleInfantsChange(1)}>
																		  <i className="bi bi-plus-circle fs-5 fa-fw"></i>
																		</Button>
																	  </div>
																	</div>
																	</AccordionDetails>
																  </Accordion>
															
															</div>
														</div>
														<input id="adult3" type="hidden" {...registerForm3 ("adult")} value={adults} />
														<input id="child3" type="hidden" {...registerForm3 ("child")} value={children} />
														<input id="infant3" type="hidden" {...registerForm3 ("infant")} value={infants} />
														<input type="hidden" {...registerForm3 ("request_type")} value="multi-city" />
													
														<div className="row py-4"> 
															<div className="col-md-6 mb-3">
																<a onClick={handleAddFields} className="btn btn-outline-primary btn-sm bg-white text-primary border-6 add_field_button rounded-5 py-2 px-3 w-100"><span className="small">Add another flight</span> </a>
															</div>
															
															<div className="col-md-6">
																<Button type="submit" className="rounded-4" variant="contained" fullWidth size="small">Find Your Flight</Button>
															</div>
														</div>
													</form>
												</CustomTabPanel>
									</TabPanel>
									<TabPanel value={value} index={1} dir={theme.direction}>
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
														fetchUrl="/"
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
														<Typography>Lodgers ({`${rooms} Room${rooms > 1 ? 's' : ''}`})</Typography>
													</AccordionSummary>
													<AccordionDetails>

													<div className="d-flex justify-content-between align-items-center">
														<div>
															<Typography>Rooms</Typography>
														</div>
														<div className="hstack gap-1 align-items-center">
															<Button variant="link" className="p-0 mb-0" onClick={() => handleRoomsChange(-1)}>
																<i className="bi bi-dash-circle fs-5 fa-fw"></i>
															</Button>
															<Typography>{rooms}</Typography>
															<Button disabled={rooms > 3} variant="link" className="p-0 mb-0" onClick={() => handleRoomsChange(1)}>
																<i className="bi bi-plus-circle fs-5 fa-fw"></i>
															</Button>
														</div>
													</div>
												
													{[...Array(rooms)].map((_, roomIndex) => (
														<div key={roomIndex} className="card p-2 mb-2">
															<div className="card-header">{`Room ${roomIndex + 1}`}</div>

															{/* Adults */}
															<div className="d-flex justify-content-between align-items-center">
															<Typography>Adults</Typography>
															<div className="hstack gap-1 align-items-center">
																<Button
																disabled={roomsState[roomIndex].adults <= 1}
																variant="link"
																className="p-0 mb-0"
																onClick={() => handleRoomChange(roomIndex, "adults", -1)}
																>
																<i className="bi bi-dash-circle fs-5 fa-fw"></i>
																</Button>
																<Typography>{roomsState[roomIndex].adults}</Typography>
																<Button
																disabled={roomsState[roomIndex].adults >= 8}
																variant="link"
																className="p-0 mb-0"
																onClick={() => handleRoomChange(roomIndex, "adults", 1)}
																>
																<i className="bi bi-plus-circle fs-5 fa-fw"></i>
																</Button>
															</div>
															</div>

															{/* Children */}
															<div className="d-flex justify-content-between align-items-center">
															<Typography>Children</Typography>
															<div className="hstack gap-1 align-items-center">
																<Button
																disabled={roomsState[roomIndex].children <= 0}
																variant="link"
																className="p-0 mb-0"
																onClick={() => handleRoomChange(roomIndex, "children", -1)}
																>
																<i className="bi bi-dash-circle fs-5 fa-fw"></i>
																</Button>
																<Typography>{roomsState[roomIndex].children}</Typography>
																<Button
																disabled={roomsState[roomIndex].children >= 8}
																variant="link"
																className="p-0 mb-0"
																onClick={() => handleRoomChange(roomIndex, "children", 1)}
																>
																<i className="bi bi-plus-circle fs-5 fa-fw"></i>
																</Button>
															</div>
															</div>

															{/* Child Ages */}
															<div className="row">
															{[...Array(roomsState[roomIndex].children)].map((_, childIndex) => (
																<div key={childIndex} className="col-lg-6 col-md-6">
																<label>{`Child ${childIndex + 1} Age`}</label>
																<select name={`room${roomIndex}_child${childIndex}_age`} {...registerForm4(`room${roomIndex}_child${childIndex}_age`)}  className="form-select select-sm">
																	{[...Array(10)].map((_, age) => (
																	<option key={age} value={age + 1}>
																		{age + 1}
																	</option>
																	))}
																</select>
																</div>
															))}
															</div>

															{/* Hidden Inputs */}
															<input
															type="hidden"
															{...registerForm4(`room${roomIndex}_adults` )}
															value={roomsState[roomIndex].adults}
															/>
															<input
															type="hidden"
															{...registerForm4(`room${roomIndex}_children`)}
															value={roomsState[roomIndex].children}
															/>
														</div>
														))}


													</AccordionDetails>
												</Accordion>
											
											</div>

												<input id="room" type="hidden" {...registerForm4("room")} value={rooms} />
												<input type="hidden" {...registerForm4 ("request_type")} value="hotel_search" />

												<div className="col-lg-12">
													<Button type="submit" className="rounded-4" variant="contained" fullWidth size="small">Search Hotel</Button>
												</div>
											</div>
										</form>
									</TabPanel>
									<TabPanel value={value} index={2} dir={theme.direction}>
										<div className="d-flex align-items-center justify-content-center vh-50">
											<Image src="/assets/imgs/coming_soon.jpg"
												width={200}           // Width of the image
												height={200}          // Height of the image
												layout="intrinsic"   // Maintains the image's aspect ratio
												alt="Afotravels"    // Bootstrap class for right margin
												quality={100}        // Image quality (0-100)
												priority
												className="text-center"
											/>
										</div>									
									</TabPanel>
									</SwipeableViews>
								</div>
							</div>
						</div>
					</div>
				</div>
				

				<section className="section-box box-your-journey"> 
					<div className="container">
					  <div className="box-swiper">
					  <Swiper
						onSwiper={(swiper) => console.log(swiper)}
						spaceBetween={10}
						autoplay= {{ delay:2000 }}
						modules={[Pagination, Navigation, Autoplay]}
						breakpoints={{
						  // when window width is >= 640px
						  640: {
							slidesPerView: 2,
							spaceBetween: 20,
						  },
						  // when window width is >= 768px
						  768: {
							slidesPerView: 3,
							spaceBetween: 30,
						  },
						  // when window width is >= 1024px
						  1024: {
							slidesPerView: 4,
							spaceBetween: 40,
						  },
						  // when window width is < 640px (default for mobile)
						  0: {
							slidesPerView: 3,
							spaceBetween: 10,
						  }
						}}
						slidesPerView={4}
						className="swiper-container swiper-group-payment-10 wow fadeInUp"
					  >
						  <div className="swiper-wrapper">
							<SwiperSlide>
								<div> 
									<Image width={100} height={100} className="light-mode" src="assets/imgs/page/homepage10/casa.svg" alt="Travila" />
									<Image width={100} height={100} className="dark-mode" src="assets/imgs/page/homepage10/casa-dark.svg" alt="Travila" />
								</div>
							</SwiperSlide>
							<SwiperSlide>
							  <div> 
								  <Image width={100} height={100} className="light-mode" src="assets/imgs/page/homepage10/egyptAir.svg" alt="Travila" />
								  <Image width={100} height={100} className="dark-mode" src="assets/imgs/page/homepage10/egyptAir-dark.svg" alt="Travila" />
							  </div>
							</SwiperSlide>
							<SwiperSlide>
								<div> 
									<Image width={100} height={100} className="light-mode" src="assets/imgs/page/homepage10/cubana.svg" alt="Travila" />
									<Image width={100} height={100} className="dark-mode" src="assets/imgs/page/homepage10/cubana-dark.svg" alt="Travila" />
								</div>
							</SwiperSlide>
							<SwiperSlide>
							  <div className="item-logo-payment"> 
								<Image width={100} height={100} className="light-mode" src="assets/imgs/page/homepage10/delta.svg" alt="Travila" />
								<Image width={100} height={100} className="dark-mode" src="assets/imgs/page/homepage10/delta-dark.svg" alt="Travila" /></div>
							</SwiperSlide>
							<SwiperSlide>
							  <div className="item-logo-payment"> 
								<Image width={100} height={100} className="light-mode" src="assets/imgs/page/homepage10/ata.svg" alt="Travila" />
								<Image width={100} height={100} className="dark-mode" src="assets/imgs/page/homepage10/ata-dark.svg" alt="Travila" /></div>
							</SwiperSlide>
							<SwiperSlide>
							  <div className="item-logo-payment"> 
								<Image width={100} height={100} className="light-mode" src="assets/imgs/page/homepage10/westJet.svg" alt="Travila" />
								<Image width={100} height={100} className="dark-mode" src="assets/imgs/page/homepage10/westJet-dark.svg" alt="Travila" /></div>
							</SwiperSlide>
							<SwiperSlide>
							  <div className="item-logo-payment"> 
								<Image width={100} height={100} className="light-mode" src="assets/imgs/page/homepage10/abx.svg" alt="Travila" />
								<Image width={100} height={100} className="dark-mode" src="assets/imgs/page/homepage10/abx-dark.svg" alt="Travila" /></div>
							</SwiperSlide>
							<SwiperSlide>
							  <div className="item-logo-payment"> 
								<Image width={100} height={100} className="light-mode" src="assets/imgs/page/homepage10/viking.svg" alt="Travila" />
								<Image width={100} height={100} className="dark-mode" src="assets/imgs/page/homepage10/viking-dark.svg" alt="Travila" /></div>
							</SwiperSlide>
							<SwiperSlide>
							  <div className="item-logo-payment"> 
								<Image width={100} height={100} className="light-mode" src="assets/imgs/page/homepage10/aces.svg" alt="Travila" />
								<Image width={100} height={100} className="dark-mode" src="assets/imgs/page/homepage10/aces-dark.svg" alt="Travila" /></div>
							</SwiperSlide>
							<SwiperSlide>
							  <div className="item-logo-payment"> 
								<Image width={100} height={100} className="light-mode" src="assets/imgs/page/homepage10/adc.svg" alt="Travila" />
								<Image width={100} height={100} className="dark-mode" src="assets/imgs/page/homepage10/adc-dark.svg" alt="Travila" /></div>
							</SwiperSlide>
						  </div>
						</Swiper>
					  </div>
					</div>
				</section>				
				
			<section className="section-box box-popular-destinations mt-0 pt-0">
				<div className="container">
					<div className="box-swiper mt-30">
						<div className="swiper-container swiper-group-3 swiper-group-journey">
						<Swiper
							modules={[Navigation]}
							navigation={{
								nextEl: '.swiper-button-next',
								prevEl: '.swiper-button-prev',
							}}
							spaceBetween={50}
							breakpoints={{
							  // when window width is >= 640px
							  640: {
								slidesPerView: 1,
								spaceBetween: 20,
							  },
							  // when window width is >= 768px
							  768: {
								slidesPerView: 2,
								spaceBetween: 30,
							  },
							  // when window width is >= 1024px
							  1024: {
								slidesPerView: 3,
								spaceBetween: 40,
							  },
							  // when window width is < 640px (default for mobile)
							  0: {
								slidesPerView: 1,
								spaceBetween: 10,
							  }
							}}
						>
						<SwiperSlide>
							<div className="card-banner-slide card-banner-slide-2 wow fadeInUp">
								<label className="sale-lbl">-5%</label>
								<div className="card-image" style={{ backgroundImage: "url(assets/imgs/card_image_1.jpeg)" }}></div>
									<div className="card-info" style={{ background: "#ffffffc4", width: "201px", height: "100%", margin: "0px 0px -30px 0px", top:"0px", left:"0px", bottom : "0px", padding: "70px 7px 12px 19px" }}> 
									  <p>Corporate Offer</p>
									  <p className="text-md-bold"><span className="text-danger">Become</span> an Agent or Affliate to Earn with Our Affliate Deals </p>
									</div>
							</div>
						</SwiperSlide>
						<SwiperSlide>
							<div className="card-banner-slide card-banner-slide-2 wow fadeInUp">
								<label className="sale-lbl">-5%</label>
								<div className="card-image" style={{ backgroundImage: "url(assets/imgs/card_image_2.jpeg)" }}></div>
								<div className="card-info" style={{ background: "#ffffffc4", width: "201px", height: "100%", margin: "0px 0px -30px 0px", top:"0px", left:"0px", bottom : "0px", padding: "70px 7px 12px 19px" }}> 
								  <p>Bundle Offer</p>
								  <p className="text-md-bold"><span className="text-danger">5%</span> discount when you add a hotel to your flight </p>
								</div>
							</div>
						</SwiperSlide>
						<SwiperSlide>
							<div className="card-banner-slide card-banner-slide-2 wow fadeInUp">
								<label className="sale-lbl">-5%</label>
								<div className="card-image" style={{ backgroundImage: "url(assets/imgs/card_image_3.jpeg)" }}></div>
								<div className="card-info" style={{ background: "#ffffffc4", width: "201px", height: "100%", margin: "0px 0px -30px 0px", top:"0px", left:"0px", bottom : "0px", padding: "70px 7px 12px 19px" }}> 
								  <p>First time Offer</p>
								  <p className="text-md-bold"><span className="text-danger">Get</span>Amazing discounts when you use our Website for the first time </p>
								</div>
							</div>
						</SwiperSlide>
				</Swiper>
				 
				 
						{/* Custom Navigation Buttons */}
						<div className="box-button-slider box-button-slider-team py-4">
							  <div className="swiper-button-prev swiper-button-prev-style-1 swiper-button-prev-3">
								<svg style={{ width:"50%", height:"50%" }} xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 16 16" fill="none">
								  <path d="M7.99992 3.33325L3.33325 7.99992M3.33325 7.99992L7.99992 12.6666M3.33325 7.99992H12.6666" stroke="" strokeLinecap="round" strokeLinejoin="round"></path>
								</svg>
							  </div>
							  <div className="swiper-button-next swiper-button-next-style-1 swiper-button-next-3">
								<svg style={{ width:"50%", height:"50%" }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
								  <path d="M7.99992 12.6666L12.6666 7.99992L7.99992 3.33325M12.6666 7.99992L3.33325 7.99992" stroke="" strokeLinecap="round" strokeLinejoin="round"></path>
								</svg>
							  </div>
						</div>
					
					</div>
					</div>
				</div>
			</section>
			
			<section className="box-section block-content-tourlist background-body">
				<div className="container"> 
					<div className="col-lg-6 mb-30 text-center text-lg-start"> 
						<h2 className="neutral-1000">Our Featured Flight</h2>
						<p className="text-xl-medium neutral-500">Favorite destinations </p>
					</div>
					<div className="pt-20 pb-30">
						<div className="box-list-featured">
							<div className="content-right">
								<div className="row">
									<div className="col-lg-4 col-md-6">
										<div className="card-journey-small background-card"> 
											<div className="card-image"> 
												<a className="label" href="#">Top Rated</a><a className="wish" href="#">
													<svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M17.071 10.1422L11.4141 15.7991C10.6331 16.5801 9.36672 16.5801 8.58568 15.7991L2.92882 10.1422C0.9762 8.1896 0.9762 5.02378 2.92882 3.07116C4.88144 1.11853 8.04727 1.11853 9.99989 3.07116C11.9525 1.11853 15.1183 1.11853 17.071 3.07116C19.0236 5.02378 19.0236 8.1896 17.071 10.1422Z" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
													</svg>
												</a>
												<div style={{ position: 'relative', width: '100%', height: '350px' }}>
													<Image layout="fill" objectFit="cover" src="/assets/imgs/page/homepage1/journey3.png" alt="Travila" />
												</div>
											</div>
											<div className="card-info background-card"> 
												<div className="card-rating"> 
													<div className="card-left"></div>
													<div className="card-right"> <span className="rating">4.96 <span className="text-sm-medium neutral-500">(672 reviews)</span></span>
													</div>
												</div>
												<div className="card-title"> 
													<a className="heading-6 neutral-1000" href="">
														Lagos (LOs) - Doha (DOH) 
													</a>
												</div>
												<div className="card-program"> 
													<div className="card-duration-tour"> 
														<p className="icon-duration text-sm-medium neutral-500">18 Aug 2024 - 23 Dec 2024 </p>
														<p className="icon-guest text-md-medium neutral-500">Economy</p>
													</div>
													<div className="endtime"> 
														<div className="card-price"> 
															<h6 className="heading-6 neutral-1000">NGN 922,104</h6>
															<p className="text-danger text-md-medium neutral-500">| Starting From</p>
														</div>
														<div className="card-button"> 
															<a className="btn btn-gray" href="#">Book Now</a>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
									
									<div className="col-lg-4 col-md-6">
										<div className="card-journey-small background-card"> 
											<div className="card-image"> 
												<a className="label" href="#">Top Rated</a><a className="wish" href="#">
													<svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M17.071 10.1422L11.4141 15.7991C10.6331 16.5801 9.36672 16.5801 8.58568 15.7991L2.92882 10.1422C0.9762 8.1896 0.9762 5.02378 2.92882 3.07116C4.88144 1.11853 8.04727 1.11853 9.99989 3.07116C11.9525 1.11853 15.1183 1.11853 17.071 3.07116C19.0236 5.02378 19.0236 8.1896 17.071 10.1422Z" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
													</svg>
												</a>
												<div style={{ position: 'relative', width: '100%', height: '350px' }}>
													<Image layout="fill" objectFit="cover" src="/assets/imgs/page/homepage1/journey4.png" alt="Travila" />
												</div>
											</div>
											<div className="card-info background-card"> 
												<div className="card-rating"> 
													<div className="card-left"></div>
													<div className="card-right"> <span className="rating">4.96 <span className="text-sm-medium neutral-500">(672 reviews)</span></span>
													</div>
												</div>
												<div className="card-title"> 
													<a className="heading-6 neutral-1000" href="">
														Lagos (LOS) - Lagos (LON) 
													</a>
												</div>
												<div className="card-program"> 
													<div className="card-duration-tour"> 
														<p className="icon-duration text-sm-medium neutral-500">18 Aug 2024 - 20 Dec 2024 </p>
														<p className="icon-guest text-md-medium neutral-500">Economy</p>
													</div>
													<div className="endtime"> 
														<div className="card-price"> 
															<h6 className="heading-6 neutral-1000">NGN 795,445</h6>
															<p className="text-danger text-md-medium neutral-500">| Starting from</p>
														</div>
														<div className="card-button"> 
															<a className="btn btn-gray" href="#">Book Now</a>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								
									<div className="col-lg-4 col-md-6">
										<div className="card-journey-small background-card"> 
											<div className="card-image"> 
												<a className="label" href="#">Top Rated</a><a className="wish" href="#">
													<svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M17.071 10.1422L11.4141 15.7991C10.6331 16.5801 9.36672 16.5801 8.58568 15.7991L2.92882 10.1422C0.9762 8.1896 0.9762 5.02378 2.92882 3.07116C4.88144 1.11853 8.04727 1.11853 9.99989 3.07116C11.9525 1.11853 15.1183 1.11853 17.071 3.07116C19.0236 5.02378 19.0236 8.1896 17.071 10.1422Z" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
													</svg>
												</a>
												<div style={{ position: 'relative', width: '100%', height: '350px' }}>
													<Image layout="fill" objectFit="cover" src="/assets/imgs/page/homepage1/journey2.png" alt="Travila" />
												</div>
											</div>
											<div className="card-info background-card"> 
												<div className="card-rating"> 
													<div className="card-left"></div>
													<div className="card-right"> <span className="rating">4.96 <span className="text-sm-medium neutral-500">(672 reviews)</span></span>
													</div>
												</div>
												<div className="card-title"> 
													<a className="heading-6 neutral-1000" href="">
														Lagos (LOS) - Dubai (DXB) 
													</a>
												</div>
												<div className="card-program"> 
													<div className="card-duration-tour"> 
														<p className="icon-duration text-sm-medium neutral-500">18 Sep 2024 - 21 Dec 2024 </p>
														<p className="icon-guest text-md-medium neutral-500">Economy</p>
													</div>
													<div className="endtime"> 
														<div className="card-price"> 
															<h6 className="heading-6 neutral-1000">NGN 822,167</h6>
															<p className="text-danger text-md-medium neutral-500">| Starting from</p>
														</div>
														<div className="card-button"> 
															<a className="btn btn-gray" href="#">Book Now</a>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
									
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
			<section className="section-box box-media background-body"> 
				<div className="container-media wow fadeInUp">
					<Image width={275} height={275} layout="intrinsic" src="/assets/imgs/page/homepage5/media.png" alt="Travila" />
					<Image width={275} height={275} layout="intrinsic" src="/assets/imgs/page/homepage5/media2.png" alt="Travila" />
					<Image width={275} height={275} layout="intrinsic" src="/assets/imgs/page/homepage5/media3.png" alt="Travila" />
					<Image width={275} height={275} layout="intrinsic" src="/assets/imgs/page/homepage5/media4.png" alt="Travila" />
					<Image width={275} height={275} layout="intrinsic" src="/assets/imgs/page/homepage5/media5.png" alt="Travila" />
					<Image width={275} height={275} layout="intrinsic" src="/assets/imgs/page/homepage5/media6.png" alt="Travila" />
					<Image width={275} height={275} layout="intrinsic" src="/assets/imgs/page/homepage5/media7.png" alt="Travila" />
				</div>
			</section>
			
			<div className="pb-50 bg-light"></div>
			<section className="section-box box-how-it-work-3 bg-light">
				<div className="container"> 
					<div className="box-how-it-work-inner bg-body">
						<h3 className="neutral-1000 wow fadeInUp">How It Work ?</h3>
						<p className="text-xl-medium neutral-500 mb-30 wow fadeInUp">Just 4 easy and quick steps</p>
						<div className="row">
							<div className="col-lg-10">
								<ul className="list-steps list-steps-2-col wow fadeInUp"> 
									<li> 
										<div className="step-no">
											<span>1</span>
										</div>
										<div className="step-info">
										  <p className="text-xl-bold neutral-1000">Search for Flights</p>
										  <p className="text-sm-medium neutral-500">Begin your journey by entering your departure city, destination, travel dates, and the number of passengers</p>
										</div>
									</li>
									<li> 
										<div className="step-no">   
											<span>2</span>
										</div>
										<div className="step-info">
										  <p className="text-xl-bold neutral-1000">Select Your Flight</p>
										  <p className="text-sm-medium neutral-500">Review the search results and compare the details of each flight, including departure and arrival times, durations, and prices.</p>
										</div>
									</li>
									<li> 
										<div className="step-no">   
											<span>3</span>
										</div>
										<div className="step-info">
										  <p className="text-xl-bold neutral-1000">Provide Passenger Information</p>
										  <p className="text-sm-medium neutral-500">Enter the required passenger information for all individuals traveling, including names, contact details, and any special requests</p>
										</div>
									</li>
									<li> 
										<div className="step-no">
											<span>4</span>
										</div>
										<div className="step-info">
										  <p className="text-xl-bold neutral-1000">Payment and Confirmation</p>
										  <p className="text-sm-medium neutral-500">Review the booking summary, including the total cost, flight details, and passenger information</p>
										</div>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
		
		
			 <div className="bg-footer"></div>
			 <Footer />
			
			
		</Layout>
		</AnimatePresence>

		</>
	);
}
