import { useState, useEffect } from "react";
import {
  Card,
  Button,
  Form,
  Row,
  Col,
  Container,
  Dropdown,
  Table,
} from "react-bootstrap";
import NavBarD from "./NavbarD";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BASE_URL = "http://192.168.156.47:5000/api";

export default function OpdPrescription() {
  const [formData, setFormData] = useState({
    prescription_type: "",
    prepo_investigation: [],
    medical_history: "",
    investigation: "",
    creation_timestamp: "",
    allergy: "",
    doctor_id: "",
    testAdvice: [],
    diagnosis: "",
    advicesx: "",
    admmisionnote: "",
    nextAppointment: "",
    appointment_timestamp: "",
    medicine_name: "",
    adviceMedicine: "",
    medicine_quantity: "",
    medicine_time: {
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

  const [isViewingPreviousRecords, setIsViewingPreviousRecords] =
    useState(false);

  const [tableData, setTableData] = useState([]);
  const [errors, setErrors] = useState({});
  const [opdPrescription, setOpdPrescription] = useState([]);
  const [assistantsDoctor, setAssistantsDoctor] = useState([]);
  const [adviceMedicineP, setadviceMedicineP] = useState([]);
  const [adviceMedicineU, setadviceMedicineU] = useState([]);
  const [testAdviceP, setTestAdviceP] = useState([]);
  const [testAdviceU, setTestAdviceU] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({}); // Track selected checkboxes
  const [patientId, setPatientId] = useState(
    localStorage.getItem("selectedPatientId")
  );
  const [isDisabled, setIsDisabled] = useState(false); // Controls edit mode
  const [disablePreviousButton, setDisablePreviousButton] = useState(false); // Disables "Previous Records" after clicking
  const [showPrintButton, setShowPrintButton] = useState(false);
  const [previousRecordDate, setPreviousRecordDate] = useState("");
  const [selectedPrescriptionType, setSelectedPrescriptionType] = useState("");

  useEffect(() => {
    const storedPatientId = localStorage.getItem("selectedPatientId");
    console.log("Retrieved from localStorage:", storedPatientId);
    if (storedPatientId) setPatientId(storedPatientId);
  }, []);

  useEffect(() => {
    const storedPatientId = localStorage.getItem("selectedPatientId");
    console.log("Retrieved from localStorage:", storedPatientId);
    if (storedPatientId) setPatientId(storedPatientId);
  }, []);

  useEffect(() => {
    if (!patientId) {
      console.warn("No patientId found, skipping fetch");
      return;
    }

    const fetchPatientData = async () => {
      console.log(`Fetching data for patient ID: ${patientId}`);

      try {
        const response = await fetch(
          `${BASE_URL}/V1/followUp/listFollowUp/${patientId}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
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

        if (data?.data?.patientData?.length > 0) {
          console.log("Setting OpdPrescription Data...");
          setOpdPrescription(data.data.patientData[0]);
          // setFormData((prevState) => ({
          //   medicine_time: {
          //     ...prevState.medicine_time,
          //     BeforeBreakfast: pafalse,
          //     AfterBreakfast: false,
          //     BeforeLunch: false,
          //     AfterLunch: false,
          //     BeforeDinner: false,
          //     AfterDinner: false,
          //     AfterEveningSnacks: false,
          //   },
          // }));
        } else {
          console.warn("No patient data found in API response");
          setOpdPrescription({});
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setOpdPrescription({});
      }
    };

    fetchPatientData();
  }, [patientId]);

  // Fetch options from API
  useEffect(() => {
    const fetchDropdownOptions = async () => {
      try {
        const endpoints = [
          {
            url: "/V1/patienttabsdp/assistantDoc_dropdown",
            setter: setAssistantsDoctor,
          },
          {
            url: "/V1/patienttabsdp/proctologyMedicine_dropdown",
            setter: setadviceMedicineP,
          },
          {
            url: "/V1/patienttabsdp/urologyMedicine_dropdown",
            setter: setadviceMedicineU,
          },
          {
            url: "/V1/patienttabsdp/proctologyTestAdvice_dropdown",
            setter: setTestAdviceP,
          },
          {
            url: "/V1/patienttabsdp/urologyTestAdvice_dropdown",
            setter: setTestAdviceU,
          },
        ];

        for (const { url, setter } of endpoints) {
          const response = await fetch(`${BASE_URL}${url}`);
          const data = await response.json();
          if (response.ok) setter(data.data || []);
          console.log(`${name} Data:`, data.data); // Log fetched data to the console
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setErrors("Failed to fetch dropdown data.");
      }
    };
    fetchDropdownOptions();
  }, []);

  const testAdviceOptions = [
    "FLEXIBLE CYSTOSCOPY",
    "USG ABD & PELVIC",
    "PLAINCECT KUB",
    "MRI PROSTATE",
    "TRUS BIOPSY",
    "UROFLOWMETRY",
    "DJ STENT REMOVAL",
    "X-RAY KUB",
    "URINE ROUTINE",
    "URINE CULTURE/SENSTIVITY",
    "PSA, FREE PSA",
    "PHI",
    "B12",
    "D3",
    "USG SCROTUM",
    "RGU",
    "FDG PET SCAN",
    "PSMA PER SCAN",
    "USG KUB",
  ];

  const prepoOptions = [
    "CBC-RFT-LFT-BLOOD GROUP",
    "HBSAG",
    "HIV-HCV",
    "PT INR ",
    "S-CREATININE",
    "CHEST X-RAY",
    "2 D ECHO",
    "ECG",
    "URINE C/S",
    "URINE R/N",
  ];

  const handleDeleteRow = (index) => {
    const updatedTableData = tableData.filter((_, i) => i !== index);
    setTableData(updatedTableData);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log(`Handling input change: ${name} = ${value}`);

    if (name === "prescription_type") {
      setSelectedPrescriptionType(value); // Set selected type (Proctology/Urology)
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    try {
      if (type === "checkbox") {
        setFormData((prev) => ({
          ...prev,
          [name]: checked,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } catch (error) {
      console.error("Error in handleInputChange:", error);
    }
  };

  const handleCheckboxChange = (option) => {
    setFormData((prev) => {
      const isSelected = prev.prepo_investigation.includes(option);
      return {
        ...prev,
        prepo_investigation: isSelected
          ? prev.prepo_investigation.filter((item) => item !== option) // Remove if already selected
          : [...prev.prepo_investigation, option], // Add if not selected
      };
    });
  };

  const handleTestAdviceChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prevData) => {
      const updatedTestAdvice = checked
        ? [...prevData.testAdvice, value]
        : prevData.testAdvice.filter((item) => item !== value);
      return { ...prevData, testAdvice: updatedTestAdvice };
    });
  };

  const handleAddToTable = () => {
    const selectedMealTime = Object.keys(formData.medicine_time)
      .filter((key) => formData.medicine_time[key])
      .join(", ");

    if (
      !formData.medicine_name ||
      !formData.medicine_quantity ||
      !selectedMealTime ||
      !formData.medicine_days
    ) {
      alert("Please fill in all medicine details before adding.");
      return;
    }

    const newTableRow = {
      medicine: formData.medicine_name,
      qty: formData.medicine_quantity,
      mealTimings: selectedMealTime,
      days: formData.medicine_days,
    };

    setTableData((prevData) => [...prevData, newTableRow]);

    // Reset form fields after adding to the table
    setFormData((prevFormData) => ({
      ...prevFormData,
      medicine_name: "", // Reset medicine name
      medicine_quantity: "", // Reset medicine quantity
      medicine_time: {
        BeforeBreakfast: false,
        AfterBreakfast: false,
        BeforeLunch: false,
        AfterLunch: false,
        BeforeDinner: false,
        AfterDinner: false,
        AfterEveningSnacks: false,
      }, // Reset medicine time
      days: "", // Reset medicine days
    }));
  };

  const validate = () => {
    const errors = {};
    // Add validation logic here
    return errors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      alert("Please correct errors before submitting.");
      return;
    }

    try {
      const medicineTimeArray = [];
      if (formData.medicine_time.BeforeBreakfast)
        medicineTimeArray.push("Before Breakfast");
      if (formData.medicine_time.AfterBreakfast)
        medicineTimeArray.push("After Breakfast");
      if (formData.medicine_time.BeforeLunch)
        medicineTimeArray.push("Before Lunch");
      if (formData.medicine_time.AfterLunch)
        medicineTimeArray.push("After Lunch");
      if (formData.medicine_time.BeforeDinner)
        medicineTimeArray.push("Before Dinner");
      if (formData.medicine_time.AfterDinner)
        medicineTimeArray.push("After Dinner");
      if (formData.medicine_time.AfterEveningSnacks)
        medicineTimeArray.push("After Evening Snacks");
      const medicinesArray = tableData.map((row) => ({
        medicine_name: row.medicine,
        medicine_quantity: row.qty.toString(), // ✅ Ensure it's a string
        medicine_time: row.mealTimings.toString(), // ✅ Ensure it's a string
        medicine_days: row.days.toString(),
      }));
      const formDataToSubmit = {
        ...formData,
        creation_timestamp: formData.creation_timestamp || null,
        medicines: medicinesArray, // Store only medicines from the table
        medicine_time: medicineTimeArray.join(","),
        medicine_quantity: formData.medicine_quantity,
        medicine_days: formData.medicine_days,
        date: formData.appointment_timestamp || null, // Ensure date is included
      };
      console.log(
        "Medicine Quantity before submission:",
        formData.medicine_quantity
      );
      console.log("Sending Data:", JSON.stringify(formDataToSubmit, null, 2));

      const response = await fetch(
        `${BASE_URL}/V1/prescription/addPrescription/${patientId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formDataToSubmit),
        }
      );

      const responseData = await response.json();
      console.log("Response Data:", responseData);

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to save data");
      }

      alert("Form submitted successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(
        "Failed to submit form. Please check the console for more details."
      );
    }
  };
  // const handleUpdate = async () => {
  //   try {
  //     // Convert medicine_time object to a string
  //     const updatedData = {
  //       ...formData,
  //       creation_timestamp: formData.creation_timestamp || null,
  //       medicine_time: JSON.stringify(formData.medicine_time),
  //     };

  //     console.log("Sending Data:", JSON.stringify(updatedData, null, 2));

  //     const response = await fetch(
  //       `${BASE_URL}/V1/prescription/updatePrescription/${patientId}`,
  //       {
  //         method: "PUT",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(updatedData),
  //       }
  //     );

  //     const responseData = await response.json();
  //     console.log("Response Data:", responseData);

  //     if (!response.ok) {
  //       throw new Error(responseData.message || "Failed to update data");
  //     }
  //     if (responseData.statusCode === 200) {
  //       alert("Prescription updated successfully!");
  //       setIsDisabled(true);
  //       setShowEditButton(true);
  //       //  setPreviousRecordDate(formData.date_diagnosis);
  //       setDisablePreviousButton(true);
  //     } else {
  //       throw new Error(
  //         responseData.message || "Failed to update prescription details"
  //       );
  //     }
  //     // alert("Form updated successfully!");
  //   } catch (error) {
  //     console.error("Error updating form:", error);
  //     alert(
  //       "Failed to update form. Please check the console for more details."
  //     );
  //   }
  // };

  // Combine and remove duplicates from both arrays (opdPrescription and testAdviceU)
  useEffect(() => {
    const storedPatientId = localStorage.getItem("selectedPatientId");
    if (storedPatientId) setPatientId(storedPatientId);
  }, []);

  const fetchPreviousRecords = async () => {
    try {
      if (!patientId) {
        alert("Patient ID is missing.");
        return;
      }

      console.log("Fetching previous records for patient:", patientId);

      const response = await fetch(
        `${BASE_URL}/V1/prescription/listPrescription/${patientId}`
      );
      const result = await response.json();

      console.log("API Response Data:", result);

      if (!response.ok || !result?.data?.prescription) {
        console.error(
          "API Error:",
          response.status,
          result.message || "No prescription data found."
        );
        alert("No previous records.");
        return;
      }

      const prescription = result.data.prescription;
      const urology = result.data.urology;
      const appointment = result.data.appointment;

      // Ensure prescription is valid
      if (!prescription || typeof prescription !== "object") {
        console.error("Invalid prescription format:", prescription);
        alert("Invalid prescription data received.");
        return;
      }

      console.log("Setting FormData with:", prescription);

      // Prevent page from disappearing by ensuring no invalid state updates
      setFormData((prev) => ({
        ...prev,
        prescription_type: prescription.prescription_type || "",
        appointment_timestamp: appointment.appointment_timestamp,
        investigation: urology?.[0]?.investigation || prev.investigation,
        creation_timestamp: prescription.creation_timestamp,
        allergy: prescription.allergy || prev.allergy || "",
        doctor_id: prescription.doctor_id || prev.doctor_id || "",
        diagnosis: prescription.diagnosis || prev.diagnosis || "",
        advicesx: prescription.advicesx || prev.advicesx || "",
        admmisionnote: prescription.admmisionnote || prev.admmisionnote || "",
        testAdvice: Array.isArray(prescription.testAdvice)
          ? prescription.testAdvice
          : [],
        medicine_name: prescription.medicine_name || prev.medicine_name,
      }));
      const medicinesArray = [
        {
          medicine: prescription.medicine_name || "N/A",
          qty: prescription.medicine_quantity || "0",
          days: prescription.medicine_days || "0",
          mealTimings: prescription.medicine_time || "N/A", // Ensure this is included
        },
      ];

      setTableData(medicinesArray);

      // Update table data safely
      // if (Array.isArray(prescription.medicines)) {
      //   setTableData(
      //     prescription.medicines.map((med, prev) => ({
      //       ...prev,
      //       medicine: med.medicine_name || "N/A",
      //       qty: med.medicine_quantity || prev.medicine_quantity || "0",
      //       mealTimings: med.medicine_time || "N/A",
      //       days: med.medicine_days || prev.medicine_days || "0",
      //     })

      //   )
      //   );
      // } else {
      //   setTableData([]); // Ensure no errors due to undefined medicine list
      // }

      // Prevent unnecessary UI changes that may cause the disappearance
      setDisablePreviousButton(true);
      setIsViewingPreviousRecords(true); // Set to true when fetching previous records
      setShowPrintButton(true);
      setIsDisabled(true); // Keep form editable
    } catch (error) {
      console.error("Error fetching previous records:", error);
      alert("Failed to fetch previous records. Please try again.");
    }
  };

  // Ensure `opdPrescription`, `testAdviceU`, and `testAdviceP` are valid arrays before using `.map()`
  const combinedTestAdvice = [
    ...new Set(
      [
        ...(Array.isArray(opdPrescription)
          ? opdPrescription.map((item) => item.testAdvice || "")
          : []),
        ...(Array.isArray(testAdviceU)
          ? testAdviceU.map((item) => item.name || "")
          : []),
        ...(Array.isArray(testAdviceP)
          ? testAdviceP.map((item) => item.name || "")
          : []),
        ...testAdviceOptions,
      ].filter(Boolean)
    ), // Removes empty strings and falsy values
  ];
  const handleNewRecord = () => {
    setFormData({
      prescription_type: "",
      prepo_investigation: [],
      medical_history: "",
      investigation: "",

      creation_timestamp: new Date().toISOString().split("T")[0],
      allergy: "",
      doctor_id: "",
      testAdvice: [],
      diagnosis: "",
      advicesx: "",
      admmisionnote: "",
      nextAppointment: "",
      appointment_timestamp: new Date().toISOString().split("T")[0],
      adviceMedicine: "",
      medicine_quantity: "",
      medicine_name: "",
      medicine_time: {
        BeforeBreakfast: "",
        AfterBreakfast: "",
        BeforeLunch: "",
        AfterLunch: "",
        BeforeDinner: "",
        AfterDinner: "",
        AfterEveningSnacks: "",
      },
      medicine_days: "",
    });

    // Reset table data
    setTableData([]);

    // Enable the "Previous Records" button
    setDisablePreviousButton(false);
    setIsViewingPreviousRecords(false); // Reset to false when creating a new record

    // Hide the Edit button

    // Enable form editing
    setIsDisabled(false);

    // Clear previous record date
    setPreviousRecordDate("");

    alert("New Record: You can now enter new data.");
  };

  const handlePrint = () => {
    window.print();
  };

  const renderAssistantDoctorSelect = () => (
    <Form.Select
      value={selectedOptions.assistantsDoctorName || ""}
      onChange={(e) =>
        setSelectedOptions((prev) => ({
          ...prev,
          assistantsDoctorName: e.target.value,
        }))
      }
      disabled={isDisabled}
    >
      <option key="default" value="">
        Select Assistant
      </option>
      {Array.isArray(assistantsDoctor) &&
        assistantsDoctor.map((doctor) => (
          <option
            key={doctor.id || `doctor-${doctor.name}`}
            value={doctor.name}
          >
            {doctor.name}
          </option>
        ))}
    </Form.Select>
  );

  const renderMedicineOptions = (type) => {
    const medicineList =
      type === "PROCTOLOGY" ? adviceMedicineP : adviceMedicineU;
    const existingMedicines = Array.isArray(opdPrescription)
      ? opdPrescription.map((option) => option.adviceMedicine).filter(Boolean)
      : [];

    const combinedMedicines = [
      ...new Set([
        ...existingMedicines,
        ...(Array.isArray(medicineList)
          ? medicineList.map((med) => med.name)
          : []),
      ]),
    ];

    return (
      <Form.Select
        value={selectedOptions?.medicine_name || ""}
        onChange={(e) =>
          setSelectedOptions({
            ...selectedOptions,
            medicine_name: e.target.value,
          })
        }
        disabled={isDisabled}
      >
        <option key="default" value="" disabled>
          Advice Medicine
        </option>
        {combinedMedicines.map((medicine, index) => (
          <option key={`medicine-${index}-${medicine}`} value={medicine}>
            {medicine}
          </option>
        ))}
      </Form.Select>
    );
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
      <NavBarD pagename="OPD Prescription" />
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
                      style={{ float: "right", marginRight: "7px" }}
                      onClick={fetchPreviousRecords}
                      disabled={disablePreviousButton}
                    >
                      Previous Records
                    </button>

                    {/* Print Button - Only Visible After Clicking "Previous Records" */}
                    {showPrintButton && (
                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{ float: "right", marginRight: "7px" }}
                        onClick={handlePrint}
                      >
                        Print
                      </button>
                    )}
                  </div>
                  {previousRecordDate && (
                    <div style={{ marginTop: "15px" }}>
                      <strong>Previous Record Date: </strong>
                      <span>{previousRecordDate}</span>
                    </div>
                  )}
                  <br />
                  <Row className="mb-3">
                    <Col>
                      <Form.Group>
                        <Form.Label>Prescription Type:</Form.Label>
                        <Form.Select
                          name="prescription_type"
                          value={formData.prescription_type || ""}
                          onChange={handleInputChange}
                          disabled={isDisabled}
                        >
                          <option value="" disabled>
                            Select an option
                          </option>
                          <option value="PROCTOLOGY">PROCTOLOGY</option>
                          <option value="UROLOGY">UROLOGY</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={3}>
                      <Form.Group>
                        <Form.Label className="d-block">
                          Date of Prescription:
                        </Form.Label>
                        <DatePicker
                          selected={
                            formData?.creation_timestamp
                              ? new Date(formData.creation_timestamp)
                              : null
                          }
                          onChange={(date) => {
                            setFormData((prev) => ({
                              ...prev,
                              creation_timestamp: date
                                ? date.toISOString().split("T")[0]
                                : "",
                            }));
                          }}
                          dateFormat="yyyy-MM-dd"
                          className="form-control"
                          placeholderText="Select Date"
                          maxDate={new Date()}
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          style={{
                            height: "38px",
                            width: "100%",
                          }}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>Allergy:</Form.Label>
                        <Form.Control
                          type="textarea"
                          name="allergy"
                          placeholder="allergy"
                          value={formData.allergy}
                          onChange={handleInputChange}
                          disabled={isDisabled}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <>
                    <br />
                    <Row className="mb-3">
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>Assistant Doctor:</Form.Label>
                          {renderAssistantDoctorSelect()}
                        </Form.Group>
                      </Col>

                      <Col md={4}>
                        <Form.Group controlId="testAdvice">
                          <Form.Label>Test Advice:</Form.Label>
                          <Dropdown>
                            <Dropdown.Toggle
                              variant="primary"
                              as={Button}
                              disabled={isDisabled}
                            >
                              {Array.isArray(formData.testAdvice) &&
                              formData.testAdvice.length > 0
                                ? formData.testAdvice.join(", ")
                                : "Select Test Advice"}
                            </Dropdown.Toggle>

                            <Dropdown.Menu
                              style={{
                                maxHeight: "200px",
                                width: "100%",
                                overflowY: "auto",
                              }}
                            >
                              {combinedTestAdvice.map((option) => (
                                <Dropdown.Item key={option}>
                                  <Form.Check
                                    type="checkbox"
                                    label={option}
                                    value={option}
                                    checked={formData.testAdvice.includes(
                                      option
                                    )}
                                    onChange={handleTestAdviceChange}
                                    disabled={isDisabled}
                                  />
                                </Dropdown.Item>
                              ))}
                            </Dropdown.Menu>
                          </Dropdown>
                        </Form.Group>
                      </Col>
                      {formData.prescription_type !== "UROLOGY" && (
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label>Advice Sx:</Form.Label>
                            <Form.Control
                              as="textarea"
                              name="advicesx"
                              value={formData.advicesx}
                              onChange={handleInputChange}
                              disabled={isDisabled}
                            />
                          </Form.Group>
                        </Col>
                      )}
                      {formData.prescription_type == "UROLOGY" && (
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label>PREPO Investigation:</Form.Label>
                            <Dropdown>
                              <Dropdown.Toggle variant="primary">
                                {formData.prepo_investigation.length > 0
                                  ? formData.prepo_investigation.join(", ")
                                  : "Select Investigation"}
                              </Dropdown.Toggle>

                              <Dropdown.Menu>
                                {prepoOptions.map((option, index) => (
                                  <Form.Check
                                    key={index}
                                    type="checkbox"
                                    label={option}
                                    checked={formData.prepo_investigation.includes(
                                      option
                                    )}
                                    onChange={() =>
                                      handleCheckboxChange(option)
                                    }
                                  />
                                ))}
                              </Dropdown.Menu>
                            </Dropdown>
                          </Form.Group>
                        </Col>
                      )}
                    </Row>
                  </>
                  {formData.prescription_type == "UROLOGY" && (
                    <>
                      <br />
                      <Row>
                        <Col>
                          <Form.Group>
                            <Form.Label>Cheif Complaints(c/O):</Form.Label>
                            <Form.Control
                              as="textarea"
                              name="medical_history"
                              value={formData.medical_history}
                              onChange={handleInputChange}
                              disabled={isDisabled}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <br />
                      <Row>
                        <Col>
                          <Form.Group>
                            <Form.Label>Known Case of:</Form.Label>
                            <Form.Control
                              as="textarea"
                              name="medicalhistory"
                              value={formData.medicalhistory}
                              onChange={handleInputChange}
                              disabled={isDisabled}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </>
                  )}

                  {formData.prescription_type === "UROLOGY" && (
                    <>
                      <br />
                      <Row>
                        <Col>
                          <Form.Group>
                            <Form.Label>Past Surgical History:</Form.Label>
                            <Form.Control
                              as="textarea"
                              name="medical_history"
                              value={formData.medical_history}
                              onChange={handleInputChange}
                              disabled={isDisabled}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <br />
                      <Row>
                        <Col>
                          <Form.Group>
                            <Form.Label>Investigation:</Form.Label>
                            <Form.Control
                              as="textarea"
                              name="investigation"
                              value={formData.investigation}
                              onChange={handleInputChange}
                              disabled={isDisabled}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </>
                  )}
                </Form>
                <br />
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Diagnosis:</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="diagnosis"
                        placeholder="Enter Diagnosis"
                        value={formData.diagnosis || ""}
                        onChange={handleInputChange}
                        disabled={isDisabled}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <br />
                <Row className="mb-3">
                  <Col>
                    <Form.Group>
                      <Form.Label>Admission Note:</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="admmisionnote"
                        placeholder="Enter Admission Note"
                        value={formData.admmisionnote || ""}
                        onChange={handleInputChange}
                        disabled={isDisabled}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Next Appointment:</Form.Label>
                      <Form.Select
                        name="nextAppointment"
                        value={formData.nextAppointment}
                        onChange={(e) => {
                          handleInputChange(e);
                          if (e.target.value === "Surgery Patient") {
                            alert("Ready for Surgery");
                          }
                        }}
                        disabled={isDisabled}
                      >
                        <option value="" disabled>
                          Select an option
                        </option>
                        <option value="Follow-up">Follow-up Patient</option>
                        <option value="Post-Operative Patient">
                          Post-Operative Patient
                        </option>
                        <option value="Surgery Patient">Surgery Patient</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label className="d-block">Date:</Form.Label>
                      <DatePicker
                        selected={
                          formData?.appointment_timestamp
                            ? new Date(formData.appointment_timestamp)
                            : null
                        }
                        onChange={(date) => {
                          setFormData((prev) => ({
                            ...prev,
                            appointment_timestamp: date
                              ? date.toISOString().split("T")[0]
                              : "",
                          }));
                        }}
                        dateFormat="yyyy-MM-dd"
                        className="form-control"
                        placeholderText="Select Appointment Date"
                        minDate={new Date()} // ✅ Ensures only today and future dates can be selected
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        style={{
                          height: "38px",
                          width: "100%",
                        }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <br />
                {!isViewingPreviousRecords && (
                  <>
                    <Row className="mb-3">
                      <Col md={3}>
                        <Form.Group>
                          <Form.Label>Advice Medicine:</Form.Label>
                          <Form.Select
                            value={
                              selectedOptions?.medicine_name ||
                              formData.medicine_name ||
                              ""
                            }
                            placeholder="Select Medicine"
                            onChange={(e) => {
                              setSelectedOptions({
                                ...selectedOptions,
                                medicine_name: e.target.value,
                              }),
                                setFormData((prev) => ({
                                  ...prev,
                                  ...formData,
                                  medicine_name: e.target.value, // Update form data with the selected doctor's name
                                }));
                            }}
                            disabled={isDisabled}
                          >
                            {selectedPrescriptionType === "PROCTOLOGY" && (
                              <>
                                <option value="" disabled>
                                  Select Medicine
                                </option>
                                {adviceMedicineP.map((medicine, index) => (
                                  <option key={index} value={medicine.name}>
                                    {medicine.name}
                                  </option>
                                ))}
                              </>
                            )}
                            {selectedPrescriptionType === "UROLOGY" && (
                              <>
                                <option value="" disabled>
                                  Select Medicine
                                </option>
                                {adviceMedicineU.map((medicine, index) => (
                                  <option key={index} value={medicine.name}>
                                    {medicine.name}
                                  </option>
                                ))}
                              </>
                            )}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={1}>
                        <Form.Group>
                          <Form.Label>Quantity:</Form.Label>
                          <Form.Select
                            name="medicine_quantity"
                            value={
                              formData.medicine_quantity || setTableData.qty
                            }
                            onChange={handleInputChange}
                            disabled={isDisabled}
                          >
                            <option value="" disabled>
                              Qty
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
                          <Form.Label>Time Slot:</Form.Label>
                          <div className="d-flex flex-wrap">
                            {Object.keys(formData?.medicine_time).map(
                              (timings) => (
                                <label
                                  key={timings}
                                  className="d-flex align-items-center me-3"
                                >
                                  <Form.Check
                                    inline
                                    type="checkbox"
                                    name={timings}
                                    checked={formData.medicine_time[timings]}
                                    onChange={(e) =>
                                      setFormData((prev) => ({
                                        ...prev,
                                        ...formData,
                                        medicine_time: {
                                          ...formData.medicine_time,
                                          [timings]: e.target.checked,
                                        },
                                      }))
                                    }
                                    disabled={isDisabled}
                                    id={timings}
                                    style={{ marginRight: "5px" }}
                                  />
                                  {timings.replace(/([A-Z])/g, " $1").trim()}
                                </label>
                              )
                            )}
                          </div>
                        </Form.Group>
                      </Col>
                      <Col md={1}>
                        <Form.Group>
                          <Form.Label>Days:</Form.Label>
                          <Form.Select
                            name="medicine_days"
                            value={formData.medicine_days || setTableData.days}
                            onChange={handleInputChange}
                            disabled={isDisabled}
                          >
                            <option value="" disabled>
                              Days
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
                    <button onClick={handleAddToTable}>Add to Table</button>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-5">
          <Col>
            <Card>
              <Card.Body>
                <Table bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Medicine</th>
                      <th>Quantity</th>
                      <th>Time Slot</th>
                      <th>Days</th>
                      <th>Action</th>
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
                          <td>
                            <Button
                              variant="danger"
                              onClick={() => handleDeleteRow(index)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center">
                          No data added yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Button
          variant="success"
          onClick={handleSubmit}
          className="mt-4 btn-primary"
          disabled={isDisabled || isViewingPreviousRecords} // Disable if viewing previous records
          style={{ display: isViewingPreviousRecords ? "none" : "block" }} // Hide if viewing previous records
        >
          Save
        </Button>
      </Container>
      <style>
        {`
          .enquiry-card {
            border-radius: 15px;
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
            border: none;
            background: #f8f9fa;
            overflow: hidden;
            margin-bottom: 30px;
          }

          .card-body {
            padding: 30px;
          }

          .form-section {
            background: #ffffff;
            padding: 25px;
            border-radius: 12px;
            margin-bottom: 25px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          }

          .form-label {
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 8px;
            font-size: 0.95rem;
          }

          .form-control, .form-select {
            border-radius: 8px;
            border: 3px solid #dee2e6;
            padding: 12px 15px;
            transition: all 0.3s ease;
            background-color: #ffffff;
            color: #2c3e50;
            font-size: 0.95rem;
          }

          .form-control:focus, .form-select:focus {
            border-color: #00bcd4;
            box-shadow: 0 0 0 3px rgba(0, 188, 212, 0.1);
            background-color: #f8F9FA;
          }

          textarea.form-control {
            min-height: 120px;
            resize: vertical;
          }

          .form-select {
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right 0.75rem center;
            background-size: 16px 12px;
          }

          .btn-primary {
            background:linear-gradient(45deg, #00bcd4, #00acc1);
            border: none;
            padding: 12px 25px;
            border-radius: 8px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0, 188, 212, 0.2);
          }

          .btn-primary:hover {
            background: linear-gradient(45deg, #00acc1, #0097a7);
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 188, 212, 0.3);
          }

          .btn-primary:disabled {
            background: #bdc3c7;
            transform: none;
          }

          /* Error message styling */
          .error-message {
            color: #e74c3c;
            font-size: 0.85rem;
            margin-top: 5px;
          }

          /* Responsive adjustments */
          @media (max-width: 768px) {
            .card-body {
              padding: 20px;
            }

            .form-section {
              padding: 15px;
            }

            .btn-primary {
              width: 100%;
              margin-top: 15px;
            }
          }

          /* Row spacing */
          .row {
            margin-bottom: 20px;
          }

          /* Spinner styling */
          .spinner-border {
            margin-right: 8px;
            width: 1.2rem;
            height: 1.2rem;
          }

          /* Optional: Add animation for form elements */
          .form-control, .form-select, .btn {
            animation: fadeIn 0.5s ease-in-out;
          }

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

          /* Optional: Add hover effect for form controls */
          .form-control:hover, .form-select:hover {
            border-color: #3498db;
          }
        `}
      </style>
    </div>
  );
}
