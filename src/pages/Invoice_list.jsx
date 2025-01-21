import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button, Card, Modal, Form } from "react-bootstrap";
import PageBreadcrumb from "../components/PageBreadcrumb";
import { Link } from "react-router-dom";

const BASE_URL = "http://192.168.90.122:5000/api";

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [consultants, setConsultants] = useState([]);  // State for storing consultant list
  const [loading, setLoading] = useState(false);
  const [surgeons, setSurgeons] = useState([]);
  const [error, setError] = useState("");
  const [insurance, setInsurance] = useState([]);
  const [tpa, setTpa] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null); // State for the selected invoice
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  
  // Fetch invoices on component mount
  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      setError(""); // Reset error before new request
      try {
        const response = await fetch(`${BASE_URL}/V1/invoice/listInvoice`);
        const data = await response.json();
        if (response.ok) {
          setInvoices(data.data); // Assuming 'data' contains an array of invoices
        } else {
          setError("Error fetching invoices");
        }
      } catch (err) {
        setError("Error fetching invoices. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);
  
  // Fetch consultants for dropdown
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const responseConsultant = await fetch(`${BASE_URL}/V1/invoice/consultant_dropdown`);
        const dataConsultant = await responseConsultant.json();
        if (responseConsultant.ok) {
          setConsultants(dataConsultant.data);  // Set the fetched consultants
        }
        const responseSurgeon = await fetch(`${BASE_URL}/V1/invoice/surgeon_dropdown`);
        const dataSurgeon = await responseSurgeon.json();
        if (responseSurgeon.ok) {
          setSurgeons(dataSurgeon.data);
        }
        const responseInsurance = await fetch(`${BASE_URL}/V1/invoice/insurance_co_dropdown`);
        const dataInsurance = await responseInsurance.json();
        if (responseInsurance.ok) {
          setInsurance(dataInsurance.data); // Set fetched insurance data
        }
        const responseTpa = await fetch(`${BASE_URL}/V1/invoice/tpa_dropdown`);
        const dataTpa = await responseTpa.json();
        if (responseTpa.ok) {
          setTpa(dataTpa.data);
        }
        else {
          setError("Error fetching consultants");
        }
      } catch (err) {
        setError("Error fetching consultants. Please try again.");
      }
    };

    fetchDropdowns();  // Call the function to fetch consultants
  }, []);

  // Function to handle opening the modal
  const handleEditInvoice = (invoice) => {
    setSelectedInvoice(invoice); // Set the selected invoice to be edited
    setShowModal(true); // Show the modal
  };

  // Function to handle closing the modal
  const handleCloseModal = () => {
    setShowModal(false); // Hide the modal
    setSelectedInvoice(null); // Reset selected invoice
  };

  // Function to handle saving the edited invoice
  const handleSaveChanges = () => {
    if (selectedInvoice) {
      fetch(`/api/invoices/${selectedInvoice.invoice_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedInvoice),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Failed to update invoice.");
        })
        .then((updatedInvoice) => {
          const updatedInvoices = invoices.map((invoice) =>
            invoice.invoice_id === updatedInvoice.invoice_id ? updatedInvoice : invoice
          );
          setInvoices(updatedInvoices);
          setShowModal(false);
        })
        .catch((error) => {
          console.error("Error updating invoice:", error);
          alert("An error occurred while updating the invoice.");
        });
    }
  };


  return (
    <div className="themebody-wrap">
      <PageBreadcrumb pagename="Invoice List" />
      <Container fluid>
        <Row>
          <Col>
            <Card>
              <Card.Body>
                <div className="d-flex justify-content-between mb-3">
                  <h5>Invoice List</h5>
                  <Link to="/add-invoice">
                    <Button variant="primary">Add New Invoice</Button>
                  </Link>
                </div>

                {loading && <p>Loading invoices...</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}

                {/* Only render the table if invoices are available */}
                {!loading && !error && invoices.length > 0 && (
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>Invoice ID</th>
                        <th>Date</th>
                        <th>Patient Name</th>
                        <th>Phone No</th>
                        <th>Pay Mode</th>
                        <th>Payable Amount</th>
                        <th>Due Amount</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((invoice) => (
                        <tr key={invoice.invoice_id}>
                          <td>{invoice.invoice_id}</td>
                          <td>{invoice.creation_date}</td>
                          <td>{invoice.patientName}</td>
                          <td>{invoice.phone}</td>
                          <td>{invoice.pay_mode}</td>
                          <td>{invoice.payable_amt}</td>
                          <td>{invoice.due_amt}</td>
                          <td>
                            <Link to={`/view-invoice/${invoice.invoice_id}`}>
                              <Button variant="info" size="sm" className="me-2">
                                View
                              </Button>
                            </Link>
                            <Button
                              variant="warning"
                              onClick={() => handleEditInvoice(invoice)} // Open modal on click
                            >
                              Edit Invoice
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Modal to display and edit invoice details */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Invoice</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedInvoice ? (
            <Form>
            <Row>
              <Col md={4} className="mb-3">
                <Form.Group controlId="invoiceId">
                  <Form.Label>Invoice ID</Form.Label>
                  <Form.Control type="text" value={selectedInvoice.invoice_id} readOnly />
                </Form.Group>
              </Col>
          
              <Col md={4} className="mb-3">
                <Form.Group controlId="admission_no">
                  <Form.Label>Admission No</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedInvoice.admission_no}
                    onChange={(e) =>
                      setSelectedInvoice({
                        ...selectedInvoice,
                        admission_no: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
          
              <Col md={4} className="mb-3">
                <Form.Group controlId="patientName">
                  <Form.Label>Patient Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedInvoice.patientName}
                    onChange={(e) =>
                      setSelectedInvoice({
                        ...selectedInvoice,
                        patientName: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
          
            <Row>
              <Col md={4} className="mb-3">
                <Form.Group controlId="discharge_date">
                  <Form.Label>Discharge Date</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedInvoice.discharge_date}
                    onChange={(e) =>
                      setSelectedInvoice({
                        ...selectedInvoice,
                        discharge_date: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
          
              <Col md={4} className="mb-3">
                <Form.Group controlId="dischargetime">
                  <Form.Label>Discharge Time</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedInvoice.dischargetime}
                    onChange={(e) =>
                      setSelectedInvoice({
                        ...selectedInvoice,
                        dischargetime: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
          
              <Col md={4} className="mb-3">
                <Form.Group controlId="bed_category">
                  <Form.Label>Bed Category</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedInvoice.bed_category}
                    onChange={(e) =>
                      setSelectedInvoice({
                        ...selectedInvoice,
                        bed_category: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
          
            <Row>
              <Col md={4} className="mb-3">
                <Form.Group controlId="admission_date">
                  <Form.Label>Admission Date</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedInvoice.admission_date}
                    onChange={(e) =>
                      setSelectedInvoice({
                        ...selectedInvoice,
                        admission_date: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
          
              <Col md={4} className="mb-3">
                <Form.Group controlId="admissiontime">
                  <Form.Label>Admission Time</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedInvoice.admissiontime}
                    onChange={(e) =>
                      setSelectedInvoice({
                        ...selectedInvoice,
                        admissiontime: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>


              <Col md={4} className="mb-3">
  <Form.Group controlId="consultantName">
    <Form.Label>Consultant Name</Form.Label>
    <Form.Select
      value={selectedInvoice?.consultantName || ""}
      onChange={(e) =>
        setSelectedInvoice({
          ...selectedInvoice,
          consultantName: e.target.value,
        })
      }
    >
      <option value="">Select Consultant</option>

      {/* Combine and deduplicate invoices and consultants data */}
      {[
        ...new Set(
          [
            ...invoices.map((invoice) => invoice.consultantName),
            ...consultants.map((consultant) => consultant.name),
          ]
        ),
      ].map((consultantName, index) => (
        <option key={index} value={consultantName}>
          {consultantName}
        </option>
      ))}
    </Form.Select>
  </Form.Group>
</Col>

            </Row>
          
            <Row>
            <Col md={4} className="mb-3">
        <Form.Group controlId="surgeonName">
          <Form.Label>Surgeon Name</Form.Label>
          <Form.Select
            value={selectedInvoice?.surgeonName || ""}
            onChange={(e) =>
              setSelectedInvoice({
                ...selectedInvoice,
                surgeonName: e.target.value,
              })
            }
          >
            <option value="">Select Surgeon</option>

            {/* Combine and deduplicate invoices and surgeons data */}
            {[
              ...new Set(
                [
                  ...invoices.map((invoice) => invoice.surgeonName),
                  ...surgeons.map((surgeon) => surgeon.name),
                ]
              ),
            ].map((surgeonName, index) => (
              <option key={index} value={surgeonName}>
                {surgeonName}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </Col>
          
              <Col md={4} className="mb-3">
                <Form.Group controlId="Sub_Total">
                  <Form.Label>Sub Total</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedInvoice.Sub_Total}
                    onChange={(e) =>
                      setSelectedInvoice({
                        ...selectedInvoice,
                        Sub_Total: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
          
  <Col md={4} className="mb-4">
  <Form.Group className="mb-3">
    <Form.Label>Bill Type</Form.Label>
    <Form.Select
      id="bill_Type"
      name="bill_Type"
      value={selectedInvoice.bill_Type}  
      onChange={(e) =>
        setSelectedInvoice({
          ...selectedInvoice,
          bill_Type: e.target.value,
        })
      }
      isInvalid={error
        .bill_Type} 
    >
      <option value="" disabled>
        SELECT BILL TYPE
      </option>
      <option value="insurance">Insurance</option>
      <option value="non_insurance">Non-Insurance</option>
      <option value="charity">Charity</option>
    </Form.Select>
    <Form.Control.Feedback type="invalid">
      {error.bill_Type}
    </Form.Control.Feedback>
  </Form.Group>
</Col>
      </Row>
      <Row>
    <Col md={4} className="mb-3">
      <Form.Group controlId="insurance">
        <Form.Label>Insurance Company</Form.Label>
        <Form.Select
          value={selectedInvoice?.insurance || ""}
          onChange={(e) =>
            setSelectedInvoice({
              ...selectedInvoice,
              insurance: e.target.value,
            })
          }
        >
          <option value="">Select Insurance Company</option>
          {[...new Set([
            ...invoices.map((invoice) => invoice.insurance),
            ...insurance.map((insurance) => insurance.companyname),
          ])].map((companyName, index) => (
            <option key={index} value={companyName}>
              {companyName}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
    </Col>

    <Col md={4} className="mb-3">
      <Form.Group controlId="tpa">
        <Form.Label>TPA</Form.Label>
        <Form.Select
          value={selectedInvoice?.tpa || ""}
          onChange={(e) =>
            setSelectedInvoice({
              ...selectedInvoice,
              tpa: e.target.value,
            })
          }
        >
          <option value="">Select TPA Company</option>
          {[...new Set([
            ...invoices.map((invoice) => invoice.tpa),
            ...tpa.map((tpa) => tpa.companyname),
          ])].map((companyName, index) => (
              <option key={index} value={companyName}>
                {companyName}
              </option>
          ))}
        </Form.Select>
      </Form.Group>
    </Col>

    <Col md={4} className="mb-3">
      <Form.Group controlId="bill_method">
        <Form.Label>Bill Method</Form.Label>
        <Form.Select
          value={selectedInvoice.bill_method}
          onChange={(e) =>
            setSelectedInvoice({
              ...selectedInvoice,
              bill_method: e.target.value,
            })
          }
          isInvalid={error.bill_method}
        >
          <option value="" disabled>
            SELECT BILL METHOD
          </option>
          <option value="cashless">Cashless</option>
          <option value="PDC">PDC</option>
          <option value="reimbursement">Reimbursement</option>
        </Form.Select>
        <Form.Control.Feedback type="invalid">
          {error.bill_method}
        </Form.Control.Feedback>
      </Form.Group>
    </Col>

    <Col md={4} className="mb-3">
      <Form.Group controlId="chequeno">
        <Form.Label>Enter Cheque No</Form.Label>
        <Form.Control
          type="number"
          value={selectedInvoice.chequeno}
          onChange={(e) =>
            setSelectedInvoice({
              ...selectedInvoice,
              chequeno: e.target.value,
            })
          }
        />
      </Form.Group>
    </Col>
  </Row>

  <Row>
    <Col md={4} className="mb-3">
      <Form.Group controlId="pdc">
        <Form.Label>Enter PDC Amount</Form.Label>
        <Form.Control
          type="number"
          value={selectedInvoice.pdc}
          onChange={(e) =>
            setSelectedInvoice({
              ...selectedInvoice,
              pdc: e.target.value,
            })
          }
        />
      </Form.Group>
    </Col>

    <Col md={4} className="mb-3">
      <Form.Group controlId="payableAmount">
        <Form.Label>Payable Amount</Form.Label>
        <Form.Control
          type="number"
          value={selectedInvoice.payableAmount}
          onChange={(e) =>
            setSelectedInvoice({
              ...selectedInvoice,
              payableAmount: e.target.value,
            })
          }
        />
      </Form.Group>
    </Col>
  </Row>

  <Row>


    <Col md={4} className="mb-3">
      <Form.Group controlId="non_insurance">
        <Form.Label>Discount Amount</Form.Label>
        <Form.Control
          type="number"
          value={selectedInvoice.non_insurance}
          onChange={(e) =>
            setSelectedInvoice({
              ...selectedInvoice,
              non_insurance: e.target.value,
            })
          }
        />
      </Form.Group>
    </Col>


  </Row>
          
            {/* Add more fields as necessary */}
          </Form>
          
          ) : (
            <p>Loading...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default InvoiceList;
