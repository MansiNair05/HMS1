import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Form,
  Container,
  Card,
  Table,
  Button,
} from "react-bootstrap";
import PageBreadcrumb from "../../componets/PageBreadcrumb";
import { Link } from "react-router-dom";

const BASE_URL = "http://192.168.90.193:5000/api"; // Update with your backend API base URL

export default function DischargeCard() {
  const [discharge, setDischarge] = useState([]);
  const [consultants, setConsultants] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [errors, setErrors] = useState("");
  const [formData, setFormData] = useState({
    prescriptionType: "",
    patientName: "",
    address: "",
    age: "",
    gender: "",
    consultantName: "",
    DOA: "",
    DOA_time: "",
    DOD: "",
    DOD_time: "",
    IPDNo: "",
    sPO2: "",
    BP: "",
    pulse: "",
    rr: "",
    temp: "",
    surgery_type: "",
    reasonForAdmission: "",
    past_history: "",
    significantFindings: "",
    allergies: "",
    surgeryDetails: "",
    surgeryNote: "",
    investigation: "",
    diagnosis: "",
    local_care: "",
    carenote: "",
    dateOfIssue: "",
    assistanceDoctor: "",
    Follow_date: "",
    surgeonDoctor: "",
    madeby: "",
    checkedby: "",
    treatingby: "",
    surgeryadvice: "",
    treatmentGiven: "",
    adviceMedicine: "",
    medicine_quantity: "",
    gty: "",
    days: "",
    timings: {
      BeforeBreakfast: false,
      AfterBreakfast: false,
      BeforeLunch: false,
      AfterLunch: false,
      BeforeDinner: false,
      AfterDinner: false,
      AfterEveningSnacks: false,
    },
    medicine_days: "",
  });

  const initialFormData = {
    prescriptionType: "",
    patientName: "",
    address: "",
    age: "",
    gender: "",
    consultantName: "",
    DOA: "",
    DOA_time: "",
    DOD: "",
    DOD_time: "",
    IPDNo: "",
    sPO2: "",
    BP: "",
    pulse: "",
    rr: "",
    temp: "",
    surgery_type: "",
    reasonForAdmission: "",
    past_history: "",
    significantFindings: "",
    allergies: "",
    surgeryDetails: "",
    surgeryNote: "",
    investigation: "",
    diagnosis: "",
    local_care: "",
    carenote: "",
    dateOfIssue: "",
    assistanceDoctor: "",
    Follow_date: "",
    surgeonDoctor: "",
    madeby: "",
    checkedby: "",
    treatingby: "",
    surgeryadvice: "",
    treatmentGiven: "",
    adviceMedicine: "",
    medicine_quantity: "",
    gty: "",
    days: "",
    timings: {
      BeforeBreakfast: false,
      AfterBreakfast: false,
      BeforeLunch: false,
      AfterLunch: false,
      BeforeDinner: false,
      AfterDinner: false,
      AfterEveningSnacks: false,
    },
    medicine_days: "",
  };

  const [dropdownOptions, setDropdownOptions] = useState([]); // Store API options
  const [selectedOptions, setSelectedOptions] = useState([]); // Track selected checkboxes


  // Fetch options from API
  useEffect(() => {
    const fetchDropdownOptions = async () => {
      try {
        const endpoints = [
          { url: "/V1/invoice/consultant_dropdown", setter: setConsultants },
        ];

        for (const { url, setter } of endpoints) {
          const response = await fetch(`${BASE_URL}${url}`);
          const data = await response.json();
          if (response.ok) setter(data.data || []);
        }
      } catch (err) {
        setErrors("Failed to fetch dropdown data.");
      }
    };
    fetchDropdownOptions();
  }, []);

  // Handle checkbox change for both timings and work patterns
  const handleCheckboxChange = (e, type) => {
    const { name, checked } = e.target;

    if (type === "timings") {
      setFormData((prev) => ({
        ...prev,
        timings: {
          ...prev.timings,
          [name]: checked,
        },
      }));
    } else if (type === "workPatterns") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    }
  };

  // Handle checkbox toggle for dropdown options
  const handleDropdownCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setSelectedOptions((prev) =>
      checked ? [...prev, name] : prev.filter((item) => item !== name)
    );
  };

  const handleAddToTable = () => {
    if (!formData.adviceMedicine || !formData.medicine_quantity || !formData.days) {
      alert("Please fill in medicine, quantity, and days fields.");
      return;
    }

    const selectedMealTimings = Object.keys(formData.timings)
      .filter((timing) => formData.timings[timing])
      .join(", ");

    const newTableRow = {
      medicine: formData.adviceMedicine,
      qty: formData.medicine_quantity,
      mealTimings: selectedMealTimings || "None",
      days: formData.days,
    };

    console.log("New Table Row:", newTableRow);

    setTableData((prevData) => [...prevData, newTableRow]);

    setFormData({
      ...formData,
      adviceMedicine: "",
      medicine_quantity: "",
      days: "",
      timings: initialFormData.timings, // Reset timings
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value, // Handle both checkbox and other input types
    }));
  };

  const validate = () => {
    const newErrors = {};
    const requiredFields = [
      "prescriptionType",
      "patientName",
      "address",
      "age",
      "gender",
      "consultaionName",
      "DOA",
      "DOA_time",
      "DOD",
      "DOD_time",
      "IPDNo",
      "sPO2",
      "BP",
      "pulse",
      "rr",
      "temp",
      "surgery_type",
      "reasonForAdmission",
      "past_history",
      "significantFindings",
      "allergies",
      "surgeryDetails",
      "surgeryNote",
      "investigation",
      "diagnosis",
      "local_care",
      "carenote",
      "dateOfIssue",
      "assistanceDoctor",
      "Follow_date",
      "surgeonDoctor",
      "madeby",
      "checkedby",
      "treatingby",
      "surgeryadvice",
      "treatmentGiven",
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
        const response = await fetch(`${BASE_URL}/V1/appointment/addAppointment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, saveType }),
        });

        console.log("Response received:", response);

        if (response.ok) {
          alert("Appointment added successfully");

          setFormData(initialFormData);
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
      <PageBreadcrumb pagename="Discharge Card" />
      <Container fluid>
        <Col>
          <Card
            style={{
              borderRadius: "12px",
              boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
              borderColor: "#00bcd4",
              background: "white",
              border: "1px solid #00bcd4",
              padding: "20px",
            }}
          >
            <Card.Body>
              <Form>
                <div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ marginRight: "20px" }}
                    onClick={() => handleSubmit("save")}
                  >
                    New Record
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{
                      float: "right",
                    }}
                    onClick={() => handleSubmit("save")}
                  >
                    Previous Records
                  </button>
                </div>
                <br />
                <Row>
                  <Col md={4} className="mb-4">
                    <Form.Group className="mb-3">
                      <Form.Label>Prescription Type</Form.Label>
                      <Form.Control
                        as="select"
                        name="prescriptionType"
                        value={formData.prescriptionType}
                        onChange={handleInputChange}
                        style={{ borderRadius: "6px" }}
                      >
                        <option value="">Prescription Type</option>
                        <option value="Proctology">Proctology</option>
                        <option value="Urology">Urology</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  {/* Patient Name */}
                  <Col md={4} className="mb-4">
                    <Form.Group className="mb-3">
                      <Form.Label>Patient Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="patientName"
                        value={formData.patientName}
                        onChange={handleInputChange}
                        style={{ borderRadius: "6px" }}
                      />
                    </Form.Group>
                  </Col>
                  {/* Address */}
                  <Col md={4} className="mb-4">
                    <Form.Group className="mb-3">
                      <Form.Label>Address</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Enter Address"
                        style={{ borderRadius: "6px" }}
                      />
                      {errors.address && (
                        <p style={{ color: "red", fontSize: "0.9rem" }}>
                          {errors.address}
                        </p>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col md={4} className="mb-4">
                    <Form.Group className="mb-3">
                      <Form.Label>Age</Form.Label>
                      <Form.Control
                        type="text"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        style={{ borderRadius: "6px" }}
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
                        style={{ borderRadius: "6px" }}
                      >
                        <option value="">Select Gender</option>
                        <option value="MALE">MALE</option>
                        <option value="FEMALE">FEMALE</option>
                        <option value="OTHER">OTHER</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>

                  <Col md={4} className="mb-3">
                    <Form.Group controlId="consultantName">
                      <Form.Label>Consultant Name</Form.Label>
                      <Form.Select
                        value={selectedOptions?.consultantName || ""}
                        onChange={(e) =>
                          setSelectedOptions({
                            ...selectedOptions,
                            consultantName: e.target.value,
                          })
                        }
                      >
                        <option value="">Select Consultant</option>
                        {[
                          ...new Set([
                            ...discharge.map(
                              (option) => option.consultantName
                            ),
                            ...consultants.map((consultant) => consultant.name),
                          ]),
                        ].map((consultantName, index) => (
                          <option key={index} value={consultantName}>
                            {consultantName}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                <br />
                <Row>
                  {/* DOA */}
                  <Col md={2} className="mb-4">
                    <Form.Group className="mb-3">
                      <Form.Label>DOA</Form.Label>
                      <Form.Control
                        type="date"
                        name="DOA"
                        value={formData.DOA}
                        onChange={handleInputChange}
                        style={{ borderRadius: "6px" }}
                      />
                    </Form.Group>
                  </Col>
                  {/* Time */}
                  <Col
                    md={2}
                    className="mb-4"
                    //   style={{ marginRight: "100px" }}
                  >
                    <Form.Group className="mb-3">
                      <Form.Label>Time</Form.Label>
                      <Form.Control
                        type="time"
                        name="DOA_time"
                        value={formData.DOA_time}
                        onChange={handleInputChange}
                        style={{ borderRadius: "6px" }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4} className="mb-4">
                    <Form.Group className="mb-3">
                      <Form.Label>Surgeon Type</Form.Label>
                      <Form.Control
                        as="select"
                        name="surgeonType"
                        value={formData.surgeonType}
                        onChange={handleInputChange}
                        style={{ borderRadius: "6px" }}
                      >
                        <option value="">Yet not completed</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md={4} className="mb-4">
                    <Form.Group className="mb-3">
                      <Form.Label>Diagnosis</Form.Label>
                      <Form.Control
                        type="text"
                        name="diagnosis"
                        value={formData.diagnosis}
                        onChange={handleInputChange}
                        placeholder="Enter diagnosis"
                        style={{ borderRadius: "6px" }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  {/* DOD */}
                  <Col md={2} className="mb-4">
                    <Form.Group className="mb-3">
                      <Form.Label>DOD</Form.Label>
                      <Form.Control
                        type="date"
                        name="DOD"
                        value={formData.DOD}
                        onChange={handleInputChange}
                        style={{ borderRadius: "6px" }}
                      />
                    </Form.Group>
                  </Col>
                  {/* Time */}
                  <Col md={2} className="mb-4">
                    <Form.Group className="mb-3">
                      <Form.Label>Time</Form.Label>
                      <Form.Control
                        type="time"
                        name="DOD_time"
                        value={formData.DOD_time}
                        onChange={handleInputChange}
                        style={{ borderRadius: "6px" }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4} className="mb-4">
                    <Form.Group className="mb-3">
                      <Form.Label>Procedure</Form.Label>
                      <Form.Control
                        type="text"
                        name="procedure"
                        value={formData.procedure}
                        onChange={handleInputChange}
                        placeholder="Enter procedure"
                        style={{ borderRadius: "6px" }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <br />
                  <br />
                  <Col md={1} className="mb-4">
                    <Form.Group className="mb-3">
                      <Form.Label>IPD No</Form.Label>
                      <Form.Control
                        type="text"
                        name="IPDNo"
                        value={formData.IPDNo}
                        onChange={handleInputChange}
                        style={{ borderRadius: "6px" }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={1} className="mb-4">
                    <Form.Group className="mb-3">
                      <Form.Label>SPO2</Form.Label>
                      <Form.Control
                        type="text"
                        name="sPO2"
                        value={formData.sPO2}
                        onChange={handleInputChange}
                        style={{ borderRadius: "6px" }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={1} className="mb-4">
                    <Form.Group className="mb-3">
                      <Form.Label>BP</Form.Label>
                      <Form.Control
                        type="text"
                        name="BP"
                        value={formData.BP}
                        onChange={handleInputChange}
                        style={{ borderRadius: "6px" }}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={1} className="mb-4">
                    <Form.Group className="mb-3">
                      <Form.Label>Pulse</Form.Label>
                      <Form.Control
                        type="text"
                        name="pulse"
                        value={formData.pulse}
                        onChange={handleInputChange}
                        style={{ borderRadius: "6px" }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={1} className="mb-4">
                    <Form.Group className="mb-3">
                      <Form.Label>RR</Form.Label>
                      <Form.Control
                        type="text"
                        name="rr"
                        value={formData.rr}
                        onChange={handleInputChange}
                        style={{ borderRadius: "6px" }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={1} className="mb-4">
                    <Form.Group className="mb-3">
                      <Form.Label>Temp</Form.Label>
                      <Form.Control
                        type="text"
                        name="temp"
                        value={formData.temp}
                        onChange={handleInputChange}
                        style={{ borderRadius: "6px" }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col md={6} className="mb-4">
                    <Form.Group className="mb-3">
                      <Form.Label>Reason For Admission</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="reasonForAdmission"
                        value={formData.reasonForAdmission}
                        onChange={handleInputChange}
                        style={{ borderRadius: "6px" }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-4">
                    <Form.Group className="mb-3">
                      <Form.Label>Past Medical History</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="past_history"
                        value={formData.past_history}
                        onChange={handleInputChange}
                        style={{ borderRadius: "6px" }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col md={6} className="mb-4">
                    <Form.Group className="mb-3">
                      <Form.Label>Significant Findings</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="significantFindings"
                        value={formData.significantFindings}
                        onChange={handleInputChange}
                        style={{ borderRadius: "6px" }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-4">
                    <Form.Group className="mb-3">
                      <Form.Label>Known Allergies</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="allergies"
                        value={formData.allergies}
                        onChange={handleInputChange}
                        style={{ borderRadius: "6px" }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col md={6} className="mb-4">
                    <Form.Group className="mb-3">
                      <Form.Label>Surgery Details</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="surgerydetails"
                        value={formData.surgeryDetails}
                        onChange={handleInputChange}
                        style={{ borderRadius: "6px" }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-4">
                    <Form.Group className="mb-3">
                      <Form.Label>Surgery Note</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="surgeryNote"
                        value={formData.surgeryNote}
                        onChange={handleInputChange}
                        style={{ borderRadius: "6px" }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col md={6}>
                    <Form.Label>Investigation:</Form.Label>
                    <Row>
                      <Col md={2} className="mb-4">
                        <Form.Label>HB</Form.Label>
                        <Form.Control
                          type="text"
                          name="surgeryNote"
                          value={formData.hb}
                          onChange={handleInputChange}
                          style={{ borderRadius: "6px" }}
                        />
                      </Col>
                      <Col md={2} className="mb-4">
                        <Form.Group className="mb-3">
                          <Form.Label>WBC</Form.Label>
                          <Form.Control
                            type="text"
                            name="wbc"
                            value={formData.wbc}
                            onChange={handleInputChange}
                            style={{ borderRadius: "6px" }}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={2} className="mb-4">
                        <Form.Group className="mb-3">
                          <Form.Label>PLT</Form.Label>
                          <Form.Control
                            type="text"
                            name="plt"
                            value={formData.plt}
                            onChange={handleInputChange}
                            style={{ borderRadius: "6px" }}
                          />
                        </Form.Group>
                      </Col>

                      <Col md={2} className="mb-4">
                        <Form.Group className="mb-3">
                          <Form.Label>BSL</Form.Label>
                          <Form.Control
                            type="text"
                            name="bsl"
                            value={formData.bsl}
                            onChange={handleInputChange}
                            style={{ borderRadius: "6px" }}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4} className="mb-4">
                        <Form.Group className="mb-3">
                          <Form.Label>SR.Creatinine</Form.Label>
                          <Form.Control
                            type="text"
                            name="creatinine"
                            value={formData.creatinine}
                            onChange={handleInputChange}
                            style={{ borderRadius: "6px" }}
                          />
                        </Form.Group>
                      </Col>
                      <Row>
                        <Col md={4} className="mb-4">
                          <Form.Group className="mb-3">
                            <Form.Label>Billirubin</Form.Label>
                            <Form.Control
                              type="text"
                              name="billirubin"
                              value={formData.billirubin}
                              onChange={handleInputChange}
                              style={{ borderRadius: "6px" }}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={2} className="mb-4">
                          <Form.Group className="mb-3">
                            <Form.Label>Urine</Form.Label>
                            <Form.Control
                              type="text"
                              name="urine"
                              value={formData.urine}
                              onChange={handleInputChange}
                              style={{ borderRadius: "6px" }}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={2} className="mb-4">
                          <Form.Group className="mb-3">
                            <Form.Label>PSA</Form.Label>
                            <Form.Control
                              type="text"
                              name="psa"
                              value={formData.psa}
                              onChange={handleInputChange}
                              style={{ borderRadius: "6px" }}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={2} className="mb-4">
                          <Form.Group className="mb-3">
                            <Form.Label>BT</Form.Label>
                            <Form.Control
                              type="text"
                              name="bt"
                              value={formData.bt}
                              onChange={handleInputChange}
                              style={{ borderRadius: "6px" }}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={2} className="mb-4">
                          <Form.Group className="mb-3">
                            <Form.Label>CT</Form.Label>
                            <Form.Control
                              type="text"
                              name="ct"
                              value={formData.ct}
                              onChange={handleInputChange}
                              style={{ borderRadius: "6px" }}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={2} className="mb-4">
                          <Form.Group className="mb-3">
                            <Form.Label>PT</Form.Label>
                            <Form.Control
                              type="text"
                              name="pt"
                              value={formData.pt}
                              onChange={handleInputChange}
                              style={{ borderRadius: "6px" }}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={2} className="mb-4">
                          <Form.Group className="mb-3">
                            <Form.Label>INR</Form.Label>
                            <Form.Control
                              type="text"
                              name="inr"
                              value={formData.inr}
                              onChange={handleInputChange}
                              style={{ borderRadius: "6px" }}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={2} className="mb-4">
                          <Form.Group className="mb-3">
                            <Form.Label>HIV</Form.Label>
                            <Form.Control
                              type="text"
                              name="hiv"
                              value={formData.hiv}
                              onChange={handleInputChange}
                              style={{ borderRadius: "6px" }}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={2} className="mb-4">
                          <Form.Group className="mb-3">
                            <Form.Label>HCV</Form.Label>
                            <Form.Control
                              type="text"
                              name="hcv"
                              value={formData.hcv}
                              onChange={handleInputChange}
                              style={{ borderRadius: "6px" }}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4} className="mb-4">
                          <Form.Group className="mb-3">
                            <Form.Label>HBSAG</Form.Label>
                            <Form.Control
                              type="text"
                              name="hbsag"
                              value={formData.hbsag}
                              onChange={handleInputChange}
                              style={{ borderRadius: "6px" }}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={12} className="mb-4">
                          <Form.Group className="mb-3">
                            <Form.Control
                              as="textarea"
                              // value={formData.hbsag}
                              onChange={handleInputChange}
                              style={{ borderRadius: "6px" }}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <br />
                      <Row>
                        <Col md={12} className="mb-4">
                          <Form.Group className="mb-3">
                            <Form.Label>Note / Advice</Form.Label>
                            <Form.Control
                              as="textarea"
                              name="diagnosis"
                              value="1. REGULAR FOLLOW UP FOR WOUND CLEANING IS ADVISED TILL COMPLETE HEALING.
2. BRINGS ALL RECORDS ON FOLLOW UP.
3. ALL DETAILS REGARDING MEDICATIONS AND HOME CARE HAVE BEEN EXPLANIED TO RELATIVE / PATIENT IN THEIR NATIVE LANGUAGE.
4. DISCHARGE SUMMARY WITH ALL INVESTIGATION REPORTS HANDOVER"
                              onChange={handleInputChange}
                              style={{ borderRadius: "6px" }}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6} className="mb-4">
                          <Form.Group className="mb-3">
                            <Form.Label>Date Of Issue</Form.Label>
                            <Form.Control
                              type="date"
                              name="dateOfissue"
                              value={formData.dateOfIssue}
                              onChange={handleInputChange}
                              style={{ borderRadius: "6px" }}
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6} className="mb-4">
                          <Form.Group className="mb-3">
                            <Form.Label>Follow Up Date</Form.Label>
                            <Form.Control
                              type="date"
                              name="Follow_date"
                              value={formData.Follow_date}
                              onChange={handleInputChange}
                              style={{ borderRadius: "6px" }}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6} className="mb-4">
                          <Form.Group className="mb-3">
                            <Form.Label>Made By</Form.Label>
                            <Form.Select
                              name="madeby"
                              value={formData.madeby}
                              onChange={handleInputChange}
                            >
                              <option value="">need to compelete</option>
                              <option value="Test 1">Test 1</option>
                              <option value="Test 2">Test 2</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6} className="mb-4">
                          <Form.Group className="mb-3">
                            <Form.Label>Treating By</Form.Label>
                            <Form.Select
                              name="treatingby"
                              value={formData.treatingby}
                              onChange={handleInputChange}
                            >
                              <option value="">need to compelete</option>
                              <option value="Test 1">Test 1</option>
                              <option value="Test 2">Test 2</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Row>
                  </Col>
                  <Col>
                    <Col md={12} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Diagnosis</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="diagnosis"
                          value={formData.diagnosis}
                          onChange={handleInputChange}
                          style={{ borderRadius: "6px" }}
                        />
                      </Form.Group>
                    </Col>
                    <br />
                    <Col md={12} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Local Care</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="diagnosis"
                          value="1. REGULAR FOLLOW UP FOR WOUND CLEANING IS ADVISED TILL COMPLETE HEALING.
                                2. TO CONTINUE BLOOD THINNERS AS PER CARDIOLOGIST ADVISE.
                                3. KEEP AREA CLEAN.
                                4. KEEP DRESSINGS DRY AND CLEAN"
                          onChange={handleInputChange}
                          style={{ borderRadius: "6px" }}
                        />
                      </Form.Group>
                    </Col>
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <Row>
                      <Col md={6} className="mb-4">
                        <Form.Group className="mb-3">
                          <Form.Label>Assistance Doctor</Form.Label>
                          <Form.Select
                            name="assistanceDoctor"
                            value={formData.assistanceDoctor}
                            onChange={handleInputChange}
                          >
                            <option value="">need to compelete</option>
                            <option value="Test 1">Test 1</option>
                            <option value="Test 2">Test 2</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6} className="mb-4">
                        <Form.Group className="mb-3">
                          <Form.Label>Surgeon Doctor</Form.Label>
                          <Form.Select
                            name="surgeonDoctor"
                            value={formData.surgeonDoctor}
                            onChange={handleInputChange}
                          >
                            <option value="">need to compelete</option>
                            <option value="Test 1">Test 1</option>
                            <option value="Test 2">Test 2</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6} className="mb-4">
                        <Form.Group className="mb-3">
                          <Form.Label>Checked By</Form.Label>
                          <Form.Select
                            name="checkedby"
                            value={formData.checkedby}
                            onChange={handleInputChange}
                          >
                            <option value="">need to compelete</option>
                            <option value="Test 1">Test 1</option>
                            <option value="Test 2">Test 2</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6} className="mb-4">
                        <Form.Group className="mb-3">
                          <Form.Label>Surgery Advice</Form.Label>
                          <Form.Select
                            name="surgeryadvice"
                            value={formData.surgeryadvice}
                            onChange={handleInputChange}
                          >
                            <option value="">need to compelete</option>
                            <option value="Test 1">Test 1</option>
                            <option value="Test 2">Test 2</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <br />
                <br />
                <Row className="mb-3">
                  <Col>
                    <Form.Group>
                      <Form.Label>Treatment Given:</Form.Label>
                      <Form.Select
                        name="adviceMedicine"
                        value={formData.adviceMedicine}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Medicine</option>
                        <option value="Medicine A">Medicine A</option>
                        <option value="Medicine B">Medicine B</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Times</Form.Label>
                      <Form.Select
                        name="times"
                        value={formData.times}
                        onChange={handleInputChange}
                      >
                        <option value="">Times</option>
                        <option value="Once">Once</option>
                        <option value="Twice">Twice</option>
                        <option value="Three Times">Three Times</option>
                        <option value="Four Times">Four Times</option>
                        <option value="Five Times">Five Times</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Medicine Route</Form.Label>
                      <Form.Select
                        name="times"
                        value={formData.times}
                        onChange={handleInputChange}
                      >
                        <option value="">Medicine Route</option>
                        <option value="IV">IV</option>
                        <option value="IM">IM</option>
                        <option value="ORAL">ORAL</option>
                        <option value="P/R">P/R</option>
                        <option value="P/V">P/V</option>
                        <option value="S/C">S/C</option>
                        <option value="S/L">S/L</option>
                        <option value="OTHER">OTHER</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <br />
                  <Col>
                    <Button
                      variant="primary"
                      onClick={handleAddToTable}
                      className="mt-4"
                    >
                      +
                    </Button>
                  </Col>
                  <br />
                  <Col>
                    <Button
                      variant="primary"
                      onClick={handleAddToTable}
                      className="mt-4"
                    >
                      Upload Medicine
                    </Button>
                  </Col>
                </Row>
                <br />
                <br />
                <Row className="mt-5">
                  <Col>
                    <Table bordered hover responsive>
                      <thead>
                        <tr>
                          <th>Medicine</th>
                          <th>Time Slot</th>
                          <th>Days</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableData.length > 0 ? (
                          tableData.map((row, index) => (
                            <tr key={index}>
                              <td>{row.medicine}</td>
                              <td>{row.mealTimings}</td>
                              <td>{row.days}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="text-center">
                              No data added yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </Col>
                </Row>
                <br />
                <br />
                <Row className="mb-3">
                  <Col>
                    <Form.Group>
                      <Form.Label>Treatment On Discharge</Form.Label>
                      <Form.Select
                        name="adviceMedicine"
                        value={formData.adviceMedicine}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Medicine</option>
                        <option value="Medicine A">Medicine A</option>
                        <option value="Medicine B">Medicine B</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Qty:</Form.Label>
                      <Form.Select
                        name="medicine_quantity"
                        value={formData.medicine_quantity}
                        onChange={handleInputChange}
                      >
                        <option value="" disabled>
                          Select Quantity
                        </option>
                        {Array.from({ length: 60 }, (_, i) => i + 1).map(
                          (num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          )
                        )}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Days:</Form.Label>
                      <Form.Select
                        name="medicine_days"
                        value={formData.medicine_days}
                        onChange={handleInputChange}
                      >
                        <option value="" disabled>
                          Select Days
                        </option>
                        {[1, 2, 3, 5, 7, 10, 15, 30, 45, 60, 90, 120].map(
                          (num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          )
                        )}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                <br />
                <Row className="mb-3">
                  <Col>
                    <Form.Group>
                      <Form.Label>Time Slot:</Form.Label>
                      <div>
                        {Object.keys(formData.timings).map((timing) => (
                          <Form.Check
                            key={timing}
                            inline
                            type="checkbox"
                            label={timing.replace(/([A-Z])/g, " $1").trim()}
                            name={timing}
                            checked={formData.timings[timing]}
                            onChange={handleCheckboxChange}
                          />
                        ))}
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
                <br />
                <Button
                  variant="primary"
                  onClick={handleAddToTable}
                  className="mt-4"
                >
                  Add to Table
                </Button>
                <br />
                <br />
                <Row className="mt-5">
                  <Col>
                    <Table bordered hover responsive>
                      <thead>
                        <tr>
                          <th>Medicine</th>
                          <th>Quantity</th>
                          <th>Time Slot</th>
                          <th>Days</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableData.length > 0 ? (
                          tableData.map((row, index) => (
                            <tr key={index}>
                              <td>{row.medicine}</td>
                              <td>{row.qty}</td>
                              <td>{row.mealTimings}</td>
                              <td>{row.days}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="text-center">
                              No data added yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                      <br />
                      <Button
                        variant="primary"
                        onClick={handleAddToTable}
                        className="mt-4"
                      >
                        Save Discharge Card
                      </Button>
                    </Table>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Container>
 </div>
);
}
