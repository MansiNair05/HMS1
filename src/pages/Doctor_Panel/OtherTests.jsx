import { useState, useEffect } from "react";
import { Row, Col, Form, Container, Card, Dropdown } from "react-bootstrap";
import NavBarD from "./NavbarD";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BASE_URL = "http://192.168.29.102:5000/api"; // Update with your backend API base URL

export default function OtherTests() {
  // const [dropdownOptions, setDropdownOptions] = useState([]); // Store API options
  const [selectedOptions, setSelectedOptions] = useState({ test_type: [] }); // Track selected checkboxes
  const [tests, setTests] = useState([]);
  const [types, setTypes] = useState([]);
  const [assistants, setAssistants] = useState([]);
  const [errors, setErrors] = useState({});
  const [isDisabled, setIsDisabled] = useState(false); // Controls edit mode
  const [disablePreviousButton, setDisablePreviousButton] = useState(false); // Disables "Previous Records" after clicking
  const [patientId, setPatientId] = useState(
    localStorage.getItem("selectedPatientId")
  );
  const [formData, setFormData] = useState({
    test_date: "",
    test_type: "",
    ref_doctor: "",
    fee_status: "",
    visit_type: "",
    test_comment: "",
  });
  const [previousRecordDate, setPreviousRecordDate] = useState("");
  const [showEditButton, setShowEditButton] = useState(false);
  const [showMedicalHistory, setShowMedicalHistory] = useState(false);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [isPreviousRecordsFetched, setIsPreviousRecordsFetched] =
    useState(false);

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
          `${BASE_URL}/V1/patienttabs/listOtherTests/${patientId}`,
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

        // if (data?.data?.patientData?.length > 0) {
        //   setFormData(data.data.patientData[0]);
        if (data?.data?.otherTests) {
          const otherTests = data.data.otherTests;

          // Parse test_response JSON
          let testDetails = [];
          try {
            const testResponse = JSON.parse(otherTests.test_response);
            testDetails = testResponse.acknowledgments || [];
          } catch (error) {
            console.error("Error parsing test_response JSON:", error);
          }

          setFormData({
            test_date: otherTests.test_date?.split("T")[0] || "",
            ref_doctor: otherTests.ref_doctor || "",
            fee_status: otherTests.fee_status || "",
            visit_type: otherTests.visit_type || "",
            test_comment: otherTests.test_comment || "",
          });

          // Extract additional test details
          const additionalTests = data?.data?.testDetails || [];

          setMedicalHistory([
            ...testDetails.map((test) => ({
              test_name: test.test_name,
              test_code: test.test_code,
            })),
            ...additionalTests.map((test) => ({
              test_name: test.test_name || "",
              test_code: test.test_code || "",
            })),
          ]);

          setShowMedicalHistory(true);
        } else {
          console.warn("No patient data found in API response");
          setFormData({});
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchPatientData();
  }, [patientId]);

  useEffect(() => {
    const fetchDropdownOptions = async () => {
      try {
        const endpoints = [
          {
            url: "/V1/patienttabsdp/assistantDoc_dropdown",
            setter: setAssistants,
          },
          {
            url: "/V1/patienttabsdp/testType_dropdown",
            setter: setTypes,
          },
        ];

        for (const { url, setter } of endpoints) {
          const response = await fetch(`${BASE_URL}${url}`);
          const data = await response.json();

          if (!response.ok) {
            throw new Error(
              `Error fetching ${url}: ${data.message || "Unknown error"}`
            );
          }

          console.log(`${url} Data:`, data.data); // Log fetched data to the console
          setter(data.data || []);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setErrors("Failed to fetch dropdown data.");
      }
    };
    fetchDropdownOptions();
  }, []);

  const handleInputChange = (e) => {
    if (isDisabled) return; // Don't update if form is disabled

    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      // Prepare the data to be sent
      const dataToSend = {
        ...formData,
        test_type: selectedOptions.test_type.join(", "), // Join selected test types into a string
        ref_doctor: selectedOptions.ref_doctor || formData.ref_doctor,
        patient_id: patientId,
      };

      console.log("Sending Data:", JSON.stringify(dataToSend, null, 2));

      const response = await fetch(
        `${BASE_URL}/V1/otherTests/addOtherTests/${patientId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend),
        }
      );

      const responseData = await response.json();
      console.log("Response Data:", responseData);

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to save data");
      }

      alert("Form submitted successfully!");

      // Clear the form after successful submission
      setFormData({
        test_date: "",
        test_type: "",
        ref_doctor: "",
        fee_status: "",
        visit_type: "",
        test_comment: "",
      });

      // Reset selected options
      setSelectedOptions({
        test_type: [],
        ref_doctor: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit form. Please try again.");
    }
  };

  // Handle checkbox selection change for test type
  const handleTestTypeChange = (e, test_type) => {
    if (isDisabled) return; // Don't update if form is disabled

    const { checked } = e.target;
    setSelectedOptions((prevState) => {
      const updatedTestTypes = checked
        ? [...prevState.test_type, test_type]
        : prevState.test_type.filter((item) => item !== test_type);

      return {
        ...prevState,
        test_type: updatedTestTypes,
      };
    });
  };

  const handleNewRecord = () => {
    // Clear form data
    setFormData({
      test_date: "",
      test_type: "",
      ref_doctor: "",
      fee_status: "",
      visit_type: "",
      test_comment: "",
    });

    // Reset selected options
    setSelectedOptions({
      test_type: [],
      ref_doctor: "",
    });

    // Enable the "Previous Records" button
    setDisablePreviousButton(false);

    // Hide the Edit button
    setShowEditButton(false);

    // Enable form editing
    setIsDisabled(false);

    // Clear previous record date
    setPreviousRecordDate("");

    // Hide medical history table
    setShowMedicalHistory(false);
    setMedicalHistory([]);

    alert("New Record: You can now enter new data.");
  };

  const fetchPreviousRecords = async (prevData) => {
    try {
      console.log("Fetching records for patientId:", patientId);

      if (!patientId) {
        console.error("No patientId available");
        alert("Patient ID is missing");
        return;
      }

      const response = await fetch(
        `${BASE_URL}/V1/otherTests/listOtherTests/${patientId}`
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(
          `Failed to fetch previous records: ${response.status} ${errorText}`
        );
      }

      const result = await response.json();
      console.log("Parsed API Response:", result);

      if (!result?.data?.otherTests) {
        console.log("No records found in response");
        alert("No previous records found.");
        return;
      }

      // const otherTests = result.data.otherTests;
      const { otherTests, testDetails } = result.data;
      console.log("Other Tests Data:", otherTests);

      // Format the date string to YYYY-MM-DD for the date input
      const formattedDate = otherTests.test_date
        ? new Date(otherTests.test_date).toISOString().split("T")[0]
        : "";

      // Update form data with previous record
      const updatedFormData = {
        test_date: formattedDate,
        ref_doctor: otherTests.ref_doctor || "",
        fee_status: otherTests.fee_status || "",
        visit_type: otherTests.visit_type || "",
        test_comment: otherTests.test_comment || "",
      };

      console.log("Updating form data with:", updatedFormData);
      setFormData(updatedFormData);

      // Set medical history data from testDetails and show the table
      const medicalHistoryData =
        testDetails?.map((test) => ({
          test_name: test.test_name,
          test_code: test.test_code,
        })) || [];

      setMedicalHistory(medicalHistoryData);
      // Show medical history table only after fetching previous records
      setShowMedicalHistory(true);

      // Set previous record date for display
      setPreviousRecordDate(formattedDate);

      // Disable the Previous Records button
      setDisablePreviousButton(true);

      // Show Edit button
      setShowEditButton(true);

      // Disable form editing until Edit button is clicked
      setIsDisabled(true);
      setIsPreviousRecordsFetched(true);
    } catch (error) {
      console.error("Error in fetchPreviousRecords:", error);
      alert(`Failed to fetch previous records: ${error.message}`);
      // Hide medical history table if there's an error
      setShowMedicalHistory(false);
      setMedicalHistory([]);
    }
  };

  // Add Edit button handler
  const handleEditOtherTests = () => {
    setIsDisabled(false);
    alert("Editing mode enabled. You can now modify the test details.");
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
      <NavBarD pagename="Other Tests" />
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
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ marginTop: "5px" }}
                    onClick={handleNewRecord}
                  >
                    New Record
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ marginTop: "5px", float: "right" }}
                    onClick={fetchPreviousRecords}
                    disabled={disablePreviousButton}
                  >
                    Previous Records
                  </button>
                  {/* Add Edit button */}
                  {showEditButton && (
                    <button
                      type="button"
                      className="btn btn-warning"
                      style={{
                        marginTop: "5px",
                        float: "right",
                        marginRight: "7px",
                      }}
                      onClick={handleEditOtherTests}
                    >
                      Edit Test Details
                    </button>
                  )}
                  <br />
                  <br />
                  {/* Show previous record date */}
                  {previousRecordDate && (
                    <div style={{ marginTop: "15px" }}>
                      <strong>Previous Record Date: </strong>
                      <span>{previousRecordDate}</span>
                    </div>
                  )}
                  <Row>
                    <Col md={2} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label className="d-block">Date</Form.Label>
                        <DatePicker
                          selected={
                            formData?.test_date
                              ? new Date(formData.test_date)
                              : null
                          }
                          onChange={(date) => {
                            handleInputChange({
                              target: {
                                name: "test_date",
                                value: date
                                  ? date.toISOString().split("T")[0]
                                  : "",
                              },
                            });
                          }}
                          disabled={isDisabled}
                          dateFormat="yyyy-MM-dd"
                          className="form-control"
                          placeholderText="Select Date"
                          maxDate={new Date()} // Prevent selecting future dates
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          style={{
                            height: "38px",
                            width: "100%",
                          }}
                          wrapperClassName="date-picker-wrapper"
                        />
                      </Form.Group>
                    </Col>

                    {/* Test Type Dropdown with Multiple Checkboxes */}
                    {!isPreviousRecordsFetched && (
                      <Col md={2} className="mb-4">
                        <Form.Group controlId="test_type">
                          <Form.Label>Test Type</Form.Label>
                          <Dropdown>
                            <Dropdown.Toggle
                              variant="primary"
                              id="dropdown-basic"
                              disabled={isDisabled}
                            >
                              {selectedOptions.test_type.length === 0
                                ? "Select test types"
                                : selectedOptions.test_type.length === 1
                                ? selectedOptions.test_type[0]
                                : `${selectedOptions.test_type.length} Tests Selected`}
                            </Dropdown.Toggle>

                            <Dropdown.Menu
                              style={{
                                backgroundColor: "white",
                                padding: "10px",
                                maxHeight: "300px",
                                overflowY: "auto",
                              }}
                            >
                              {[
                                ...new Set([
                                  ...tests.map((option) => option.test_type),
                                  ...types.map((type) => type.name),
                                ]),
                              ].map((test_type, index) => (
                                <Form.Check
                                  key={index}
                                  type="checkbox"
                                  label={test_type}
                                  value={test_type}
                                  checked={selectedOptions.test_type?.includes(
                                    test_type
                                  )}
                                  onChange={(e) =>
                                    handleTestTypeChange(e, test_type)
                                  }
                                  // wrapperClassName="date-picker-wrapper"
                                />
                              ))}
                            </Dropdown.Menu>
                          </Dropdown>
                          {/* Show selected items below only when multiple are selected */}
                          {selectedOptions.test_type.length > 1 && (
                            <div
                              className="mt-2"
                              style={{ fontSize: "0.9em", color: "#666" }}
                            ></div>
                          )}
                        </Form.Group>
                      </Col>
                    )}

                    <Col md={4} className="mb-4">
                      <Form.Group controlId="ref_doctor">
                        <Form.Label>Ref. Doctor Name</Form.Label>
                        <Form.Select
                          value={
                            formData.ref_doctor ||
                            selectedOptions?.ref_doctor ||
                            ""
                          }
                          onChange={(e) =>
                            setSelectedOptions({
                              ...selectedOptions,
                              ref_doctor: e.target.value,
                            })
                          }
                        >
                          <option value="">Assistant Doctor</option>
                          {[
                            ...new Set([
                              ...tests.map((option) => option.ref_doctor),
                              ...assistants.map((assistant) => assistant.name),
                            ]),
                          ].map((ref_doctor, index) => (
                            <option key={index} value={ref_doctor}>
                              {ref_doctor}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Test Fee</Form.Label>
                        <Form.Select
                          name="fee_status"
                          value={formData.fee_status || ""}
                          onChange={handleInputChange}
                        >
                          <option value="">SELECT FEE STATUS</option>
                          <option value="true">YES</option>
                          <option value="NO">NO</option>
                          <option value="DUE">DUE</option>
                          <option value="DNC">DNC</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Visit Type</Form.Label>
                        <Form.Select
                          name="visit_type"
                          value={formData.visit_type || ""}
                          onChange={handleInputChange}
                        >
                          <option value="">SELECT VISIT TYPE</option>
                          <option value="OPD">OPD</option>
                          <option value="IPD">IPD</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="test_comment"
                          value={formData.test_comment || ""}
                          onChange={handleInputChange}
                          placeholder="Enter Comments"
                          disabled={isDisabled}
                        />
                      </Form.Group>
                    </Col>
                    {/* Medical History Table */}
                    {showMedicalHistory && (
                      <div className="mb-4">
                        <h4 className="mb-3">Medical History</h4>
                        <div className="table-responsive">
                          <table className="table table-bordered table-striped">
                            <thead className="table-primary">
                              <tr>
                                <th scope="col" style={{ width: "10%" }}>
                                  Sr. No
                                </th>
                                <th scope="col" style={{ width: "45%" }}>
                                  Name of Test
                                </th>
                                <th scope="col" style={{ width: "45%" }}>
                                  Test Code
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {medicalHistory.map((record, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{record.test_name}</td>
                                  <td>{record.test_code}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ marginTop: "30px", float: "right" }}
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
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
                 .date-picker-wrapper {
            margin-bottom: 0 !important;
          }

          .react-datepicker-wrapper {
            margin-bottom: 0 !important;
            display: block;
          }

          .react-datepicker__input-container {
            margin-bottom: 0 !important;
            display: block;
          }
        `}
      </style>
    </div>
  );
}
