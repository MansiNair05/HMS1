import React, { useState, useEffect } from "react";
import { Row, Col, Form, Container, Card } from "react-bootstrap";
import NavBarD from "./NavbarD";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const BASE_URL = "http://192.168.90.108:5000/api";

export default function Personal() {
  const location = useLocation();
  const [patientId, setPatientId] = useState(
    localStorage.getItem("selectedPatientId")
  );

  const [rowData, setRowData] = useState({});
  const [errors, setErrors] = useState({});

  const [workPatterns, setWorkPatterns] = useState({
    Sedentary: false,
    Travelling: false,
    "Strenuous (Physical Activity)": false,
    "Mentally Stressful": false,
  });

  const [selectedReference, setSelectedReference] = useState("");
  const [referenceDetails, setReferenceDetails] = useState({
    newspaper: "",
    internet: "",
    MediaRef: "",
    TVShow: "",
    reference_doctor_name: "",
    reference_doctor_no: "",
    reference_doctor_speciality: "",
    reference_doctor_location: "",
    reference_doctor_id: "",
    patient_ref_no: "",
    old_patient_name: "",
    friendname: "",
    friendno: "",
    other: "",
    WOM: "",
  });

  const [oldPatientDetails, setOldPatientDetails] = useState({
    patient_ref_no: "", // This will store the phone number
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

    // const saveToDatabase = async () => {
    //   // if (patientId || !rowData.patient_id) return;

    //   try {
    //     const response = await fetch(
    //       `${BASE_URL}/V1/patienttabs/editPersonal/${patientId}`,
    //       {
    //         method: "PUT",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({
    //           ...rowData,
    //           specific_work: rowData.specific_work.join(","), // Convert array to string before saving

    //           selectedReference,
    //           referenceDetails,
    //         }),
    //       }
    //     );

    //     if (!response.ok) {
    //       console.error("Error saving data:", await response.text());
    //     }
    //   } catch (error) {
    //     console.error("Error saving to database:", error);
    //   }
    // };

    // // Add a debounce to prevent too many API calls
    // const timeoutId = setTimeout(() => {
    //   if (Object.keys(rowData).length > 0) {
    //     saveToDatabase();
    //   }
    // }, 1000);

    // return () => clearTimeout(timeoutId);
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

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return ""; // Return empty string if invalid date

      return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD format
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
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
      specific_work: checked
        ? [...(prev.specific_work || []), name] // Add to array if checked
        : (prev.specific_work || []).filter((item) => item !== name),
    }));
  };

  // Modify the handleInputChange function
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRowData((prev) => ({
      ...prev,
      [name]: value, // ✅ Ensure this updates state
    }));

    setRowData((prevState) => {
      let identityType = prevState.identity
        ? prevState.identity.split(",")[0]
        : "";
      let identityNumber = prevState.identity
        ? prevState.identity.split(",")[1] || ""
        : "";

      if (name === "identity") {
        identityType = value; // Store the selected identity type
      } else if (name === "identityNumber") {
        identityNumber = value; // Store the entered identity number
      }

      if (name === "birth_date") {
        const formattedDate = formatDate(value);
        const calculatedAge = calculateAge(formattedDate);
        console.log("Birth Date Changed:", {
          originalValue: value,
          formattedDate: formattedDate,
          calculatedAge: calculatedAge,
        });

        // Update rowData to include identity and identityNumber
        // if (name === "identity") {
        //   const [identityType, identityNumber] = value.split(","); // Split the value
        //   setRowData((prevState) => ({
        //     ...prevState,
        //     identity: identityType, // Set identity type
        //     identityNumber: identityNumber.trim(), // Set identity number
        //   }));
        // }

        setRowData((prevState) => ({
          ...prevState,
          [name]: formattedDate,
          age: calculatedAge,
        }));
      }
      return {
        ...prevState,
        identity: `${identityType},${identityNumber}`, // Store them together
      };
    });
  };

  const handleReferenceChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedReference(selectedValue);

    // If TVShow is selected, set the reference_type and clear the TVShow field
    if (selectedValue === "TVShow") {
      setRowData((prev) => ({
        ...prev,
        reference_type: "TV Show", // Store "TV Show" in reference_type
        ref: "", // Clear previous selection
      }));
    } else {
      setRowData((prev) => ({
        ...prev,
        reference_type: "", // Clear reference_type for other selections
        ref: "", // Clear ref for other selections
      }));
    }
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
    let ref = "";

    switch (selectedReference) {
      case "newspaper":
        reference_type = `newspaper`;
        ref = `${referenceDetails.newspaper || ""}`;
        break;
      case "dr_ref":
        reference_type = `dr_ref`;
        ref = ` ${referenceDetails.reference_doctor_id || ""}`;
        break;
      case "internet":
        reference_type = `internet`;
        ref = `${referenceDetails.internet || ""}`;
        break;

      case "MediaRef":
        reference_type = `MediaRef`;
        ref = `${referenceDetails.MediaRef || ""}`;
        break;
      case "TVShow":
        reference_type = `TVShow`;
        ref = `${referenceDetails.TVShow || ""}`;
        break;
      case "old_ref":
        reference_type = `old_ref`;
        ref = `${oldPatientDetails.patient_ref_no || ""},${
          oldPatientDetails.old_patient_name || ""
        },${oldPatientDetails.old_patient_id_value || ""},${
          oldPatientDetails.old_patient_pincode || ""
        }`;
        break;
      case "family_friends":
        reference_type = `family_friends`;
        ref = `${referenceDetails.friendname || ""},${
          referenceDetails.friendno || ""
        }`;
        break;
      case "hhc_board":
        reference_type = "hhc_board";
        ref = `${referenceDetails.HHC_board || ""}`;
        break;
      case "HHF":
        reference_type = "HHF";
        ref = `${referenceDetails.HHF || ""}`;
        break;
      case "other":
        reference_type = `other`;
        ref = `${referenceDetails.other || ""}`;
        break;
      case "WOM":
        reference_type = `WOM`;
        ref = `${referenceDetails.WOM || ""}`;
        break;
      default:
        reference_type = null;
        ref = null;
    }
    console.log("Reference Type:", reference_type);
    console.log("Reference:", ref);
    setRowData((prev) => ({
      ...prev,
      reference_type,
      ref,
    }));
    try {
      const response = await fetch(
        `${BASE_URL}/V1/patienttabs/editPersonal/${patientId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...rowData,
            specific_work: Array.isArray(rowData.specific_work)
              ? rowData.specific_work.join(",") // Convert array to comma-separated string
              : rowData.specific_work || "",
            reference_type, // Add the reference_type field
            selectedReference,
            patient_type: rowData.patient_type ? 1 : 0,
            ref,
            referenceDetails,
          }),
        }
      );
      // const responseText = await response.text(); // Read the response as text
      //     console.log("Server Response:", responseText);

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
            const workPatternsData = data.data.specific_work
              ? data.data.specific_work.split(",").map((item) => item.trim())
              : [];

            const updatedWorkPatterns = {
              Sedentary: workPatternsData.includes("Sedentary"),
              Travelling: workPatternsData.includes("Travelling"),
              "Strenuous (Physical Activity)": workPatternsData.includes(
                "Strenuous (Physical Activity)"
              ),
              "Mentally Stressful":
                workPatternsData.includes("Mentally Stressful"),
            };

            setWorkPatterns(updatedWorkPatterns);

            // Ensure birth_date is properly formatted
            const formattedData = {
              ...data.data,
              specific_work: workPatternsData, // Store work patterns

              birth_date: data.data.birth_date
                ? formatDate(data.data.birth_date)
                : null,
            };
            setRowData({
              ...formattedData,
              specific_work: workPatternsData,
              patient_type: data.data.patient_type || 0, // Ensures checkbox is handled
            });
            if (data.data.reference_type) {
              setSelectedReference(data.data.reference_type);
            }
            if (data.data.ref) {
              setReferenceDetails((prev) => ({
                ...prev,
                [data.data.reference_type]: data.data.ref,
              }));
            }
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

  // Add this state for doctor search
  const [doctorSearchResults, setDoctorSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Add this function to fetch doctor details
  const searchDoctorByName = async (name) => {
    if (!name || name.length < 3) {
      setDoctorSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `${BASE_URL}/V1/Patients/listDoctor?name=${name}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Filter the results based on the search term
        const filteredResults = data.data.filter(
          (doctor) =>
            doctor.ref_doctor_name.toLowerCase().includes(name.toLowerCase()) ||
            (doctor.reference_doctor_speciality &&
              doctor.reference_doctor_speciality
                .toLowerCase()
                .includes(name.toLowerCase()))
        );
        console.log("Filtered doctor results:", filteredResults);
        setDoctorSearchResults(filteredResults);
      }
    } catch (error) {
      console.error("Error searching doctor:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Add these new states near the top of your component
  const [patientSearchResults, setPatientSearchResults] = useState([]);
  const [isSearchingPatient, setIsSearchingPatient] = useState(false);

  // Add this new function alongside your other functions
  const searchPatientByPhone = async (phone) => {
    if (!phone || phone.length < 10) {
      setPatientSearchResults([]);
      return;
    }

    setIsSearchingPatient(true);
    try {
      console.log("Calling API with phone:", phone); // ✅ Log input phone

      const response = await fetch(
        `${BASE_URL}/V1/Patients/listRefPatient/${phone}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("API Response Status:", response.status); // ✅ Log API status

      if (response.ok) {
        const data = await response.json();
        console.log("API Response Data:", data); // ✅ Log full API response

        if (data.statusCode === 200 && data.data.refPatientData) {
          // Access the nested refPatientData
          const results = Array.isArray(data.data.refPatientData)
            ? data.data.refPatientData
            : [data.data.refPatientData];
          setPatientSearchResults(results);
          console.log("Updated Patient Search Results:", results); // ✅ Log updated results
        } else {
          console.log("No patient found.");
          setPatientSearchResults([]);
        }
      } else {
        console.error("API Error:", response.status, await response.text());
      }
    } catch (error) {
      console.error("Error searching patient:", error);
    } finally {
      setIsSearchingPatient(false);
    }
  };

  // Debug state updates
  useEffect(() => {
    console.log("Updated state in UI:", patientSearchResults);
  }, [patientSearchResults]);

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
                background: "#f8f9fa",
                border: "3px solid #00bcd4",
              }}
            >
              <Card.Body>
                <Form>
                  <Row>{/* Add more form fields as needed */}</Row>
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{
                      marginTop: "5px",
                      float: "right",
                      backgroundColor: "#00bcd4",
                      color: "white",
                    }}
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
                          readOnly={!isEditing}
                          // readOnly
                          style={{
                            backgroundColor: "#e9ecef", // Light grey background to indicate read-only
                            color: "#6c757d", // Grey text color
                            // cursor: "not-allowed", // Show "not-allowed" cursor
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
                            <option value="PREFIX" disabled>
                              PREFIX
                            </option>
                            <option value="MR">MR</option>
                            <option value="MS">MS</option>
                            <option value="MRS">MRS</option>
                            {/* <option value="MASTER">MASTER</option> */}
                          </select>
                        </div>
                        {/* Patient Name Input */}
                        <Col md={6}>
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
                              name="name"
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
                          <label
                            htmlFor="patient_type"
                            className="d-flex align-items-center"
                            style={{ cursor: "pointer" }}
                          >
                            <input
                              type="checkbox"
                              id="patient_type"
                              name="patient_type"
                              checked={rowData.patient_type === 1}
                              onChange={(e) =>
                                setRowData((prev) => ({
                                  ...prev,
                                  patient_type: e.target.checked ? 1 : 0, // Updates state correctly
                                }))
                              }
                              style={{
                                cursor: "pointer",
                                marginRight: "0.5rem",
                              }}
                            />
                            <span style={{ fontSize: "0.9rem" }}>VIP</span>
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
                    <Col md={2}>
                      <Form.Group className="mb-20">
                        <Form.Label>Gender</Form.Label>
                        <Form.Control
                          as="select"
                          name="sex"
                          value={rowData.sex || rowData?.sex}
                          onChange={handleInputChange}
                        >
                          <option value="" disabled>
                            Select Gender
                          </option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </Form.Control>
                      </Form.Group>
                    </Col>
                    {/* Mobile No */}
                    <Col md={2} className="mb-4">
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
                  </Row>
                  <Row>
                    <Col md={2} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Alternate No</Form.Label>
                        <Form.Control
                          id="mobile_2"
                          type="number"
                          name="alternateNo"
                          value={rowData.mobile_2}
                          onChange={handleInputChange}
                          placeholder="Alternate Number"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Pincode No</Form.Label>
                        <Form.Control
                          id="pincode"
                          type="number"
                          name="pincode"
                          placeholder="Enter Pincode No"
                          value={rowData.pincode}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={2}>
                      <Form.Group className="mb-3">
                        <Form.Label>Blood Group</Form.Label>
                        <Form.Select
                          type="text"
                          name="blood_group"
                          value={rowData.blood_group || rowData?.blood_group}
                          onChange={(e) =>
                            setRowData((prev) => ({
                              ...prev,
                              blood_group: e.target.value,
                            }))
                          }
                        >
                          <option value="">Blood Group</option>
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
                    <Col md={3} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Identity</Form.Label>
                        <Form.Select
                          id="identity"
                          name="identity"
                          value={
                            rowData.identity
                              ? rowData.identity.split(",")[0]
                              : ""
                          }
                          onChange={handleInputChange}
                        >
                          <option value="" disabled>
                            Select Identity
                          </option>
                          <option value="Aadhaar No">Aadhaar No</option>
                          <option value="Passport No">Passport No</option>
                          <option value="Voter No">Voter No</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>Identity Number</Form.Label>
                        <Form.Control
                          type="text"
                          name="identityNumber"
                          value={
                            rowData.identity
                              ? rowData.identity.split(",")[1] || ""
                              : ""
                          }
                          onChange={handleInputChange}
                          placeholder="Enter Identity Number"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <br />
                  <Row>
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
                  </Row>
                  <br />
                  <Row>
                    <Col md={12}>
                      <Form.Group className="mb-4">
                        <Form.Label>Add Specific Work Pattern</Form.Label>
                        <div className="checkbox-grid">
                          <Row>
                            <Col md={2}>
                              <label htmlFor="workPattern-sedentary">
                                <input
                                  type="checkbox"
                                  id="workPattern-sedentary"
                                  name="Sedentary"
                                  checked={workPatterns.Sedentary}
                                  onChange={handleWorkPatternChange}
                                  style={{ marginRight: "5px" }}
                                />
                                Sedentary
                              </label>
                            </Col>
                            <Col md={2}>
                              <label htmlFor="workPattern-travelling">
                                <input
                                  type="checkbox"
                                  id="workPattern-travelling"
                                  name="Travelling"
                                  checked={workPatterns.Travelling}
                                  onChange={handleWorkPatternChange}
                                  style={{ marginRight: "5px" }}
                                />
                                Travelling
                              </label>
                            </Col>
                            <Col md={3}>
                              <label htmlFor="workPattern-strenuous">
                                <input
                                  type="checkbox"
                                  id="workPattern-strenuous"
                                  name="Strenuous (Physical Activity)"
                                  checked={
                                    workPatterns[
                                      "Strenuous (Physical Activity)"
                                    ]
                                  }
                                  onChange={handleWorkPatternChange}
                                  style={{ marginRight: "5px" }}
                                />
                                Strenuous (Physical Activity)
                              </label>
                            </Col>
                            <Col md={2}>
                              <label htmlFor="workPattern-mental">
                                <input
                                  type="checkbox"
                                  id="workPattern-mental"
                                  name="Mentally Stressful"
                                  checked={workPatterns["Mentally Stressful"]}
                                  onChange={handleWorkPatternChange}
                                  style={{ marginRight: "5px" }}
                                />
                                Mentally Stressful
                              </label>
                            </Col>
                          </Row>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Reference</Form.Label>
                        <Form.Select
                          value={selectedReference}
                          onChange={handleReferenceChange}
                          className="mb-3"
                        >
                          <option value="" disabled>
                            Choose Reference
                          </option>
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
                                  onChange={(e) => {
                                    handleReferenceDetailsChange(e); // Update referenceDetails
                                    setRowData((prev) => ({
                                      ...prev,
                                      ref: paper, // Store the selected TV show in ref
                                      reference_type: "newspaper", // Store "Newspaper" in reference_type
                                    }));
                                  }}
                                  checked={referenceDetails.newspaper === paper}
                                />
                              ))}
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
                                  onChange={(e) => {
                                    handleReferenceDetailsChange(e); // Update referenceDetails
                                    setRowData((prev) => ({
                                      ...prev,
                                      ref: source, // Store the selected TV show in ref
                                      reference_type: "internet", // Store "Newspaper" in reference_type
                                    }));
                                  }}
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
                                  placeholder="Search Doctor Name (min: 3 characters)"
                                  name="reference_doctor_name"
                                  value={referenceDetails.reference_doctor_name}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    handleReferenceDetailsChange(e);
                                    searchDoctorByName(value);
                                  }}
                                />
                                {/* Search Results Dropdown */}
                                {isSearching && <div>Searching...</div>}
                                {doctorSearchResults.length > 0 && (
                                  <div
                                    className="search-results"
                                    style={{
                                      position: "absolute",
                                      zIndex: 1000,
                                      backgroundColor: "white",
                                      border: "1px solid #ddd",
                                      borderRadius: "4px",
                                      maxHeight: "200px",
                                      overflowY: "auto",
                                      width: "15%",
                                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                    }}
                                  >
                                    {doctorSearchResults.map(
                                      (doctor, index) => (
                                        <div
                                          key={index}
                                          className="search-result-item"
                                          style={{
                                            padding: "10px",
                                            cursor: "pointer",
                                            borderBottom: "1px solid #eee",
                                            "&:hover": {
                                              backgroundColor: "#f5f5f5",
                                            },
                                          }}
                                          onClick={() => {
                                            setReferenceDetails((prev) => ({
                                              ...prev,
                                              reference_doctor_name:
                                                doctor.ref_doctor_name || "",
                                              reference_doctor_no:
                                                doctor.ref_doctor_phone || "",
                                              reference_doctor_speciality:
                                                doctor.reference_doctor_speciality ||
                                                "",
                                              reference_doctor_id:
                                                doctor.reference_doctor_id ||
                                                "",
                                              reference_doctor_location:
                                                doctor.reference_doctor_location ||
                                                "",
                                            }));
                                            setDoctorSearchResults([]); // Clear search results after selection
                                          }}
                                        >
                                          <div style={{ fontWeight: "bold" }}>
                                            {doctor.ref_doctor_name}
                                          </div>
                                          <div
                                            style={{
                                              fontSize: "0.9em",
                                              color: "#666",
                                            }}
                                          ></div>
                                        </div>
                                      )
                                    )}
                                  </div>
                                )}
                              </Col>
                              <Col md={6}>
                                <Form.Control
                                  type="text"
                                  placeholder="Doctor Phone No"
                                  name="reference_doctor_no"
                                  value={referenceDetails.reference_doctor_no}
                                  onChange={handleReferenceDetailsChange}
                                  readOnly
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
                                  readOnly
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
                                  readOnly
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
                                  onChange={(e) => {
                                    handleReferenceDetailsChange(e); // Update referenceDetails
                                    setRowData((prev) => ({
                                      ...prev,
                                      ref: media, // Store the selected TV show in ref
                                      reference_type: "MediaRef", // Store "Newspaper" in reference_type
                                    }));
                                  }}
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
                                  onChange={(e) => {
                                    handleReferenceDetailsChange(e); // Update referenceDetails
                                    setRowData((prev) => ({
                                      ...prev,
                                      ref: show, // Store the selected TV show in ref
                                      reference_type: "TVShow", // Store "Newspaper" in reference_type
                                    }));
                                  }}
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
                              <Col
                                md={12}
                                style={{
                                  marginBottom: "20px",
                                  position: "relative",
                                }}
                              >
                                <Form.Control
                                  type="text"
                                  placeholder="Phone Number"
                                  name="patient_ref_no"
                                  value={oldPatientDetails.patient_ref_no} // This should show the phone number
                                  onChange={(e) => {
                                    setOldPatientDetails((prev) => ({
                                      ...prev,
                                      patient_ref_no: e.target.value,
                                    }));
                                    searchPatientByPhone(e.target.value);
                                  }}
                                />

                                {/* Search Results Dropdown */}
                                {(isSearchingPatient ||
                                  patientSearchResults.length > 0) && (
                                  <div
                                    className="search-results"
                                    style={{
                                      position: "absolute",
                                      zIndex: 1000,
                                      backgroundColor: "white",
                                      border: "1px solid #ddd",
                                      borderRadius: "4px",
                                      maxHeight: "300px", // Increased height
                                      overflowY: "auto",
                                      width: "100%", // You can adjust this width as needed
                                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                    }}
                                  >
                                    {isSearchingPatient && (
                                      <div>Searching...</div>
                                    )}
                                    {patientSearchResults.length > 0 ? (
                                      patientSearchResults.map(
                                        (patient, index) => {
                                          console.log(
                                            "Rendering patient:",
                                            patient
                                          ); // ✅ Debug
                                          return (
                                            <div
                                              key={index}
                                              className="search-result-item"
                                              style={{
                                                display: "flex", // Makes the content horizontal
                                                padding: "10px",
                                                cursor: "pointer",
                                                borderBottom: "1px solid #eee",
                                                backgroundColor: "#fff",
                                                alignItems: "center", // Ensures the items align vertically in the center
                                                justifyContent: "space-between", // Spreads out the content evenly
                                              }}
                                              onClick={() => {
                                                console.log(
                                                  "Selected patient:",
                                                  patient
                                                ); // ✅ Debug
                                                setOldPatientDetails({
                                                  patient_ref_no:
                                                    patient.phone || "", // Fill phone number here
                                                  old_patient_name:
                                                    patient.name || "",
                                                  old_patient_id_value:
                                                    patient.patient_id || "",
                                                  old_patient_pincode:
                                                    patient.pincode || "",
                                                });
                                                setPatientSearchResults([]); // Clear search results after selection
                                              }}
                                            >
                                              <div
                                                style={{
                                                  fontWeight: "bold",
                                                  flex: 2,
                                                  fontSize: "1.1em",
                                                }}
                                              >
                                                {patient.name}
                                              </div>
                                              <div
                                                style={{
                                                  fontSize: "0.9em",
                                                  color: "#666",
                                                  flex: 1,
                                                }}
                                              >
                                                Pincode: {patient.pincode}
                                              </div>
                                              <div
                                                style={{
                                                  fontSize: "0.9em",
                                                  color: "#666",
                                                  flex: 1,
                                                }}
                                              >
                                                Phone: {patient.phone}
                                              </div>
                                            </div>
                                          );
                                        }
                                      )
                                    ) : (
                                      <div
                                        style={{
                                          padding: "10px",
                                          color: "#666",
                                        }}
                                      >
                                        No patient found
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Patient Details Inputs */}
                                {/* <Col md={4}>
                                  <Form.Control
                                    type="text"
                                    placeholder="Phone Number"
                                    name="patient_ref_no"
                                    value={oldPatientDetails.patient_ref_no} // Show phone number here
                                    onChange={(e) => {
                                      setOldPatientDetails((prev) => ({
                                        ...prev,
                                        patient_ref_no: e.target.value,
                                      }));
                                    }}
                                    readOnly
                                  />
                                </Col> */}
                                <Col md={12}>
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
                                    readOnly
                                  />
                                </Col>
                                <Col md={12}>
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
                                    readOnly
                                  />
                                </Col>
                                <Col md={12}>
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
                                    readOnly
                                  />
                                </Col>
                              </Col>
                              {/*  <Col md={4}>
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
                                  readOnly
                                />
                              </Col>
                              <Col md={4}>
                                <Form.Control
                                  type="text"
                                  placeholder="Patient ID"
                                  name="old_patient_id_value"
                                  value={oldPatientDetails.old_patient_id_value}
                                  onChange={(e) => {
                                    setOldPatientDetails((prev) => ({
                                      ...prev,
                                      old_patient_id_value: e.target.value,
                                    }));
                                  }}
                                  readOnly
                                />
                              </Col>
                              <Col md={4}>
                                <Form.Control
                                  type="text"
                                  placeholder="Pincode"
                                  name="old_patient_pincode"
                                  value={oldPatientDetails.old_patient_pincode}
                                  onChange={(e) => {
                                    setOldPatientDetails((prev) => ({
                                      ...prev,
                                      old_patient_pincode: e.target.value,
                                    }));
                                  }}
                                  readOnly
                                />
                              </Col> */}
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
                                <Form.Control
                                  type="text"
                                  placeholder="Friend Name"
                                  name="friendname"
                                  value={referenceDetails.friendname}
                                  onChange={handleReferenceDetailsChange}
                                />
                              </Col>
                              <Col md={6}>
                                <Form.Control
                                  type="text"
                                  placeholder="Friend Number"
                                  name="friendno"
                                  value={referenceDetails.friendno}
                                  onChange={handleReferenceDetailsChange}
                                />
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
                            <Form.Label>Other Detail</Form.Label>
                            <Row>
                              <Col md={12}>
                                <Form.Check
                                  type="radio"
                                  name="HHC_board"
                                  label="HHC Board"
                                  value="HHC_board"
                                  onChange={handleReferenceDetailsChange}
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
                            <Form.Label>Other Detail</Form.Label>
                            <Row>
                              <Col md={12}>
                                <Form.Check
                                  type="radio"
                                  name="HHF"
                                  label="HHF"
                                  value="HHF"
                                  onChange={handleReferenceDetailsChange}
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
                                <Form.Control
                                  type="text"
                                  placeholder="Other"
                                  name="other"
                                  value={referenceDetails.other}
                                  onChange={handleReferenceDetailsChange}
                                />
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
                                <Form.Control
                                  type="text"
                                  placeholder="WOM"
                                  name="WOM"
                                  value={referenceDetails.WOM}
                                  onChange={handleReferenceDetailsChange}
                                />
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
                      type="button"
                      onClick={handleSubmit}
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
      <style>
        {`
          /* Base styles with improved performance */
          * {
            box-sizing: border-box;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }

          /* Form Layout Standardization */
          .form-group {
            margin-bottom: 1.5rem;
            width: 100%;
          }

          /* Standardize all form controls */
          .form-control,
          .form-select,
          input[type="text"],
          input[type="email"],
          input[type="number"],
          input[type="date"],
          select,
          textarea {
            height: 45px;
            padding: 0.5rem 1rem;
            font-size: 0.95rem;
            line-height: 1.5;
            border-radius: 8px;
            border: 2px solid #dee2e6;
            width: 100%;
            margin-bottom: 1rem;
            transition: all 0.2s ease-in-out;
            background-color: #ffffff;
            color: #2c3e50;
          }

          /* Ensure DatePicker has consistent styling */
          .react-datepicker-wrapper {
            width: 100%;
          }

          .react-datepicker-wrapper input {
            height: 45px;
            padding: 0.5rem 1rem;
            font-size: 0.95rem;
            line-height: 1.5;
            border-radius: 8px;
            border: 2px solid #dee2e6;
            width: 100%;
          }

          /* Row and Column Spacing */
          .row {
            margin-bottom: 1rem;
          }

          .col, 
          [class^="col-"] {
            padding: 0 1rem;
          }

          /* Form Labels */
          .form-label {
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 0.5rem;
            font-size: 0.95rem;
            display: block;
          }

          /* Focus States */
          .form-control:focus,
          .form-select:focus,
          input:focus,
          select:focus,
          textarea:focus {
            border-color: #00bcd4;
            box-shadow: 0 0 0 3px rgba(0, 188, 212, 0.1);
            outline: none;
          }

          /* Card and Section Styling */
          .card {
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            margin-bottom: 2rem;
          }

          .card-body {
            padding: 0;
          }

          /* Search Results Consistency */
          .search-results {
            margin-top: 0.5rem;
            border-radius: 8px;
            border: 2px solid #dee2e6;
            max-height: 200px;
            overflow-y: auto;
          }

          .search-result-item {
            padding: 0.75rem 1rem;
            border-bottom: 1px solid #dee2e6;
          }

          /* Checkbox and Radio Consistency */
          .form-check {
            padding: 0.5rem 0;
            margin-bottom: 0.5rem;
          }

          .form-check-input {
            margin-right: 0.5rem;
          }

          /* Button Consistency */
          .btn {
            height: 45px;
            padding: 0 1.5rem;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }

          /* Responsive Adjustments */
          @media (max-width: 768px) {
            .form-control,
            .form-select,
            input[type="text"],
            input[type="email"],
            input[type="number"],
            input[type="date"],
            select,
            textarea,
            .btn {
              height: 40px;
            }

            .card {
              padding: 1rem;
            }

            .col, 
            [class^="col-"] {
              padding: 0 0.5rem;
            }
          }

          /* Reference Section Styling */
          .reference-details {
            padding: 1rem;
            border: 2px solid #dee2e6;
            border-radius: 8px;
            margin-top: 1rem;
          }

          /* Maintain existing color scheme and animations */
          .btn-primary {
            background: linear-gradient(45deg, #00bcd4, #00acc1);
            border: none;
            border-radius: 8px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 4px 15px rgba(0, 188, 212, 0.2);
          }

          .btn-primary:hover {
            background: linear-gradient(45deg, #00acc1, #0097a7);
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 188, 212, 0.3);
          }

          /* Animation and Accessibility */
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            * {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
              scroll-behavior: auto !important;
            }
          }
        `}
      </style>
    </div>
  );
}
