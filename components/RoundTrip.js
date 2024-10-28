'use client'
import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const RoundTripForm = () => (
  <Form name="round_trip" id="round_trip">
    <Row className="g-4">
      {/* From */}
      <Col md={6}>
        <Form.Group className="form-floating mb-3">
          <Form.Control type="text" id="floatingInput" placeholder="Flying From" />
          <Form.Label htmlFor="floatingInput">
            <i className='bx bxs-plane-take-off'></i> Flying From
          </Form.Label>
        </Form.Group>
      </Col>
      {/* Add other form fields as needed */}
    </Row>
  </Form>
);

export default RoundTripForm;
