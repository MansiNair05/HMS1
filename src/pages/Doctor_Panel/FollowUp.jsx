import React, { useState, useEffect } from "react";
import { Row, Col, Form, Container, Card } from "react-bootstrap";
import PageBreadcrumb from "../../componets/PageBreadcrumb";
import { useLocation } from "react-router-dom"; // Import useLocation

const BASE_URL = "http://192.168.90.146:5000/api"; // Update with your backend API base URL

export default function FollowUp() {
    const location = useLocation();
  const { state } = location;
  const [formData, setFormData] = useState({
    uidNo: "",
    patientName: "",
    age: "",
    mobileNo: "",
    address: "",
    occupation: "",
    email: "",
    reference: "",
    diagnosis: "",
    advice: "",
    plan: "",
    present_complaints: "",
    firstVisitDate: "",
    followUpVisitNo: "",
  });

  const [errors, setErrors] = useState({});

const handleInputChange = (e) => {
  const { name, value, type, checked } = e.target;
  setFormData((prevState) => ({
    ...prevState,
    [name]: type === "checkbox" ? checked : value,
    ...(name === "uidNo" ? { [name]: value.toUpperCase() } : {}), // Apply toUpperCase only for specific fields
  }));
};

  const validate = () => {
    const newErrors = {};
    const requiredFields = [
      "uidNo",
      "patientName",
      "age",
      "mobileNo",
      "address",
      "occupation",
      "emailId",
      "referredBy",
      "diagnosis",
      "advice",
      "plan",
      "present_complaints",
      "firstVisitDate",
      "followUpVisiNo",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = `${field.replace(/([A-Z])/g, " $1")} is required`;
      }
    });

    const phoneRegex = /^[0-9]{10}$/;
    if (formData.mobileNo && !phoneRegex.test(formData.mobileNo)) {
      newErrors.mobileNo = "Mobile number must be 10 digits";
    }

    return newErrors;
  };

  const handleSubmit = async (saveType) => {
 const validationErrors = validate();
 setErrors(validationErrors);

 if (Object.keys(validationErrors).length === 0) {
   try {
     const response = await fetch(`${BASE_URL}/V1/patients/followUp`, {
       method: "PUT",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ ...formData, saveType }),
     });

     if (response.ok) {
       alert("Appointment added successfully");

       setFormData({
         date: new Date().toISOString().split("T")[0],
         uidNo: "",
         patientName: "",
         age: "",
         mobileNo: "",
         address: "",
         occupation: "",
         emailId: "",
         referredBy: "",
         diagnosis: "",
         advice: "",
         plan: "",
         present_complaints: "",
         firstVisitDate: "",
         followUpVisiNo: "",
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
      setFormData((prevData) => ({
        ...prevData,
        ...state.patient, // Fill formData with patient details
      }));
    }
  }, [state]);

const fetchData = async () => {
  try {
    const response = await fetch(`${BASE_URL}/V1/patients/followUp`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log("API Response:", data); // Log the API response

    // Update formData with appropriate keys from the API response
    setFormData((prev) => ({
      ...prev,
      uidNo: data.uidNo, // Ensure this matches the API response key
    }));
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}


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
      <PageBreadcrumb pagename="Follow Up" />
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
                  {" "}
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ marginTop: "30px", float: "right" }}
                    onClick={() => handleSubmit("save")}
                  >
                    Print
                  </button><br /><br /><br /><br />
                  <Row>
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>UID No.</Form.Label>
                        <Form.Control
                          type="number"
                          name="uidNo"
                          value={formData.uidNo}
                          readOnly
                          style={{
                            backgroundColor: "#e9ecef", // Light grey background to indicate read-only
                            color: "#6c757d", // Grey text color
                            cursor: "not-allowed", // Show "not-allowed" cursor
                          }}
                        />
                      </Form.Group>
                    </Col>

                    {/* Patient Name Input */}
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Patient Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="patientName"
                          value={formData.patientName}
                          readOnly
                          style={{
                            backgroundColor: "#e9ecef", // Light grey background to indicate read-only
                            color: "#6c757d", // Grey text color
                            cursor: "not-allowed", // Show "not-allowed" cursor
                          }}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Age</Form.Label>
                        <Form.Control
                          type="age"
                          name="age"
                          value={formData.age}
                          readOnly
                          style={{
                            backgroundColor: "#e9ecef", // Light grey background to indicate read-only
                            color: "#6c757d", // Grey text color
                            cursor: "not-allowed", // Show "not-allowed" cursor
                          }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    {/* Mobile No */}
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Mobile No</Form.Label>
                        <Form.Control
                          type="number"
                          name="mobileNo"
                          value={formData.mobileNo}
                          placeholder="Enter Mobile Number"
                          readOnly
                          style={{
                            backgroundColor: "#e9ecef", // Light grey background to indicate read-only
                            color: "#6c757d", // Grey text color
                            cursor: "not-allowed", // Show "not-allowed" cursor
                          }}
                        />
                      </Form.Group>
                    </Col>

                    {/* Address */}
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                          type="text"
                          name="address"
                          value={formData.address}
                          placeholder="Enter Address"
                          readOnly
                          style={{
                            backgroundColor: "#e9ecef", // Light grey background to indicate read-only
                            color: "#6c757d", // Grey text color
                            cursor: "not-allowed", // Show "not-allowed" cursor
                          }}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Occupation</Form.Label>
                        <Form.Control
                          type="text"
                          name="occupation"
                          value={formData.occupation}
                          readOnly
                          style={{
                            backgroundColor: "#e9ecef", // Light grey background to indicate read-only
                            color: "#6c757d", // Grey text color
                            cursor: "not-allowed", // Show "not-allowed" cursor
                          }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Email Id</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          placeholder="Enter Email"
                          readOnly
                          style={{
                            backgroundColor: "#e9ecef", // Light grey background to indicate read-only
                            color: "#6c757d", // Grey text color
                            cursor: "not-allowed", // Show "not-allowed" cursor
                          }}
                        />
                        {errors.email && (
                          <p style={{ color: "red" }}>{errors.email}</p>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Referred By</Form.Label>
                        <Form.Control
                          value={formData.referredBy}
                          readOnly
                          style={{
                            backgroundColor: "#e9ecef", // Light grey background to indicate read-only
                            color: "#6c757d", // Grey text color
                            cursor: "not-allowed", // Show "not-allowed" cursor
                          }}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Diagnosis</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="diagnosis"
                          value={formData.diagnosis}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Advice</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="advice"
                          value={formData.advice}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                    {/* Gender */}
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Plan</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="plan"
                          value={formData.plan}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Present Complaints</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="present_complaints"
                          value={formData.present_complaints}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>First Visit Date</Form.Label>
                        <Form.Control
                          type="date"
                          name="firstVisitDate"
                          value={formData.firstVisitDate}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Follow Up Visit No</Form.Label>
                        <Form.Control
                          type="number"
                          name="followUpVisitNo"
                          value={formData.followUpVisitNo}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ marginTop: "30px", marginright: "10px" }}
                    onClick={() => handleSubmit("save")}
                  >
                    Submit
                  </button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
