import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Form,
  Row,
  Col,
  Container,
  Dropdown,
  DropdownButton,
  Table,
} from "react-bootstrap";
import PageBreadcrumb from "../../componets/PageBreadcrumb";

const BASE_URL = "http://192.168.90.193:5000/api";

const OpdPrescription = () => {
  const [formData, setFormData] = useState({
    prescription_id: "",
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
  const [adviceMedicine, setdAdviceMedicine] = useState([]);

  const [selectedOptions, setSelectedOptions] = useState({}); // Track selected checkboxes

// Fetch options from API
  useEffect(() => {
    const fetchDropdownOptions = async () => {
      try {
        const endpoints = [
          {
            url: "/V1/patienttabs/assistantDoc_dropdown",
            setter: setAssistantsDoctor,
          },
          {
            url: "/V1/patienttabs/medicine_dropdown",
            setter: setAssistantsDoctor,
          },
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
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
    if (!formData.adviceMedicine || !formData.qty || !formData.days) {
      alert("Please fill in medicine, quantity, and days fields.");
      return;
    }

    const selectedMealTimings = Object.keys(formData.mealTimings)
      .filter((timing) => formData.mealTimings[timing])
      .join(", ");

    const newTableRow = {
      medicine: formData.adviceMedicine,
      qty: formData.qty,
      mealTimings: selectedMealTimings || "None",
      days: formData.days,
    };

    setTableData((prevData) => [...prevData, newTableRow]);

    // Reset specific fields
    setFormData((prevFormData) => ({
      ...prevFormData,
      adviceMedicine: "",
      qty: "",
      days: "",
      mealTimings: {
        BeforeBreakfast: false,
        AfterBreakfast: false,
        BeforeLunch: false,
        AfterLunch: false,
        BeforeDinner: false,
        AfterDinner: false,
        AfterEveningSnacks: false,
      },
    }));
  };

  const handleSubmit = () => {
    console.log("Form data submitted:", formData);
    alert("Form submitted successfully!");
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
      <PageBreadcrumb pagename="OPD Prescription" />
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
                  <Row className="mb-3">
                    <Form>
                      <Row>
                        <Col>
                          <Form.Group>
                            <Form.Label>Prescription Type:</Form.Label>
                            <Form.Select
                              name="prescription_id"
                              value={formData.prescription_id}
                              onChange={handleInputChange}
                            >
                              <option value="">Select an option</option>
                              <option value="PROCTOLOGY">PROCTOLOGY</option>
                              <option value="UROLOGY">UROLOGY</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>

                      {formData.prescription_id === "UROLOGY" && (
                        <>
                          {/* PREPO Investigation Multiple Checkbox Dropdown */}
                          <Row>
                            <Col>
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

                          {/* Medical History */}
                          <Row>
                            <Col>
                              <Form.Group>
                                <Form.Label>Medical History:</Form.Label>
                                <Form.Control
                                  as="textarea"
                                  name="medical_history"
                                  value={formData.medical_history}
                                  onChange={handleInputChange}
                                />
                              </Form.Group>
                            </Col>
                          </Row>

                          {/* Investigation */}
                          <Row>
                            <Col>
                              <Form.Group>
                                <Form.Label>Investigation:</Form.Label>
                                <Form.Control
                                  as="textarea"
                                  name="investigation"
                                  value={formData.investigation}
                                  onChange={handleInputChange}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                        </>
                      )}
                    </Form>
                    <Col>
                      <Form.Group>
                        <Form.Label>Date of Prescription:</Form.Label>
                        <Form.Control
                          type="date"
                          name="creation_timestamp"
                          value={
                            formData.creation_timestamp ||
                            new Date().toISOString().split("T")[0]
                          }
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>Allergy:</Form.Label>
                        <Form.Check
                          type="checkbox"
                          name="allergy"
                          checked={formData.allergy}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              allergy: e.target.checked,
                            })
                          }
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Additional fields */}
                  <Row className="mb-3">
                    <Col>
                      <Form.Group>
                        <Form.Label>Assistant Doctor:</Form.Label>
                        <Form.Select
                          value={selectedOptions.assistantsDoctorName || ""}
                          onChange={(e) =>
                            setSelectedOptions({
                              ...selectedOptions,
                              assistantsDoctorName: e.target.value,
                            })
                          }
                        >
                          <option value="">Select Assistant</option>
                          {[
                            ...new Set([
                              ...opdPrescription
                                .map(
                                  (option) =>
                                    option.assistantsDoctorconsultantName
                                )
                                .filter(Boolean),
                              ...assistantsDoctor
                                .map((doctor) => doctor.name)
                                .filter(Boolean),
                            ]),
                          ].map((assistantsDoctorName, index) => (
                            <option key={index} value={assistantsDoctorName}>
                              {assistantsDoctorName}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>Test Advice:</Form.Label>
                        <Dropdown>
                          <Dropdown.Toggle variant="primary" as={Button}>
                            {formData.testAdvice.length > 0
                              ? formData.testAdvice.join(", ")
                              : "Select Test Advice"}
                          </Dropdown.Toggle>

                          <Dropdown.Menu
                            style={{ maxHeight: "200px", overflowY: "auto" }}
                          >
                            {testAdviceOptions.map((option) => (
                              <Dropdown.Item key={option} as="div">
                                <Form.Check
                                  type="checkbox"
                                  label={option}
                                  value={option}
                                  checked={formData.testAdvice.includes(option)}
                                  onChange={handleTestAdviceChange}
                                />
                              </Dropdown.Item>
                            ))}
                          </Dropdown.Menu>
                        </Dropdown>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col>
                      <Form.Group>
                        <Form.Label>Diagnosis:</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="diagnosis"
                          value={formData.diagnosis}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>Advice Sx:</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="advicesx"
                          value={formData.advicesx}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col>
                      <Form.Group>
                        <Form.Label>Admission Note:</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="admissionnote"
                          value={formData.admissionnote}
                          onChange={handleInputChange}
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
                        >
                          <option value="" disabled>
                            Select an option
                          </option>
                          <option value="Follow-up">Follow-up Patient</option>
                          <option value="Post-Operative Patient">
                            Post-Operative Patient
                          </option>
                          <option value="Surgery Patient">
                            Surgery Patient
                          </option>
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
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col>
                      <Form.Group>
                        <Form.Label>Advice Medicine:</Form.Label>
                        <Form.Select
                          name="adviceMedicine"
                          value={formData.adviceMedicine}
                          onChange={handleInputChange}
                        >
                          <option value="" disabled>
                            Select Medicine
                          </option>
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

                  <Row className="mb-3">
                    <Col>
                      <Form.Group>
                        <Form.Label>Time Slot:</Form.Label>
                        <div>
                          {Object.keys(formData.medicine_time).map((timing) => (
                            <Form.Check
                              key={timing}
                              inline
                              type="checkbox"
                              label={timing.replace(/([A-Z])/g, " $1").trim()}
                              name={timing}
                              checked={formData.medicine_time[timing]}
                              onChange={handleCheckboxChange}
                            />
                          ))}
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Button
                    variant="primary"
                    onClick={handleAddToTable}
                    className="mt-4"
                  >
                    Add to Table
                  </Button>
                </Form>
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
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Button variant="success" onClick={handleSubmit} className="mt-4">
          Save
        </Button>
      </Container>
    </div>
  );
};

export default OpdPrescription;
