import { useState, useEffect } from "react";
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
import NavBarD from "./NavbarD";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BASE_URL = "http://192.168.90.158:5000/api";

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
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        padding: "20px",
      }}
    >
      <Tabs
        activeKey={key}
        onSelect={(k) => setKey(k)}
        style={{
          borderBottom: "2px solid #e0f7fa",
        }}
      >
        {tabData.map((tab) => (
          <Tab
            eventKey={tab.id}
            title={tab.title}
            key={tab.id}
            style={{
              padding: "15px",
            }}
          >
            <div
              style={{
                padding: "20px",
                backgroundColor: "#fff",
                borderRadius: "0 0 8px 8px",
              }}
            >
              <Row>
                {tab.checkboxes.map((item, index) => (
                  <Col md={4} key={index} style={{ marginBottom: "10px" }}>
                    <Form.Check
                      type="checkbox"
                      id={`${tab.id}-${index}`}
                      label={item}
                      name={`${tab.id}[]`}
                      value={item}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    />
                  </Col>
                ))}
              </Row>

              {/* Textareas in a row if they exist */}
              {(tab.textarea ||
                tab.bowelHabitsTextarea ||
                tab.pilonidalSinusTextarea ||
                tab.circumcisionTextarea) && (
                <Row style={{ marginTop: "20px" }}>
                  {tab.bowelHabitsTextarea && (
                    <Col md={6}>
                      <Form.Control
                        as="textarea"
                        name={tab.bowelHabitsTextarea}
                        placeholder="Bowel Habits"
                        style={{
                          width: "100%",
                          minHeight: "80px",
                          padding: "10px",
                          borderRadius: "4px",
                          border: "1px solid #ced4da",
                        }}
                      />
                    </Col>
                  )}
                  {tab.textarea && (
                    <Col md={6}>
                      <Form.Control
                        as="textarea"
                        name={tab.textarea}
                        placeholder="Duration"
                        style={{
                          width: "100%",
                          minHeight: "80px",
                          padding: "10px",
                          borderRadius: "4px",
                          border: "1px solid #ced4da",
                        }}
                      />
                    </Col>
                  )}
                  {tab.pilonidalSinusTextarea && (
                    <Col md={12}>
                      <Form.Control
                        as="textarea"
                        name={tab.pilonidalSinusTextarea}
                        placeholder="Pilonidal Sinus"
                        style={{
                          width: "100%",
                          minHeight: "80px",
                          padding: "10px",
                          borderRadius: "4px",
                          border: "1px solid #ced4da",
                        }}
                      />
                    </Col>
                  )}
                  {tab.circumcisionTextarea && (
                    <Col md={12}>
                      <Form.Control
                        as="textarea"
                        name={tab.circumcisionTextarea}
                        placeholder="Circumcision"
                        style={{
                          width: "100%",
                          minHeight: "80px",
                          padding: "10px",
                          borderRadius: "4px",
                          border: "1px solid #ced4da",
                        }}
                      />
                    </Col>
                  )}
                </Row>
              )}
            </div>
          </Tab>
        ))}
      </Tabs>
    </div>
  );
};

