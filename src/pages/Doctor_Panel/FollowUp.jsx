import { useState, useEffect } from "react";
import { Row, Col, Form, Container, Card } from "react-bootstrap";
import NavBarD from "./NavbarD";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BASE_URL = "http://192.168.90.158:5000/api"; // Update with your backend API base URL

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
    reference_type: "",
    diagnosis: "",
    advice: "",
    plan: "",
    present_complaints: "",
    date: "",
    followUpVisitNo: "0",
  });
  const [errors, setErrors] = useState({});

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
        console.log("Fetched Data:", data.data.data);

        if (data?.data?.data) {
          const { patientData, diagnosisData, followUpData } = data.data.data;
          setFormData({
            Uid_no: patientData?.Uid_no || "",
            name: patientData?.name || "",
            age: patientData?.age || "",
            phone: patientData?.phone || "",
            address: patientData?.address || "",
            occupation: patientData?.occupation || "",
            email: patientData?.email || "",
            reference_type: patientData?.reference_type || "",

            diagnosis: diagnosisData?.diagnosis || "",
            advice: diagnosisData?.advice || "",

            present_complaints: followUpData?.present_complaints || "",
            firstVisitDate: patientData?.date || "",
            followUpVisitNo: followUpData?.followUpVisitNo || "",
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

  // Track formData updates
  useEffect(() => {
    console.log("Updated formData:", formData);
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async () => {
    setErrors(validate());
    if (Object.keys(errors).length > 0) return;

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
        // Set followUpVisitNo to 1 after successful save
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
      "reference_type",
      "diagnosis",
      "advice",
      "plan",
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
                background: "white",
                border: "1px solid #00bcd4",
              }}
            >
              <Card.Body>
                <Form>
                  {" "}
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
                            backgroundColor: "#e9ecef", // Light grey background to indicate read-only
                            color: "#6c757d", // Grey text color
                            cursor: "not-allowed", // Show "not-allowed" cursor
                          }}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>

                    {/* Patient Name Input */}
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Patient Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name || ""}
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
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Age</Form.Label>
                        <Form.Control
                          type="age"
                          name="age"
                          value={formData.age || ""}
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
                  </Row>
                  <br />
                  <Row>
                    {/* Mobile No */}
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Mobile No</Form.Label>
                        <Form.Control
                          type="number"
                          name="phone"
                          value={formData.phone || ""}
                          placeholder="Enter Mobile Number"
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

                    {/* Address */}
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
                            backgroundColor: "#e9ecef", // Light grey background to indicate read-only
                            color: "#6c757d", // Grey text color
                            cursor: "not-allowed", // Show "not-allowed" cursor
                          }}
                          onChange={handleInputChange}
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
                            backgroundColor: "#e9ecef", // Light grey background to indicate read-only
                            color: "#6c757d", // Grey text color
                            cursor: "not-allowed", // Show "not-allowed" cursor
                          }}
                          onChange={handleInputChange}
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
                            backgroundColor: "#e9ecef", // Light grey background to indicate read-only
                            color: "#6c757d", // Grey text color
                            cursor: "not-allowed", // Show "not-allowed" cursor
                          }}
                          onChange={handleInputChange}
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
                          value={formData.reference_type || ""}
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
                    {/* Gender */}
                    <Col md={6} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Plan</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="plan"
                          value={formData.plan || ""}
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
                    <Col md={3} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>First Visit Date</Form.Label>
                        {/* <Form.Control
                          type="date"
                          name="firstVisitDate"
                          value={formData.date || ""}
                          onChange={handleInputChange}
                        /> */}
                        <DatePicker
                          selected={
                            formData?.firstVisitDate
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
                          maxDate={new Date()} // Prevent selecting future dates
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
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ marginTop: "30px", marginright: "10px" }}
                    onClick={() => handleSubmit("save")}
                  >
                    Submit
                  </button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
