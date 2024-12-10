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
import Link from 'next/link';
import CustomImage from '../../components/customImageFetch.js'


const HotelList = () => {

    const pathname = usePathname(); // Get the current pathname
    const searchParams = useSearchParams();
    const [collapseshow, setCollapseshow] = useState(false);
    const router = useRouter();
    const params = useSearchParams();
    const [searchshow, setSearchshow] = useState(false);
    const [detailshow, setDetailshow] = useState(false);
    const [filtershow, setFiltershow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [Hotels, setHotels] = useState();
    const [hotelChain, setHotelChain] = useState();
    const [amenities, setAmenities] = useState();
    const [minimumprice, setMinimumPrice] = useState(0);
    const [maximumprice, setMaximumPrice] = useState(0);
    const [sessionid, setSessionId] = useState();
    const [pagination, setPagination] = useState();
    const [filter, setFilter] = useState(params.get('sortby') || '');

	  const [page, setPage] = React.useState(1);
	  const [totalguests, setTotalGuests] = React.useState(0);

	  const [rooms, setRooms] = useState(parseInt(params.get('room') || 1));
    const [roomsState, setRoomsState] = useState([]);

    const [formData, setFormData] = useState({});

    const [selectedChain, setSelectedChain] = useState(() => {
      const chain = params.get('chains');
      if (chain) {
        // If airlines is a string (single value), wrap it in an array; if it's already an array, return as is
        return Array.isArray(chain) ? chain : [chain];
      }
      return [];
    });

    const [selectedAmenities, setSelectedAmenities] = useState(() => {
      const amenities = params.get('amenities');
      if (amenities) {
        // If airlines is a string (single value), wrap it in an array; if it's already an array, return as is
        return Array.isArray(amenities) ? amenities : [amenities];
      }
      return [];
    });

    useEffect(() => {

      const newRoomsState = Array.from({ length: rooms }).map((_, roomIndex) => ({
        adults: parseInt(params.get(`room${roomIndex}_adults`) || "1", 10),
        children: parseInt(params.get(`room${roomIndex}_children`) || "0", 10),
        childrenAges: Array.from({ length: parseInt(params.get(`room${roomIndex}_children`) || "0", 10) }).map(
          (_, childIndex) => parseInt(params.get(`room${roomIndex}_child${childIndex}_age`) || "1", 10)
        ),
      }));

      setRoomsState(newRoomsState);

      // Calculate total guests
      const totalAdults = newRoomsState.reduce((sum, room) => sum + room.adults, 0);
      const totalChildren = newRoomsState.reduce((sum, room) => sum + room.children, 0);

      setTotalGuests({ adults: totalAdults, children: totalChildren, total: totalAdults + totalChildren });


    }, [params, rooms]);

    const reloadPage = () => {
      router.refresh(); // Reloads the page without a full browser reload
    };


    console.log(amenities?.length);

     // Memoize formValues
    const formValues = useMemo(() => {
      const params = new URLSearchParams(searchParams.toString());
      const values = {};
      for (const [key, value] of params.entries()) {
        values[key] = value;
      }

      values.page = page;
      values.chains = selectedChain;
      values.amenities = selectedAmenities;

      return values;

    }, [searchParams,page]);
  

    useEffect(() => {

      setIsLoading(true);

      const fetchData = async () => {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_HOST}/all_processes/`,
            formValues
          );
        if(response.data.status==0){
          setHotels(response.data.Hotels);
          setSessionId(response.data.SessionId);
          setPagination(response.data.PaginationData);
          setHotelChain(response.data.chainCode);
          setAmenities(response.data.hotelAmenities);
        }else{
          toast.error(response.data.message,{duration: 10000});
        }
          
        } catch (error) {
          console.error("Error fetching data", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }, [formValues,page,selectedChain,selectedAmenities]); // Use memoized values as dependency

    const fetchHoteldetails = (hotelid) => {
      try {
        const response = axios.post(
          `${process.env.NEXT_PUBLIC_HOST}/all_processes/`, { hotelid: hotelid, sessionid: sessionid, request_type: "hotel_details" }
        );
      } catch (error) {
        
      }
    }

    console.log(rooms);

  
    //const [hotelInputValue, setHotelInputValue] = useState(`${adults} Adult ${children} Child ${rooms} Room`);

    /*const payload = useMemo(() => {
      const request_type = params.get('request_type');
      const select_filter = params.get('select_filter');
      const newPayload = {};
     
      newPayload.code = params.get('destination');
      newPayload.checkin = params.get('checkin_date');
      newPayload.checkout = params.get('checkout_date');
      newPayload.adult =  params.get('adult');
      newPayload.child =  params.get('child');
      newPayload.room =  params.get('room');
    
        return newPayload;
    }, [
      params, page
    ]);*/

    const { 
      register: registerForm4, 
      watch: watchForm4, 
      handleSubmit: handleSubmitForm4, 
      formState: { errors: errorsForm4 }, 
      setValue: setValueForm4, 
      control: controlForm4, 
      unregister: unregisterForm4 
    } = useForm();
    
    const handleRoomChange = (roomIndex, field, delta) => {
      setRoomsState((prev) =>
        prev.map((room, index) => {
          if (index === roomIndex) {
            if (field === "children") {
              const newChildrenCount = Math.max(0, room.children + delta);
    
              // Dynamically adjust childrenAges array
              const updatedRoom = {
                ...room,
                children: newChildrenCount,
                childrenAges:
                  newChildrenCount > room.children
                    ? [...room.childrenAges, 1] // Add default age
                    : room.childrenAges.slice(0, newChildrenCount), // Remove excess ages
              };
    
              // Update the form values
              setValueForm4(`room${roomIndex}_children`, newChildrenCount);
              updatedRoom.childrenAges.forEach((age, childIndex) => {
                setValueForm4(`room${roomIndex}_child${childIndex}_age`, age);
              });
    
              return updatedRoom;
            }
    
            if (field === "adults") {
              const newAdultCount = Math.max(1, room.adults + delta);
              setValueForm4(`room${roomIndex}_adults`, newAdultCount);
              return {
                ...room,
                adults: newAdultCount,
              };
            }
          }
          return room;
        })
      );
    };
    
    const handleRoomsChange = (delta) => {
      const newRooms = Math.max(1, rooms + delta);
    
      // Clear form data for removed rooms
      if (newRooms < rooms) {
        for (let i = newRooms; i < rooms; i++) {
          unregisterForm4(`room${i}_adults`);
          unregisterForm4(`room${i}_children`);
          // Unregister all children ages dynamically
          roomsState[i].childrenAges.forEach((_, childIndex) => {
            unregisterForm4(`room${i}_child${childIndex}_age`);
          });
        }
      }
    
      // Adjust roomsState array
      setRoomsState((prev) => {
        const updatedRoomsState =
          newRooms > prev.length
            ? [
                ...prev,
                ...Array.from({ length: newRooms - prev.length }).map(() => ({
                  adults: 1,
                  children: 0,
                  childrenAges: [],
                })),
              ]
            : prev.slice(0, newRooms);
    
        return updatedRoomsState;
      });
    
      setRooms(newRooms);
    
      // Debugging logs
      console.log("Rooms Updated:", newRooms);
    };

    useEffect(() => {
      // Sync "rooms" state with form field
      setValueForm4("room", rooms);
    }, [rooms, setValueForm4]);
    
      

          // Single submit function
        const onSubmit = (data, formName) => {
          if (formName === 'form4') {
            // Handle Form 2 submission
            console.log('Form 3 data:', data);
            const query = new URLSearchParams(data).toString();
            
            router.push(`/hotel_list?${query}`);
            handleClose();
            }
        };
	

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

      const handlepageChange = (event, value) => {
        setPage(value);
      };

      const HotelAwards = ({ awards }) => {
        const localStarRating = awards.find(
          (award) => award.Provider === "Local Star Rating"
        );
      
        return (
          <div>
            {localStarRating ? (
              [...Array(parseInt(localStarRating.Rating) || 0)].map((_, index) => (
                <StarIcon key={index} style={{ color: "gold" }} />
              ))
            ) : (
              <p>No star rating</p>
            )}
          </div>
        );
      };

      console.log(selectedChain);

      const handleAmenitiesCheckboxChange = (item) => {

          // Determine the updated list of checked items
          let updatedAmenitiesItems;
          if (selectedAmenities.includes(item)) {
            updatedAmenitiesItems = selectedAmenities.filter((i) => i !== item); // Remove the item
          } else {
            updatedAmenitiesItems = [...selectedAmenities, item]; // Add the item
          }
          
          
          // Update the state with the new checked items
          setSelectedAmenities(updatedAmenitiesItems);

          // Create a new URLSearchParams object using the existing params
          const param = new URLSearchParams(params);

          // Remove existing 'chains[]' entries to start fresh
          param.delete('amenities');

          // Add each item in updatedCheckedItems as separate 'airlines[]' entries
          updatedAmenitiesItems.forEach((checkedItem) => {
            param.append('amenities', checkedItem);
          });

          console.log(updatedAmenitiesItems);

          // Construct the new URL string
          const newUrl = `${pathname}?${param.toString()}`;

          // Decode any encoded characters (like `+` back to space)
          const decodedUrl = decodeURIComponent(newUrl);

          // Update the URL without a page reload
          router.push(decodedUrl);
          
          handleFilterClose();
           
      }
      
      const handleChainCodeCheckboxChange = (item) => {
         // Determine the updated list of checked items
          let updatedChainItems;
          if (selectedChain.includes(item)) {
            updatedChainItems = selectedChain.filter((i) => i !== item); // Remove the item
          } else {
            updatedChainItems = [...selectedChain, item]; // Add the item
          }
          
          
          // Update the state with the new checked items
          setSelectedChain(updatedChainItems);

          // Create a new URLSearchParams object using the existing params
          const param = new URLSearchParams(params);

          // Remove existing 'chains[]' entries to start fresh
          param.delete('chains');

          // Add each item in updatedCheckedItems as separate 'airlines[]' entries
          updatedChainItems.forEach((checkedItem) => {
            param.append('chains', checkedItem);
          });

          console.log(updatedChainItems);

          // Construct the new URL string
          const newUrl = `${pathname}?${param.toString()}`;

          // Decode any encoded characters (like `+` back to space)
          const decodedUrl = decodeURIComponent(newUrl);

          // Update the URL without a page reload
          router.push(decodedUrl);
          
          handleFilterClose();
      }
      
        const handleFilterChange = (event) => {
            setFilter(event.target.value);
            //console.log(event.target);
            //const params = new URLSearchParams(searchParams);
            const param = new URLSearchParams(params);
            if(event.target.value !=""){
              param.set('sortby', event.target.value);
            }else{
              param.delete('sortby');
            }
            
            // Construct the new URL string
            const newUrl = `${pathname}?${param.toString()}`;

            // Decode any encoded characters (like `+` back to space)
            const decodedUrl = decodeURIComponent(newUrl);

            // Update the URL without a page reload
            router.push(decodedUrl);
            handleFilterClose();
      
        };
      
      

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
                      </div>

                    </div>

                <section className="box-section block-content-tourlist background-body">
                    <div className="container">

                    <div className="row d-none d-lg-block">
                          <div className="col-12 col-lg-12 col-xl-12 py-2 mb-3">
                            <div className="card">
                              <div className="card-body">

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
                                        initialQuery={Hotels && Hotels[0]?.HotelCityCode}
                                        
                                        
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
                                        value={field.value || params.get('checkin_date')}
                                        onChange={field.onChange}
                                        default_date={params.get('checkin_date') || ""}
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
                                        value={checkout_date <= hoteltwoDaysFromToday ? null :  field.value || params.get('checkout_date')}
                                        onChange={field.onChange}
                                        default_date={params.get('checkout_date') || ""}
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
                                
                                        {roomsState.map((room, roomIndex) => (
                                                <div key={roomIndex} className="card p-2 mb-2">
                                                  <div className="card-header">{`Room ${roomIndex + 1}`}</div>

                                                  {/* Adults */}
                                                  <div className="d-flex justify-content-between align-items-center">
                                                    <Typography>Adults</Typography>
                                                    <div className="hstack gap-1 align-items-center">
                                                      <Button
                                                        disabled={room.adults <= 1}
                                                        variant="link"
                                                        onClick={() => handleRoomChange(roomIndex, "adults", -1)}
                                                      >
                                                        <i className="bi bi-dash-circle fs-5 fa-fw"></i>
                                                      </Button>
                                                      <Typography>{room.adults}</Typography>
                                                      <Button
                                                        disabled={room.adults >= 8}
                                                        variant="link"
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
                                                        disabled={room.children <= 0}
                                                        variant="link"
                                                        onClick={() => handleRoomChange(roomIndex, "children", -1)}
                                                      >
                                                        <i className="bi bi-dash-circle fs-5 fa-fw"></i>
                                                      </Button>
                                                      <Typography>{room.children}</Typography>
                                                      <Button
                                                        disabled={room.children >= 8}
                                                        variant="link"
                                                        onClick={() => handleRoomChange(roomIndex, "children", 1)}
                                                      >
                                                        <i className="bi bi-plus-circle fs-5 fa-fw"></i>
                                                      </Button>
                                                    </div>
                                                  </div>

                                                  {/* Child Ages */}
                                                  <div className="row">
                                                    {room.childrenAges.map((age, childIndex) => (
                                                      <div key={childIndex} className="col-lg-6 col-md-6">
                                                        <label>{`Child ${childIndex + 1} Age`}</label>
                                                        <select
                                                          name={`room${roomIndex}_child${childIndex}_age`}
                                                          {...registerForm4(`room${roomIndex}_child${childIndex}_age`)}
                                                          value={age}
                                                          onChange={(e) =>
                                                            setRoomsState((prev) =>
                                                              prev.map((r, idx) =>
                                                                idx === roomIndex
                                                                  ? {
                                                                      ...r,
                                                                      childrenAges: r.childrenAges.map((a, ci) =>
                                                                        ci === childIndex ? parseInt(e.target.value, 10) : a
                                                                      ),
                                                                    }
                                                                  : r
                                                              )
                                                            )
                                                          }
                                                          className="form-select select-sm"
                                                        >
                                                          {[...Array(10)].map((_, i) => (
                                                            <option key={i} value={i + 1}>
                                                              {i + 1}
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
                            </div>
                          </div>
                        </div>
                      </div>

                      {isLoading ? (
							  
                        <div className="d-flex justify-content-center align-items-center" style={{  height: "50vh" }}>
                          <Image alt="Aforliyah preloader" width={100} height={100} src="/assets/imgs/aforliyah_preloader.gif" />
                        </div>
                        
                      ) : (

                      <div className="box-content-main">
                        <div className="content-right">
                          <div className="box-grid-tours">
                            <div className="row">
                            {Hotels && Hotels?.map((d, k) => { 
                              return (

                                <div key={k} className="col-xl-4 col-lg-6 col-md-6">
                                <div className="card-journey-small background-card"> 
                                  <div className="card-image"> 
                                    <a className="label" href="#"><HotelAwards awards={d.HotelAwards} /></a>
                                    <Link href={`/hotel_detail?id=${d.Id}&session=${sessionid}&adults=${totalguests?.adults}&children=${totalguests?.children}`}>
                                    <Image src={d?.HotelMainImage || "/assets/imgs/hotelimage.gif"} alt="Hotel Image"  layout="intrinsic" width={200} height={200} quality={100} />
                                    
                                      </Link>
                                  </div>
                                  <div className="card-info"> 
                                    <div className="card-rating"> 
                                      <div className="card-left"> </div>
                                      <div className="card-right"> <span className=""></span></div>
                                    </div>
                                    <div className="card-title"><Link href={`/hotel_detail?id=${d.Id}&session=${sessionid}&adults=${totalguests?.adults}&children=${totalguests?.children}`} className="heading-6 neutral-1000">{d.HotelName}</Link></div>
                                    <div className="card-program"> 
                                      <div className="card-location"> 
                                        <p className="text-location text-sm-medium neutral-500">{d.HotelAddress.StreetAddress}, {d.HotelAddress.CityName}, {d.HotelAddress.RegionName}, {d.HotelAddress.ZIP}, {d.HotelAddress.CountryCode}</p>
                                      </div>
                                      <div className="endtime"> 
                                        <div className="card-price"> 
                                          <h6 className="text-md-medium fw-bold neutral-1000">{d.CurrencyCode}{FormatNumberWithComma(d.DailyRatePerRoom)}</h6>
                                          <p className="text-sm-medium neutral-500">/ night</p>
                                        </div>
                                        <div className="card-button"> <Link className="btn btn-gray btn-sm" href={`/hotel_detail?id=${d.Id}&session=${sessionid}&adults=${totalguests?.adults}&children=${totalguests?.children}`}>View Details</Link></div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                            )})}

                              {Hotels && <div className="mx-auto">
                                <Pagination
                                      count={pagination?.TotalPages}
                                      page={page} 
                                      onChange={handlepageChange}
                                      variant="outlined"
                                      color="primary"
                                      shape="rounded"
                                  />
                             </div>}

                             <div className=""></div>  
                              

                            </div>
                          </div>
                        </div>

                        <div className="content-left order-lg-first d-none d-lg-block">
                         
                            <div className="mb-3">
                              <label>Sort resuts by</label>
                              <select className="form-select form-control" value={filter} onChange={handleFilterChange}>
                                  <option value="">Select Sort Option</option>
                                  <option value="cheapest first">Price (Cheapest first)</option>
                                  <option value="highest first">Price (Highest first)</option>
                                  <option value="hotel name">Hotel Name</option>
                              </select>
                            </div>

                            <div className='mb-3'>
                            <label>Hotel Chains</label>
                            <ul className="list-filter-checkbox px-0">
                              {hotelChain && hotelChain.map((item, index) => {
                                // Determine if the current item is in the first 7 or should be in the collapse
                             
                                  return (
                                  <li key={index}>
                                    <label className="cb-container">
                                    <input checked="" onChange={() => handleChainCodeCheckboxChange(item)} type="checkbox" value={item} />
                                    <span className="text-sm-medium">{item}</span>
                                    <span className="checkmark"></span>
                                    </label>
                                   
                                  </li>
                                  );
                                
                                return null; // Return nothing if the item is not to be displayed
                              })}
                              </ul>
                            </div>

                            <div className='mb-3'>
                              <label>Hotel Amenities</label>
                                <ul className="list-filter-checkbox px-0">
                                  {amenities && amenities.map((item, index) => {
                                    // Determine if the current item is in the first 7 or should be in the collapse
                                
                                      return (
                                      <li key={index}>
                                        <label className="cb-container">
                                        <input checked="" onChange={() => handleAmenitiesCheckboxChange(item)} type="checkbox" value={item} />
                                        <span className="text-sm-medium">{item}</span>
                                        <span className="checkmark"></span>
                                        </label>
                                      
                                      </li>
                                      );
                                    
                                    return null; // Return nothing if the item is not to be displayed
                                  })}
                                  </ul>
                            </div>

                        </div>

                      </div>

                      
                     )}
                    </div>
                  </section>

                      <Offcanvas show={searchshow} onHide={handleClose}>
                          <Offcanvas.Header closeButton>
                            <Offcanvas.Title><i className="bx bx-edit"></i> Modify Search</Offcanvas.Title>
                          </Offcanvas.Header>
                          <Offcanvas.Body className="bg-light">
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
                                        initialQuery={Hotels && Hotels[0]?.HotelCityCode}
                                        
                                        
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
                                        value={field.value || params.get('checkin_date')}
                                        onChange={field.onChange}
                                        default_date={params.get('checkin_date') || ""}
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
                                        value={checkout_date <= hoteltwoDaysFromToday ? null :  field.value || params.get('checkout_date')}
                                        onChange={field.onChange}
                                        default_date={params.get('checkout_date') || ""}
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
                                
                                        {roomsState.map((room, roomIndex) => (
                                                <div key={roomIndex} className="card p-2 mb-2">
                                                  <div className="card-header">{`Room ${roomIndex + 1}`}</div>

                                                  {/* Adults */}
                                                  <div className="d-flex justify-content-between align-items-center">
                                                    <Typography>Adults</Typography>
                                                    <div className="hstack gap-1 align-items-center">
                                                      <Button
                                                        disabled={room.adults <= 1}
                                                        variant="link"
                                                        onClick={() => handleRoomChange(roomIndex, "adults", -1)}
                                                      >
                                                        <i className="bi bi-dash-circle fs-5 fa-fw"></i>
                                                      </Button>
                                                      <Typography>{room.adults}</Typography>
                                                      <Button
                                                        disabled={room.adults >= 8}
                                                        variant="link"
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
                                                        disabled={room.children <= 0}
                                                        variant="link"
                                                        onClick={() => handleRoomChange(roomIndex, "children", -1)}
                                                      >
                                                        <i className="bi bi-dash-circle fs-5 fa-fw"></i>
                                                      </Button>
                                                      <Typography>{room.children}</Typography>
                                                      <Button
                                                        disabled={room.children >= 8}
                                                        variant="link"
                                                        onClick={() => handleRoomChange(roomIndex, "children", 1)}
                                                      >
                                                        <i className="bi bi-plus-circle fs-5 fa-fw"></i>
                                                      </Button>
                                                    </div>
                                                  </div>

                                                  {/* Child Ages */}
                                                  <div className="row">
                                                    {room.childrenAges.map((age, childIndex) => (
                                                      <div key={childIndex} className="col-lg-6 col-md-6">
                                                        <label>{`Child ${childIndex + 1} Age`}</label>
                                                        <select
                                                          name={`room${roomIndex}_child${childIndex}_age`}
                                                          {...registerForm4(`room${roomIndex}_child${childIndex}_age`)}
                                                          value={age}
                                                          onChange={(e) =>
                                                            setRoomsState((prev) =>
                                                              prev.map((r, idx) =>
                                                                idx === roomIndex
                                                                  ? {
                                                                      ...r,
                                                                      childrenAges: r.childrenAges.map((a, ci) =>
                                                                        ci === childIndex ? parseInt(e.target.value, 10) : a
                                                                      ),
                                                                    }
                                                                  : r
                                                              )
                                                            )
                                                          }
                                                          className="form-select select-sm"
                                                        >
                                                          {[...Array(10)].map((_, i) => (
                                                            <option key={i} value={i + 1}>
                                                              {i + 1}
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
                          </Offcanvas.Body>
                      </Offcanvas>

                      <Offcanvas show={filtershow} onHide={handleFilterClose}>
                          <Offcanvas.Header closeButton>
                            <Offcanvas.Title><i className="bx bx-edit"></i> Filter Search</Offcanvas.Title>
                          </Offcanvas.Header>
                          <Offcanvas.Body className="bg-light">
                              <div className="mb-3">
                                <label>Sort results by</label>
                                <select value={filter} onChange={handleFilterChange} className="form-select form-control">
                                    <option value="">Select Sort Option</option>
                                    <option value="cheapest first">Price (Cheapest first)</option>
                                    <option value="highest first">Price (Highest first)</option>
                                    <option value="hotel name">Hotel Name</option>
                                </select>
                              </div>

                              <div className='mb-3'>
                              <label>Hotel Chains</label>
                              <ul className="list-filter-checkbox px-0">
                                {hotelChain && hotelChain.map((item, index) => {
                                  // Determine if the current item is in the first 7 or should be in the collapse
                              
                                    return (
                                    <li key={index}>
                                      <label className="cb-container">
                                      <input checked={selectedChain.includes(item)} onChange={() => handleChainCodeCheckboxChange(item)} type="checkbox" value={item} />
                                      <span className="text-sm-medium">{item}</span>
                                      <span className="checkmark"></span>
                                      </label>
                                    
                                    </li>
                                    );
                                  
                                  return null; // Return nothing if the item is not to be displayed
                                })}
                                </ul>
                              </div>

                              <div className='mb-3'>
                              <label>Hotel Amenities</label>
                                <ul className="list-filter-checkbox px-0">
                                  {amenities && amenities.map((item, index) => {
                                    // Determine if the current item is in the first 7 or should be in the collapse
                                   
                                      return (
                                      <li key={index}>
                                        <label className="cb-container">
                                        <input checked={selectedAmenities.includes(item)} onChange={() => handleAmenitiesCheckboxChange(item)} type="checkbox" value={item} />
                                        <span className="text-sm-medium">{item}</span>
                                        <span className="checkmark"></span>
                                        </label>
                                      
                                      </li>
                                      );
                                    
                                    return null; // Return nothing if the item is not to be displayed
                                  })}
                                  </ul>
                            </div>
                          </Offcanvas.Body>
                      </Offcanvas>

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