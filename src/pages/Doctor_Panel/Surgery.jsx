import { useState, useEffect } from "react";
import { Card, Button, Form, Row, Col, Container } from "react-bootstrap";
import NavBarD from "./NavbarD"; // Fixed typo in 'components'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Surgery = () => {
  const [formData, setFormData] = useState({
    admission_date: "",
    surgery_date: "",
    risk_consent: "",
    assistanceDoctor: "",
    anaesthetist: "",
    anesthesia: {
      la: false,
      sa: false,
      ga: false,
      other:"",
    },

    plan: "",
    surgery_remarks: "",
    surgery_note: "",
    additional_comment: "",
  });

  const [surgery, setSurgery] = useState([]);
  const [assistantsDoctor, setAssistantsDoctor] = useState([]);
  const [anaesthetist, setAnaesthetist] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [patientId, setPatientId] = useState(
    localStorage.getItem("selectedPatientId")
  );
  const [isDisabled, setIsDisabled] = useState(false);
  const [disablePreviousButton, setDisablePreviousButton] = useState(false);
  const [showEditButton, setShowEditButton] = useState(false);
  const [previousRecordDate, setPreviousRecordDate] = useState("");
  const [isOtherSpecifyDisabled, setIsOtherSpecifyDisabled] = useState(false);

  const BASE_URL = "http://192.168.29.115:5000/api";

  // Update the API endpoints constants
  const API_ENDPOINTS = {
    GET_SURGERY: "/V1/surgeryDetails/listSurgeryDetails", // Updated endpoint
    ADD_SURGERY: "/V1/surgeryDetails/addSurgeryDetails", // Updated endpoint
    UPDATE_SURGERY: "/V1/surgeryDetails/updateSurgeryDetails",
  };

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
            url: "/V1/patienttabsdp/anaesthetist_dropdown",
            setter: setAnaesthetist,
          },
        ];

        for (const { url, setter } of endpoints) {
          const response = await fetch(`${BASE_URL}${url}`);
          const data = await response.json();
          if (response.ok) setter(data.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch dropdown data.");
      }
    };
    fetchDropdownOptions();
  }, []);

  // Fetch patient ID from localStorage
  useEffect(() => {
    const storedPatientId = localStorage.getItem("selectedPatientId");
    if (storedPatientId) setPatientId(storedPatientId);
  }, []);

  // Function to fetch previous records
  const fetchPreviousRecords = async () => {
    try {
      if (!patientId) {
        alert("Patient ID is missing");
        return;
      }

      const url = `${BASE_URL}${API_ENDPOINTS.GET_SURGERY}/${patientId}`;
      console.log("Fetching from URL:", url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("API Response:", result);

      if (!result?.data?.surgeryDetails) {
        alert("No previous records found");
        return;
      }

      const surgeryData = result.data.surgeryDetails;

      // Ensure surgeryData and its properties are defined
     const AnesthesiaString = surgeryData.anesthesia || "";
     const AknownConditions = ["LA", "SA", "GA"];
     const anesthesiaArray = AnesthesiaString.split(",").map((item) =>
       item.trim()
     );

      // Update states
      setDisablePreviousButton(true);
      setShowEditButton(true);
      setIsDisabled(true);
      setPreviousRecordDate(surgeryData.surgery_date || "");

      // Update form data
      setFormData({
        admission_date: surgeryData.admission_date || "",
        surgery_date: surgeryData.surgery_date || "",
        risk_consent: surgeryData.risk_consent || "",
        assistanceDoctor: surgeryData.assistanceDoctor || "",
        anaesthetist: surgeryData.anaesthetist || "",
        anesthesia: {
          la: anesthesiaArray.includes("LA"),
          sa: anesthesiaArray.includes("SA"),
          ga: anesthesiaArray.includes("GA"),
          other: anesthesiaArray
            .filter((condition) => !AknownConditions.includes(condition))
            .join(", "), // Set otherDetails
        }, // Set the parsed object
        surgery_remarks: surgeryData.surgery_remarks || "",
        plan: surgeryData.plan || "",
        surgery_note: surgeryData.surgery_note || "",
        additional_comment: surgeryData.additional_comment || "",
      });
    } catch (error) {
      console.error("Error fetching previous records:", error);
      alert("Failed to fetch previous records");
    }
  };

  // Function to handle new record
  const handleNewRecord = () => {
    setFormData({
      admission_date: "",
      surgery_date: "",
      risk_consent: "",
      assistanceDoctor: "",
      anaesthetist: "",
      anesthesia: {
        LA: "",
        SA: "",
        GA: "",
      },

      surgery_remarks: "",
      plan: "",
      surgery_note: "",
      additional_comment: "",
    });

    // Reset states
    setDisablePreviousButton(false);
    setShowEditButton(false);
    setIsDisabled(false);
    setPreviousRecordDate("");

    alert("New Record: You can now enter new data.");
  };

  // Function to handle edit
  const handleEditSurgery = () => {
    setIsDisabled(false);
    setSelectedOptions((prev) => ({
      ...prev,
      assistanceDoctor: formData.assistanceDoctor || "", // Ensure old value is loaded
    }));
    setIsOtherSpecifyDisabled(true);
    alert("You can now edit the surgery details.");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Submitting surgery details for patientId:", patientId);

      // Convert anesthesia object to string
      const anesthesiaArray = [];
      if (formData.anesthesia.la)
        anesthesiaArray.push("LA");
      if (formData.anesthesia.sa) anesthesiaArray.push("SA");
      if (formData.anesthesia.ga) anesthesiaArray.push("GA");
      if (formData.anesthesia.other)
        anesthesiaArray.push(formData.anesthesia.other);

      // Construct the request body
      const requestBody = {
        patientId: patientId,
        admission_date: formData.admission_date,
        surgery_date: formData.surgery_date,
        risk_consent: formData.risk_consent,
        assistanceDoctor:
          selectedOptions.assistanceDoctor || formData.assistanceDoctor || "",
        anaesthetist: selectedOptions.anaesthetist || "",
        anesthesia: anesthesiaArray.join(","), // Only LA, SA, GA

        surgery_remarks: formData.surgery_remarks,
        plan: formData.plan,
        surgery_note: formData.surgery_note,
        additional_comment: formData.additional_comment,
        is_deleted: 0,
        doctor_id: localStorage.getItem("doctor_id") || "",
        // creation_timestamp: new Date().toISOString(),
      };

      console.log("Request body:", requestBody);

      // Send the request
      const response = await fetch(
        `${BASE_URL}${API_ENDPOINTS.ADD_SURGERY}/${patientId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      // Check for response errors
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(
          `Server responded with status: ${response.status} - ${errorText}`
        );
      }

      // Parse the response data
      const data = await response.json();
      console.log("Response data:", data);

      // Handle success response
      if (response.ok) {
        alert("Surgery details saved successfully!");
        setIsDisabled(true);
        ``;
        setShowEditButton(true);
        setPreviousRecordDate(formData.surgery_date);
        setDisablePreviousButton(true);

        setSelectedOptions({
          assistantsDoctor: requestBody.assistanceDoctor,
        });
      } else {
        throw new Error("Failed to save surgery details.");
      }
    } catch (error) {
      console.error("Error saving surgery details:", error);
      alert(`Failed to save surgery details: ${error.message}`);
    }
  };

  const handleUpdateSurgery = async () => {
    try {
      console.log("Updating surgery details for patientId:", patientId);

      // Convert anesthesia object to string
      const selectedAnesthesia = Object.entries(formData.anesthesia)
        .filter(([_, value]) => value)
        .map(([key]) => key)
        .join(", ");

      // Include only new values in anesthesiaDetails
    

      const requestBody = {
        patientId: patientId,
        admission_date: formData.admission_date,
        surgery_date: formData.surgery_date,
        risk_consent: formData.risk_consent,
        assistanceDoctor: selectedOptions.assistanceDoctor || "",
        anaesthetist: selectedOptions.anaesthetist || "",
        anesthesia: selectedAnesthesia, // Only LA, SA, GA
        surgery_remarks: formData.surgery_remarks,
        plan: formData.plan,
        surgery_note: formData.surgery_note,
        additional_comment: formData.additional_comment,
        is_deleted: 0,
        doctor_id: localStorage.getItem("doctor_id") || "",
        // creation_timestamp: new Date().toISOString(),
      };

      console.log("Request body:", requestBody);

      const response = await fetch(
        `${BASE_URL}${API_ENDPOINTS.UPDATE_SURGERY}/${patientId}`,
        {
          method: "PUT", // Use PUT method for update
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response data:", data);

      if (data.statusCode === 200) {
        alert("Surgery details updated successfully!");
        setIsDisabled(true);
        setShowEditButton(true);
        setPreviousRecordDate(formData.surgery_date);
        setDisablePreviousButton(true);
      } else {
        throw new Error(data.message || "Failed to update surgery details");
      }
    } catch (error) {
      console.error("Error updating surgery details:", error);
      alert(`Failed to update surgery details: ${error.message}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleDateChange = (date, name) => {
    if (!date) {
      setFormData((prev) => ({
        ...prev,
        [name]: "", // Reset if date is cleared
      }));
      return;
    }

    // Convert to local date string (YYYY-MM-DD) before storing
    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    )
      .toISOString()
      .split("T")[0];

    setFormData((prev) => ({
      ...prev,
      [name]: localDate,
    }));
  };


  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      anesthesia: {
        ...formData.anesthesia,
        [name]: checked,
      },
    });
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
      <NavBarD pagename="Surgery Details" />
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
                    {showEditButton && (
                      <button
                        type="button"
                        className="btn btn-warning"
                        style={{ float: "right", marginRight: "7px" }}
                        onClick={handleEditSurgery}
                      >
                        Edit Surgery
                      </button>
                    )}
                  </div>

                  {previousRecordDate && (
                    <div style={{ marginTop: "15px" }}>
                      <strong>Previous Record Date: </strong>
                      <span>
                        {new Date(previousRecordDate).toLocaleDateString() ||
                          ""}
                      </span>{" "}
                      {/* Convert Date to Local String */}
                    </div>
                  )}

                  <br />
                  {/* Row 1 */}
                  <Row className="mb-3">
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label className="d-block">
                          Date of Admission:
                        </Form.Label>
                        <DatePicker
                          selected={
                            formData?.admission_date
                              ? new Date(formData.admission_date)
                              : null
                          }
                          onChange={(date) =>
                            handleDateChange(date, "admission_date")
                          }
                          disabled={isDisabled}
                          dateFormat="yyyy-MM-dd"
                          className="form-control"
                          placeholderText="Select Admission Date"
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
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label className="d-block">
                          Date of Surgery:
                        </Form.Label>
                        <DatePicker
                          selected={
                            formData?.surgery_date
                              ? new Date(formData.surgery_date)
                              : null
                          }
                          onChange={(date) =>
                            handleDateChange(date, "surgery_date")
                          }
                          dateFormat="yyyy-MM-dd"
                          className="form-control"
                          placeholderText="Select Surgery Date"
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>High Risk Consent:</Form.Label>
                        <div className="d-flex">
                          <label className="d-flex align-items-center me-3">
                            <Form.Check
                              inline
                              type="radio"
                              name="risk_consent"
                              value="Yes"
                              checked={formData.risk_consent === "Yes"}
                              onChange={handleInputChange}
                              disabled={isDisabled}
                              id="risk_consent_yes"
                              style={{ marginRight: "5px" }}
                            />
                            Yes
                          </label>

                          <label className="d-flex align-items-center">
                            <Form.Check
                              inline
                              type="radio"
                              name="risk_consent"
                              value="No"
                              checked={formData.risk_consent === "No"}
                              onChange={handleInputChange}
                              disabled={isDisabled}
                              id="risk_consent_no"
                              style={{ marginRight: "5px" }}
                            />
                            No
                          </label>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                  <br />
                  {/* Row 2 */}
                  <Row className="mb-3">
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Assistant Doctor:</Form.Label>
                        <Form.Select
                          value={
                            selectedOptions.assistanceDoctor ||
                            formData.assistanceDoctor ||
                            ""
                          }
                          onChange={(e) => {
                            const selectedValue = e.target.value;
                            setSelectedOptions((prev) => ({
                              ...prev,
                              assistanceDoctor: selectedValue,
                            }));
                            setFormData((prev) => ({
                              ...prev,
                              assistanceDoctor: selectedValue, // Update form data so it reflects immediately
                            }));
                          }}
                          disabled={isDisabled}
                        >
                          <option value="">Select Assistant</option>
                          {[
                            ...new Set([
                              ...surgery.map(
                                (option) => option.assistanceDoctor
                              ),
                              ...assistantsDoctor.map(
                                (assistantDoctor) => assistantDoctor.name
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
                    <Col md={3}>
                      <Form.Group controlId="anaesthetist">
                        <Form.Label>Anaesthetist:</Form.Label>
                        <Form.Select
                          value={selectedOptions.anaesthetist || ""}
                          onChange={(e) =>
                            setSelectedOptions({
                              ...selectedOptions,
                              anaesthetist: e.target.value,
                            })
                          }
                          disabled={isDisabled}
                        >
                          <option value="">Select Anaesthetist</option>
                          {[
                            ...new Set([
                              ...surgery.map((option) => option.anaesthetist),
                              ...anaesthetist.map(
                                (anaesthetist) => anaesthetist.name
                              ),
                            ]),
                          ].map((anaesthetist, index) => (
                            <option key={index} value={anaesthetist}>
                              {anaesthetist}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>Anesthesia:</Form.Label>
                        <Row>
                          <Col xs={5}>
                            <div className="d-flex flex-wrap">
                              <label className="d-flex align-items-center me-3">
                                <Form.Check
                                  inline
                                  type="checkbox"
                                  name="la"
                                  value={formData.anesthesia.la}
                                  checked={formData.anesthesia.la}
                                  onChange={handleCheckboxChange}
                                  disabled={isDisabled}
                                  id="LA"
                                  style={{ marginRight: "5px" }}
                                />
                                LA
                              </label>

                              <label className="d-flex align-items-center me-3">
                                <Form.Check
                                  inline
                                  type="checkbox"
                                  name="sa"
                                  value={formData.anesthesia.sa}
                                  checked={formData.anesthesia.sa}
                                  onChange={handleCheckboxChange}
                                  disabled={isDisabled}
                                  id="SA"
                                  style={{ marginRight: "5px" }}
                                />
                                SA
                              </label>

                              <label className="d-flex align-items-center">
                                <Form.Check
                                  inline
                                  type="checkbox"
                                  name="ga"
                                  value={formData.anesthesia.ga || ""}
                                  checked={formData.anesthesia.ga}
                                  onChange={handleCheckboxChange}
                                  disabled={isDisabled}
                                  id="GA"
                                  style={{ marginRight: "5px" }}
                                />
                                GA
                              </label>
                            </div>
                          </Col>
                          <Col xs={7}>
                            <Form.Control
                              as="textarea"
                              placeholder="Other (Specify)"
                              name="anesthesia.other"
                              value={formData.anesthesia.other || ""}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  anesthesia: {
                                    ...prev.anesthesia,
                                    other: e.target.value,
                                  },
                                }))
                              }
                              disabled={isDisabled || isOtherSpecifyDisabled}
                            />
                          </Col>
                        </Row>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Row 3 */}
                  <Row className="mb-3">
                    <Col>
                      <Form.Group>
                        <Form.Label>Surgery Plan:</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="surgery_remarks"
                          value={formData.surgery_remarks}
                          onChange={handleInputChange}
                          disabled={isDisabled}
                        />
                      </Form.Group>
                    </Col>

                    <Col>
                      <Form.Group>
                        <Form.Label>Plan Diagnosis:</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="plan"
                          value={formData.plan}
                          onChange={handleInputChange}
                          disabled={isDisabled}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <br />
                  {/* Row 4 - Additional Fields */}
                  <Row className="mb-3">
                    <Col>
                      <Form.Group>
                        <Form.Label>Surgery Notes:</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="surgery_note"
                          value={formData.surgery_note}
                          onChange={handleInputChange}
                          disabled={isDisabled}
                        />
                      </Form.Group>
                    </Col>

                    <Col>
                      <Form.Group>
                        <Form.Label>Additional Comments:</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="additional_comment"
                          value={formData.additional_comment}
                          onChange={handleInputChange}
                          disabled={isDisabled}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <br />

                  <br />
                  <Button
                    className="mt-4"
                    onClick={
                      showEditButton ? handleUpdateSurgery : handleSubmit
                    }
                    disabled={isDisabled}
                  >
                    {showEditButton ? "Update" : "Save"}
                  </Button>
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
};

export default Surgery;
