import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button, Card, Modal, Form } from "react-bootstrap";
import PageBreadcrumb from "../components/PageBreadcrumb";
import { Link } from "react-router-dom";

const BASE_URL = "http://192.168.90.217:5000/api";

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null); // State for the selected invoice
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

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
      // You would make an API call to save the changes (PUT request)
      fetch(`/api/invoices/${selectedInvoice.invoiceId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedInvoice), // Send the updated invoice data
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Failed to update invoice.");
        })
        .then((updatedInvoice) => {
          // Update the state with the modified invoice
          const updatedInvoices = invoices.map((invoice) =>
            invoice.invoiceId === updatedInvoice.invoiceId ? updatedInvoice : invoice
          );
          setInvoices(updatedInvoices);

          // Close the modal after saving
          setShowModal(false);
        })
        .catch((error) => {
          console.error("Error updating invoice:", error);
          alert("An error occurred while updating the invoice.");
        });
    }
  };

  return (
    <Container>
      <PageBreadcrumb title="Invoices" />
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Invoice ID</th>
                    <th>Patient Name</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.invoiceId}>
                      <td>{invoice.invoiceId}</td>
                      <td>{invoice.patientName}</td>
                      <td>{invoice.amount}</td>
                      <td>{invoice.status}</td>
                      <td>
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
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal to display and edit invoice details */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Invoice</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedInvoice ? (
            <Form>
              <Form.Group controlId="invoiceId">
                <Form.Label>Invoice ID</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedInvoice.invoiceId}
                  readOnly
                />
              </Form.Group>

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

              <Form.Group controlId="amount">
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  type="number"
                  value={selectedInvoice.amount}
                  onChange={(e) =>
                    setSelectedInvoice({
                      ...selectedInvoice,
                      amount: e.target.value,
                    })
                  }
                />
              </Form.Group>

              <Form.Group controlId="status">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedInvoice.status}
                  onChange={(e) =>
                    setSelectedInvoice({
                      ...selectedInvoice,
                      status: e.target.value,
                    })
                  }
                />
              </Form.Group>

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
    </Container>
  );
};

export default InvoiceList;