const PatientHistory = () => {
  const [patientId, setPatientId] = useState(
    localStorage.getItem("selectedPatientId")
  );
  const [showTextareas, setShowTextareas] = useState({}); // Track visibility of textareas
  const [selectedFile, setSelectedFile] = useState(null);
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
    past_history: {
      dm: "",
      htn: "",
      brAsthma: "",
      thyroid: "",
    },
    habits: {
      smoking: "",
      alcohol: "",
      tobacco: "",
      drugs: "",
    },
    drugs_allergy: "",
    pastSurgicalHistory: "",
    anyOtherComplaints: "",
    presentComplaints: "",
    ongoing_medicines: {
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
    knowncaseof: "",
    advice: {
      mrd: false,
      manoBf: false,
      coloGastro: false,
      diet: false,
      b: false,
      d: false,
    },
    medications: [
      { id: 1, name: "", indication: "", since: "" },
      { id: 2, name: "", indication: "", since: "" },
    ],
  });

  const [errors, setErrors] = useState({});
  const [patientHistory, setPatientHistory] = useState([]);
  const [assistantsDoctor, setAssistantsDoctor] = useState([]);
  const [showEditButton, setShowEditButton] = useState(false); // Controls visibility of "Edit Diagnosis"
  const [isDisabled, setIsDisabled] = useState(false); // Controls edit mode
  const [disablePreviousButton, setDisablePreviousButton] = useState(false); // Disables "Previous Records" after clicking
  const [selectedOptions, setSelectedOptions] = useState([]); // Track selected checkboxes

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
          `${BASE_URL}/V1/patientHistory/listPatientHistory/${patientId}`,
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
        console.log("Fetched Data:", data);

        if (data?.data?.patientHistory?.length > 0) {
          const patientData = data.data.patientHistory[0];

          // Safely update formData with nested objects
          setFormData((prevState) => ({
            ...prevState,
            ...patientData,
            vitalSigns: {
              ...prevState.vitalSigns,
              ...(patientData.vitalSigns || {}),
            },
            systematicExamination: {
              ...prevState.systematicExamination,
              ...(patientData.systematicExamination || {}),
            },
            general_history: {
              ...prevState.general_history,
              ...(patientData.general_history || {}),
            },
            family_history: {
              ...prevState.family_history,
              ...(patientData.family_history || {}),
            },
            past_history: {
              ...prevState.past_history,
              ...(patientData.past_history || {}),
            },
            habits: {
              ...prevState.habits,
              ...(patientData.habits || {}),
            },
            ongoing_medicines: {
              ...prevState.ongoing_medicines,
              ...(patientData.ongoing_medicines || {}),
            },
            investigation: {
              ...prevState.investigation,
              ...(patientData.investigation || {}),
            },
            advice: {
              ...prevState.advice,
              ...(patientData.advice || {}),
            },
            knowncaseof: {
              ...prevState.knowncaseof,
              ...(patientData.knowncaseof || {}),
            },
            medications: patientData.medications || prevState.medications,
          }));
        } else {
          console.warn("No patient data found in API response");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchPatientData();
  }, [patientId]);

  // Fetch options from API
  useEffect(() => {
    const fetchDropdownOptions = async () => {
      try {
        const endpoints = [
          {
            url: "/V1/patienttabsdp/assistantDoc_dropdown",
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
  }, [patientId]);

  const validate = () => {
    const validationErrors = {};
    if (!formData.patient_date)
      validationErrors.patient_date = "Patient date is required";
    if (!formData.height) validationErrors.height = "Height is required";
    if (!formData.weight) validationErrors.weight = "Weight is required";
    return validationErrors;
  };

  const handleInputChange = (e, id, field) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
      [name]: type === "checkbox" ? checked : value,
    }));
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

  // Handle File Selection
  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the selected file
    setSelectedFile(file);
  };

 const handleCheckboxChange = (e) => {
   const { name, checked } = e.target;
   const [category, field] = name.split(".");

   setFormData((prev) => ({
     ...prev,
     [category]: {
       ...prev[category],
       [field]: checked,
     },
   }));
 };


  const handleHistoryClick = async () => {
    const patientId = localStorage.getItem("selectedPatientId");

    try {
      console.log("Form data before saving:", formData);
      // Format the data before sending
      const formattedData = {
        ...formData,
        // Convert objects to strings using JSON.stringify
        general_history: JSON.stringify(formData.general_history),
        past_history: JSON.stringify(formData.past_history),
        habits: JSON.stringify(formData.habits),
        ongoing_medicines: JSON.stringify(formData.ongoing_medicines),
        investigation: JSON.stringify(formData.investigation),
        vitalSigns: JSON.stringify(formData.vitalSigns),
        systematicExamination: JSON.stringify(formData.systematicExamination),
        family_history: JSON.stringify(formData.family_history),
        advice: JSON.stringify(formData.advice),
        selectedOptions,
        patientId,
      };

      // First, save the patient history data
      const saveResponse = await fetch(
        `${BASE_URL}/V1/patientHistory/addPatientHistory/${patientId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedData),
        }
      );

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json();
        throw new Error(errorData.message || "Failed to save patient history");
      }

      // Then, update the historychk
      const historyResponse = await fetch(
        `${BASE_URL}/V1/patientHistory/updateHistoryChk/${patientId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ historychk: 3 }),
        }
      );

      if (!historyResponse.ok) {
        throw new Error("Failed to update history check");
      }

      // If both operations are successful, show success message
      alert("Patient history saved successfully!");
    } catch (error) {
      console.error("Error saving patient history:", error);
      alert("Failed to save patient history. Please try again.");
    }
  };
  const [previousRecordDate, setPreviousRecordDate] = useState(""); // Store the previous record date

  const fetchPreviousRecords = async (prevData) => {
    try {
      console.log("Fetching previous records for patientId:", patientId);

      const response = await fetch(
        `${BASE_URL}/V1/patientHistory/listPatientHistory/${patientId}`
      );

      const result = await response.json();
      console.log("on click Fetched Data:", result.data.patientHistory); // Log API response

      if (!response.ok) {
        throw new Error("Failed to fetch previous records");
      }

      const patientHistory = result.data.patientHistory;

      // Set previous record date before updating formData
      setPreviousRecordDate(
        patientHistory.date_patientHistory || prevData.date_patientHistory || ""
      );

      // Update formData with all the fields from the API
      setFormData((prevData) => ({
        ...prevData,
        // Basic details
        patient_date: patientHistory.patient_date || "",
        height: patientHistory.height || "",
        weight: patientHistory.weight || "",
        painScale: patientHistory.painScale || "",

        // Vital Signs
        vitalSigns: {
          ...prevData.vitalSigns,
          BP: patientHistory.vitalSigns?.BP || "",
          Pulse: patientHistory.vitalSigns?.Pulse || "",
          RR: patientHistory.vitalSigns?.RR || "",
        },

        // Systematic Examination
        systematicExamination: {
          ...prevData.systematicExamination,
          RS: patientHistory.systematicExamination?.RS || "",
          CVS: patientHistory.systematicExamination?.CVS || "",
          CNS: patientHistory.systematicExamination?.CNS || "",
          PA: patientHistory.systematicExamination?.PA || "",
        },

        // General History
        general_history: {
          ...prevData.general_history,
          hoWtLoss: patientHistory.general_history?.hoWtLoss || false,
          decAppetite: patientHistory.general_history?.decAppetite || false,
          hoStrainingForurination:
            patientHistory.general_history?.hoStrainingForurination || false,
          acidity: patientHistory.general_history?.acidity || false,
          gas: patientHistory.general_history?.gas || false,
          bloating: patientHistory.general_history?.bloating || false,
        },

        // Family History
        family_history: {
          ...prevData.family_history,
          piles: patientHistory.family_history?.piles || false,
          constipation: patientHistory.family_history?.constipation || false,
          dm: patientHistory.family_history?.dm || false,
          htn: patientHistory.family_history?.htn || false,
          heartDisease: patientHistory.family_history?.heartDisease || false,
        },

        // Past History
        past_history: {
          ...prevData.past_history,
          dm: patientHistory.past_history?.dm || "",
          htn: patientHistory.past_history?.htn || "",
          brAsthma: patientHistory.past_history?.brAsthma || "",
          thyroid: patientHistory.past_history?.thyroid || "",
        },

        // Habits
        habits: {
          ...prevData.habits,
          smoking: patientHistory.habits?.smoking || "",
          alcohol: patientHistory.habits?.alcohol || "",
          tobacco: patientHistory.habits?.tobacco || "",
          drugs: patientHistory.habits?.drugs || "",
        },

        // Surgery Tabs Data
        piles: patientHistory.piles || [],
        fistula: patientHistory.fistula || [],
        hernia: patientHistory.hernia || [],
        varicose: patientHistory.varicose || [],
        uninary: patientHistory.uninary || [],
        fecal: patientHistory.fecal || [],
        urology: patientHistory.urology || [],
        ods: patientHistory.ods || [],
        pilonidal: patientHistory.pilonidal || "",
        circumcision: patientHistory.circumcision || "",

        // Other fields
        drugs_allergy: patientHistory.drugs_allergy || "",
        pastSurgicalHistory: patientHistory.pastSurgicalHistory || "",
        anyOtherComplaints: patientHistory.anyOtherComplaints || "",
        presentComplaints: patientHistory.presentComplaints || "",

        // Ongoing Medicines
        ongoing_medicines: {
          ...prevData.ongoing_medicines,
          Clopidogrel: patientHistory.ongoing_medicines?.Clopidogrel || false,
          aspirin: patientHistory.ongoing_medicines?.aspirin || false,
          warfarin: patientHistory.ongoing_medicines?.warfarin || false,
        },

        otherongoingmedi: patientHistory.otherongoingmedi || "",

        // Investigation
        investigation: {
          ...prevData.investigation,
          hb: patientHistory.investigation?.hb || false,
          bslr: patientHistory.investigation?.bslr || false,
          bleedingTimeBt: patientHistory.investigation?.bleedingTimeBt || false,
          clottingTimeBt: patientHistory.investigation?.clottingTimeBt || false,
          ptInr: patientHistory.investigation?.ptInr || false,
          hiv: patientHistory.investigation?.hiv || false,
          hbsag: patientHistory.investigation?.hbsag || false,
          srCreatinine: patientHistory.investigation?.srCreatinine || false,
          vitB: patientHistory.investigation?.vitB || false,
        },
        investigationComments: patientHistory.investigationComments || {},
        knowncaseof: patientHistory.knowncaseof || "",

        // Advice
        advice: {
          ...prevData.advice,
          mrd: patientHistory.advice?.mrd || false,
          manoBf: patientHistory.advice?.manoBf || false,
          coloGastro: patientHistory.advice?.coloGastro || false,
          diet: patientHistory.advice?.diet || false,
          b: patientHistory.advice?.b || false,
          d: patientHistory.advice?.d || false,
        },

        // Medications
        medications: patientHistory.medications || [
          { id: 1, name: "", indication: "", since: "" },
          { id: 2, name: "", indication: "", since: "" },
        ],
      }));

      // Also update selected checkboxes for surgery tabs
      setSelectedOptions(patientHistory.selectedOptions || []);

      // Show the "Edit Diagnosis" button
      setShowEditButton(true);
      // Disable "Previous Records" button after clicking it
      setDisablePreviousButton(true);
      // Disable form fields
      setIsDisabled(true);

      console.log("Form data updated with previous records");
    } catch (error) {
      console.error("Error fetching previous records:", error);
      alert("Failed to fetch previous records.");
    }
  };

  // Enable form editing when "Edit Diagnosis" is clicked
  const handleEditPatientHistory = () => {
    setIsDisabled(false);
    alert("Editing mode enabled. You can now modify the diagnosis details.");
  };

  const handleNewRecord = () => {
    setFormData({
      // Basic details
      patient_date: new Date().toISOString().split("T")[0],
      height: "",
      weight: "",
      painScale: "",

      // Vital Signs
      vitalSigns: {
        BP: "",
        Pulse: "",
        RR: "",
      },

      // Systematic Examination
      systematicExamination: {
        RS: "",
        CVS: "",
        CNS: "",
        PA: "",
      },

      // General History
      general_history: {
        hoWtLoss: false,
        decAppetite: false,
        hoStrainingForurination: false,
        acidity: false,
        gas: false,
        bloating: false,
      },

      // Family History
      family_history: {
        piles: false,
        constipation: false,
        dm: false,
        htn: false,
        heartDisease: false,
      },

      // Past History
      past_history: {
        dm: "",
        htn: "",
        brAsthma: "",
        thyroid: "",
      },

      // Habits
      habits: {
        smoking: "",
        alcohol: "",
        tobacco: "",
        drugs: "",
      },

      // Surgery Tabs Data
      piles: [],
      fistula: [],
      hernia: [],
      varicose: [],
      uninary: [],
      fecal: [],
      urology: [],
      ods: [],
      pilonidal: "",
      circumcision: "",

      // Other fields
      drugs_allergy: "",
      pastSurgicalHistory: "",
      anyOtherComplaints: "",
      presentComplaints: "",

      // Ongoing Medicines
      ongoing_medicines: {
        Clopidogrel: false,
        aspirin: false,
        warfarin: false,
      },

      otherongoingmedi: "",

      // Investigation
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

      knowncaseof: "",

      // Advice
      advice: {
        mrd: false,
        manoBf: false,
        coloGastro: false,
        diet: false,
        b: false,
        d: false,
      },

      // Medications
      medications: [
        { id: 1, name: "", indication: "", since: "" },
        { id: 2, name: "", indication: "", since: "" },
      ],
    });

    // Reset selected options for surgery tabs
    setSelectedOptions([]);

    // Hide "Edit Diagnosis" button when creating a new record
    setShowEditButton(false);

    // Enable the "Previous Records" button when creating a new record
    setDisablePreviousButton(false);

    // Allow editing for a new record
    setIsDisabled(false);

    alert("New Record: You can now enter new data.");
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
      <NavBarD pagename="Patient History" />

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
                      style={{
                        float: "right",
                      }}
                      onClick={fetchPreviousRecords}
                      disabled={disablePreviousButton}
                    >
                      Previous Records
                    </button>
                    {/* Show Edit Diagnosis Button only after clicking "Previous Records" */}
                    {showEditButton && (
                      <button
                        type="button"
                        className="btn btn-warning"
                        style={{ float: "right", marginRight: "7px" }}
                        onClick={handleEditPatientHistory}
                      >
                        Edit Diagnosis
                      </button>
                    )}
                  </div>
                  {/* Show the previous record date when available */}
                  {previousRecordDate && (
                    <div style={{ marginTop: "15px" }}>
                      <strong>Previous Record Date: </strong>
                      <span>{previousRecordDate}</span>
                    </div>
                  )}
                  <br />
                  {/* Row 1: Patient Info */}
                  <Row>
                    <Col md={2} className="mb-4">
                      <Form.Group className="mb-3">
                        <Form.Label>Patient Date:</Form.Label>
                        <DatePicker
                          selected={
                            formData?.patient_date
                              ? new Date(formData.patient_date)
                              : null
                          }
                          onChange={(date) => {
                            handleInputChange({
                              target: {
                                name: "patient_date",
                                value: date
                                  ? date.toISOString().split("T")[0]
                                  : "",
                              },
                            });
                          }}
                          isInvalid={!!errors.patientDate}
                          dateFormat="yyyy-MM-dd"
                          className="form-control"
                          placeholderText="Select Patient Date"
                          maxDate={new Date()}
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.patientDate}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={2} className="mb-4">
                      <Form.Group>
                        <Form.Label>Height:</Form.Label>
                        <div className="d-flex">
                          <Form.Control
                            type="number"
                            name="height"
                            value={formData.height}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                height: e.target.value,
                              })
                            }
                            isInvalid={!!errors.height}
                            placeholder="Enter height"
                          />
                          <span className="ms-2 align-self-center">FEET</span>{" "}
                          {/* Text outside the box */}
                        </div>
                        <Form.Control.Feedback type="invalid">
                          {errors.height}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={2} className="mb-4">
                      <Form.Group>
                        <Form.Label>Weight:</Form.Label>
                        <div className="d-flex">
                          <Form.Control
                            type="number"
                            name="weight"
                            value={formData.weight}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                weight: e.target.value,
                              })
                            }
                            isInvalid={!!errors.weight}
                            placeholder="Enter weight"
                          />
                          <span className="ms-2 align-self-center">kgs</span>{" "}
                          {/* Text outside the box */}
                        </div>
                        <Form.Control.Feedback type="invalid">
                          {errors.weight}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  <br />
                  <SurgeryTabs />
                  <br />
                  <br />
                  <Row>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Pain Score:</Form.Label>
                        <Form.Select
                          as="select"
                          name="painScale"
                          value={formData.painScale}
                          onChange={handleInputChange}
                        >
                          <option value="" disabled>
                            Select Pain Score
                          </option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                          <option value="7">7</option>
                          <option value="8">8</option>
                          <option value="9">9</option>
                          <option value="10">10</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  <br />
                  <Row>
                    <Col md={6}>
                      {/* Row 3: Vital Signs */}
                      <Form.Label>Vital Signs:</Form.Label>
                      <Row>
                        <Col md={3}>
                          <Form.Group>
                            <Form.Label>BP:</Form.Label>
                            <div className="d-flex align-items-center">
                              <Form.Control
                                type="text"
                                name="vitalSigns.BP"
                                value={formData.vitalSigns.BP}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    vitalSigns: {
                                      ...prev.vitalSigns,
                                      BP: e.target.value,
                                    },
                                  }))
                                }
                              />
                              <span className="ms-2">mm of hg</span>
                            </div>
                          </Form.Group>
                        </Col>
                        <Col md={3}>
                          <Form.Group>
                            <Form.Label>Pulse:</Form.Label>
                            <div className="d-flex align-items-center">
                              <Form.Control
                                type="text"
                                name="vitalSigns.Pulse"
                                value={formData.vitalSigns.Pulse}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    vitalSigns: {
                                      ...prev.vitalSigns,
                                      Pulse: e.target.value,
                                    },
                                  }))
                                }
                              />
                              <span className="ms-2">/Min</span>
                            </div>
                          </Form.Group>
                        </Col>
                        <Col md={3}>
                          <Form.Group>
                            <Form.Label>RR:</Form.Label>
                            <Form.Control
                              type="text"
                              name="vitalSigns.RR"
                              value={formData.vitalSigns.RR}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  vitalSigns: {
                                    ...prev.vitalSigns,
                                    RR: e.target.value,
                                  },
                                }))
                              }
                            />
                            <span className="ms-2">/Min</span>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Col>
                    <Col md={6}>
                      <Form.Label>Systematic Examination:</Form.Label>
                      <Row>
                        <Col md={2}>
                          <Form.Group>
                            <Form.Label>RS:</Form.Label>
                            <div className="d-flex align-items-center">
                              <Form.Control
                                type="text"
                                name="systematicExamination.RS"
                                value={formData.systematicExamination.RS}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    systematicExamination: {
                                      ...prev.systematicExamination,
                                      RS: e.target.value,
                                    },
                                  }))
                                }
                              />
                            </div>
                          </Form.Group>
                        </Col>
                        <Col md={2}>
                          <Form.Group>
                            <Form.Label>CVS:</Form.Label>
                            <Form.Control
                              type="text"
                              name="systematicExamination.CVS"
                              value={formData.systematicExamination.CVS}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  systematicExamination: {
                                    ...prev.systematicExamination,
                                    CVS: e.target.value,
                                  },
                                }))
                              }
                            />
                          </Form.Group>
                        </Col>
                        <Col md={2}>
                          <Form.Group>
                            <Form.Label>CNS:</Form.Label>
                            <Form.Control
                              type="text"
                              name="systematicExamination.CNS"
                              value={formData.systematicExamination.CNS}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  systematicExamination: {
                                    ...prev.systematicExamination,
                                    CNS: e.target.value,
                                  },
                                }))
                              }
                            />
                          </Form.Group>
                        </Col>
                        <Col md={2}>
                          <Form.Group>
                            <Form.Label>P/A:</Form.Label>
                            <Form.Control
                              type="text"
                              name="systematicExamination.PA"
                              value={formData.systematicExamination.PA}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  systematicExamination: {
                                    ...prev.systematicExamination,
                                    PA: e.target.value,
                                  },
                                }))
                              }
                            />
                          </Form.Group>
                        </Col>
                      </Row>
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
                              name="family_history"
                              value={formData.family_history}
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
                  <br />
                  <Row className="mb-3">
                    <Form.Label>Past Medical History:</Form.Label>
                    <Col>
                      <Form.Group>
                        <Form.Label>DM:</Form.Label>
                        <Form.Control
                          type="text"
                          name="past_history.dm"
                          value={formData.past_history.dm}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              past_history: {
                                ...prev.past_history,
                                dm: e.target.value,
                              },
                            }))
                          }
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
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              past_history: {
                                ...prev.past_history,
                                htn: e.target.value,
                              },
                            }))
                          }
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
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              past_history: {
                                ...prev.past_history,
                                brAsthma: e.target.value,
                              },
                            }))
                          }
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
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              past_history: {
                                ...prev.past_history,
                                thyroid: e.target.value,
                              },
                            }))
                          }
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
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              habits: {
                                ...prev.habits,
                                smoking: e.target.value,
                              },
                            }))
                          }
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
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              habits: {
                                ...prev.habits,
                                alcohol: e.target.value,
                              },
                            }))
                          }
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
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              habits: {
                                ...prev.habits,
                                tobacco: e.target.value,
                              },
                            }))
                          }
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
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              habits: {
                                ...prev.habits,
                                drugs: e.target.value,
                              },
                            }))
                          }
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
                  <br />
                  <Row>
                    <Col md={4}>
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
                            medications: [
                              ...formData.medications,
                              newMedication,
                            ],
                          });
                        }}
                      >
                        Add More
                      </Button>
                    </Col>
                  </Row>
                  <br />
                  <Row>
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
                  </Row>
                  <br />
                  <Row>
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
                  </Row>
                  <br />
                  <Row>
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
                  </Row>
                  <br />
                  <Row>
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
                  </Row>
                  <br />
                  <Row className="mb-3">
                    <Col>
                      <Form.Label>Ongoing Medicines:</Form.Label>
                      <Row>
                        <Col>
                          <Form.Check
                            inline
                            type="checkbox"
                            label="Clopidogrel"
                            name="ongoing_medicines.Clopidogrel"
                            checked={formData.ongoing_medicines.Clopidogrel}
                            onChange={handleCheckboxChange}
                          />
                        </Col>
                        <Col>
                          <Form.Check
                            inline
                            type="checkbox"
                            label="Aspirin"
                            name="ongoing_medicines.aspirin"
                            checked={formData.ongoing_medicines.aspirin}
                            onChange={handleCheckboxChange}
                          />
                        </Col>
                        <Col>
                          <Form.Check
                            inline
                            type="checkbox"
                            label="Warfarin"
                            name="ongoing_medicines.warfarin"
                            checked={formData.ongoing_medicines.warfarin}
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
                  </Row>
                  <br />
                  <Row>
                    <Col md={8}>
                      <Form.Label>Previous Investigation:</Form.Label>
                      <Row>
                        <Col>
                          <div className="d-flex flex-wrap">
                            {[
                              { label: "HB", name: "investigation.hb" },
                              { label: "BSL-R", name: "investigation.bslr" },
                              {
                                label: "Bleeding Time-BT",
                                name: "investigation.bleedingTimeBt",
                              },
                              {
                                label: "Clotting Time-BT",
                                name: "investigation.clottingTimeBt",
                              },
                              { label: "PT INR", name: "investigation.ptInr" },
                              { label: "HIV", name: "investigation.hiv" },
                              { label: "Hbsag", name: "investigation.hbsag" },
                              {
                                label: "SR.Creatinine",
                                name: "investigation.srCreatinine",
                              },
                              { label: "VIT B12", name: "investigation.vitB" },
                            ].map((item, index) => (
                              <div key={index} className="me-3">
                                <Form.Check
                                  inline
                                  type="checkbox"
                                  label={item.label}
                                  name={item.name}
                                  checked={
                                    formData.investigation[
                                      item.name.split(".")[1]
                                    ]
                                  }
                                  onChange={handleCheckboxChange}
                                  disabled={isDisabled} // Disable when viewing old records
                                />
                                {formData.investigation[
                                  item.name.split(".")[1]
                                ] && (
                                  <Form.Control
                                    as="textarea"
                                    placeholder={`Enter details for ${item.label}`}
                                    className="mb-2"
                                    style={{ width: "150px" }}
                                    value={
                                      formData.investigationComments?.[
                                        item.name.split(".")[1]
                                      ] || ""
                                    }
                                    onChange={(e) =>
                                      setFormData((prev) => ({
                                        ...prev,
                                        investigationComments: {
                                          ...prev.investigationComments,
                                          [item.name.split(".")[1]]:
                                            e.target.value,
                                        },
                                      }))
                                    }
                                    readOnly={isDisabled}
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        </Col>
                      </Row>
                    </Col>
                    <Col>
                      {/* Upload File Section */}
                      <div className="mt-3">
                        <input
                          type="file"
                          id="fileInput"
                          onChange={handleFileChange}
                          className="d-none"
                        />
                        <label htmlFor="fileInput" className="btn btn-primary">
                          Upload File
                        </label>
                        {selectedFile && (
                          <div className="mt-2 text-primary">
                            <strong>Selected File:</strong> {selectedFile.name}
                          </div>
                        )}
                      </div>
                    </Col>
                  </Row>
                  <br />
                  <Row>
                    <Col>
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
                    <Col>
                      <Form.Group>
                        <Form.Label>Known Case Of:</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="knowncaseof"
                          value={formData.knowncaseof}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <br />
                  <Row className="mb-3">
                    <Col>
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
                        </Col>
                        <Col>
                          <Form.Check
                            inline
                            type="checkbox"
                            label="Mano/BF"
                            name="advice.manoBf"
                            checked={formData.advice.manoBf}
                            onChange={handleCheckboxChange}
                          />
                        </Col>
                        <Col>
                          <Form.Check
                            inline
                            type="checkbox"
                            label="Colo/Gstro"
                            name="advice.coloGastro"
                            checked={formData.advice.coloGastro}
                            onChange={handleCheckboxChange}
                          />
                        </Col>
                        <Col>
                          <Form.Check
                            inline
                            type="checkbox"
                            label="MCDPA"
                            name="advice.mcdpa"
                            checked={formData.advice.mcdpa}
                            onChange={handleCheckboxChange}
                          />
                        </Col>
                        <Col>
                          <Form.Check
                            inline
                            type="checkbox"
                            label="Diet"
                            name="advice.diet"
                            checked={formData.advice.diet}
                            onChange={handleCheckboxChange}
                          />
                        </Col>
                        <Col>
                          <Form.Check
                            inline
                            type="checkbox"
                            label="B12"
                            name="advice.b"
                            checked={formData.advice.b}
                            onChange={handleCheckboxChange}
                          />
                        </Col>
                        <Col>
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
                  <br />
                  <Row>
                    <Col md={3}>
                      <Form.Group controlId="assistantsDoctorName">
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
                              ...patientHistory
                                .map(
                                  (option) =>
                                    option.assistantsDoctorconsultantName
                                )
                                .filter(Boolean),
                              ...assistantsDoctor
                                .map((doctor) => doctor.name)
                                .filter(Boolean),
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
                  <br />
                  <Button
                    className="mt-4"
                    onClick={() => handleHistoryClick("save")}
                  >
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
