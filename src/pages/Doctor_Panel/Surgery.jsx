import React, { useState, useEffect } from "react";
import { Card, Button, Form, Row, Col, Container } from "react-bootstrap";
import NavBarD from "./NavbarD"; // Fixed typo in 'components'

const Surgery = () => {
  const [formData, setFormData] = useState({
    admission_date: "",
    surgery_date: "",
    risk_consent: "",
    assistantDoctor: "",
    anaesthetist: "",
    anesthesia: {
      LA: false,
      SA: false,
      GA: false,
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

  const BASE_URL = "http://192.168.90.158:5000/api";

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
      const anesthesiaTypes = surgeryData.anesthesia
        ? surgeryData.anesthesia.split(", ")
        : [];
      const anesthesiaObject = {
        LA: anesthesiaTypes.includes("LA"),
        SA: anesthesiaTypes.includes("SA"),
        GA: anesthesiaTypes.includes("GA"),
      };

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
        assistantDoctor: surgeryData.assistantDoctor || "",
        anaesthetist: surgeryData.anaesthetist || "",
        anesthesia: anesthesiaObject, // Set the parsed object
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
      assistantDoctor: "",
      anaesthetist: "",
      anesthesia: {
        LA: false,
        SA: false,
        GA: false,
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
    alert("You can now edit the surgery details.");
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Submitting surgery details for patientId:", patientId);

      // Convert anesthesia object to string
      const selectedAnesthesia = Object.entries(formData.anesthesia)
        .filter(([_, value]) => value === true)
        .map(([key]) => key)
        .join(", ");

      const requestBody = {
        patientId: patientId,
        admission_date: formData.admission_date,
        surgery_date: formData.surgery_date,
        risk_consent: formData.risk_consent,
        assistantDoctor: selectedOptions.assistantsDoctorName || "",
        anaesthetist: selectedOptions.anaesthetist || "",
        anesthesia: selectedAnesthesia, // Send as string instead of object
        surgery_remarks: formData.surgery_remarks,
        plan: formData.plan,
        surgery_note: formData.surgery_note,
        additional_comment: formData.additional_comment,
        is_deleted: 0,
        doctor_id: localStorage.getItem("doctor_id") || "",
        creation_timestamp: new Date().toISOString(),
      };

      console.log("Request body:", requestBody);

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

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response data:", data);

      if (data.statusCode === 200) {
        alert("Surgery details saved successfully!");
        setIsDisabled(true);
        setShowEditButton(true);
        setPreviousRecordDate(formData.surgery_date);
        setDisablePreviousButton(true);
      } else {
        throw new Error(data.message || "Failed to save surgery details");
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
        .filter(([_, value]) => value === true)
        .map(([key]) => key)
        .join(", ");

      const requestBody = {
        patientId: patientId,
        admission_date: formData.admission_date,
        surgery_date: formData.surgery_date,
        risk_consent: formData.risk_consent,
        assistantDoctor: selectedOptions.assistantsDoctorName || "",
        anaesthetist: selectedOptions.anaesthetist || "",
        anesthesia: selectedAnesthesia,
        surgery_remarks: formData.surgery_remarks,
        plan: formData.plan,
        surgery_note: formData.surgery_note,
        additional_comment: formData.additional_comment,
        is_deleted: 0,
        doctor_id: localStorage.getItem("doctor_id") || "",
        creation_timestamp: new Date().toISOString(),
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
                      <span>{previousRecordDate}</span>
                    </div>
                  )}

                  <br />
                  {/* Row 1 */}
                  <Row className="mb-3">
                    <Col>
                      <Form.Group>
                        <Form.Label>Date of Admission:</Form.Label>
                        <Form.Control
                          type="date"
                          name="admission_date"
                          value={formData.admission_date}
                          onChange={handleInputChange}
                          disabled={isDisabled}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>Date of Surgery:</Form.Label>
                        <Form.Control
                          type="date"
                          name="surgery_date"
                          value={formData.surgery_date}
                          onChange={handleInputChange}
                          disabled={isDisabled}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>High Risk Consent:</Form.Label>
                        <div>
                          <Form.Check
                            inline
                            type="radio"
                            label="Yes"
                            name="risk_consent"
                            value="Yes"
                            checked={formData.risk_consent === "Yes"}
                            onChange={handleInputChange}
                            disabled={isDisabled}
                          />
                          <Form.Check
                            inline
                            type="radio"
                            label="No"
                            name="risk_consent"
                            value="No"
                            checked={formData.risk_consent === "No"}
                            onChange={handleInputChange}
                            disabled={isDisabled}
                          />
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                  <br />
                  {/* Row 2 */}
                  <Row className="mb-3">
                    <Col>
                      <Form.Group>
                        <Form.Label>Assistant Doctor:</Form.Label>
                        <Form.Select
                          value={selectedOptions?.assistantsDoctorName || ""}
                          onChange={(e) =>
                            setSelectedOptions({
                              ...selectedOptions,
                              assistantsDoctorName: e.target.value,
                            })
                          }
                          disabled={isDisabled}
                        >
                          <option value="">Select Assistant</option>
                          {[
                            ...new Set([
                              ...surgery.map(
                                (option) => option.assistantsDoctorName
                              ),
                              ...assistantsDoctor.map(
                                (assistantsDoctor) => assistantsDoctor.name
                              ),
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
                            <div>
                              <Form.Check
                                inline
                                type="checkbox"
                                label="LA"
                                name="LA"
                                checked={formData.anesthesia.LA}
                                onChange={handleCheckboxChange}
                                disabled={isDisabled}
                              />
                              <Form.Check
                                inline
                                type="checkbox"
                                label="SA"
                                name="SA"
                                checked={formData.anesthesia.SA}
                                onChange={handleCheckboxChange}
                                disabled={isDisabled}
                              />
                              <Form.Check
                                inline
                                type="checkbox"
                                label="GA"
                                name="GA"
                                checked={formData.anesthesia.GA}
                                onChange={handleCheckboxChange}
                                disabled={isDisabled}
                              />
                            </div>
                          </Col>
                          <Col xs={7}>
                            <Form.Control
                              as="textarea"
                              placeholder="Enter anesthesia details"
                              name="anesthesiaDetails"
                              value={formData.anesthesiaDetails || ""}
                              onChange={handleInputChange}
                              disabled={isDisabled}
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
                  {!isDisabled && (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleUpdateSurgery}
                    >
                      Update Surgery Details
                    </button>
                  )}
                  <br />
                  <Button
                    className="mt-4"
                    onClick={handleSubmit}
                    disabled={isDisabled}
                  >
                    Save
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Surgery;
