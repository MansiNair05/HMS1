import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Spinner } from "react-bootstrap";
import PageBreadcrumb from "../components/PageBreadcrumb";

const BASE_URL = "http://192.168.1.139:5000/api";

const Add_Enquiry = () => {
  const [formData, setFormData] = useState ({
    date: "",
    doctorName: "",
    enquirytype: "",
    patient_name: "",
    patient_phone: "",
    patient_location: "",
    reference: "",
    FDE_Name: "",
    note: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    const requiredFields = [
        "date",
        "doctorName",
        "enquirytype",
        "patient_name",
        "patient_phone",
        "patient_location",
        "reference",
        "FDE_Name",
        "note",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = `${field.replace(/([A-Z])/g, " $1")} is required`;
      }
    });

    const phoneRegex = /^[0-9]{10}$/;
    if (formData.patient_phone && !phoneRegex.test(formData.patient_phone)) {
      newErrors.patient_phone = "Mobile number must be 10 digits";
    }
    
    return newErrors;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validate();
    console.log(formData);
    setErrors(validationErrors);
  
    if (Object.keys(validationErrors).length === 0) {
      setLoading(true); // Set loading to true when submitting

      try {
        const response = await fetch(`${BASE_URL}/V1/enquiry/addEnquiry`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          alert("Enquiry added successfully!");
          setFormData({});
        } else {
          console.error("Error adding enquiry:", data.message || "Unknown error");
          alert(data.message || "Error adding enquiry. Please try again.");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("Error submitting form. Please check your network and try again.");
      } finally {
        setLoading(false); // Reset loading state
      }
    }
  };

  return (
    <div className="themebody-wrap">
      <PageBreadcrumb pagename="Add Enquiry" />

      <div className="theme-body">
        <Container fluid>
          <Row>
            <Col>
              <Card>
                <Card.Body>
                  <Form onSubmit={handleSubmit}>
                    {/* Date Input */}
                    <Form.Group controlId="date">
                      <Form.Label>Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                      />
                                              {errors.dateName && (
                          <p style={{ color: "red" }}>{errors.date}</p>
                        )}
                    </Form.Group>

                    {/* Doctor Name */}
                    <Form.Group controlId="doctorName">
                      <Form.Label>Doctor Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="doctorName"
                        value={formData.doctorName}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>

                    {/* Enquiry Type */}
                    <Form.Group controlId="enquirytype">
                      <Form.Label>Enquiry Type</Form.Label>
                      <Form.Control
                        as="select"
                        name="enquirytype"
                        value={formData.enquirytype}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Enquiry Type</option>
                        {[
                          "Call for Refund Amount",
                          "Wrong Enquiry or Spam Call",
                          "Enquiry for Test Charges",
                          "Accounts Department",
                          "Call for Another Branches",
                          "Call for IPD Doctors",
                          "Call for Assistant Doctors",
                          "Call Regarding Job Vacancy",
                          "Appointment Consultation",
                          "Online Consultation",
                          "SX Cost Enquiry",
                          "Call for Lab Test Enquiry",
                          "Medicines Availability at Pharmacy",
                          "Patient is Coming Late for Appointment",
                          "Insurance Related Queries",
                        ].map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>

                    {/* Patient Name */}
                    <Form.Group controlId="patient_name">
                      <Form.Label>Patient Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="patient_name"
                        value={formData.patient_name}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>

                    {/* Mobile Number */}
                    <Form.Group controlId="patient_phone">
                      <Form.Label>Mobile Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="patient_phone"
                        value={formData.patient_phone}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>

                    {/* Address */}
                    <Form.Group controlId="patient_location">
                      <Form.Label>Address</Form.Label>
                      <Form.Control
                        type="text"
                        name="patient_location"
                        value={formData.patient_location}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>

                    {/* Reference */}
                    <Form.Group controlId="reference">
                      <Form.Label>Reference</Form.Label>
                      <Form.Control
                        as="select"
                        name="reference"
                        value={formData.reference}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Reference</option>
                        {[
                          "Newspaper",
                          "Doctor Reference",
                          "Internet",
                          "Entertainment Media",
                          "TV Show",
                          "Patient Reference",
                          "Other",
                          "HHC Board",
                          "HHF",
                          "Word of Mouth",
                        ].map((ref) => (
                          <option key={ref} value={ref}>
                            {ref}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>

                    {/* FDE Name */}
                    <Form.Group controlId="FDE_Name">
                      <Form.Label>FDE Name</Form.Label>
                      <Form.Control
                        as="select"
                        name="FDE_Name"
                        value={formData.FDE_Name}
                        onChange={handleInputChange}
                      >
                        <option value="">Select FDE Name</option>
                        {[
                          "Akshay",
                          "Ashutosh",
                          "Dattatray",
                          "Noshin",
                          "Princy",
                          "Samira",
                          "Vishaka",
                          "Zeba",
                          "Walk-In",
                          "Heena",
                          "Purvi Shinde",
                          "Mahima",
                          "Pratiksha",
                          "Jishnu",
                          "Shweta Chavan",
                          "Hurmaan",
                          "Priya Dhiwar",
                          "Diksha Jha",
                          "Shraddha",
                          "Sagar Satish Deshpande",
                          "Supriya Thorat",
                          "Diksha",
                          "Josephine",
                          "Chhaya Keer",
                          "Aasiya",
                          "Bhavana",
                          "Joel",
                          "Rohini",
                          "Aditi",
                          "Samruddhi",
                          "Sofiya",
                          "Sakshi",
                          "Hritik",
                          "Priyanshu",
                          "Saurav",
                          "Gracy",
                          "Neelam",
                          "Shreya",
                          "Vaishnavi",
                          "Shruti",
                          "Samruddhi K",
                        ].map((name) => (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>

                    {/* Note */}
                    <Form.Group controlId="note">
                      <Form.Label>Note</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="note"
                        rows={3}
                        value={formData.note}
                        onChange={handleInputChange}
                      />
                    </Form.Group>

                    {/* Submit Button */}
                    <Button variant="primary" type="submit" disabled={loading}>
                      {loading ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />
                          {" Adding Enquiry..."}
                        </>
                      ) : (
                        "Add Enquiry"
                      )}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Add_Enquiry;
