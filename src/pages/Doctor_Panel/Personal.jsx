import React, { useState, useEffect } from "react";
import { Row, Col, Form, Container, Card } from "react-bootstrap";
import PageBreadcrumb from "../../componets/PageBreadcrumb";
import { Link } from "react-router-dom";

const BASE_URL = "http://192.168.90.104:5000/api"; // Update with your backend API base URL

export default function Personal() {
  const [selectedReference, setSelectedReference] = useState("");

  // Example references and their corresponding fields
  const referenceFields = {
    Newspaper: ["Sakal", "MT", "TOI", "Pune Mirror", "Lokmat"],
    DoctorReference: ["DoctorReference"],
    Internet: [
      "Google",
      "Practo",
      "Facebook",
      "Instagram",
      "Website",
      "Just Dial",
      "Youtube",
    ],
    EntertainmentMedia: ["Radio", "Hoarding", "Tv Show"],
    TvShow: [
      "Zee 24 Taas",
      "Saam TV",
      "Zee Marathi",
      "IBN Lokmat",
      "TV9",
      "Others",
    ],
    PatientReference: ["Patient Reference"],
    Family: ["Family/Friends"],
    HHC: ["/HHC Board"],
    HHF: ["/HHF"],
    Other: ["/Other Details"],
    WOM: ["/WOM Details"],
  };
  const [formData, setFormData] = useState({
    uid: "",
    date: "",
    prefix: "PREFIX",
    patientName: "",
    isVIP: false,
    email: "",
    address: "",
    mobileNo: "",
    alternateNo: "",
    pincode: "",
    gender: "",
    blood_group: "",
    identity: "",
    birth_date: "",
    age: "",
    occupation: "",
    companyname: "",
    ref: "",
    specific_work: "",
  });

  // Handle dropdown selection change
  const handleChange = (event) => {
    setSelectedReference(event.target.value);
  };

  const handleReferenceChange = (e) => {
    setSelectedReference(e.target.value);
  };
  const [workPatterns, setWorkPatterns] = useState({
    Sedentary: false,
    Travelling: false,
    "Strenuous (Physical Activity)": false,
    "Mentally Stressful": false,
  });

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setWorkPatterns((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value.toUpperCase(), // Convert input to uppercase
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    const requiredFields = [
      "uid",
      "date",
      "patientName",
      "email",
      "address",
      "mobileNo",
      "alternateNo",
      "pincode",
      "gender",
      "blood_group",
      "identity",
      "birth_date",
      "age",
      "occupation",
      "companyname",
      "ref",
      "specific_work",
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
    console.log("Form Data:", formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        console.log("Sending request to backend...");
        const response = await fetch(
          `${BASE_URL}/V1/appointment/addAppointment`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...formData, saveType }),
          }
        );

        console.log("Response received:", response);

        if (response.ok) {
          alert("Appointment added successfully");

          setFormData({
            //     date: new Date().toISOString().split("T")[0],
            uid: "",
            date: "",
            prefix: "PREFIX",
            patientName: "",
            isVIP: false,
            email: "",
            address: "",
            mobileNo: "",
            alternateNo: "",
            pincode: "",
            gender: "",
            blood_group: "",
            identity: "",
            birth_date: "",
            age: "",
            occupation: "",
            companyname: "",
            ref: "",
            specific_work: "",
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

  useEffect(() => {}, []);

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
      <PageBreadcrumb pagename="Personal" />
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
                    Edit Patient
                  </button>
                  <br />
                  <br />
                  <br />
                  <br />
                  <Row>
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>UID No</Form.Label>
                        <Form.Control
                          type="number"
                          name="uid"
                          value={formData.uid}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                    {/* Date */}
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Patient Date</Form.Label>
                        <Form.Control
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={10} className="mb-4">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1rem",
                          padding: "1rem",
                          flexWrap: "wrap",
                        }}
                      >
                        {/* Prefix Dropdown */}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                          }}
                        >
                          <label
                            htmlFor="prefix"
                            style={{
                              fontSize: "0.9rem",
                              marginBottom: "0.4rem",
                            }}
                          >
                            Prefix
                          </label>
                          <select
                            id="prefix"
                            name="prefix"
                            value={formData.prefix}
                            onChange={handleInputChange}
                            style={{
                              padding: "0.4rem 0.6rem",
                              border: "1px solid #ccc",
                              borderRadius: "4px",
                              backgroundColor: "#fff",
                              cursor: "pointer",
                            }}
                          >
                            <option value="PREFIX">PREFIX</option>
                            <option value="MR">MR</option>
                            <option value="MS">MS</option>
                            <option value="MRS">MRS</option>
                            <option value="MASTER">MASTER</option>
                          </select>
                        </div>
                        {/* Patient Name Input */}
                        <Col md={3}>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              flex: "1",
                            }}
                          >
                            <label
                              htmlFor="patientName"
                              style={{
                                fontSize: "0.9rem",
                                marginBottom: "0.4rem",
                              }}
                            >
                              Patient Name
                            </label>
                            <input
                              type="text"
                              id="patientName"
                              name="patientName"
                              value={formData.patientName}
                              placeholder="Enter Patient Name"
                              onChange={handleInputChange}
                              style={{
                                padding: "0.4rem 0.6rem",
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                                width: "100%",
                              }}
                            />
                          </div>
                        </Col>
                        {/* VIP Checkbox */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginTop: "1.6rem",
                          }}
                        >
                          <input
                            type="checkbox"
                            id="isVIP"
                            name="isVIP"
                            checked={formData.isVIP}
                            onChange={handleInputChange}
                            style={{
                              cursor: "pointer",
                              marginRight: "0.5rem",
                            }}
                          />
                          <label htmlFor="isVIP" style={{ fontSize: "0.9rem" }}>
                            VIP
                          </label>
                        </div>
                      </div>
                    </Col>
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

                    {/* Mobile No */}
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Mobile No</Form.Label>
                        <Form.Control
                          type="number"
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
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Alternate No</Form.Label>
                        <Form.Control
                          type="number"
                          name="alternateNo"
                          value={formData.alternateNo}
                          onChange={handleInputChange}
                          placeholder="Enter Alternate Number"
                        />
                      </Form.Group>
                    </Col>

                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Pincode No</Form.Label>
                        <Form.Control
                          type="number"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                        />
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
                          <option value="MALE">MALE</option>
                          <option value="FEMALE">FEMALE</option>
                          <option value="OTHER">OTHER</option>
                        </Form.Control>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Blood Group</Form.Label>
                        <Form.Control
                          as="select"
                          name="blood_group"
                          value={formData.blood_group}
                          onChange={handleInputChange}
                        >
                          <option value="">Select Blood Group</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                        </Form.Control>
                      </Form.Group>
                    </Col>

                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Identity</Form.Label>
                        <Form.Control
                          as="select"
                          name="identity"
                          value={formData.identity}
                          onChange={handleInputChange}
                        >
                          <option value="">Select Identity</option>
                          <option value="Passport">Passport No</option>
                          <option value="Aadhaar">Aadhaar No</option>
                          <option value="Voter">Voter No</option>
                        </Form.Control>
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group>
                        <Form.Label> </Form.Label>
                        <Form.Control></Form.Control>
                      </Form.Group>
                    </Col>

                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Birth Date</Form.Label>
                        <Form.Control
                          type="date"
                          name="birth_date"
                          value={formData.birth_date}
                          onChange={handleInputChange}
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
                          onChange={handleInputChange}
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
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Company Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="companyname"
                          value={formData.companyname}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Reference</Form.Label>
                        <Form.Select
                          value={selectedReference}
                          onChange={handleChange}
                          className="border rounded p-2 mb-4 w-full"
                        >
                          <option value="">Select a Reference</option>
                          {Object.keys(referenceFields).map((reference) => (
                            <option key={reference} value={reference}>
                              {reference}
                            </option>
                          ))}
                        </Form.Select>

                        {/* Display corresponding fields */}
                        {selectedReference && (
                          <div className="border p-4 rounded shadow">
                            {[
                              "Newspaper",
                              "EntertainmentMedia",
                              "Internet",
                              "TvShow",
                              "HHC",
                              "HHF",
                            ].includes(selectedReference) ? (
                              // For specific options: Single label + checkboxes
                              <>
                                <Form.Label className="text-lg font-semibold mb-3 d-block">
                                  {selectedReference} Options:
                                </Form.Label>
                                {referenceFields[selectedReference].map(
                                  (field, index) => (
                                    <div
                                      key={index}
                                      className="form-check mb-2"
                                    >
                                      <input
                                        type="checkbox"
                                        id={`checkbox-${selectedReference}-${index}`}
                                        className="form-check-input"
                                      />
                                      <label
                                        htmlFor={`checkbox-${selectedReference}-${index}`}
                                        className="form-check-label"
                                      >
                                        {field}
                                      </label>
                                    </div>
                                  )
                                )}
                              </>
                            ) : (
                              // For other options: Individual labels and inputs
                              <>
                                <Form.Label className="text-lg font-semibold mb-3 d-block">
                                  {selectedReference} Fields:
                                </Form.Label>
                                {referenceFields[selectedReference].map(
                                  (field, index) => (
                                    <div key={index} className="mb-3">
                                      <label
                                        htmlFor={`input-${selectedReference}-${index}`}
                                        className="form-label"
                                      >
                                        {field}
                                      </label>
                                      <input
                                        type="text"
                                        id={`input-${selectedReference}-${index}`}
                                        className="form-control"
                                        placeholder={`Enter ${field}`}
                                      />
                                    </div>
                                  )
                                )}
                              </>
                            )}
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="text-end mb-0">
                    <br />
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "2rem",
                      }}
                    >
                      <label style={{ fontWeight: "bold" }}>
                        Add Specific Work Pattern
                      </label>
                      {Object.keys(workPatterns).map((pattern) => (
                        <div
                          key={pattern}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <input
                            type="checkbox"
                            name={pattern}
                            checked={workPatterns[pattern]}
                            onChange={handleCheckboxChange}
                          />
                          <label>{pattern}</label>
                        </div>
                      ))}
                    </div>
                  </Form.Group>
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ marginTop: "30px", marginLeft: "1100px" }}
                    onClick={() => handleSubmit("save")}
                  >
                    Update Patient
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
