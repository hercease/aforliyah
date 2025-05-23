'use client'
import React, { useEffect, useState, useRef, useMemo, Suspense, useCallback } from 'react';
import Image from "next/image";
import Head from 'next/head';
import BackToTop from '../../components/BackToTop.js'
import Footer from '../../components/footer';
import DatePicker from "../../components/Flatpickr.js"
import createMetadata from "../../components/CreateMetaData.js"
import CustomTypeahead from '../../components/CustomTypeHead';
import FormatNumberWithComma from '../../components/formatNumberWithComma';
import FlightDetail from '../../components/flightdetailbutton';
import styles from '../page.module.css';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import { Card, Form, Table, ButtonGroup, InputGroup,ListGroup, Input, Dropdown, Row, Col, Tab as BootstrapTab, Tabs as BootstrapTabs, FloatingLabel, Button as BootstrapButton, Collapse, OverlayTrigger, Tooltip  } from 'react-bootstrap';
import { AppBar,Accordion,AccordionSummary,AccordionDetails, Tabs, Tab, Tab as MaterialTab, Tabs as MaterialTabs } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import FlightIcon from '@mui/icons-material/Flight';
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
import Layout from '../../components/layout';
import { AnimatePresence } from 'framer-motion';
import { useRouter,usePathname,useSearchParams  } from 'next/navigation'
import { Offcanvas } from 'react-bootstrap';
import Nouislider from 'nouislider-react';
import axios from 'axios';
import convertTimeToDuration from '../../components/convertTimeToDuration';
import formatTime from '../../components/formatTime';
import formatDate from '../../components/formatDate';
import CountArrivalParams from '../../components/countParams';
import Badge from '@mui/material/Badge';
import { ClipLoader, BounceLoader, BarLoader, ClockLoader  } from 'react-spinners';
import Pagination from '@mui/material/Pagination';
import FlightMatrixCarousel from '../../components/FlightMatrixCarousel';
import FareCalendarCollapse from '../../components/fareCalendar.js';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index){
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}



