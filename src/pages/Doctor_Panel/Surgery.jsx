import React, { useState, useEffect } from "react";
import { Card, Button, Form, Row, Col, Container } from "react-bootstrap";
import PageBreadcrumb from "../../componets/PageBreadcrumb"; // Fixed typo in 'components'

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
    surgeryPlan: "",
    planDiagnosis: "",
    surgery_remarks: "",
    additional_comment: "",
    plan: "",
    additionalPlanDiagnosis: "",
    additionalCommentsExtra: "",
  });

  const [errors, setErrors] = useState({});
  const [surgery, setSurgery] = useState([]);
  const [assistantsDoctor, setAssistantsDoctor] = useState([]);

  const [selectedOptions, setSelectedOptions] = useState([]); // Track selected checkboxes

  const BASE_URL = "http://192.168.90.111:5000/api";

  // Fetch options from API
  useEffect(() => {
    const fetchDropdownOptions = async () => {
      try {
        const endpoints = [
          {
            url: "/V1/patienttabs/assistantDoc_dropdown",
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

  const validate = () => {
    const validationErrors = {};
    if (!formData.dateAdmission)
      validationErrors.dateAdmission = "Date of Admission is required";
    if (!formData.dateSurgery)
      validationErrors.dateSurgery = "Date of Surgery is required";
    if (!formData.highRiskConsent)
      validationErrors.highRiskConsent = "High Risk Consent is required";
    return validationErrors;
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

  const handleSubmit = async (saveType) => {
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await fetch(
          "https://your-api-url.com/V1/appointment/addAppointment",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...formData, saveType }),
          }
        );

        if (response.ok) {
          alert("Appointment added successfully");
        } else {
          alert("Failed to add appointment. Please try again.");
        }
      } catch (error) {
        console.error("Error while adding appointment:", error);
        alert("An error occurred. Please try again later.");
      }
    }
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
      <PageBreadcrumb pagename="Surgery Details" />
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
                  {/* Row 1 */}
                  <Row className="mb-3">
                    <Col>
                      <Form.Group>
                        <Form.Label>Date of Admission:</Form.Label>
                        <Form.Control
                          type="date"
                          name="admission_date"
                          value={
                            formData.admission_date ||
                            new Date().toISOString().split("T")[0]
                          }
                          onChange={handleInputChange}
                          isInvalid={!!errors.dateAdmission}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.dateAdmission}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>Date of Surgery:</Form.Label>
                        <Form.Control
                          type="date"
                          name="surgery_date"
                          value={
                            formData.surgery_date ||
                            new Date().toISOString().split("T")[0]
                          }
                          onChange={handleInputChange}
                          isInvalid={!!errors.dateSurgery}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.dateSurgery}
                        </Form.Control.Feedback>
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
                          />
                          <Form.Check
                            inline
                            type="radio"
                            label="No"
                            name="highRiskConsent"
                            value="No"
                            checked={formData.highRiskConsent === "No"}
                            onChange={handleInputChange}
                          />
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>

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
                      <Form.Group>
                        <Form.Label>Anaesthetist:</Form.Label>
                        <Form.Select
                          name="anaesthetist"
                          value={formData.anaesthetist}
                          onChange={handleInputChange}
                        >
                          <option value="">Select an option</option>
                          <option value="Dr. Brown">Dr. Brown</option>
                          <option value="Dr. Davis">Dr. Davis</option>
                          <option value="Dr. Wilson">Dr. Wilson</option>
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
                              />
                              <Form.Check
                                inline
                                type="checkbox"
                                label="SA"
                                name="SA"
                                checked={formData.anesthesia.SA}
                                onChange={handleCheckboxChange}
                              />
                              <Form.Check
                                inline
                                type="checkbox"
                                label="GA"
                                name="GA"
                                checked={formData.anesthesia.GA}
                                onChange={handleCheckboxChange}
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
                          type="text"
                          name="surgeryPlan"
                          value={formData.surgeryPlan}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>Plan Diagnosis:</Form.Label>
                        <Form.Control
                          type="text"
                          name="planDiagnosis"
                          value={formData.planDiagnosis}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>Surgery Notes:</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="surgery_remarks"
                          value={formData.surgery_remarks}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Row 4 - Additional Fields */}
                  <Row className="mb-3">
                    <Col>
                      <Form.Group>
                        <Form.Label>Additional Surgery Plan:</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="plan"
                          value={formData.plan}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>Additional Plan Diagnosis:</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="additionalPlanDiagnosis"
                          value={formData.additionalPlanDiagnosis}
                          onChange={handleInputChange}
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
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Button className="mt-4" onClick={() => handleSubmit("save")}>
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
