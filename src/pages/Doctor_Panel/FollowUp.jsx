import { useState, useEffect } from "react";
import { Row, Col, Form, Container, Card } from "react-bootstrap";
import NavBarD from "./NavbarD";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BASE_URL = "http://192.168.131.47:5000/api"; // Update with your backend API base URL

export default function FollowUp() {
  const [patientId, setPatientId] = useState(
    localStorage.getItem("selectedPatientId")
  );
  const [formData, setFormData] = useState({
    Uid_no: "",
    name: "",
    age: "",
    phone: "",
    address: "",
    occupation: "",
    email: "",
    ref: "",
    diagnosis: "",
    advice: "",
    adviceComment: "",
    diagnosisAdvice: "",
    present_complaints: "",
    firstVisitDate: "",
    followUpVisitNo: "0",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const storedPatientId = localStorage.getItem("selectedPatientId");
    if (storedPatientId) {
      setPatientId(storedPatientId);
    } else {
      // Handle the case where no patient ID is found
      setErrors({
        noPatientId: "No patient ID found. Please select a patient.",
      });
    }
  }, []);

  useEffect(() => {
    if (!patientId) {
      console.warn("No patientId found, skipping fetch");
      return;
    }
    const fetchPatientData = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/V1/followUp/listFollowUp/${patientId}`,
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
        if (data?.data?.data) {
          const { patientData, diagnosisData, followUpData } = data.data.data;

          const visitNumber = Array.isArray(diagnosisData)
            ? diagnosisData.length
            : 0;
          setFormData({
            Uid_no: patientData?.Uid_no || "",
            name: patientData?.name || "",
            age: patientData?.age || "",
            phone: patientData?.phone || "",
            address: patientData?.address || "",
            occupation: patientData?.occupation || "",
            email: patientData?.email || "",
            ref: patientData?.ref || "",
            diagnosis: diagnosisData[0]?.diagnosis || "",
            advice: [diagnosisData[0]?.advice, diagnosisData[0]?.adviceComment]
              .filter(Boolean)
              .join("\n"),
            diagnosisAdvice: diagnosisData[0]?.diagnosisAdvice || "",
            present_complaints: followUpData?.present_complaints || "",
            firstVisitDate: patientData?.date || "",
            followUpVisitNo: visitNumber.toString(),
          });
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      const response = await fetch(
        `${BASE_URL}/V1/followUp/followUp/${patientId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        alert("Patient data updated successfully");
        setFormData((prevState) => ({
          ...prevState,
          followUpVisitNo: "1",
        }));
      } else {
        console.error("Update failed:", await response.json());
      }
    } catch (error) {
      console.error("Error updating patient data:", error);
    }
  };

  const validate = () => {
    const requiredFields = [
      "Uid_no",
      "name",
      "age",
      "phone",
      "address",
      "occupation",
      "email",
      "ref",
      "diagnosis",
      "advice",
      "adviceComment",
      "diagnosisAdvice",
      "present_complaints",
      "firstVisitDate",
      "followUpVisitNo",
    ];
    const newErrors = {};
    requiredFields.forEach((field) => {
      if (!formData[field])
        newErrors[field] = `${field.replace(/([A-Z])/g, " $1")} is required`;
    });
    if (formData.phone && !/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Mobile number must be 10 digits";
    }
    return newErrors;
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
      <NavBarD pagename="Follow Up" />
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
                    style={{ marginTop: "3px", float: "right" }}
                    onClick={handlePrint}
                  >
                    Print
                  </button>
                  <br />
                  <br />
                  <Row>
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>UID No.</Form.Label>
                        <Form.Control
                          type="text"
                          name="Uid_no"
                          value={formData.Uid_no || ""}
                          readOnly
                          style={{
                            backgroundColor: "#e9ecef",
                            color: "#6c757d",
                            cursor: "not-allowed",
                          }}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Patient Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name || ""}
                          readOnly
                          style={{
                            backgroundColor: "#e9ecef",
                            color: "#6c757d",
                            cursor: "not-allowed",
                          }}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Age</Form.Label>
                        <Form.Control
                          type="text"
                          name="age"
                          value={formData.age || ""}
                          readOnly
                          style={{
                            backgroundColor: "#e9ecef",
                            color: "#6c757d",
                            cursor: "not-allowed",
                          }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <br />
                  <Row>
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Mobile No</Form.Label>
                        <Form.Control
                          type="text"
                          name="phone"
                          value={formData.phone || ""}
                          placeholder="Enter Mobile Number"
                          readOnly
                          style={{
                            backgroundColor: "#e9ecef",
                            color: "#6c757d",
                            cursor: "not-allowed",
                          }}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                          type="text"
                          name="address"
                          value={formData.address || ""}
                          placeholder="Enter Address"
                          readOnly
                          style={{
                            backgroundColor: "#e9ecef",
                            color: "#6c757d",
                            cursor: "not-allowed",
                          }}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Occupation</Form.Label>
                        <Form.Control
                          type="text"
                          name="occupation"
                          value={formData.occupation || ""}
                          readOnly
                          style={{
                            backgroundColor: "#e9ecef",
                            color: "#6c757d",
                            cursor: "not-allowed",
                          }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <br />
                  <Row>
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Email Id</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email || ""}
                          placeholder="Enter Email"
                          readOnly
                          style={{
                            backgroundColor: "#e9ecef",
                            color: "#6c757d",
                            cursor: "not-allowed",
                          }}
                        />
                        {errors.email && (
                          <p style={{ color: "red" }}>{errors.email}</p>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Referred By</Form.Label>
                        <Form.Control
                          value={formData.ref || ""}
                          readOnly
                          style={{
                            backgroundColor: "#e9ecef",
                            color: "#6c757d",
                            cursor: "not-allowed",
                          }}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Follow Up Visit No</Form.Label>
                        <Form.Control
                          type="number"
                          name="followUpVisitNo"
                          value={formData.followUpVisitNo || "0"}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Diagnosis</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="diagnosis"
                          value={formData.diagnosis || ""}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Advice</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="advice"
                          value={formData.advice || ""}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <br />
                  <Row>
                    <Col md={6} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Plan</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="diagnosisAdvice"
                          value={formData.diagnosisAdvice || ""}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Present Complaints</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="present_complaints"
                          value={formData.present_complaints || ""}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <br />
                  <Row>
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label className="d-block">
                          First Visit Date
                        </Form.Label>
                        <DatePicker
                          selected={
                            formData?.firstVisitDate &&
                            !isNaN(new Date(formData.firstVisitDate))
                              ? new Date(formData.firstVisitDate)
                              : null
                          }
                          onChange={(date) => {
                            handleInputChange({
                              target: {
                                name: "firstVisitDate",
                                value: date
                                  ? date.toISOString().split("T")[0]
                                  : "",
                              },
                            });
                          }}
                          dateFormat="yyyy-MM-dd"
                          className="form-control"
                          placeholderText="Select First Visit Date"
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ marginTop: "30px", marginRight: "10px" }}
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
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
        `}
      </style>
    </div>
  );
}
