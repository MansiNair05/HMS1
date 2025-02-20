import { useState, useEffect } from "react";
import {
  Row,
  Col,
  Form,
  Container,
  Card,
  Table,
  Button,
  Dropdown,
} from "react-bootstrap";
import NavBarD from "./NavbarD";

const BASE_URL = "http://192.168.90.158:5000/api"; // Update with your backend API base URL

export default function DischargeCard() {
  const [discharge, setDischarge] = useState([]);
  const [consultants, setConsultants] = useState([]);
  const [types, setTypes] = useState([]);
  const [assistants, setAssistants] = useState([]);
  const [surgeons, setSurgeons] = useState([]);
  const [treatings, setTreatings] = useState([]);
  const [checks, setChecks] = useState([]);
  const [mades, setMades] = useState([]);
  const [surgeries, setSurgeries] = useState([]);
  const [injections, setInjections] = useState([]);
  const [adviceMedicineP, setdAdviceMedicineP] = useState([]);
  const [adviceMedicineU, setdAdviceMedicineU] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [patientId, setPatientId] = useState(
    localStorage.getItem("selectedPatientId")
  );
  const [showEditButton, setShowEditButton] = useState(false); // Controls visibility of "Edit Diagnosis"
  const [isDisabled, setIsDisabled] = useState(false); // Controls edit mode
  const [disablePreviousButton, setDisablePreviousButton] = useState(false); // Disables "Previous Records" after clicking
  const [formData, setFormData] = useState({
    prescription_type: "",
    name: "",
    address: "",
    age: "",
    sex: "",
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
    chife_complaints: "",
    past_history: "",
    surgical_history: "",
    allergies: "",
    surgery_procedure: "",
    surgery_note: "",
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
    injectionDetails: [],
    qty: "",
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
    medicine_name: "",
    medicineType: "",
    medicalStrength: "",
    medicineUnit: "",
    medicineRoute: "",
    medicineStatus: "",
  });

  const [dropdownOptions, setDropdownOptions] = useState([]); // Store API options
  const [selectedOptions, setSelectedOptions] = useState([]); // Track selected checkboxes

  // Fetch options from API
  useEffect(() => {
    const fetchDropdownOptions = async () => {
      try {
        const endpoints = [
          {
            url: "/V1/patienttabsdp/consultant_dropdown",
            setter: setConsultants,
          },
          {
            url: "/V1/patienttabsdp/surgeryType_dropdown",
            setter: setTypes,
          },
          {
            url: "/V1/patienttabsdp/assistantDoc_dropdown",
            setter: setAssistants,
          },
          {
            url: "/V1/patienttabsdp/surgeon_dropdown",
            setter: setSurgeons,
          },
          {
            url: "/V1/patienttabsdp/surgeon_dropdown",
            setter: setTreatings,
          },
          {
            url: "/V1/patienttabsdp/surgeryAdvice_dropdown",
            setter: setSurgeries,
          },
          {
            url: "/V1/patienttabsdp/checkedBy_dropdown",
            setter: setChecks,
          },
          {
            url: "/V1/patienttabsdp/madeby_dropdown",
            setter: setMades,
          },
          {
            url: "/V1/patienttabsdp/injection_dropdown",
            setter: setInjections,
          },
          {
            url: "/V1/patienttabsdp/proctologyMedicine_dropdown",
            setter: setdAdviceMedicineP,
          },
          {
            url: "/V1/patienttabsdp/urologyMedicine_dropdown",
            setter: setdAdviceMedicineU,
          },
        ];

        const fetchPromises = endpoints.map(async ({ url, setter }) => {
          const response = await fetch(`${BASE_URL}${url}`);
          const data = await response.json();
          if (!response.ok) {
            throw new Error(
              `Error fetching ${url}: ${data.message || "Unknown error"}`
            );
          }
          setter(data.data || []);
        });

        await Promise.all(fetchPromises);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchDropdownOptions();
  }, []);

  useEffect(() => {
    const storedPatientId = localStorage.getItem("selectedPatientId");
    console.log("Retrieved from localStorage:", storedPatientId);
    if (storedPatientId) setPatientId(storedPatientId);
  }, []);

  // Initial useEffect to fetch basic patient details
  useEffect(() => {
    if (!patientId) {
      console.warn("No patientId found, skipping fetch");
      return;
    }

    const fetchInitialPatientData = async () => {
      try {
        console.log("Fetching initial patient data for ID:", patientId);

        const response = await fetch(
          `${BASE_URL}/V1/dischargeCard/listDischargeCard/${patientId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch patient details");
        }

        const result = await response.json();
        console.log("Initial patient data response:", result);

        // Extract patient data from the response
        const patientData = result.data?.patientData?.[0];

        if (patientData) {
          // Set only the basic patient details
          setFormData((prevState) => ({
            ...prevState,
            name: patientData.name || "",
            age: patientData.age || "",
            gender: patientData.sex || "", // Note: API uses 'sex' instead of 'gender'
            address: patientData.address || "",
          }));

          console.log("Initial patient details set:", {
            name: patientData.name,
            age: patientData.age,
            gender: patientData.sex,
            address: patientData.address,
          });
        }
      } catch (error) {
        console.error("Error fetching initial patient data:", error);
      }
    };

    fetchInitialPatientData();
  }, [patientId]);

  useEffect(() => {
    if (!patientId) {
      console.warn("No patientId found, skipping fetch");
      return;
    }
    const fetchPatientData = async () => {
      try {
        console.log("Fetching data for patient ID:", patientId);

        const response = await fetch(
          `${BASE_URL}/V1/dischargeCard/listDischargeCard/${patientId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          console.error(
            "API Response Error:",
            response.status,
            await response.text()
          );
          return;
        }

        const data = await response.json();
        console.log("Fetched Data:", data);

        if (data?.data?.patientData) {
          // Set basic patient details
          setFormData((prevState) => ({
            ...prevState,
            name: data.data.patientData.name || "",
            age: data.data.patientData.age || "",
            gender: data.data.patientData.gender || "",
            address: data.data.patientData.address || "",
          }));
        }

        // Set discharge card data if available
        if (data?.data?.dischargeCardData) {
          setFormData((prevState) => ({
            ...prevState,
            ...data.data.dischargeCardData,
            timings: data.data.dischargeCardData.timings || {
              BeforeBreakfast: false,
              AfterBreakfast: false,
              BeforeLunch: false,
              AfterLunch: false,
              BeforeDinner: false,
              AfterDinner: false,
              AfterEveningSnacks: false,
            },
          }));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPatientData();
  }, [patientId]);

  // Track formData updates
  useEffect(() => {
    console.log("Updated formData:", formData);
  }, [formData]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value, // Handle both checkbox and other input types
    }));
  };

  const handleAddToTable = () => {
    if (
      (!formData.adviceMedicine, !formData.medicine_quantity, !formData.days)
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const newRow = {
      medicine: formData.adviceMedicine,
      qty: formData.medicine_quantity,
      mealTimings:
        Object.keys(formData.timings)
          .filter((timing) => formData.timings[timing])
          .join(", ") || "None",
      days: formData.days,
    };

    setTableData((prevData) => [...prevData, newRow]);
    setFormData((prev) => ({
      ...prev,
      adviceMedicine: "",
      medicine_quantity: "",
      days: "",
    }));
  };

  const addInjectionDetails = () => {
    if (
      !formData.treatmentGiven ||
      !formData.times ||
      !formData.medicineRoute
    ) {
      alert("Please fill in all required fields before adding an injection.");
      return;
    }

    const newInjection = {
      treatmentGiven: formData.treatmentGiven,
      timesGiven: formData.times,
      medicineRoute: formData.medicineRoute,
    };

    setFormData((prev) => ({
      ...prev,
      injectionDetails: [...(prev.injectionDetails || []), newInjection],
    }));
  };

  const removeInjection = (index) => {
    setFormData((prev) => ({
      ...prev,
      injectionDetails: prev.injectionDetails.filter((_, i) => i !== index),
    }));
  };

  const addDischargeTreatDetails = () => {
    if (
      !formData.adviceMedicine ||
      !formData.medicine_quantity ||
      !formData.medicine_days
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      dischargeTreat: [
        ...(prev.dischargeTreat || []),
        {
          adviceMedicine: prev.adviceMedicine,
          medicine_quantity: prev.medicine_quantity,
          medicine_days: prev.medicine_days,
          mealTimings:
            Object.keys(prev.timings)
              .filter((timing) => prev.timings[timing])
              .join(", ") || "None",
        },
      ],
      adviceMedicine: "",
      medicine_quantity: "",
      medicine_days: "",
      timings: Object.fromEntries(
        Object.keys(prev.timings).map((key) => [key, false])
      ),
    }));
  };
  const removeDischarge = (index) => {
    setFormData((prev) => ({
      ...prev,
      dischargeDetails: prev.dischargeDetails.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const requestBody = {
        patientId: patientId,
        ...formData,
        is_deleted: 0,
        doctor_id: localStorage.getItem("doctor_id") || "",
        creation_timestamp: new Date().toISOString(),
      };

      const response = await fetch(
        `${BASE_URL}/V1/dischargeCard/addDischargeCard/${patientId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();

      // First update the states
      setIsDisabled(true);
      setShowEditButton(true);
      setDisablePreviousButton(true);

      // Then show the alert
      alert("Discharge Card submitted successfully!");
    } catch (error) {
      console.error("Error saving discharge card:", error);
    }
  };

  // Handle checkbox selection change for test type
  const handleSurgeryTypeChange = (e, surgery_type) => {
    const { checked } = e.target;
    setSelectedOptions((prevState) => {
      const updatedSurgeryTypes = checked
        ? [...prevState.surgery_type, surgery_type] // Add the surgery type if checked
        : prevState.surgery_type.filter((item) => item !== surgery_type); // Remove if unchecked

      return {
        ...prevState,
        surgery_type: updatedSurgeryTypes,
      };
    });
  };

  const [previousRecordDate, setPreviousRecordDate] = useState("");
  const fetchPreviousRecords = async () => {
    try {
      console.log("Fetching previous records for patientId:", patientId);

      const response = await fetch(
        `${BASE_URL}/V1/dischargeCard/listDischargeCard/${patientId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch previous records");
      }

      const result = await response.json();
      console.log("Previous Records Data:", result);

      if (!result?.data?.dischargeCardData) {
        alert("No previous records found.");
        return;
      }

      const dischargeCard = result.data.dischargeCardData;
      const patientData = result.data.patientData?.[0];

      // Log the data we're working with
      console.log("Discharge Card Data:", dischargeCard);
      console.log("Patient Data:", patientData);

      // Update form data
      setFormData((prevData) => ({
        ...prevData,
        // Patient basic details
        name: patientData?.name || "",
        age: patientData?.age || "",
        gender: patientData?.sex || "",
        address: patientData?.address || "",

        // Dropdown values
        prescription_type: dischargeCard?.prescription_type || "",
        consultantName: dischargeCard?.consultant_name || "",
        surgery_type: dischargeCard?.surgery_type || "",
        assistanceDoctor: dischargeCard?.assistanceDoctor || "",
        surgeonDoctor: dischargeCard?.surgeonDoctor || "",
        madeby: dischargeCard?.madeby || "",
        checkedby: dischargeCard?.checkedby || "",
        treatingby: dischargeCard?.treatingby || "",
        surgeryadvice: dischargeCard?.surgeryadvice || "",

        // Other discharge card details
        DOA: formatDate(dischargeCard?.DOA) || "",
        DOA_time: dischargeCard?.DOA_time || "",
        DOD: formatDate(dischargeCard?.DOD) || "",
        DOD_time: dischargeCard?.DOD_time || "",
        IPDNo: dischargeCard?.IPDNo || "",
        sPO2: dischargeCard?.sPO2 || "",
        BP: dischargeCard?.BP || "",
        pulse: dischargeCard?.pulse || "",
        rr: dischargeCard?.rr || "",
        temp: dischargeCard?.temp || "",
        past_history: dischargeCard?.past_history || "",
        allergies: dischargeCard?.allergies || "",
        surgery_note: dischargeCard?.surgery_note || "",
        investigation: dischargeCard?.investigation || "",
        diagnosis: dischargeCard?.diagnosis || "",
        local_care: dischargeCard?.local_care || "",
        carenote: dischargeCard?.carenote || "",
        dateOfIssue: formatDate(dischargeCard?.dateOfIssue) || "",
        Follow_date: formatDate(dischargeCard?.Follow_date) || "",
        treatmentGiven: dischargeCard?.treatmentGiven || "",
      }));

      // Update selected options for dropdowns
      setSelectedOptions({
        prescription_type: dischargeCard?.prescription_type || "",
        consultantName: dischargeCard?.consultant_name || "",
        surgery_type: dischargeCard?.surgery_type
          ? [dischargeCard.surgery_type]
          : [],
        assistanceDoctor: dischargeCard?.assistanceDoctor || "",
        surgeonDoctor: dischargeCard?.surgeonDoctor || "",
        madeby: dischargeCard?.madeby || "",
        checkedby: dischargeCard?.checkedby || "",
        treatingby: dischargeCard?.treatingby || "",
        surgeryadvice: dischargeCard?.surgeryadvice || "",
      });

      // Update medicine-related dropdowns if available
      if (result.data.medicineData?.length > 0) {
        const medicineData = result.data.medicineData[0];
        setFormData((prevData) => ({
          ...prevData,
          adviceMedicine: medicineData.medicine_name || "",
          medicine_quantity: medicineData.quantity || "",
          medicine_days: medicineData.days || "",
          timings: medicineData.timings || {
            BeforeBreakfast: false,
            AfterBreakfast: false,
            BeforeLunch: false,
            AfterLunch: false,
            BeforeDinner: false,
            AfterDinner: false,
            AfterEveningSnacks: false,
          },
        }));
      }

      // Update injection details if available
      if (dischargeCard?.injectionDetails?.length > 0) {
        setFormData((prevData) => ({
          ...prevData,
          injectionDetails: dischargeCard.injectionDetails,
        }));
      }

      // Show the "Edit Diagnosis" button
      setShowEditButton(true);
      // Disable "Previous Records" button after clicking it
      setDisablePreviousButton(true);
      // Disable form fields
      setIsDisabled(true);

      console.log("Updated form data:", formData);
      console.log("Updated selected options:", selectedOptions);

      setPreviousRecordDate(dischargeCard.dateOfIssue || "");
    } catch (error) {
      console.error("Error fetching previous records:", error);
      alert("Failed to fetch previous records.");
    }
  };

  // Helper function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toISOString().split("T")[0]; // Converts to YYYY-MM-DD format
    } catch (error) {
      console.error("Date formatting error:", error);
      return "";
    }
  };

  // Enable form editing when "Edit Diagnosis" is clicked
  const handleEditDischargeCard = () => {
    setIsDisabled(false);
    alert("Editing mode enabled. You can now modify the diagnosis details.");
  };

  const handleNewRecord = () => {
    setFormData({
      chife_complaints: "",
      past_history: "",
      surgical_history: "",
      allergies: "",
      surgical_procedure: "",
      surgeryNote: "",
      diagnosis: "",
      local_care: "",
      carenote: "",
      assistanceDoctor: "",
      Follow_date: "",
      surgeonDoctor: "",
      madeby: "",
      checkedby: "",
      treatingby: "",
      surgeryadvice: "",
      investigation: "",
      IPDNo: "",
      sPO2: "",
      BP: "",
      pulse: "",
      rr: "",
      temp: "",
    });

    // Hide "Edit Diagnosis" button when creating a new record
    setShowEditButton(false);
    // Enable the "Previous Records" button when creating a new record
    setDisablePreviousButton(false);
    setIsDisabled(false); // Allow editing for a new record
    alert("New Record: You can now enter new data.");
  };

  const handlePrint = () => {
    window.print();
  };

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
      <NavBarD pagename="Discharge Card" />
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
                    onClick={handleNewRecord}
                  >
                    New Record
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{
                      float: "right",
                    }}
                    onClick={handlePrint}
                  >
                    Print
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ float: "right", marginRight: "7px" }}
                    onClick={fetchPreviousRecords}
                    disabled={disablePreviousButton}
                  >
                    Previous Records
                  </button>
                  {/* Show Edit Diagnosis Button only after clicking "Previous Records" */}
                  {showEditButton && (
                    <button
                      type="button"
                      className="btn btn-warning"
                      style={{ float: "right", marginRight: "7px" }}
                      onClick={handleEditDischargeCard}
                    >
                      Edit Discharge Card
                    </button>
                  )}
                </div>
                {/* Show the previous record date when available */}
                {previousRecordDate && (
                  <div style={{ marginTop: "15px" }}>
                    <strong>Previous Record Date: </strong>
                    <span>{previousRecordDate}</span>
                  </div>
                )}
                <br />
                <Row>
                  <Col md={4} className="mb-4">
                    <Form.Group className="mb-3">
                      <Form.Label>Prescription Type</Form.Label>
                      <Form.Control
                        as="select"
                        name="prescription_type"
                        value={formData.prescription_type}
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
                        name="name"
                        value={formData.name || ""}
                        onChange={handleInputChange}
                        style={{ borderRadius: "6px" }}
                        disabled={isDisabled}
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
                        value={formData.address || ""}
                        onChange={handleInputChange}
                        placeholder="Enter Address"
                        style={{ borderRadius: "6px" }}
                        disabled={isDisabled}
                      />
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
                        disabled={isDisabled}
                      />
                    </Form.Group>
                  </Col>
                  {/* Gender */}
                  <Col md={4} className="mb-4">
                    <Form.Group className="mb-3">
                      <Form.Label>Gender</Form.Label>
                      <Form.Select
                        as="select"
                        name="gender"
                        value={selectedOptions?.sex}
                        onChange={handleInputChange}
                        style={{ borderRadius: "6px" }}
                        disabled={isDisabled}
                      >
                        <option value="">Select Gender</option>
                        <option value="MALE">MALE</option>
                        <option value="FEMALE">FEMALE</option>
                        <option value="OTHER">OTHER</option>
                      </Form.Select>
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
                        disabled={isDisabled}
                      >
                        <option value="">Select Consultant</option>
                        {[
                          ...new Set([
                            ...discharge.map((option) => option.consultantName),
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
                  <Col md={2} className="mb-4">
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
                  {/* Test Type Dropdown with Multiple Checkboxes */}
                  <Col md={4} className="mb-4">
                    <Form.Group controlId="surgery_type">
                      <Form.Label>Surgery Type</Form.Label>
                      <Dropdown>
                        <Dropdown.Toggle
                          variant="secondary"
                          id="dropdown-basic"
                        >
                          {Array.isArray(selectedOptions.surgery_type) &&
                          selectedOptions.surgery_type.length > 0
                            ? selectedOptions.surgery_type.join(", ")
                            : "Select surgery types"}
                        </Dropdown.Toggle>

                        <Dropdown.Menu style={{ padding: "10px" }}>
                          {[
                            ...new Set([
                              ...(Array.isArray(discharge)
                                ? discharge.map((option) => option.surgery_type)
                                : []),
                              ...(Array.isArray(types)
                                ? types.map((type) => type.name)
                                : []),
                            ]),
                          ].map((surgery_type, index) => (
                            <Form.Check
                              key={index}
                              type="checkbox"
                              label={surgery_type}
                              value={surgery_type}
                              checked={
                                selectedOptions.surgery_type?.includes(
                                  surgery_type
                                ) || false
                              }
                              onChange={(e) =>
                                handleSurgeryTypeChange(e, surgery_type)
                              }
                            />
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    </Form.Group>
                  </Col>
                </Row>
                <br />
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
                        name="chife_complaints"
                        value={formData.chife_complaints}
                        onChange={handleInputChange}
                        style={{ borderRadius: "6px" }}
                        disabled={isDisabled}
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
                        disabled={isDisabled}
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
                        name="surgical_history"
                        value={formData.surgical_history}
                        onChange={handleInputChange}
                        style={{ borderRadius: "6px" }}
                        disabled={isDisabled}
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
                        disabled={isDisabled}
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
                        name="surgical_procedure"
                        value={formData.surgical_procedure}
                        onChange={handleInputChange}
                        style={{ borderRadius: "6px" }}
                        disabled={isDisabled}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-4">
                    <Form.Group className="mb-3">
                      <Form.Label>Surgery Note</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="surgery_note"
                        value={formData.surgery_note}
                        onChange={handleInputChange}
                        style={{ borderRadius: "6px" }}
                        disabled={isDisabled}
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
                      </Row>
                      <Row>
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
                              onChange={handleInputChange}
                              style={{ borderRadius: "6px" }}
                              disabled={isDisabled}
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
                              name="carenote"
                              value={formData.carenote || ""}
                              onChange={handleInputChange}
                              style={{ borderRadius: "6px" }}
                              disabled={isDisabled}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <br />
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
                          <Form.Group controlId="madeby">
                            <Form.Label>Made By</Form.Label>
                            <Form.Select
                              value={selectedOptions?.madeby || ""}
                              onChange={(e) =>
                                setSelectedOptions({
                                  ...selectedOptions,
                                  madeby: e.target.value,
                                })
                              }
                            >
                              <option value="">Made By</option>
                              {[
                                ...new Set([
                                  ...discharge.map((option) => option.madeby),
                                  ...mades.map((made) => made.name),
                                ]),
                              ].map((madeby, index) => (
                                <option key={index} value={madeby}>
                                  {madeby}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6} className="mb-4">
                          <Form.Group controlId="treatingby">
                            <Form.Label>Treating By</Form.Label>
                            <Form.Select
                              value={selectedOptions?.treatingby || ""}
                              onChange={(e) =>
                                setSelectedOptions({
                                  ...selectedOptions,
                                  treatingby: e.target.value,
                                })
                              }
                            >
                              <option value="">Treating By</option>
                              {[
                                ...new Set([
                                  ...discharge.map(
                                    (option) => option.treatingby
                                  ),
                                  ...treatings.map((treating) => treating.name),
                                ]),
                              ].map((treatingby, index) => (
                                <option key={index} value={treatingby}>
                                  {treatingby}
                                </option>
                              ))}
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
                          disabled={isDisabled}
                        />
                      </Form.Group>
                    </Col>
                    <br />
                    <Col md={12} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Local Care</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="local_care"
                          value={formData.local_care || ""}
                          onChange={handleInputChange}
                          style={{ borderRadius: "6px" }}
                          disabled={isDisabled}
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
                        <Form.Group controlId="assistanceDoctor">
                          <Form.Label>Assistance Doctor</Form.Label>
                          <Form.Select
                            value={selectedOptions?.assistanceDoctor || ""}
                            onChange={(e) =>
                              setSelectedOptions({
                                ...selectedOptions,
                                assistanceDoctor: e.target.value,
                              })
                            }
                          >
                            <option value="">Assistant Doctor</option>
                            {[
                              ...new Set([
                                ...discharge.map(
                                  (option) => option.assistanceDoctor
                                ),
                                ...assistants.map(
                                  (assistant) => assistant.name
                                ),
                              ]),
                            ].map((assistanceDoctor, index) => (
                              <option key={index} value={assistanceDoctor}>
                                {assistanceDoctor}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6} className="mb-4">
                        <Form.Group controlId="surgeonDoctor">
                          <Form.Label>Surgeon Doctor</Form.Label>
                          <Form.Select
                            value={selectedOptions?.surgeonDoctor || ""}
                            onChange={(e) =>
                              setSelectedOptions({
                                ...selectedOptions,
                                surgeonDoctor: e.target.value,
                              })
                            }
                          >
                            <option value="">Surgeon Doctor</option>
                            {[
                              ...new Set([
                                ...discharge.map(
                                  (option) => option.surgeonDoctor
                                ),
                                ...surgeons.map((surgeon) => surgeon.name),
                              ]),
                            ].map((surgeonDoctor, index) => (
                              <option key={index} value={surgeonDoctor}>
                                {surgeonDoctor}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6} className="mb-4">
                        <Form.Group controlId="checkedby">
                          <Form.Label>Checked By</Form.Label>
                          <Form.Select
                            value={selectedOptions?.checkedby || ""}
                            onChange={(e) =>
                              setSelectedOptions({
                                ...selectedOptions,
                                checkedby: e.target.value,
                              })
                            }
                          >
                            <option value="">Checked By</option>
                            {[
                              ...new Set([
                                ...discharge.map((option) => option.checkedby),
                                ...checks.map((check) => check.name),
                              ]),
                            ].map((checkedby, index) => (
                              <option key={index} value={checkedby}>
                                {" "}
                                {checkedby}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6} className="mb-4">
                        <Form.Group controlId="surgeryadvice">
                          <Form.Label>Surgery Advice</Form.Label>
                          <Form.Select
                            value={selectedOptions?.surgeryadvice || ""}
                            onChange={(e) =>
                              setSelectedOptions({
                                ...selectedOptions,
                                surgeryadvice: e.target.value,
                              })
                            }
                          >
                            <option value="">Surgery Advice</option>
                            {[
                              ...new Set([
                                ...discharge.map(
                                  (option) => option.surgeryadvice
                                ),
                                ...surgeries.map((surgery) => surgery.name),
                              ]),
                            ].map((surgeryadvice, index) => (
                              <option key={index} value={surgeryadvice}>
                                {surgeryadvice}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <br />
                <br />
                <Row className="mb-3">
                  <Col md={4}>
                    <Form.Group controlId="treatmentGiven">
                      <Form.Label>Treatment Given:</Form.Label>
                      <Form.Select
                        name="treatmentGiven"
                        value={formData.treatmentGiven || ""}
                        onChange={handleInputChange}
                      >
                        {formData.prescription_type === "Proctology" && (
                          <>
                            <option value="">Select Treatment</option>
                            {injections.map((injection, index) => (
                              <option key={index} value={injection.name}>
                                {injection.name}
                              </option>
                            ))}
                          </>
                        )}
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
                        name="medicineRoute"
                        value={formData.medicineRoute || ""}
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

                  {/* Table to Display Injections */}
                  <Col md={2} className="d-flex align-items-end">
                    <Button
                      variant="danger"
                      className="fw-bold px-3 py-2 shadow-sm"
                      onClick={addInjectionDetails}
                    >
                      + Add Injection
                    </Button>
                  </Col>

                  {/* Space for separation */}
                  <div className="my-3"></div>
                  <div className="my-3"></div>
                  {/* Display Injections Table */}
                  {Array.isArray(formData.injectionDetails) &&
                    formData.injectionDetails.length > 0 && (
                      <Table
                        striped
                        bordered
                        hover
                        className="text-center shadow-sm"
                      >
                        <thead className="bg-primary text-white">
                          <tr>
                            <th>Medicine Name</th>
                            <th>Days</th>
                            <th>Medicine Route</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.injectionDetails.map((inj, index) => (
                            <tr key={index}>
                              <td className="fw-bold">{inj.treatmentGiven}</td>
                              <td>{inj.timesGiven}</td>
                              <td>{inj.medicineRoute}</td>
                              <td>
                                <Button
                                  variant="danger"
                                  onClick={() => removeDischarge(index)}
                                >
                                  Delete
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    )}
                  <br />
                  <div>
                    <Col>
                      <Button
                        variant="primary"
                        onClick={() => setShowPopup(true)}
                        className="mt-4"
                      >
                        Upload Medicine
                      </Button>
                    </Col>
                    {showPopup && (
                      <div
                        style={{
                          position: "fixed",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          zIndex: 1000,
                        }}
                      >
                        <div
                          style={{
                            backgroundColor: "white",
                            padding: "20px",
                            borderRadius: "5px",
                            maxWidth: "600px",
                            width: "100%",
                            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                            position: "relative",
                          }}
                        >
                          <h2>Upload Medicine</h2>
                          <br />
                          <form onSubmit={handleSubmit}>
                            <label>
                              Medicine Name:
                              <input
                                type="text"
                                name="medicine_name"
                                value={formData.medicine_name}
                                onChange={handleChange}
                                style={{ marginBottom: "10px" }}
                              />
                            </label>

                            <br />
                            <label>
                              Select Gender:
                              <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                style={{ marginBottom: "10px" }}
                              >
                                <option value="">Select</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                              </select>
                            </label>

                            <br />
                            <label>
                              Medicine Type:
                              <input
                                type="text"
                                name="medicineType"
                                value={formData.medicineType}
                                onChange={handleChange}
                                style={{ marginBottom: "10px" }}
                              />
                            </label>

                            <br />
                            <label>
                              Medical Strength:
                              <input
                                type="text"
                                name="medicalStrength"
                                value={formData.medicalStrength}
                                onChange={handleChange}
                                style={{ marginBottom: "10px" }}
                              />
                            </label>

                            <br />
                            <label>
                              Medicine Unit:
                              <select
                                name="medicineUnit"
                                value={formData.medicineUnit}
                                onChange={handleChange}
                                style={{ marginBottom: "10px" }}
                              >
                                <option value="">Select</option>
                                <option value="mg">mg</option>
                                <option value="g">g</option>
                                <option value="ml">ml</option>
                              </select>
                            </label>

                            <br />
                            <label>
                              Medicine Route:
                              <select
                                name="medicineRoute"
                                value={formData.medicineRoute}
                                onChange={handleChange}
                                style={{ marginBottom: "10px" }}
                              >
                                <option value="">Select</option>
                                <option value="oral">Oral</option>
                                <option value="injectable">Injectable</option>
                                <option value="topical">Topical</option>
                              </select>
                            </label>

                            <br />
                            <label>
                              Medicine Status:
                              <select
                                name="medicineStatus"
                                value={formData.medicineStatus}
                                onChange={handleChange}
                                style={{ marginBottom: "10px" }}
                              >
                                <option value="">Select</option>
                                <option value="available">Available</option>
                                <option value="outOfStock">Out of Stock</option>
                                <option value="discontinued">
                                  Discontinued
                                </option>
                              </select>
                            </label>

                            <br />
                            <button
                              type="submit"
                              style={{
                                marginTop: "10px",
                                backgroundColor: "#4CAF50",
                                color: "white",
                                border: "none",
                                padding: "10px",
                                borderRadius: "5px",
                                cursor: "pointer",
                              }}
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setShowPopup(false)}
                              style={{
                                position: "absolute",
                                top: "10px",
                                right: "10px",
                                backgroundColor: "#f44336",
                                color: "white",
                                border: "none",
                                padding: "5px 10px",
                                borderRadius: "50%",
                                cursor: "pointer",
                              }}
                            >
                              X
                            </button>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>
                </Row>
                <br />
                <Row className="mb-3">
                  <Col md={4}>
                    <Form.Group controlId="adviceMedicine">
                      <Form.Label>Advice Medicine:</Form.Label>
                      <Form.Select
                        name="adviceMedicine"
                        value={formData.adviceMedicine || ""}
                        onChange={handleInputChange}
                      >
                        {formData.prescription_type === "Proctology" && (
                          <>
                            <option value="">Select Treatment</option>
                            {adviceMedicineP.map((adviceMedicineP, index) => (
                              <option key={index} value={adviceMedicineP.name}>
                                {adviceMedicineP.name}
                              </option>
                            ))}
                          </>
                        )}
                        {formData.prescription_type === "Urology" && (
                          <>
                            <option value="">Select Treatment</option>
                            {adviceMedicineU.map((adviceMedicineU, index) => (
                              <option key={index} value={adviceMedicineU.name}>
                                {adviceMedicineU.name}
                              </option>
                            ))}
                          </>
                        )}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Quantity:</Form.Label>
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
                        {formData.timings &&
                          typeof formData.timings === "object" &&
                          Object.keys(formData.timings).map((timing) => (
                            <Form.Check
                              key={timing}
                              inline
                              type="checkbox"
                              label={timing.replace(/([A-Z])/g, " $1").trim()}
                              name={timing}
                              checked={formData.timings?.[timing] || false}
                              onChange={(e) =>
                                handleCheckboxChange(e, "timings")
                              }
                            />
                          ))}
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
                <br />
                <Button
                  variant="primary"
                  onClick={addDischargeTreatDetails}
                  className="mt-4"
                >
                  Add to Table
                </Button>
                <br />
                <br />
                {/* Space for separation */}
                <div className="my-3"></div>
                <div className="my-3"></div>
                {/* Display Injections Table */}
                {Array.isArray(formData.dischargeTreat) &&
                  formData.dischargeTreat.length > 0 && (
                    <Table
                      striped
                      bordered
                      hover
                      className="text-center shadow-sm"
                    >
                      <tbody>
                        {formData.dischargeTreat.length > 0 && (
                          <Table striped bordered hover>
                            <thead>
                              <tr>
                                <th>Medicine Name</th>
                                <th>Quantity</th>
                                <th>Time Slot</th>
                                <th>Days</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {formData.dischargeTreat.map((item, index) => (
                                <tr key={index}>
                                  <td>{item.adviceMedicine}</td>
                                  <td>{item.medicine_quantity}</td>
                                  <td>{item.mealTimings}</td>
                                  <td>{item.medicine_days}</td>
                                  <td>
                                    <Button
                                      variant="danger"
                                      onClick={() => removeDischarge(index)}
                                    >
                                      Delete
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        )}
                      </tbody>
                    </Table>
                  )}
                <Button
                  variant="primary"
                  className="mt-4"
                  onClick={handleSubmit}
                >
                  Save Discharge Card
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Container>
    </div>
  );
}
