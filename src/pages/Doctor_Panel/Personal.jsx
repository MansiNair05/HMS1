import React, { useState, useEffect } from "react";
import { Row, Col, Form, Container, Card } from "react-bootstrap";
import NavBarD from "./NavbarD";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BASE_URL = "http://192.168.90.158:5000/api";

export default function Personal() {
  const location = useLocation();
  const [patientId, setPatientId] = useState(
    localStorage.getItem("selectedPatientId")
  );

  const [selectedReference, setSelectedReference] = useState("dr_ref");
  const [rowData, setRowData] = useState({});
  const [errors, setErrors] = useState({});

  const [workPatterns, setWorkPatterns] = useState({
    Sedentary: false,
    Travelling: false,
    "Strenuous (Physical Activity)": false,
    "Mentally Stressful": false,
  });

  const [referenceDetails, setReferenceDetails] = useState({
    newspaper: "",
    internet: "",
    MediaRef: "",
    TVShow: "",
    reference_doctor_name: "",
    reference_doctor_no: "",
    reference_doctor_speciality: "",
    reference_doctor_location: "",
    patient_ref_no: "",
    old_patient_name: "",
    friendname: "",
    friendno: "",
    other: "",
    WOM: "",
  });

  const [oldPatientDetails, setOldPatientDetails] = useState({
    patient_ref_no: "",
    old_patient_name: "",
    old_patient_id_value: "",
    old_patient_pincode: "",
  });

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

  // Add new state for edit mode
  const [isEditing, setIsEditing] = useState(false);

  // Auto-save to database when data changes
  useEffect(() => {
    console.log("Retrieved Patient ID:", patientId);

    const saveToDatabase = async () => {
      // if (patientId || !rowData.patient_id) return;

      try {
        const response = await fetch(
          `${BASE_URL}/V1/patienttabs/editPersonal/${patientId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...rowData,
              selectedReference,
              referenceDetails,
            }),
          }
        );

        if (!response.ok) {
          console.error("Error saving data:", await response.text());
        }
      } catch (error) {
        console.error("Error saving to database:", error);
      }
    };

    // Add a debounce to prevent too many API calls
    const timeoutId = setTimeout(() => {
      if (Object.keys(rowData).length > 0) {
        saveToDatabase();
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [rowData, selectedReference, patientId]);

  // Add this function to calculate age from birth date
  const calculateAge = (birthDate) => {
    if (!birthDate) return "";

    const today = new Date();
    const birth = new Date(birthDate);

    // Check if birth date is valid
    if (isNaN(birth.getTime())) return "";

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    // Adjust age if birthday hasn't occurred this year
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  // Add this function to format date to YYYY-MM-DD
  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ""; // Return empty string if invalid date

    return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD format
  };

  const handleWorkPatternChange = (e) => {
    const { name, checked } = e.target;
    setWorkPatterns((prev) => ({
      ...prev,
      [name]: checked,
    }));

    // Update rowData to include work patterns
    setRowData((prev) => ({
      ...prev,
      workPatterns: {
        ...prev.workPatterns,
        [name]: checked,
      },
    }));
  };

  // Modify the handleInputChange function
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    if (name === "birth_date") {
      const formattedDate = formatDate(value);
      const calculatedAge = calculateAge(formattedDate);
      console.log("Birth Date Changed:", {
        originalValue: value,
        formattedDate: formattedDate,
        calculatedAge: calculatedAge,
      });

      setRowData((prevState) => ({
        ...prevState,
        [name]: formattedDate,
        age: calculatedAge,
      }));
    } else {
      setRowData((prevState) => ({
        ...prevState,
        [name]: newValue,
      }));
    }

    // Log all form data after each change
    console.log("Updated Form Data:", {
      ...rowData,
      [name]: newValue,
    });
  };

  const handleReferenceChange = (e) => {
    setSelectedReference(e.target.value);
  };

  const handleReferenceDetailsChange = (e) => {
    const { name, value } = e.target;
    setReferenceDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a reference type string based on selected reference and its details
    let reference_type = "";

    switch (selectedReference) {
      case "newspaper":
        reference_type = `Newspaper: ${referenceDetails.newspaper || ""}`;
        break;
      case "dr_ref":
        reference_type = `Doctor Reference: ${
          referenceDetails.reference_doctor_name || ""
        } - ${referenceDetails.reference_doctor_speciality || ""}`;
        break;
      case "internet":
        reference_type = `Internet: ${referenceDetails.internet || ""}`;
        break;
      case "MediaRef":
        reference_type = `Entertainment Media: ${
          referenceDetails.MediaRef || ""
        }`;
        break;
      case "TVShow":
        reference_type = `TV Show: ${referenceDetails.TVShow || ""}`;
        break;
      case "old_ref":
        reference_type = `Patient Reference: ${
          oldPatientDetails.old_patient_name || ""
        } (${oldPatientDetails.patient_ref_no || ""})`;
        break;
      case "family_friends":
        reference_type = `Family/Friends: ${
          referenceDetails.friendname || ""
        } (${referenceDetails.friendno || ""})`;
        break;
      case "hhc_board":
        reference_type = "HHC Board";
        break;
      case "HHF":
        reference_type = "HHF";
        break;
      case "other":
        reference_type = `Other: ${referenceDetails.other || ""}`;
        break;
      case "WOM":
        reference_type = `WOM: ${referenceDetails.WOM || ""}`;
        break;
      default:
        reference_type = "";
    }

    try {
      const response = await fetch(
        `${BASE_URL}/V1/patienttabs/editPersonal/${patientId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...rowData,
            reference_type, // Add the reference_type field
            selectedReference,
            referenceDetails,
          }),
        }
      );

      if (response.ok) {
        alert("Patient data updated successfully");
        setIsEditing(false); // Exit edit mode after successful update
      } else {
        alert("Failed to update patient data");
      }
    } catch (error) {
      console.error("Error updating patient data:", error);
      alert("Network error. Please try again.");
    }
  };

  // Update the useEffect that fetches initial patient data
  useEffect(() => {
    const fetchPatientData = async () => {
      if (!patientId) {
        console.error("No patient ID available for fetching data.");
        return;
      }

      try {
        const response = await fetch(
          `${BASE_URL}/V1/patienttabs/editPersonal/${patientId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(rowData),
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Fetched Patient Data:", data);

          // Check if the API response structure is correct
          if (data && data.data) {
            setRowData(data.data);
          } else {
            console.error("Unexpected data structure:", data);
          }
        } else {
          throw new Error("Failed to fetch patient data");
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };

    fetchPatientData();
  }, [patientId]);

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
      <NavBarD pagename="Personal" />

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
                <Form onSubmit={handleSubmit}>
                  <Row>{/* Add more form fields as needed */}</Row>
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ marginTop: "5px", float: "right" }}
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Patient
                  </button>
                  <br />
                  <br />
                  <Row>
                    <Col md={3} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>UID No</Form.Label>
                        <Form.Control
                          type="text"
                          name="Uid_no"
                          value={rowData?.Uid_no}
                          readOnly
                          style={{
                            backgroundColor: "#e9ecef", // Light grey background to indicate read-only
                            color: "#6c757d", // Grey text color
                            cursor: "not-allowed", // Show "not-allowed" cursor
                          }}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                    {/* Date */}
                    <Col md={3} className="mb-4">
                      <Form.Group controlId="formPatientDate">
                        <Form.Label>Patient Date</Form.Label>
                        <Form.Control
                          type="text"
                          name="date"
                          value={rowData?.date}
                          readOnly
                          style={{
                            backgroundColor: "#e9ecef", // Light grey background to indicate read-only
                            color: "#6c757d", // Grey text color
                            cursor: "not-allowed", // Show "not-allowed" cursor
                          }}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-4">
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
                            value={rowData.prefix}
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
                        <Col md={5}>
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
                              id="name"
                              name="patientName"
                              value={rowData.name || ""}
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
                            checked={rowData.isVIP}
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
                  </Row>
                  <Row>
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={rowData.email || rowData.email}
                          onChange={handleInputChange}
                          placeholder="Enter Email"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                          type="text"
                          name="address"
                          value={rowData.address || rowData.address}
                          onChange={handleInputChange}
                          placeholder="Enter Address"
                        />
                      </Form.Group>
                    </Col>
                    {/* Mobile No */}
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Mobile No</Form.Label>
                        <Form.Control
                          id="phone"
                          type="number"
                          name="phone"
                          value={rowData.phone}
                          onChange={handleInputChange}
                          placeholder="Enter Mobile Number"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Alternate No</Form.Label>
                        <Form.Control
                          id="mobile_2"
                          type="number"
                          name="alternateNo"
                          value={rowData.mobile_2}
                          onChange={handleInputChange}
                          placeholder="Enter Alternate Number"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Pincode No</Form.Label>
                        <Form.Control
                          id="pincode"
                          type="number"
                          name="pincode"
                          value={rowData.pincode || rowData.pincode}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-20">
                        <Form.Label>Gender</Form.Label>
                        <Form.Control
                          as="select"
                          name="gender"
                          value={rowData.gender || rowData?.gender}
                          onChange={handleInputChange}
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </Form.Control>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Blood Group</Form.Label>
                        <Form.Select
                          type="text"
                          name="blood_group"
                          value={rowData.blood_group || rowData?.blood_group}
                          onChange={(e) =>
                            setRowData({
                              rowData,
                              blood_group: e.target.value,
                            })
                          }
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
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Identity</Form.Label>
                        <Form.Control
                          id="identity"
                          as="select"
                          name="identity"
                          value={rowData.identity || rowData.identity}
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
                    <Col md={2} className="mb-4">
                      <Form.Group className="mb-3">
                        {/* Add className="d-block" to move label above the input box */}
                        <Form.Label className="d-block">Birth Date</Form.Label>
                        <DatePicker
                          selected={
                            rowData?.birth_date
                              ? new Date(rowData.birth_date)
                              : null
                          }
                          onChange={(date) => {
                            const formattedDate = formatDate(date);
                            handleInputChange({
                              target: {
                                name: "birth_date",
                                value: formattedDate,
                              },
                            });
                          }}
                          dateFormat="yyyy-MM-dd"
                          className="form-control"
                          placeholderText="Select Birth Date"
                          maxDate={new Date()}
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          style={{
                            height: "38px",
                            width: "100%",
                            // borderRadius: "4px",
                            // border: "1px solid #ced4da",
                          }}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={2} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Age</Form.Label>
                        <Form.Control
                          id="age"
                          type="text"
                          name="age"
                          value={rowData?.age || ""}
                          readOnly
                          style={{
                            height: "38px",
                            width: "100%",
                            borderRadius: "4px",
                            border: "1px solid #ced4da",
                            backgroundColor: "#e9ecef",
                          }}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Occupation</Form.Label>
                        <Form.Control
                          id="occupation"
                          type="text"
                          name="occupation"
                          value={rowData.occupation || rowData.occupation}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Company Name</Form.Label>
                        <Form.Control
                          id="companyname"
                          type="text"
                          name="companyname"
                          value={rowData.companyname || rowData.companyname}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Reference</Form.Label>
                        <Form.Select
                          value={rowData?.selectedReference}
                          onChange={handleReferenceChange}
                          className="mb-3"
                        >
                          <option value="">Choose Reference</option>
                          <option value="newspaper">Newspaper</option>
                          <option value="dr_ref">Doctor Reference</option>
                          <option value="internet">Internet</option>
                          <option value="MediaRef">Entertainment Media</option>
                          <option value="TVShow">TV Show</option>
                          <option value="old_ref">Patient Reference</option>
                          <option value="family_friends">Family/Friends</option>
                          <option value="hhc_board">HHC Board</option>
                          <option value="HHF">HHF</option>
                          <option value="other">Other</option>
                          <option value="WOM">WOM</option>
                        </Form.Select>

                        {/* Newspaper Reference */}
                        {selectedReference === "newspaper" && (
                          <div className="reference-details">
                            <Form.Label>Newspaper</Form.Label>
                            <div className="d-flex flex-wrap gap-3">
                              {[
                                "Sakal",
                                "TOI",
                                "MT",
                                "Lokmat",
                                "Pune Mirror",
                              ].map((paper) => (
                                <Form.Check
                                  key={paper}
                                  type="radio"
                                  name="newspaper"
                                  label={paper}
                                  value={paper}
                                  onChange={handleReferenceDetailsChange}
                                  checked={referenceDetails.newspaper === paper}
                                />
                              ))}
                              <Form.Control
                                type="text"
                                placeholder="Other"
                                name="Other_Newspaper"
                                onChange={handleReferenceDetailsChange}
                              />
                            </div>
                          </div>
                        )}

                        {/* Internet Reference */}
                        {selectedReference === "internet" && (
                          <div className="reference-details">
                            <Form.Label>Internet</Form.Label>
                            <div className="d-flex flex-wrap gap-3">
                              {[
                                "Google",
                                "Website",
                                "Practo",
                                "Just Dial",
                                "Facebook",
                                "Youtube",
                                "Instagram",
                              ].map((source) => (
                                <Form.Check
                                  key={source}
                                  type="radio"
                                  name="internet"
                                  label={source}
                                  value={source}
                                  onChange={handleReferenceDetailsChange}
                                  checked={referenceDetails.internet === source}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Doctor Reference */}
                        {selectedReference === "dr_ref" && (
                          <div className="reference-details">
                            <Form.Label>Doctor Reference</Form.Label>
                            <Row className="g-3">
                              <Col md={6}>
                                <Form.Control
                                  type="text"
                                  placeholder="Doctor Name (min: 4 digits)"
                                  name="reference_doctor_name"
                                  value={referenceDetails.reference_doctor_name}
                                  onChange={handleReferenceDetailsChange}
                                />
                              </Col>
                              <Col md={6}>
                                <Form.Control
                                  type="text"
                                  placeholder="Doctor Phone No"
                                  name="reference_doctor_no"
                                  value={referenceDetails.reference_doctor_no}
                                  onChange={handleReferenceDetailsChange}
                                />
                              </Col>
                              <Col md={6}>
                                <Form.Control
                                  type="text"
                                  placeholder="Medical Specialties"
                                  name="reference_doctor_speciality"
                                  value={
                                    referenceDetails.reference_doctor_speciality
                                  }
                                  onChange={handleReferenceDetailsChange}
                                />
                              </Col>
                              <Col md={6}>
                                <Form.Control
                                  type="text"
                                  placeholder="Doctor Location"
                                  name="reference_doctor_location"
                                  value={
                                    referenceDetails.reference_doctor_location
                                  }
                                  onChange={handleReferenceDetailsChange}
                                />
                              </Col>
                            </Row>
                          </div>
                        )}

                        {/* Entertainment Media Reference */}
                        {selectedReference === "MediaRef" && (
                          <div className="reference-details">
                            <Form.Label>Entertainment Media</Form.Label>
                            <div className="d-flex flex-wrap gap-3">
                              {["Radio", "TV Show", "Hoarding"].map((media) => (
                                <Form.Check
                                  key={media}
                                  type="radio"
                                  name="MediaRef"
                                  label={media}
                                  value={media}
                                  onChange={handleReferenceDetailsChange}
                                  checked={referenceDetails.MediaRef === media}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* TV Show Reference */}
                        {selectedReference === "TVShow" && (
                          <div className="reference-details">
                            <Form.Label>TV Show</Form.Label>
                            <div className="d-flex flex-wrap gap-3">
                              {[
                                "Zee 24 Taas",
                                "IBN Lokmat",
                                "Saam TV",
                                "TV9",
                                "Zee Marathi",
                                "Others",
                              ].map((show) => (
                                <Form.Check
                                  key={show}
                                  type="radio"
                                  name="TVShow"
                                  label={show}
                                  value={show}
                                  onChange={handleReferenceDetailsChange}
                                  checked={referenceDetails.TVShow === show}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Patient Reference */}
                        {selectedReference === "old_ref" && (
                          <div
                            style={{
                              padding: "15px",
                              border: "1px solid #dee2e6",
                              borderRadius: "4px",
                              marginTop: "10px",
                            }}
                          >
                            <Form.Label>Patient Reference</Form.Label>
                            <Row>
                              <Col md={12} style={{ marginBottom: "20px" }}>
                                <Form.Control
                                  type="text"
                                  placeholder="Enter Phone Number"
                                  name="patient_ref_no"
                                  value={oldPatientDetails.patient_ref_no}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    setOldPatientDetails((prev) => ({
                                      ...prev,
                                      patient_ref_no: value,
                                    }));
                                  }}
                                  style={{
                                    height: "38px",
                                    width: "100%",
                                    borderRadius: "4px",
                                    border: "1px solid #ced4da",
                                  }}
                                />
                              </Col>

                              {/* Patient Details Fields without labels */}
                              <Col md={4}>
                                <Form.Group style={{ marginBottom: "15px" }}>
                                  <Form.Control
                                    type="text"
                                    placeholder="Patient Name"
                                    name="old_patient_name"
                                    value={oldPatientDetails.old_patient_name}
                                    onChange={(e) => {
                                      setOldPatientDetails((prev) => ({
                                        ...prev,
                                        old_patient_name: e.target.value,
                                      }));
                                    }}
                                    style={{
                                      height: "38px",
                                      width: "100%",
                                      borderRadius: "4px",
                                      border: "1px solid #ced4da",
                                    }}
                                  />
                                </Form.Group>
                              </Col>

                              <Col md={4}>
                                <Form.Group style={{ marginBottom: "15px" }}>
                                  <Form.Control
                                    type="text"
                                    placeholder="Patient ID"
                                    name="old_patient_id_value"
                                    value={
                                      oldPatientDetails.old_patient_id_value
                                    }
                                    onChange={(e) => {
                                      setOldPatientDetails((prev) => ({
                                        ...prev,
                                        old_patient_id_value: e.target.value,
                                      }));
                                    }}
                                    style={{
                                      height: "38px",
                                      width: "100%",
                                      borderRadius: "4px",
                                      border: "1px solid #ced4da",
                                    }}
                                  />
                                </Form.Group>
                              </Col>

                              <Col md={4}>
                                <Form.Group style={{ marginBottom: "15px" }}>
                                  <Form.Control
                                    type="text"
                                    placeholder="Pincode"
                                    name="old_patient_pincode"
                                    value={
                                      oldPatientDetails.old_patient_pincode
                                    }
                                    onChange={(e) => {
                                      setOldPatientDetails((prev) => ({
                                        ...prev,
                                        old_patient_pincode: e.target.value,
                                      }));
                                    }}
                                    style={{
                                      height: "38px",
                                      width: "100%",
                                      borderRadius: "4px",
                                      border: "1px solid #ced4da",
                                    }}
                                  />
                                </Form.Group>
                              </Col>
                            </Row>
                          </div>
                        )}

                        {/* Family/Friends Reference */}
                        {selectedReference === "family_friends" && (
                          <div
                            style={{
                              padding: "15px",
                              border: "1px solid #dee2e6",
                              borderRadius: "4px",
                              marginTop: "10px",
                            }}
                          >
                            <Form.Label>Family/Friends</Form.Label>
                            <Row>
                              <Col md={6}>
                                <Form.Group style={{ marginBottom: "15px" }}>
                                  <Form.Control
                                    type="text"
                                    placeholder="Friend Name"
                                    name="friendname"
                                    value={referenceDetails.friendname}
                                    onChange={handleReferenceDetailsChange}
                                    style={{
                                      height: "38px",
                                      width: "100%",
                                      borderRadius: "4px",
                                      border: "1px solid #ced4da",
                                    }}
                                  />
                                </Form.Group>
                              </Col>
                              <Col md={6}>
                                <Form.Group style={{ marginBottom: "15px" }}>
                                  <Form.Control
                                    type="text"
                                    placeholder="Friend Number"
                                    name="friendno"
                                    value={referenceDetails.friendno}
                                    onChange={handleReferenceDetailsChange}
                                    style={{
                                      height: "38px",
                                      width: "100%",
                                      borderRadius: "4px",
                                      border: "1px solid #ced4da",
                                    }}
                                  />
                                </Form.Group>
                              </Col>
                            </Row>
                          </div>
                        )}

                        {/* HHC Board Reference */}
                        {selectedReference === "hhc_board" && (
                          <div
                            style={{
                              padding: "15px",
                              border: "1px solid #dee2e6",
                              borderRadius: "4px",
                              marginTop: "10px",
                            }}
                          >
                            <Form.Label>HHC Board</Form.Label>
                            <Row>
                              <Col md={12}>
                                <Form.Check
                                  type="radio"
                                  name="HHC_board"
                                  label="HHC Board"
                                  value="HHC_board"
                                  onChange={handleReferenceDetailsChange}
                                  style={{ marginBottom: "10px" }}
                                />
                              </Col>
                            </Row>
                          </div>
                        )}

                        {/* HHF Reference */}
                        {selectedReference === "HHF" && (
                          <div
                            style={{
                              padding: "15px",
                              border: "1px solid #dee2e6",
                              borderRadius: "4px",
                              marginTop: "10px",
                            }}
                          >
                            <Form.Label>HHF</Form.Label>
                            <Row>
                              <Col md={12}>
                                <Form.Check
                                  type="radio"
                                  name="HHF"
                                  label="HHF"
                                  value="HHF"
                                  onChange={handleReferenceDetailsChange}
                                  style={{ marginBottom: "10px" }}
                                />
                              </Col>
                            </Row>
                          </div>
                        )}

                        {/* Other Reference */}
                        {selectedReference === "other" && (
                          <div
                            style={{
                              padding: "15px",
                              border: "1px solid #dee2e6",
                              borderRadius: "4px",
                              marginTop: "10px",
                            }}
                          >
                            <Form.Label>Other Detail</Form.Label>
                            <Row>
                              <Col md={12}>
                                <Form.Group style={{ marginBottom: "15px" }}>
                                  <Form.Control
                                    type="text"
                                    placeholder="Other"
                                    name="other"
                                    value={referenceDetails.other}
                                    onChange={handleReferenceDetailsChange}
                                    style={{
                                      height: "38px",
                                      width: "100%",
                                      borderRadius: "4px",
                                      border: "1px solid #ced4da",
                                    }}
                                  />
                                </Form.Group>
                              </Col>
                            </Row>
                          </div>
                        )}

                        {/* WOM Reference */}
                        {selectedReference === "WOM" && (
                          <div
                            style={{
                              padding: "15px",
                              border: "1px solid #dee2e6",
                              borderRadius: "4px",
                              marginTop: "10px",
                            }}
                          >
                            <Form.Label>WOM Detail</Form.Label>
                            <Row>
                              <Col md={12}>
                                <Form.Group style={{ marginBottom: "15px" }}>
                                  <Form.Control
                                    type="text"
                                    placeholder="WOM"
                                    name="WOM"
                                    value={referenceDetails.WOM}
                                    onChange={handleReferenceDetailsChange}
                                    style={{
                                      height: "38px",
                                      width: "100%",
                                      borderRadius: "4px",
                                      border: "1px solid #ced4da",
                                    }}
                                  />
                                </Form.Group>
                              </Col>
                            </Row>
                            <Row>
                              <Col md={12}>
                                <Form.Group className="mb-4">
                                  <Form.Label>
                                    Add Specific Work Pattern
                                  </Form.Label>
                                  <div
                                    className="checkbox-grid"
                                    style={{
                                      display: "grid",
                                      gridTemplateColumns:
                                        "repeat(auto-fill, minmax(200px, 1fr))",
                                      gap: "10px",
                                      padding: "15px",
                                      backgroundColor: "#fff",
                                      borderRadius: "4px",
                                      border: "1px solid #ced4da",
                                    }}
                                  >
                                    <Form.Check
                                      type="checkbox"
                                      id="workPattern-sedentary"
                                      label="Sedentary"
                                      name="Sedentary"
                                      checked={workPatterns.Sedentary}
                                      onChange={handleWorkPatternChange}
                                    />
                                    <Form.Check
                                      type="checkbox"
                                      id="workPattern-travelling"
                                      label="Travelling"
                                      name="Travelling"
                                      checked={workPatterns.Travelling}
                                      onChange={handleWorkPatternChange}
                                    />
                                    <Form.Check
                                      type="checkbox"
                                      id="workPattern-strenuous"
                                      label="Strenuous (Physical Activity)"
                                      name="Strenuous (Physical Activity)"
                                      checked={
                                        workPatterns[
                                          "Strenuous (Physical Activity)"
                                        ]
                                      }
                                      onChange={handleWorkPatternChange}
                                    />
                                    <Form.Check
                                      type="checkbox"
                                      id="workPattern-mental"
                                      label="Mentally Stressful"
                                      name="Mentally Stressful"
                                      checked={
                                        workPatterns["Mentally Stressful"]
                                      }
                                      onChange={handleWorkPatternChange}
                                    />
                                  </div>
                                </Form.Group>
                              </Col>
                            </Row>
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                  {/* Show update button only when editing */}
                  {isEditing && (
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ marginTop: "30px", float: "right" }}
                    >
                      Update Patient
                    </button>
                  )}
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
