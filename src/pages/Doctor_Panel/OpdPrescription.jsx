import React, { useState } from "react";
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

const OpdPrescription = () => {
  const [formData, setFormData] = useState({
    prescription_id: "",
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

  const testAdviceOptions = [
    "Blood Test",
    "X-Ray",
    "ECG",
    "MRI",
    "CT Scan",
    "Ultrasound",
    "Urine Test",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      medicine_time: {
        ...formData.medicine_time,
        [name]: checked,
      },
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
                    <Col>
                      <Form.Group>
                        <Form.Label>Prescription Type:</Form.Label>
                        <Form.Select
                          name=" prescription_id"
                          value={formData.prescription_id}
                          onChange={handleInputChange}
                        >
                          <option value="">Select an option</option>
                          <option value="Type 1">Type 1</option>
                          <option value="Type 2">Type 2</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>Date of Prescription:</Form.Label>
                        <Form.Control
                          type="date"
                          name="creation_timestamp"
                          value={formData.creation_timestamp}
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
                          name="doctor_id"
                          value={formData.doctor_id}
                          onChange={handleInputChange}
                        >
                          <option value="">Select an option</option>
                          <option value="Dr. Smith">Dr. Smith</option>
                          <option value="Dr. Johnson">Dr. Johnson</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>Test Advice:</Form.Label>
                        <DropdownButton title="Select Test Advice">
                          {testAdviceOptions.map((option) => (
                            <Dropdown.Item key={option}>
                              <Form.Check
                                type="checkbox"
                                label={option}
                                value={option}
                                checked={formData.testAdvice.includes(option)}
                                onChange={handleTestAdviceChange}
                              />
                            </Dropdown.Item>
                          ))}
                        </DropdownButton>
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
                          <option value="Follow-up">Follow-up</option>
                          <option value="Routine Check-up">
                            Routine Check-up
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
