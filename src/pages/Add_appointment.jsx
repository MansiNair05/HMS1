import React, { useState } from "react";
import { Row, Col, Form, Container, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { CountryDropdown, StateDropdown, CityDropdown } from "react-country-state-dropdown";
import PageBreadcrumb from "../components/PageBreadcrumb";

export default function Add_appointment() {
  const [Appointmentdata, setAppointmentdata] = useState({});
  const [country, setCountry] = useState(null);
  const [state, setState] = useState(null);
  const [city, setCity] = useState(null);
  const [doctor, setDoctor] = useState("");
  const [fde, setFde] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    doctorName: "",
    patientName: "",
    mobileNo: "",
    address: "",
    reference: "",
    appointmentTime: "",
    fdeName: "",
    note: "",
    email: "",
    gender: "",
    departmentName: "",
    appointmentWith: "",
    country: "",
    state: "",
    city: "",
  });

const [errors, setErrors] = useState({});

  const doctorsList = ["Dr. Smith", "Dr. Lee", "Dr. Johnson", "Dr. Brown"]; // Add your list of doctors
  const fdeList = ["John Doe", "Jane Smith", "Alice Johnson", "Michael Brown"]; // Add your list of FDE names

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));


    const newErrors = validate();
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      alert("Form submitted successfully");
      setAppointmentdata([...Appointmentdata, { formData }]);
      console.log(Appointmentdata)
    }
  };
  const validate = () => {
    const newErrors = {};

    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.doctorName) newErrors.doctorName = "Doctor Name is required";
    if (!formData.patientName)
      newErrors.patientName = "Patient Name is required";
    if (!formData.mobileNo) newErrors.mobileNo = "Mobile No is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.reference) newErrors.reference = "Reference is required";
    if (!formData.appointmentTime)
      newErrors.appointmentTime = "Appointment Time is required";
    if (!formData.fdeName) newErrors.fdeName = "FDE Name is required";
    if (!formData.note) newErrors.note = "Note is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.departmentName)
      newErrors.departmentName = "Department Name is required";
    if (!formData.appointmentWith)
      newErrors.appointmentWith = "Appointment With is required";
    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.city) newErrors.city = "City is required";


    // Email validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (formData.email && !emailRegex.test(formData.email))
      newErrors.email = "Email is not valid";

    // Phone validation (10 digit number)
    const phoneRegex = /^[0-9]{10}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = "Phone number is not valid";
    }

    // Password validation (Minimum 8 characters, at least one letter and one number)
    if (
      formData.password &&
      !/(?=.*[A-Za-z])(?=.*\d).{8,}/.test(formData.password)
    )
      newErrors.password = "Password is not valid";

    // URL validation
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    ["facebookUrl", "twitterUrl", "instagramUrl", "googlePlusUrl"].forEach(
      (feild) => {
        if (formData[feild] && !urlRegex.test(formData[feild]))
          newErrors[feild] = "URL is not valid";
      }
    );
    return newErrors;
  };

  const handleSetCountry = (value) => setCountry(value);
  const handleSetState = (value) => setState(value);
  const handleSetCity = (value) => setCity(value);

  return (
    <div className="themebody-wrap">
      <PageBreadcrumb pagename="Add Appointment" />
      <Container fluid>
        <Row>
          <Col>
            <Card>
              <Card.Body>
                <Form>
                  <Row>
                    {/* Title */}
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          placeholder="Enter Title"
                        />
                      </Form.Group>
                    </Col>

                    {/* Date */}
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Date</Form.Label>
                        <Form.Control
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleInputChange}
                        />
                        {errors.dateName && (
                          <p style={{ color: "red" }}>{errors.date}</p>
                        )}
                      </Form.Group>
                    </Col>

                    {/* Doctor Name Dropdown */}
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Doctor Name</Form.Label>
                        <Form.Control
                          as="select"
                          name="doctorName"
                          value={doctor}
                          onChange={(e) => {
                            setDoctor(e.target.value);
                            setFormData((prev) => ({
                              ...prev,
                              doctorName: e.target.value,
                            }));
                          }}
                        >
                          <option value="">Select Doctor</option>
                          {doctorsList.map((doctorName, index) => (
                            <option key={index} value={doctorName}>
                              {doctorName}
                            </option>
                          ))}
                          {errors.doctorName && (
                            <p style={{ color: "red" }}>{errors.doctorName}</p>
                          )}
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    {/* Patient Name */}
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Patient Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="patientName"
                          value={formData.patientName}
                          onChange={handleInputChange}
                          placeholder="Enter Patient Name"
                        />
                        {errors.patientName && (
                          <p style={{ color: "red" }}>{errors.patientName}</p>
                        )}
                      </Form.Group>
                    </Col>

                    {/* Mobile No */}
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Mobile No</Form.Label>
                        <Form.Control
                          type="text"
                          name="mobileNo"
                          value={formData.mobileNo}
                          onChange={handleInputChange}
                          placeholder="Enter Mobile Number"
                        />
                        {errors.mobileNo && (
                          <p style={{ color: "red" }}>{errors.mobileNo}</p>
                        )}
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
                          onChange={handleInputChange}
                          placeholder="Enter Address"
                        />
                        {errors.address && (
                          <p style={{ color: "red" }}>{errors.address}</p>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    {/* Reference */}
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Reference</Form.Label>
                        <Form.Control
                          type="text"
                          name="reference"
                          value={formData.reference}
                          onChange={handleInputChange}
                          placeholder="Enter Reference"
                        />
                        {errors.reference && (
                          <p style={{ color: "red" }}>{errors.reference}</p>
                        )}
                      </Form.Group>
                    </Col>

                    {/* Appointment Time */}
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Appointment Time</Form.Label>
                        <Form.Control
                          type="time"
                          name="appointmentTime"
                          value={formData.appointmentTime}
                          onChange={handleInputChange}
                        />
                        {errors.appointmentTime && (
                          <p style={{ color: "red" }}>
                            {errors.appointmentTime}
                          </p>
                        )}
                      </Form.Group>
                    </Col>

                    {/* FDE Name Dropdown */}
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>FDE Name</Form.Label>
                        <Form.Control
                          as="select"
                          name="fdeName"
                          value={fde}
                          onChange={(e) => {
                            setFde(e.target.value);
                            setFormData((prev) => ({
                              ...prev,
                              fdeName: e.target.value,
                            }));
                          }}
                        >
                          <option value="">Select FDE</option>
                          {fdeList.map((fdeName, index) => (
                            <option key={index} value={fdeName}>
                              {fdeName}
                            </option>
                          ))}
                          {errors.fdeName && (
                            <p style={{ color: "red" }}>{errors.fdeName}</p>
                          )}
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    {/* Note */}
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Note</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          name="note"
                          value={formData.note}
                          onChange={handleInputChange}
                          placeholder="Add Notes"
                        />
                        {errors.note && (
                          <p style={{ color: "red" }}>{errors.note}</p>
                        )}
                      </Form.Group>
                    </Col>

                    {/* Email */}
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter Email"
                        />
                        {errors.email && (
                          <p style={{ color: "red" }}>{errors.email}</p>
                        )}
                      </Form.Group>
                    </Col>

                    {/* Gender */}
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Gender</Form.Label>
                        <Form.Control
                          as="select"
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </Form.Control>
                        {errors.gender && (
                          <p style={{ color: "red" }}>{errors.gender}</p>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    {/* Department Name */}
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Department Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="departmentName"
                          value={formData.departmentName}
                          onChange={handleInputChange}
                          placeholder="Enter Department Name"
                        />
                        {errors.departmentName && (
                          <p style={{ color: "red" }}>{errors.departmentName}</p>
                        )}
                      </Form.Group>
                    </Col>

                    {/* Appointment With */}
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Appointment With</Form.Label>
                        <Form.Control
                          type="text"
                          name="appointmentWith"
                          value={formData.appointmentWith}
                          onChange={handleInputChange}
                          placeholder="Enter Appointment With"
                        />
                        {errors.appointmentWith && (
                          <p style={{ color: "red" }}>
                            {errors.appointmentWith}
                          </p>
                        )}
                      </Form.Group>
                    </Col>

                    {/* Country Dropdown */}
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Country</Form.Label>
                        <CountryDropdown
                          className="custom-dropdown"
                          searchable={true}
                          value={country}
                          style={{
                            width: "100%",
                          }}
                          onChange={(e, value) => {
                            console.log(value);
                            handleSetCountry(value);
                            setFormData((prev) => ({
                              ...prev,
                              country: value,
                            }));
                          }}
                        />
                        {errors.country && (
                          <p style={{ color: "red" }}>{errors.country}</p>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    {/* State Dropdown */}
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>State</Form.Label>
                        <StateDropdown
                          className="custom-dropdown"
                          country={country}
                          searchable={true}
                          value={state}
                          style={{
                            width: "100%",
                          }}
                          onChange={(e, value) => {
                            handleSetState(value);
                            setFormData((prev) => ({ ...prev, state: value }));
                          }}
                        />
                        {errors.state && (
                          <p style={{ color: "red" }}>{errors.state}</p>
                        )}
                      </Form.Group>
                    </Col>

                    {/* City Dropdown */}
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>City</Form.Label>
                        <CityDropdown
                          className="custom-dropdown"
                          country={country}
                          searchable={true}
                          state={state}
                          value={city}
                          style={{
                            width: "100%",
                          }}
                          onChange={(e, value) => {
                            handleSetCity(value);
                            setFormData((prev) => ({ ...prev, city: value }));
                          }}
                        />
                        {errors.city && (
                          <p style={{ color: "red" }}>{errors.city}</p>
                        )}
                      </Form.Group>
                    </Col>
                    <Form.Group className="text-end mb-0">
                      <button
                        className="btn btn-primary"
                        style={{ marginTop: "30px" }}
                      >
                        Submit
                      </button>
                      <Link
                        to="/appointment_list"
                        className="btn btn-danger ms-2"
                        style={{ marginTop: "30px" }}
                      >
                        Cancel
                      </Link>
                    </Form.Group>
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
