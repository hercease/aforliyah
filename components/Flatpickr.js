import React, {  useState,useEffect, useRef, forwardRef } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Form, InputGroup } from 'react-bootstrap';

const DatePicker = forwardRef(({ placeholder, minDate, value, onChange, default_date }, ref) => {
  const datepickerRef = useRef(null);
  const [check, setCheck] = useState(true);

  useEffect(() => {
    const fp = flatpickr(datepickerRef.current, {
      minDate: minDate, // Set minimum date to today
      dateFormat: 'Y-m-d',
      disableMobile: true,
      defaultDate: value,
	  enableTime: false,  // Disable time to avoid timezone shifts
      onChange: (selectedDates) => {
        if (onChange) {
			const selectedDate = selectedDates[0];
			if (selectedDate) {
				const localDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000);
				const formattedDate = localDate.toISOString().split('T')[0];
				onChange(formattedDate);
			}
        }
      },
    });
	
	  // Manually trigger the onChange event if default_date is provided
	if (default_date !="" && check){
      const formattedDate = default_date instanceof Date ? default_date.toISOString().split('T')[0] : default_date;
      onChange(formattedDate);
	  //console.log(formattedDate);
	  setCheck(false);
    }


    return () => fp.destroy(); // Clean up Flatpickr instance on component unmount
  }, [minDate, value, onChange, check, default_date]);

  return (
    <InputGroup className="bg-white">
      <InputGroup.Text className="bg-white">
        <i className="bx bxs-calendar bx-sm"></i>
      </InputGroup.Text>
      <Form.Control
        name="departure_date"
        type="text"
        ref={datepickerRef}
        className="custom-input border"
        placeholder={placeholder}
        aria-label="Departing Date"
        defaultValue={value}
        onChange={(e) =>{ setCheck(false); onChange(e.target.value)}}
      />
    </InputGroup>
  );
});

DatePicker.displayName = 'DatePicker';

export default DatePicker;
