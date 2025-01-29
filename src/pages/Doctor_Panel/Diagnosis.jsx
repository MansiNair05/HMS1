import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Form,
  Row,
  Col,
  Container,
  Table,
  Tab,
  Tabs,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import PageBreadcrumb from "../../componets/PageBreadcrumb";
import { Link } from "react-router-dom";

const BASE_URL = "http://192.168.90.193:5000/api"; // Replace with your actual backend URL

const DiagnosisTabs = () => {
  const [key, setKey] = useState("piles");

  const tabData = [
    {
      id: "piles",
      title: "Piles",
      checkboxes: ["GRADE 1", "GRADE 2", "GRADE 3", "GRADE 4"],
    },
    {
      id: "fistula",
      title: "Fistula",
      checkboxes: [
        "GLUTEAL",
        "HIGH",
        "HORSESHOE",
        "NIDAL",
        "SCROTAL",
        "SUPRALEVATOR",
        "TRANSPHINCTERIC",
        "INTERSPHINCTERIC",
        "VAGINAL",
        "VULVAL",
        "COMPLEX",
        "RECURRENT",
      ],
    },
    {
      id: "hernia",
      title: "Hernia",
      checkboxes: [
        "VENTRAL",
        "INCISIONAL",
        "EPIGASTRIC",
        "RIGHT INGUINAL",
        "LEFT INGUINAL",
        "BILATERAL INGUINAL",
        "SUPRA UMBILICAL",
        "PARA UMBILICAL",
        "MULTIPLE DEFECTS UMBILICAL",
        "INFRA UMBILICAL",
      ],
    },
    {
      id: "varicose",
      title: "Varicose",
      checkboxes: ["RIGHT", "LEFT", "BILATERAL"],
    },
    {
      id: "prolapse",
      title: "Prolapse",
      checkboxes: ["MUCOSAL", "INCOMPLETE", "PROCIDENTIA"],
    },
    {
      id: "circumcision",
      title: "Circumcision",
      circumcisionTextarea: "circumcisionTextarea", // Only a textarea
    },
    {
      id: "abscess",
      title: "Abscess",
      abscessTextarea: "abscessTextarea", // Only a textarea
    },
    {
      id: "fissure",
      title: "Fissure",
      fissureTextarea: "fissureTextarea", // Only a textarea
    },
    {
      id: "ibs",
      title: "IBS",
      ibsTextarea: "ibsTextarea", // Only a textarea
    },
    {
      id: "urology",
      title: "Urology",
      urologyTextarea: "urologyTextarea", // Only a textarea
    },
  ];
return (
  <div className="box">
    <div className="box-header">
      <Tabs activeKey={key} onSelect={(k) => setKey(k)}>
        {tabData.map((tab) => (
          <Tab eventKey={tab.id} title={tab.title} key={tab.id}>
            <div className="tab-content p-3">
              <ul className="checkbox-grid">
                {/* Render checkboxes only if they exist */}
                {tab.checkboxes &&
                  tab.checkboxes.length > 0 &&
                  tab.checkboxes.map((item, index) => (
                    <li key={index}>
                      <input
                        type="checkbox"
                        name={`${tab.id}[]`}
                        value={item}
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                {/* Render textarea only if it exists and is not empty */}
                {tab.circumcisionTextarea && (
                  <li>
                    <textarea
                      name={tab.circumcisionTextarea}
                      placeholder="Circumcision Details"
                      style={{ width: "100%" }}
                    />
                  </li>
                )}
                {tab.abscessTextarea && (
                  <li>
                    <textarea
                      name={tab.abscessTextarea}
                      placeholder="Abscess Details"
                      style={{ width: "100%" }}
                    />
                  </li>
                )}
                {tab.fissureTextarea && (
                  <li>
                    <textarea
                      name={tab.fissureTextarea}
                      placeholder="Fissure Details"
                      style={{ width: "100%" }}
                    />
                  </li>
                )}
                {tab.ibsTextarea && (
                  <li>
                    <textarea
                      name={tab.ibsTextarea}
                      placeholder="IBS Details"
                      style={{ width: "100%" }}
                    />
                  </li>
                )}
                {tab.urologyTextarea && (
                  <li>
                    <textarea
                      name={tab.urologyTextarea}
                      placeholder="Urology Details"
                      style={{ width: "100%" }}
                    />
                  </li>
                )}
              </ul>
            </div>
          </Tab>
        ))}
      </Tabs>
    </div>
  </div>
);
}
const Diagnosis = () => {
  const [formData, setFormData] = useState({
    date_diagnosis: "",
    provisionaldiagnosis: "",
    investigationorders: "",
    diagnosis: "",
    adviceType: {
      medication: false,
      surgery: false,
      test: false,
    },
    medicinesPrescribed: false,
    medicineDetails: "",
    surgicalAdvice: "",
    comment: "",
    SurgicalDate: "",
    RF: "",
    Laser: "",
    MW: "",
    categoryComment: "",
    advice: {
      mcapa: false,
      manometry: false,
      diet: false,
      echo: false,
      uroflowmetry: false,
      colo: false,
      xray: false,
      mri: false,
      cht: false,
      gastro: false,
      ct: false,
      doppler: false,
      biofeedback: false,
      labInvestigation: false,
      ultrasonography: false,
      EchoAnalImaging: false,
    },
    other: {
      insurance: false,
      reimbursement: false,
      workshop: false,
      pdc: false,
    },
    consultantDoctor: "",
    assistantDoctor: "",
  });

  const [errors, setErrors] = useState({});
  const [diagnosis, setDiagnosis] = useState([]);
  const [consultants, setConsultants] = useState([]);
  const [assistantsDoctor, setAssistantsDoctor] = useState([]);



  const [dropdownOptions, setDropdownOptions] = useState([]); // Store API options
  const [selectedOptions, setSelectedOptions] = useState([]); // Track selected checkboxes
  
 // Fetch options from API
  useEffect(() => {
    const fetchDropdownOptions = async () => {
      try {
        const endpoints = [
          {
            url: "/V1/patienttabs/consultant_dropdown",
            setter: setConsultants,
          },
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
  
const categoryOptions = {
  RF: ["A", "A+", "A-", "B", "B+", "C", "C+", "C-", "C++", "D", "D+", "E"],
  Laser: ["A", "A+", "A-", "B", "B+", "C", "C+", "C-", "C++", "D", "D+", "E"],
  MW: ["A", "A+", "A-", "B", "B+", "C", "C+", "C-", "C++", "D", "D+", "E"],
};

const handleCategoryChange = (category, e) => {
  const { value, checked } = e.target;
  setFormData((prevData) => {
    const updatedCategory = checked
      ? [...prevData[category], value]
      : prevData[category].filter((item) => item !== value);
    return { ...prevData, [category]: updatedCategory };
  });
};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    const [parent, child] = name.split(".");

    if (child) {
      setFormData({
        ...formData,
        [parent]: { ...formData[parent], [child]: checked },
      });
    } else {
      setFormData({ ...formData, [name]: checked });
    }
  };

  const validate = () => {
    const errors = {};
    // Add validation logic here
    return errors;
  };

  const handleSubmit = async (saveType) => {
    const validationErrors = validate();
    console.log("Form Data:", formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        console.log("Sending request to backend...");
        const response = await fetch(
          `${BASE_URL}/V1/appointment/addAppointment`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...formData, saveType }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to submit form");
        }

        const responseData = await response.json();
        console.log("Response Data:", responseData);
        alert("Form submitted successfully!");
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("Failed to submit form. Please try again later.");
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
      <PageBreadcrumb pagename="Diagnosis" />
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
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Diagnosis Date:</Form.Label>
                        <Form.Control
                          type="date"
                          name="date_diagnosis"
                          value={formData.date_diagnosis}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Provisional Diagnosis:</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="provisionaldiagnosis"
                          value={formData.provisionaldiagnosis}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Investigation Orders:</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="investigationorders" // Fixed the name
                          value={formData.investigationorders}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col md={4}>
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

                    <Col md={8}>
                      <Form.Label>Advice Type:</Form.Label>
                      <Row>
                        <Col>
                          <Form.Check
                            inline
                            type="checkbox"
                            label="Medication"
                            name="adviceType.medication"
                            checked={formData.adviceType.medication}
                            onChange={handleCheckboxChange}
                          />
                          <Form.Check
                            inline
                            type="checkbox"
                            label="Surgery"
                            name="adviceType.surgery"
                            checked={formData.adviceType.surgery}
                            onChange={handleCheckboxChange}
                          />
                          <Form.Check
                            inline
                            type="checkbox"
                            label="Test"
                            name="adviceType.test"
                            checked={formData.adviceType.test}
                            onChange={handleCheckboxChange}
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <br />
                  <DiagnosisTabs />
                  <br />

                  <Row className="mb-3">
                    <Col md={4}>
                      <Form.Label>Medicines Prescribed:</Form.Label>
                      <Row>
                        <Col>
                          <Form.Check
                            inline
                            type="checkbox"
                            label="AAC"
                            name="medicinesPrescribed.AAC"
                            checked={formData.medicinesPrescribed.AAC}
                            onChange={handleCheckboxChange}
                          />
                          <Form.Check
                            inline
                            type="checkbox"
                            label="ANTACID"
                            name="medicinesPrescribed.ANTACID"
                            checked={formData.medicinesPrescribed.ANTACID}
                            onChange={handleCheckboxChange}
                          />
                          <Form.Check
                            inline
                            type="checkbox"
                            label="PROBIOTICS"
                            name="medicinesPrescribed.PROBIOTICS"
                            checked={formData.medicinesPrescribed.PROBIOTICS}
                            onChange={handleCheckboxChange}
                          />
                          <Form.Check
                            inline
                            type="checkbox"
                            label="NSAIDS"
                            name="medicinesPrescribed.NSAIDS"
                            checked={formData.medicinesPrescribed.NSAIDS}
                            onChange={handleCheckboxChange}
                          />
                          <Form.Check
                            inline
                            type="checkbox"
                            label="ANTIBIOTICS"
                            name="medicinesPrescribed.ANTIBIOTICS"
                            checked={formData.medicinesPrescribed.ANTIBIOTICS}
                            onChange={handleCheckboxChange}
                          />
                        </Col>
                        <Col xs={7}>
                          <Form.Control
                            as="textarea"
                            placeholder="Enter Medicines Prescribed"
                            name="medicinesPrescribed"
                            value={formData.medicinesPrescribed || ""}
                            onChange={handleInputChange}
                          />
                        </Col>
                      </Row>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Surgical Advice:</Form.Label>
                        <Form.Select
                          name="surgicalAdvice"
                          value={formData.surgicalAdvice}
                          onChange={handleInputChange}
                        >
                          <option value="">Select</option>
                          <option value="Advice 1">Advice 1</option>
                          <option value="Advice 2">Advice 2</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col xs={4}>
                      <Form.Label></Form.Label>
                      <Form.Control
                        as="textarea"
                        placeholder="Advice Comment"
                        name="surgicalAdvice"
                        value={formData.surgicalAdvice || ""}
                        onChange={handleInputChange}
                      />
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Comment:</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="comment"
                          value={formData.comment}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Check Surgical Date:</Form.Label>
                        <Form.Control
                          type="date"
                          name="SurgicalDate"
                          value={formData.SurgicalDate}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                    <Row className="mb-3">
                      <Col md={12}>
                        <Form.Group>
                          <Form.Label>Category:</Form.Label>
                          <Row className="mt-2">
                            {Object.keys(categoryOptions).map((category) => (
                              <Col md={4} key={category}>
                                <Form.Group>
                                  <Form.Label>{category}:</Form.Label>
                                  <DropdownButton title={`Select ${category}`}>
                                    {categoryOptions[category].map((option) => (
                                      <Dropdown.Item key={option}>
                                        <Form.Check
                                          type="checkbox"
                                          label={option}
                                          value={option}
                                          checked={formData[category].includes(
                                            option
                                          )}
                                          onChange={(e) =>
                                            handleCategoryChange(category, e)
                                          }
                                        />
                                      </Dropdown.Item>
                                    ))}
                                  </DropdownButton>
                                </Form.Group>
                              </Col>
                            ))}
                          </Row>
                        </Form.Group>
                      </Col>
                    </Row>
                    ;
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Category Comment:</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="categoryComment"
                          value={formData.categoryComment}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                    <Row className="mb-3">
                      <Col md={12}>
                        <Form.Group>
                          <Form.Label>Advice</Form.Label>
                          <Row>
                            <Col md={4}>
                              <Form.Check
                                type="checkbox"
                                label="MCDPA"
                                name="advice.MCDPA"
                                checked={formData.advice.MCDPA}
                                onChange={handleCheckboxChange}
                              />
                              <Form.Check
                                type="checkbox"
                                label="MANOMETRY"
                                name="advice.MANOMETRY"
                                checked={formData.advice.MANOMETRY}
                                onChange={handleCheckboxChange}
                              />
                              <Form.Check
                                type="checkbox"
                                label="DIET"
                                name="advice.DIET"
                                checked={formData.advice.DIET}
                                onChange={handleCheckboxChange}
                              />
                              <Form.Check
                                type="checkbox"
                                label="ECHO"
                                name="advice.ECHO"
                                checked={formData.advice.ECHO}
                                onChange={handleCheckboxChange}
                              />
                              <Form.Check
                                type="checkbox"
                                label="UROFLOWMETRY"
                                name="advice.UROFLOWMETRY"
                                checked={formData.advice.UROFLOWMETRY}
                                onChange={handleCheckboxChange}
                              />
                            </Col>
                            <Col md={4}>
                              <Form.Check
                                type="checkbox"
                                label="COLO"
                                name="advice.COLO"
                                checked={formData.advice.COLO}
                                onChange={handleCheckboxChange}
                              />
                              <Form.Check
                                type="checkbox"
                                label="X-RAY"
                                name="advice.xray"
                                checked={formData.advice.xray}
                                onChange={handleCheckboxChange}
                              />
                              <Form.Check
                                type="checkbox"
                                label="MRI"
                                name="advice.MRI"
                                checked={formData.advice.MRI}
                                onChange={handleCheckboxChange}
                              />
                              <Form.Check
                                type="checkbox"
                                label="CHT"
                                name="advice.CHT"
                                checked={formData.advice.CHT}
                                onChange={handleCheckboxChange}
                              />
                              <Form.Check
                                type="checkbox"
                                label="GASTRO"
                                name="advice.GASTRO"
                                checked={formData.advice.GASTRO}
                                onChange={handleCheckboxChange}
                              />
                            </Col>
                            <Col md={4}>
                              <Form.Check
                                type="checkbox"
                                label="CT"
                                name="advice.CT"
                                checked={formData.advice.CT}
                                onChange={handleCheckboxChange}
                              />
                              <Form.Check
                                type="checkbox"
                                label="DOPPLER"
                                name="advice.DOPPLER"
                                checked={formData.advice.DOPPLER}
                                onChange={handleCheckboxChange}
                              />
                              <Form.Check
                                type="checkbox"
                                label="BIOFEEDBACK"
                                name="advice.BIOFEEDBACK"
                                checked={formData.advice.BIOFEEDBACK}
                                onChange={handleCheckboxChange}
                              />
                              <Form.Check
                                type="checkbox"
                                label="LAB INVESTIGATION"
                                name="advice.labInvestigation"
                                checked={formData.advice.labInvestigation}
                                onChange={handleCheckboxChange}
                              />
                              <Form.Check
                                type="checkbox"
                                label="ULTRASONOGRAPHY"
                                name="advice.ULTRASONOGRAPHY"
                                checked={formData.advice.ULTRASONOGRAPHY}
                                onChange={handleCheckboxChange}
                              />
                              <Form.Check
                                type="checkbox"
                                label="3D ENDO ANAL IMAGING"
                                name="advice.echoAnalImaging"
                                checked={formData.advice.echoAnalImaging}
                                onChange={handleCheckboxChange}
                              />
                            </Col>
                          </Row>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>Other:</Form.Label>
                          <Row>
                            <Col>
                              <Form.Check
                                inline
                                type="checkbox"
                                label="Insurance"
                                name="other.insurance"
                                checked={formData.other.insurance}
                                onChange={handleCheckboxChange}
                              />
                              <Form.Check
                                inline
                                type="checkbox"
                                label="Reimbursement"
                                name="other.reimbursement"
                                checked={formData.other.reimbursement}
                                onChange={handleCheckboxChange}
                              />
                              <Form.Check
                                inline
                                type="checkbox"
                                label="Workshop"
                                name="other.workshop"
                                checked={formData.other.workshop}
                                onChange={handleCheckboxChange}
                              />
                              <Form.Check
                                inline
                                type="checkbox"
                                label="PDC"
                                name="other.pdc"
                                checked={formData.other.pdc}
                                onChange={handleCheckboxChange}
                              />
                            </Col>
                          </Row>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Consultant Name:</Form.Label>
                        <Form.Select
                          value={selectedOptions?.consultantName || ""}
                          onChange={(e) =>
                            setSelectedOptions({
                              ...selectedOptions,
                              consultantName: e.target.value,
                            })
                          }
                        >
                          <option value="">Select Consultant</option>
                          {[
                            ...new Set([
                              ...diagnosis.map(
                                (option) => option.consultantName
                              ),
                              ...consultants.map(
                                (consultant) => consultant.name
                              ),
                            ]),
                          ].map((consultantName, index) => (
                            <option key={index} value={consultantName}>
                              {consultantName}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
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
                              ...diagnosis.map(
                                (option) =>
                                  option.assistantsDoctorconsultantName
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
                  </Row>

                  <Button
                    variant="success"
                    onClick={() => handleSubmit("save")}
                    className="mt-4"
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

export default Diagnosis;
