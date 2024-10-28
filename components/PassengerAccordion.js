import React, { useState } from 'react';
import { Accordion, Card, Button } from 'react-bootstrap';
import Typography from '@mui/material/Typography';
import 'bootstrap-icons/font/bootstrap-icons.css';

function PassengerAccordion() {
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);

  const handleAdultsChange = (change) => {
    if (adults + change >= 1) {
      setAdults(adults + change);
    }
  };

  const handleChildrenChange = (change) => {
    if (children + change >= 0) {
      setChildren(children + change);
    }
  };

  const handleInfantsChange = (change) => {
    if (infants + change >= 0) {
      setInfants(infants + change);
    }
  };

  return (
    <Accordion defaultActiveKey="0">
      <Card className="p-2 shadow border-0">
        <Accordion.Toggle as={Card.Header} eventKey="0" className="mb-2">
          <i className="bi bi-people fs-5 fa-fw"></i> Passengers ({`${adults} Adult${adults > 1 ? 's' : ''} ${children} Child${children > 1 ? 'ren' : ''} ${infants} Infant${infants > 1 ? 's' : ''}`})
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="0">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <Typography variant="h6">Adults</Typography>
              </div>
              <div className="hstack gap-2 align-items-center">
                <Button variant="link" className="p-0 mb-0" onClick={() => handleAdultsChange(-1)}>
                  <i className="bi bi-dash-circle fs-5 fa-fw"></i>
                </Button>
                <Typography variant="h6">{adults}</Typography>
                <Button variant="link" className="p-0 mb-0" onClick={() => handleAdultsChange(1)}>
                  <i className="bi bi-plus-circle fs-5 fa-fw"></i>
                </Button>
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center">
              <div>
                <Typography variant="h6">Children</Typography>
              </div>
              <div className="hstack gap-2 align-items-center">
                <Button variant="link" className="p-0 mb-0" onClick={() => handleChildrenChange(-1)}>
                  <i className="bi bi-dash-circle fs-5 fa-fw"></i>
                </Button>
                <Typography variant="h6">{children}</Typography>
                <Button variant="link" className="p-0 mb-0" onClick={() => handleChildrenChange(1)}>
                  <i className="bi bi-plus-circle fs-5 fa-fw"></i>
                </Button>
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center">
              <div>
                <Typography variant="h6">Infants</Typography>
              </div>
              <div className="hstack gap-2 align-items-center">
                <Button variant="link" className="p-0 mb-0" onClick={() => handleInfantsChange(-1)}>
                  <i className="bi bi-dash-circle fs-5 fa-fw"></i>
                </Button>
                <Typography variant="h6">{infants}</Typography>
                <Button variant="link" className="p-0 mb-0" onClick={() => handleInfantsChange(1)}>
                  <i className="bi bi-plus-circle fs-5 fa-fw"></i>
                </Button>
              </div>
            </div>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
}

export default PassengerAccordion;
