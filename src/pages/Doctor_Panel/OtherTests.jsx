import React, { useState, useEffect } from "react";
import { Row, Col, Form, Container, Card } from "react-bootstrap";
import PageBreadcrumb from "../../componets/PageBreadcrumb";
import { useLocation } from "react-router-dom";

const BASE_URL = "http://192.168.90.146:5000/api"; // Update with your backend API base URL

export default function OtherTests() {
  const location = useLocation();
  const { state } = location; // Access the state passed by the previous page
  console.log(state);
  const [formData, setFormData] = useState({
    test_date: "",
    test_type: "",
    ref_doctor: "",
    fee_status: "",
    visit_type: "",
    test_comment: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    const requiredFields = [
      "test_date",
      "test_type",
      "ref_doctor",
      "fee_status",
      "visit_type",
      "test_comment",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = `${field.replace(/([A-Z])/g, " $1")} is required`;
      }
    });

    return newErrors;
  };

  const handleSubmit = async (saveType) => {
    const validationErrors = validate();
    console.log("Form Data:", formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await fetch(
          `${BASE_URL}/V1/patienttabs/otherTests/${state.patient.patient_id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...formData, saveType }),
          }
        );

        console.log("Response received:", response);

        if (response.ok) {
          alert("Appointment added successfully");

          setFormData({
            // date: new Date().toISOString().split("T")[0],
            test_date: state?.test_date || "",
            test_type: state?.test_type || "",
            ref_doctor: state?.ref_doctor || "",
            fee_status: state?.fee_status || "",
            visit_type: state?.visit_type || "",
            test_comment: state?.test_comment || "",
          });
        } else {
          const errorData = await response.json();
          console.error("Error response from API:", errorData);
          alert("Failed to add appointment");
        }
      } catch (error) {
        console.error("Error adding appointment:", error);
        alert("An error occurred while adding the appointment");
      }
    }
  };

  useEffect(() => {
    if (state?.patient) {
      setLoading(true); // Start loading
      fetch(`${BASE_URL}/V1/patienttabs/otherTests/${state.patient.patient_id}`)
        .then((response) => response.json())
        .then((data) => {
          console.log("API Response:", data); // Log the API response
          if (data?.data) {
            // Check if data exists
            // Prefill the form with the fetched data
            setFormData({
              test_date: data.data.test_date || "", // Ensure this is correctly populated
              test_type: data.data.test_type || "",
              ref_doctor: data.data.ref_doctor || "",
              fee_status: data.data.fee_status || "",
              visit_type: data.data.visit_type || "",
              test_comment: data.data.test_comment || "",
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        })
        .finally(() => setLoading(false)); // Stop loading
    }
  }, [state?.patient]); // Depend on the patient data to refetch when needed

  return (
    <div
      className="themebody-wrap"
      style={{
        background: "linear-gradient(to right, #e0f7fa, #80deea)",
        minHeight: "100vh",
        padding: "20px",
        fontFamily: "'Poppins', Arial, sans-serif",
      }}
    >
      <PageBreadcrumb pagename="Other Tests" />
      <Container fluid>
        <Row>
          <Col>
            <Card
              style={{
                borderRadius: "12px",
                boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
                borderColor: "#00bcd4",
                background: "white",
                border: "1px solid #00bcd4",
              }}
            >
              <Card.Body>
                <Form>
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ marginTop: "30px" }}
                    onClick={() => handleSubmit("save")}
                  >
                    New Record
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ marginTop: "30px", float: "right" }}
                    onClick={() => handleSubmit("previous")}
                  >
                    Previous Records
                  </button>
                  <br />
                  <br />
                  <Row>
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Date</Form.Label>
                        <Form.Control
                          type="date"
                          name="test_date"
                          value={formData.test_date}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Test Type</Form.Label>
                        <Form.Select
                          name="test_type"
                          value={formData.test_type || ""} // Ensure value is never undefined
                          onChange={handleInputChange}
                        >
                          <option value="">Select Test Type</option>
                          <option value="Test 1">Test 1</option>
                          <option value="Test 2">Test 2</option>
                        </Form.Select>
                        {errors.test_type && (
                          <small className="text-danger">
                            {errors.test_type}
                          </small> // Display validation errors
                        )}
                      </Form.Group>
                    </Col>

                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Ref. Doctor Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="ref_doctor"
                          value={formData.ref_doctor}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Test Fee</Form.Label>
                        <Form.Select
                          name="fee_status"
                          value={formData.fee_status}
                          onChange={handleInputChange}
                        >
                          <option value="">SELECT FEE STATUS</option>
                          <option value="YES">YES</option>
                          <option value="NO">NO</option>
                          <option value="DUE">DUE</option>
                          <option value="DNC">DNC</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Visit Type</Form.Label>
                        <Form.Select
                          name="visit_type"
                          value={formData.visit_type}
                          onChange={handleInputChange}
                        >
                          <option value="">SELECT VISIT TYPE</option>
                          <option value="OPD">OPD</option>
                          <option value="IPD">IPD</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Row>
                      <Col md={6} className="mb-4">
                        <Form.Group className="mb-3">
                          <Form.Label>Comment</Form.Label>
                          <Form.Control
                            as="textarea"
                            name="test_comment"
                            value={formData.test_comment}
                            onChange={handleInputChange}
                            placeholder="Enter Comments"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ marginTop: "30px" }}
                      onClick={() => handleSubmit("save")}
                    >
                      Submit
                    </button>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
