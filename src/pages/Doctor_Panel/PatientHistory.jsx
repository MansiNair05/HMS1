import React, { useState } from "react";
import {
  Card,
  Button,
  Form,
  Row,
  Col,
  Container,
  Tab,
  Tabs,
} from "react-bootstrap";
import PageBreadcrumb from "../../componets/PageBreadcrumb"; // Fixed typo in 'components'


const SurgeryTabs = () => {
  const [key, setKey] = useState("piles");

  const tabData = [
    {
      id: "piles",
      title: "Piles",
      checkboxes: [
        "PR Bleeding: Painless",
        "PR Bleeding: Painful",
        "Burning",
        "Pricking",
        "Itching",
        "Incomplete Evacuation",
        "Prolapse",
        "Swelling",
        "Pain at Anal Region",
        "Mucus Mixed Blood",
      ],
      textarea: "piles_duration",
    },
    {
      id: "fistula",
      title: "Fistula",
      checkboxes: [
        "Pus Discharge",
        "Boil",
        "Watery Discharge",
        "Swelling near anal region",
        "Discharge from vagina gases/ stool",
      ],
      textarea: "fistula_duration",
    },
    {
      id: "hernia",
      title: "Hernia",
      checkboxes: [
        "Swelling: Umbilical",
        "Right Inguinal",
        "Left Inguinal",
        "Swelling: Abdominal",
        "Reducible",
        "Nonreducible",
        "Past Sx",
      ],
      textarea: "hernia_duration",
    },
    {
      id: "varicose",
      title: "Varicose",
      checkboxes: ["Varicose Veins"],
      textarea: "varicose_duration",
    },
    {
      id: "uninary",
      title: "Uninary",
      checkboxes: ["Uninary Incontinence"],
      textarea: "uninary_duration",
    },
    {
      id: "fecal",
      title: "Fecal",
      checkboxes: ["Fecal Incontinence"],
      textarea: "fecal_duration",
    },
    {
      id: "urology",
      title: "Urology",
      checkboxes: [
        "Pain",
        "Burning urination",
        "Nausea",
        "Vomiting",
        "LUTS",
        "Urgency of urination",
        "Incomplete evacuation",
        "Stream of urine",
        "Nocturia",
      ],
      textarea: "", // No textarea for Urology tab
    },
    {
      id: "ods",
      title: "ODS",
      checkboxes: [
        "Excessive Straining",
        "Digitation",
        "Hard Stools",
        "Enema/laxative",
        "Fragmented Defecation",
      ],
      textarea: "ods_duration",
      bowelHabitsTextarea: "bowel_habits", // Added Bowel Habits textarea
    },
    {
      id: "pilonidal",
      title: "Pilonidal Sinus",
      checkboxes: [], // No checkboxes for this tab
      pilonidalSinusTextarea: "pilonidal_sinus",
    },
    {
      id: "circumcision",
      title: "Circumcision",
      checkboxes: [], // No checkboxes for this tab
      circumcisionTextarea: "circumcision",
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
                  {tab.checkboxes.map((item, index) => (
                    <li key={index}>
                      <input
                        type="checkbox"
                        name={`${tab.id}[]`}
                        value={item}
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                  {tab.bowelHabitsTextarea && (
                    <li>
                      <textarea
                        name={tab.bowelHabitsTextarea}
                        placeholder="Bowel Habits"
                        style={{ width: "100%" }}
                      />
                    </li>
                  )}
                  {tab.textarea && (
                    <li>
                      <textarea
                        name={tab.textarea}
                        placeholder="Duration"
                        style={{ width: "100%" }}
                      />
                    </li>
                  )}
                  {tab.pilonidalSinusTextarea && (
                    <li>
                      <textarea
                        name={tab.pilonidalSinusTextarea}
                        placeholder="Pilonidal Sinus"
                        style={{ width: "100%" }}
                      />
                    </li>
                  )}
                  {tab.circumcisionTextarea && (
                    <li>
                      <textarea
                        name={tab.circumcisionTextarea}
                        placeholder="Circumcision"
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
};



const PatientHistory = () => {
  const [formData, setFormData] = useState({
    patient_date: "",
    height: "",
    weight: "",
    painScale: "",
    vitalSigns: {
      BP: "",
      Pulse: "",
      RR: "",
    },
    systematicExamination: {
      RS: "",
      CVS: "",
      CNS: "",
      PA: "",
    },
    general_history: {
      hoWtLoss: false,
      decAppetite: false,
      hoStrainingForurination: false,
      acidity: false,
      gas: false,
      bloating: false,
    },
    family_history: {
      piles: false,
      constipation: false,
      dm: false,
      htn: false,
      heartDisease: false,
    },
    fam_history: "",
    past_history: {
      dm: false,
      htn: false,
      brAsthma: false,
      thyroid: false,
    },
    habits: {
      smoking: false,
      alcohol: false,
      tobacco: false,
      drugs: false,
    },
    drugs_allergy: "",
    pastSurgicalHistory: "",
    anyOtherComplaints: "",
    presentComplaints: "",
    ongoingMedicine: {
      Clopidogrel: false,
      aspirin: false,
      warfarin: false,
    },
    otherongoingmedi: "",
    investigation: {
      hb: false,
      bslr: false,
      bleedingTimeBt: false,
      clottingTimeBt: false,
      ptInr: false,
      hiv: false,
      hbsag: false,
      srCreatinine: false,
      vitB: false,
    },
    advice: {
      mrd: false,
      manoBf: false,
      coloGastro: false,
      diet: false,
      b: false,
      d: false,
    },

    // Medications Section
    medications: [
      { id: 1, name: "", indication: "", since: "" },
      { id: 2, name: "", indication: "", since: "" },
    ],
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const validationErrors = {};
    if (!formData.patient_date)
      validationErrors.patient_date = "Patient date is required";
    if (!formData.height) validationErrors.height = "Height is required";
    if (!formData.weight) validationErrors.weight = "Weight is required";
    return validationErrors;
  };

  const handleInputChange = (e, id, field) => {
    const { name, value } = e.target;

    if (id && field) {
      // Medication update
      const updatedMedications = formData.medications.map((med) =>
        med.id === id ? { ...med, [field]: value } : med
      );
      setFormData({ ...formData, medications: updatedMedications });
    } else {
      // General form field update
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    const [category, field] = name.split(".");
    setFormData({
      ...formData,
      [category]: {
        ...formData[category],
        [field]: checked,
      },
    });
  };

  const handleSubmit = async (saveType) => {
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await fetch(
          "https://your-api-url.com/V1/patientHistory/addHistory",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...formData, saveType }),
          }
        );

        if (response.ok) {
          alert("Patient history added successfully");
        } else {
          alert("Failed to add patient history. Please try again.");
        }
      } catch (error) {
        console.error("Error while adding patient history:", error);
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
      <PageBreadcrumb pagename="Patient History" />
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
                  {/* Row 1: Patient Info */}
                  <Row className="mb-3">
                    <Col>
                      <Form.Group>
                        <Form.Label>Patient Date:</Form.Label>
                        <Form.Control
                          type="date"
                          name="patient_date"
                          value={formData.patient_date}
                          onChange={handleInputChange}
                          isInvalid={!!errors.patientDate}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.patientDate}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>Height:</Form.Label>
                        <Form.Control
                          type="number"
                          name="height"
                          value={formData.height}
                          onChange={handleInputChange}
                          isInvalid={!!errors.height}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.height}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>Weight:</Form.Label>
                        <Form.Control
                          type="number"
                          name="weight"
                          value={formData.weight}
                          onChange={handleInputChange}
                          isInvalid={!!errors.weight}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.weight}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  <br />
                  <SurgeryTabs />
                  <br />
                  {/* Row 2: Pain Score */}
                  <Row className="mb-3">
                    <Col>
                      <Form.Group>
                        <Form.Label>Pain Score:</Form.Label>
                        <Form.Select
                          name="painSpainScaleore"
                          value={formData.painScale}
                          onChange={handleInputChange}
                        >
                          <option value="">Select Pain Score</option>
                          <option value="0">No Pain</option>
                          <option value="1">Mild</option>
                          <option value="2">Moderate</option>
                          <option value="3">Severe</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  <br />
                  {/* Row 3: Vital Signs */}
                  <Form.Label>Vital Signs:</Form.Label>
                  <Row className="mb-3">
                    <Col>
                      <Form.Group>
                        <Form.Label>BP:</Form.Label>
                        <Form.Control
                          type="text"
                          name="vitalSigns.BP"
                          value={formData.vitalSigns.BP}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>Pulse:</Form.Label>
                        <Form.Control
                          type="text"
                          name="vitalSigns.Pulse"
                          value={formData.vitalSigns.Pulse}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>RR:</Form.Label>
                        <Form.Control
                          type="text"
                          name="vitalSigns.RR"
                          value={formData.vitalSigns.RR}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <br />
                  {/* Row 4: Systematic Examination */}
                  <Form.Label>Systematic Examination:</Form.Label>
                  <Row className="mb-3">
                    <Col>
                      <Form.Group>
                        <Form.Label>RS:</Form.Label>
                        <Form.Control
                          type="text"
                          name="systematicExamination.RS"
                          value={formData.systematicExamination.RS}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>CVS:</Form.Label>
                        <Form.Control
                          type="text"
                          name="systematicExamination.CVS"
                          value={formData.systematicExamination.CVS}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>CNS:</Form.Label>
                        <Form.Control
                          type="text"
                          name="systematicExamination.CNS"
                          value={formData.systematicExamination.CNS}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>P/A:</Form.Label>
                        <Form.Control
                          type="text"
                          name="systematicExamination.PA"
                          value={formData.systematicExamination.PA}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <br />
                  {/* Row 5: Family History */}
                  <Row className="mb-3">
                    <Col>
                      <Form.Group>
                        <Form.Label>Family History:</Form.Label>
                        <div>
                          <Form.Check
                            inline
                            label="Piles"
                            name="family_history.piles"
                            checked={formData.family_history.piles}
                            onChange={handleCheckboxChange}
                          />
                          <Form.Check
                            inline
                            label="Constipation"
                            name="family_history.constipation"
                            checked={formData.family_history.constipation}
                            onChange={handleCheckboxChange}
                          />
                          <Form.Check
                            inline
                            label="DM"
                            name="family_history.dm"
                            checked={formData.family_history.dm}
                            onChange={handleCheckboxChange}
                          />
                          <Form.Check
                            inline
                            label="HTN"
                            name="family_history.htn"
                            checked={formData.family_history.htn}
                            onChange={handleCheckboxChange}
                          />
                          <Form.Check
                            inline
                            label="Heart Disease"
                            name="family_history.heartDisease"
                            checked={formData.family_history.heartDisease}
                            onChange={handleCheckboxChange}
                          />
                          <Col xs={7}>
                            <Form.Control
                              as="textarea"
                              name="fam_history"
                              value={formData.fam_history}
                              onChange={handleInputChange}
                            />
                          </Col>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                  <br />
                  {/* Row 6: General History */}
                  <Row className="mb-3">
                    <Col>
                      <Form.Group>
                        <Form.Label>General History:</Form.Label>
                        <div>
                          <Form.Check
                            inline
                            label="H/o Wt Loss"
                            name="general_history.hoWtLoss"
                            checked={formData.general_history.hoWtLoss}
                            onChange={handleCheckboxChange}
                          />
                          <Form.Check
                            inline
                            label="Dec Appetite"
                            name="general_history.decAppetite"
                            checked={formData.general_history.decAppetite}
                            onChange={handleCheckboxChange}
                          />
                          <Form.Check
                            inline
                            label="H/O Straining for urination"
                            name="general_history.hoStrainingForurination"
                            checked={
                              formData.general_history.hoStrainingForurination
                            }
                            onChange={handleCheckboxChange}
                          />
                          <Form.Check
                            inline
                            label="Acidity"
                            name="general_history.acidity"
                            checked={formData.general_history.acidity}
                            onChange={handleCheckboxChange}
                          />
                          <Form.Check
                            inline
                            label="Bloating"
                            name="general_history.bloating"
                            checked={formData.general_history.bloating}
                            onChange={handleCheckboxChange}
                          />
                          <Form.Check
                            inline
                            label="Gas"
                            name="general_history.gas"
                            checked={formData.general_history.gas}
                            onChange={handleCheckboxChange}
                          />
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Form.Label>Past Medical History:</Form.Label>
                    <Col>
                      <Form.Group>
                        <Form.Label>DM:</Form.Label>
                        <Form.Control
                          type="text"
                          name="past_history.dm"
                          value={formData.past_history.dm}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>HTN:</Form.Label>
                        <Form.Control
                          type="text"
                          name="past_history.htn"
                          value={formData.past_history.htn}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>Br Asthma:</Form.Label>
                        <Form.Control
                          type="text"
                          name="past_history.brAsthma"
                          value={formData.past_history.brAsthma}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>Thyroid:</Form.Label>
                        <Form.Control
                          type="text"
                          name="past_history.thyroid"
                          value={formData.past_history.thyroid}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <br />
                  <Form.Label>Habits:</Form.Label>
                  <Row className="mb-3">
                    <Col>
                      <Form.Group>
                        <Form.Label>Smoking:</Form.Label>
                        <Form.Control
                          type="text"
                          name="habits.smoking"
                          value={formData.habits.smoking}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>Alcohol:</Form.Label>
                        <Form.Control
                          type="text"
                          name="habits.alcohol"
                          value={formData.habits.alcohol}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>Tobacco:</Form.Label>
                        <Form.Control
                          type="text"
                          name="habits.tobacco"
                          value={formData.habits.tobacco}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>Drugs:</Form.Label>
                        <Form.Control
                          type="text"
                          name="habits.drugs"
                          value={formData.habits.drugs}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <br />
                  {/* Row 2: Medications Table */}
                  <Form.Label>Medication Details:</Form.Label>
                  <table border="1" className="mb-3" style={{ width: "100%" }}>
                    <thead>
                      <tr>
                        <th>Sr No</th>
                        <th>Name</th>
                        <th>Indication</th>
                        <th>Since</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.medications.map((med) => (
                        <tr key={med.id}>
                          <td>{med.id}</td>
                          <td>
                            <input
                              type="text"
                              value={med.name}
                              onChange={(e) =>
                                handleInputChange(e, med.id, "name")
                              }
                              placeholder="Enter medication name"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={med.indication}
                              onChange={(e) =>
                                handleInputChange(e, med.id, "indication")
                              }
                              placeholder="Enter indication"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={med.since}
                              onChange={(e) =>
                                handleInputChange(e, med.id, "since")
                              }
                              placeholder="Enter since"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Add More Button */}
                  <Button
                    variant="primary"
                    onClick={() => {
                      const newId = formData.medications.length + 1;
                      const newMedication = {
                        id: newId,
                        name: "",
                        indication: "",
                        since: "",
                      };
                      setFormData({
                        ...formData,
                        medications: [...formData.medications, newMedication],
                      });
                    }}
                  >
                    Add More
                  </Button>

                  <Col>
                    <Form.Group>
                      <Form.Label>Allergy to Any Drug:</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="allergyToDrugs"
                        value={formData.allergyToDrugs}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group>
                      <Form.Label>Past Surgical History:</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="pastSurgicalHistory"
                        value={formData.pastSurgicalHistory}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group>
                      <Form.Label>Any Other Complaints:</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="anyOtherComplaints"
                        value={formData.anyOtherComplaints}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group>
                      <Form.Label>Present Complaints:</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="presentComplaints"
                        value={formData.presentComplaints}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>

                  <Row className="mb-3">
                    <Col md={4}>
                      <Form.Label>Ongoing Medicines:</Form.Label>
                      <Row>
                        <Col>
                          <Form.Check
                            inline
                            type="checkbox"
                            label="Clopidogrel"
                            name="ongoingMedicine.Clopidogrel"
                            checked={formData.ongoingMedicine.Clopidogrel}
                            onChange={handleCheckboxChange}
                          />
                          <Form.Check
                            inline
                            type="checkbox"
                            label="Aspirin"
                            name="ongoingMedicine.aspirin"
                            checked={formData.ongoingMedicine.aspirin}
                            onChange={handleCheckboxChange}
                          />
                          <Form.Check
                            inline
                            type="checkbox"
                            label="Warfarin"
                            name="ongoingMedicine.warfarin"
                            checked={formData.ongoingMedicine.warfarin}
                            onChange={handleCheckboxChange}
                          />
                        </Col>
                        <Col xs={7}>
                          <Form.Control
                            as="textarea"
                            placeholder="Any Other"
                            name="otherongoingmedi"
                            value={formData.otherongoingmedi || ""}
                            onChange={handleInputChange}
                          />
                        </Col>
                      </Row>
                    </Col>

                    <Col md={8}>
                      <Form.Label>Previous Investigation:</Form.Label>
                      <Row>
                        <Col>
                          <Form.Check
                            inline
                            type="checkbox"
                            label="HB"
                            name="investigation.hb"
                            checked={formData.investigation.hb}
                            onChange={handleCheckboxChange}
                          />
                          <Form.Check
                            inline
                            type="checkbox"
                            label="BSL-R"
                            name="investigation.bslr"
                            checked={formData.investigation.bslr}
                            onChange={handleCheckboxChange}
                          />
                          <Form.Check
                            inline
                            type="checkbox"
                            label="Bleeding Time-BT"
                            name="investigation.bleedingTimeBt"
                            checked={formData.investigation.bleedingTimeBt}
                            onChange={handleCheckboxChange}
                          />
                          <Form.Check
                            inline
                            type="checkbox"
                            label="Clotting Time-BT"
                            name="investigation.clottingTimeBt"
                            checked={formData.investigation.clottingTimeBt}
                            onChange={handleCheckboxChange}
                          />
                          <Form.Check
                            inline
                            type="checkbox"
                            label="PT INR"
                            name="investigation.ptInr"
                            checked={formData.investigation.ptInr}
                            onChange={handleCheckboxChange}
                          />
                          <Form.Check
                            inline
                            type="checkbox"
                            label="HIV"
                            name="investigation.hiv"
                            checked={formData.investigation.hiv}
                            onChange={handleCheckboxChange}
                          />
                          <Form.Check
                            inline
                            type="checkbox"
                            label="Hbsag"
                            name="investigation.hbsag"
                            checked={formData.investigation.hbsag}
                            onChange={handleCheckboxChange}
                          />
                          <Form.Check
                            inline
                            type="checkbox"
                            label="SR.Creatinine"
                            name="investigation.srCreatinine"
                            checked={formData.investigation.srCreatinine}
                            onChange={handleCheckboxChange}
                          />
                          <Form.Check
                            inline
                            type="checkbox"
                            label="VIT B12"
                            name="investigation.vitB"
                            checked={formData.investigation.vitB}
                            onChange={handleCheckboxChange}
                          />
                        </Col>
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label>Investigation Details:</Form.Label>
                            <Form.Control
                              as="textarea"
                              name="investigationDetails"
                              value={formData.investigationDetails}
                              onChange={handleInputChange}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Group>
                        <Form.Label>Known Case Of:</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="Known Case Of:"
                          value={formData.knownCaseOf}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <br />
                  <Row className="mb-3">
                    <Col md={4}>
                      <Form.Label>Advice:</Form.Label>
                      <Row>
                        <Col>
                          <Form.Check
                            inline
                            type="checkbox"
                            label="MRD"
                            name="advice.mrd"
                            checked={formData.advice.mrd}
                            onChange={handleCheckboxChange}
                          />
                          <Form.Check
                            inline
                            type="checkbox"
                            label="Mano/BF"
                            name="advice.manoBf"
                            checked={formData.advice.manoBf}
                            onChange={handleCheckboxChange}
                          />
                          <Form.Check
                            inline
                            type="checkbox"
                            label="Colo/Gstro"
                            name="advice.coloGastro"
                            checked={formData.advice.coloGastro}
                            onChange={handleCheckboxChange}
                          />
                          <Form.Check
                            inline
                            type="checkbox"
                            label="Diet"
                            name="advice.diet"
                            checked={formData.advice.diet}
                            onChange={handleCheckboxChange}
                          />
                          <Form.Check
                            inline
                            type="checkbox"
                            label="B12"
                            name="advice.b"
                            checked={formData.advice.b}
                            onChange={handleCheckboxChange}
                          />
                          <Form.Check
                            inline
                            type="checkbox"
                            label="D3"
                            name="advice.d"
                            checked={formData.advice.d}
                            onChange={handleCheckboxChange}
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Row>

                  <Col>
                    <Form.Group>
                      <Form.Label>Assistant Doctor:</Form.Label>
                      <Form.Select
                        name="assistantDoctor"
                        value={formData.assistantDoctor}
                        onChange={handleInputChange}
                      >
                        <option value="">Select an option</option>
                        <option value="Dr. Smith">Dr. Smith</option>
                        <option value="Dr. Johnson">Dr. Johnson</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Button className="mt-4" onClick={() => handleSubmit("save")}>
                    Save Patient History
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

export default PatientHistory;