const Flight = () => {
	
	const pathname = usePathname(); // Get the current pathname
	const theme = useTheme();
	const [value, setValue] = React.useState(0);
	const [flightresults, setFlightresults] = React.useState();
	const [cheapestresults, setCheapestresults] = React.useState();
	const [fastestResults, setFastestResults] = React.useState();
	const [recommendedResults, setRecommendedResults] = useState();
	const [fareResults, setFareResults] = useState({});
	const [allflightresults, setAllflightresults] = React.useState();
	const [flightairlines, setFlightairlines] = React.useState();
	const [flightsession, setFlightsession] = React.useState();
	const [searchshow, setSearchshow] = useState(false);
	const [detailshow, setDetailshow] = useState(false);
	const [filtershow, setFiltershow] = useState(false);
	const [collapseshow, setCollapseshow] = useState(false);
	const router = useRouter();
	const params = useSearchParams();
	const [isLoading, setIsLoading] = useState(false);
	const [flightfrom, setFlightfrom] = React.useState("");
	const [flightto, setFlightto] = React.useState("");
	const [flightdetail, setFlightdetail] = React.useState("");
	const [flightmatrix, setFlightmatrix] = React.useState();
	const [onestop, setOnestop] = React.useState();
	const [twostop, setTwostop] = React.useState();
	const [nonstop, setNonstop] = React.useState();
	const [parameters, setParameters] = React.useState(params);
	const [page, setPage] = React.useState(1);
	const [totalPages, setTotalPages] = useState(0);
	const [cheapest, setCheapest] = useState(0);
    const [filter, setFilter] = useState(params.get('select_filter') || 'cheapest first');
	const arrivalCount = CountArrivalParams();
	const [selectedStop, setSelectedStop] = useState([]);
	const [formType, setFormType] = useState(params.get('request_type') || 'one-way');
	const [cabinType, setCabinType] = useState('economy');
	const date = formType=='one-way' || formType=='round-trip' ? params.get('departure_date') || "" : params.get('departure_date1') || "";
	const [departuredate, setDeparturedate] = useState("");
	const timeRanges = [
		{ id: `${date}T00:00:00 - ${date}T04:59:00`, label: 'Early Morning', icon: 'bi-sunrise', time:'12:00am - 4:59am' },
		{ id: `${date}T05:00:00 - ${date}T11:59:00`, label: 'Morning', icon: 'bi-brightness-high', time:'5:00am - 11:59am' },
		{ id: `${date}T12:00:00 - ${date}T17:59:00`, label: 'Afternoon', icon: 'bi-sun', time:'12:00pm - 5:59pm' },
		{ id: `${date}T18:00:00 - ${date}T23:59:00`, label: 'Evening', icon: 'bi-moon', time:'6:00pm - 11:59pm' },
	  ];
	 
	//console.log(date);

	 // Initialize checkedItems based on the query parameter
	const [selectedRanges, setSelectedRanges] = useState(() => {
		const outbound_departure = params.get('outbound_departure');
		if (outbound_departure) {
		  // If airlines is a string (single value), wrap it in an array; if it's already an array, return as is
		  return Array.isArray(outbound_departure) ? outbound_departure : [outbound_departure];
		}
		return []; // If airlines is empty or null, return an empty array
	});
	
	const [arrival, setArrival] = useState(() => {
		const outbound_arrival = params.get('outbound_arrival');
		if (outbound_arrival) {
		  // If airlines is a string (single value), wrap it in an array; if it's already an array, return as is
		  return Array.isArray(outbound_arrival) ? outbound_arrival : [outbound_arrival];
		}
		return []; // If airlines is empty or null, return an empty array
	});

	 // Initialize checkedItems based on the query parameter
	const [checkedItems, setCheckedItems] = useState(() => {
		const airlines = params.get('airlines');
		if (airlines) {
		  // If airlines is a string (single value), wrap it in an array; if it's already an array, return as is
		  return Array.isArray(airlines) ? airlines : [airlines];
		}
		return []; // If airlines is empty or null, return an empty array
	});
	
	// Initialize checkedItems based on the query parameter
	const [stops, setStops] = useState(() => {
		const airlinestops = params.get('stops');
		if (airlinestops) {
		  // If airlines is a string (single value), wrap it in an array; if it's already an array, return as is
		  return Array.isArray(airlinestops) ? airlinestops : [airlinestops];
		}
		return []; // If airlines is empty or null, return an empty array
	});

	
	//console.log(parameters);
	
	// Construct the payload based on the condition
    // Define payload using useMemo
	const payload = useMemo(() => {
    const request_type = params.get('request_type');
    const select_filter = params.get('select_filter');
    const newPayload = {};
    if (request_type === 'one-way') {
      newPayload.cabin = params.get('cabin');
      newPayload.request_type = request_type;
      newPayload.adult = params.get('adult');
      newPayload.child = params.get('children');
      newPayload.infant = params.get('infant');
      newPayload.departure = params.get('departure');
      newPayload.arrival = params.get('arrival');
      newPayload.departure_date = params.get('departure_date');
	  newPayload.page = page;
    } else if (request_type === 'multi-city') {
      newPayload.request_type = request_type;
      newPayload.adult = params.get('adult');
      newPayload.child = params.get('children');
      newPayload.infant = params.get('infant');
      newPayload.cabin = params.get('cabin');
      newPayload.departure1 = params.get('departure1');
      newPayload.arrival1 = params.get('arrival1');
      newPayload.departure_date1 = params.get('departure_date1');
      newPayload.departure2 = params.get('departure2');
      newPayload.arrival2 = params.get('arrival2');
      newPayload.departure_date2 = params.get('departure_date2');
      newPayload.departure3 = params.get('departure3');
      newPayload.arrival3 = params.get('arrival3');
      newPayload.departure_date3 = params.get('departure_date3');
      newPayload.departure4 = params.get('departure4');
      newPayload.arrival4 = params.get('arrival4');
      newPayload.departure_date4 = params.get('departure_date4');
	  newPayload.page = page;
    } else if (request_type === 'round-trip'){
      newPayload.cabin = params.get('cabin');
      newPayload.request_type = params.get('request_type');
      newPayload.adult = params.get('adult');
      newPayload.child = params.get('children');
      newPayload.infant = params.get('infant');
      newPayload.departure = params.get('departure');
      newPayload.arrival =  params.get('arrival');
      newPayload.departure_date = params.get('departure_date');
      newPayload.arrival_date = params.get('arrival_date');
	  newPayload.page = page;
    }
	newPayload.select_filter = select_filter;
	newPayload.airlines = checkedItems;
	newPayload.outbound_departure = selectedRanges;
	newPayload.outbound_arrival = arrival;
	newPayload.stops = selectedStop;

 	return newPayload;
   }, [
    params, page, arrival, checkedItems, selectedRanges, selectedStop
  ]);

  const farepayload = useMemo(() => {
    const request_type = "fare_calendar";
    const newPayload = {};

	newPayload.cabin = params.get('cabin');
	newPayload.request_type = request_type;
	newPayload.adult = params.get('adult');
	newPayload.child = params.get('children');
	newPayload.infant = params.get('infant');
	newPayload.departure = params.get('departure');
	newPayload.arrival =  params.get('arrival');
	newPayload.departure_date = params.get('departure_date');
	newPayload.arrival_date = params.get('arrival_date');

 	return newPayload;

  }, [params]);

	const handleClose = () => setSearchshow(false);
	const handleShow = () => setSearchshow(true);
	
	const handleFilterClose = () => setFiltershow(false);
	const handleFilterShow = () => setFiltershow(true);
	
	const handleDetailClose = () => setDetailshow(false);
	const handleDetailShow = () => setDetailshow(true);
	
	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const handleChangeIndex = (index) => {
		setValue(index);
	};
	
	const  handlepageChange = (event, value) => {
		setPage(value);
		//console.log(value);
		//console.log(payload);
	};
	
	const [adults, setAdults] = useState(parseInt(params.get('adult') || 1));
	const [child, setChildren] = useState(parseInt(params.get('children') || 0));
	const [infants, setInfants] = useState(parseInt(params.get('infant') || 0));
	const [inputValue, setInputValue] = useState(`${adults} Adult ${child} Child ${infants} Infant`);

	const handleSelect = (eventKey, event) => {
		event.stopPropagation();
	};

	const updateInputValue = () => {
		setInputValue(`${adults} Adult ${child} Child ${infants} Infant`);
	};

	const handleAdultsChange = (operation) => {
		setAdults(adults + operation > 0 ? adults + operation : 1);
		setInputValue(`${adults} Adult ${child} Child ${infants} Infant`);
	};

	const handleChildrenChange = (operation) => {
		 setChildren(child + operation >= 0 ? child + operation : 0);
		setInputValue(`${adults} Adult ${child} Child ${infants} Infant`);
	};

	const handleInfantsChange = (operation) => {
		 setInfants(infants + operation >= 0 ? infants + operation : 0);
		setInputValue(`${adults} Adult ${child} Child ${infants} Infant`);
	};
  
	const [fields, setFields] = useState([{ id: 1 }]);
	const maxFields = 4;

	const handleAddFields = useCallback(() => {
		if (fields.length < maxFields) {
		  setFields([...fields, { id: fields.length + 1 }]);
		}
	},[fields]);
	
	const handleRemoveField = (id) => {
	  // Unregister the fields for the specific id being removed
	  unregisterForm3(`cabin${id}`);
	  unregisterForm3(`departure${id}`);
	  unregisterForm3(`arrival${id}`);
	  unregisterForm3(`departure_date${id}`);
	  
	  // Remove the field from the state
	  setFields(fields.filter((field) => field.id !== id));

	};
	
	/*const handleCodeSelect = (code) => {
		// Handle the selected code
		//console.log('Selected Code:', code);
	};*/
  //console.log(fields);
	const { register: registerForm1, handleSubmit: handleSubmitForm1, formState: { errors: errorsForm1 }, setValue: setValueForm1, control: controlForm1 } = useForm();
	const { register: registerForm2, watch: watchForm2, handleSubmit: handleSubmitForm2, formState: { errors: errorsForm2 }, setValue: setValueForm2, control: controlForm2 } = useForm();
	const { register: registerForm3, handleSubmit: handleSubmitForm3, formState: { errors: errorsForm3 }, setValue: setValueForm3, control: controlForm3, unregister: unregisterForm3  } = useForm();

	  // Single submit function
	const onSubmit = (data, formName) => {
		if (formName === 'form1') {
		  // Handle Form 1 submission
		  //console.log(data);
			setFiltershow(false);
			setSearchshow(false);
			const query = new URLSearchParams(data).toString();
			router.push(`/flight_list?${query}`);
		} else if (formName === 'form2') {
		  // Handle Form 2 submission
		  //console.log('Form 2 data:', data);
		  setFiltershow(false);
		  setSearchshow(false);
		  const query = new URLSearchParams(data).toString();
		  router.push(`/flight_list?${query}`);
		}
		else if (formName === 'form3') {
		  // Handle Form 2 submission
		  //console.log('Form 3 data:', data);
		  setFiltershow(false);
		  setSearchshow(false);
		  const query = new URLSearchParams(data).toString();
		  router.push(`/flight_list?${query}`);
		}
	};
	//console.log(controlForm1);

	const handleSelectFromType = (type) => {
		setFormType(type);
	};
	
	const handleSelectCabinType = (type) => {
		setCabinType(type);
	};

	useEffect(() => {

		 setIsLoading(true);
		 
		const fetchData = async () => {
		  try {
			const response = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/`, payload);
			setFlightresults(response.data.flights);
			setAllflightresults(response.data.allflights);
			setFlightmatrix(response.data.all_matrix);
			setTotalPages(response.data.total_pages);
			setCheapest(response.data.cheapest);
			setFlightairlines(response.data.airlines);
			setFlightsession(response.data.sessionId);
			setCheapestresults(response.data.cheapest_artinery);
			setFastestResults(response.data.fastest_artinery);
			setRecommendedResults(response.data.recommended);
			setOnestop(response.data.onestop);
			setTwostop(response.data.twostop);
			setNonstop(response.data.nonstop);
			//console.log(recommendedresults.Id);
			
		  } catch (error) {
			//console.error('Error sending request:', error);
		  } finally {
			//console.info("It worked");
			setIsLoading(false);
		  }
		};

		//console.log(payload.request_type = 'fare_calendar');
		//console.log(payload);

		const fetchCalendarfare = async () => { 
			try {
				const resp = await axios.post(`${process.env.NEXT_PUBLIC_HOST}/`, farepayload);
				  console.log(resp.data);
				setFareResults(resp.data);
			} catch (error) {
				console.error('Error sending request:', error);
			}
		};

		fetchData();
		//fetchCalendarfare();
	}, [payload,page,farepayload]);
	
	var DepartureAirport = flightresults?.[0]?.AirItinerary.OriginDestinationOptions?.[0]?.FlightSegments[0]?.DepartureAirportName;
	var countSegments = flightresults?.[0]?.AirItinerary.OriginDestinationOptions?.length;
	var countLastSegments = flightresults?.[0]?.AirItinerary.OriginDestinationOptions?.[countSegments - 1]?.FlightSegments.length;
	var ArrivalAirport = flightresults?.[0]?.AirItinerary.OriginDestinationOptions?.[countSegments - 1]?.FlightSegments[countLastSegments - 1]?.ArrivalAirportName;

	//console.log(cheapestresults);
	//console.log(flightresults);
	useEffect(() => {
    if (params.get('request_type') === "multi-city") {
        // Create a new array for the updated fields
        const updatedFields = [];
        const existingIds = fields.map(field => field.id); // Collect existing ids

        // Loop through arrivalCount, creating new field ids if necessary
        for (let i = 0; i < arrivalCount; i++) {
            const newId = i + 1;
            
            // Add only unique ids to the updated fields
            if (!existingIds.includes(newId)) {
                updatedFields.push({ id: newId });
            }
        }

        // Merge existing fields with updatedFields
        const finalFields = [...fields, ...updatedFields.filter(f => !existingIds.includes(f.id))];

        // If finalFields length matches arrivalCount, replace the current fields
        if (finalFields.length !== fields.length) {
            setFields(finalFields);
        }
    }
}, [params, arrivalCount, fields]);

	const departure_date = watchForm2("departure_date");

	// Convert `departure_date` to a `Date` object if it is a string
	const today = departure_date ? new Date(departure_date) : new Date();

	// Create a new `Date` object instead of modifying `today` directly
	const twoDaysFromToday = new Date(today);
	twoDaysFromToday.setDate(today.getDate() + 1);

 // Empty dependency array ensures it runs only once on page load
	//console.log(payload);
	
	const handleClick = (id) => {
	  //fetchFlightDetail(id); // Call the first function
	  //console.log(id);
	  //console.log(allflightresults[id]);
	  const foundFlight = allflightresults.find(flight => flight.Id === id);
	 //console.log(foundFlight);
	  setFlightdetail(foundFlight);
	  handleDetailShow(); // Call the second function
	};
	//console.log(flightdetail && flightdetail?.AirItinerary?.OriginDestinationOptions[0].FlightSegments[0].DepartureAirport);
	
	const handleFilterChange = (event) => {
        setFilter(event.target.value);
		//console.log(event.target);
		//const params = new URLSearchParams(searchParams);
		const param = new URLSearchParams(params);
		if(event.target.value !=""){
			param.set('select_filter', event.target.value);
		}else{
			param.delete('select_filter');
		}
		
		 // Construct the new URL string
		const newUrl = `${pathname}?${param.toString()}`;

		// Decode any encoded characters (like `+` back to space)
		const decodedUrl = decodeURIComponent(newUrl);

		// Update the URL without a page reload
		router.push(decodedUrl);
		setFiltershow(false);
		setSearchshow(false);
		//console.log(decodedUrl);
		//router.push(`${pathname}?${param.toString()}`);
    };
	
	const handleAirlineCheckboxChange = (item) => {
	  // Determine the updated list of checked items
	  let updatedCheckedItems;
	  if (checkedItems.includes(item)) {
		updatedCheckedItems = checkedItems.filter((i) => i !== item); // Remove the item
	  } else {
		updatedCheckedItems = [...checkedItems, item]; // Add the item
	  }
	  
	  
	  // Update the state with the new checked items
	  setCheckedItems(updatedCheckedItems);

	  // Create a new URLSearchParams object using the existing params
	  const param = new URLSearchParams(params);

	  // Remove existing 'airlines[]' entries to start fresh
	  param.delete('airlines');

	  // Add each item in updatedCheckedItems as separate 'airlines[]' entries
	  updatedCheckedItems.forEach((checkedItem) => {
		param.append('airlines', checkedItem);
	  });

	  // Construct the new URL string
	  const newUrl = `${pathname}?${param.toString()}`;

	  // Decode any encoded characters (like `+` back to space)
	  const decodedUrl = decodeURIComponent(newUrl);

	  // Update the URL without a page reload
	  router.push(decodedUrl);
	  
		setFiltershow(false);
		setSearchshow(false);
	};
	
	const handleCheckboxChange = (id) => {
		
		let updatedCheckedItems;
		if (selectedRanges.includes(id)) {
			updatedCheckedItems = selectedRanges.filter((i) => i !== id); // Remove the item
		} else {
			updatedCheckedItems = [...selectedRanges, id]; // Add the item
		}
		
		// Update the state with the new checked items
		setArrival(updatedCheckedItems);
		// Create a new URLSearchParams object using the existing params
		const param = new URLSearchParams(params);

		// Remove existing 'airlines[]' entries to start fresh
		param.delete('outbound_departure');

		// Add each item in updatedCheckedItems as separate 'airlines[]' entries
		updatedCheckedItems.forEach((checkedItem) => {
			param.append('outbound_departure', checkedItem);
		});

		  // Construct the new URL string
		  const newUrl = `${pathname}?${param.toString()}`;

		  // Decode any encoded characters (like `+` back to space)
		  const decodedUrl = decodeURIComponent(newUrl);

		  // Update the URL without a page reload
		  router.push(decodedUrl);
		  
		  setFiltershow(false);
		  setSearchshow(false);
	};
	
	const handleCheckboxArrivalChange = (id) => {
		
		let updatedCheckedItems;
		if (arrival.includes(id)) {
			updatedCheckedItems = arrival.filter((i) => i !== id); // Remove the item
		} else {
			updatedCheckedItems = [...arrival, id]; // Add the item
		}
		
		// Update the state with the new checked items
		setArrival(updatedCheckedItems);
		// Create a new URLSearchParams object using the existing params
		const param = new URLSearchParams(params);

		// Remove existing 'airlines[]' entries to start fresh
		param.delete('outbound_arrival');

		// Add each item in updatedCheckedItems as separate 'airlines[]' entries
		updatedCheckedItems.forEach((checkedItem) => {
			param.append('outbound_arrival', checkedItem);
		});

		  // Construct the new URL string
		  const newUrl = `${pathname}?${param.toString()}`;

		  // Decode any encoded characters (like `+` back to space)
		  const decodedUrl = decodeURIComponent(newUrl);

		  // Update the URL without a page reload
		  router.push(decodedUrl);
		  
		  setFiltershow(false);
		  setSearchshow(false);
	};
	
	const handleStop = (id) => {
		
		let updatedCheckedItems;
		if (selectedStop.includes(id)) {
			updatedCheckedItems = selectedStop.filter((i) => i !== id); // Remove the item
		} else {
			updatedCheckedItems = [...selectedStop, id]; // Add the item
		}
		
		// Update the state with the new checked items
		setSelectedStop(updatedCheckedItems);
		// Create a new URLSearchParams object using the existing params
		const param = new URLSearchParams(params);

		// Remove existing 'airlines[]' entries to start fresh
		param.delete('stops');

		// Add each item in updatedCheckedItems as separate 'airlines[]' entries
		updatedCheckedItems.forEach((checkedItem) => {
			param.append('stops', checkedItem);
		});

		  // Construct the new URL string
		  const newUrl = `${pathname}?${param.toString()}`;

		  // Decode any encoded characters (like `+` back to space)
		  const decodedUrl = decodeURIComponent(newUrl);

		  // Update the URL without a page reload
		  router.push(decodedUrl);
		  
		  setFiltershow(false);
		  setSearchshow(false);
	};
	
	//console.log(formType !=='multi-city' ? params.get('departure_date') || "" : params.get(`departure_date${formfield.id}`) || "");
	//console.log(cheapestresults);
	
	useEffect(() => {
		
		var cabin_form3 = formType !=='multi-city' ? params.get('cabin') || "" : params.get('cabin1') || "";
		setDeparturedate(date);
		
		setValueForm1('adult', adults); // Update form value when state changes
		setValueForm1('children', child);
		setValueForm1('infant', infants);
		
		setValueForm2('adult', adults); // Update form value when state changes
		setValueForm2('children', child);
		setValueForm2('infant', infants);
		
		setValueForm3('adult', adults); // Update form value when state changes
		setValueForm3('children', child);
		setValueForm3('infant', infants);
		
		setValueForm3('cabin1', cabin_form3);
	}, [adults, child, infants, setValueForm1, setValueForm2, formType, params, date, setValueForm3]);

	//console.log(allflightresults);

	return (

	<>
	
	 <style>{`
		.badge-cheapest {
			background-color: #ff7043;
			color: white;
		}
		
		
	
	 /* Styles for desktop screens */
    @media (min-width: 992px) {
      .line {
        margin: 0rem 0;
        width: 350px;
      }
    }
	/* Mobile View */
	@media (max-width: 991px) {
	  .line {
		margin: 1rem auto; /* Adjust margin for mobile view */
		width: 150px; /* Make the line full-width or adjust as needed */
	  }
	}
	
	
    `}</style>
	
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
				
					<div className="row py-2 d-none d-lg-block">
						<div className="col-md-12">
							<div className="d-flex gap-2">
								<Dropdown as={ButtonGroup}>
									<Dropdown.Toggle className="rounded-4" style={{fontSize : 16 }} variant="light" id="dropdown-basic" size="sm">
									  {formType === 'one-way' ? 'One way' : formType === 'round-trip' ? 'Round Trip' : 'Multi city'}
									</Dropdown.Toggle>

									<Dropdown.Menu>
									  <Dropdown.Item onClick={() => handleSelectFromType('one-way')}>One way</Dropdown.Item>
									  <Dropdown.Item onClick={() => handleSelectFromType('round-trip')}>Round Trip</Dropdown.Item>
									  <Dropdown.Item onClick={() => handleSelectFromType('multi-city')}>Multi-city</Dropdown.Item>
									</Dropdown.Menu>
								</Dropdown>
							</div>
						</div>
					</div>
					
					<div className="row d-none d-lg-block">
						<div className="col-12 col-lg-12 col-xl-12 py-2 mb-3">
						
						{ formType==='one-way' && <div className="card p-2"><div className="card-header mb-2 h5">One way</div><form onSubmit={handleSubmitForm1(data => onSubmit(data, 'form1'))}>
								<div className="row g-3">
								
									<div className="col-lg-4 col-md-4">
										<Controller
										name="departure"
										control={controlForm1}
										rules={{ required: 'Please select a departure location.' }}
										render={({ field }) => (
											<CustomTypeahead
												id="flight-from"
												placeholder="Flying from"
												name="departure"
												icon="bx bxs-plane-take-off bx-sm"
												fetchUrl="/"
												onCodeSelect={(code) => field.onChange(code)}
												error={errorsForm1.departure}
												initialQuery={params.get('departure') || ""}
											
											/> 
										)}
										/>
									</div>
									
									<div className="col-lg-4 col-md-4">
										<Controller
											name="arrival"
											control={controlForm1}
											rules={{ required: 'Please select an arrival location.' }}
											render={({ field }) => (
											<CustomTypeahead
												id="flight-to"
												placeholder="Flying to"
												name="arrival"
												initialQuery={params.get('arrival') || ""}
												icon="bx bxs-plane-land bx-sm"
												fetchUrl="/"
												   onCodeSelect={(code) => field.onChange(code)}
												error={errorsForm1.arrival}
											  />
											)}
										/> 
									</div>
									
									<div className="col-lg-4 col-md-4">
										<Controller
											name="departure_date"
											control={controlForm1}
											rules={{ required: 'Select departure date' }}
											render={({ field }) => (
											  <DatePicker
												placeholder="Departure date"
												minDate={new Date()}
												value={field.value || params.get('departure_date')}
												onChange={field.onChange}
												default_date={params.get('departure_date') || ""}
											  />
											)}
										/>
										{errorsForm1.departure_date  && <div className='text-danger mt-1'><ErrorOutlineRoundedIcon fontSize="small" /> {errorsForm1.departure_date.message} </div>}
										
									</div>
									<div className="col-lg-4 col-md-4">
										<Form.Group>
										  <InputGroup className="bg-white" style={{ border: 'none' }}>
											<InputGroup.Text style={{ borderRight: 'none', background: 'white' }}>
											  <i className="bx bx-cabinet bx-sm"></i>
											</InputGroup.Text>
											<Form.Select defaultValue={params.get('cabin')} name="cabin" className="" style={{ height: "45px", borderLeft: 'none' }} {...registerForm1("cabin", { required: "Select cabin"  })} aria-label="Default select example">
											  {/*<option value="">Select Cabin Class</option>*/}
											  <option  value="economy">Economy</option>
											  <option value="business">Business</option>
											  <option value="first class">First className</option>
											</Form.Select>
											</InputGroup>
										</Form.Group>
										{errorsForm1.cabin  && <div className='text-danger mt-1'><ErrorOutlineRoundedIcon fontSize="small" /> {errorsForm1.cabin.message} </div>}
									</div>
									
									<div className="col-lg-4 col-md-4 mb-2">
										<Accordion>
											<AccordionSummary
											  expandIcon={<ArrowDownwardIcon />}
											  aria-controls="panel1-content"
											  id="panel1-header"
											>
												<Typography>Passengers ({`${adults} Adult${adults > 1 ? 's' : ''} ${child} Child${child > 1 ? 'ren' : ''} ${infants} Infant${infants > 1 ? 's' : ''}`})</Typography>
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
													<Typography>{child}</Typography>
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
										<input type="hidden" {...registerForm1 ("adult")} value={adults} />
										<input type="hidden" {...registerForm1 ("children")} value={child} />
										<input type="hidden" {...registerForm1 ("infant")} value={infants} />
										<input type="hidden" {...registerForm1 ("request_type")} value="one-way" />

									</div>{/*End of accordion div row*/}
									<div className="col-lg-4">
										<Button type="submit" className="rounded-4" variant="contained" fullWidth size="lg">Find Your Flight</Button>
									</div>
									
								</div>{/*End of div row*/}
								
							</form>
							</div>
						}
						
						{ formType==='round-trip' && <div className="card p-2"><div className="card-header mb-2 h5">Round Trip</div><form onSubmit={handleSubmitForm2(data => onSubmit(data, 'form2'))} name="round_trip" id="round_trip">
								<div className="row g-3">
									<div className="col-lg-4 col-md-12">
										<Controller
											name="departure"
											control={controlForm2}
											rules={{ required: 'Please select a departure location.' }}
											render={({ field }) => (
												<CustomTypeahead
													id="flight-from"
													placeholder="Flying from"
													name="departure"
													initialQuery={params.get('departure') || ""}
													icon="bx bxs-plane-take-off bx-sm"
													fetchUrl="/"
													onCodeSelect={(code) => field.onChange(code)}
													error={errorsForm2.departure}
												/> 
											)}
										/>
									</div>
									<div className="col-lg-4 col-md-12">
										<Controller
											name="arrival"
											control={controlForm2}
											rules={{ required: 'Please select an arrival location.' }}
											render={({ field }) => (
												<CustomTypeahead
													id="flight-to"
													placeholder="Flying to"
													name="arrival"
													initialQuery={params.get('arrival') || ""}
													icon="bx bxs-plane-land bx-sm"
													fetchUrl="/"
													   onCodeSelect={(code) => field.onChange(code)}
													error={errorsForm2.arrival}
												/>
											)}
										/> 
									</div>
									<div className="col-lg-4 col-md-3">
											<Controller
												name="departure_date"
												control={controlForm2}
												rules={{ required: 'Select your departure date' }}
												render={({ field }) => (
												  <DatePicker
													placeholder="Select departure date"
													minDate={new Date()}
													value={field.value || params.get('departure_date')}
													onChange={field.onChange}
													default_date={params.get('departure_date') || ""}
												  />
												)}
											/>
											{errorsForm2.departure_date  && <div className='text-danger mt-1'><ErrorOutlineRoundedIcon fontSize="small" /> {errorsForm2.departure_date.message} </div>}
										</div>
										
										<div className="col-lg-4 col-md-3">
											<Controller
												name="arrival_date"
												control={controlForm2}
												rules={{ required: 'Select your arrival date' }}
												render={({ field }) => (
												  <DatePicker
													placeholder="Select arrival date"
													minDate={twoDaysFromToday}
													value={field.value || params.get('arrival_date')}
													onChange={field.onChange}
													default_date={params.get('arrival_date') || ""}
												  />
												)}
											/>
											{errorsForm2.arrival_date  && <div className='text-danger mt-1'><ErrorOutlineRoundedIcon fontSize="small" /> {errorsForm2.arrival_date.message} </div>}
										</div>
										
										<div className="col-lg-4 col-md-3">
											<Form.Group>
												<InputGroup className="bg-white" style={{ border: 'none' }}>
													<InputGroup.Text style={{ borderRight: 'none', background: 'white' }}>
													  <i className="bx bx-cabinet bx-sm"></i>
													</InputGroup.Text>
													<Form.Select defaultValue={params.get('cabin')} name="cabin" className="" style={{ height: "45px", borderLeft: 'none' }} {...registerForm2("cabin", { required: "Select cabin"  })} aria-label="Default select example">
													  {/*<option value="">Select Cabin Class</option>*/}
													  <option value="economy">Economy</option>
													  <option value="business">Business</option>
													  <option value="first class">First class</option>
													</Form.Select>
												</InputGroup>
											</Form.Group>
											{errorsForm2.cabin  && <div className='text-danger mt-1'><ErrorOutlineRoundedIcon fontSize="small" /> {errorsForm2.cabin.message} </div>}
										</div>
														
										<div className="col-lg-4 col-md-3 mb-2">
											<Accordion>
												<AccordionSummary
												  expandIcon={<ArrowDownwardIcon />}
												  aria-controls="panel1-content"
												  id="panel1-header"
												>
													<Typography>Passengers ({`${adults} Adult${adults > 1 ? 's' : ''} ${child} Child${child > 1 ? 'ren' : ''} ${infants} Infant${infants > 1 ? 's' : ''}`})</Typography>
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
															<Typography>{child}</Typography>
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
											<input type="hidden" {...registerForm2 ("adult")} value={adults} />
											<input type="hidden" {...registerForm2 ("children")} value={child} />
											<input type="hidden" {...registerForm2 ("infant")} value={infants} />
											<input type="hidden" {...registerForm2 ("request_type")} value="round-trip" />
											<div className="col-lg-12">
												<Button type="submit" className="rounded-4" variant="contained" fullWidth size="small">Find Your Flight</Button>
											</div>
									</div>
													
								</form>
							</div>
						
							}
							{ formType==='multi-city' && <form onSubmit={handleSubmitForm3(data => onSubmit(data, 'form3'))} name="multi_city" id="multi_city">
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
																	id="flight-from"
																	placeholder="Flying from"
																	name={`departure${formfield.id}`}
																	initialQuery={params.get(`departure${formfield.id}`) || ""}
																	icon="bx bxs-plane-take-off bx-sm"
																	fetchUrl="/"
																	onCodeSelect={(code) => field.onChange(code)}
																	error={errorsForm3[`departure${formfield.id}`]}
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
																	id="flight-to"
																	placeholder="Flying to"
																	name={`arrival${formfield.id}`}
																	icon="bx bxs-plane-land bx-sm"
																	initialQuery={params.get(`arrival${formfield.id}`) || ""}
																	fetchUrl="/"
																	onCodeSelect={(code) => field.onChange(code)}
																	error={errorsForm3[`arrival${formfield.id}`]}
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
																		value={field.value || params.get(`departure_date${formfield.id}`)}
																		default_date={params.get(`departure_date${formfield.id}`) || ""}
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
												
													<div className="col-lg-6 col-md-3 mb-2">
														<Form.Group>
														  <InputGroup className="bg-white" style={{ border: 'none' }}>
															<InputGroup.Text style={{ borderRight: 'none', background: 'white' }}>
															  <i className="bx bx-cabinet bx-sm"></i>
															</InputGroup.Text>
															<Form.Select defaultValue={params.get('cabin')} name="cabin" className="" style={{ height: "45px", borderLeft: 'none' }} {...registerForm3("cabin", { required: "Select cabin"  })} aria-label="Default select example">
															  {/*<option value="">Select Cabin Class</option>*/}
															  <option value="economy">Economy</option>
															  <option value="business">Business</option>
															  <option value="first class">First Class</option>
															</Form.Select>
														  </InputGroup>
														</Form.Group>
														{errorsForm3.cabin && (
															<div className='text-danger mt-1'>
																<ErrorOutlineRoundedIcon fontSize="small" />
																{errorsForm3.cabin?.message}
															</div>
														)}

												</div>
												
												<div className="col-lg-6 col-md-6">
												
													<Accordion>
														<AccordionSummary
														  expandIcon={<ArrowDownwardIcon />}
														  aria-controls="panel1-content"
														  id="panel1-header"
														>
														  <Typography>Passengers ({`${adults} Adult${adults > 1 ? 's' : ''} ${child} Child${child > 1 ? 'ren' : ''} ${infants} Infant${infants > 1 ? 's' : ''}`})</Typography>
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
															<Typography>{child}</Typography>
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
											<input type="hidden" {...registerForm3 ("adult")} value={adults} />
											<input type="hidden" {...registerForm3 ("children")} value={child} />
											<input type="hidden" {...registerForm3 ("infant")} value={infants} />
											<input type="hidden" {...registerForm3 ("request_type")} value="multi-city" />
										
											<div className="row py-4"> 
												<div className="col-md-6 mb-3">
													<a onClick={handleAddFields} className="btn btn-outline-primary btn-sm bg-white text-primary border-6 add_field_button rounded-5 py-2 px-3 w-100"><span className="small">Add another flight</span> </a>
												</div>
												
												<div className="col-md-6">
													<Button type="submit" className="rounded-4" variant="contained" fullWidth size="small">Find Your Flight</Button>
												</div>
											</div>
								</form> }
							
					
						</div>
					</div>
					
				</div>
			</div>
			
			<Offcanvas show={detailshow} onHide={handleDetailClose}>
				<Offcanvas.Header closeButton>
				  <Offcanvas.Title><i className='bx bxs-plane-alt'></i> Flight Detail</Offcanvas.Title>
				</Offcanvas.Header>
				<Offcanvas.Body className="">
					<Table className="caption-top" striped bordered hover>
						<caption className="pb-0">Fare Info</caption>
					  <thead>
						<tr>
						  <th className="align-middle">Departure</th>
						  <td className="align-middle">{flightdetail && flightdetail.AirItinerary.OriginDestinationOptions[0].FlightSegments[0].DepartureAirport} ({flightdetail && flightdetail.AirItinerary.OriginDestinationOptions[0].FlightSegments[0].DepartureAirportName})</td>
						</tr>
						<tr>
						  <th className="align-middle">Arrival</th>
						  <td className="align-middle">{flightdetail && flightdetail.AirItinerary.OriginDestinationOptions[0].FlightSegments[flightdetail.AirItinerary.OriginDestinationOptions[0].FlightSegments.length - 1].ArrivalAirport} ({flightdetail && flightdetail.AirItinerary.OriginDestinationOptions[0].FlightSegments[flightdetail.AirItinerary.OriginDestinationOptions[0].FlightSegments.length - 1].ArrivalAirportName})</td>
						</tr>
						<tr>
						  <th className="align-middle">Departure date</th>
						  <td className="align-middle">{flightdetail && formatDate(flightdetail.AirItinerary.OriginDestinationOptions[0].FlightSegments[0].DepartureDate)} {flightdetail &&  formatTime(flightdetail.AirItinerary.OriginDestinationOptions[0].FlightSegments[0].DepartureDate)}</td>
						</tr>
						<tr>
						  <th className="align-middle">Arrival date</th>
						  <td className="align-middle">
							{flightdetail && formatDate(flightdetail.AirItinerary.OriginDestinationOptions[flightdetail.AirItinerary.OriginDestinationOptions.length - 1].FlightSegments[flightdetail.AirItinerary.OriginDestinationOptions[flightdetail.AirItinerary.OriginDestinationOptions.length - 1].FlightSegments.length - 1].ArrivalDate)}  {flightdetail &&  formatTime(flightdetail.AirItinerary.OriginDestinationOptions[flightdetail.AirItinerary.OriginDestinationOptions.length - 1].FlightSegments[flightdetail.AirItinerary.OriginDestinationOptions[flightdetail.AirItinerary.OriginDestinationOptions.length - 1].FlightSegments.length - 1].ArrivalDate)}
							</td>
						</tr>
						<tr>
						  <th className="align-middle">Cabin</th>
						  <td className="align-middle">
							{flightdetail && flightdetail.AirItinerary.OriginDestinationOptions[0].Cabin}
							</td>
						</tr>
						<tr>
						  <th className="align-middle">Price</th>
						  <td className="align-middle">
						  {flightdetail && flightdetail.AirItineraryPricingInfo.CurrencyCode}{flightdetail && FormatNumberWithComma(flightdetail.AirItineraryPricingInfo.TotalPrice)}
							</td>
						</tr>
					  </thead>
					</Table>
					<div className="table-responsive">
					<h5>Baggage Info</h5>
						<table className="table table-striped caption-bottom align-items-center text-center">
							<caption className="pb-0">*1PC = 23KG</caption>
							
							<thead className="table-light">
								<tr>
									<th className="rounded-start">Passenger code</th>
									<th className="">Baggage Allowance Type</th>
									<th className="">Quantity</th>
								</tr>
							</thead>
							<tbody className="">
							
								{flightdetail &&
								flightdetail.AirItineraryPricingInfo.PTC_FareBreakdowns[0].Baggages.map((d, k) => {
									return (
										<tr key={k}>
											<td>{d.PassengerCode}</td>
											<td>{d.BagAllowanceType}</td>
											<td>{d.FreeQuantity}</td>
										</tr>
									);
								})}
							
							</tbody>
						</table>
					</div>
					<div className="card border mb-3">
						{flightdetail &&
						flightdetail.AirItinerary.OriginDestinationOptions.map((d, k) => {
						const segment_count = d.FlightSegments.length - 1;
					return (
						<React.Fragment key={k}>
							<div className="card-header bg-white">
								<div className="d-flex justify-content-between align-items-center">
									<div className="d-flex align-items-center mb-2 mb-sm-0">
										<Image
											src={`${process.env.NEXT_PUBLIC_AIRLINEIMAGE}/${d.FlightSegments[k]?.MarketingAirlineCode}.png`}
											width={50}
											height={50}
											layout="intrinsic"
											alt="Airline Logo"
											className="w-40px me-2"
											quality={100} // Controls the quality of the image (0-100)
											priority // Ensures the image is loaded quickly
										/>
										<h6 className="fw-normal mb-0">{d.FlightSegments[0].MarketingAirlineName}</h6>
									</div>
									<h6 className="fw-normal badge bg-secondary">
										{d.Cabin}
									</h6>
								</div>
							</div>
							
								{d.FlightSegments.map((h, p) => {
									const currentArrivalDate = new Date(h.ArrivalDate);
									const nextDepartureDate =
										p + 1 < d.FlightSegments.length ? new Date(d.FlightSegments[p + 1].DepartureDate) : null;

									let intervalHours = 0;
									if (nextDepartureDate) {
										const diffMilliseconds = nextDepartureDate.getTime() - currentArrivalDate.getTime();
										intervalHours = Math.floor(diffMilliseconds / (1000 * 60 * 60)); // Convert to hours
									}
									
									return (
										<React.Fragment key={p}>
										<div className="card-body">
											<div className="row align-items-center">
												<div className="col-md-4">
													<h6 className="mb-0 fw-bold">
														{h.DepartureAirport}
													</h6><span>{formatTime(h.DepartureDate)}</span>
													<p className="mb-0 fw-bold">{h.DepartureAirportName}</p>
												</div>
												<div className="col-md-4 text-center">
													<p className="mb-0 small fw-bold">{convertTimeToDuration(h.Duration)}</p>
													<div className="position-relative">
														<hr className="bg-primary position-relative" />
														<div
															style={{ width: 27, lineHeight: 2, height: 27 }}
															className="icon-md text-white bg-primary rounded-circle position-absolute top-50 start-50 translate-middle"
														>
															<i className="bx bxs-plane bx-rotate-90"></i>
														</div>
													</div>
												</div>
												<div className="col-md-4">
													<h6 className="mb-0 fw-bold">
														{h.ArrivalAirport} 
													</h6><span className="mb-0">{formatTime(h.ArrivalDate)}</span>
													<p className="mb-0 fw-bold">{h.ArrivalAirportName}</p>
												</div>
											</div>

											{p + 1 < d.FlightSegments.length && (
												<div className="bg-light text-center fw-normal rounded-2 mt-3 p-2">
													Change of planes: {intervalHours} hours Layover in {h.ArrivalAirportName}
												</div>
											)}
										</div>
										
										</React.Fragment>
									);
								})}
								
							
						</React.Fragment>
					);
					})}

					</div>
					
					<FlightDetail className="w-100" flightId={flightdetail.Id} flightsession={flightsession} adult={adults} numchildren={child} infant={infants} />
					
				  {/* Add your offcanvas content here */}
				</Offcanvas.Body>
			</Offcanvas>
			
			<Offcanvas show={filtershow} onHide={handleFilterClose}>
				<Offcanvas.Header closeButton>
				  <Offcanvas.Title><i className="bx bx-edit"></i> Filters</Offcanvas.Title>
				</Offcanvas.Header>
				<Offcanvas.Body className="bg-light">
				
					<div className="mb-3">
						 <select className="form-select form-control" value={filter} onChange={handleFilterChange}>
							<option value="">Select a filter</option>
							<option value="cheapest first">Price (Cheapest first)</option>
							<option value="shortest first">Duration (Shortest first)</option>
							<option value="departure earliest">Departure Outbound (Earliest)</option>
							<option value="departure latest">Departure Outbound (Latest)</option>
							<option value="arrival earliest">Arrival Outbound (Earliest)</option>
							<option value="arrival latest">Arrival Outbound (Latest)</option>
						</select>
					</div>
					
					<div className="d-flex justify-content-between border-bottom align-items-center mb-3">
						<h6 className="text-lg-bold neutral-1000  mb-2">Outbound Departure</h6>
					</div>
					<div className="box-list-tags">
						{timeRanges.map(({ id, label, icon, time }) => (
							<label
							  key={id}
							  className={`btn btn-tag-sm rounded-0 d-flex align-items-center mb-2 ${
								selectedRanges.includes(id) ? 'active' : ''
							  }`}
							>
								<input
									type="checkbox"
									value={id}
									checked={selectedRanges.includes(id)}
									onChange={() => handleCheckboxChange(id)}
									className="me-2" // Optional for some spacing
								/>
							  <i className={`bi ${icon}`}></i>
							  <span className="ms-2">{label}</span>
							  <span className="ms-auto time-range">{time}</span>
							</label>
						))}
					</div>
					
						<div className="d-flex justify-content-between border-bottom align-items-center mb-3">
							<h6 className="text-lg-bold neutral-1000 mb-2">Outbound Arrival</h6>
						</div>
						<div className="box-list-tags">
							{timeRanges.map(({ id, label, icon, time }) => (
								<label
								  key={id}
								  className={`btn btn-tag-sm rounded-0 d-flex align-items-center mb-2 ${
									arrival.includes(id) ? 'active' : ''
								  }`}
								>
									<input
										type="checkbox"
										value={id}
										checked={arrival.includes(id)}
										onChange={() => handleCheckboxArrivalChange(id)}
										className="me-2" // Optional for some spacing
									/>
								  <i className={`bi ${icon}`}></i>
								  <span className="ms-2">{label}</span>
								  <span className="ms-auto time-range">{time}</span>
								</label>
							))}
						</div>
						
						<div className="d-flex justify-content-between border-bottom align-items-center mb-3">
							<h6 className="text-lg-bold neutral-1000 mb-2">Stops</h6>
						</div>
						<div className="form-check form-switch">
						  <input className="form-check-input" onChange={() => handleStop('direct')} value="direct" type="checkbox" role="switch" id="flexSwitchCheckChecked" checked={selectedStop.includes('direct')}  />
						  <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Nonstop</label>
						</div>
						<div className="form-check form-switch">
						  <input className="form-check-input" type="checkbox" role="switch" onChange={() => handleStop('onestop')} id="flexSwitchCheckChecked1" checked={selectedStop.includes('onestop')} />
						  <label className="form-check-label" htmlFor="flexSwitchCheckChecked1">Up to 1 Stop</label>
						</div>
						<div className="form-check form-switch">
						  <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked2" onChange={() => handleStop('twostop')} checked={selectedStop.includes('twostop')} />
						  <label className="form-check-label" htmlFor="flexSwitchCheckChecked2">Up to 2 Stops</label>
						</div>
					

					<div className="block-filter">
						<div className="d-flex justify-content-between border-bottom align-items-center mb-3">
							<h6 className="text-lg-bold item-collapse neutral-1000">Airlines</h6>
							<p className="neutral-1000 mb-0"></p>
						</div>
						<div className="box-collapse scrollFilter">
							<ul className="list-filter-checkbox px-0">
							{flightairlines && flightairlines.map((item, index) => {
								// Determine if the current item is in the first 7 or should be in the collapse
								if (index < 7) {
								  return (
									<li key={index}>
									  <label className="cb-container">
										<input checked={checkedItems.includes(item.name)} onChange={() => handleAirlineCheckboxChange(item.name)} type="checkbox" value={item.name} />
										<span className="text-sm-medium">{item.name}</span>
										<span className="checkmark"></span>
									  </label>
									  <span className="number-item"></span>
									</li>
								  );
								}
								return null; // Return nothing if the item is not to be displayed
							})}
							
								<Collapse in={collapseshow}>
								<div>
									{flightairlines && flightairlines?.map((item, index) => {
										if (index >= 7) {
										return (
												<li key={index}>
													<label className="cb-container">
														<input checked={checkedItems.includes(item.name)} onChange={() => handleAirlineCheckboxChange(item.name)} type="checkbox" value={item.name} />
														<span className="text-sm-medium">{item.name}</span>
														<span className="checkmark"></span>
													</label>
												<span className="number-item"></span>
											</li>
											  );
										}
										return null; // Return nothing if the item is not to be displayed
									})}
								</div>
								</Collapse>
							</ul>
							{flightairlines && flightairlines.length > 0 && 
								<div className="box-see-more mt-20 mb-25">
									<a onClick={() => setCollapseshow(!collapseshow)} className="link-see-more"> See <span className="ms-1">{collapseshow ? 'less' : 'more'}</span>
									  <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M7.89553 1.02367C7.75114 0.870518 7.50961 0.864815 7.35723 1.00881L3.9998 4.18946L0.642774 1.00883C0.490387 0.86444 0.249236 0.870534 0.104474 1.02369C-0.0402885 1.17645 -0.0338199 1.4176 0.118958 1.56236L3.73809 4.99102C3.81123 5.06036 3.90571 5.0954 3.9998 5.0954C4.0939 5.0954 4.18875 5.06036 4.26191 4.99102L7.88104 1.56236C8.03382 1.41758 8.04029 1.17645 7.89553 1.02367Z" fill=""></path>
									  </svg>
									</a>
								</div>
							}
						</div>
					</div>
				  {/* Add your offcanvas content here */}
				</Offcanvas.Body>
			</Offcanvas>
			
			<Offcanvas show={searchshow} onHide={handleClose}>
				<Offcanvas.Header closeButton>
				  <Offcanvas.Title><i className="bx bx-edit"></i> Modify Search</Offcanvas.Title>
				</Offcanvas.Header>
				<Offcanvas.Body className="bg-light">
				
						<div className="d-flex gap-2 mb-3">
							<Dropdown as={ButtonGroup}>
								<Dropdown.Toggle className="rounded-4" style={{fontSize : 16 }} variant="secondary" id="dropdown-basic" size="sm">
								  {formType === 'one-way' ? 'One way' : formType === 'round-trip' ? 'Round Trip' : 'Multi city'}
								</Dropdown.Toggle>

								<Dropdown.Menu>
								  <Dropdown.Item onClick={() => handleSelectFromType('one-way')}>One way</Dropdown.Item>
								  <Dropdown.Item onClick={() => handleSelectFromType('round-trip')}>Round Trip</Dropdown.Item>
								  <Dropdown.Item onClick={() => handleSelectFromType('multi-city')}>Multi-city</Dropdown.Item>
								</Dropdown.Menu>
							</Dropdown>
						</div>
						
					{ formType==='one-way' && <div className="card p-2"><div className="card-header mb-2 h5">One way</div><form onSubmit={handleSubmitForm1(data => onSubmit(data, 'form1'))}>
								<div className="row g-3">
								
									<div className="col-lg-4 col-md-4">
										<Controller
										name="departure"
										control={controlForm1}
										rules={{ required: 'Please select a departure location.' }}
										render={({ field }) => (
											<CustomTypeahead
												id="flight-from"
												placeholder="Flying from"
												name="departure"
												icon="bx bxs-plane-take-off bx-sm"
												fetchUrl="https://autocomplete.travelpayouts.com/jravia?locale=en&with_airport=false"
												onCodeSelect={(code) => field.onChange(code)}
												error={errorsForm1.departure}
												initialQuery={params.get('departure') || ""}
											
											/> 
										)}
										/>
									</div>
									
									<div className="col-lg-4 col-md-4">
										<Controller
											name="arrival"
											control={controlForm1}
											rules={{ required: 'Please select an arrival location.' }}
											render={({ field }) => (
											<CustomTypeahead
												id="flight-to"
												placeholder="Flying to"
												name="arrival"
												initialQuery={params.get('arrival') || ""}
												icon="bx bxs-plane-land bx-sm"
												fetchUrl="https://autocomplete.travelpayouts.com/jravia?locale=en&with_airport=false"
												   onCodeSelect={(code) => field.onChange(code)}
												error={errorsForm1.arrival}
											  />
											)}
										/> 
									</div>
									
									<div className="col-lg-4 col-md-4">
										<Controller
											name="departure_date"
											control={controlForm1}
											rules={{ required: 'Select departure date' }}
											render={({ field }) => (
											  <DatePicker
												placeholder="Departure date"
												minDate={new Date()}
												value={field.value || params.get('departure_date')}
												onChange={field.onChange}
												default_date={params.get('departure_date')} 
											  />
											)}
										/>
										{errorsForm1.departure_date  && <div className='text-danger mt-1'><ErrorOutlineRoundedIcon fontSize="small" /> {errorsForm1.departure_date.message} </div>}
										
									</div>
									<div className="col-lg-4 col-md-4">
										<Form.Group>
										  <InputGroup className="bg-white" style={{ border: 'none' }}>
											<InputGroup.Text style={{ borderRight: 'none', background: 'white' }}>
											  <i className="bx bx-cabinet bx-sm"></i>
											</InputGroup.Text>
											<Form.Select defaultValue={params.get('cabin')} name="cabin" className="" style={{ height: "45px", borderLeft: 'none' }} {...registerForm1("cabin", { required: "Select cabin"  })} aria-label="Default select example">
											 {/*<option value="">Select Cabin Class</option>*/}
											  <option  value="economy">Economy</option>
											  <option value="business">Business</option>
											  <option value="first class">First className</option>
											</Form.Select>
											</InputGroup>
										</Form.Group>
										{errorsForm1.cabin  && <div className='text-danger mt-1'><ErrorOutlineRoundedIcon fontSize="small" /> {errorsForm1.cabin.message} </div>}
									</div>
									
									<div className="col-lg-4 col-md-4 mb-2">
										<Accordion>
											<AccordionSummary
											  expandIcon={<ArrowDownwardIcon />}
											  aria-controls="panel1-content"
											  id="panel1-header"
											>
												<Typography>Passengers ({`${adults} Adult${adults > 1 ? 's' : ''} ${child} Child${child > 1 ? 'ren' : ''} ${infants} Infant${infants > 1 ? 's' : ''}`})</Typography>
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
													<Typography>{child}</Typography>
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
										<input type="hidden" {...registerForm1 ("adult")} defaultValue={adults} />
										<input type="hidden" {...registerForm1 ("children")} value={child} />
										<input type="hidden" {...registerForm1 ("infant")} value={infants} />
										<input type="hidden" {...registerForm1 ("request_type")} value="one-way" />

									</div>{/*End of accordion div row*/}
									<div className="col-lg-4">
										<Button type="submit" className="rounded-4" variant="contained" fullWidth size="lg">Find Your Flight</Button>
									</div>
									
								</div>{/*End of div row*/}
								
							</form>
							</div>
						}
						
						{ formType==='round-trip' && <div className="card p-2"><div className="card-header mb-2 h5">Round Trip</div><form onSubmit={handleSubmitForm2(data => onSubmit(data, 'form2'))} name="round_trip" id="round_trip">
								<div className="row g-3">
									<div className="col-lg-4 col-md-12">
										<Controller
											name="departure"
											control={controlForm2}
											rules={{ required: 'Please select a departure location.' }}
											render={({ field }) => (
												<CustomTypeahead
													id="flight-from"
													placeholder="Flying from"
													name="departure"
													initialQuery={params.get('departure') || ""}
													icon="bx bxs-plane-take-off bx-sm"
													fetchUrl="https://autocomplete.travelpayouts.com/jravia?locale=en&with_airport=false"
													onCodeSelect={(code) => field.onChange(code)}
													error={errorsForm2.departure}
												/> 
											)}
										/>
									</div>
									<div className="col-lg-4 col-md-12">
										<Controller
											name="arrival"
											control={controlForm2}
											rules={{ required: 'Please select an arrival location.' }}
											render={({ field }) => (
												<CustomTypeahead
													id="flight-to"
													placeholder="Flying to"
													name="arrival"
													initialQuery={params.get('arrival') || ""}
													icon="bx bxs-plane-land bx-sm"
													fetchUrl="https://autocomplete.travelpayouts.com/jravia?locale=en&with_airport=false"
													   onCodeSelect={(code) => field.onChange(code)}
													error={errorsForm2.arrival}
												/>
											)}
										/> 
									</div>
									<div className="col-lg-4 col-md-3">
											<Controller
												name="departure_date"
												control={controlForm2}
												rules={{ required: 'Select your departure date' }}
												render={({ field }) => (
												  <DatePicker
													placeholder="Select departure date"
													minDate={new Date()}
													value={field.value || params.get('departure_date')}
													onChange={field.onChange}
													default_date={params.get('departure_date') || ""} 
												  />
												)}
											/>
											{errorsForm2.departure_date  && <div className='text-danger mt-1'><ErrorOutlineRoundedIcon fontSize="small" /> {errorsForm2.departure_date.message} </div>}
										</div>
										
										<div className="col-lg-4 col-md-3">
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
													default_date={params.get('arrival_date') || ""}
												  />
												)}
											/>
											{errorsForm2.arrival_date  && <div className='text-danger mt-1'><ErrorOutlineRoundedIcon fontSize="small" /> {errorsForm2.arrival_date.message} </div>}
										</div>
										
										<div className="col-lg-4 col-md-3">
											<Form.Group>
												<InputGroup className="bg-white" style={{ border: 'none' }}>
													<InputGroup.Text style={{ borderRight: 'none', background: 'white' }}>
													  <i className="bx bx-cabinet bx-sm"></i>
													</InputGroup.Text>
													<Form.Select defaultValue={params.get('cabin')} name="cabin" className="" style={{ height: "45px", borderLeft: 'none' }} {...registerForm2("cabin", { required: "Select cabin"  })} aria-label="Default select example">
													  {/*<option value="">Select Cabin Class</option>*/}
													  <option value="economy">Economy</option>
													  <option value="business">Business</option>
													  <option value="first class">First class</option>
													</Form.Select>
												</InputGroup>
											</Form.Group>
											{errorsForm2.cabin  && <div className='text-danger mt-1'><ErrorOutlineRoundedIcon fontSize="small" /> {errorsForm2.cabin.message} </div>}
										</div>
														
										<div className="col-lg-4 col-md-3 mb-2">
											<Accordion>
												<AccordionSummary
												  expandIcon={<ArrowDownwardIcon />}
												  aria-controls="panel1-content"
												  id="panel1-header"
												>
													<Typography>Passengers ({`${adults} Adult${adults > 1 ? 's' : ''} ${child} Child${child > 1 ? 'ren' : ''} ${infants} Infant${infants > 1 ? 's' : ''}`})</Typography>
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
															<Typography>{child}</Typography>
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
											<input type="hidden" {...registerForm2 ("adult")} defaultValue={adults} />
											<input type="hidden" {...registerForm2 ("children")} value={child} />
											<input type="hidden" {...registerForm2 ("infant")} value={infants} />
											<input type="hidden" {...registerForm2 ("request_type")} value="round-trip" />
											<div className="col-lg-12">
												<Button type="submit" className="rounded-4" variant="contained" fullWidth size="small">Find Your Flight</Button>
											</div>
									</div>
													
								</form>
							</div>
						
							}
							{ formType==='multi-city' && <form onSubmit={handleSubmitForm3(data => onSubmit(data, 'form3'))} name="multi_city" id="multi_city">
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
																	id="flight-from"
																	placeholder="Flying from"
																	name={`departure${formfield.id}`}
																	initialQuery={
																	  params.get('request_type') !== 'multi-city' && formfield.id == 1
																		? params.get('departure') || ''  // Fallback value if null
																		: params.get(`departure${formfield.id}`) || ''
																	}

																	icon="bx bxs-plane-take-off bx-sm"
																	fetchUrl="https://autocomplete.travelpayouts.com/jravia?locale=en&with_airport=false"
																	onCodeSelect={(code) => field.onChange(code)}
																	error={errorsForm3[`departure${formfield.id}`]}
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
																	id="flight-to"
																	placeholder="Flying to"
																	name={`arrival${formfield.id}`}
																	icon="bx bxs-plane-land bx-sm"
																	initialQuery={
																	  params.get('request_type') !== 'multi-city' && formfield.id == 1
																		? params.get('arrival') || ''  // Fallback value if null
																		: params.get(`arrival${formfield.id}`) || ''
																	}
																	fetchUrl="https://autocomplete.travelpayouts.com/jravia?locale=en&with_airport=false"
																	   onCodeSelect={(code) => field.onChange(code)}
																	error={errorsForm3[`arrival${formfield.id}`]}
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
																		placeholder = "Select departure date"
																		minDate = {twoDaysFromToday}
																		value = {field.value || ( formfield==1 ? departuredate : "" )}
																		onChange = {field.onChange}
																		default_date = { formfield==1 && departuredate }
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
											
												<div className="col-lg-6 col-md-3 mb-2">
													<Form.Group>
													  <InputGroup className="bg-white" style={{ border: 'none' }}>
														<InputGroup.Text style={{ borderRight: 'none', background: 'white' }}>
														  <i className="bx bx-cabinet bx-sm"></i>
														</InputGroup.Text>
														<Form.Select className="" style={{ height: "45px", borderLeft: 'none' }} {...registerForm3("cabin", { required: "Select cabin"  })} aria-label="Default select example">
														  {/*<option value="">Select Cabin Class</option>*/}
														  <option value="economy">Economy</option>
														  <option value="business">Business</option>
														  <option value="first class">First Class</option>
														</Form.Select>
													  </InputGroup>
													</Form.Group>
													{errorsForm3.cabin && (
													  <div className='text-danger mt-1'>
														<ErrorOutlineRoundedIcon fontSize="small" />
														{errorsForm3.cabin?.message}
													  </div>
													)}
												</div>
											
											<div className="col-lg-6 col-md-6">
												<Accordion>
													<AccordionSummary
													  expandIcon={<ArrowDownwardIcon />}
													  aria-controls="panel1-content"
													  id="panel1-header"
													>
													  <Typography>Passengers ({`${adults} Adult${adults > 1 ? 's' : ''} ${child} Child${child > 1 ? 'ren' : ''} ${infants} Infant${infants > 1 ? 's' : ''}`})</Typography>
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
														<Typography>{child}</Typography>
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
											<input type="hidden" {...registerForm3 ("adult")} value={adults} />
											<input type="hidden" {...registerForm3 ("children")} value={child} />
											<input type="hidden" {...registerForm3 ("infant")} value={infants} />
											<input type="hidden" {...registerForm3 ("request_type")} value="multi-city" />
										
											<div className="row py-4"> 
												<div className="col-md-6 mb-3">
													<a 
													   onClick={handleAddFields}  
													  className="btn btn-outline-primary btn-sm bg-white text-primary border-6 add_field_button rounded-5 py-2 px-3 w-100">
													  <span className="small">Add another flight</span> 
													</a>

												</div>
												
												<div className="col-md-6">
													<Button type="submit" className="rounded-4" variant="contained" fullWidth size="small">Find Your Flight</Button>
												</div>
											</div>
							</form> }
							
					
				  {/* Add your offcanvas content here */}
				</Offcanvas.Body>
			</Offcanvas>
			
		
			<div className="container-fluid bg-light py-4">
				<div className="row">
					<div className="col-md-10 mx-auto">
					<div className="row">
						<div className="col-lg-3 d-none d-lg-block">
							<div className="mb-3">
						 <select className="form-select form-control" value={filter} onChange={handleFilterChange}>
							<option value="">Select a filter</option>
							<option value="cheapest first">Price (Cheapest first)</option>
							<option value="shortest first">Duration (Shortest first)</option>
							<option value="departure earliest">Departure Outbound (Earliest)</option>
							<option value="departure latest">Departure Outbound (Latest)</option>
							<option value="arrival earliest">Arrival Outbound (Earliest)</option>
							<option value="arrival latest">Arrival Outbound (Latest)</option>
						</select>
					</div>
					
					<div className="d-flex justify-content-between border-bottom align-items-center mb-3">
						<h6 className="text-lg-bold neutral-1000  mb-2">Outbound Departure</h6>
					</div>
					<div className="box-list-tags">
						{timeRanges.map(({ id, label, icon, time }) => (
							<label
							  key={id}
							  className={`btn btn-tag-sm rounded-0 d-flex align-items-center mb-2 ${
								selectedRanges.includes(id) ? 'active' : ''
							  }`}
							>
								<input
									type="checkbox"
									value={id}
									checked={selectedRanges.includes(id)}
									onChange={() => handleCheckboxChange(id)}
									className="me-2" // Optional for some spacing
								/>
							  <i className={`bi ${icon}`}></i>
							  <span className="ms-2">{label}</span>
							  <span className="ms-auto time-range">{time}</span>
							</label>
						))}
					</div>
					
						<div className="d-flex justify-content-between border-bottom align-items-center mb-3">
							<h6 className="text-lg-bold neutral-1000 mb-2">Outbound Arrival</h6>
						</div>
						<div className="box-list-tags">
							{timeRanges.map(({ id, label, icon, time }) => (
								<label
								  key={id}
								  className={`btn btn-tag-sm rounded-0 d-flex align-items-center mb-2 ${
									arrival.includes(id) ? 'active' : ''
								  }`}
								>
									<input
										type="checkbox"
										value={id}
										checked={arrival.includes(id)}
										onChange={() => handleCheckboxArrivalChange(id)}
										className="me-2" // Optional for some spacing
									/>
								  <i className={`bi ${icon}`}></i>
								  <span className="ms-2">{label}</span>
								  <span className="ms-auto time-range">{time}</span>
								</label>
							))}
						</div>
						
						<div className="d-flex justify-content-between border-bottom align-items-center mb-3">
							<h6 className="text-lg-bold neutral-1000 mb-2">Stops</h6>
						</div>
						<div className="form-check form-switch">
						  <input className="form-check-input" onChange={() => handleStop('direct')} value="direct" type="checkbox" role="switch" id="flexSwitchCheckChecked" checked={selectedStop.includes('direct')}  />
						  <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Nonstop</label>
						</div>
						<div className="form-check form-switch">
						  <input className="form-check-input" type="checkbox" role="switch" onChange={() => handleStop('onestop')} id="flexSwitchCheckChecked1" checked={selectedStop.includes('onestop')} />
						  <label className="form-check-label" htmlFor="flexSwitchCheckChecked1">Up to 1 Stop</label>
						</div>
						<div className="form-check form-switch">
						  <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked2" onChange={() => handleStop('twostop')} checked={selectedStop.includes('twostop')} />
						  <label className="form-check-label" htmlFor="flexSwitchCheckChecked2">Up to 2 Stops</label>
						</div>
					

					<div className="block-filter">
						<div className="d-flex justify-content-between border-bottom align-items-center mb-3">
							<h6 className="text-lg-bold item-collapse neutral-1000">Airlines</h6>
							<p className="neutral-1000 mb-0"></p>
						</div>
						<div className="box-collapse scrollFilter">
							<ul className="list-filter-checkbox px-0">
							{flightairlines && flightairlines.map((item, index) => {
								// Determine if the current item is in the first 7 or should be in the collapse
								if (index < 7) {
								  return (
									<li key={index}>
									  <label className="cb-container">
										<input checked={checkedItems.includes(item.name)} onChange={() => handleAirlineCheckboxChange(item.name)} type="checkbox" value={item.name} />
										<span className="text-sm-medium">{item.name}</span>
										<span className="checkmark"></span>
									  </label>
									  <span className="number-item"></span>
									</li>
								  );
								}
								return null; // Return nothing if the item is not to be displayed
							})}
							
								<Collapse in={collapseshow}>
								<div>
									{flightairlines && flightairlines?.map((item, index) => {
										if (index >= 7) {
										return (
												<li key={index}>
												  <label className="cb-container">
													<input type="checkbox" />
													<span className="text-sm-medium">{item.name}</span>
													<span className="checkmark"></span>
												  </label>
												  <span className="number-item">{item.count}</span>
												</li>
											  );
										}
										return null; // Return nothing if the item is not to be displayed
									})}
								</div>
								</Collapse>
							</ul>
							{flightairlines && flightairlines.length > 0 && 
								<div className="box-see-more mt-20 mb-25">
									<a onClick={() => setCollapseshow(!collapseshow)} className="link-see-more"> See <span className="ms-1">{collapseshow ? 'less' : 'more'}</span>
									  <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M7.89553 1.02367C7.75114 0.870518 7.50961 0.864815 7.35723 1.00881L3.9998 4.18946L0.642774 1.00883C0.490387 0.86444 0.249236 0.870534 0.104474 1.02369C-0.0402885 1.17645 -0.0338199 1.4176 0.118958 1.56236L3.73809 4.99102C3.81123 5.06036 3.90571 5.0954 3.9998 5.0954C4.0939 5.0954 4.18875 5.06036 4.26191 4.99102L7.88104 1.56236C8.03382 1.41758 8.04029 1.17645 7.89553 1.02367Z" fill=""></path>
									  </svg>
									</a>
								</div>
							}
						</div>
					</div>
						</div>
						<div className="col-lg-9">

							  {isLoading ? (
							  
									<div className="d-flex justify-content-center align-items-center" style={{  height: "50vh" }}>
										<Image alt="Aforliyah preloader" width={100} height={100} src="/assets/imgs/aforliyah_preloader.gif" />
									</div>
									
							  ) : (
							  
							  <div>
								
								<FlightMatrixCarousel flightmatrix={flightmatrix} onestop={onestop} nonstop={nonstop} twostop={twostop} />
								{/*{ payload && payload.request_type === 'round-trip' && <div className="mb-3 mt-3"><CalendarTodayIcon style={{ fontSize: 40, color: '#1976d2' }} /> <FareCalendarCollapse fareCalendar={fareResults} /></div> } */}
								<div className="row">
									<div className="col-12">
										<div className="table-responsive">
											<table className='table table-bordered rounded-3 overflow-hidden text-center'>
												<thead className="table-primary text-centered">
													<tr>
														<th scope="col">Cheapest Fare</th>
														<th scope="col">Recommended Fare</th>
														<th scope="col">Fastest Fare</th>
													</tr>
												</thead>
												<tbody>
													<tr>
														<td onClick={() => handleClick(cheapestresults && cheapestresults?.Id)} className="fw-bold">{cheapestresults && cheapestresults.AirItineraryPricingInfo.CurrencyCode} {cheapestresults && FormatNumberWithComma(cheapestresults.AirItineraryPricingInfo.TotalPrice)}</td>
														<td onClick={() => handleClick(recommendedResults && recommendedResults?.Id)} className="fw-bold">{recommendedResults && recommendedResults.AirItineraryPricingInfo.CurrencyCode} {recommendedResults && FormatNumberWithComma(recommendedResults.AirItineraryPricingInfo.TotalPrice)}</td>
														<td onClick={() => handleClick(fastestResults && fastestResults?.Id)} className="fw-bold">{fastestResults && fastestResults.AirItineraryPricingInfo.CurrencyCode} {fastestResults && FormatNumberWithComma(fastestResults.AirItineraryPricingInfo.TotalPrice)}</td>
														
													</tr>
												</tbody>
											</table>
										</div>
									</div>
								</div>
							  

							  {flightresults > 0 &&
								<div className="row mb-3">
									<p className="h5">Flight results  && {`for ${DepartureAirport} to ${ArrivalAirport}`}</p>
									<small>Price are shown in Naira and are per person inclusive of taxes fees with the exception of baggage rules</small>
							  </div>}
							  
								{flightresults && flightresults.map((data, key) => {
								const count_origin = data.AirItinerary.OriginDestinationOptions.length;
								//console.log(data);
								return (
								
								<div key={key} className="card shadow mb-3 wow border-bottom fadeInUp">
								
									<div className="card-header bg-white border-bottom-0 d-xl-none bg-mode d-flex align-items-center">
										<Image
										  src={`${process.env.NEXT_PUBLIC_AIRLINEIMAGE}/${data.AirItinerary.OriginDestinationOptions[0].FlightSegments[0].MarketingAirlineCode}.png`}
										  width={45}           // Width of the image
										  height={45}          // Height of the image
										  layout="intrinsic"   // Maintains the image's aspect ratio
										  alt="Airline Logo"   // Alt text for accessibility
										  className="me-1"     // Bootstrap class for right margin
										  quality={100}        // Image quality (0-100)
										  priority             // Prioritizes loading this image
										/>
									  <span className="h6 mb-0">{data.AirItinerary.OriginDestinationOptions[0].FlightSegments[0].MarketingAirlineName}</span>
									</div>
									
									<div className="card-body">
										
											<div className="row">
											{data.AirItinerary.OriginDestinationOptions.map((d, k) => {
											  const segment_count = d.FlightSegments.length - 1;
											//console.log(data.AirItineraryPricingInfo.TotalPrice);
											  return (
												<div key={k} className="col-lg-10 col-md-12">
													{parseInt(cheapest)===parseInt(data.AirItineraryPricingInfo.TotalPrice) && <span className="badge badge-cheapest mb-3" style={{position: "absolute", top: 10, right: 10}}>Cheapest</span>}
												  <div className="d-flex flex-column">
													<div className="">
													  <div className="d-flex justify-content-between text-center align-items-center">
														<div className="d-none d-lg-block">
														  <Image
															src={`${process.env.NEXT_PUBLIC_AIRLINEIMAGE}/${d.FlightSegments[0].MarketingAirlineCode}.png`}
															width={50}
															height={50}
															layout="intrinsic"
															alt="Airline Logo"
															className=""
															quality={100} // Controls the quality of the image (0-100)
															priority // Ensures the image is loaded quickly
														  />
														  <p className="small mb-0 text-center">{d.FlightSegments[0].MarketingAirlineName}</p>
														</div>
														<div className="small">
														  <OverlayTrigger
															key={`departure-time-${k}`}
															placement="top"
															overlay={
															  <Tooltip id={`tooltip-departure-time-${k}`}>
																{formatDate(d.FlightSegments[0].DepartureDate)}
															  </Tooltip>
															}
														  >
															<b className="fw-bold">{formatTime(d.FlightSegments[0].DepartureDate)}</b>
														  </OverlayTrigger>

														  <OverlayTrigger
															key={`departure-airport-${k}`}
															placement="top"
															overlay={
															  <Tooltip id={`tooltip-departure-airport-${k}`}>
																{d.FlightSegments[0].DepartureAirportName}
															  </Tooltip>
															}
														  >
															<p className="text-muted fw-bold">{d.FlightSegments[0].DepartureAirport}</p>
														  </OverlayTrigger>
														</div>
														<div>
														  <p className="mb-0 small fw-bold">{convertTimeToDuration(d.JourneyTotalDuration)}</p>
														  <div className="position-relative">
															<hr style={{ margin: 5 }} className="bg-primary position-relative line" />
															<div className="icon-md text-dark rounded-circle position-absolute top-50 start-50 translate-middle">
															  <i className='bx bxs-plane bx-rotate-90' ></i>
															</div>
														  </div>
														  <p className="mb-0">
														  {segment_count} {segment_count > 1 ? 'Stops' : 'Stop'} {segment_count > 0 && `(${d.FlightSegments.slice(0, -1).map((e, index) => e.ArrivalAirport).join(', ')})`}

														  </p>
														</div>
														<div className="small">
														  <OverlayTrigger
															key={`arrival-time-${k}`}
															placement="top"
															overlay={
															  <Tooltip id={`tooltip-arrival-time-${k}`}>
																{formatDate(d.FlightSegments[segment_count].ArrivalDate)}
															  </Tooltip>
															}
														  >
															<b className="fw-bold">{formatTime(d.FlightSegments[segment_count].ArrivalDate)}</b>
														  </OverlayTrigger>

														  <OverlayTrigger
															key={`arrival-airport-${k}`}
															placement="top"
															overlay={
															  <Tooltip id={`tooltip-arrival-airport-${k}`}>
																{d.FlightSegments[segment_count].ArrivalAirportName}
															  </Tooltip>
															}
														  >
															<p className="text-muted fw-bold">{d.FlightSegments[segment_count].ArrivalAirport}</p>
														  </OverlayTrigger>
														</div>
													  </div>
													</div>
												  </div>
												</div>
											  );
											})}

												<div style={{ borderLeft: "1px solid var(--bs-border-color)" }} className="col-lg-2 col-md-12 mt-4 d-none d-lg-block align-items-center text-center">
												  <p className="fw-bold align-items-center text-primary h6">{data.AirItineraryPricingInfo.CurrencyCode} {FormatNumberWithComma(data.AirItineraryPricingInfo.TotalPrice)}</p>
												</div>
											</div>
									  
											
										</div>
										<div className="card-footer">
											<div className="d-flex justify-content-between align-items-center">
													<div className="small text-primary fw-bold d-lg-none">
													  {data.AirItineraryPricingInfo.CurrencyCode}{FormatNumberWithComma(data.AirItineraryPricingInfo.TotalPrice)}
													</div>
													<div className="me-lg-2 ms-lg-auto"><FlightDetail flightId={data.Id} flightsession={flightsession} adult={adults} numchildren={child} infant={infants} />
													</div>
													<div className="">
														<Button onClick={() => handleClick(data.Id)} size="small" variant="contained">Details</Button>
													</div>
											</div>
										</div>
									</div>
									
								);
							})}
							
							<Pagination
								count={totalPages}
								page={page}
								onChange={handlepageChange}
								variant="outlined"
								color="primary"
								shape="rounded"
							  />
							
							</div>
							
							)}
							 
							</div>
						</div>
					</div>
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
    <Flight />
  </Suspense>
);

export default MyComponentWithSuspense;

