// components/FareCalendarCollapse.js
import React from 'react';
import Router, { useRouter,usePathname } from 'next/navigation'

const FareCalendarCollapse = ({ fareCalendar }) => {
    const router = useRouter();
    const departureDates = Object.keys(fareCalendar).sort();

	// Collect all unique arrival dates (X axis)
	const arrivalDatesSet = new Set();
	departureDates.forEach((dep) => {
	  Object.keys(fareCalendar[dep]).forEach((arr) => {
		arrivalDatesSet.add(arr);
	  });
	});
	const arrivalDates = Array.from(arrivalDatesSet).sort();

    const handleFareClick = (cell) => {
        //console.log(`Clicked fare: ${cell.fare}, ${cell.cabin}, ${cell.adult}, ${cell.infant}, ${cell.children} from ${cell.departure_key} to ${cell.arrival_key}`);
        // TODO: Add additional logic here, like opening a modal with more details.
        //console.log(cell);
        router.push(`/flight_list?departure=${cell.departure}&arrival=${cell.arrival}&request_type=${cell.request_type}&cabin=${cell.cabin}&adult=${cell.adult}&infant=${cell.infant}&children=${cell.children}&departure_date=${cell.departure_key}&arrival_date=${cell.arrival_key}`);
    };

  return (
    <>
      <button
        className="btn btn-primary rounded-4 btn-sm"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#fareCalendarCollapse"
        aria-expanded="false"
        aria-controls="fareCalendarCollapse"
      >
        Toggle Fare Calendar
      </button>

      <div className="collapse mt-3" id="fareCalendarCollapse">
        <div className="card card-body">
          {/* Replace the content below with your fare calendar table/component */}
            <h5>Fare Calendar</h5>
            <div className="table-responsive">
                <table className="table table-striped table-bordered text-center">
                    <thead className="bg-dark">
                        <tr>
                            <th scope="col"></th>
                            {arrivalDates.map((arrival) => (
                                <td style={{ whiteSpace: "nowrap" }} key={arrival}>{arrival}</td>
                            ))}
                        </tr>
                    </thead>
                    <tbody> 
                        {departureDates.map((departure) => (
                            <tr key={departure}>
                                <td style={{ whiteSpace: "nowrap"  }}>{departure}</td>
                                {arrivalDates.map((arrival) => {
                                const cell = fareCalendar[departure][arrival];
                                return (
                                    <td key={`${departure}-${arrival}`} style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                                        { cell && cell.fare ? (
                                            <a onClick={() => handleFareClick(cell)} style={{ cursor:'pointer' }} className="">
                                                {cell.fare}
                                            </a>
                                            ) : (
                                            'N/A'
                                        )
                                        }
                                    </td>
                                );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </>
  );
};

export default FareCalendarCollapse;
