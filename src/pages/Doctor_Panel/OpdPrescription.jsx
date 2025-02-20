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

const BASE_URL = "http://192.168.90.158:5000/api";

export default function OpdPrescription() {
  const [formData, setFormData] = useState({
    prescription_type: "",
    prepo_investigation: [],
    medical_history: "",
    investigation: "",
    creation_timestamp: "",
    allergy: false,
    doctor_id: "",
    testAdvice: [],
    diagnosis: "",
    advicesx: "",
    admissionnote: "",
    nextAppointment: "",
    appointmentDate: "",
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

  const [tableData, setTableData] = useState([]);
  const [errors, setErrors] = useState({});
  const [opdPrescription, setOpdPrescription] = useState([]);
  const [assistantsDoctor, setAssistantsDoctor] = useState([]);
  const [adviceMedicineP, setAdviceMedicineP] = useState([]);
  const [adviceMedicineU, setAdviceMedicineU] = useState([]);
  const [testAdviceP, setTestAdviceP] = useState([]);
  const [testAdviceU, setTestAdviceU] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({}); // Track selected checkboxes
  const [patientId, setPatientId] = useState(
    localStorage.getItem("selectedPatientId")
  );
  const [isDisabled, setIsDisabled] = useState(false); // Controls edit mode
  const [disablePreviousButton, setDisablePreviousButton] = useState(false); // Disables "Previous Records" after clicking
  const [showEditButton, setShowEditButton] = useState(false);
  const [previousRecordDate, setPreviousRecordDate] = useState("");

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

  // useEffect(() => {
  //   if (!patientId) {
  //     console.warn("No patientId found, skipping fetch");
  //     return;
  //   }

  //   const fetchPatientData = async () => {
  //     console.log(`Fetching data for patient ID: ${patientId}`);

  //     try {
  //       const response = await fetch(
  //         `${BASE_URL}/V1/followUp/listFollowUp/${patientId}`,
  //         {
  //           method: "GET",
  //           headers: { "Content-Type": "application/json" },
  //         }
  //       );

  //       if (!response.ok) {
  //         console.error(
  //           "API Response Error:",
  //           response.status,
  //           await response.text()
  //         );
  //         return;
  //       }

  //       const data = await response.json();
  //       console.log("Fetched Data:", data);

  //       if (data?.data?.patientData?.length > 0) {
  //         console.log("Setting OpdPrescription Data...");
  //         setOpdPrescription(data.data.patientData[0]);
  //       } else {
  //         console.warn("No patient data found in API response");
  //         setOpdPrescription({});
  //       }
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //       setOpdPrescription({});
  //     }
  //   };

  //   fetchPatientData();
  // }, [patientId]);

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
            setter: setAdviceMedicineP,
          },
          {
            url: "/V1/patienttabsdp/urologyMedicine_dropdown",
            setter: setAdviceMedicineU,
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log(`Handling input change: ${name} = ${value}`);

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
    // Log the current state to debug
    console.log("Current formData:", formData);
    console.log("Selected Options:", selectedOptions);

    const selectedMealTime = Object.keys(formData.medicine_time)
      .filter((timings) => formData.medicine_time[timings])
      .join(", ");

    const newTableRow = {
      medicine: selectedOptions.adviceMedicine || "",
      quantity: formData.medicine_quantity || "", // Make sure we're capturing the quantity
      mealTimings: selectedMealTime || "None",
      days: formData.medicine_days || "",
    };

    // Log the new row being added
    console.log("Adding new row:", newTableRow);

    setTableData((prevData) => {
      const updatedData = [...prevData, newTableRow];
      console.log("Updated table data:", updatedData);
      return updatedData;
    });

    // Reset form fields
    setFormData((prevFormData) => ({
      ...prevFormData,
      adviceMedicine: "",
      medicine_quantity: "",
      medicine_days: "",
      medicine_time: {
        BeforeBreakfast: false,
        AfterBreakfast: false,
        BeforeLunch: false,
        AfterLunch: false,
        BeforeDinner: false,
        AfterDinner: false,
        AfterEveningSnacks: false,
      },
    }));

    // Reset selected options
    setSelectedOptions((prev) => ({
      ...prev,
      adviceMedicine: "",
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
      // Convert medicine_time object to a string
      const formDataToSubmit = {
        ...formData,
        medicine_time: JSON.stringify(formData.medicine_time),
      };

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

  // Combine and remove duplicates from both arrays (opdPrescription and testAdviceU)
  // Combine and remove duplicates from both arrays (opdPrescription and testAdviceU)
  useEffect(() => {
    const storedPatientId = localStorage.getItem("selectedPatientId");
    if (storedPatientId) setPatientId(storedPatientId);
  }, []);
const fetchPreviousRecords = async () => {
  try {
    console.log("Fetching previous records for Patient ID:", patientId);

    const response = await fetch(
      `${BASE_URL}/V1/prescription/listPrescription/${patientId}`
    );
    const result = await response.json();

    console.log("Full API Response:", JSON.stringify(result, null, 2));

    if (!response.ok) {
      console.error("API Error:", response.status, result.message);
      alert("Failed to fetch data. Please try again.");
      return;
    }

    if (!result?.data?.prescription) {
      alert("No previous records found");
      return;
    }

    const prescription = result.data.prescription;
    console.log("Fetched Prescription Data:", prescription);

    // Disable the Previous Records button
    setDisablePreviousButton(true);
    setShowEditButton(true);
    setIsDisabled(true);

    // Format date correctly for React input
    const formattedDate = prescription.creation_timestamp
      ? prescription.creation_timestamp.split("T")[0]
      : "";

    // Ensure medicine_time is an object
    let medicineTime = {};
    try {
      medicineTime =
        typeof prescription.medicine_time === "string"
          ? JSON.parse(prescription.medicine_time)
          : prescription.medicine_time || {};
    } catch (err) {
      console.warn("Invalid medicine_time format:", prescription.medicine_time);
      medicineTime = {}; // Prevents crashes
    }

    // Update form data with API response
    setFormData({
      prescription_type: prescription.prescription_type || "",
      creation_timestamp: formattedDate,
      allergy: prescription.allergy === "1" || prescription.allergy === true,
      doctor_id: prescription.doctor_id ? String(prescription.doctor_id) : "",
      diagnosis: prescription.diagnosis || "",
      admissionnote: prescription.admissionnote || "",
      nextAppointment: prescription.nextAppointment || "",
      appointmentDate: prescription.appointmentDate || "",
      medicine_name: prescription.medicine_name || "",
      medicine_quantity: prescription.medicine_quantity
        ? String(prescription.medicine_quantity)
        : "",
      medicine_days: prescription.medicine_days
        ? String(prescription.medicine_days)
        : "",
      medicine_time: {
        BeforeBreakfast: medicineTime.BeforeBreakfast || false,
        AfterBreakfast: medicineTime.AfterBreakfast || false,
        BeforeLunch: medicineTime.BeforeLunch || false,
        AfterLunch: medicineTime.AfterLunch || false,
        BeforeDinner: medicineTime.BeforeDinner || false,
        AfterDinner: medicineTime.AfterDinner || false,
        AfterEveningSnacks: medicineTime.AfterEveningSnacks || false,
      },
      testAdvice: Array.isArray(prescription.testAdvice)
        ? prescription.testAdvice
        : [],
    });

    // Update table data with medicine information
    if (
      Array.isArray(prescription.medicines) &&
      prescription.medicines.length > 0
    ) {
      const formattedTableData = prescription.medicines.map((med, index) => {
        console.log(`Medicine ${index + 1}:`, med);

        // Ensure medicine_time is an object before using Object.entries()
        let medTime = {};
        try {
          medTime =
            typeof med.medicine_time === "string"
              ? JSON.parse(med.medicine_time)
              : med.medicine_time || {};
        } catch (err) {
          console.warn(
            `Invalid medicine_time format for medicine ${index + 1}:`,
            med.medicine_time
          );
          medTime = {}; // Prevent crashes
        }

        return {
          medicine: med.medicine_name || med.adviceMedicine || "",
          qty: med.medicine_quantity ? String(med.medicine_quantity) : "",
          mealTimings: Object.entries(medTime)
            .filter(([_, value]) => value)
            .map(([key]) => key)
            .join(", "),
          days: med.medicine_days ? String(med.medicine_days) : "",
        };
      });

      setTableData(formattedTableData);
    } else {
      setTableData([]);
    }

    console.log("Final FormData:", formData);
    console.log("Final TableData:", tableData);
  } catch (error) {
    console.error("Error fetching previous records:", error);
    alert("Failed to fetch previous records.");
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
      creation_timestamp: "",
      allergy: false,
      doctor_id: "",
      testAdvice: [],
      diagnosis: "",
      advicesx: "",
      admissionnote: "",
      nextAppointment: "",
      appointmentDate: "",
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

    // Reset table data
    setTableData([]);

    // Enable the "Previous Records" button
    setDisablePreviousButton(false);

    // Hide the Edit button
    setShowEditButton(false);

    // Enable form editing
    setIsDisabled(false);

    // Clear previous record date
    setPreviousRecordDate("");

    alert("New Record: You can now enter new data.");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEditPrescription = () => {
    setIsDisabled(false);
    alert("You can now edit the prescription details.");
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
        value={selectedOptions?.adviceMedicine || ""}
        onChange={(e) =>
          setSelectedOptions({
            ...selectedOptions,
            adviceMedicine: e.target.value,
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

  const renderMedicineTable = () => {
    // Log table data when rendering
    console.log("Current table data:", tableData);

    return (
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
            tableData.map((row, index) => {
              // Log each row being rendered
              console.log(`Rendering row ${index}:`, row);
              return (
                <tr key={index}>
                  <td>{row.medicine}</td>
                  <td>{row.quantity}</td>
                  <td>{row.mealTimings}</td>
                  <td>{row.days}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No data added yet.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
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
                background: "white",
                border: "1px solid #00bcd4",
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
                      style={{ float: "right" }}
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
                    {showEditButton && (
                      <button
                        type="button"
                        className="btn btn-warning"
                        style={{ float: "right", marginRight: "7px" }}
                        onClick={handleEditPrescription}
                      >
                        Edit Prescription
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
                          <option value="">Select an option</option>
                          <option value="PROCTOLOGY">PROCTOLOGY</option>
                          <option value="UROLOGY">UROLOGY</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col>
                      <Form.Group>
                        <Form.Label>Date of Prescription:</Form.Label>
                        <Form.Control
                          type="date"
                          name="creation_timestamp"
                          value={formData.creation_timestamp || ""}
                          onChange={handleInputChange}
                          disabled={isDisabled}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>Allergy:</Form.Label>
                        <Form.Check
                          type="checkbox"
                          name="allergy"
                          checked={formData.allergy || false}
                          onChange={handleInputChange}
                          disabled={isDisabled}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  {formData.prescription_type === "PROCTOLOGY" && (
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
                              <Dropdown.Toggle variant="primary" as={Button}>
                                {formData.testAdvice.length > 0
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
                                    />
                                  </Dropdown.Item>
                                ))}
                              </Dropdown.Menu>
                            </Dropdown>
                          </Form.Group>
                        </Col>
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
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label>Advice Medicine:</Form.Label>
                            {renderMedicineOptions("PROCTOLOGY")}
                          </Form.Group>
                        </Col>
                      </Row>
                    </>
                  )}
                  {formData.prescription_type === "UROLOGY" && (
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
                              <Dropdown.Toggle variant="primary" as={Button}>
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
                                    />
                                  </Dropdown.Item>
                                ))}
                              </Dropdown.Menu>
                            </Dropdown>
                          </Form.Group>
                        </Col>
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
                      </Row>
                      <br />
                      <Row>
                        <Col>
                          <Form.Group>
                            <Form.Label>Medical History:</Form.Label>
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
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label>Advice Medicine:</Form.Label>
                            {renderMedicineOptions("UROLOGY")}
                          </Form.Group>
                        </Col>
                      </Row>
                    </>
                  )}
                </Form>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Diagnosis:</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="diagnosis"
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
                        name="admissionnote"
                        value={formData.admissionnote || ""}
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
                        onChange={handleInputChange}
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
                      <Form.Label>Date:</Form.Label>
                      <Form.Control
                        type="date"
                        name="appointmentDate"
                        value={formData.appointmentDate}
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
                      <Form.Label>Qty:</Form.Label>
                      <Form.Select
                        name="medicine_quantity"
                        value={formData.medicine_quantity}
                        onChange={handleInputChange}
                        disabled={isDisabled}
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
                        disabled={isDisabled}
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
                        {Object.keys(formData.medicine_time).map((timings) => (
                          <Form.Check
                            key={timings}
                            inline
                            type="checkbox"
                            label={timings.replace(/([A-Z])/g, " $1").trim()}
                            name={timings}
                            checked={formData.medicine_time[timings]}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                medicine_time: {
                                  ...formData.medicine_time,
                                  [timings]: e.target.checked,
                                },
                              })
                            }
                            disabled={isDisabled}
                          />
                        ))}
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
                <br />
                <button onClick={handleAddToTable}>Add to Table</button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-5">
          <Col>
            <Card>
              <Card.Body>{renderMedicineTable()}</Card.Body>
            </Card>
          </Col>
        </Row>

        <Button variant="success" onClick={handleSubmit} className="mt-4">
          Save
        </Button>
      </Container>
    </div>
  );
}
