import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { InputGroup } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import TypeaheadWithRef from './TypeaheadWithRef';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';

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


	   const fetchData = useCallback((query) => {
		fetch(`${fetchUrl}&q=${query}`)
		  .then((response) => response.json())
		  .then((data) => {
			const formattedOptions = data.map((item) => ({
			  code: item.code.trim(),
			  city_fullname: item.city_fullname.trim(),
			  name: item.name ? item.name.trim() : '',
			}));
			setOptions(formattedOptions);
			
			 // Automatically select the first option if initialQuery is used
			if(initialQuery != ""){
				if (!initialQueryUsed && formattedOptions.length > 0) {
				  const firstOption = [formattedOptions[0]];
				  setSelected(firstOption);
				  if (onCodeSelect) {
					onCodeSelect(firstOption[0].code);
				  }
				  setInitialQueryUsed(true); // Mark initial query as used
				}
		  }

		  });
	  }, [fetchUrl, initialQueryUsed, initialQuery, onCodeSelect]);

	useEffect(() => {
		if (initialQuery && !initialQueryUsed){
			fetchData(initialQuery);
		}
	}, [initialQuery, fetchData, initialQueryUsed]);
  
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
           labelKey={(option) =>
	`${option.code.trim()} - ${option.city_fullname.trim()}${option.name ? ` (${option.name.trim()})` : ''}`
		  }
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
              <strong>{option.code}</strong> - {option.city_fullname}{" "}
              {option.name && <small>({option.name})</small>}
            </div>
          )}
        />
      </InputGroup>
	  {error && <div className="text-danger mt-1"><ErrorOutlineRoundedIcon fontSize="small" /> {error.message}</div>}
    </>
  );
};

export default CustomTypeahead;