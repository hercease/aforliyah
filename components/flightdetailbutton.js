import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AppBar,Accordion,AccordionSummary,AccordionDetails,Button, Tabs, Tab, Tab as MaterialTab, Tabs as MaterialTabs } from '@mui/material';

const FlightComponent = ({ flightId, flightsession, adult, numchildren, infant }) => {
	
    const router = useRouter();

    // Prefetch the flight detail page
    useEffect(() => {
        // Construct the URL with parameters
        const prefetchUrl = `/flight_detail?id=${flightId}&session=${flightsession}&adult=${adult}&children=${numchildren}&infant=${infant}`;
        
        // Prefetch the page with parameters in the background
        router.prefetch(prefetchUrl);
    }, [router, flightId, flightsession, adult, numchildren, infant]);

    const gotoFlightdetail = (id) => {
        // Navigate to the next page with parameters
        router.push(`/flight_detail?id=${id}&session=${flightsession}&adult=${adult}&children=${numchildren}&infant=${infant}`);
    };

    return (
		<Button className='w-100' size="small" color="error" variant="outlined" onClick={() => gotoFlightdetail(flightId)}>Book Now</Button>
    );
};

export default FlightComponent;
