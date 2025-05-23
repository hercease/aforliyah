import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { InputGroup } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import TypeaheadWithRef from './TypeaheadWithRef';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import airports from "./airports"; // Import the data

const CustomTypeahead = ({
  id,
  placeholder,
  name,
  icon,
  fetchUrl,
  height = '10px',
  onCodeSelect,
  control, 
  rules, 
  error,
  initialQuery,
}) => {
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState([]);
  const [initialQueryUsed, setInitialQueryUsed] = useState(false);


  /*const fetchData = useCallback((query) => {
    fetch(`${process.env.NEXT_PUBLIC_HOST}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        search: query,
        request_type: 'search_airports'
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const formattedOptions = data.map((item) => ({
          code: item.iata.trim(),
          city: item.city.trim(),
          name: item.name.trim(),
          country: item.country.trim(),
        }));
  
        setOptions(formattedOptions);
  

        if(initialQuery != ""){
          if (!initialQueryUsed && formattedOptions.length > 0) {
            console.log(formattedOptions);
            //const firstOption = formattedOptions.find((item) => item.code === initialQuery);
            const firstOption = [formattedOptions[0]];
            setSelected(firstOption);
            if (onCodeSelect) {
              onCodeSelect(firstOption[0]?.code);
            }
            setInitialQueryUsed(true); // Mark initial query as used
          }
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        setOptions([]);
      });
  }, [initialQueryUsed, initialQuery, onCodeSelect]);*/

  
  const fetchData = useCallback((query) => {
    // Filter airports based on user query
    const filteredAirports = airports.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.city.toLowerCase().includes(query.toLowerCase()) ||
      item.iata.toLowerCase().includes(query.toLowerCase())
    );

    // Format options
    const formattedOptions = filteredAirports.map((item) => ({
      code: item.iata.trim(),
      city: item.city.trim(),
      name: item.name.trim(),
      country: item.country.trim(),
    }));

    setOptions(formattedOptions);

    if (initialQuery !== "") {
      if (!initialQueryUsed && formattedOptions.length > 0) {
        console.log(formattedOptions);
        const matchedOption = formattedOptions.find(option => 
          option.code.toLowerCase() === initialQuery.trim().toLowerCase()
        );
    
        // Use matched option if found, otherwise fall back to first option
        const selectedOption = matchedOption ? [matchedOption] : [formattedOptions[0]];
        setSelected(selectedOption);
        if (onCodeSelect) {
          onCodeSelect(selectedOption[0]?.code);
        }
        setInitialQueryUsed(true);
      }
    }
  }, [initialQueryUsed, initialQuery, onCodeSelect]);


	useEffect(() => {
		if (initialQuery && !initialQueryUsed){
			fetchData(initialQuery);
		}
	}, [initialQuery, fetchData, initialQueryUsed]);
  
  console.log(selected);
  return (
    <>
	 <style>{`
        .custom-typeahead .dropdown-menu {
          background-color: #FFFFFF;
          border-radius: 2px;
          box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
          padding: 0.5rem;
		  margin-left: -10px !important;
		  width: 270px !important;
		  padding: 0px 0px !important;
		  font-size: 14px
        }
		
		

        .custom-typeahead .rbt-menu .dropdown-item {
          padding: 0.5rem 1rem;
          font-size: 14px;
          color: #343a40;
          border-bottom: 1px solid #e9ecef;
          transition: background-color 0.2s ease;
		  white-space: nowrap; /* Prevent wrapping */
			overflow: hidden; /* Hide overflow */
			text-overflow: ellipsis !important; /* Use ellipsis for overflow */

        }
	
        .custom-typeahead .rbt-menu .dropdown-item:last-child {
          border-bottom: none;
        }
		
		.custom-typeahead-item {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

        .custom-typeahead .rbt-menu .dropdown-item:hover {
          background-color: #e2e6ea;
          color: #007bff;
        }

        .custom-typeahead .rbt-menu .dropdown-item strong {
          color: #007bff;
        }
      `}</style>

      

      <InputGroup className="bg-white">
        {icon && (
          <InputGroup.Text className="bg-white">
            <i className={icon}></i>
          </InputGroup.Text>
        )}
        <TypeaheadWithRef
          id={id}
          labelKey={(option) => `${option.code.trim()} - ${option.city.trim()}${option.name ? ` (${option.name.trim()})` : ''} ${option.country.trim()}`}
          options={options}
          onInputChange={(text) => {
            setInitialQueryUsed(true); // Mark as used once the user types
            fetchData(text);
          }}

          onChange={(selected) => {
            setSelected(selected);
            if (selected.length > 0) {
              const code = selected[0].code;
              console.log(code);
              if (onCodeSelect) {
                onCodeSelect(code);
              }
            }
			  }
			}
          selected={selected}
          placeholder={placeholder}
		  className={`border custom-typeahead from-control custom-input ${error ? 'is-invalid' : ''}`}
          name={name}
		  
      renderMenuItemChildren={(option, props) => (
        <div className="custom-typeahead-item">
          <strong>{option.code}</strong> - {option.city}{" "}
          {option.name && <small>({option.name})</small>} {option.country}
        </div>
      )}
        />
      </InputGroup>
	  {error && <div className="text-danger mt-1"><ErrorOutlineRoundedIcon fontSize="small" /> {error.message}</div>}
    </>
  );
};

export default CustomTypeahead;
