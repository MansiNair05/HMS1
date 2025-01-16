import React, { useState, useEffect } from "react";
import PageBreadcrumb from "../components/PageBreadcrumb";
import { Row, Col, Form, Container, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const BASE_URL = "http://192.168.90.152:5000/api";

const AddInvoiceEx = () => {
  const initialFormData = {
    invoice_id: "",
    admission_no: "",
    patientName: "",
    discharge_date: "",
    dischargetime: "",
    bed_category: "",
    admission_date: "",
    admissiontime: "",
    consultantName: "",
    surgeonName: "",
    bill_Label: "",
    bill_Value: "",
    Sub_Total: "",
    bill_Type: "",
    note: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [consultants, setConsultants] = useState([]); // State for consultant dropdown
  const [surgeons, setSurgeons] = useState([]); // State for surgeon dropdown
  const [insurance, setInsurance] = useState([]); // State for insurance dropdown
  const [tpa, setTpa] = useState([]);

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        // Fetch consultants
        const responseConsultant = await fetch(`${BASE_URL}/V1/invoice/consultant_dropdown`);
        const dataConsultant = await responseConsultant.json();

        if (responseConsultant.ok) {
          setConsultants(dataConsultant.data); // Assuming data contains an array of consultants
        } else {
          console.error("Error fetching consultants:", dataConsultant.message);
        }

        // Fetch surgeons
        const responseSurgeon = await fetch(`${BASE_URL}/V1/invoice/surgeon_dropdown`);
        const dataSurgeon = await responseSurgeon.json();

        if (responseSurgeon.ok) {
          setSurgeons(dataSurgeon.data); // Assuming data contains an array of surgeons
        } else {
          console.error("Error fetching surgeons:", dataSurgeon.message);
        }

        // Fetch insurance
        const responseInsurance = await fetch(`${BASE_URL}/V1/invoice/insurance_co_dropdown`);
        const dataInsurance = await responseInsurance.json();

        if (responseInsurance.ok) {
          setInsurance(dataInsurance.data); // Assuming API returns an array
        } else {
          console.error("Error fetching insurance:", dataInsurance.message);
        }

        // Fetch TPA
        const responseTpa = await fetch(`${BASE_URL}/V1/invoice/tpa_dropdown`);
        const dataTpa = await responseTpa.json();

        if (responseTpa.ok) {
          setTpa(dataTpa.data); // Assuming API returns an array
        } else {
          console.error("Error fetching TPA:", dataTpa.message);
        }
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };

    fetchDropdowns();
  }, []); // Empty dependency array ensures this effect runs only once when component mounts
 
  // Validate form
  const validate = () => {
    const newErrors = {};
    const requiredFields = [
      "invoice_id",
      "admission_no",
      "patientName",
      "discharge_date",
      "dischargetime",
      "bed_category",
      "admission_date",
      "admissiontime",
      "consultantName",
      "surgeonName",
      "bill_Label",
      "bill_Value",
      "Sub_Total",
      "bill_Type",
      "note",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = `${field.replace(/([A-Z])/g, " $1")} is required.`; // Fix the error message
      }
    });

    return newErrors;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Reset form
  const handleReset = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);

      try {
        const response = await fetch(`${BASE_URL}/V1/invoice/addInvoice`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
          alert("Invoice added successfully!");
          handleReset(); // Reset form data
        } else {
          console.error("Error adding invoice:", data.message || "Unknown error");
          alert(data.message || "Error adding invoice. Please try again.");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("Error submitting form. Please check your network and try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="themebody-wrap">
      <PageBreadcrumb pagename="Add Invoice" />
      <Container fluid>
        <Row>
          <Col>
            <Card>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    {/* Invoice No */}
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Invoice No</Form.Label>
                        <Form.Control
                          type="text"
                          id="invoice_id"
                          name="invoice_id"
                          value={formData.invoice_id}
                          onChange={handleInputChange}
                          isInvalid={errors.invoice_id}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.invoice_id}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    {/* Admission No */}
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Admission No</Form.Label>
                        <Form.Control
                          type="text"
                          id="admission_no"
                          name="admission_no"
                          value={formData.admission_no}
                          onChange={handleInputChange}
                          isInvalid={errors.admission_no}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.admission_no}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    {/* Patient Name */}
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Patient Name</Form.Label>
                        <Form.Control
                          type="text"
                          id="patientName"
                          name="patientName"
                          value={formData.patientName}
                          onChange={handleInputChange}
                          isInvalid={errors.patientName}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.patientName}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    {/* Discharge Date */}
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Discharge Date </Form.Label>
                        <Form.Control
                          type="date"
                          id="discharge_date"
                          name="discharge_date"
                          value={formData.discharge_date}
                          onChange={handleInputChange}
                          isInvalid={errors.discharge_date}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.discharge_date}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    {/* Discharge Time */}
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Discharge Time</Form.Label>
                        <Form.Control
                          type="time"
                          name="dischargetime"
                          value={formData.dischargetime}
                          onChange={handleInputChange}
                        />
                        {errors.dischargetime && (
                          <p style={{ color: "red" }}>{errors.dischargetime}</p>
                        )}
                      </Form.Group>
                    </Col>

                    {/* Bed Category */}
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Bed Category </Form.Label>
                        <Form.Control
                          type="text"
                          id="bed_category"
                          name="bed_category"
                          value={formData.bed_category}
                          onChange={handleInputChange}
                          isInvalid={errors.bed_category}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.bed_category}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    {/* Admission Date */}
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Admission Date </Form.Label>
                        <Form.Control
                          type="date"
                          id="admission_date"
                          name="admission_date"
                          value={formData.admission_date}
                          onChange={handleInputChange}
                          isInvalid={errors.admission_date}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.admission_date}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    {/* Admission Time */}
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Admission Time </Form.Label>
                        <Form.Control
                          type="time"
                          id="admissiontime"
                          name="admissiontime"
                          value={formData.admissiontime}
                          onChange={handleInputChange}
                          isInvalid={errors.admissiontime}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.admissiontime}
                        </Form.Control.Feedback>
                      </Form.Group>
                     </Col>


                    {/* Consultant Name */}
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Consultant Name</Form.Label>
                        <Form.Select
                          id="consultantName"
                          name="consultantName"
                          value={formData.consultantName}
                          onChange={handleInputChange}
                          isInvalid={errors.consultantName}
                        >
                          <option value="">Select Consultant</option>
                          {consultants.map((consultant) => (
                            <option key={consultant._id} value={consultant.name}>
                              {consultant.name}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {errors.consultantName}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    {/* Surgeon Name */}
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Surgeon Name</Form.Label>
                        <Form.Select
                          id="surgeonName"
                          name="surgeonName"
                          value={formData.surgeonName}
                          onChange={handleInputChange}
                          isInvalid={errors.surgeonName}
                        >
                          <option value="">Select Surgeon</option>
                          {surgeons.map((surgeon) => (
                            <option key={surgeon._id} value={surgeon.name}>
                              {surgeon.name}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {errors.surgeonName}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    {/* Bill Label */}
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Bill Label </Form.Label>
                        <Form.Control
                          type="text"
                          id="bill_Label"
                          name="bill_Label"
                          value={formData.bill_Label}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>

                    {/* Bill Value */}
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Bill Value </Form.Label>
                        <Form.Control
                          type="number"
                          id="bill_Value"
                          name="bill_Value"
                          value={formData.bill_Value}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>

                    {/* Sub Total */}
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Sub Total </Form.Label>
                        <Form.Control
                          type="number"
                          id="Sub_Total"
                          name="Sub_Total"
                          value={formData.Sub_Total}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>

{/* Bill Type */}
<Col md={4} className="mb-4">
  <Form.Group className="mb-3">
    <Form.Label>Bill Type </Form.Label>
    <Form.Select
      id="bill_Type"
      name="bill_Type"
      value={formData.bill_Type}
      onChange={handleInputChange}
      isInvalid={errors.bill_Type}
    >
      <option value="">Select Bill Type</option>
      <option value="insurance">Insurance</option>
      <option value="non_insurance">Non-Insurance</option>
      <option value="charity">Charity</option>
    </Form.Select>
    <Form.Control.Feedback type="invalid">
      {errors.bill_Type}
    </Form.Control.Feedback>
  </Form.Group>
</Col>

{/* Conditional Fields for Insurance */}
{formData.bill_Type === "insurance" && (
  <>
    <Col md={4} className="mb-4">
      <Form.Group className="mb-3">
        <Form.Label>Insurance Company</Form.Label>
        <Form.Select
                          id="insurance"
                          name="insurance"
                          value={formData.insurance}
                          onChange={handleInputChange}
                          isInvalid={errors.insurance}
                        >
                          <option value="">Choose Insuarance</option>
                          {insurance.map((insurance) => (
                            <option key={insurance._id} value={insurance.companyname}>
                              {insurance.companyname}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {errors.insurance}
                        </Form.Control.Feedback>
      </Form.Group>
    </Col>

    <Col md={4} className="mb-4">
      <Form.Group className="mb-3">
        <Form.Label>TPA</Form.Label>
        <Form.Select
                          id="tpa"
                          name="tpa"
                          value={formData.tpa}
                          onChange={handleInputChange}
                          isInvalid={errors.tpa}
                        >
                          <option value="">Medi Assist TPA</option>
                          {tpa.map((tpa) => (
                            <option key={tpa._id} value={tpa.companyname}>
                              {tpa.companyname}
                            </option>
                          ))}
                          </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {errors.tpa}
                        </Form.Control.Feedback>
                        
      </Form.Group>
    </Col>
  </>
)}

{/* Conditional Fields for Non-Insurance */}
{formData.bill_Type === "non_insurance" && (
  <>
    <Col md={4} className="mb-4">
      <Form.Group className="mb-3">
        <Form.Label>Discount Amount</Form.Label>
        <Form.Control
          type="number"
          name="discountAmount"
          value={formData.discountAmount}
          onChange={handleInputChange}
        />
      </Form.Group>
    </Col>

    <Col md={4} className="mb-4">
      <Form.Group className="mb-3">
        <Form.Label>Payable Amount</Form.Label>
        <Form.Control
          type="number"
          name="payableAmount"
          value={formData.payableAmount}
          onChange={handleInputChange}
        />
      </Form.Group>
    </Col>
  </>
)}

{/* Conditional Fields for Charity */}
{formData.bill_Type === "charity" && (
  <>
    <Col md={4} className="mb-4">
      <Form.Group className="mb-3">
        <Form.Label>Discount Amount</Form.Label>
        <Form.Control
          type="number"
          name="discountAmount"
          value={formData.discountAmount}
          onChange={handleInputChange}
        />
      </Form.Group>
    </Col>

    <Col md={4} className="mb-4">
      <Form.Group className="mb-3">
        <Form.Label>Payable Amount</Form.Label>
        <Form.Control
          type="number"
          name="payableAmount"
          value={formData.payableAmount}
          onChange={handleInputChange}
        />
      </Form.Group>
   </Col>
</>
)}

                    {/* Note */}
                    <Col md={4} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Note </Form.Label>
                        <Form.Control
                          as="textarea"
                          id="note"
                          name="note"
                          value={formData.note}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>

                   {/* Submit and Reset Buttons */}
<Col md={12} className="d-flex justify-content-end align-items-end mb-4">
  <button type="submit" disabled={loading} className="btn btn-primary">
    {loading ? "Submitting..." : "Submit"}
  </button>
  <button type="button" onClick={handleReset} className="btn btn-secondary ms-2">
    Reset
  </button>
</Col>

                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AddInvoiceEx;


